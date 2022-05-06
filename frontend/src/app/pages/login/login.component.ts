import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, tap } from 'rxjs';
import { LOGIN_WITH_PASSWORD, VERIFY_EMAIL_RESPONSE } from 'src/app/interfaces/login.interface';
import { createCredential, loginWithPassword, signinWithPassword, verifyEmail } from '../../actions/login.action';
import { selectError, selectLoginWithPasswordError, selectLoginWithPasswordSuccess, selectSigninWithPasswordError, selectSigninWithPasswordSuccess, selectSuccess } from '../../selectors/login.selector';

export class CustomValidators {
  constructor() {
  }

  public static checkPassword(controlName: string, matchingControlName: string): any {
    return {
      validator: (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
          return;
        }

        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
        } else {
          matchingControl.setErrors(null);
        }

        return null;
      }
    }
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public hasBiomtrics!: boolean;
  public indexFormLogin: number = 0;
  public changeTexts = true;
  public unsubscribeVerifyEmail!: Subscription;
  public verifyError$!: Observable<HttpErrorResponse>;
  public verifySuccess$!: Observable<VERIFY_EMAIL_RESPONSE>;
  public loginWithPasswordError$!: Observable<HttpErrorResponse>;
  public loginWithPasswordSuccess$!: Observable<any>;
  public signinWithPasswordSuccess$!: Observable<any>
  public signinWithPasswordError$!: Observable<any>;
  public isCreate: boolean = true;
  public textTitle = 'Login com Biometria - Angular';
  public isPasswordSame!: boolean;

  public form: FormGroup = this.formBuilder.group({
    email: ['', [
      Validators.email,
      Validators.required,
      Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/)
    ]],
    confirm_password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/)
    ]]
  },
    CustomValidators.checkPassword('password', 'confirm_password')
  );

  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private store: Store,
    private detectChange: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Login com biometria | Angular');
  }

  ngOnDestroy(): void {
    if (this.unsubscribeVerifyEmail) {
      this.unsubscribeVerifyEmail.unsubscribe();
    }
  }

  public onSubmit(event: SubmitEvent, isCreate: boolean): void {
    event.preventDefault();
    if (this.form.valid) {
      const payload: LOGIN_WITH_PASSWORD = {
        email: this.cleanEmail(this.form.value.email),
        password: this.form.value.password
      }
      isCreate ? this.signup(payload) : this.signin(payload);
    }
  }

  public loginWithPassword(isCreate: boolean): void {
    const payload: LOGIN_WITH_PASSWORD = {
      email: this.cleanEmail(this.form.value.email),
      password: this.form.value.password
    }
    isCreate ? this.signup(payload) : this.signin(payload);
  }

  public onSend(event: boolean): void {
    this.hasBiomtrics = event;
  }

  public onTabChange(): void {
    switch (this.indexFormLogin) {
      case 0:
        this.textTitle = 'Login com Biometria - Angular';
        break;
      case 1:
        this.textTitle = 'Entrar com senha ou biometria';
        break;
    }
  }

  public loginWithBiometrics(): void {
    console.log('login com biometria',);
    this.store.dispatch(createCredential({ payload: this.cleanEmail(this.form.value.email) }));
  }

  public next(): void {
    this.store.dispatch(verifyEmail({ payload: { email: this.cleanEmail(this.form.value.email) } }));

    this.verifySuccess$ = this.store.select(selectSuccess).pipe(
      tap((response: VERIFY_EMAIL_RESPONSE) => {
        if (response && response.user) {
          this.form.valueChanges.subscribe(() => this.form.get('confirm_password')?.setErrors(null))
          this.isCreate = false;
          this.indexFormLogin = 1;
          this.detectChange.detectChanges();

        } else if (response && !response.user) {
          console.log('login com digital');
        }
      })
    )

    this.verifyError$ = this.store.select(selectError).pipe(
      tap((resp: HttpErrorResponse) => {
        if (resp) {
          this.isCreate = true;
          this.indexFormLogin = 1;
          this.detectChange.detectChanges();
        }
      })
    );
  }

  private signup(payload: LOGIN_WITH_PASSWORD): void {
    this.store.dispatch(loginWithPassword({ payload }));

    this.loginWithPasswordError$ = this.store.select(selectLoginWithPasswordError).pipe(
      tap((resp: HttpErrorResponse) => {
        if (resp) {
          this.form.get('password')?.setErrors({ userNotFound: true });
        }
      })
    );

    this.loginWithPasswordSuccess$ = this.store.select(selectLoginWithPasswordSuccess).pipe(
      tap((res: any) => {
        if (res && !res.error) {
          setTimeout(() => this.router.navigateByUrl('/dashboard'), 1000);
        }
      })
    );
  }

  private signin(payload: LOGIN_WITH_PASSWORD): void {
    this.store.dispatch(signinWithPassword({ payload }));

    this.signinWithPasswordError$ = this.store.select(selectSigninWithPasswordError).pipe(
      tap((resp: HttpErrorResponse) => {
        if (resp) {
          this.form.get('password')?.setErrors({ userNotFound: true });
        }
      })
    )

    this.signinWithPasswordSuccess$ = this.store.select(selectSigninWithPasswordSuccess).pipe(
      tap((resp: any) => {
        if (resp && !resp.error) {
          setTimeout(() => this.router.navigateByUrl('/dashboard'), 1000);
        }
      })
    )
  }

  private cleanEmail(text: string): string {
    return text.toString().toLowerCase().trim();
  }

}

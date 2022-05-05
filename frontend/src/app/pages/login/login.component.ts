import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Observable, Subscription, tap } from 'rxjs';
import { LOGIN_WITH_PASSWORD, VERIFY_EMAIL_RESPONSE } from 'src/app/interfaces/login.interface';
import { verifyEmail } from '../../actions/login.action';
import { selectError, selectSuccess } from '../../selectors/login.selector';

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
    ]]
  });

  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Login com biometria | Angular');
  }

  ngOnDestroy(): void {
    if (this.unsubscribeVerifyEmail) {
      this.unsubscribeVerifyEmail.unsubscribe();
    }
  }

  public onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.signup(this.form.value);
  }

  public loginWithPassword(): void {
    this.signup(this.form.value);
  }

  public onSend(event: boolean): void {
    this.hasBiomtrics = event;
  }

  public onTabChange(): void {
  }

  public loginWithBiometrics(): void {
    console.log('login com biometria', this.cleanEmail(this.form.value.email));
  }

  public next(): void {
    this.store.dispatch(verifyEmail({ payload: { email: this.cleanEmail(this.form.value.email) } }));

    this.verifySuccess$ = this.store.select(selectSuccess).pipe(
      tap((response: VERIFY_EMAIL_RESPONSE) => {
        if (response && response.user) {
          this.indexFormLogin = 1;
          console.log('login com senha');

        } else if (response && !response.user) {
          console.log('login com digital');
        }
      })
    )

    this.verifyError$ = this.store.select(selectError).pipe(
      tap((resp: HttpErrorResponse) => {
        if (resp) {
          this.form.get('email')?.setErrors({ notFound: true })
        }
      })
    );
  }

  private signup(payload: LOGIN_WITH_PASSWORD): void {
    console.log(payload);
  }

  private cleanEmail(text: string): string {
    return text.toString().toLowerCase().trim();
  }

}

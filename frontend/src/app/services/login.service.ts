import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, mergeMap, Observable, of, tap } from 'rxjs';
import { LOGIN_WITH_PASSWORD, VERIFY_EMAIL } from '../interfaces/login.interface';
import { AuthService } from './auth.service';
import { Constants } from './constants.service';
import { IndexdbService } from './indexedb.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private authorized$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(
    private http: HttpClient,
    private constants: Constants,
    private router: Router,
    private indexedbService: IndexdbService,
    private authService: AuthService
  ) {
  }

  public verifyEmail(payload: VERIFY_EMAIL): Observable<any> {
    const id = this.authService.toBase64(payload.email);
    return this.indexedbService.getById(id).pipe(
      map((user) => {
        if (!user) {
          return new HttpErrorResponse({ error: { message: 'Não cadastrado', error: true } });
        }
        return { user, message: 'E-mail encontrado', error: false }
      })
    )
  }

  public loginWithPassword(payload: LOGIN_WITH_PASSWORD): Observable<any> {
    return this.indexedbService.create({
      email: payload.email,
      id: this.authService.toBase64(payload.email),
      hasBiometrics: false,
      password: this.authService.b64encode(
        this.authService.b64decode(
          this.authService.toBase64(payload.password)
        )
      )
    }).pipe(
      map(user => {
        if (!user) {
          return new HttpErrorResponse({ error: { message: 'Não foi possível cadastrar', error: true } });
        }
        this.setUserOnStorageAfterLogin(user);
        return { user, message: "cadastro realizado com sucesso", error: false }
      })
    )
  }

  public signinWithPassword(payload: LOGIN_WITH_PASSWORD): Observable<any> {
    const id = this.authService.toBase64(payload.email);
    return this.indexedbService.getById(id).pipe(
      map((user) => {
        if (!user) {
          return new HttpErrorResponse({ error: { message: 'Não cadastrado', error: true } });
        }
        const password = this.authService.b64encode(
          this.authService.b64decode(
            this.authService.toBase64(payload.password)
          )
        )

        if (user.password !== password) {
          return new HttpErrorResponse({ error: { message: 'credencial inválida', error: true } });
        }

        this.setUserOnStorageAfterLogin(user);
        return { user, message: 'login realizado com sucesso', error: false }
      })
    )
  }

  public isAuthenticated(): Observable<boolean> {
    if (localStorage.getItem('sessionUser')) {
      this.authorized$.next(true);
    }
    return this.authorized$.asObservable();
  }

  public logout(): void {
    localStorage.removeItem('sessionUser');
    this.authorized$.next(false);
    this.preventSilentAccess().then();
    this.router.navigateByUrl('/');
  }

  public createCredential(payload: { email: string }): Observable<any> {
    return this.http.post(this.constants.get('createCredential'), payload);
  }

  public async createOptionsCredential(publicKey: CredentialCreationOptions): Promise<PublicKeyCredential> {
    const error = new HttpErrorResponse({ error: { message: 'Não foi possível cadastrar', error: true } });
    try {
      const credential = await navigator.credentials.create(this.authService.preFormatMakeCredReq(publicKey)) as PublicKeyCredential;
      if (!credential) {
        throw error;
      }
      return credential;
    } catch (e) {
      throw error;
    }
  }

  public verifyAttestation(payload: PublicKeyCredential): Observable<any> {
    return this.http.post(this.constants.get('verifyAttestaion'), this.publicKeyCredentialToJson(payload));
  }

  public getAssertation(assertation: any, { credential }: any): Observable<any> {
    return this.http.post(this.constants.get('gerAssertation'), {
      assertation: this.authService.preFormatAssertion(assertation),
      publicKey: credential.authrInfo
    }).pipe(tap(({ user }: any) => this.setUserOnStorageAfterLogin(user)));
  }

  public async getUserCredential(publicKey: CredentialCreationOptions): Promise<any> {
    const error = new HttpErrorResponse({ error: { message: 'Não foi possível cadastrar', error: true } });
    try {
      const credential = await navigator.credentials.get(this.authService.preFormatMakeCredReq(publicKey));
      if (!credential) {
        throw error;
      }
      return credential;
    } catch (e) {
      throw error;
    }
  }

  public publicKeyCredentialToJson(payload: any) {
    return {
      authenticatorAttachment: payload.authenticatorAttachment,
      id: payload.id,
      rawId: this.authService.b64encode(payload.rawId),
      response: {
        attestationObject: this.authService.b64encode(payload.response.attestationObject),
        clientDataJSON: this.authService.b64encode(payload.response.clientDataJSON),
      },
      type: payload.type
    }
  }

  public preventSilentAccess(): Promise<any> {
    return navigator.credentials.preventSilentAccess();
  }

  public updateOrCreateUser(credential: any, email: any): Observable<any> {
    const id = this.authService.toBase64(email);
    return this.indexedbService.getById(id).pipe(
      mergeMap((user: any) => {
        if (user) {
          const newUser = { ...user, credential, hasBiometrics: true };
          this.setUserOnStorageAfterLogin(newUser);
          return this.indexedbService.update(newUser);
        } else {
          const newUser = { id, email, password: null, credential, hasBiometrics: true };
          this.setUserOnStorageAfterLogin(newUser);
          return this.indexedbService.create(newUser);
        }
      })
    )
  }

  public signinWithBiometrics(payload: any): Observable<any> {
    console.log(payload);

    return of(payload)
  }

  private setUserOnStorageAfterLogin(user: any): void {
    localStorage.setItem('sessionUser', JSON.stringify(user));
  }
}

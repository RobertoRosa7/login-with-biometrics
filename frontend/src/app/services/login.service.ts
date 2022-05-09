import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
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
    this.router.navigateByUrl('/');
  }

  public createCredential(payload: { emaiL: string }): Observable<any> {
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

  public saveCredential(credential: any) {
  }

  public verifyAttestation(payload: PublicKeyCredential): Observable<any> {
    return this.http.post(this.constants.get('verifyAttestaion'), this.publicKeyCredentialToJson(payload));
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

  private setUserOnStorageAfterLogin(user: any): void {
    localStorage.setItem('sessionUser', JSON.stringify(user));
  }

  // public async getCredential(client: CLIENT) {
  //   const error = new HttpErrorResponse({ error: { message: 'Biometria inválida', error: true } });
  //   try {
  //     const credential = await navigator.credentials.get(this.preFormatMakeCredReq(client.public_key));
  //     if (!credential) {
  //       throw error;
  //     }
  //     return { credential, client };
  //   } catch (e) {
  //     throw error;
  //   }
  // }

  // public sendWebAuthnResponse(payload: any): Observable<any> {
  //   return this.localstorageService.getAsync('token').pipe(
  //     mergeMap(({ access_token }) => this.http.post(
  //       this.cons.get('sendWebAuthnResponse'),
  //       this.publicKeyCredentialToJson(payload),
  //       this.returnHeaderTokenClient(access_token)
  //     ))
  //   )
  // }

  // public signInWithBiometric(payload: any): Observable<any> {
  //   return this.http.post(this.cons.get('signInWithBiometric'), this.createAssertionResponse(payload)).pipe(
  //     tap((user: any) => {
  //       if (!user.error) {
  //         this.setUserOnStorageAfterLogin(user);
  //       }
  //     })
  //   )
  // }

  // private setAdminOnStorageAfterLogin(user: any): void {
  //   this.localstorageService.set('userDashboard', user.data);
  //   this.accessAuthorized$.next(true);
  // }
}

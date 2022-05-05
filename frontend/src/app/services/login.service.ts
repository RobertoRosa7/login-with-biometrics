import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LOGIN_WITH_PASSWORD, VERIFY_EMAIL, VERIFY_EMAIL_RESPONSE } from '../interfaces/login.interface';
import { Constants } from './constants.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private authorized$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(
    private http: HttpClient,
    private constants: Constants,
  ) {
  }

  public verifyEmail(payload: VERIFY_EMAIL): Observable<VERIFY_EMAIL_RESPONSE> {
    return this.http.post<VERIFY_EMAIL_RESPONSE>(this.constants.get('verifyEmail'), payload);
  }

  public loginWithPassword(payload: LOGIN_WITH_PASSWORD): Observable<any> {
    return this.http.post(this.constants.get('loginWithPassword'), payload);
  }

  // public createLogin(payload: CreateLogin): Observable<any> {
  //   return this.http.get(`${this.cons.get('signin')}`, this.setCredentialHeaders(payload)).pipe(
  //     tap((user: any) => {
  //       if (!user.error) {
  //         this.setUserOnStorageAfterLogin(user);
  //         // this.createSwPush(user);
  //       }
  //     })
  //   )
  // }

  // public validateTokenFromVerified(payload: ValidateTokenFromVerified): Observable<any> {
  //   return this.http.post(this.cons.get('validateTokenFromVerified'), payload);
  // }

  // public sendTokenToVerified(payload: SendTokenToVerified): Observable<any> {
  //   return this.http.post(this.cons.get('sendTokenToVerified'), payload).pipe(
  //     tap((res: any): void => this.setCipherOnLocalStorage(res)),
  //   );
  // }

  // public setStepToVerifiedCode(payload: any): void {
  //   this.removeFromLocalStorage('form');
  //   this.localstorageService.set('form', payload);
  // }

  // public getLocalCipher(): null | FormCipher {
  //   return this.localstorageService.get('form') ? JSON.parse(this.localstorageService.get('form') || '') : null;
  // }

  // public removeFromLocalStorage(item: string): void {
  //   this.localstorageService.remove(item);
  // }

  // public getToken(): string | null {
  //   return this.localstorageService.get('token') ? this.localstorageService.get('token') : null;
  // }

  // public isAccessAuthorized(): Observable<boolean> {
  //   return this.localstorageService.getAsync('userDashboard').pipe(
  //     map(userDash => this.utils.isNotEmptyObject(userDash))
  //   )
  // }

  // public isAuthenticated(): Observable<boolean> {
  //   if (this.getToken()) {
  //     this.isLogin$.next(true);
  //   }
  //   return this.isLogin$.asObservable();
  // }

  // public logoutDashboard(message = 'Você saiu da sua conta'): void {
  //   this.setCleanAfterLogout(message);
  // }

  // public logout(message = 'Você saiu da sua conta') {
  //   this.setCleanAfterLogout(message);
  // }

  // public logoutAsObservable(message = 'Você saiu da sua conta'): Observable<boolean> {
  //   this.setCleanAfterLogout(message);
  //   return this.isLogin$.asObservable();
  // }

  // public requestVenonToken(payload: RequestVenonToken): Observable<any> {
  //   return this.http.post(this.cons.get('requestVenonToken'), this.utils.createMarvelPayload('venon_token', payload))
  // }

  // public validateVenonToken(payload: any): Observable<any> {
  //   return this.http.get(`${this.cons.get('validateVenonToken')}/${payload}`).pipe(
  //     tap((res: any) => {
  //       if (!res.error) {
  //         this.localstorageService.ironManToken$.next(res);
  //       }
  //     })
  //   )
  // }

  // public updatePasswordUser(payload: any): Observable<any> {
  //   return this.http.post(this.cons.get('updatePasswordUser'), this.utils.createMarvelPayload('update_password_user', payload))
  // }

  // public credential(payload: CreateLogin): Observable<any> {
  //   return this.localstorageService.getAsync('token').pipe(
  //     mergeMap(({ access_token }) => this.http.get(
  //       `${this.cons.get('authCredential')}`,
  //       this.mergeTokenAndCredential(access_token, payload)
  //     ))
  //   )
  // }

  // public salonLogin(payload: any): Observable<any> {
  //   return this.http.get(`${this.cons.get('salonLogin')}`, this.setCredentialHeaders(payload)).pipe(
  //     tap((user: any) => {
  //       if (!user.error) {
  //         this.setAdminOnStorageAfterLogin(user)
  //       }
  //     })
  //   )
  // }

  // public requestChallenge(payload: REQUEST_CHALLENGE): Observable<any> {
  //   return this.localstorageService.getAsync('token').pipe(
  //     delay(1000),
  //     mergeMap(({ access_token }) => this.http.post(
  //       this.cons.get('requestChallenge'),
  //       payload,
  //       this.returnHeaderTokenClient(access_token)
  //     )),
  //   )
  // }

  // public async createCredential(publicKey: CredentialCreationOptions): Promise<any> {
  //   const error = new HttpErrorResponse({ error: { message: 'Não foi possível cadastrar', error: true } });
  //   try {
  //     const credential = await navigator.credentials.create(this.preFormatMakeCredReq(publicKey));
  //     if (!credential) {
  //       throw error;
  //     }
  //     return credential;
  //   } catch (e) {
  //     throw error;
  //   }
  // }

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

  // public preventSilentAccess(): Promise<any> {
  //   return navigator.credentials.preventSilentAccess();
  // }

  // public validateEmailOnLogin(payload: { email: string }): Observable<VALIDATE_EMAIL_RESPONSE> {
  //   return this.http.post<VALIDATE_EMAIL_RESPONSE>(this.cons.get('validateEmailOnLogin'), payload);
  // }

  // private setCipherOnLocalStorage(response: any): void {
  //   if (!response.error) {
  //     this.setStepToVerifiedCode({ create: { step: 2, cipher: response.cipher } });
  //   }
  // }

  // private createSwPush(user: any): void {
  //   if (!this.swPush.isEnabled) {
  //     from(this.swPush.requestSubscription({ serverPublicKey: environment.publicVapiKey })).pipe(
  //       mergeMap((push: PushSubscription) =>
  //         this.homeService.createSwPush({ client_id: user.data._id, push_notification: push }))).subscribe()
  //   }
  // }

  // private setAdminOnStorageAfterLogin(user: any): void {
  //   this.localstorageService.set('userDashboard', user.data);
  //   this.accessAuthorized$.next(true);
  // }

  // private setUserOnStorageAfterLogin(user: any): void {
  //   this.localstorageService.set('user', user.data);
  //   this.localstorageService.set('token', { access_token: user.data.token });
  //   this.localstorageService.set('sessionFinished', { sessionFinished: false });
  //   this.isLogin$.next(true);
  //   this.isUser$.next(user.data);
  // }

  // private setCleanAfterLogout(message?: any): void {
  //   this.localstorageService.remove('user');
  //   this.localstorageService.remove('token');
  //   this.localstorageService.remove('sessionFinished');
  //   this.localstorageService.remove('userDashboard');

  //   this.store.dispatch(clearLogin());
  //   this.store.dispatch(clearClient());
  //   this.store.dispatch(resetScheduling());

  //   this.contributorService.cleanCache();
  //   this.mainService.cleanCache();
  //   this.serviceService.cleanCache();
  //   this.clientService.cleanCache();
  //   this.preventSilentAccess().then();

  //   this.isLogin$.next(false);
  //   this.accessAuthorized$.next(false);

  //   this.snackbar.open(message, 'ok', { duration: 3000 });
  //   this.router.navigateByUrl('/home');
  // }
}

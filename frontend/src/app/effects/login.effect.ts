import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { createCredentialError, createCredentialSuccess, loginWithPasswordError, loginWithPasswordSuccess, signinWithBiometricsdSuccess, signinWithBiometricsError, signinWithPasswordError, signinWithPasswordSuccess, verifyEmailError, verifyEmailSuccess } from '../actions/login.action';
import { LoginService } from '../services/login.service';
import { LoginTypes } from '../types/login.type';

@Injectable({
  providedIn: 'root',
})
export class LoginEffect {
  public verifyEmail$ = createEffect(() =>
    this.action.pipe(ofType(LoginTypes.verifyEmail),
      mergeMap(({ payload }) => this.loginService.verifyEmail(payload).pipe(catchError((e) => of(e)))),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          return verifyEmailError({ payload });
        }
        return verifyEmailSuccess({ payload });
      }),
    ));

  public loginWithPassword$ = createEffect(() =>
    this.action.pipe(ofType(LoginTypes.loginWithPassword),
      mergeMap(({ payload }) => this.loginService.loginWithPassword(payload).pipe(catchError((e) => of(e)))),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          return loginWithPasswordError({ payload });
        }
        return loginWithPasswordSuccess({ payload });
      }),
    ));

  public signinWithPassword$ = createEffect(() =>
    this.action.pipe(ofType(LoginTypes.signinWithPassword),
      mergeMap(({ payload }) => this.loginService.signinWithPassword(payload).pipe(catchError((e) => of(e)))),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          return signinWithPasswordError({ payload });
        }
        return signinWithPasswordSuccess({ payload });
      }),
    ));

  public signinWithBiometrics$ = createEffect(() => this.action.pipe(
    ofType(LoginTypes.signinWithBiometrics),
    mergeMap(({ payload }: any) => this.loginService.createCredential({ email: payload.email }).pipe(
      exhaustMap(({ publicKey }) => from(this.loginService.getUserCredential({ publicKey })).pipe(
        switchMap((assertation) => this.loginService.getAssertation(assertation, payload).pipe(
          catchError(e => of(e))
        )),
        catchError(e => of(e))
      )),
      catchError(e => of(e))
    )),
    map((payload: any) => {
      if (payload instanceof HttpErrorResponse) {
        return signinWithBiometricsError({ payload });
      }
      return signinWithBiometricsdSuccess({ payload });
    })
  ))

  public createCredential$ = createEffect(() =>
    this.action.pipe(ofType(LoginTypes.createCredential),
      mergeMap(({ payload }: any) => this.loginService.createCredential(payload).pipe(
        exhaustMap(({ publicKey }: any) => from(this.loginService.createOptionsCredential({ publicKey })).pipe(
          switchMap((publicKeyCredential: PublicKeyCredential) => this.loginService.verifyAttestation(publicKeyCredential).pipe(
            mergeMap(({ result }) => this.loginService.updateOrCreateUser(result, payload.email)),
            catchError((e) => of(e))
          )),
          catchError(e => of(e)))
        ),
        catchError((e) => of(e)))
      ),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          return createCredentialError({ payload });
        }
        return createCredentialSuccess({ payload: { message: 'Digital criada com success', error: false } });
      }),
    ));


  constructor(
    private action: Actions,
    private loginService: LoginService,
  ) { }
}

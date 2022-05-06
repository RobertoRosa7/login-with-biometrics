import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { createCredentialSuccess, loginWithPasswordError, loginWithPasswordSuccess, signinWithPasswordError, signinWithPasswordSuccess, verifyEmailError, verifyEmailSuccess } from '../actions/login.action';
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

  public createCredential$ = createEffect(() =>
    this.action.pipe(ofType(LoginTypes.createCredential),
      mergeMap(({ payload }) => this.loginService.createCredential(payload).pipe(catchError((e) => of(e)))),
      exhaustMap((payload: any) => this.loginService.createOptionsCredential(payload)),
      map((payload) => {
        this.loginService.saveCredential(payload);

        return createCredentialSuccess({ payload });
      }),
    ));


  constructor(
    private action: Actions,
    private loginService: LoginService,
  ) { }
}

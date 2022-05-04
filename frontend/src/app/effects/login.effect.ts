/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { checkHealthResponse } from '../actions/login.action';
import { LoginService } from '../services/login.service';
import { LoginTypes } from '../types/login.type';

@Injectable({
  providedIn: 'root',
})
export class LoginEffect {
  public checkHealth$ = createEffect(() =>
    this.action.pipe(ofType(LoginTypes.checkHealth),
      mergeMap(() => this.loginService.checkHealth().pipe(catchError((e) => of(e)))),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          return checkHealthResponse({ payload });
        }
        return checkHealthResponse({ payload });
      }),
    ));

  constructor(
    private action: Actions,
    private loginService: LoginService,
  ) { }
}

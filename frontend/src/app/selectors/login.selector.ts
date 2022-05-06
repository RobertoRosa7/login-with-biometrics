
import { HttpErrorResponse } from '@angular/common/http';
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';
import { LOGIN, VERIFY_EMAIL_RESPONSE } from '../interfaces/login.interface'

const getSuccess = (states: LOGIN): VERIFY_EMAIL_RESPONSE | null => states.response;
const getError = (states: LOGIN): HttpErrorResponse | null => states.error;
const getLoginWithPasswordSuccess = (states: LOGIN) => states.loginWithPasswordSuccess;
const getLoginWithPasswordError = (states: LOGIN) => states.loginWithPasswordError;
const getSigninWithPasswordSuccess = (states: LOGIN) => states.signinWithPasswordSuccess;
const getSigninWithPasswordError = (states: LOGIN) => states.signinWithPasswordError;

const login: MemoizedSelector<object, LOGIN> = createFeatureSelector<LOGIN>('login');

export const selectError: MemoizedSelector<object, any> = createSelector(login, getError);
export const selectSuccess: MemoizedSelector<object, any> = createSelector(login, getSuccess);
export const selectLoginWithPasswordError: MemoizedSelector<object, any> = createSelector(login, getLoginWithPasswordError);
export const selectLoginWithPasswordSuccess: MemoizedSelector<object, any> = createSelector(login, getLoginWithPasswordSuccess);
export const selectSigninWithPasswordError: MemoizedSelector<object, any> = createSelector(login, getSigninWithPasswordError);
export const selectSigninWithPasswordSuccess: MemoizedSelector<object, any> = createSelector(login, getSigninWithPasswordSuccess);
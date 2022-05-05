
import { HttpErrorResponse } from '@angular/common/http';
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';
import { LOGIN, VERIFY_EMAIL_RESPONSE } from '../interfaces/login.interface'

const getSuccess = (states: LOGIN): VERIFY_EMAIL_RESPONSE | null => states.response;
const getError = (states: LOGIN): HttpErrorResponse | null => states.error;

const login: MemoizedSelector<object, LOGIN> = createFeatureSelector<LOGIN>('login');

export const selectError: MemoizedSelector<object, any> = createSelector(login, getError);
export const selectSuccess: MemoizedSelector<object, any> = createSelector(login, getSuccess);

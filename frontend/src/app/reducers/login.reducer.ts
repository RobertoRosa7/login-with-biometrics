/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { createReducer, on } from '@ngrx/store';
import { checkHealth, loginWithPasswordError, loginWithPasswordSuccess, verifyEmailError, verifyEmailSuccess, } from '../actions/login.action';
import { LOGIN } from '../interfaces/login.interface';

const INITIAL_STATES: LOGIN = {
  checkHealth: false,
  response: null,
  error: null,
  loginWithPasswordSuccess: null,
  loginWithPasswordError: null
};

const reducer = createReducer(
  INITIAL_STATES,
  on(verifyEmailSuccess, (states, { payload }) => ({ ...states, response: payload })),
  on(verifyEmailError, (states, { payload }) => ({ ...states, error: payload })),
  on(loginWithPasswordError, (states, { payload }) => ({ ...states, loginWithPasswordError: payload })),
  on(loginWithPasswordSuccess, (states, { payload }) => ({ ...states, loginWithPasswordSuccess: payload })),
);

export const loginReducer = (state: any, action: any) => reducer(state, action);

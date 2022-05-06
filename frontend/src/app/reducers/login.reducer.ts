import { createReducer, on } from '@ngrx/store';
import { loginWithPasswordError, loginWithPasswordSuccess, signinWithPasswordError, signinWithPasswordSuccess, verifyEmailError, verifyEmailSuccess } from '../actions/login.action';
import { LOGIN } from '../interfaces/login.interface';

const INITIAL_STATES: LOGIN = {
  checkHealth: false,
  response: null,
  error: null,
  loginWithPasswordSuccess: null,
  loginWithPasswordError: null,

  signinWithPasswordSuccess: null,
  signinWithPasswordError: null
};

const reducer = createReducer(
  INITIAL_STATES,
  on(verifyEmailSuccess, (states, { payload }) => ({ ...states, response: payload })),
  on(verifyEmailError, (states, { payload }) => ({ ...states, error: payload })),

  on(loginWithPasswordError, (states, { payload }) => ({ ...states, loginWithPasswordError: payload })),
  on(loginWithPasswordSuccess, (states, { payload }) => ({ ...states, loginWithPasswordSuccess: payload })),

  on(signinWithPasswordError, (states, { payload }) => ({ ...states, signinWithPasswordError: payload })),
  on(signinWithPasswordSuccess, (states, { payload }) => ({ ...states, signinWithPasswordSuccess: payload })),
);

export const loginReducer = (state: any, action: any) => reducer(state, action);

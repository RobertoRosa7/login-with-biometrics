import { createReducer, on } from '@ngrx/store';
import { createCredentialError, createCredentialSuccess, loginWithPasswordError, loginWithPasswordSuccess, signinWithBiometricsdSuccess, signinWithBiometricsError, signinWithPasswordError, signinWithPasswordSuccess, verifyEmailError, verifyEmailSuccess } from '../actions/login.action';
import { LOGIN } from '../interfaces/login.interface';

const INITIAL_STATES: LOGIN = {
  checkHealth: false,
  response: null,
  error: null,

  loginWithPasswordSuccess: null,
  loginWithPasswordError: null,

  signinWithPasswordSuccess: null,
  signinWithPasswordError: null,

  createCredentialSuccess: null,
  createCredentialError: null,

  signinWithBiometricsError: null,
  signinWithBiometricsSuccess: null
};

const reducer = createReducer(
  INITIAL_STATES,
  on(verifyEmailSuccess, (states, { payload }) =>
    setPayload('response', states, payload)),
  on(verifyEmailError, (states, { payload }) =>
    setPayload('error', states, payload)),
  on(loginWithPasswordError, (states, { payload }) =>
    setPayload('loginWithPasswordError', states, payload)),
  on(loginWithPasswordSuccess, (states, { payload }) =>
    setPayload('loginWithPasswordSuccess', states, payload)),
  on(signinWithPasswordError, (states, { payload }) =>
    setPayload('signinWithPasswordError', states, payload)),
  on(signinWithPasswordSuccess, (states, { payload }) =>
    setPayload('signinWithPasswordSuccess', states, payload)),
  on(createCredentialSuccess, (states, { payload }) =>
    setPayload('createCredentialSuccess', states, payload)),
  on(createCredentialError, (states, { payload }) =>
    setPayload('createCredentialError', states, payload)),
  on(signinWithBiometricsError, (states, { payload }) =>
    setPayload('signinWithBiometricsError', states, payload)),
  on(signinWithBiometricsdSuccess, (states, { payload }) =>
    setPayload('signinWithBiometricsSuccess', states, payload)),
);

export const loginReducer = (state: any, action: any) => reducer(state, action);

const setPayload = (type: string, states: LOGIN, payload: any) => ({ ...states, [type]: payload })
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { createReducer, on } from '@ngrx/store';
import { checkHealth, verifyEmailError, verifyEmailSuccess, } from '../actions/login.action';
import { LOGIN } from '../interfaces/login.interface';

const INITIAL_STATES: LOGIN = {
  checkHealth: false,
  response: null,
  error: null
};

const reducer = createReducer(
  INITIAL_STATES,
  on(checkHealth, (states) => ({ ...states, checkHealth: true })),
  on(verifyEmailSuccess, (states, { payload }) => ({ ...states, response: payload })),
  on(verifyEmailError, (states, { payload }) => ({ ...states, error: payload }))
);

export const loginReducer = (state: any, action: any) => reducer(state, action);

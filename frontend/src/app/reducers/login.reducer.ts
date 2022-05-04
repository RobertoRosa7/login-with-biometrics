/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { createReducer, on } from '@ngrx/store';
import { LOGIN } from '../interfaces/login.interface';
import { checkHealth } from '../actions/login.action';

const INITIAL_STATES: LOGIN = {
  checkHealth: false
};

const reducer = createReducer(
  INITIAL_STATES,
  on(checkHealth, (states) => ({
    ...states,
    checkHealth: true
  })),
);

export const loginReducer = (state: any, action: any) => reducer(state, action);

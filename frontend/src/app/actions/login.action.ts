import { createAction, props } from '@ngrx/store';
import { LoginTypes } from '../types/login.type';

export const checkHealth = createAction(
  LoginTypes.checkHealth
);
export const checkHealthResponse = createAction(
  LoginTypes.checkHealthResponse, props<{ payload: any }>()
);
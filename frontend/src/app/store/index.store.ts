import { ActionReducerMap } from '@ngrx/store';
import { loginReducer } from '../reducers/login.reducer';


export const Store: ActionReducerMap<any> = {
  login: loginReducer,
};

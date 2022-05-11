import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { LOGIN_WITH_PASSWORD, VERIFY_EMAIL, VERIFY_EMAIL_RESPONSE } from '../interfaces/login.interface';
import { LoginTypes } from '../types/login.type';

export const checkHealth = createAction(
  LoginTypes.checkHealth
);

export const checkHealthResponse = createAction(
  LoginTypes.checkHealthResponse, props<{ payload: any }>()
);

export const verifyEmail = createAction(
  LoginTypes.verifyEmail, props<{ payload: VERIFY_EMAIL }>()
);

export const verifyEmailSuccess = createAction(
  LoginTypes.verifyEmailSuccess, props<{ payload: VERIFY_EMAIL_RESPONSE }>()
);

export const verifyEmailError = createAction(
  LoginTypes.verifyEmailError, props<{ payload: HttpErrorResponse }>()
);

export const loginWithPassword = createAction(
  LoginTypes.loginWithPassword, props<{ payload: LOGIN_WITH_PASSWORD }>()
);

export const loginWithPasswordSuccess = createAction(
  LoginTypes.loginWithPasswordSuccess, props<{ payload: any }>()
);

export const loginWithPasswordError = createAction(
  LoginTypes.loginWithPasswordError, props<{ payload: any }>()
);

export const signinWithPassword = createAction(
  LoginTypes.signinWithPassword, props<{ payload: any }>()
);

export const signinWithPasswordSuccess = createAction(
  LoginTypes.signinWithPasswordSuccess, props<{ payload: any }>()
);

export const signinWithPasswordError = createAction(
  LoginTypes.signinWithPasswordError, props<{ payload: any }>()
);

export const createCredential = createAction(
  LoginTypes.createCredential, props<{ payload: any }>()
);

export const createCredentialSuccess = createAction(
  LoginTypes.createCredentialSuccess, props<{ payload: any }>()
)

export const createCredentialError = createAction(
  LoginTypes.createCredentialError, props<{ payload: any }>()
)

export const signinWithBiometrics = createAction(
  LoginTypes.signinWithBiometrics, props<{ payload: any }>()
)

export const signinWithBiometricsdSuccess = createAction(
  LoginTypes.signinWithBiometricsdSuccess, props<{ payload: any }>()
)

export const signinWithBiometricsError = createAction(
  LoginTypes.signinWithBiometricsError, props<{ payload: any }>()
)
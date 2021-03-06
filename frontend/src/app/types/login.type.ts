export enum LoginTypes {
  checkHealth = '@login:CHECK_HEALTH',
  checkHealthResponse = '@login:CHECK_HEALTHE_RESPONSE',

  verifyEmail = "@login:VERIFY_EMAIL",
  verifyEmailSuccess = "@login:VERIFY_EMAIL_SUCCESS",
  verifyEmailError = "@login:VERIFY_EMAIL_ERROR",

  loginWithPassword = '@login:LOGIN_WITH_PASSWORD',
  loginWithPasswordSuccess = '@login:LOGIN_WITH_PASSWORD_SUCCESS',
  loginWithPasswordError = '@login:LOGIN_WITH_PASSWORD_ERROR',

  signinWithPassword = '@login:SIGNIN_WITH_PASSWORD',
  signinWithPasswordSuccess = '@login:SIGNIN_WITH_PASSWORD_SUCCESS',
  signinWithPasswordError = '@login:SIGNIN_WITH_PASSWORD_ERROR',

  signinWithBiometrics = '@login:SIGNIN_BIOMETRICS_PASSWORD',
  signinWithBiometricsdSuccess = '@login:SIGNIN_BIOMETRICS_PASSWORD_SUCCESS',
  signinWithBiometricsError = '@login:SIGNIN_BIOMETRICS_PASSWORD_ERROR',

  createCredential = 'login:CREATE_CREDENTIAL',
  createCredentialSuccess = 'login:CREATE_CREDENTIAL_SUCCESS',
  createCredentialError = 'login:CREATE_CREDENTIAL_ERROR',

}

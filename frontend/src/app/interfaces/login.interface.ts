import { HttpErrorResponse } from "@angular/common/http";

export interface LOGIN {
  checkHealth: boolean;
  response: VERIFY_EMAIL_RESPONSE | null;
  error: HttpErrorResponse | null
  loginWithPasswordSuccess: any | null;
  loginWithPasswordError: any | null;
  signinWithPasswordSuccess: any | null;
  signinWithPasswordError: any | null;
  createCredentialSuccess: any | null;
  createCredentialError: any | null;
  signinWithBiometricsError: any | null;
  signinWithBiometricsSuccess: any | null;
}
export interface VERIFY_EMAIL {
  email: string
}
export interface VERIFY_EMAIL_RESPONSE {
  message: string;
  error: boolean;
  user: any | null;
  publicKey?: any | null;
  credential?: any | null;
}

export interface LOGIN_WITH_PASSWORD {
  email: string;
  password: string;
}
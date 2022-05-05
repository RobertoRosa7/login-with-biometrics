import { HttpErrorResponse } from "@angular/common/http";

export interface LOGIN {
  checkHealth: boolean;
  response: VERIFY_EMAIL_RESPONSE | null;
  error: HttpErrorResponse | null
  loginWithPasswordSuccess: any | null;
  loginWithPasswordError: any | null;
}
export interface VERIFY_EMAIL {
  email: string
}
export interface VERIFY_EMAIL_RESPONSE {
  message: string;
  error: boolean;
  user: any | null;
  publicKey: any | null;
}

export interface LOGIN_WITH_PASSWORD {
  email: string;
  password: string;
}
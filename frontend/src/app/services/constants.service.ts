import { environment } from '../../environments/environment';

export class Constants {
  public readonly paths: any = {
    checkHealth: '/',
    signup: '/login/signup',
    signin: '/login/signin',
    verifyEmail: '/login/verify-email',
    requestChallenge: '/login/request-challenge',
    loginWithPassword: '/login/login-with-password',
    validateEmailOnLogin: '/login/validate-email-on-login',
    signInWithBiometric: '/login/sigin-with-biometric',
  };

  private readonly host: string = environment.api;

  constructor() { }

  public get(key: string, host?: string): string {
    host = host ? host : this.host;
    const path = host + this.paths[key];
    if (path === undefined) {
      throw new Error('Couldnt find ' + key + ' in paths');
    }
    return path;
  }
}

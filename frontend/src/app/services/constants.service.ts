import { environment } from '../../environments/environment';

export class Constants {
  public readonly paths: any = {
    checkHealth: '/',
    signup: '/login/signup',
    signin: '/login/signin',
    verifyEmail: '/login/verify-email',
    createCredential: '/login/request-challenge',
    verifyAttestaion: '/login/verify-attestaion',
    gerAssertation: '/login/verify-assertation'
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

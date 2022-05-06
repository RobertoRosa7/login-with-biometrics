
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
  ) {
  }

  public b64decode(text: string): Uint8Array {
    return Uint8Array.from(window.atob(text), c => c.charCodeAt(0));
  }

  public b64encode(input: ArrayBuffer): string {
    const randomChallengeBuffer: any = new Uint8Array(input);
    return window.btoa(String.fromCharCode.apply(null, randomChallengeBuffer));
  }

  public toBase64(text: string): string {
    return window.btoa(text);
  }

  public fromBase64(text: string): string {
    text = atob(text);
    const length = text.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = text.charCodeAt(i);
    }

    const decoder = new TextDecoder(); // default is utf-8
    return decoder.decode(bytes)
  }
}
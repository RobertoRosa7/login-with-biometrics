
import { Injectable } from '@angular/core';
import * as cbor from 'cbor';

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

  public createPublicKey(payload: { id: string, displayName: string, username: string }) {
    return {
      challenge: this.randomBase64URLBuffer(32),
      rp: {
        id: 'localhost',
        name: "Fido corporation"
      },
      user: {
        id: payload.id,
        displayName: payload.displayName,
        name: payload.username
      },
      userVerification: "discouraged",
      attestation: "direct",
      timme: 60000,
      pubKeyCredParams: [
        {
          alg: -7,
          type: "public-key"
        },
        {
          alg: -257,
          type: "public-key"
        },
      ]
    }
  }

  public randomBase64URLBuffer(len = 32): string {
    return this.b64encode(window.crypto.getRandomValues(new Uint32Array(len)))
  }

  public preFormatMakeCredReq(payload: any): CredentialCreationOptions {
    return {
      publicKey: {
        ...payload,
        challenge: this.b64decode(payload.challenge),
        user: { ...payload.user, id: this.b64decode(payload.user.id) }
      }
    }
  }

  public verifyAttestation(payload: any) {
  }
}
const crypto = require('crypto');
const base64url = require('base64url');
const cbor = require('cbor');
const { Certificate } = require('@fidm/x509');
const iso_3166_1 = require('iso-3166-1');
const NodeRSA = require('node-rsa');
const COSEKEYS = {
  'kty': 1,
  'alg': 3,
  'crv': -1,
  'x': -2,
  'y': -3,
  'n': -1,
  'e': -2
}

const COSEKTY = {
  'OKP': 1,
  'EC2': 2,
  'RSA': 3
}

const COSERSASCHEME = {
  '-3': 'pss-sha256',
  '-39': 'pss-sha512',
  '-38': 'pss-sha384',
  '-65535': 'pkcs1-sha1',
  '-257': 'pkcs1-sha256',
  '-258': 'pkcs1-sha384',
  '-259': 'pkcs1-sha512'
}

const COSECRV = {
  '1': 'p256',
  '2': 'p384',
  '3': 'p521'
}

const COSEALGHASH = {
  '-257': 'sha256',
  '-258': 'sha384',
  '-259': 'sha512',
  '-65535': 'sha1',
  '-39': 'sha512',
  '-38': 'sha384',
  '-37': 'sha256',
  '-260': 'sha256',
  '-261': 'sha512',
  '-7': 'sha256',
  '-36': 'sha512'
}

const randomBase64URLBuffer = (len = 32) => {
  const text = crypto.randomBytes(len);
  const encodebuff = new Buffer.from(text.toString(), 'utf-8');
  return encodebuff.toString('base64');
}

const verifySignature = (signature, data, publicKey) => {
  return crypto.createVerify('SHA256').update(data).verify(publicKey, signature);
}

const generateServerMakeRequest = (payload) => {
  return {
    challenge: randomBase64URLBuffer(32),
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

const parseMakeCredAuthData = (buffer) => {
  const rpIdHash = buffer.slice(0, 32);
  buffer = buffer.slice(32);
  const flagsBuf = buffer.slice(0, 1);
  buffer = buffer.slice(1);
  const flags = flagsBuf[0];
  const counterBuf = buffer.slice(0, 4);
  buffer = buffer.slice(4);
  const counter = counterBuf.readUInt32BE(0);
  const aaguid = buffer.slice(0, 16);
  buffer = buffer.slice(16);
  const credIDLenBuf = buffer.slice(0, 2);
  buffer = buffer.slice(2);
  const credIDLen = credIDLenBuf.readUInt16BE(0);
  const credID = buffer.slice(0, credIDLen);
  buffer = buffer.slice(credIDLen);
  const COSEPublicKey = buffer;
  return { rpIdHash, flagsBuf, flags, counter, counterBuf, aaguid, credID, COSEPublicKey };
}

const hash = (data) => {
  return crypto.createHash('SHA256').update(data).digest();
}

const COSEECDHAtoPKCS = (COSEPublicKey) => {
  const coseStruct = cbor.decodeAllSync(COSEPublicKey)[0];
  return Buffer.concat([Buffer.from([0x04]), coseStruct.get(-2), coseStruct.get(-3)]);
}

const ASN1toPEM = (pkBuffer) => {
  if (!Buffer.isBuffer(pkBuffer))
    throw new Error("ASN1toPEM: pkBuffer must be Buffer.")

  let type;
  if (pkBuffer.length == 65 && pkBuffer[0] == 0x04) {

    pkBuffer = Buffer.concat([
      new Buffer.from("3059301306072a8648ce3d020106082a8648ce3d030107034200", "hex"),
      pkBuffer
    ]);

    type = 'PUBLIC KEY';
  } else {
    type = 'CERTIFICATE';
  }

  let b64cert = pkBuffer.toString('base64');

  let PEMKey = '';
  for (let i = 0; i < Math.ceil(b64cert.length / 64); i++) {
    let start = 64 * i;

    PEMKey += b64cert.substr(start, 64) + '\n';
  }

  PEMKey = `-----BEGIN ${type}-----\n` + PEMKey + `-----END ${type}-----\n`;

  return PEMKey;
}

const verifyAuthenticatorAttestationResponse = (webauthnResponse, enableLogging = false) => {
  const attestationBuffer = base64url.toBuffer(webauthnResponse.attestationObject);
  const ctapMakeCredResp = cbor.decodeAllSync(attestationBuffer)[0];

  if (enableLogging) console.log('CTAP_RESPONSE', ctapMakeCredResp)

  const authrDataStruct = parseMakeCredAuthData(ctapMakeCredResp.authData);
  if (enableLogging) console.log('AUTHR_DATA_STRUCT', authrDataStruct)

  const response = { 'verified': false };
  if (ctapMakeCredResp.fmt === 'fido-u2f') {
    if (!(authrDataStruct.flags & 0x01)) // U2F_USER_PRESENTED
      throw new Error('User was NOT presented durring authentication!');

    const clientDataHash = hash(base64url.toBuffer(webauthnResponse.clientDataJSON))
    const reservedByte = Buffer.from([0x00]);
    const publicKey = COSEECDHAtoPKCS(authrDataStruct.COSEPublicKey)
    const signatureBase = Buffer.concat([reservedByte, authrDataStruct.rpIdHash, clientDataHash, authrDataStruct.credID, publicKey]);

    const PEMCertificate = ASN1toPEM(ctapMakeCredResp.attStmt.x5c[0]);
    const signature = ctapMakeCredResp.attStmt.sig;

    response.verified = verifySignature(signature, signatureBase, PEMCertificate)

    if (response.verified) {
      response.authrInfo = {
        fmt: 'fido-u2f',
        publicKey: base64url.encode(publicKey),
        counter: authrDataStruct.counter,
        credID: base64url.encode(authrDataStruct.credID)
      }
    }

  } else if (ctapMakeCredResp.fmt === 'packed' && ctapMakeCredResp.attStmt.hasOwnProperty('x5c')) {
    if (!(authrDataStruct.flags & 0x01)) // U2F_USER_PRESENTED
      throw new Error('User was NOT presented durring authentication!');

    const clientDataHash = hash(base64url.toBuffer(webauthnResponse.clientDataJSON))
    const publicKey = COSEECDHAtoPKCS(authrDataStruct.COSEPublicKey)
    const signatureBase = Buffer.concat([ctapMakeCredResp.authData, clientDataHash]);

    const PEMCertificate = ASN1toPEM(ctapMakeCredResp.attStmt.x5c[0]);
    const signature = ctapMakeCredResp.attStmt.sig;

    const pem = Certificate.fromPEM(PEMCertificate);

    // Getting requirements from https://www.w3.org/TR/webauthn/#packed-attestation
    const aaguid_ext = pem.getExtension('1.3.6.1.4.1.45724.1.1.4')

    response.verified = verifySignature(signature, signatureBase, PEMCertificate) &&
      pem.version == 3 &&
      typeof iso_3166_1.whereAlpha2(pem.subject.countryName) !== 'undefined' &&
      pem.subject.organizationName &&
      pem.subject.organizationalUnitName === 'Authenticator Attestation' &&
      pem.subject.commonName &&
      !pem.extensions.isCA &&
      (aaguid_ext != null ?
        (authrDataStruct.hasOwnProperty('aaguid') ?
          !aaguid_ext.critical && aaguid_ext.value.slice(2).equals(authrDataStruct.aaguid) : false)
        : true);
    if (response.verified) {
      response.authrInfo = {
        fmt: 'fido-u2f',
        publicKey: base64url.encode(publicKey),
        counter: authrDataStruct.counter,
        credID: base64url.encode(authrDataStruct.credID)
      }
    }

    // Self signed
  } else if (ctapMakeCredResp.fmt === 'packed') {
    if (!(authrDataStruct.flags & 0x01)) // U2F_USER_PRESENTED
      throw new Error('User was NOT presented durring authentication!');

    let pubKeyCose = cbor.decodeAllSync(authrDataStruct.COSEPublicKey)[0];

    if (pubKeyCose.get(COSEKEYS.kty) === COSEKTY.RSA) {
      const clientDataHash = hash(base64url.toBuffer(webauthnResponse.clientDataJSON));
      const signatureBase = Buffer.concat([ctapMakeCredResp.authData, clientDataHash]);
      const signatureBuffer = ctapMakeCredResp.attStmt.sig
      const signingScheme = COSERSASCHEME[pubKeyCose.get(COSEKEYS.alg)];
      const key = new NodeRSA(undefined, { signingScheme });

      key.importKey({ n: pubKeyCose.get(COSEKEYS.n), e: 65537, }, 'components-public');
      response.verified = key.verify(signatureBase, signatureBuffer);

      if (response.verified) {
        response.authrInfo = {
          fmt: ctapMakeCredResp.fmt,
          publicKey: key.exportKey('pkcs8-public-pem'),
          counter: authrDataStruct.counter,
          credID: base64url.encode(authrDataStruct.credID)
        }
      }
    }
  } else if (ctapMakeCredResp.fmt === 'android-safetynet') {
    if (enableLogging) {
      console.log("Android safetynet request\n")
      console.log(ctapMakeCredResp)
    }

    const authrDataStruct = parseMakeCredAuthData(ctapMakeCredResp.authData);
    if (enableLogging) {
      console.log('AUTH_DATA', authrDataStruct)
      console.log('CLIENT_DATA_JSON ', base64url.decode(webauthnResponse.clientDataJSON))
    }

    const publicKey = COSEECDHAtoPKCS(authrDataStruct.COSEPublicKey)

    let [header, payload, signature] = ctapMakeCredResp.attStmt.response.toString('utf8').split('.')
    const signatureBase = Buffer.from([header, payload].join('.'))

    header = JSON.parse(base64url.decode(header))
    payload = JSON.parse(base64url.decode(payload))
    signature = base64url.toBuffer(signature)

    if (enableLogging) {
      console.log('JWS HEADER', header)
      console.log('JWS PAYLOAD', payload)
      console.log('JWS SIGNATURE', signature)
    }

    const PEMCertificate = ASN1toPEM(Buffer.from(header.x5c[0], 'base64'))

    const pem = Certificate.fromPEM(PEMCertificate)

    if (enableLogging) console.log('PEM', pem)

    response.verified = verifySignature(signature, signatureBase, PEMCertificate) &&
      pem.version == 3 &&
      pem.subject.commonName === 'attest.android.com'

    if (response.verified) {
      response.authrInfo = {
        fmt: 'fido-u2f',
        publicKey: base64url.encode(publicKey),
        counter: authrDataStruct.counter,
        credID: base64url.encode(authrDataStruct.credID)
      }
    }
    if (enableLogging) console.log('RESPONSE', response)
  } else {
    throw new Error(`Unsupported attestation format: ${ctapMakeCredResp.fmt}`);
  }

  return response;
}

const verifyAuthenticatorAssertionResponse = (webauthnResponse, authr, enableLogging = false) => {
  const authenticatorData = base64url.toBuffer(webauthnResponse.authenticatorData)
  const authrDataStruct = parseGetAssertAuthData(authenticatorData);

  const response = { 'verified': false }
  if (['fido-u2f'].includes(authr.fmt)) {
    // const authrDataStruct = parseGetAssertAuthData(authenticatorData);
    if (enableLogging) console.log('AUTH_DATA', authrDataStruct);

    if (!(authrDataStruct.flags & 0x01)) {// U2F_USER_PRESENTED
      throw new Error('User was not presented durring authentication!')
    }

    const clientDataHash = hash(base64url.toBuffer(webauthnResponse.clientDataJSON))
    const signatureBase = Buffer.concat([authenticatorData, clientDataHash]);

    const publicKey = ASN1toPEM(base64url.toBuffer(authr.publicKey))
    const signature = base64url.toBuffer(webauthnResponse.signature)

    response.counter = authrDataStruct.counter
    response.verified = verifySignature(signature, signatureBase, publicKey)

  } else if (['packed'].includes(authr.fmt)) {
    if (enableLogging) console.log('AUTH_DATA', authrDataStruct);

    if (!(authrDataStruct.flags & 0x01)) {// U2F_USER_PRESENTED
      throw new Error('User was not presented durring authentication!')
    }

    const clientDataHash = hash(base64url.toBuffer(webauthnResponse.clientDataJSON))
    const signatureBase = Buffer.concat([authenticatorData, clientDataHash]);
    const signature = base64url.toBuffer(webauthnResponse.signature);
    const publicKey = authr.publicKey;
    response.verified = verifySignature(signature, signatureBase, publicKey);
  }
  return response;
}

const findAuthr = (credID, authenticators) => {
  for (const authr in authenticators) {
    if (authenticators[authr] === credID)
      return authenticators
  }
  throw new Error(`Unknown authenticator with credID ${credID}!`)
}

const parseGetAssertAuthData = (buffer) => {
  let rpIdHash = buffer.slice(0, 32); buffer = buffer.slice(32);
  let flagsBuf = buffer.slice(0, 1); buffer = buffer.slice(1);
  let flags = flagsBuf[0];
  let counterBuf = buffer.slice(0, 4); buffer = buffer.slice(4);
  let counter = counterBuf.readUInt32BE(0);

  return { rpIdHash, flagsBuf, flags, counter, counterBuf }
}

const generateServerGetAssertion = (authenticators) => {
  let allowCredentials = [];
  for (let authr of authenticators) {
    allowCredentials.push({
      type: 'public-key',
      id: authr.credID,
      transports: ['usb', 'nfc', 'ble']
    })
  }
  return {
    challenge: randomBase64URLBuffer(32),
    allowCredentials: allowCredentials
  }
}

const createUserSession = (email) => {
  return { email, name: 'anonimous', id: randomBase64URLBuffer(16) };
}

module.exports = {
  generateServerMakeRequest,
  verifyAuthenticatorAttestationResponse,
  verifyAuthenticatorAssertionResponse,
  generateServerGetAssertion,
  randomBase64URLBuffer,
  createUserSession
}
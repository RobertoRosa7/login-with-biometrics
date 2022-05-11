const express = require('express');
const app = express();
const cors = require('cors');
const busboyConnect = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
const session = require('express-session');
const utils = require('./util');
const base64url = require('base64url');

app.use(session({
  secret: 'keyboard',
  resave: true,
  saveUninitialized: true
}));
app.use(express.json());
app.use(busboyConnect());
app.use(busboyBodyParser());
app.use(cors());

app.set('port', 5000);

app.get('/', (req, res) => {
  return res.status(200).json({ error: false, message: "it's working" });
});

// app.post('/login/login-with-password', async (req, res) => {
//   if (!req.body || !req.body.email || !req.body.password) {
//     return res.status(405).json({ error: true, message: "acesso não permitido" });
//   }

//   const { email } = req.body;

//   if (session.user.email !== email) {
//     return res.status(405).json({ error: true, message: 'e-mail não cadastrado' });
//   }

//   session.user = utils.createUserSession(email);
//   return res.status(200).json({ error: false, message: "login realizado com sucesso.", user: session.user });
// });

// app.post('/login/request-challenge', (req, res) => {
//   if (!req.body.email) {
//     return res.status(405).json({ error: true, message: 'Nenhuma sessão iniciada' });
//   }

//   const user = utils.createUserSession(req.body.email);
//   const publicKey = utils.generateServerMakeRequest({
//     displayName: user.name,
//     id: user.id,
//     username: user.email
//   });
//   session.user = user;
//   session.user.publicKey = publicKey;

//   return res.status(200).json({
//     error: false,
//     message: "publicKey criada com sucesso",
//     user: session.user,
//     publicKey,
//   });
// });

// app.post('/login/signin', async (req, res) => {
//   return res.status(200).json({ error: false, message: "it's working", user: session.user, createChallenge });
// });

// app.post('/login/verify-email', async (req, res) => {

//   if (!req.body || !req.body.email) {
//     return res.status(405).json({ error: true, message: 'Nenhum email recebido' });
//   }

//   const { email } = req.body;

//   if (!session.user) {
//     session.user = utils.createUserSession(email);
//   }

//   return res.status(200).json({ error: false, message: "E-mail encontrado", user: session.user });
// });

app.post('/login/verify-attestaion', async (req, res) => {
  let result;
  const user = session.user;

  if (!req.body || !req.body.id || !req.body.response) {
    return res.status(405).json({ message: 'Não foi possível registrar biometria', error: true });
  }

  try {
    const webauthnResp = req.body;
    const clientData = JSON.parse(base64url.decode(webauthnResp.response.clientDataJSON));

    if (clientData.origin !== req.headers.origin) {
      return res.status(405).json({ message: 'credencial inválida - origin client', error: true });
    }

    if (!user.publicKey || user.publicKey.challenge !== clientData.challenge) {
      return res.status(405).json({ message: 'credencial inválida - challenge', error: true });
    }

    if (webauthnResp.response.attestationObject !== undefined) {
      result = utils.verifyAuthenticatorAttestationResponse(webauthnResp.response);
    } else {
      return res.status(405).json({ message: 'credencial inválida - type of response', error: true });
    }
    return res.status(201).json({ message: "Biometria cadastrada", error: false, result });
  } catch (e) {
    console.log(e);
    return res.status(405).json({ message: "Erro ao fazer registro biométrico", error: true, e });
  }
});

app.post('/login/verify-assertation', async (req, res) => {
  if (!req.body) {
    return res.status(405).json({ message: 'Não match fingerprint', error: true });
  }

  const webauthnResp = req.body.assertation;
  const authenticators = req.body.publicKey;
  const user = session.user;
  const clientData = JSON.parse(base64url.decode(webauthnResp.response.clientDataJSON));

  if (!clientData) {
    return res.status(405).json({ message: 'Não foi possível reconhecer credencial', error: true });
  }

  if (clientData.type !== 'webauthn.get') {
    return res.status(405).json({ message: 'método de autenticação inválido', error: true });
  }

  if (clientData.challenge !== user.publicKey.challenge) {
    return res.status(405).json({ message: 'Não foi possível reconhecer credencial', error: true });
  }

  if (req.headers.origin !== clientData.origin) {
    return res.status(405).json({ message: 'Credencial com origem diferente', error: true });
  }

  try {
    const result = utils.verifyAuthenticatorAssertionResponse(webauthnResp.response, authenticators);

    if (!result || !result.verified) {
      return res.status(405).json({ message: 'credencial inválida', error: true });
    }

    return res.status(200).json({ message: 'Login realizado com successo.', error: false, user });
  } catch (e) {
    return res.status(405).json({ message: 'Não foi possível fazer autenticação', error: true });
  }
})

app.listen(app.get('port'), () => {
  console.log(`The server is running on: ${app.get('port')}`);
  console.log('TimeZone: ', new Date().toString());
});
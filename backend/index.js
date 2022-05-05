const express = require('express');
const app = express();
const cors = require('cors');
const busboyConnect = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
const session = require('express-session');
const utils = require('./util');

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

app.post('/login/login-with-password', async (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(405).json({ error: true, message: "acesso não permitido" });
  }

  const { email } = req.body;

  if (session.user.email !== email) {
    return res.status(405).json({ error: true, message: 'e-mail não cadastrado' });
  }

  session.user = utils.createUserSession(email);
  return res.status(200).json({ error: false, message: "login realizado com sucesso.", user: session.user });
});

app.get('/login/create-challenge', (req, res) => {
  if (!session.user) {
    return res.status(405).json({ error: true, message: 'Nenhuma sessão iniciada' });
  }

  const createChallenge = utils.generateServerMakeRequest({
    displayName: session.user.name,
    id: session.user.id,
    name: session.user.email
  });

  session.user.challenge = createChallenge.challenge
  
  return res.status(200).json({
    error: false,
    message: "publicKey criada com sucesso",
    user: session.user,
    createChallenge,
  });
});

app.post('/login/signin', async (req, res) => {
  return res.status(200).json({ error: false, message: "it's working", user: session.user, createChallenge });
});

app.post('/login/verify-email', async (req, res) => {

  if (!req.body || !req.body.email) {
    return res.status(405).json({ error: true, message: 'Nenhum email recebido' });
  }

  const { email } = req.body;

  if (!session.user) {
    session.user = utils.createUserSession(email);
  }

  return res.status(200).json({ error: false, message: "it's working", user: session.user });
});

app.listen(app.get('port'), () => {
  console.log(`The server is running on: ${app.get('port')}`);
  console.log('TimeZone: ', new Date().toString());
});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateToken } = require('./auth');
const { findUser } = require('./users');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/oauth/token', (req, res) => {
  const { username, password } = req.body;
  const user = findUser(username, password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.json({ access_token: token, token_type: 'Bearer', expires_in: 3600 });
});

app.listen(4000, () => console.log('OAuth2 Auth Service running on port 4000'));

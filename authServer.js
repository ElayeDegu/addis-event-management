// learn jwt
require('dotenv').config();

console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
}

let refreshTokenArray = []; // Renamed to avoid conflict

app.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401); // Unauthorized
  if (refreshTokenArray.includes(refreshToken)) return res.sendStatus(403); // Forbidden
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});
app.post('/login', (req, res) => {
    refreshTokens =refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/login', (req, res) => {
  const username = req.body.username; // Get username from the request body
  const user = { name: username }; // Create a user object

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
  let refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

  refreshTokenArray.push(refreshToken); // Store refresh token in array
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});


const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { auth: { jwtSecret, saltRounds } } = require('../../config');
const { user: userModel } = require('../../models');

async function signup(_, { username, email, password }) {
  const user = await userModel.create({
    username,
    email,
    password: await bcrypt.hash(password, saltRounds),
  });

  return jsonwebtoken.sign(
    { id: user.id, email: user.email },
    jwtSecret,
    { expiresIn: '1y' },
  );
}

async function login(_, { email, password }) {
  const user = await userModel.findOne({ where: { email } });

  if (!user) {
    throw new Error('no user with that email');
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error('incorrect password');
  }

  return jsonwebtoken.sign(
    { id: user.id, email: user.email },
    jwtSecret,
    { expiresIn: '1y' },
  );
}

module.exports = { signup, login };

const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { auth: { jwtSecret } } = require('../config');
const { User } = require('../models');

async function fetchUser(user) {
  const me = await User.findByPk(user.id);
  if (!me) {
    throw new Error('user does not exist');
  }
  return me;
}

async function signup(username, email, password) {
  let user;
  try {
    user = await User.create({
      username,
      email,
      // FIXME: what does this magic 10 mean?
      password: await bcrypt.hash(password, 10),
    });
  } catch (err) {
    console.log(err);
    // FIXME: this is not great. note the && && &&, and not sure if this is a user error
    // FIXME: also get rid of this magic number
    if (err.parent && err.parent.code && err.parent.code === 23505) {
      throw new Error('username already exists');
    }
    throw err;
  }

  return jsonwebtoken.sign(
    { id: user.id, email: user.email },
    jwtSecret,
    { expiresIn: '1y' },
  );
}

async function login(email, password) {
  const user = await User.findOne({ where: { email } });

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

module.exports = { fetchUser, signup, login };

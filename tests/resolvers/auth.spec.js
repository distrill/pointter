const { verify: verifyJwt } = require('jsonwebtoken');
const { user: userModel } = require('../../models');
const { signup, login } = require('../../schema/resolvers/auth');
const { cleanDb } = require('../helpers');
const { auth: { jwtSecret } } = require('../../config');

beforeEach(cleanDb);

describe('resolvers/auth', () => {
  describe('signup', () => {
    it('inserts a user record into the database upon successful signup', async () => {
      const oldUsers = await userModel.findAll();
      await signup({}, { username: 'un', email: 'em', password: 'pw' });
      const newUsers = await userModel.findAll();
      expect(newUsers).toHaveLength(oldUsers.length + 1);
    });

    it('returns a valid token', async () => {
      const result = await signup({}, { username: 'un', email: 'em', password: 'pw' });
      // will throw and fail test if not valid
      await verifyJwt(result, jwtSecret);
    });

    it('throws on duplicated username or email', async () => {
      function su() {
        return signup({}, { username: 'unn', email: 'emm', password: 'pw' });
      }
      await su();
      try {
        await su();
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toContain('Validation error');
      }
    });
  });

  describe('login', () => {
    const username = 'un';
    const email = 'em';
    const password = 'pw';
    beforeEach(async () => {
      await signup({}, { username, email, password });
    });

    it('returns a valid token', async () => {
      const result = await login({}, { email: 'em', password: 'pw' });
      // will throw and fail test if not valid
      await verifyJwt(result, jwtSecret);
    });

    it('errors if incorrect password', async () => {
      try {
        await login({}, { email, password: 'wrong' });
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('incorrect password');
      }
    });

    it('errors if user does not exist', async () => {
      try {
        await login({}, { email: 'wrong', password });
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('no user with that email');
      }
    });
  });
});

const { v4: uuid } = require('uuid');
const { user: userModel, follower: followerModel } = require('../../models');
const {
  me, follow, followers, following,
} = require('../../schema/resolvers/user');
const { cleanDb } = require('../helpers');

const myId = uuid();
const friendId = uuid();
const creds = { user: { id: myId } };

beforeEach(async () => {
  await cleanDb();
  await userModel.create({
    id: myId,
    username: 'me',
    email: 'me',
    password: 'me',
  });
  await userModel.create({
    id: friendId,
    username: 'friend',
    email: 'friend',
    password: 'fiend',
  });
});

describe('resolvers/user', () => {
  describe('me', () => {
    it('returns profile information for user', async () => {
      const myProfile = await me({}, {}, creds);
      expect(myProfile.username).toEqual('me');
      expect(myProfile.email).toEqual('me');
    });

    it('errors if user credentials not provided', async () => {
      try {
        await me({}, {}, {});
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('user is required');
      }
    });

    it('errors if provided user is not in database', async () => {
      const invalidCreds = { user: { id: uuid() } };
      try {
        await me({}, {}, invalidCreds);
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('user does not exist');
      }
    });
  });

  describe('follow', () => {
    it('creates follower record to describe relationship', async () => {
      let followers = await followerModel.findAll();
      expect(followers).toHaveLength(0);

      await follow({}, { userId: friendId }, creds);

      followers = await followerModel.findAll();
      expect(followers).toHaveLength(1);

      const [follower] = followers;
      expect(follower.followerId).toEqual(myId);
      expect(follower.followingId).toEqual(friendId);
    });

    it('errors if user credentials not provided', async () => {
      try {
        await follow({}, {}, {});
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('user is required');
      }
    });

    it('errors if friend is not in database', async () => {
      const invalidId = uuid();
      try {
        await follow({}, { userId: invalidId }, creds);
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual(`requested user does not exist: ${invalidId}`);
      }
    });
  });

  describe('followers', () => {
    beforeEach(async () => {
      const friendCreds = { user: { id: friendId } };
      // friend is following me
      await follow({}, { userId: myId }, friendCreds);
    });

    it('returns list of users who are following me', async () => {
      const fs = await followers({}, {}, creds);
      expect(fs).toHaveLength(1);
      const [f] = fs;
      expect(f.id).toEqual(friendId);
    });

    it('errors if user credentials not provided', async () => {
      try {
        await followers({}, {}, {});
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('user is required');
      }
    });
  });

  describe('following', () => {
    beforeEach(async () => {
      // i am following a friend
      await follow({}, { userId: friendId }, creds);
    });

    it('returns list of users who i am following', async () => {
      const fg = await following({}, {}, creds);
      expect(fg).toHaveLength(1);
      const [f] = fg;
      expect(f.id).toEqual(friendId);
    });

    it('errors if user credentials not provided', async () => {
      try {
        await following({}, {}, {});
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('user is required');
      }
    });
  });
});

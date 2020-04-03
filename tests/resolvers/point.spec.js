const { v4: uuid } = require('uuid');
const { follow } = require('../../schema/resolvers/user');
const { user: userModel, point: pointModel } = require('../../models');
const {
  points, makePoint, editPoint, unmakePoint,
} = require('../../schema/resolvers/point');
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

  await follow({}, { userId: friendId }, creds);

  await pointModel.create({
    id: uuid(),
    userId: myId,
    content: 'this is the hook',
  });
  await pointModel.create({
    id: uuid(),
    userId: myId,
    content: "it's catchy",
  });
  await pointModel.create({
    id: uuid(),
    userId: friendId,
    content: 'i like the bass',
  });
  await pointModel.create({
    id: uuid(),
    userId: friendId,
    content: 'i like the grooves',
  });
  await pointModel.create({
    id: uuid(),
    userId: friendId,
    content: 'but i digress',
  });
});

describe('resolvers/point', () => {
  describe('points', () => {
    it('returns points that belong to me', async () => {
      const ps = await points({}, {}, creds);
      expect(ps).toHaveLength(2);
      ps.forEach((point) => {
        expect(point.userId).toEqual(myId);
      });
    });

    it('includes user information with the point (me)', async () => {
      const ps = await points({}, {}, creds);
      ps.forEach((point) => {
        expect(point.user.id).toEqual(myId);
        expect(point.user.username).toEqual('me');
      });
    });

    it('returns points that belong to people i follow', async () => {
      const ps = await points({}, { following: true }, creds);
      expect(ps).toHaveLength(3);
      ps.forEach((point) => {
        expect(point.userId).toEqual(friendId);
      });
    });

    it('includes user information with the point (follow)', async () => {
      const ps = await points({}, { following: true }, creds);
      ps.forEach((point) => {
        expect(point.user.id).toEqual(friendId);
        expect(point.user.username).toEqual('friend');
      });
    });

    it('errors if user credentials not provided', async () => {
      try {
        await points({}, {}, {});
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('user is required');
      }
    });
  });

  describe('makePoint', () => {
    it('creates a point for a user', async () => {
      const oldPoints = await points({}, {}, creds);
      await makePoint({}, { content: 'you like it' }, creds);
      const newPoints = await points({}, {}, creds);
      expect(newPoints).toHaveLength(oldPoints.length + 1);
    });

    it('errors if user credentials not provided', async () => {
      try {
        await makePoint({}, { content: 'you like it' }, {});
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('user is required');
      }
    });
  });

  describe('editPoint', () => {
    it('updates the content of a point', async () => {
      const oldContent = 'this is the hook';
      const newContent = 'i like the filters, i like the grooves, but i digress';
      const oldPoint = await pointModel.findOne({ where: { content: oldContent } });
      await editPoint({}, { id: oldPoint.id, content: newContent }, creds);
      const newPoint = await pointModel.findOne({ where: { id: oldPoint.id } });
      expect(oldPoint.content).toEqual(oldContent);
      expect(newPoint.content).toEqual(newContent);
    });

    it('errors if user credentials are not provided', async () => {
      try {
        const oldContent = 'this is the hook';
        const newContent = 'i like the filters, i like the grooves, but i digress';
        const oldPoint = await pointModel.findOne({ where: { content: oldContent } });
        await editPoint({}, { id: oldPoint.id, content: newContent }, {});
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('user is required');
      }
    });

    it('errors if user does not own point being updated', async () => {
      try {
        const friendContent = 'i like the bass';
        const friendPoint = await pointModel.findOne({ where: { content: friendContent } });
        const newContent = 'i like the filters, i like the grooves, but i digress';
        await editPoint({}, { id: friendPoint.id, content: newContent }, creds);
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('user does not own resource');
      }
    });

    it('errors if point does not exist', async () => {
      try {
        const invalidId = uuid();
        const newContent = 'i like the filters, i like the grooves, but i digress';
        await editPoint({}, { id: invalidId, content: newContent }, creds);
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('user does not own resource');
      }
    });
  });

  describe('unmakePoint', () => {
    it('removes point', async () => {
      const oldPoints = await points({}, {}, creds);
      await unmakePoint({}, { id: oldPoints[0].id }, creds);
      const newPoints = await points({}, {}, creds);
      expect(newPoints).toHaveLength(oldPoints.length - 1);
    });

    it('errors if user credentials are not provided', async () => {
      try {
        const oldPoints = await points({}, {}, creds);
        await unmakePoint({}, { id: oldPoints[0].id }, {});
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('user is required');
      }
    });

    it('errors if user does not own point being unmade', async () => {
      try {
        const oldPoints = await points({}, { following: true }, creds);
        await unmakePoint({}, { id: oldPoints[0].id }, creds);
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('user does not own resource');
      }
    });

    it('errors if point does not exist', async () => {
      try {
        const invalidId = uuid();
        await unmakePoint({}, { id: invalidId }, creds);
        throw new Error('should have thrown');
      } catch (err) {
        expect(err.message).toEqual('user does not own resource');
      }
    });
  });
});

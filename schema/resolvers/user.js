// const { Op } = require('sequelize');
const { User, Follower } = require('../../models');

async function me(_, args, { user }) {
  if (!user) {
    throw new Error('you are not authenticated');
  }
  const userRecord = await User.findByPk(user.id);
  if (!userRecord) {
    throw new Error('user does not exist');
  }
  return userRecord;
}

async function follow(_, { userId }, { user }) {
  if (!user) {
    throw new Error('you are not authenticated');
  }
  if (!await User.findByPk(userId)) {
    throw new Error(`requested user does not exist: ${userId}`);
  }

  return Follower.create({ followerId: user.id, followingId: userId });
}

async function followers(_, args, { user }) {
  if (!user) {
    throw new Error('you are not authenticated');
  }
  return User.findFollowers(user.id);
}

async function following(_, args, { user }) {
  if (!user) {
    throw new Error('you are not authenticated');
  }
  return User.findFollowing(user.id);
}

module.exports = {
  me, follow, followers, following,
};

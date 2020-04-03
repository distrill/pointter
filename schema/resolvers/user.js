const { user: userModel, follower: followerModel } = require('../../models');

async function me(_, args, { user }) {
  if (!user) {
    throw new Error('user is required');
  }
  const userRecord = await userModel.findByPk(user.id);
  if (!userRecord) {
    throw new Error('user does not exist');
  }
  return userRecord;
}

async function follow(_, { userId }, { user }) {
  if (!user) {
    throw new Error('user is required');
  }
  if (!await userModel.findByPk(userId)) {
    throw new Error(`requested user does not exist: ${userId}`);
  }

  return followerModel.create({ followerId: user.id, followingId: userId });
}

async function followers(_, args, { user }) {
  if (!user) {
    throw new Error('user is required');
  }
  return userModel.findFollowers(user.id);
}

async function following(_, args, { user }) {
  if (!user) {
    throw new Error('user is required');
  }
  return userModel.findFollowing(user.id);
}

module.exports = {
  me, follow, followers, following,
};

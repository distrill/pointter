const { point: pointModel, user: userModel } = require('../../models');

function points(_, { following }, { user }) {
  if (!user) {
    throw new Error('user is required');
  }
  if (following) {
    return pointModel.findAllFollowing(user.id);
  }
  return pointModel.findAll({
    where: { userId: user.id },
    include: [{ model: userModel }],
  });
}

async function makePoint(_, { content }, { user }) {
  if (!user) {
    throw new Error('user is required');
  }
  return pointModel.create({ content, userId: user.id });
}

async function editPoint(_, { id, content }, { user }) {
  if (!user) {
    throw new Error('user is required');
  }

  const point = await pointModel.findOne({ where: { id } });
  if (!point || point.userId !== user.id) {
    throw new Error('user does not own resource');
  }

  point.content = content;
  await point.save();
  return point;
}

async function unmakePoint(_, { id }, { user }) {
  if (!user) {
    throw new Error('user is required');
  }

  const point = await pointModel.findOne({ where: { id } });
  if (!point || point.userId !== user.id) {
    throw new Error('user does not own resource');
  }

  await point.destroy();
  return point;
}

module.exports = {
  points, makePoint, editPoint, unmakePoint,
};

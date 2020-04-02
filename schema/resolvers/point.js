const { Point } = require('../../models');

function points(_, { following }, { user }) {
  if (!user) {
    throw new Error('you are not authenticated');
  }
  if (following) {
    return Point.findAllFollowing(user.id);
  }
  return Point.findAll({ where: { userId: user.id } });
}

async function makePoint(_, { content }, { user }) {
  if (!user) {
    throw new Error('you are not authenticated');
  }
  return Point.create({ content, userId: user.id });
}

async function editPoint(_, { id, content }, { user }) {
  if (!user) {
    throw new Error('you are not authenticated');
  }

  const point = await Point.findOne({ where: { id } });
  if (point.userId !== user.id) {
    throw new Error('you do not own this resource');
  }

  point.content = content;
  await point.save();
  return point;
}

async function unmakePoint(_, { id }, { user }) {
  if (!user) {
    throw new Error('you are not authenticated');
  }

  const point = await Point.findOne({ where: { id } });
  if (point.userId !== user.id) {
    throw new Error('you do not own this resource');
  }

  await point.destroy();
  return point;
}

module.exports = {
  points, makePoint, editPoint, unmakePoint,
};

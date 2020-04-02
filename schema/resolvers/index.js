const { signup, login } = require('./auth');
const {
  me, follow, followers, following,
} = require('./user');
const {
  points, makePoint, editPoint, unmakePoint,
} = require('./point');

const resolvers = {
  Query: {
    me,
    points,
    followers,
    following,
  },

  Mutation: {
    signup,
    login,

    follow,

    makePoint,
    editPoint,
    unmakePoint,
  },
};

module.exports = resolvers;

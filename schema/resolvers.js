const { fetchUser, signup, login } = require('../service/auth');
const { fetchPoints, makePoint } = require('../service/point');

const resolvers = {
  Query: {
    me(_, args, { user }) {
      if (!user) {
        throw new Error('you are not authenticated');
      }
      return fetchUser(user);
    },

    points(_, args, { user }) {
      if (!user) {
        throw new Error('you are not authenticated');
      }
      return fetchPoints(user.id);
    },
  },

  Mutation: {
    async signup(_, { username, email, password }) {
      return signup(username, email, password);
    },

    // handle user login
    async login(_, { email, password }) {
      return login(email, password);
    },

    // handle create point
    async makePoint(_, { content }, { user }) {
      if (!user) {
        throw new Error('you are not authenticated');
      }
      return makePoint(content, user.id);
    },
  },
};

module.exports = resolvers;

module.exports = `
  type User {
    id: String!
    username: String!
    email: String!
  }

  type Point {
    id: String!
    userId: String!
    content: String!
  }

  type Follower {
    id: String!
    followerId: String!
    followingId: String!
  }

  type Query {
    me: User!
    followers: [User!]!
    following: [User!]!
    points(following: Boolean): [Point!]!
  }

  type Mutation {
    signup (username: String!, email: String!, password: String!): String
    login (email: String!, password: String!): String
    makePoint (content: String!): Point
    editPoint (id: String! content: String): Point
    unmakePoint (id: String!): Point
    follow (userId: String!): Follower
  }
`;

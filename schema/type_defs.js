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

  type Query {
    me: User!
    points: [Point!]!
  }

  type Mutation {
    signup (username: String!, email: String!, password: String!): String
    login (email: String!, password: String!): String
    makePoint (content: String!): Point
  }
`;

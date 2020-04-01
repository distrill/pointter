const express = require('express');
const jwt = require('express-jwt');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');
const { auth: { jwtSecret } } = require('./config');

const port = 3000;

const auth = jwt({
  secret: jwtSecret,
  credentialsRequired: false,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    user: req.user,
  }),
});
const app = express();

const path = '/api';
app.use(path, auth);

server.applyMiddleware({ app, path });

app.listen(port, () => {
  console.log('server is running on http://localhost:3000/api');
});

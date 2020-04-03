# pointter
(it's like twitter, but it doesn't do as much. and there's no UI)

## Running the project locally
#### dependencies:
* node.js
* postgres
#### steps
1. clone project, cd into root
2. if not already, install postgres.
3. create dev and test databases and users in the postgres instance:
``` sql
CREATE DATABASE ptr_dev;
CREATE USER ptr_dev WITH ENCRYPTED PASSWORD 'ptr_dev';
GRANT ALL PRIVILEGES ON DATABASE ptr_dev TO pptr_dev;

CREATE DATABASE ptr_test;
CREATE USER ptr_test WITH ENCRYPTED PASSWORD 'ptr_test';
GRANT ALL PRIVILEGES ON DATABASE ptr_test TO pptr_test;
```
4. install dependencies:
``` bash
$ yarn
```
5. run app server:
``` bash
yarn run start
```
6. play with api in browser at `http://localhost:3000/api`  


*NOTE: to make authenticated requests, copy the token which is returned from either signing up (signup mutation) or logging in (login mutation), and [paste it into an Authorization header with a bearer type](https://i.imgur.com/xs5jAMm.png):*
``` json
{
  "Authorization": "Bearer <token>"
}
```


## api
#### types
``` graphql
# individual user, can sign up / log in, make "points", and follow other users
type User {
  id: String!
  username: String!
  email: String!
}

# a user makes a "point", similar to a tweet. they're making an argument.
type Point {
  id: String!
  userId: String!
  content: String!
  user: User
}

# defines a relationship between a follower and a folowee
type Follower {
  id: String!
  followerId: String!
  followingId: String!
}
```

#### queries
``` graphql
# all queries are authenticated requests and require a jwt token to be provided in the Authorization header
type Query {  
  # my profile information
  me: User!
  
  # list of users who are following me
  followers: [User!]!
  
  # list of users I am following
  following: [User!]!
  
  # if following is true: list of points made from users who I am following
  # if following is omitted or false: list of points that I've made
  points(following: Boolean): [Point!]!
}
```

#### mutations
``` graphql
type Mutation {
  # sign up flow, get auth token if successful
  signup (username: String!, email: String!, password: String!): String
  
  # returning user, log in to get a new token
  login (email: String!, password: String!): String
  
  # following requests are authenticated and require a jwt token to be provided in the Authorization header

  # make a point, take a stand, say something
  makePoint (content: String!): Point
  
  # update the content of a given point you made, add some nuance
  editPoint (id: String! content: String): Point
  
  # unmake point. perhapd you didn't mean or you learned something new and want to take it back
  unmakePoint (id: String!): Point
  
  # follow a friend or another user
  follow (userId: String!): Follower
}
```

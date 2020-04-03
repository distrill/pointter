# pointter
(it's like twitter, but it doesn't do as much. and there's no UI)

## Running the project locally
#### dependencies:
* node.js
* postgres
#### steps
* clone project, cd into root
* if not already, install postgres.
* create dev and test databases and users in the postgres instance:
``` sql
CREATE DATABASE ptr_dev;
CREATE USER ptr_dev WITH ENCRYPTED PASSWORD 'ptr_dev';
GRANT ALL PRIVILEGES ON DATABASE ptr_dev TO pptr_dev;

CREATE DATABASE ptr_test;
CREATE USER ptr_test WITH ENCRYPTED PASSWORD 'ptr_test';
GRANT ALL PRIVILEGES ON DATABASE ptr_test TO pptr_test;
```
* install dependencies
``` bash
$ yarn
```
* run app server
``` bash
yarn run start
```
* play with api at `http://localhost:3000/api`

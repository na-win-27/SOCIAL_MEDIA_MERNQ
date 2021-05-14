const { ApolloServer, gql, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGODB } = require("./config");
const typedefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers/index");

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs: typedefs,
  resolvers: resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB CONNECTED");
    server.listen(4000).then(() => console.log("running"));
  });

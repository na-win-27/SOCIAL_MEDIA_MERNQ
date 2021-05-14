const postResolvers = require("./post");
const userResolvers = require("./users");
const commmentResolvers = require("./comment");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postResolvers.Query,
    ...userResolvers.Query,
    ...commmentResolvers.Query,
  },
  Mutation: {
    ...postResolvers.Mutation,
    ...userResolvers.Mutation,
    ...commmentResolvers.Mutation,
  },
  Subscription: {
    ...postResolvers.Subcription,
  },
};

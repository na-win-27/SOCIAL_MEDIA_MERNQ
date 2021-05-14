const { UserInputError, AuthenticationError } = require("apollo-server-errors");
const Post = require("../../models/post");
const check_auth = require("../../utils/check_auth");

module.exports = {
  Mutation: {
    createComment: async (parent, { postId, body }, ctx, info) => {
      const user = check_auth(ctx);
      if (body.trim() === "") {
        throw new UserInputError("Empty Comment", {
          errors: {
            body: "Comment must not be empty",
          },
        });
      }
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body: body,
          username: user.username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
    deleteComment: async (parent, args, ctx, info) => {
      const { postId, commentId } = args;
      const { username } = check_auth(ctx);
      const post = await Post.findById(postId);

      if (post) {
        const commmentIndex = post.comments.findIndex(
          (c) => c.id === commentId
        );
        if (post.comments[commmentIndex].username === username) {
          post.comments.splice(commmentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("ACTION NOT ALLOWED");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },
};

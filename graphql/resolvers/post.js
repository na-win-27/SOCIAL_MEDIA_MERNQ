const { UserInputError, AuthenticationError } = require("apollo-server-errors");
const Post = require("../../models/post");
const checkAuth = require("../../utils/check_auth");

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find();
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPost: async (parent, args, ctx, info) => {
      const id = args.postId;
      try {
        const post = Post.findById(id);
        if (!post) {
          throw new UserInputError("Post NOT FOUND", {
            error: "PLEASE CHECK",
          });
        }
        return post;
      } catch (error) {
        throw new UserInputError("SERVER EROOR", {
          error: "MONGO ERRROR",
        });
      }
    },
  },
  Mutation: {
    createPost: async (parent, args, ctx, info) => {
      const { body } = args;
      const user = checkAuth(ctx);

      // console.log(ctx.req.headers);
      const newPost = new Post({
        body: body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
        comments: [],
        likes: [],
      });
      const post = await newPost.save();
      ctx.pubsub.publish("NEW_POST", {
        newPost: post,
      });
      return post;
    },
    deletePost: async (parent, args, ctx, info) => {
      const user = checkAuth(ctx);
      // console.log(user);
      try {
        const post = await Post.findById(args.postId);
        // console.log(post);
        // console.log(user);
        if (post.username === user.username) {
          await post.delete();
          return "Post DELETED";
        } else {
          throw new AuthenticationError("Action Not Allowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    likePost: async (parent, { postId }, ctx, info) => {
      const { username } = checkAuth(ctx);
      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // Post already likes, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },
  },
  Subcription: {
    newPost: {
      subscribe: (_, __, { pubsub }, info) => {
        pubsub.asyncIterator("NEW_POST");
      },
    },
  },
};

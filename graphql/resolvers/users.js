const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { SECRET } = require("../../config");
const User = require("../../models/user");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async login(parent, args, ctx, info) {
      const { username, password } = args;
      const { errors, valid } = validateLoginInput(username, password);
      console.log(errors);
      if (!valid) {
        throw new UserInputError("Errors", {
          errors,
        });
      }

      const user = await User.findOne({ username });
      //console.log(user);
      if (!user) {
        throw new UserInputError("errors", {
          errors,
        });
      }

      const match = await bcrypt.compare(password, user.password);
      console.log(match);
      if (!match) {
        throw new UserInputError("errors", {
          error: "password wrong",
        });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token: token,
      };
    },
    async register(parent, args, ctx, info) {
      // validate data
      const { username, email, password, confirmPassword } = args.registerInput;
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", {
          errors,
        });
      }
      const user_check = await User.findOne({ username: username });
      if (user_check) {
        throw new UserInputError("Username in taken", {
          errors: {
            username: "already taken ",
          },
        });
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password: hashedPassword,
        username,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();
      const token = jwt.sign(
        {
          id: res.id,
          email: res.email,
          username: res.username,
        },
        SECRET,
        {
          expiresIn: "1h",
        }
      );
      return {
        ...res._doc,
        id: res._id,
        token: token,
      };
    },
  },
};

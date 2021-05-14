const { AuthenticationError } = require("apollo-server-errors");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");

module.exports = (ctx) => {
  const authHeaders = ctx.req.headers.authorization;
  if (authHeaders) {
    const token = authHeaders.split("Bearer ")[1];
    try {
      const user = jwt.verify(token, SECRET);
      if (!user) {
        throw new Error("AUTH TOKEN FORMAT ERROE");
      }
      return user;
    } catch (error) {
      throw new AuthenticationError("Invalid Token");
    }
  }
  throw new Error("AUTH MUST BE PROVIDED");
};

const jwt = require("jsonwebtoken");

const generateToken = (id, secret, expiresIn) => {
  return jwt.sign({ id }, secret, {
    expiresIn: expiresIn,
  });
};

const generateAuthTokens = (userId) => {
  const accessToken = generateToken(
    userId,
    process.env.JWT_SECRET,
    process.env.JWT_ACCESS_EXPIRATION || "1h"
  );

  const refreshToken = generateToken(
    userId,
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRATION || "7d"
  );

  return { accessToken, refreshToken };
};

module.exports = { generateAuthTokens };

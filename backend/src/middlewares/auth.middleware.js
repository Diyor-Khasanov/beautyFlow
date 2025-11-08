const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User.model");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user || !req.user.isVerified) {
        res.status(401);
        throw new Error(
          "Не авторизован, пользователь не найден или не верифицирован"
        );
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Не авторизован, неверный или просроченный токен");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Не авторизован, токен отсутствует");
  }
});

const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || (roles.length > 0 && !roles.includes(req.user.role))) {
      res.status(403);
      return next(
        new Error(
          `Доступ запрещен. Роль '${
            req.user ? req.user.role : "Неизвестная"
          }' не имеет разрешения.`
        )
      );
    }
    next();
  };
};

module.exports = { protect, authorize };

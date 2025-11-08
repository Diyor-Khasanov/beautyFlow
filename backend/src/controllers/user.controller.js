const asyncHandler = require("express-async-handler");
const User = require("../models/User.model");

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json({
      id: user._id,
      phone: user.phone,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error("Пользователь не найден");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      message: "Профиль успешно обновлен",
    });
  } else {
    res.status(404);
    throw new Error("Пользователь не найден");
  }
});

module.exports = {
  getUserProfile,
  updateUserProfile,
};

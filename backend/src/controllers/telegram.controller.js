const { Telegraf } = require("telegraf");
const User = require("../models/User.model");
const asyncHandler = require("express-async-handler");
const { generateLinkToken } = require("../utils/telegramToken");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
bot.start(async (ctx) => {
  try {
    const telegramId = ctx.message.from.id;
    const messageText = ctx.message.text;

    const parts = messageText.split(" ");
    const userId = parts.length > 1 ? parts[1] : null;

    const existingUser = await User.findOne({ telegramId });
    if (existingUser) {
      return ctx.reply(
        `👋 You are already linked to the account: ${existingUser.phone}.`
      );
    }

    if (userId) {
      const user = await User.findById(userId);

      if (!user) {
        return ctx.reply("❌ Error: User not found in the system.");
      }
      user.telegramId = telegramId;
      await user.save();
      return ctx.reply(
        `✅ Congratulations! Your account ${user.phone} has been successfully linked to Telegram.`
      );
    }
    return ctx.reply(
      "👋 Welcome! Please use the special link from the application to link your account after logging in."
    );
  } catch (error) {
    console.error("TELEGRAM BOT START ERROR:", error);
    return ctx.reply(
      "❌ Sorry, a technical error occurred. Please try again later."
    );
  }
});

bot.command("getlink", async (ctx) => {
  const telegramId = ctx.message.from.id;
  const { token, expires } = generateLinkToken();

  const linkUrl = `${CLIENT_URL}/link-telegram?tid=${telegramId}&token=${token}`;

  const message = `
        🔗 **Your temporary linking reference:**
        ${linkUrl}
        
        Expiration time: ${new Date(expires).toLocaleTimeString()}
        
        *You must open this link in the browser where you are logged into the application.*
    `;

  ctx.reply(message, { parse_mode: "Markdown" });
});

bot.on("text", (ctx) => {
  if (ctx.message.text.toLowerCase() === "расписание") {
    return ctx.reply("Please use the /schedule command to view the timetable.");
  }
});

const generateLink = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  if (user.telegramId) {
    return res
      .status(400)
      .json({ message: "Telegram account is already linked." });
  }

  const { token, expires } = generateLinkToken();
  user.telegramLinkToken = token;
  user.telegramLinkExpires = expires;
  await user.save();
  const linkUrl = `tg://resolve?domain=${process.env.TELEGRAM_BOT_USERNAME}&start=${user._id}`;

  res.json({
    message:
      "Link generated. Please go to Telegram and press the Start button.",
    linkUrl: linkUrl,
  });
});

const handleWebhook = asyncHandler(async (req, res) => {
  await bot.handleUpdate(req.body, res);
});

module.exports = {
  handleWebhook,
  generateLink,
  sendTelegramNotification: async (chatId, message) => {
    try {
      if (chatId) {
        await bot.telegram.sendMessage(chatId, message, {
          parse_mode: "Markdown",
        });
      }
    } catch (error) {
      console.error("Error sending Telegram notification:", error.message);
    }
  },
};

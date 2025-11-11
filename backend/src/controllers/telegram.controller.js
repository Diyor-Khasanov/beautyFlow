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

    // Maxsus /start buyrug'idan userId ni ajratib olish: /start [USER_ID]
    const parts = messageText.split(" ");
    const userId = parts.length > 1 ? parts[1] : null;

    // 1. Agar foydalanuvchi allaqachon Telegramga bog'langan bo'lsa
    const existingUser = await User.findOne({ telegramId });
    if (existingUser) {
      return ctx.reply(
        `👋 Siz allaqachon ${existingUser.phone} akkauntiga bog'langansiz.`
      );
    }

    if (userId) {
      const user = await User.findById(userId);

      if (!user) {
        return ctx.reply("❌ Xatolik: Tizimda bunday foydalanuvchi topilmadi.");
      }
      user.telegramId = telegramId;
      await user.save();
      return ctx.reply(
        `✅ Tabriklaymiz! Sizning ${user.phone} akkauntingiz Telegramga muvaffaqiyatli bog'landi.`
      );
    }
    return ctx.reply(
      "👋 Xush kelibsiz! Iltimos, ilovaga kirganingizdan so'ng, akkauntni bog'lash uchun maxsus havoladan foydalaning."
    );
  } catch (error) {
    console.error("TELEGRAM BOT START XATOSI:", error);
    return ctx.reply(
      "❌ Kechirasiz, texnik xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring."
    );
  }
});

bot.command("getlink", async (ctx) => {
  const telegramId = ctx.message.from.id;
  const { token, expires } = generateLinkToken();

  const linkUrl = `${CLIENT_URL}/link-telegram?tid=${telegramId}&token=${token}`;

  const message = `
        🔗 **Ваша временная ссылка для привязки:**
        ${linkUrl}
        
        Срок действия: ${new Date(expires).toLocaleTimeString()}
        
        *Эту ссылку нужно открыть в браузере, где вы авторизованы в приложении.*
    `;

  ctx.reply(message, { parse_mode: "Markdown" });
});

bot.on("text", (ctx) => {
  if (ctx.message.text.toLowerCase() === "расписание") {
    return ctx.reply("Для просмотра расписания используйте команду /schedule.");
  }
});

const generateLink = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("Пользователь не найден.");
  }

  if (user.telegramId) {
    return res.status(400).json({ message: "Аккаунт Telegram уже привязан." });
  }

  const { token, expires } = generateLinkToken();
  user.telegramLinkToken = token;
  user.telegramLinkExpires = expires;
  await user.save();
  const linkUrl = `tg://resolve?domain=${process.env.TELEGRAM_BOT_USERNAME}&start=${user._id}`;

  res.json({
    message:
      "Ссылка сгенерирована. Перейдите в Telegram и нажмите кнопку Start.",
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
      console.error("Ошибка отправки уведомления в Telegram:", error.message);
    }
  },
};

const { Telegraf } = require('telegraf');
const User = require('../models/User.model');
const asyncHandler = require('express-async-handler');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start(async (ctx) => {
    const telegramId = ctx.message.from.id;
    const messageText = ctx.message.text; 
    const parts = messageText.split(' ');
    const userId = parts.length > 1 ? parts[1] : null; 

    if (userId) {
        const user = await User.findById(userId);

        if (user) {
            user.telegramChatId = telegramId;
            await user.save();
            return ctx.reply(`✅ Ваш аккаунт успешно привязан к Telegram. Вы будете получать уведомления.`);
        }
    }
    
    return ctx.reply('👋 Добро пожаловать! Используйте специальную ссылку из приложения для привязки аккаунта.');
});

bot.on('text', (ctx) => {
    if (ctx.message.text.toLowerCase() === 'расписание') {
        return ctx.reply('Для просмотра расписания используйте команду /schedule.');
    }
});

const handleWebhook = asyncHandler(async (req, res) => {
    await bot.handleUpdate(req.body, res);
});

module.exports = {
    handleWebhook,
    sendTelegramNotification: async (chatId, message) => {
        try {
            if (chatId) {
                await bot.telegram.sendMessage(chatId, message);
            }
        } catch (error) {
            console.error('Ошибка отправки уведомления в Telegram:', error.message);
        }
    }
};
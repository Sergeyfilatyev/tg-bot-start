require("dotenv").config();
const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = process.env.TOKEN;
const bot = new TelegramApi(token, { polling: true });
const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас я загадаю число от 0 до 9, а ты попробуй угадать его.`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Давай сыграем в игру" },
  ]);
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/73a/aed/73aaedd6-70a6-40f1-ae0d-1c0ed846a5b3/10.webp"
      );
      return bot.sendMessage(
        chatId,
        `Добро пожаловать в телеграмм чат бот Filatyev Sergey`
      );
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}. Твой никнейм ${msg.from.username}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    await bot.sendMessage(
      chatId,
      `Я тебя не понимаю, выбери вопрос из меню, пожалуйста`
    );
  });
  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }
    if (Number(data) === chats[chatId]) {
      await bot.sendMessage(chatId, `Ты выбрал число ${data}`);
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты угадал!!! Я действительно загадал число ${chats[chatId]}`,
        againOptions
      );
    } else {
      await bot.sendMessage(chatId, `Ты выбрал число ${data}`);
      return bot.sendMessage(
        chatId,
        ` К сожалению ты не угадал, я загадал число ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();

"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_express = __toESM(require("express"));
var import_body_parser = __toESM(require("body-parser"));
var import_node_telegram_bot_api = __toESM(require("node-telegram-bot-api"));
async function main() {
  const app = (0, import_express.default)();
  const port = "8080";
  app.use(import_body_parser.default.json());
  const botToken = process.env["BOT_TOKEN"];
  const bot = new import_node_telegram_bot_api.default(botToken, { polling: true });
  let chatId;
  bot.onText(/\/start/, (msg) => {
    chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hello! Your notification bot has been set up now!");
  });
  app.post("/notify", (req, res) => {
    const webhookEvent = req.body;
    const logs = webhookEvent.event.data.block.logs;
    if (logs.length === 0) {
      console.log("Empty logs array received, skipping");
    } else {
      for (let i = 0; i < logs.length; i++) {
        const topic1 = "0x" + logs[i].topics[1].slice(26);
        const topic2 = "0x" + logs[i].topics[2].slice(26);
        const amount = parseInt(logs[i].data, 16) / 1e18;
        const message = `${topic1} sent ${amount} DAI to ${topic2}`;
        if (chatId) {
          bot.sendMessage(chatId, message);
        } else {
          console.log(message);
        }
      }
    }
    res.sendStatus(200);
  });
  app.listen(port, () => {
    console.log(`Example Alchemy Notify app listening at ${port}`);
  });
}
main();
//# sourceMappingURL=index.js.map

import express from "express";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";

async function main(): Promise<void> {
  const app = express();

  const port = "8080";

  // Parse the request body as JSON
  app.use(bodyParser.json());

  // Create a TelegramBot instance with your bot token
  const botToken = process.env['BOT_TOKEN'];
  const bot = new TelegramBot(botToken, { polling: true });

  let chatId: string | undefined; // Define chatId as undefined initially

  // Listen for the "start" command
  bot.onText(/\/start/, (msg) => {
    chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hello! Your notification bot has been set up now!");
  });

  // Register handler for Alchemy Notify webhook events
  app.post("/notify", (req, res) => {
    const webhookEvent = req.body;
    const logs = webhookEvent.event.data.block.logs;
    if (logs.length === 0) {
      console.log("Empty logs array received, skipping");
    } else {
      for (let i = 0; i < logs.length; i++) {
        const topic1 = "0x" + logs[i].topics[1].slice(26); // Remove '0x'
        const topic2 = "0x" + logs[i].topics[2].slice(26); // Remove '0x'
        const amount = parseInt(logs[i].data, 16) / 1e18; // Convert hexadecimal string to decimal number
        const message = `${topic1} sent ${amount} DAI to ${topic2}`;

        if (chatId) {
          bot.sendMessage(chatId, message); // Send message to Telegram
        } else {
          console.log(message); // Print message to terminal
        }
      }
    }
    res.sendStatus(200);
  });

  // Listen to Alchemy Notify webhook events
  app.listen(port, () => {
    console.log(`Example Alchemy Notify app listening at ${port}`);
  });
}

main();

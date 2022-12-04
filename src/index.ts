import { bot } from "./bot";

async function main() {
  bot.start();
}

main()
  .then(() => console.log("bot started"))
  .catch(console.error);

const { Client, GatewayIntentBits } = require("discord.js");

const ready = require("./events/ready.js");
const messageCreate = require("./events/messageCreate.js");
const interactionCreate = require("./events/interactionCreate.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("clientReady", () => ready(client));
client.on("messageCreate", (message) => messageCreate(message));
client.on("interactionCreate", (interaction) => interactionCreate(interaction));

client.login(process.env.TOKEN);

// gives us access to global environment variable
require("dotenv").config();

// importing classes from discord.js library needed for bot
// Client represents the bot
// IntentsBitField allows us to set up intents which are the set of permissions
// that the bot can use to access a set of events
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");
const eventHandler = require("./handlers/eventHandler");

// defining the bot and which intents it will have access to
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// handles event listeners
eventHandler(client);

client.login(process.env.TOKEN);

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

// defining the bot and which intents it will have access to
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// listens to the event of the bot being online and ready to use
client.on("ready", (bot) => {
  console.log(`🤖 Bot: ${bot.user.username} is online`);

  bot.user.setActivity({
    name: "Battling Anxiety",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/watch?v=OqxHy8sCtvA",
  });
});

// client.on("interactionCreate", (interaction) => {
//   if (!interaction.isChatInputCommand()) return;

//   if (interaction.commandName === "embed") {
//     const embed = new EmbedBuilder()
//       .setTitle("Orgo")
//       .setDescription("Goblin Monster")
//       .setColor("Random")
//       .addFields(
//         { name: "Weak to", value: "Fire 🔥", inline: true },
//         { name: "Resistant against", value: "Ice 🧊", inline: true }
//       );

//     interaction.reply({ embeds: [embed] });
//   }
// });

// client.on("messageCreate", (message) => {
//   if (message.author.bot) return;

//   if (message.content === "embed") {
//     const embed = new EmbedBuilder()
//       .setTitle("Orgo")
//       .setDescription("Goblin Monster")
//       .setColor("Random")
//       .addFields(
//         { name: "Weak to", value: "Fire 🔥", inline: true },
//         { name: "Resistant against", value: "Ice 🧊", inline: true }
//       );

//     message.channel.send({ embeds: [embed] });
//   }
// });

client.login(process.env.TOKEN);

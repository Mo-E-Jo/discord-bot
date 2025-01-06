const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const pool = require("../../database/database-connection");
const getElementValue = require("../../callbacks/getElementValue");

module.exports = {
  name: "embed",
  description: "Summary of any Monster within the game",
  options: [
    {
      name: "monster-name",
      description: "Name of monster",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  // devOnly: Boolean,
  // testOnly: Boolean,
  // options: Object[],
  // deleted: true
  callback: async (client, interaction) => {
    //! get the monster name from the interaction
    const monsterName = interaction.options.get("monster-name").value;

    const queryResult = await pool.query(
      //TODO: Set up an ORM to query the DB rather than using a raw query
      //TODO: Set up TypeScript for rest of project
      'SELECT * FROM important_enemy_stats WHERE "Enemy Name" = $1',
      [monsterName]
    );

    console.log(queryResult.rows[0]);

    if (!queryResult.rows[0]) {
      interaction.reply({
        content:
          "This monster does not exist within the world of Metaphor Refantazio",
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`**${monsterName}**`)
      .setDescription(
        `**Level:** ${queryResult.rows[0].level.toString()} **HP:** ${queryResult.rows[0].hp.toString()}`
      )
      .setColor("Random")
      .addFields(
        {
          name: "**Chart Definitions**",
          value:
            "⚪ = Neutral **|** ❗ = Weak **|** 🛡️ = Resist **|** 🛑 = Null **|** 🔁 = Reflect **|** 💖 = Drain\n\n🔪 = Slash **|** 🏹 = Pierce **|** 👊 = Strike **|** 🔥 = Fire **|** 🧊 = Ice **|** 🌩️ = Elec **|** 🌬️ = Wind **|** 🔅 = Light **|** 🕶️ = Dark",
          inline: false,
        },
        {
          name: "**Weakness Chart**",
          value: `
              🔪: ${getElementValue(
                queryResult,
                "slash"
              )} **|** 🏹: ${getElementValue(
            queryResult,
            "pierce"
          )} **|** 👊: ${getElementValue(
            queryResult,
            "strike"
          )} **|** 🔥: ${getElementValue(
            queryResult,
            "fire"
          )} **|** 🧊: ${getElementValue(
            queryResult,
            "ice"
          )} **|** 🌩️: ${getElementValue(
            queryResult,
            "elec"
          )} **|** 🌬️: ${getElementValue(
            queryResult,
            "wind"
          )} **|** 🔅: ${getElementValue(
            queryResult,
            "light"
          )} **|** 🕶️: ${getElementValue(
            queryResult,
            "dark"
          )}
                `,
          inline: true,
        }
      );
     //! ADD ALMIGHTY WEAKNESS
     // ASK CHATGPT HOW TO CREATE AN IMAGE AND SEND WITHIN AN EMBED
    console.log("abc");
    interaction.reply({ embeds: [embed] });
    console.log("cba");
  },
};

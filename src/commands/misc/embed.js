const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const pool = require("../../database/database-connection");

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
    console.log(monsterName);

    const queryResult = await pool.query(
      'SELECT * FROM important_enemy_stats WHERE "Enemy Name" = $1',
      [monsterName]
    );

    console.log(queryResult);
    console.log(queryResult.rows);
    console.log(queryResult.rows[0].hp);

    const embed = new EmbedBuilder()
      .setTitle(monsterName)
      .setDescription("This is an embed description")
      .setColor("Random")
      .addFields({
        name: monsterName,
        value: queryResult.rows[0].hp.toString(),
        inline: true,
      });
    console.log("abc");
    interaction.reply({ embeds: [embed] });
    console.log("cba");
  },
};

const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const pool = require("../../database/database-connection");
const getElementValue = require("../../callbacks/getElementValue");
const { createCanvas, loadImage } = require("canvas"); // Canvas package for creating images
const path = require("path");

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

    //! CREATE ANOTHER QUERY THAT ONLY SELECTS THE 10 ELEMENTS FROM THE DB FOR A MONSTER
    const elementResult = await pool.query(
      'SELECT slash, pierce, strike, fire, ice, elec, wind, light, dark, almighty FROM important_enemy_stats WHERE "Enemy Name" = $1',
      [monsterName]
    );

    console.log(elementResult.rows[0]);

    if (!queryResult.rows[0]) {
      interaction.reply({
        content:
          "This monster does not exist within the world of Metaphor Refantazio",
      });
      return;
    }

    // Create an image with the fetched data
    const imageBuffer = await createImage(elementResult.rows[0]);

    // Create an embed and set the image
    const embed = new EmbedBuilder()
      .setTitle(`**${monsterName}**`)
      .setDescription(`**Level:** ${queryResult.rows[0].level} **HP:** ${queryResult.rows[0].hp}`)
      .setColor("Random")
      .setImage("attachment://elements.png");

    // Send the embed with the image as an attachment
    await interaction.reply({
      embeds: [embed],
      files: [
        {
          attachment: imageBuffer,
          name: "elements.png", // The image name in the embed
        },
      ],
    });
  },
};

async function createImage(data) {
  // Canvas & context setup to draw on canvas
  const canvas = createCanvas(2000, 350);
  const ctx = canvas.getContext("2d");

  // Fill background with black
  ctx.fillStyle = "#2f3130";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fill top row with white
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

  // Grid and cell properties
  const cellWidth = canvas.width / 10; // Width of each cell //! Since we want 10 columns we divide width by 10
  const cellHeight = canvas.height / 2; // Height of each cell //! Since we want 2 rows we divide height by 2
  const cols = 10; // Fixed number of columns
  const rows = 2; // Always 2 rows (top for elements, bottom for weaknesses)

  // Draw grid lines
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;

  // Draw vertical lines for columns
  for (let col = 0; col <= cols; col++) {
    // pick up pen
    ctx.beginPath();

    // bring pen to the start of whichever column we are drawing
    ctx.moveTo(col * cellWidth, 0);

    // the pen will end drawing at the bottom of the canvas
    ctx.lineTo(col * cellWidth, rows * cellHeight);

    // draw the line
    ctx.stroke();
  }

  // Draw horizontal lines for rows
  for (let row = 0; row <= rows; row++) {
    // pick up pen
    ctx.beginPath();

    // bring pen to the start of whichever row we are drawing
    ctx.moveTo(0, row * cellHeight);

    // the pen will end drawing at the right most side of the canvas
    ctx.lineTo(cols * cellWidth, row * cellHeight);

    // draw the line
    ctx.stroke();
  }

  // Explicitly define paths to the elements and reactions folders
  const elementsFolder = path.resolve("./src/assets/elements");
  const reactionsFolder = path.resolve("./src/assets/reactions");

  // preload weakness images into an object
  const imagePaths = {
    weak: path.join(reactionsFolder, "weak.png"),
    resist: path.join(reactionsFolder, "resist.png"),
    null: path.join(reactionsFolder, "null.png"),
    drain: path.join(reactionsFolder, "drain.png"),
    reflect: path.join(reactionsFolder, "reflect.png"),
    neutral: path.join(reactionsFolder, "neutral.png"),
  };

  // Draw elements within the top row
  const elementKeys = Object.keys(data); // ['fire', 'ice', 'elec']

  // for every element within elementKeys
  for (let index = 0; index < elementKeys.length; index++) {
    // grab the element
    const element = elementKeys[index];

    // grab the image associated with that element
    const img = await loadImage(path.join(elementsFolder, `${element}.png`));

    // Center image within the cell
    //! LOOK INTO HOW THIS WORKS + HOW FORMULA DYNAMICALLY CENTERS
    const x = index * cellWidth + (cellWidth - img.width) / 2;
    const y = (cellHeight - img.height) / 2;

    // draw the image within the x & y coordinates given
    ctx.drawImage(img, x, y);
  }

  // Draw reaction images based on data parameter given
  for (let index = 0; index < elementKeys.length; index++) {
    // grab the element
    const element = elementKeys[index];

    // grab the reaction data associated with the element
    const reaction = data[element];

    const weakness = reaction.split(" ")[0];

    let weaknessImagePath = imagePaths.neutral; // Default value

    // switch statement to determine which image to produce in bottom row
    switch (weakness) {
      case "Weak":
        weaknessImagePath = imagePaths.weak;
        break;
      case "Resist":
        weaknessImagePath = imagePaths.resist;
        break;
      case "Null":
        weaknessImagePath = imagePaths.null;
        break;
      case "Drain":
        weaknessImagePath = imagePaths.drain;
        break;
      case "Repel":
        weaknessImagePath = imagePaths.reflect;
        break;
      case "Neutral":
        weaknessImagePath = imagePaths.neutral;
        break;
      default:
        weaknessImagePath = imagePaths.neutral;
    }

    // grab the reaction image using the image path
    const img = await loadImage(weaknessImagePath);

    // Center image in the cell (bottom row)
    //! LOOK INTO HOW THIS WORKS + HOW FORMULA DYNAMICALLY CENTERS
    const x = index * cellWidth + (cellWidth - img.width) / 2;
    const y = cellHeight + (cellHeight - img.height) / 2; // Bottom row offset by `cellHeight`

    // draw the image within the x & y coordinates given
    ctx.drawImage(img, x, y);
  }

  return canvas.toBuffer(); // Convert canvas to buffer
}

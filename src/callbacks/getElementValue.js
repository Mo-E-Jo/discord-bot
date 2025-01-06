module.exports = (queryResult, element) => {
  // Ensure the row and attribute exist to avoid runtime errors
  if (
    queryResult &&
    queryResult.rows &&
    queryResult.rows[0] &&
    queryResult.rows[0][element]
  ) {
    if (queryResult.rows[0][element].includes("Weak")) {
      return "❗";
    } else if (queryResult.rows[0][element].includes("Resist")) {
      return "🛡️";
    } else if (queryResult.rows[0][element].includes("Neutral")) {
      return "⚪";
    } else if (queryResult.rows[0][element].includes("Null")) {
      return "🛑";
    } else if (queryResult.rows[0][element].includes("Repel")) {
      return "🔁";
    } else if (queryResult.rows[0][element].includes("Drain")) {
      return "💖";
    } else return "\u200b";
  }
  return "\u200b"; // Default return if attribute is not found
};

//! adapt code below into code above to not use includes
//! Look into attaching images into discord embed
/*
var resistanceValue = queryResult.rows[0][element]

var resistance = resistance.split(" ")[0]

switch (resistance) {
  case "Weak":
    // Do something
    break
  case "Resist":
    // Do something
    break
  // Blah blah blah
}
*/
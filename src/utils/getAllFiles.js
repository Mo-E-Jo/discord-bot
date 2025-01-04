const fs = require("fs");
const path = require("path");

// directory = directory from which we get all of the files/folders from
// foldersOnly allows us to specify whether or not we want only folders returned
module.exports = (directory, foldersOnly = false) => {
  let fileNames = [];

  /*
  readdirSync reads the contents of a directory syncronously
  withFileTypes allows us to specify whether or not we only want files or folders
  files is essentially all of the files/folders names in a directory
  */

  const files = fs.readdirSync(directory, { withFileTypes: true });

  /*

  */
  for (const file of files) {
    const filePath = path.join(directory, file.name);

    if (foldersOnly) {
      if (file.isDirectory()) {
        fileNames.push(filePath);
      }
    } else {
      if (file.isFile()) {
        fileNames.push(filePath);
      }
    }
  }
  return fileNames;
};

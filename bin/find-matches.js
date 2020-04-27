var fs = require("fs");
var path = require("path");

function findMatches(directory, matches) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    var filepath = path.join(directory, file);
    if (file.endsWith(".html")) {
      matches.push(filepath);
    }
    var stat = fs.lstatSync(filepath);
    if (stat && stat.isDirectory()) {
      matches = findMatches(filepath, matches);
    }
  });
  return matches;
}

module.exports = findMatches;

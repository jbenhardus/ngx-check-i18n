#! /usr/bin/env node

var colors = require("colors");
var findMatches = require("./find-matches");
var fs = require("fs");
var HTMLParser = require("node-html-parser");
var shell = require("shelljs");
var yargs = require("yargs").option("paths", {
  type: "array",
});

var argv = yargs.argv;

var dir = argv.path || ".";
var paths = argv.paths || [dir];

var matches = [];
paths.forEach((dir) => findMatches(dir, matches));

var tags = {};
var errors = {};
var warnings = {};

matches.forEach((match) => {
  var file = fs.readFileSync(match).toString();
  var root = HTMLParser.parse(file);
  var elements = root.querySelectorAll("[i18n]");
  elements.forEach((el) => {
    var key = el.getAttribute("i18n");
    if (key != "") {
      var value = el.innerHTML.trim();
      var compare = tags[key];
      if (compare) {
        if (compare != value) {
          if (compare.toLowerCase() == value.toLowerCase()) {
            var exisitingWarning = warnings[key];
            if (exisitingWarning) {
              if (!exisitingWarning.values.includes(value)) {
                exisitingWarning.values.push(value);
              }
            } else {
              warnings[key] = { values: [compare, value] };
            }
          } else {
            var existingError = errors[key];
            if (existingError) {
              if (!existingError.values.includes(value)) {
                existingError.values.push(value);
              }
            } else {
              errors[key] = { values: [compare, value] };
            }
          }
        }
      } else {
        tags[key] = value;
      }
    }
  });
});

const numTags = Object.keys(tags).length;
shell.echo(numTags + " tags found.");
const numWarnings = Object.keys(warnings).length;
if (numWarnings > 0) {
  console.warn(
    `${numWarnings} warning${numWarnings == 1 ? "" : "s"} found:`.yellow
  );
  Object.keys(warnings).forEach((key) => {
    shell.echo(("key: " + key).yellow);
    shell.echo("values:".yellow);
    warnings[key].values.forEach((val) => {
      shell.echo((" - " + val).yellow);
    });
  });
}
const numErrors = Object.keys(errors).length;
if (numErrors > 0) {
  console.error(`${numErrors} error${numErrors == 1 ? "" : "s"} found:`.red);
  Object.keys(errors).forEach((key) => {
    shell.echo(("key: " + key).red);
    shell.echo("values:".red);
    errors[key].values.forEach((val) => {
      shell.echo((" - " + val).red);
    });
  });
  process.exit(1);
}

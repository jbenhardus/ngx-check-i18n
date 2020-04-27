#! /usr/bin/env node

var colors = require("colors");
var findMatches = require("./find-matches");
var fs = require("fs");
var HTMLParser = require("node-html-parser");
var shell = require("shelljs");
var yargs = require("yargs");

var argv = yargs.argv;

if (argv.message) {
  shell.echo(argv.message);
}

var dir = argv.path || ".";
var matches = findMatches(dir, []);

var tags = {};
var errors = {};

matches.forEach((match) => {
  var file = fs.readFileSync(match).toString();
  var root = HTMLParser.parse(file);
  var elements = root.querySelectorAll("[i18n]");
  elements.forEach((el) => {
    var key = el.getAttribute("i18n");
    var value = el.innerHTML.trim();
    var compare = tags[key];
    if (compare) {
      if (compare != value) {
        var existingError = errors[key];
        if (existingError) {
          existingError.values.push(value);
        } else {
          errors[key] = { values: [compare, value] };
        }
      }
    } else {
      tags[key] = value;
    }
  });
});

const numTags = Object.keys(tags).length;
shell.echo(numTags + " tags found.");
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
  throw new Error("Duplicate tags found");
}
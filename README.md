# ngx-check-i18n
A utility that checks angular projects for duplicate ids in `i18n` attributes. It is designed to prevent mistranslations through accidental reuse of tags. Consider the following example where an `i18n` id is accidentally re-used:

`<div i18n="@@loremIpsum1">Lorem ipsum dolor sit amet</div>`

`<div i18n="@@loremIpsum2">consectetur adipiscing elit</div>`

`<div i18n="@@loremIpsum2">sed do eiusmod tempor incididunt</div>`

The utility will flag the mismatch in untranslated text for the `@@loremIpsum2` id as an error. The utility will also identify instances where the casing differs between untranslated text, and flag it as a warning.

## Installation

`npm install --save-dev ngx-check-i18n`


## Usage

`ngx-check-i18n --path [path] --paths [path1 | path2 | ... ]`

### Options

`--path`: the path to the root directory to check. The utility will check all html files in the root directory and all subdirectories.

`--paths`: a list of paths to directories to check.

If neither `--path` nor `--paths` is provided, the utility will use the current directory as the root directory.

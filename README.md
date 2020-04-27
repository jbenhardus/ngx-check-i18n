# ngx-check-i18n
A utility that checks angular projects for duplicate ids in `i18n` attributes.

## Installation

`npm install --save-dev ngx-check-i18n`


## Usage

`ngx-check-i18n --path [path] --paths [path1 | path2 | ... ]`

### Options

`--path`: the path to the root directory to check. The utility will check all html files in the root directory and all subdirectories.

`--paths`: a list of paths to directories to check.

If neither `--path` nor `--paths` is provided, the utility will use the current directory as the root directory.

<img src="https://raw.githubusercontent.com/Raathigesh/Propel/master/docs/Propel.png" alt="propel banner" align="center" />
<br />
<div align="center"><strong>Keep your favorite starter kits just a command away</strong></div>
<p></p>
<p align="center">
  <a href="https://travis-ci.org/Raathigesh/Propel">
    <img src="https://img.shields.io/travis/Raathigesh/Propel.svg?style=flat-square"
         alt="Travis Build">
  </a>
  <a href="https://github.com/Raathigesh/Propel/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/express.svg?maxAge=2592000&style=flat-square"
         alt="License">
  </a>
  <a href="https://www.npmjs.com/package/propel">
    <img src="https://img.shields.io/npm/v/propel.svg?style=flat-square"
         alt="NPM Version">
  </a>
</p>

## Why?
Certain starter kits I use again and again. But it's always a hassel to keep them bookmarked, to find them when required and then clone to a directory.

**Propel** will remember them and clone to the desired directory for you with a single command. But propel is all about remembering a git repo and cloning it to a directory. Use it for anything you like.

## Installation
```
$ npm install Propel -g
```

## Usage
<img src="./docs/Propel.gif" alt="propel banner" align="center" />

Clone a starter kit to the **current working directory**
```
propel
```


Add a new starter kit
```
propel -a
```

Remove a start kit
```
propel -r
```

Export the current starter kits to a JSON file
```
propel -e
```

Import the starter kits from an exported JSON file **from the current working directory**
```
propel -i StaterKit.Json
```

## License
MIT © [Raathigeshan](https://twitter.com/Raathigeshan)

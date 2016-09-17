#!/usr/bin/env node

var fs = require('fs-extra');
var argv = require('yargs').argv;
var inquirer = require('inquirer');
var clone = require('git-clone');
var path = require('path');
var userHome = require('user-home');
var starterKitsDirectory = path.join(userHome, '.starter');
var starterKitsFile = path.join(starterKitsDirectory, 'starterKits.json');
fs.ensureDirSync(starterKitsDirectory);
fs.ensureFileSync(starterKitsFile);

var starterKits = fs.readJsonSync(starterKitsFile, { throws: false });
if (starterKits === null) {
    starterKits = {
        kits: []
    };
    fs.writeFileSync(starterKitsFile, JSON.stringify(starterKits));
}

if (argv.a) {
    addStartKit();
} else if (argv.r) {
    removeStarterKit();
} else {
    if (starterKits.kits.length === 0) {
        console.log("No starter kit available. Use the --add option to add a new one.")
    } else {
        cloneStarterKit();
    }
}

function addStartKit() {
    inquirer.prompt([{
        type: 'input',
        name: 'kit_name',
        message: 'Name of the starter kit?'
    }, {
        type: 'input',
        name: 'kit_url',
        message: 'Git url of the starter kit?'
    }]).then(function (answers) {
        starterKits.kits.push({
            name: answers.kit_name,
            url: answers.kit_url
        })
        fs.writeFileSync(starterKitsFile, JSON.stringify(starterKits));
    });
}

function removeStarterKit() {
    var kit_choices_to_remove = [];
    starterKits.kits.forEach(function (item) {
        kit_choices_to_remove.push({
            name: item.name
        });
    })

    inquirer.prompt([{
        type: 'checkbox',
        name: 'kits_to_remove',
        message: 'Select the starter kits to remove.',
        choices: kit_choices_to_remove
    }]).then(function (answers) {
        removeKitsByName(answers.kits_to_remove);
        fs.writeFileSync(starterKitsFile, JSON.stringify(starterKits));
    });
}

function cloneStarterKit() {
    var kit_choices = [];
    starterKits.kits.forEach(function (item) {
        kit_choices.push(item.name);
    })
    inquirer.prompt([{
        type: 'list',
        name: 'kit_to_clone',
        message: 'Choose a starter kit to clone.',
        choices: kit_choices
    }]).then(function (answers) {
        var gitUrl = getUrlByKitName(answers.kit_to_clone);
        clone(gitUrl, process.cwd());
    });
}

function getUrlByKitName(kitName) {
    for (var i = 0; i < starterKits.kits.length; i++) {
        if (starterKits.kits[i].name === kitName) {
            return starterKits.kits[i].url;
        }
    }
}

function removeKitsByName(toBeRemoved) {
    for (var i = 0; i < starterKits.kits.length; i++) {
        if (toBeRemoved.indexOf(starterKits.kits[i].name) > -1) {
            starterKits.kits.splice(i, 1);
            break;
        }
    }
} 
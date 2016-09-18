#!/usr/bin/env node

var fs = require('fs-extra');
var argv = require('minimist')(process.argv.slice(2));
var inquirer = require('inquirer');
var clone = require('git-clone');
var path = require('path');
var userHome = require('user-home');
var colors = require('colors');
var starterKitsDirectory = path.join(userHome, '.propel');
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
} else if(argv.i) {
    if (typeof argv.i === "string") {
        importStarterKits(path.join(process.cwd(), argv.i));
    } else {
        console.log('Provide the name of the file to import which is in the current working directory.'.yellow)
    }    
} else if(argv.e) {
    exportStarterKits();
} else {
    if (starterKits.kits.length === 0) {
        console.log("No starter kit available. Use the --a option to add a new one.".blue)
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
        if (getKitName(answers.kit_name) !== null) {
            console.log('There is already a starter kit with the same name. Shall we try a differnt name?'.red)
        } else {
            starterKits.kits.push({
                name: answers.kit_name,
                url: answers.kit_url
            })
            fs.writeFileSync(starterKitsFile, JSON.stringify(starterKits));
        }
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
        var gitUrl = getKitName(answers.kit_to_clone).url;
        console.log('Cloning starter kit ' + answers.kit_to_clone + ' (' + gitUrl + ')'.blue);
        clone(gitUrl, process.cwd(), function() {
            console.log("Successfully cloned. Let's get to work.".green);
        });
    });
}

function importStarterKits(filePath) {
    var importedStarterKits = fs.readJsonSync(filePath, { throws: false });
    fs.writeFileSync(starterKitsFile, JSON.stringify(importedStarterKits));
    console.log("Successfully imported.".green);
}

function exportStarterKits() {
    var exportFilePath = path.join(process.cwd(), 'StaterKits.json');
    fs.writeFileSync(exportFilePath, JSON.stringify(starterKits));
    console.log(colors.green('Successfully exported to ' + exportFilePath + '.'));
}

function getKitName(kitName) {
    for (var i = 0; i < starterKits.kits.length; i++) {
        if (starterKits.kits[i].name === kitName) {
            return starterKits.kits[i];
        }
    }

    return null;
}

function removeKitsByName(toBeRemoved) {
    for (var i = 0; i < starterKits.kits.length; i++) {
        if (toBeRemoved.indexOf(starterKits.kits[i].name) > -1) {
            starterKits.kits.splice(i, 1);
            break;
        }
    }
}
'use strict';
const inquirer = require('inquirer');
const chalk = require('chalk');
const fun = require('./functions.js');

// Main menu
function showMenu() {
	/* eslint-disable no-useless-escape */
	console.log(chalk.yellow(`
   /$$$$$$     /$$$$$ /$$$$$$
  /$$__  $$   |__  $$|_  $$_/
 | $$    $$      | $$  | $$
 | $$  | $$      | $$  | $$
 | $$  | $$ /$$  | $$  | $$
 | $$  | $$| $$  | $$  | $$
 |  $$$$$$/|  $$$$$$/ /$$$$$$
  \ _____/  \ _____/   |______

		`));
	/* eslint-enable no-useless-escape */
	return inquirer.prompt([
		{
			type: 'list',
			name: 'option',
			message: `${chalk.green.bold('Welcome to OJI!')} Choose option:`,
			choices: [
				{
					name: 'Create new emoticon',
					value: 'create'
				},
				{
					name: 'Create random emoticon',
					value: 'random'
				},
				{
					name: 'Copy saved emoticons',
					value: 'get'
				},
				{
					name: 'Delete saved emoticons',
					value: 'delete'
				},
				new inquirer.Separator(),
				{
					name: `${chalk.yellow('Report bug')}`,
					value: 'bug'
				},
				{
					name: `${chalk.red('Exit')}`,
					value: 'exit'
				}
			]
		}
	]).then(a => {
		return fun[a.option]();
	}).then(() => {
		return inquirer.prompt([{
			type: 'confirm',
			name: 'exit',
			message: 'Exit utility?',
			default: true
		}]);
	}).then(a => {
		if (a.exit) {
			return fun.exit();
		}
		showMenu();
	});
}

// Handle the error
module.exports = showMenu()
	.catch(err => {
	console.log(chalk.red('Something bad happened (︶︹︺)'));
	console.log(err);
	process.exit(1);
	});

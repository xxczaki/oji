'use strict';
const fs = require('fs');
const homeDir = require('os').homedir();
const chalk = require('chalk');
const clipboardy = require('clipboardy');
const inquirer = require('inquirer');

// Create emoji!
module.exports.create = () => {
	const parts = ['arms_symmetric', 'arms_left', 'bodies_symmetric', 'bodies_left', 'cheeks', 'eyes', 'mouths_noses', 'bodies_right', 'arms_right'].map(fileName =>
    fs.readFileSync(`${__dirname}/parts/${fileName}.txt`, 'utf8').split('\n')
  );
	return inquirer.prompt([
		{
			type: 'list',
			name: 'leftArm',
			message: 'Choose left arm:',
			choices: ['', ...parts[1], ...parts[0]]
		},
		{
			type: 'list',
			name: 'rightArm',
			message: 'Choose right arm:',
			choices: ['', ...parts[8], ...parts[0]]
		},
		{
			type: 'list',
			name: 'leftBody',
			message: 'Choose left body:',
			choices: ['', ...parts[3], ...parts[2]]
		},
		{
			type: 'list',
			name: 'rightBody',
			message: 'Choose right body:',
			choices: ['', ...parts[7], ...parts[2]]
		},
		{
			type: 'list',
			name: 'leftCheek',
			message: 'Choose left cheek:',
			choices: ['', ...parts[4]]
		},
		{
			type: 'list',
			name: 'rightCheek',
			message: 'Choose right cheek:',
			choices: ['', ...parts[4]]
		},
		{
			type: 'list',
			name: 'leftEye',
			message: 'Choose left eye:',
			choices: ['', ...parts[5]]
		},
		{
			type: 'list',
			name: 'rightEye',
			message: 'Choose right eye:',
			choices: ['', ...parts[5]]
		},
		{
			type: 'list',
			name: 'noseMouth',
			message: 'Choose nose/mouth:',
			choices: ['', ...parts[6]]
		}
	]).then(a => { // Show user generated emoji
		const emoji = `${a.leftArm}${a.leftBody}${a.leftCheek}${a.leftEye}${a.noseMouth}${a.rightEye}${a.rightCheek}${a.rightBody}${a.rightArm}`;
		console.log(chalk.cyan(`${chalk.green.bold('This is your emoji:')}`, emoji));
		this.emoji = emoji;
		return inquirer.prompt([ // Copy/Save prompt
			{
				type: 'confirm',
				name: 'copy',
				message: 'Copy it to clipboard?',
				default: true
			},
			{
				type: 'confirm',
				name: 'save',
				message: 'Save this emoji?',
				default: true,
				when: a => {
					if (a.copy) {
						clipboardy.writeSync(this.emoji);
						console.log(chalk.green.bold('Emoji copied to clipboard!'));
					}
					return true;
				}
			}
		]);
	}).then(a => {
		if (a.save) {
			fs.writeFileSync(`${homeDir}/saved_emoji.txt`, `\n${this.emoji}`, {flag: 'a'});
			console.log(chalk.green.bold(`Emoji saved in ${homeDir}!`));
		}
	});
};

// View saved emoji and copy it to clipboard!
module.exports.get = () => {
	let emojiList;
	try {
		emojiList = fs.readFileSync(`${homeDir}/saved_emoji.txt`, 'utf8').split('\n');
	} catch (err) {
		if (err.code === 'ENOENT') {
			console.log(chalk.red(`Emoji not found in ${homeDir}/saved_emoji.txt :(`));
			return;
		}
	}
	return inquirer.prompt([
		{
			type: 'list',
			name: 'emoji',
			message: 'Copy saved emoji to clipboard?',
			choices: emojiList
		}
	]).then(a => {
		clipboardy.writeSync(a.emoji);
		console.log(chalk.green.bold('Emoji copied to clipboard!'));
	});
};

module.exports.example = () => {
	const exam = fs.readFileSync(`${__dirname}/parts/example.txt`, 'utf8').split('\n');
	return inquirer.prompt([
		{
			type: 'list',
			name: 'example',
			message: 'Example emoji list:',
			choices: exam
		}
		/* eslint-disable no-unused-vars */
	]).then(a => {
		console.log(chalk.magenta.bold('See you next time! ♡'));
		process.exit();
	});
};

module.exports.exit = () => { // Exit message
	console.log(chalk.magenta.bold('See you next time! ♡'));
	process.exit();
};

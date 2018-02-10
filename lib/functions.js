'use strict';
const fs = require('fs');
const homeDir = require('os').homedir();
const chalk = require('chalk');
const clipboardy = require('clipboardy');
const opn = require('opn');
const inquirer = require('inquirer');

// Little helper
const getRandomIndex = (length) => {
	return Math.floor(Math.random()*length);
}

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
		console.log(chalk.cyan(`${chalk.green.bold('This is your emoticon:')}`, emoji));
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
				message: 'Save this emoticon?',
				default: true,
				when: a => {
					if (a.copy) {
						clipboardy.write(this.emoji);
						console.log(chalk.green.bold('Emoticon copied to clipboard!'));
					}
					return true;
				}
			}
		]);
	}).then(a => {
		if (a.save) {
			fs.writeFileSync(`${homeDir}/saved_emoji.txt`, `\n${this.emoji}`, {flag: 'a'});
			console.log(chalk.green.bold(`Emoticon saved in ${homeDir}!`));
		}
	});
};

// Create random emoji!
module.exports.random = () => {
	const parts = ['arms_symmetric', 'arms_left', 'bodies_symmetric', 'bodies_left', 'cheeks', 'eyes', 'mouths_noses', 'bodies_right', 'arms_right'].map(fileName =>
		fs.readFileSync(`${__dirname}/parts/${fileName}.txt`, 'utf8').split('\n')
	);
	// Combine random parts
	const leftarmIndex = getRandomIndex([...parts[1], ...parts[0]].length)
	const rightarmIndex = getRandomIndex([...parts[8], ...parts[0]].length)
	const bodyIndex = getRandomIndex([...parts[3], ...parts[2]].length)
	const cheeksIndex = getRandomIndex(parts[4].length)
	const eyesIndex = getRandomIndex(parts[5].length)
	const mouthIndex = getRandomIndex(parts[6].length)
	const selectedParts = {
		leftArm: [...parts[1], ...parts[0]][leftarmIndex],
		rightArm: [...parts[8], ...parts[0]][rightarmIndex],
		leftBody: [...parts[3], ...parts[2]][bodyIndex],
		rightBody: [...parts[7], ...parts[2]][bodyIndex],
		leftCheek: parts[4][cheeksIndex],
		rightCheek: parts[4][cheeksIndex],
		leftEye: parts[5][eyesIndex],
		rightEye: parts[5][eyesIndex],
		noseMouth: parts[6][mouthIndex],
	}
	// Show user generated emoji
	const emoji = `${selectedParts.leftArm}${selectedParts.leftBody}${selectedParts.leftCheek}${selectedParts.leftEye}${selectedParts.noseMouth}${selectedParts.rightEye}${selectedParts.rightCheek}${selectedParts.rightBody}${selectedParts.rightArm}`;
	console.log(chalk.cyan(`${chalk.green.bold('This is your emoticon:')}`, emoji));
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
			message: 'Save this emoticon?',
			default: true,
			when: a => {
				if (a.copy) {
					clipboardy.write(this.emoji);
					console.log(chalk.green.bold('Emoticon copied to clipboard!'));
				}
				return true;
			}
		}
	]).then(a => {
		if (a.save) {
			fs.writeFileSync(`${homeDir}/saved_emoji.txt`, `\n${this.emoji}`, {flag: 'a'});
			console.log(chalk.green.bold(`Emoticon saved in ${homeDir}!`));
		}
	});
}

// View saved emoji and copy it to clipboard!
module.exports.get = () => {
	let emojiList;
	try {
		emojiList = fs.readFileSync(`${homeDir}/saved_emoji.txt`, 'utf8').split('\n');
	} catch (err) {
		if (err.code === 'ENOENT') {
			console.log(chalk.red(`Emoticon not found in ${homeDir}/saved_emoji.txt :(`));
			return;
		}
	}
	return inquirer.prompt([
		{
			type: 'list',
			name: 'emoji',
			message: 'Copy saved emoticon to clipboard?',
			choices: emojiList
		}
	]).then(a => {
		clipboardy.write(a.emoji);
		console.log(chalk.green.bold('Emoticon copied to clipboard!'));
	});
};

module.exports.bug = () => { // Report bug prompt
	opn('https://github.com/xxczaki/oji/issues/new');
	process.exit();
};

module.exports.exit = () => { // Exit message
	console.log(chalk.magenta.bold('See you next time! ♡'));
	process.exit();
};

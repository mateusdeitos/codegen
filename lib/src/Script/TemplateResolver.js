const inquirer = require('inquirer');
const { Config } = require('../config');
const { existsSync, readdirSync } = require('fs');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { parse } = require('../helpers/parsing.helpers');
const { resolve, sep } = require('path');

function TemplateResolver(templatesPath) {
	const _this = {
		templatesPath,
	};

	const parseAnswersToArgs = (answers) => {
		const recursive = (data, prefix = "") => {
			return Object.entries(data).map(([key, val]) => {
				if (typeof val === 'object') {
					return recursive(val, key);
				}

				const newKey = !!prefix ? `${prefix}_${key}` : key;

				return `--${newKey} '${!!val ? val : ""}'`;
			}).join(" ")
		}

		return recursive(answers);
	}

	const applyAnswers = async (answers) => {
		const args = parseAnswersToArgs(answers);
		const templatesPath = resolve(_this.templatesPath);
		const hygenPath = resolve(templatesPath, '..', '..');
		const [hygenAction] = resolve(templatesPath, '..').split(sep).reverse();
		const command = `HYGEN_TMPLS=${hygenPath} yarn --silent hygen ${hygenAction} _templates ${args}`;
		return exec(command);
	}

	return {
		applyAnswers
	}

}


module.exports = { TemplateResolver };

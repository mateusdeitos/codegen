const inquirer = require('inquirer');
const { Config } = require('../config');
const { existsSync } = require('fs');
const { parse } = require('../helpers/parsing.helpers');
const { resolve } = require('path');

function Script(scriptPath) {
	const _this = {
		config: {},
		prompts: [],
		scriptPath: "",
		templatesPath: "",
	};

	if (!existsSync(scriptPath)) {
		throw new Error(`Script ${scriptPath} not found`);
	}

	const constructor = (scriptPath) => {
		const script = require(scriptPath);

		Object.assign(_this, { ...script, scriptPath: scriptPath });
		initConfig();
	};

	const initConfig = () => {
		if (!_this.config) return;
		evalConfigEnums();
	}

	const evalConfigEnums = () => {
		if (!_this.config || !_this.config.enums) return;
		Object.entries(_this.config.enums).forEach(([k, v]) => {
			if (typeof v === 'function') {
				_this.config.enums[k] = v(_this.config);
			} else if (typeof v === 'string') {
				_this.config.enums[k] = parse.phpEnum(resolve(process.cwd(), v));
			}
		});
	}

	const getConfig = () => {
		return _this.config;
	};

	const getPrompts = () => {
		return _this.prompts;
	};

	const isValidParser = (parser) => {
		return !!parser && typeof parser === 'function';
	}

	const getParsers = () => {
		return _this.prompts.reduce((acc, prompt) => {
			if (isValidParser(prompt.parser)) {
				return { ...acc, [prompt.name]: prompt.parser };
			}

			return { ...acc };
		}, {})
	}

	const parseAnswers = (answers) => {
		const parsers = getParsers(answers);
		let parsedAnswers = {};
		Object.entries(answers).forEach(([key, value]) => {
			let parsedAnswer = value;
			if (parsers[key]) {
				let result = parsers[key](value, _this.config)
				if (typeof result === 'string') {
					parsedAnswer = result;
				}
			}
			parsedAnswers[key] = parsedAnswer;
		});

		return parsedAnswers;
	}

	const getScriptPath = () => {
		return _this.scriptPath;
	}

	const getTemplatesPath = () => {
		if (_this.templatesPath) return _this.templatesPath;

		return resolve(_this.scriptPath, '..', '_templates');
	}

	constructor(scriptPath);

	return {
		getConfig,
		getPrompts,
		getScriptPath,
		getTemplatesPath,
		parseAnswers,
	}

}


module.exports = { Script };

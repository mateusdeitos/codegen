const inquirer = require('inquirer');
const { Config } = require('../config');
const { existsSync } = require('fs');

function Script(scriptFile) {
	const $this = {
		config: {},
		prompts: [],
	};

	if (!existsSync(scriptFile)) {
		throw new Error(`Script ${scriptFile} not found`);
	}


	const constructor = (scriptFile) => {
		const script = require(scriptFile);

		Object.assign($this, script);
	};

	const getConfig = () => {
		return $this.config;
	};

	const getPrompts = () => {
		return $this.prompts;
	};

	const isValidParser = (parser) => {
		return !!parser && typeof parser === 'function';
	}

	const getParsers = () => {
		return $this.prompts.reduce((acc, prompt) => {
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
				let result = parsers[key](value, $this.config)
				if (typeof result === 'string') {
					parsedAnswer = result;
				}
			}
			parsedAnswers[key] = parsedAnswer;
		});

		return parsedAnswers;
	}

	constructor(scriptFile);

	return {
		getConfig,
		getPrompts,
		parseAnswers,
	}

}


module.exports = { Script };

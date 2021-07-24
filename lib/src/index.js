#!/usr/bin/env node
const { Config } = require('./config');
const { parse } = require('./helpers/parsing.helpers');
const { Prompter } = require('./Prompter');
const { Runner } = require('./Runner');

(async () => {
	try {
		const config = Config();
		config.extend(parse.argumentsToObject(process.argv));
		config.validate();
		const availableScripts = config.getScripts();
		const { script } = await Prompter(config).PromptChooseScript(availableScripts);
		const runner = Runner(script);
		await runner.run();
	} catch (error) {
		console.error(error);
	}
})()


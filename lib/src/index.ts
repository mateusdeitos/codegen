#!/usr/bin/env node
import { Config } from './config';
import { parse } from './helpers/parsing.helpers';
import { Prompter } from './Prompter';
import { Runner } from './Runner';

(async () => {
	try {
		const config = new Config();
		config.extend(parse.argumentsToObject(process.argv));
		config.validate();
		const availableScripts = config.getScripts();
		const prompter = new Prompter(config)
		const { script } = await prompter.PromptChooseScript(availableScripts);
		const runner = new Runner(script);
		await runner.run();
	} catch (error) {
		console.error(error);
	}
})()


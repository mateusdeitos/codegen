#!/usr/bin/env node
import { InitialConfig } from './config/InitialConfig';
import { parse } from './helpers/parsing.helpers';
import { Prompter } from './Prompter';
import { Runner } from './Runner';

(async () => {
	try {
		const initialConfig = new InitialConfig(parse.argumentsToObject(process.argv));
		initialConfig.validate();
		const prompter = new Prompter(initialConfig)
		const { script } = await prompter.PromptChooseScript(initialConfig.getScripts());
		const runner = new Runner(script);
		await runner.run();
	} catch (error) {
		console.error(error?.message || error);
	}
})()


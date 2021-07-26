#!/usr/bin/env node
import { InitialConfig } from './config/InitialConfig';
import { parse } from './helpers/parsing.helpers';
import { ConfigResolver } from './ConfigResolver';
import { Runner } from './Runner';

(async () => {
	try {
		const initialConfig = new InitialConfig(parse.argumentsToObject(process.argv));
		initialConfig.validate();
		const resolver = new ConfigResolver(initialConfig);
		const ChosenScript = await resolver.resolve();
		const runner = new Runner(ChosenScript);
		await runner.run();
	} catch (error) {
		console.error(error?.message || error);
	}
})()


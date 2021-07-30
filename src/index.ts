#!/usr/bin/env node
import { InitialConfig } from './Config/InitialConfig';
import { parse } from './helpers/parsing.helpers';
import { ConfigResolver } from './ConfigResolver';
import { Runner } from './Runner';
import { CheckboxPrompt } from './Prompt/CheckboxPrompt';
import { ListPrompt } from './Prompt/ListPrompt';
import { InputPrompt } from './Prompt/InputPrompt';
import { CodeGen } from './CodeGen';

(async () => {
	try {
		const initialConfig = InitialConfig.getInstance();
		initialConfig.extend(parse.argumentsToObject(process.argv));
		const resolver = new ConfigResolver(initialConfig);
		const ChosenScript = await resolver.resolve();
		const runner = new Runner(ChosenScript);
		await runner.run();
	} catch (error) {
		console.error(error?.message || error);
	}
})()

export {
	CheckboxPrompt,
	ListPrompt,
	InputPrompt,
	CodeGen,
}

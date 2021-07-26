import { Question } from "inquirer";
import { Config } from "src/config";

export namespace Prompt {
	export type Parser = (value: string, config: Config) => string;
	export type Choice = { 
		name: string;
		value: string;
	}

	export interface PromptQuestion<T = any> extends Question<T> {
		parser: Parser;
		choices?: Choice[]
	}

}


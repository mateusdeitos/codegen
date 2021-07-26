import { Question } from "inquirer";

export namespace Prompt {
	export type Parser = (value: string, config: Record<string, unknown>) => string;
	export type Choice = { 
		name: string;
		value: string;
	}

	export interface PromptQuestion<T = any> extends Question<T> {
		parser: Parser;
		choices?: Choice[]
	}

}


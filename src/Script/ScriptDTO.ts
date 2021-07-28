import { Answers } from "inquirer";
import { BasePrompt } from "../Prompt/BasePrompt";

export type ScriptConfig = {
	pathToTemplates?: string;
	beforeParseAnswers?: (answers: Answers) => Answers;
	afterParseAnswers?: (answers: Answers) => Answers;
} & Record<string,unknown>;
export class ScriptDTO {

	constructor(
		private prompts: BasePrompt[] = [],
		private config: ScriptConfig = {},
	){}

	public getConfig(): ScriptConfig {
		return this.config;
	}

	public getPrompts(): BasePrompt[] {
		return this.prompts;
	}

	public addPrompt(prompt: BasePrompt) {
		if (!(prompt instanceof BasePrompt)) {
			throw new Error("Invalid prompt type");
		}

		this.prompts.push(prompt);
		return this;
	}

	public setPrompts(prompts: BasePrompt[]) {
		this.prompts = prompts;
		return this;
	}

	public setConfig(config: ScriptConfig) {
		this.config = config;
		return this;
	}
}



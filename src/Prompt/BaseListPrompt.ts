import { Answers } from "inquirer";
import { Config } from "../Config";
import { Prompt } from "../Script/types";
import { BasePrompt } from "./BasePrompt";

export abstract class BaseListPrompt extends BasePrompt {
	protected choices?: Prompt.Choices;

	constructor(name: Prompt.PromptQuestion["name"], type: Prompt.PromptQuestion["type"], message: Prompt.PromptQuestion["message"], defaultValue: Prompt.PromptQuestion["default"] = "") {
		super(name, type, message, defaultValue);
	}

	public getChoices() {
		return this.choices;
	}

	public setChoices(choices: Prompt.PromptQuestion["choices"]) {
		this.choices = choices;
		return this;
	}

	public parseChoices(config: Config) {
		if (typeof this.choices === 'function') {
			const clone = this.choices;
			this.setChoices((answers: Answers) => {
				return clone(answers, config.getConfig())
			});
		}
	}

	public getPrompt(): Prompt.PromptQuestion {
		return {
			...super.getPrompt(),
			choices: this.getChoices(),
		}
	}

}

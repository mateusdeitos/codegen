import { Prompt } from "../Script/types";
import { BasePrompt } from "./BasePrompt";

export abstract class BaseListPrompt extends BasePrompt {
	protected choices?: Prompt.Choice[];

	constructor(name: Prompt.PromptQuestion["name"], type: Prompt.PromptQuestion["type"], message: Prompt.PromptQuestion["message"], defaultValue: Prompt.PromptQuestion["default"] = "") {
		super(name, type, message, defaultValue);
	}

	public getChoices() {
		return this.choices;
	}

	public setChoices(choices: Prompt.PromptQuestion["choices"]) {
		this.choices = choices;
	}

	public getPrompt(): Prompt.PromptQuestion {
		return {
			...super.getPrompt(),
			choices: this.getChoices(),
		}
	}

}

import { Prompt } from "../Script/types";
import { BaseListPrompt } from "./BaseListPrompt";

export class CheckboxPrompt extends BaseListPrompt {

	constructor(name: Prompt.PromptQuestion["name"], message: Prompt.PromptQuestion["message"], defaultValue: Prompt.PromptQuestion["default"]) {
		super(name, "checkbox", message, defaultValue);
	}

}

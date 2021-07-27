import inquirer from "inquirer";
import { InitialConfig } from "../Config/InitialConfig";
import { Prompt } from "../Script/types";
import { PromptChooseScript } from "./PromptChooseScript";

type ReturnPrompt = {
	script: string;
}

export class Prompter {

	constructor(private config: InitialConfig) { }

	private async prompt<T>(prompts: Prompt.PromptQuestion[]) {
		return inquirer.prompt<T>(prompts);
	}

	public async PromptChooseScript() {
		return this.prompt<ReturnPrompt>(new PromptChooseScript(this.config, this.config.getScripts()).getPrompts())
	}

}


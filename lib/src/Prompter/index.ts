import inquirer from "inquirer";
import { Prompt } from "src/Script/types";
import { Config } from "../config";
import { PromptChooseScript } from "./PromptChooseScript";

type ReturnPrompt = {
	script: string;
}


export class Prompter {

	constructor(private config: Config) { }

	private async prompt<T>(prompts: Prompt.PromptQuestion[]) {
		return inquirer.prompt<T>(prompts);
	}

	public async PromptChooseScript(scripts: string[]) {
		return this.prompt<ReturnPrompt>(new PromptChooseScript(this.config, scripts).getPrompts())
	}

}


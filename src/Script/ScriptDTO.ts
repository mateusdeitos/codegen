import { BasePrompt } from "../Prompt/BasePrompt";

export class ScriptDTO {

	constructor(
		private prompts: BasePrompt[] = [],
		private config: Record<string,unknown> = {},
	){}

	public getConfig(): Record<string, unknown> {
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

	public setConfig(config: Record<string, unknown>) {
		this.config = config;
		return this;
	}
}



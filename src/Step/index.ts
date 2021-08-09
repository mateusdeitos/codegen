
import { Answers } from 'inquirer';
import { BasePrompt } from '../Prompt/BasePrompt';
export type StepParam = ((answers: Answers, config: Record<string, unknown>) => BasePrompt[]) | BasePrompt[] | BasePrompt;

export class Step {

	private prompts: BasePrompt[];
	private promptsResolver: StepParam;

	constructor(param: StepParam) {
		this.promptsResolver = param;
	}

	public getPrompts(answers: Answers = {}, config: Record<string, unknown> = {}): BasePrompt[] {
		if (typeof this.promptsResolver === 'function') {
			this.prompts = this.promptsResolver(answers, config);
		} else if (Array.isArray(this.promptsResolver)) {
			this.prompts = this.promptsResolver;
		} else if (this.promptsResolver instanceof BasePrompt) {
			this.prompts = [this.promptsResolver];
		}

		if (this.prompts.some(p => !(p.isValid && p.isValid()) || !(p instanceof BasePrompt))) {
			throw new Error('Todos os prompts devem ser uma instância de BasePrompt');
		}

		return this.prompts;
	}

}

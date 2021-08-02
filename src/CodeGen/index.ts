import { Answers } from "inquirer";
import { Template } from "../Template";
import { BasePrompt } from "../Prompt/BasePrompt";

export type ScriptConfigEnums = Array<Record<string, string | number | boolean> | string>;
export type ScriptConfig = {
	onParseAllAnswers?: (answers: Answers, config: Record<string, unknown>) => Answers;
	enums?: ScriptConfigEnums | Record<string, ScriptConfigEnums>;
} & Record<string, unknown>;

export class CodeGen {

	constructor(
		private prompts: BasePrompt[] = [],
		private config: ScriptConfig = {},
		private templates: Template[] = []
	) { }

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
		prompts.forEach(prompt => this.addPrompt(prompt));
		return this;
	}

	public setConfig(config: ScriptConfig) {
		this.config = config;
		return this;
	}

	public getTemplates(): Template[] {
		return this.templates;
	}

	/**
	 * @param {Template} template 
	 * */
	public addTemplate(template: Template) {
		if (!(template instanceof Template)) {
			throw new Error("Template inválido, o template deve ser uma instância de 'Template'");
		}

		this.templates.push(template);
	}

	public static clone(instance: CodeGen) {
		return new CodeGen(
			instance.getPrompts(),
			instance.getConfig(),
			instance.getTemplates()
		);
	}

	public patch(instance: CodeGen) {
		Object.entries(instance).forEach(([key, value]) => {
			if (key in this) {
				this[key] = Array.isArray(this[key])
					? [...this[key], ...value]
					: { ...this[key], ...value };
			}
		})
	}

	public static combine(...instances: CodeGen[]) {
		const result = new CodeGen();

		instances.forEach(instance => result.patch(instance));

		return result;
	}

}



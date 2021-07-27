import { Answers } from "inquirer";
import { Config } from "../config";
import { Prompt } from "../Script/types";

export abstract class BasePrompt {
	protected type: Prompt.PromptQuestion["type"];
	protected name: Prompt.PromptQuestion["name"];
	protected message: Prompt.PromptQuestion["message"];
	protected default?: Prompt.PromptQuestion["default"];
	protected prefix?: Prompt.PromptQuestion["prefix"];
	protected suffix?: Prompt.PromptQuestion["suffix"];
	protected filter?: Prompt.PromptQuestion["filter"];
	protected when?: Prompt.PromptQuestion["when"];
	protected parser?: Prompt.PromptQuestion["parser"];
	protected validate?(input: any, config: Record<string, unknown>, answers?: any): string | boolean | Promise<string | boolean>;

	constructor(name: Prompt.PromptQuestion["name"], type: Prompt.PromptQuestion["type"], message: Prompt.PromptQuestion["message"], defaultValue: Prompt.PromptQuestion["default"] = "", prefix = "", suffix = "") {
		this.name = name;
		this.type = type;
		this.message = message;
		this.default = defaultValue;
		this.prefix = prefix;
		this.suffix = suffix;
	}

	public getName() {
		return this.name;
	}

	public getType() {
		return this.type;
	}

	public getMessage() {
		return this.message;
	}

	public getDefault() {
		return this.default;
	}

	public getPrefix() {
		return this.prefix;
	}

	public getSuffix() {
		return this.suffix;
	}

	public getFilter() {
		return this.filter;
	}

	public getWhen() {
		return this.when;
	}

	public getParser() {
		return this.parser;
	}

	public getValidate() {
		return this.validate;
	}

	public  hasParser() {
		return this.parser && typeof this.parser === 'function';
	}

	public setParser(parser: Prompt.PromptQuestion["parser"]) {
		this.parser = parser;
	}

	public setValidate(validate: Prompt.PromptQuestion["validate"]) {
		this.validate = validate;
	}

	public parseValidate(config: Config) {
		if (typeof this.validate === 'function') {
			this.setValidate((input: string, answers: Answers) => {
				return this.validate(input, answers, config.getConfig());
			});
			return;
		}

		this.setValidate(null);
	}

	public setWhen(when: Prompt.PromptQuestion["when"]) {
		this.when = when;
	}

	public setDefault(defaultValue: Prompt.PromptQuestion["default"]) {
		this.default = defaultValue;
	}

	public setPrefix(prefix: Prompt.PromptQuestion["prefix"]) {
		this.prefix = prefix;
	}

	public setSuffix(suffix: Prompt.PromptQuestion["suffix"]) {
		this.suffix = suffix;
	}

	public setFilter(filter: Prompt.PromptQuestion["filter"]) {
		this.filter = filter;
	}

	public getPrompt(): Prompt.PromptQuestion {
		return {
			name: this.getName(),
			type: this.getType(),
			message: this.getMessage(),
			default: this.getDefault(),
			parser: this.getParser(),
			validate: this.getValidate(),
			when: this.getWhen(),
			filter: this.getFilter(),
			prefix: this.getPrefix(),
			suffix: this.getSuffix(),
		}
	}

}

import { Config } from '../config';
import { existsSync } from 'fs';
import { parse } from '../helpers/parsing.helpers';
import { resolve } from 'path';
import { Prompt } from './types';
import { Answers } from 'inquirer';

export class Script {

	private config: Config;
	private prompts: Prompt.PromptQuestion[];
	private scriptPath: string;
	private templatesPath: string;

	constructor(scriptPath: string) {
		if (!existsSync(scriptPath)) {
			throw new Error(`Script ${scriptPath} not found`);
		}
		this.scriptPath = scriptPath;
		this.config = new Config();

		const script = require(scriptPath);
		this.config.extend(script?.config);
		this.prompts = script?.prompts || [];
		this.templatesPath = script?.templatesPath || "";
		this.initConfig();
	}


	private initConfig() {
		if (!this.config) return;
		this.evalConfigEnums();
	}

	private evalConfigEnums() {
		const enums = this.config.get('enums') || {};
		Object.entries(enums).forEach(([k, v]) => {
			if (typeof v === 'function') {
				enums[k] = v(this.config);
			} else if (typeof v === 'string') {
				enums[k] = parse.phpEnum(resolve(process.cwd(), v));
			}
		});
	}

	public getConfig = () => {
		return this.config;
	};

	public getPrompts = () => {
		return this.prompts;
	};

	private isValidParser = (parser: Prompt.PromptQuestion["parser"]) => {
		return !!parser && typeof parser === 'function';
	}

	private getParsers(): Record<string, Prompt.Parser> {
		return this.prompts.reduce((acc, prompt) => {
			if (prompt.parser && this.isValidParser(prompt.parser)) {
				return { ...acc, [prompt.name]: prompt.parser };
			}

			return { ...acc };
		}, {})
	}

	public parseAnswers(answers: Answers): Answers {
		const parsers = this.getParsers();
		let parsedAnswers = {};
		Object.entries(answers).forEach(([key, value]) => {
			let parsedAnswer = value;
			const parser = parsers[key];
			if (parser) {
				let result = parser(value, this.config);
				if (typeof result === 'string') {
					parsedAnswer = result;
				}
			}
			parsedAnswers[key] = parsedAnswer;
		});

		return parsedAnswers;
	}

	public getScriptPath() {
		return this.scriptPath;
	}

	public getTemplatesPath() {
		if (this.templatesPath) return this.templatesPath;

		return resolve(this.scriptPath, '..', '_templates');
	}

}


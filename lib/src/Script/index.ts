import { Config } from '../config';
import { existsSync } from 'fs';
import { parse } from '../helpers/parsing.helpers';
import { resolve } from 'path';
import { Prompt } from './types';
import { Answers } from 'inquirer';
import { InitialConfig } from '../config/InitialConfig';
import { TemplateResolver } from './TemplateResolver';
import { join } from 'path';
import { BasePrompt } from '../Prompt/BasePrompt';

export class Script {

	private config: Config;
	private prompts: BasePrompt[];
	private scriptPath: string;

	constructor(scriptPath: string) {
		let script = null;
		if (existsSync(join(process.cwd(), scriptPath))) {
			script = require(join(process.cwd(), scriptPath));
			this.scriptPath = join(process.cwd(), scriptPath);
		} else if(existsSync(join(process.cwd(), scriptPath))) {
			script = require(join(process.cwd(), scriptPath));
			this.scriptPath = join(process.cwd(), scriptPath);
		}

		if (!script) {
			throw new Error(`Script ${scriptPath} not found`);
		}

		this.config = new InitialConfig();
		this.config.extend({
			pathToTemplates: resolve(this.scriptPath, '..', TemplateResolver.templatesFolder),
			...script?.config
		});
		this.prompts = script?.prompts || [];
		this.validatePrompts();
		this.initConfig();
	}

	private validatePrompts() {
		if (!this.prompts.every(prompt => prompt instanceof BasePrompt)) {
			throw new Error("Invalid Prompt, all prompts must be an instance of BasePrompt");
		}
	}

	private initConfig() {
		if (!(this.config instanceof Config)) return;
		this.evalConfigEnums();
	}

	private evalConfigEnums() {
		const enums = this.config.get('enums') || {};
		let parsedEnums = {};
		Object.entries(enums).forEach(([k, v]) => {
			if (typeof v === 'function') {
				parsedEnums[k] = v(this.config.getConfig());
			} else if (typeof v === 'string' && v.endsWith(".php")) {
				parsedEnums[k] = parse.phpEnum(resolve(this.scriptPath, '..', v));
			} else if (typeof v === 'object') {
				parsedEnums[k] = v;
			}
		});

		this.config.extend({ enums: parsedEnums });
	}

	public getConfig = () => {
		return this.config;
	};

	public getPrompts = () => {
		return this.parsePrompts(this.prompts);
	};

	private parsePrompts = (prompts: BasePrompt[]) => {
		return prompts.map(prompt => {
			prompt.parseValidate(this.config);
			return {
				...prompt.getPrompt(),
			};
		});
	}

	private getParsers(): Record<string, Prompt.Parser> {
		return this.prompts.reduce((acc, prompt) => {
			if (prompt.hasParser()) {
				return { ...acc, [prompt.getName()]: prompt.getParser() };
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
				let result = parser(value, answers, this.config.getConfig());
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
		if (!this.config.has('pathToTemplates')) {
			throw new Error("Path to templates folder not defined");
		};

		return this.config.get('pathToTemplates');

	}

}


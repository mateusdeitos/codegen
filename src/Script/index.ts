import { Config } from '../Config';
import { existsSync } from 'fs';
import { parse } from '../helpers/parsing.helpers';
import { resolve } from 'path';
import { Prompt } from '../Prompt/types';
import { Answers } from 'inquirer';
import { InitialConfig } from '../Config/InitialConfig';
import { TemplateResolver } from '../TemplateResolver';
import { BasePrompt } from '../Prompt/BasePrompt';
import { CodeGen, ScriptConfig } from '../CodeGen';
import { Template } from '../Template';

export class Script {

	private config: Config;
	private prompts: BasePrompt[];
	private scriptPath: string;
	private templates: Template[];

	constructor(scriptPath: string) {
		let codeGen = null;
		this.config = InitialConfig.getInstance();
		this.scriptPath = scriptPath;

		if (existsSync(this.scriptPath)) {
			codeGen = require(this.scriptPath);
		}

		if (!codeGen) {
			throw new Error(`Script ${this.scriptPath} not found`);
		}

		if (!(codeGen instanceof CodeGen)) {
			throw new Error(`Script ${scriptPath} must export an instance of CodeGen`);
		}

		this.config.extend({
			onParseAllAnswers: null,
			...codeGen.getConfig(),
		} as ScriptConfig);

		this.templates = codeGen.getTemplates();
		if (this.templates.length === 0) {
			this.templates.push(new Template(resolve(this.scriptPath, '..', TemplateResolver.templatesFolder)))
		}

		this.prompts = codeGen.getPrompts();
		this.validatePrompts();
		this.evalConfigEnums();
	}

	private validatePrompts() {
		if (!this.prompts.every(prompt => prompt instanceof BasePrompt)) {
			throw new Error("Prompt inválido, os prompts devem ser uma instância de BasePrompt");
		}

		if (!this.prompts.every(prompt => prompt.isValid())) {
			throw new Error("Prompt inválido, os prompts devem ser uma instância de BasePrompt");
		}
	}

	private evalConfigEnums() {
		const enums = this.config.get('enums') || {};
		let parsedEnums = {};
		Object.entries(enums).forEach(([k, v]) => {
			if (typeof v === 'function') {
				parsedEnums[k] = v(this.config.getConfig());
			} else if (typeof v === 'string' && v.endsWith(".php")) {
				parsedEnums[k] = parse.phpEnum(resolve(process.cwd(), v));
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

	public setPrompts(prompts: BasePrompt[]) {
		this.prompts = prompts;
	}

	public setConfig(config: Config) {
		this.config = config;
	}

	private parsePrompts = (prompts: BasePrompt[]) => {
		return prompts.map(prompt => {
			prompt.parseMethods(this.config);
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
		let parsedAnswers = answers;

		const parsers = this.getParsers();
		Object.entries(parsedAnswers).forEach(([key, value]) => {
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

		if (this.config.hasCallback('onParseAllAnswers')) {
			const onParseAllAnswers = this.config.get('onParseAllAnswers');
			const parsedAnswersCallbackAfter = onParseAllAnswers(parsedAnswers, this.config.getConfig());
			parsedAnswers = {
				...parsedAnswers,
				...parsedAnswersCallbackAfter,
			};
		}

		return parsedAnswers;
	}

	public getScriptPath() {
		return this.scriptPath;
	}

	public getTemplates() {
		if (!this.templates.length) {
			throw new Error(`Nenhuma template encontrada ou informada, você precisa:
				Adicionar templates à instância CodeGen utilizando o método 'addTemplate()', ou
				Criar uma pasta 'templates' no diretório do script.`);
		};

		return this.templates;

	}

}


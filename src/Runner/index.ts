import inquirer, { Answers } from 'inquirer';
import { Script } from '../Script';
import { TemplateResolver, TemplatesRunnerType } from '../TemplateResolver';
import { Logger, runner as hygen } from 'hygen';
import { Prompt } from '../Prompt/types';
import { CommandInterface } from '../Command/CommandInterface';
import { Template } from '../Template';

export class Runner {

	constructor(private resolvedAction: Script | CommandInterface) { }

	public async run() {
		if (this.resolvedAction instanceof Script) {
			return this.runScript(this.resolvedAction);
		} else {
			return this.runCommand(this.resolvedAction);
		}
	}

	public async askPrompts(prompts: Prompt.PromptQuestion[]) {
		return inquirer.prompt(prompts);
	}

	private async runCommand(command: CommandInterface) {
		return command.run(this);
	}

	private async runScript(script: Script) {
		console.log(`running file ${script.getScriptPath()}`);
		const scriptConfig = script.getConfig();
		const answersFromCLIArgs = scriptConfig.has('answers') ? scriptConfig.get('answers') : {};

		const prompts = script.getPrompts().filter(prompt => !(prompt.name in answersFromCLIArgs));

		const answersFromPrompts = await this.askPrompts(prompts);
		const parsedAnswers = script.parseAnswers({
			...answersFromCLIArgs,
			...answersFromPrompts
		});
		await this.createFiles(script.getTemplates(), parsedAnswers, this.getRunner());
	}

	public async createFiles(templates: Template[], answers: Answers, runner: TemplatesRunnerType) {
		const template = new TemplateResolver(templates);
		await template.applyAnswers(answers, runner);
	}

	public getRunner() {
		return async (argv: string[], templatesPath: string) => {
			return await hygen(argv, {
				templates: templatesPath,
				cwd: process.cwd(),
				logger: new Logger(console.log.bind(console)),
				createPrompter: () => require('inquirer'),
				exec: (action, body) => {
					const opts = body && body.length > 0 ? { input: body } : {}
					return require('execa').shell(action, opts)
				},
				debug: !!process.env.DEBUG
			});
		}
	}


}


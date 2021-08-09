import inquirer from 'inquirer';
import { Script } from '../Script';
import { TemplateResolver } from '../TemplateResolver';
import { Logger, runner as hygen } from 'hygen';

export class Runner {

	constructor(private script: Script) { }

	public async run() {
		console.log(`running file ${this.script.getScriptPath()}`);
		const scriptConfig = this.script.getConfig();
		const answersFromCLIArgs = scriptConfig.has('answers') ? scriptConfig.get('answers') : {};

		const prompts = this.script.getPrompts().filter(prompt => !(prompt.name in answersFromCLIArgs));

		const answersFromPrompts = await inquirer.prompt(prompts);
		const parsedAnswers = this.script.parseAnswers({
			...answersFromCLIArgs,
			...answersFromPrompts
		});
		const template = new TemplateResolver(this.script.getTemplates());
		const { paths } = await template.applyAnswers(parsedAnswers, this.getRunner());
		await this.script.onFilesCreated(paths);
	}

	private getRunner() {
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


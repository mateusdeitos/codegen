import { resolve } from 'path';
import { Logger, runner as hygen } from 'hygen';
import { Answers } from 'inquirer';
import { sep } from 'path';
export class TemplateResolver {

	public static templatesFolder = "templates";

	constructor(private templatesPath: string) { }

	private parseAnswersToArgv(answers: Answers = {}) {
		return Object.entries(answers).map(([key, val]) => ["--" + key, val]).reduce((acc, current) => {
			const [key, val] = current;
			return [...acc, key, val]
		}, []);
	}

	public async applyAnswers(answers: Answers) {
		const templatesPath = resolve(this.templatesPath);
		const hygenPath = resolve(templatesPath, '..', '..');
		const [hygenAction] = resolve(templatesPath, '..').split(sep).reverse();
		const argv = this.parseAnswersToArgv(answers);
		argv.unshift(TemplateResolver.templatesFolder);
		argv.unshift(hygenAction);

		const result = await hygen(argv, {
			templates: hygenPath,
			cwd: process.cwd(),
			logger: new Logger(console.log.bind(console)),
			createPrompter: () => require('inquirer'),
			exec: (action, body) => {
				const opts = body && body.length > 0 ? { input: body } : {}
				return require('execa').shell(action, opts)
			},
			debug: !!process.env.DEBUG
		});
		if (!result.success) {
			throw new Error("Ocorreu um erro ao gerar as templates, verifique se o seu script está gerando todas as variáveis necessárias");
		}


		return {
			paths: result.actions.map(({ subject }) => subject)
		};
	}

}

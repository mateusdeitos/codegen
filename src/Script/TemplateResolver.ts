import { resolve } from 'path';
import { Answers } from 'inquirer';
import { sep } from 'path';
import { RunnerResult } from 'hygen/dist/types';

export type TemplatesRunnerType = (argv: string[], templatesPath: string) => Promise<RunnerResult>;
export class TemplateResolver {

	public static templatesFolder = "templates";

	constructor(private templatesPath: string) { }

	private parseAnswersToArgv(answers: Answers = {}) {
		return Object.entries(answers).map(([key, val]) => ["--" + key, val]).reduce((acc, current) => {
			const [key, val] = current;
			return [...acc, key, val]
		}, []);
	}

	public async applyAnswers(answers: Answers, runner: TemplatesRunnerType) {
		const templatesPath = resolve(this.templatesPath);
		const [hygenAction] = resolve(templatesPath, '..').split(sep).reverse();
		const argv = this.parseAnswersToArgv(answers);
		argv.unshift(TemplateResolver.templatesFolder);
		argv.unshift(hygenAction);

		const result = await runner(argv, resolve(templatesPath, '..', '..'));

		if (!result.success) {
			throw new Error("Ocorreu um erro ao gerar as templates, verifique se o seu script está gerando todas as variáveis que a template precisa");
		}

		return {
			paths: result.actions.map(({ subject }) => subject)
		};
	}

}

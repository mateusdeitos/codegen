import { resolve } from 'path';
import { Answers } from 'inquirer';
import { sep } from 'path';
import { RunnerResult } from 'hygen/dist/types';
import { Template } from '../Template';

export type TemplatesRunnerType = (argv: string[], templatesPath: string) => Promise<RunnerResult>;
export class TemplateResolver {

	public static templatesFolder = "templates";

	constructor(private templates: Template[]) { }

	private parseAnswersToArgv(answers: Answers = {}, prefix = "") {
		return Object.entries(answers).reduce((acc, currentAnswer) => {
            const [answerName, answerValue] = currentAnswer;
			if (typeof answerValue === 'object') {
				return [...acc, ...this.parseAnswersToArgv(answerValue, answerName)];
			}

			const _prefix = prefix ? `${prefix}_` : "";

            return [...acc, `--${_prefix}${answerName}`, answerValue];
		}, []);
	}

	public async applyAnswers(answers: Answers, runner: TemplatesRunnerType) {
		const paths = [];

		for await (const template of this.templates) {
			const templatesPath = template.getPath();
			const [hygenAction] = resolve(templatesPath, '..').split(sep).reverse();
			const argv = this.parseAnswersToArgv(answers);
			argv.unshift(TemplateResolver.templatesFolder);
			argv.unshift(hygenAction);

			const result = await runner(argv, resolve(templatesPath, '..', '..'));

			if (!result.success) {
				throw new Error(`Ocorreu um erro ao gerar as templates da pasta ${templatesPath}, verifique se o seu script está gerando todas as variáveis que a template precisa`);
			}

			paths.push(...result.actions.map(({ subject }) => subject))

		}


		return {
			paths
		};
	}

}

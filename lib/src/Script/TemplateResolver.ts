import { promisify } from 'util';
import { resolve, sep } from 'path';
import { Answers } from 'inquirer';
const exec = promisify(require('child_process').exec);

export class TemplateResolver {

	public static templatesFolder = "templates";

	constructor(private templatesPath: string) {}

	private parseAnswersToArgs(answers: Answers) {
		const recursive = (data: Answers, prefix = "") => {
			return Object.entries(data).map(([key, val]) => {
				if (typeof val === 'object') {
					return recursive(val, key);
				}

				const newKey = !!prefix ? `${prefix}_${key}` : key;

				return `--${newKey} '${!!val ? val : ""}'`;
			}).join(" ")
		}

		return recursive(answers);
	}

	public async applyAnswers(answers: Answers) {
		const args = this.parseAnswersToArgs(answers);
		const templatesPath = resolve(this.templatesPath);
		const hygenPath = resolve(templatesPath, '..', '..');
		const [hygenAction] = resolve(templatesPath, '..').split(sep).reverse();
		const command = `HYGEN_TMPLS=${hygenPath} yarn --silent hygen ${hygenAction} ${TemplateResolver.templatesFolder} ${args}`;
		return exec(command);
	}

}

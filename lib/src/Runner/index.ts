import inquirer from 'inquirer';
import { Script } from '../Script';
import { TemplateResolver } from '../Script/TemplateResolver';

export class Runner {

	private script: Script;

	constructor(scriptFile: string) {
		this.script = new Script(scriptFile);
	}

	public async run() {
		console.log(`running file ${this.script.getScriptPath()}`);
		const answers = await inquirer.prompt(this.script.getPrompts());
		const parsedAnswers = this.script.parseAnswers(answers);
		const template = new TemplateResolver(this.script.getTemplatesPath());
		const { stdout } = await template.applyAnswers(parsedAnswers);

		console.log(stdout);
	}


}


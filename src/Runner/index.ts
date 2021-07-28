import inquirer from 'inquirer';
import { Script } from '../Script';
import { TemplateResolver } from '../Script/TemplateResolver';

export class Runner {

	constructor(private script: Script) { }

	public async run() {
		console.log(`running file ${this.script.getScriptPath()}`);
		const answers = await inquirer.prompt(this.script.getPrompts());
		const parsedAnswers = this.script.parseAnswers(answers);
		const template = new TemplateResolver(this.script.getTemplatesPath());
		await template.applyAnswers(parsedAnswers);
	}


}


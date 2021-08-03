
import { Template } from 'src/Template';
import { InputPrompt } from '../Prompt/InputPrompt';
import { Runner } from '../Runner';
import { CommandInterface } from './CommandInterface';

export class NewTemplateCommand implements CommandInterface {
	private command = 'new:template';

	public getCommandName(): string {
		return this.command;
	}

	private getPrompts() {
		return [
			new InputPrompt('destination', 'Defina o diretório de destino para a template')
		];
	}

	public async run(runner: Runner): Promise<void> {
		const answers = await runner.askPrompts(this.getPrompts().map(prompt => prompt.getPrompt()));

		await runner.createFiles([
			new Template(__dirname, '..', '.codegen', 'NewTemplate', 'templates')
		], answers, runner.getRunner());
	}

}

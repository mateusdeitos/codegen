import { Script } from "../Script";
import { InitialConfig } from "../Config/InitialConfig";
import { Prompter } from "../Prompter";
import { CommandInterface } from '../Command/CommandInterface';
import { CommandFactory } from "../Command/CommandFactory";

export class ConfigResolver {
	constructor(private config: InitialConfig) { }

	public async resolve(): Promise<Script | CommandInterface> {
		if (this.config.has('scriptPath')) {
			return new Script(this.config.get('scriptPath'));
		} else if (this.config.has('command')) {
			return CommandFactory.getCommand(this.config.get('command'));
		} else {
			const prompter = new Prompter(this.config)
			const { script } = await prompter.resolve();
			return new Script(script);
		}

	}
}

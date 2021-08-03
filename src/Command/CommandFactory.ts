import { CommandInterface } from "./CommandInterface";
import { NewTemplateCommand } from './NewTemplateCommand';

export type Commands = Record<string, CommandType>;
export type CommandType = CommandInterface;//(runner: Runner) => Promise<void>;

export class CommandFactory {

	private static commands: Commands = {
		[new NewTemplateCommand().getCommandName()]: new NewTemplateCommand()
	};

	public static getCommand(command: string): CommandInterface | undefined  {
		return this.commands[command];
	}

	public static getCommandFromArgs(args: string[]): string | undefined {
		const command = args.find(arg => Object.keys(this.commands).includes(arg));
		return command;
	}
}

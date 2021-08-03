import { Runner } from "src/Runner";

export type CommandType = (runner: Runner) => Promise<void>;
export type Commands = Record<string, CommandType>;


export interface CommandInterface {
	run(runner: Runner): Promise<void>;
}

import { Config } from "../Config";
import { join } from 'path';
import { PromptInterface } from "./types";
import { Prompt } from '../Script/types';

export class PromptChooseScript implements PromptInterface {
	constructor(private config: Config, private scripts = []) { }

	public getPrompts(): Prompt.PromptQuestion[] {
		return [
			{
				name: 'script',
				message: "Escolha qual template deseja gerar",
				type: 'list',
				parser: null,
				choices: this.scripts.map(script => {
					return {
						name: script,
						value: join(script, this.config.get('scriptDefaultName'))
					}
				})
			}
		]
	}
}


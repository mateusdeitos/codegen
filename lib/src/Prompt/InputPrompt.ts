import { BasePrompt } from "./BasePrompt";


export class InputPrompt extends BasePrompt {

	constructor(name: string, message: string) {
		super(name, "input", message);
	}

}

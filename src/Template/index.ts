import { resolve } from 'path';

export class Template {
	private path: string;
	/**
	 * @param {String} path - The path of the template relative to the project root
	 * */
	constructor(...path: string[]) {
		this.path = resolve(...path);
	}

	public getPath() {
		return this.path;
	}
}

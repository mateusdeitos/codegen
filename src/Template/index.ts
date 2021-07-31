

export class Template {
	/**
	 * @param {String} path - The path of the template relative to the project root
	 * */
	constructor(private path: string) {}

	public getPath() {
		return this.path;
	}
}

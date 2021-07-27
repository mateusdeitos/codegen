export abstract class Config {
	private config = {};

	constructor(config: Record<string, unknown> = {}) {		
		this.extend(config);
	}

	protected set(key: string, value: string | unknown) {
		Object.assign(this.config, {
			[key]: value
		});
	}

	public extend(_config = {}) {
		this.config = {
			...this.config,
			..._config,
		};
	}

	public get(key: string) {
		return this.config[key]
	};

	public has(key: string) {
		return this.config.hasOwnProperty(key);
	}

	public getConfig() {
		return this.config;
	}

	public validate() {
		return true;
	}

}

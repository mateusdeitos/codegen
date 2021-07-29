import { existsSync } from 'fs';
import path from 'path';
import { file } from '../helpers/file.helpers';
import { Config } from '.';

let instance: InitialConfig | null = null;

export class InitialConfig extends Config {
	
	constructor(config: Record<string, unknown> = {}) {
		super();

		if (instance instanceof InitialConfig) {
			return this.getInstance();
		}

		this.extend({
			rootDir: path.join(process.cwd(), '.codegen'),
			scriptDefaultName: 'codegen.js',
			...config
		});
		this.set('scripts', this.getScripts());
		this.validate();
		this.setInstance();
	}

	public getInstance() {
		return instance;
	}

	public setInstance() {
		instance = this;
	}

	protected set(key: string, value: string | unknown) {
		if (key === 'rootDir' && typeof value !== 'string') {
			throw new Error('rootDir must be a string');
		}

		if (key === 'rootDir' && typeof value === 'string') {
			this.extend({
				[key]: path.join(process.cwd(), value)
			})
		}

		this.extend({
			[key]: value
		});
	}

	private rootDirExists() {
		return existsSync(this.get('rootDir'));
	}

	public getScripts() {
		if ((this.get('scripts') || []).length > 0) {
			return this.get('scripts');
		}

		if (!this.rootDirExists()) {
			throw new Error("Root directory does not exist");
		};

		const _scripts = file.findFileNameRecursive(this.get('rootDir'), this.get('scriptDefaultName'));

		return _scripts
			.map(script => script.replace(new RegExp(process.cwd(), "g"), ""))
			.map(script => script.replace(new RegExp(`/${this.get('scriptDefaultName')}`, "g"), ""))

	};

	protected validate() {
		if (!this.rootDirExists()) {
			throw new Error("Root directory does not exist");
		};

		if (this.has('scripts') && (this.get('scripts') || []).length === 0) {
			throw new Error(`No script found inside the root directory: ${this.get('rootDir')}`);
		};

		return true;

	}

}

import { existsSync, readdirSync } from 'fs';
import path from 'path';

export class Config {
	private config = {
		rootDir: process.cwd(),
		scriptDefaultName: 'codegen.js',
	};

	private scripts: string[] = [];

	private set(key: string, value: string | unknown) {
		if (key === 'rootDir' && typeof value !== 'string') {
			throw new Error('rootDir must be a string');
		}

		if (key === 'rootDir' && typeof value === 'string') {
			return Object.assign(this.config, {
				[key]: path.join(process.cwd(), value)
			});
		}

		Object.assign(this.config, {
			[key]: value
		});
	}

	public extend(_config = {}) {
		Object.entries(_config).map(([k, v]) => {
			this.set(k, v);
		});
	}

	public get(key: string) {
		return this.config[key]
	};

	public getConfig() {
		return this.config;
	}

	private rootDirExists() {
		return existsSync(this.config.rootDir);
	}

	public getScripts() {
		if (this.scripts.length > 0) {
			return this.scripts;
		}

		if (!this.rootDirExists()) {
			throw new Error("Root directory does not exist");
		};

		const readRecursive = (dir: string): string[] => {
			const files = [];
			readdirSync(dir, { withFileTypes: true }).forEach((file) => {
				if (file.isDirectory()) {
					files.push(...readRecursive(path.join(dir, file.name)));
				}

				if (file.name === this.config.scriptDefaultName) {
					files.push(path.join(dir, file.name));
				}

			});

			return files;
		}

		const _scripts = readRecursive(this.config.rootDir);

		Object.assign(this.scripts, _scripts
			.map(script => script.replace(new RegExp(process.cwd(), "g"), ""))
			.map(script => script.replace(new RegExp(`/${this.config.scriptDefaultName}`, "g"), ""))
		)

		return this.scripts;

	};

	public validate() {
		if (!this.rootDirExists()) {
			throw new Error("Root directory does not exist");
		};

		this.getScripts()
		if (this.scripts.length === 0) {
			throw new Error(`No script found inside the root directory: ${this.config.rootDir}`);
		};

	}

}

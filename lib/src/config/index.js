const { existsSync, readdirSync } = require('fs');
const path = require('path');
const { Events, eventsEnum } = require('../events');

let instance = null;

function Config() {

	if (!!instance) {
		return instance;
	}

	instance = (function () {
		const config = {
			rootDir: process.cwd(),
			scriptDefaultName: 'codegen.js',
		};

		const scripts = [];

		const set = (key, value) => {
			if (key === 'rootDir') {
				return Object.assign(config, {
					[key]: path.join(process.cwd(), value)
				});
			}

			Object.assign(config, {
				[key]: value
			});
		}

		const extend = (_config = {}) => {
			Object.entries(_config).map(([k, v]) => {
				set(k, v);
			});
		}

		const get = (key) => config[key];

		const getConfig = () => config;

		const rootDirExists = () => existsSync(config.rootDir);

		const getScripts = () => {
			if (scripts.length > 0) {
				return scripts;
			}

			if (!rootDirExists()) {
				throw new Error("Root directory does not exist");
			};

			const readRecursive = (dir) => {
				const files = [];
				readdirSync(dir, { withFileTypes: true }).forEach((file) => {
					if (file.isDirectory()) {
						files.push(...readRecursive(path.join(dir, file.name)));
					}

					if (file.name === config.scriptDefaultName) {
						files.push(path.join(dir, file.name));
					}

				});

				return files;
			}

			const _scripts = readRecursive(config.rootDir);

			Object.assign(scripts, _scripts
				.map(script => script.replace(new RegExp(process.cwd(), "g"), ""))
				.map(script => script.replace(new RegExp(`/${config.scriptDefaultName}`, "g"), ""))
			)

			return scripts;

		};

		const validate = () => {
			if (!rootDirExists()) {
				throw new Error("Root directory does not exist");
			};

			getScripts()
			if (scripts.length === 0) {
				throw new Error(`No script found inside the root directory: ${config.rootDir}`);
			};

		}

		return {
			extend,
			getConfig,
			get,
			rootDirExists,
			getScripts,
			validate,
		}
	})()

	return instance;

}

module.exports = {
	Config,
}

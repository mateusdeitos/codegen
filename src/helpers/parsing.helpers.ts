import { existsSync, readFileSync } from 'fs';
import Engine from 'php-parser';

export const parse = {
	argumentsToObject: (args: string[] = []) => {
		let result = {
			answers: {}
		};
		args.forEach((arg: string) => {
			const argParts = arg.split('=');
			if (argParts.length === 2) {
				const [key, value] = argParts;
				if (key.startsWith("--")) {
					result.answers[key.substring(2)] = value;
				}
				result[key] = value;
			}
		});
		return result;
	},

	phpEnum: (phpFile = "") => {
		if (!existsSync(phpFile)) {
			return null;
		}

		//@ts-ignore
		const phpParser = new Engine({
			parser: {
				php7: true
			},
		});

		const getClassConstants = (parsedClass) => {
			if (!parsedClass || typeof parsedClass !== 'object') return null;
			const constants = [];

			const iterable = Array.isArray(parsedClass) ? parsedClass : Object.values(parsedClass);

			iterable.forEach((value) => {
				if (!value) return;
				if ((typeof value === 'object') && "kind" in value && value.kind === "constant") {
					constants.push(value);
				}

				if (typeof value === 'object') {
					constants.push(...getClassConstants(value));
				}
			});

			return constants;
		};

		try {
			const parsed = phpParser.parseCode(readFileSync(phpFile, 'utf8'));
			const constants = getClassConstants(parsed);
			if (!constants || !Array.isArray(constants)) {
				throw new Error("Invalid parsing result");
			}

			const parsedEnum = constants.reduce((acc, constante) => {
				const { name, value } = constante;
				return {
					...acc,
					[name.name]: value.value
				}
			}, {});

			return parsedEnum;
		} catch (error) {
			throw new Error("Não foi possível converter o enum: " + phpFile);
		}
	},
};


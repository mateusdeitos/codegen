const { existsSync, readFileSync } = require('fs');
const engine = require('php-parser');
const { resolve } = require('path');

module.exports.parse = {
	argumentsToObject: function (args = []) {
		let result = {};
		args.forEach(function (arg) {
			const argParts = arg.split('=');
			if (argParts.length === 2) {
				result[argParts[0]] = argParts[1];
			}
		});
		return result;
	},

	phpEnum: function (phpFile = "") {
		const phpParser = new engine({
			parser: {
				php7: true
			},
		});

		if (!existsSync(phpFile)) {
			return null;
		}

		try {
			const parsed = phpParser.parseCode(readFileSync(phpFile, 'utf8'));

			if (!parsed || !(parsed.children || []).length || !(parsed.children[0].body || []).length) {
				throw new Error("Invalid parsing result");
			}

			const parsedEnum = parsed.children[0].body.reduce((acc, constante) => {
				const { constants } = constante;
				const { name } = constants[0].name;
				const { value } = constants[0].value;
				return {
					...acc,
					[name]: value
				}
			}, {});

			return parsedEnum;
		} catch (error) {
			throw new Error("Não foi possível converter o enum: " + phpFile);
		}

	}
}



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
	}
}

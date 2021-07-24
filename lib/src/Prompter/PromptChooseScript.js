const path = require('path');
const { Config } = require('../config');

function PromptChooseScript(config, scripts = []) {
	return [
		{
			name: 'script',
			message: "Escolha qual template deseja gerar",
			type: 'list',
			choices: scripts.map(script => {
				return {
					name: script,
					value: path.join(process.cwd(), script, config.get('scriptDefaultName'))
				}
			})
		}
	]
}

module.exports = { PromptChooseScript }

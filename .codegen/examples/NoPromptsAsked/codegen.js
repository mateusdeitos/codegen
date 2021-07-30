// const { InputPrompt, CodeGen, CheckboxPrompt } = require('simple-codegen');
const { CodeGen, InputPrompt, CheckboxPrompt } = require('../../../dist');

const codeGen = new CodeGen().setConfig({
	enums: {
		Teste: ".codegen/examples/NoPromptsAsked/testeEnum.php"
	}
}).addPrompt(new InputPrompt('objeto', "").setParser((value, answers, config) => {
	return JSON.stringify(config.enums.Teste, null, 2);
}))

module.exports = codeGen;

// const { InputPrompt, ScriptDTO, CheckboxPrompt } = require('codegen-mateusdeitos');
const { ScriptDTO, InputPrompt, CheckboxPrompt } = require('../../../dist');

const scriptDTO = new ScriptDTO();
scriptDTO.addPrompt(
	new InputPrompt('name', 'Qual é o nome do controller?')
);
scriptDTO.addPrompt(
	new CheckboxPrompt('methods', 'Escolha os métodos do controller').setChoices([
		{
			name: 'index',
			value: 'index'
		},
		{
			name: 'show',
			value: 'show'
		}
	])
).setConfig({
	afterParseAnswers: (answers, config) => {
		if (answers.methods && Array.isArray(answers.methods)) {
			const method_show = answers.methods.includes('show') ? 'public show(id) {\nreturn "Show"\n}' : "";
			const method_index = answers.methods.includes('index') ? 'public index() {\nreturn "Index"\n}' : "";
			return {
				method_show,
				method_index,
			}
		}
	}
})

module.exports = scriptDTO;

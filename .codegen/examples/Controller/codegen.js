const { InputPrompt, ScriptDTO, CheckboxPrompt } = require('codegen-mateusdeitos');
// const { ScriptDTO, InputPrompt } = require('../../../dist');

const scriptDTO = new ScriptDTO();
scriptDTO.addPrompt(
	new InputPrompt('name', 'Qual é o nome do controller?')
);
scriptDTO.addPrompt(
	new CheckboxPrompt('methods', 'Escolha os métodos do controller').setChoices([
		{
			name: 'index',
			value: 'public index() {\n}'
		},
		{
			name: 'show',
			value: 'public show(id) {\n}'
		}
	])
)

module.exports = scriptDTO;

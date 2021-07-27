// const { InputPrompt } = require('codegen-mateusdeitos');
const { ScriptDTO, InputPrompt } = require('../../../dist');

const scriptDTO = new ScriptDTO().addPrompt(
	new InputPrompt('name', 'Qual é o nome do controller?')
);

module.exports = scriptDTO;

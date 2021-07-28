const { InputPrompt, ScriptDTO, CheckboxPrompt } = require('codegen-mateusdeitos');
// const { ScriptDTO, InputPrompt, CheckboxPrompt } = require('../../../dist');

const interfacesMethodsEnum = {
	ShowProdutoInterface: [
		'show($id)',
		'index()'
	],
	CreateProdutoInterface: [
		'create(ProdutoDTO $produto)'
	],
	UpdateProdutoInterface: [
		'update(int $id, ProdutoDTO $produto)'
	],
	DeleteProdutoInterface: [
		'delete(int $id)'
	]
}
	;

const scriptDTO = new ScriptDTO();
scriptDTO.setPrompts([
	new InputPrompt('name', 'Qual é o nome do controller?'),
	new CheckboxPrompt('interfaces', 'Definas as interfaces que o controller irá implementar').setChoices(Object.entries(interfacesMethodsEnum).map(([interface, methods]) => {
		return {
			name: interface,
			value: {
				methods,
				interface,
			},
		}
	}))
])

scriptDTO.setConfig({
	afterParseAnswers: (answers, config) => {
		if (answers.interfaces && Array.isArray(answers.interfaces)) {
			const convertMethod = (method) => {
				return `\tpublic function ${method} {\n\t\treturn "";\n\t}`;
			}

			return {
				interface_methods: answers.interfaces.map(({ methods }) => methods).flat().map(convertMethod).join('\n'),
				interfaces: answers.interfaces.map(({ interface }) => interface).join(", ")
			}
		}

		return {
			interfaces: "",
			interface_methods: ""
		};
	},
	enums: interfacesMethodsEnum
})

module.exports = scriptDTO;

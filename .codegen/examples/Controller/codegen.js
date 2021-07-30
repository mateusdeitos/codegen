const { InputPrompt, CodeGen, CheckboxPrompt } = require('simple-codegen');
// const { CodeGen, InputPrompt, CheckboxPrompt } = require('../../../dist');

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
};

const codeGen = new CodeGen();

codeGen.setPrompts([
	new InputPrompt('name', 'Qual é o nome do controller?'),
	new CheckboxPrompt('interfaces', 'Defina as interfaces que o controller irá implementar').setChoices(Object.entries(interfacesMethodsEnum).map(([interface, methods]) => {
		return {
			name: interface,
			value: {
				methods,
				interface,
			},
		}
	}))
])

codeGen.setConfig({
	afterParseAnswers: (answers, config) => {
		if (answers.interfaces && Array.isArray(answers.interfaces)) {
			const convertMethod = (method) => {
				return `\tpublic function ${method} {\n\t\treturn "";\n\t}`;
			}

			return {
				interface_methods: [...answers.interfaces.map(({ methods }) => methods)].map(convertMethod).join('\n'),
				interfaces: answers.interfaces.map(({ interface }) => interface).join(", ")
			}
		}

		return {
			interfaces: "",
			interface_methods: ""
		};
	},
	enums: { ...interfacesMethodsEnum, teste: ".codegen/examples/Controller/testeEnum.php" }
})

module.exports = codeGen;

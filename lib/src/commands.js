const { existsSync, mkdirSync } = require('fs');
const inquirer = require('inquirer')
const path = require('path');
const commands = {
	init: {
		isAvailable: (dir) => !existsSync(dir),
		prompt: () => {
			inquirer.prompt([{
				name: "init",
				type: "confirm",
				message: "A pasta .codegen não foi encontrada, deseja inicializar o projeto?",
			}])
			.then(answers => {
				if (answers.init) {
					commands.init.run();
				}
			})
		},
		run: () => {
			console.log("Inicializando o projeto...");
			// create a folder
			const codegen = path.resolve(process.cwd(), '.codegen');
			if (!existsSync(codegen)) {
				mkdirSync(codegen);
			}
	
			console.log("Projeto criado");
		}
	},
	pickScript: {
		isAvailable: () => !commands.init.isAvailable()
	}

};

module.exports = {
	commands
}

const inquirer = require("inquirer");
const { PromptChooseScript } = require("./PromptChooseScript");


function Prompter(config) {

	const prompt = (prompts) => {
		return inquirer.prompt(prompts);
	}


	return {
		PromptChooseScript: (scripts) => prompt(PromptChooseScript(config, scripts))
	}

}

module.exports = { Prompter }

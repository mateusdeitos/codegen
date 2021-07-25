const inquirer = require('inquirer');
const { Script } = require('../Script');
const { TemplateResolver } = require('../Script/TemplateResolver');

function Runner(scriptFile) {
	const script = Script(scriptFile);

	const run = async () => {
		console.log(`running file ${scriptFile}`);
		const answers = await inquirer.prompt(script.getPrompts());
		const parsedAnswers = script.parseAnswers(answers);
		const template = TemplateResolver(script.getTemplatesPath());
		const response = await template.applyAnswers(parsedAnswers);

		console.log(response.stdout);
	}

	return { run }

}


module.exports = { Runner };

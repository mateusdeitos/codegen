const inquirer = require('inquirer');
const { Script } = require('../Script')

function Runner(scriptFile) {
	const script = Script(scriptFile);

	const run = async () => {
		console.log(`running file ${scriptFile}`);
		console.log(`prompts: ${script.getPrompts()}`);
		const answers = await inquirer.prompt(script.getPrompts());
		const parsedAnswers = script.parseAnswers(answers);
		console.log(JSON.stringify(parsedAnswers, null, 2));
	}

	return { run }

}


module.exports = { Runner };

const { InputPrompt } = require('codegen-mateusdeitos');

const ref = new InputPrompt('ref', 'Defina a ref da plataforma')
	.setValidate((ref, answers, config) => {
		if (!config.refsAllowed.includes(ref)) {
			return `A ref ${ref} não é permitida`;
		}

		return true;
	}).setParser((ref, answers, config) => ref);

module.exports = {
	prompts: [
		ref,
	],
	config: {
		refsAllowed: ['EcommerceE', 'EcommerceF'],
		enums: {
			IntegracaoEcommerceEnum: 'EcommerceEnum.php'
		}
	}
}

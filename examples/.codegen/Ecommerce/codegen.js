module.exports = {
	prompts: [
		{
			name: 'ref',
			type: 'text',
			message: 'Defina a ref da plataforma',
			validate: (ref, answers, config) => {
				if (!config.refsAllowed.includes(ref)) {
					return `A ref ${ref} não é permitida`;
				}

				return true;
			},
			parser: (ref, answers, config) => {
				return ref;
			}
		}
	],
	config: {
		refsAllowed: ['EcommerceE', 'EcommerceF'],
		enums: {
			IntegracaoEcommerceEnum: 'EcommerceEnum.php'
		}
	}
}

module.exports = {
	prompts: [
		{
			name: 'ref',
			type: 'text',
			message: 'Defina a ref da plataforma',
			parser: (ref, config) => {
				if (ref && config.refsAllowed.includes(ref)) {
					return ref.toUpperCase();
				}
				return ref;
			}
		}
	],
	config: {
		refsAllowed: ['Olá']
	}
}

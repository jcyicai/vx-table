module.exports = {
	root: true,
	parserOptions: {
		parser: '@babel/eslint-parser',
		sourceType: 'module'
	},
	env: {
		browser: true,
		node: true,
		es6: true
	},
	extends: ['plugin:vue/recommended', 'eslint:recommended', 'plugin:prettier/recommended', 'prettier'],
	rules: {
		'no-unused-vars': 'off',
		'no-useless-escape': 0,
		'no-console': 'off',
		'vue/no-v-html': 'off',
		'no-debugger': 'off',
		'vue/no-side-effects-in-computed-properties': 'off'
	}
}

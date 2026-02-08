// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/comma-dangle': ['error', 'always-multiline'],
    '@stylistic/semi': ['error', 'always'],
    '@stylistic/indent': ['error', 2],
    '@stylistic/quotes': ['error', 'single', {
      avoidEscape: true,
      allowTemplateLiterals: 'always',
    }],
    'vue/html-quotes': ['error', 'double'],
  },
});

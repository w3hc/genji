import nextConfig from 'eslint-config-next'

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'server.js', 'customize.js'],
  },
  ...nextConfig,
  {
    rules: {
      // Enable stricter accessibility rules
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      // Disable display name requirement - modern React DevTools infer names from variables
      // 'react/display-name': 'off',
    },
  },
]

export default eslintConfig

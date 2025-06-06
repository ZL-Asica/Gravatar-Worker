import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  ignores: ['worker-configuration.d.ts'],
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  lessOpinionated: true,
}, {
  files: ['src/**/**.tsx'],
  rules: {
    'ts/promise-function-async': 'off',
  },
}, {
  files: ['src/utils/imgProcessor.ts'],
  rules: {
    'antfu/no-import-node-modules-by-path': 'off',
  },
})

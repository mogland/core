module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'chore',
        'docs',
        'style',
        'test',
        'ci',
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'other',
        'core',
        'user-service',
        'app',
        'pnpm',
        'shared',
        'utils',
        'cache',
        'database',
        'helper',
        'auth',
      ],
    ],
  },
};

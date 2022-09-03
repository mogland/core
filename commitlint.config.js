module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'revert',
        'chore',
        'ci',
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'core',
        'user-service',
        'app',
        'pnpm',
        'shared',
        'utils',
        'cache',
        'database',
        'helper',
      ],
    ],
  },
};

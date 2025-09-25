/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',        // usa o ts-jest para transformar TypeScript
  testEnvironment: 'node',  // ambiente de teste Node.js
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/*.test.ts'], // vai rodar arquivos que terminam com .test.ts
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // garante que usa seu tsconfig
    },
  },
};

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Indica las extensiones de archivos que se deben considerar.
    moduleFileExtensions: ['js', 'json', 'ts'],
    // Raíz del código fuente de las pruebas
    rootDir: '.',
    // RegEx para encontrar archivos de prueba
    testRegex: '.*\\.spec\\.ts$',
    // Usamos ts-jest para transformar archivos .ts
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    // Ignorar la transformación en node_modules (opcional: se puede agregar excepciones)
    transformIgnorePatterns: ['/node_modules/'],
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: './coverage',
  };
  
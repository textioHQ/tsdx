/**
 * @jest-environment node
 */
'use strict';

const fs = require('fs');
const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = false;

const stageName = 'stage-build';

describe('tsdx build', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
  });

  it('should compile files into a dist directory', () => {
    util.setupStageWithFixture(stageName, 'build-default');

    const output = shell.exec('node ../dist/index.js build --format esm,cjs');

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.cjs.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.cjs.production.min.js')
    ).toBeTruthy();
    expect(shell.test('-f', 'dist/build-default.esm.js')).toBeTruthy();

    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();

    expect(output.code).toBe(0);
  });

  it('should create the library correctly', () => {
    util.setupStageWithFixture(stageName, 'build-default');

    shell.exec('node ../dist/index.js build');

    const lib = require(`../../${stageName}/dist`);
    expect(lib.foo()).toBe('bar');
  });

  it('should fail gracefully with exit code 1 when build failed', () => {
    util.setupStageWithFixture(stageName, 'build-invalid');
    const code = shell.exec('node ../dist/index.js build').code;
    expect(code).toBe(1);
  });

  describe(`source maps`, () => {
    const builtDistDir = `./dist`;
    function getSourceMapFiles() {
      const files = fs.readdirSync(builtDistDir);
      return files
        .filter(filename => filename.endsWith(`.js.map`))
        .map(filename => `${builtDistDir}/${filename}`);
    }

    beforeEach(() => {
      util.setupStageWithFixture(stageName, 'build-default');
      shell.exec('node ../dist/index.js build');
    });

    it(`generates source maps`, () => {
      const sourceMapFiles = getSourceMapFiles();
      const expectedFiles = [
        `${builtDistDir}/build-default.cjs.development.js.map`,
        `${builtDistDir}/build-default.cjs.production.min.js.map`,
        `${builtDistDir}/build-default.esm.js.map`,
      ];
      expect(sourceMapFiles).toEqual(expectedFiles);
    });

    it(`transforms paths to be relative to the root directory, with the package name prefixed`, () => {
      const sourceMapFiles = getSourceMapFiles();
      const expectedSources = [
        'build-default/src/foo.ts',
        'build-default/src/index.ts',
      ];

      sourceMapFiles.forEach(file => {
        const fileContents = JSON.parse(fs.readFileSync(file));
        const sources = fileContents.sources;

        expect(sources).toEqual(expectedSources);
      });
    });
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});

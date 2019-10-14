import { DEFAULT_EXTENSIONS } from '@babel/core';
import { safeVariableName, safePackageName, external } from './utils';
import { paths } from './constants';
import { terser } from 'rollup-plugin-terser';
// import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import ts from '@wessberg/rollup-plugin-ts';
import { ScriptTarget, JsxEmit } from 'typescript';
import path from 'path';
import { extractErrors } from './errors/extractErrors';
import { babelPluginTsdx } from './babelPluginTsdx';
import { TsdxOptions } from './types';

const errorCodeOpts = {
  errorMapFilePath: paths.appErrorsJson,
};

// shebang cache map thing because the transform only gets run once
let shebang: any = {};

export function createRollupConfig(opts: TsdxOptions) {
  const findAndRecordErrorCodes = extractErrors({
    ...errorCodeOpts,
    ...opts,
  });

  const shouldMinify =
    opts.minify !== undefined ? opts.minify : opts.env === 'production';

  const outputName = [
    `${paths.appDist}/${safePackageName(opts.name)}`,
    opts.format,
    opts.env,
    shouldMinify ? 'min' : '',
    'js',
  ]
    .filter(Boolean)
    .join('.');

  return {
    // Tell Rollup the entry point to the package
    input: opts.input,
    // Tell Rollup which packages to ignore
    external: (id: string) => {
      if (id === 'babel-plugin-transform-async-to-promises/helpers') {
        return false;
      }
      return external(id);
    },
    // Establish Rollup output
    output: {
      // Set filenames of the consumer's package
      file: outputName,
      // Pass through the file format
      format: opts.format,
      // Do not let Rollup call Object.freeze() on namespace import objects
      // (i.e. import * as namespaceImportObject from...) that are accessed dynamically.
      freeze: false,
      // Do not let Rollup add a `__esModule: true` property when generating exports for non-ESM formats.
      esModule: false,
      // Rollup has treeshaking by default, but we can optimize it further...
      treeshake: {
        // We assume reading a property of an object never has side-effects.
        // This means tsdx WILL remove getters and setters on objects.
        //
        // @example
        //
        // const foo = {
        //  get bar() {
        //    console.log('effect');
        //    return 'bar';
        //  }
        // }
        //
        // const result = foo.bar;
        // const illegalAccess = foo.quux.tooDeep;
        //
        // Punchline....Don't use getters and setters
        propertyReadSideEffects: false,
      },
      name: opts.name || safeVariableName(opts.name),
      sourcemap: true,
      sourcemapPathTransform: (sourcePath: string) => {
        // Transform the relative-to-the-dist-folder source paths we get by default
        // into ones relative to the app root and prefixed with the package name
        // e.g. ../src/foo/bar.ts -> my-package-name/src/foo/bar.ts
        //
        // This fixes a monorepo issue where, when these source maps get bundled by a consumer's
        // webpack, everything mistakenly gets lumped under a single src directory
        // https://github.com/rollup/rollup/issues/2168#issuecomment-416628432
        const absoluteSourcePath = path.resolve(paths.appDist, sourcePath);
        const prefixedSourcePath = absoluteSourcePath.replace(
          paths.appRoot,
          opts.name
        );
        return prefixedSourcePath;
      },
      globals: { react: 'React', 'react-native': 'ReactNative' },
      exports: 'named',
    },
    plugins: [
      !!opts.extractErrors && {
        transform(source: any) {
          findAndRecordErrorCodes(source);
          return source;
        },
      },
      resolve({
        mainFields: [
          'module',
          'main',
          opts.target !== 'node' ? 'browser' : undefined,
        ].filter(Boolean) as string[],
      }),
      opts.format === 'umd' &&
        commonjs({
          // use a regex to make sure to include eventual hoisted packages
          include: /\/node_modules\//,
        }),
      json(),
      {
        // Custom plugin that removes shebang from code because newer
        // versions of bublé bundle their own private version of `acorn`
        // and I don't know a way to patch in the option `allowHashBang`
        // to acorn. Taken from microbundle.
        // See: https://github.com/Rich-Harris/buble/pull/165
        transform(code: string) {
          let reg = /^#!(.*)/;
          let match = code.match(reg);

          shebang[opts.name] = match ? '#!' + match[1] : '';

          code = code.replace(reg, '');

          return {
            code,
            map: null,
          };
        },
      },
      ts({
        hook: {
          outputPath: (fp, kind) => {
            if (/declaration/.test(kind) && opts.format === 'esm') {
              return path.join(path.dirname(fp), 'index.d.ts');
            }
          },
        },
        tsconfig: tsconfig => ({
          ...tsconfig,
          target: ScriptTarget.ESNext,
          sourceMap: true,
          declaration: opts.format === 'esm',
          jsx: JsxEmit.React,
        }),
        transpiler: 'babel',
      }),
      babelPluginTsdx({
        exclude: 'node_modules/**',
        extensions: [...DEFAULT_EXTENSIONS, 'ts', 'tsx'],
        passPerPreset: true,
        custom: {
          targets: opts.target === 'node' ? { node: '8' } : undefined,
          extractErrors: opts.extractErrors,
          format: opts.format,
          // defines: opts.defines,
        },
      }),
      opts.env !== undefined &&
        replace({
          'process.env.NODE_ENV': JSON.stringify(opts.env),
        }),
      sourceMaps(),
      // sizeSnapshot({
      //   printInfo: false,
      // }),
      shouldMinify &&
        terser({
          sourcemap: true,
          output: { comments: false },
          compress: {
            keep_infinity: true,
            pure_getters: true,
            passes: 10,
          },
          ecma: 5,
          toplevel: opts.format === 'cjs',
          warnings: true,
        }),
    ],
  };
}

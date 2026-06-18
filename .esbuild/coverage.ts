import { readFile } from 'node:fs/promises';
import { transform, type Plugin } from 'esbuild';
import { createInstrumenter } from 'istanbul-lib-instrument';

/** Instrument source for Cypress e2e coverage only when explicitly requested. */
export const coverageEnabled = process.env.MERMAID_COVERAGE === 'true';

/**
 * esbuild plugin that instruments package source with istanbul so Cypress e2e
 * runs can collect coverage (`window.__coverage__`).
 *
 * Background: e2e coverage used to work via `vite-plugin-istanbul` when the
 * bundle was built with vite. When the build migrated to esbuild the
 * instrumentation was not carried over, so every e2e coverage report was empty.
 * This plugin restores it for the esbuild build.
 *
 * esbuild has no native istanbul support, so each matching file is transpiled to
 * JS first (istanbul is babel-based and cannot parse TypeScript) and then
 * instrumented before being handed back to esbuild for bundling.
 */
export const coveragePlugin = (): Plugin => ({
  name: 'mermaid-istanbul-coverage',
  setup(build) {
    const instrumenter = createInstrumenter({
      esModules: true,
      compact: false,
      produceSourceMap: true,
      coverageVariable: '__coverage__',
    });

    // Only the mermaid package's own source. Scoping here keeps coverage focused
    // on the library, and avoids per-file transpilation breaking bare type
    // re-exports in generated barrels (e.g. the langium-generated parser
    // `index.ts`), which whole-program bundling would otherwise drop. mermaid's
    // source enforces `consistent-type-imports`, so it has no such bare exports.
    // Generated code, mocks and tests are excluded as before.
    build.onLoad({ filter: /packages\/mermaid\/src\/.+\.(ts|js)$/ }, async (args) => {
      if (
        args.path.includes('/node_modules/') ||
        args.path.includes('/generated/') ||
        args.path.includes('/__mocks__/') ||
        /\.(spec|test)\.[jt]s$/.test(args.path)
      ) {
        return; // fall through to esbuild's default loading
      }

      const source = await readFile(args.path, 'utf8');
      // Transpile TS/JS to plain JS so istanbul can parse it, preserving a
      // source map so coverage maps back to the original source lines.
      const { code, map } = await transform(source, {
        loader: args.path.endsWith('.ts') ? 'ts' : 'js',
        sourcemap: true,
        sourcefile: args.path,
      });

      const instrumented = instrumenter.instrumentSync(
        code,
        args.path,
        JSON.parse(map) as Record<string, unknown>
      );
      return { contents: instrumented, loader: 'js' };
    });
  },
});

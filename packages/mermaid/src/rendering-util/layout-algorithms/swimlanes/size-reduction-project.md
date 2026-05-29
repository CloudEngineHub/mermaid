# Swimlane Size Reduction Project

Checkpoint captured: 2026-05-29.

This note records the remaining work after the safe swimlane cleanup pass. It is meant as a pickup point for a later session, not as a public docs page.

## Current Checkpoint

The current cleanup pass is a good commit boundary before touching deeper active routing code.

Verified guard:

- DDLT aggregate: `totalScore=11832`, `avgScore=986`, `minScore=958`, `invalidCount=0`
- Swimlane DDLT: 9 files passed, 42 tests passed
- Fixture freshness/metadata plus swimlane DDLT: 11 files passed, 47 tests passed
- Fallow runtime dead-code scan: 0 issues
- Fallow changed-code duplication: 2 groups, 36 duplicated lines, about 0.23%
- `git diff --check`: clean

Measured size:

- Runtime TS LOC: 9068
- Swimlane chunk: 91.8 KiB (94047 B)
- Swimlane chunk gzip: 34.4 KiB (35190 B)
- Swimlane-owned minified bytes: 81.8 KiB (83799 B)
- Swimlane-owned source bytes: 288.8 KiB (295751 B)
- Production-reachable runtime files: 35 / 35

Compared with `.tmp/swimlanes-size/swimlanes-js-size.baseline.json`:

- Swimlane chunk: -33.3 KiB (-34080 B)
- Swimlane chunk gzip: -9.8 KiB (-10045 B)
- Swimlane-owned minified bytes: -33.2 KiB (-34029 B)
- Swimlane-owned source bytes: -130.8 KiB (-133960 B)

## Hard Guard

Do not keep any later reduction if the aggregate gets worse.

Stop and restore the last candidate change if any of these move in the wrong direction:

- `invalidCount` becomes non-zero
- `minScore` drops below 958
- `totalScore` drops below 11832
- a focused DDLT pin for the edited behavior fails

Use `--exclude '.claude/**'` on broad Vitest commands; stale duplicate worktree tests can otherwise interfere.

## Standard Verification Commands

```bash
pnpm exec vitest run --exclude '.claude/**' --reporter=verbose packages/mermaid/src/rendering-util/layout-algorithms/swimlanes/*.ddlt.spec.ts
ORTHO_TEST_DEBUG=1 pnpm exec vitest run --exclude '.claude/**' -t "aggregate validateLayout report" packages/mermaid/src/rendering-util/layout-algorithms/ddlt/layout-fixtures.ddlt.spec.ts
pnpm exec vitest run --exclude '.claude/**' packages/mermaid/src/rendering-util/layout-algorithms/ddlt/fixtureFreshness.spec.ts packages/mermaid/src/rendering-util/layout-algorithms/ddlt/fixtureMetadata.spec.ts packages/mermaid/src/rendering-util/layout-algorithms/swimlanes/*.ddlt.spec.ts
pnpm swimlanes:size:compare
```

Fallow dead-code scan scoped to runtime swimlane files:

```bash
files=()
while IFS= read -r -d '' f; do
  files+=(--file "$f")
done < <(find packages/mermaid/src/rendering-util/layout-algorithms/swimlanes -type f -name '*.ts' ! -name '*.spec.ts' ! -name '*.ddlt.spec.ts' ! -path '*/__tests__/*' ! -path '*/raykovGemini/__tests__/*' -print0)
npx --yes fallow dead-code --production --format json "${files[@]}"
```

Changed-code duplication scan:

```bash
npx --yes fallow dupes --production --changed-since HEAD --format json --top 20
```

## Lessons From The Last Pass

- Fallow currently reports 0 runtime dead-code issues. Treat further deletions as behavioral work, not obvious cleanup.
- Removing `collapseShortTerminalStub` caused a validator failure and was restored. Do not retry that deletion without a specific replacement and fixture pin.
- The removed dormant passes were safe because they were no longer wired into `postProcessing.ts`; active rendered-geometry passes are not in the same category.
- `phase4.mergeDummies.ts` is dense active route construction and track allocation. It did not show obvious dead scaffolding on inspection.
- Splitting files alone will not reduce the bundle; prioritize deleting real code or replacing duplicated runtime logic with existing helpers.
- The current `direction/geometry.ts` grew because common helpers moved there. That is acceptable only while it reduces total owned bytes.

## Recommended Next Steps

1. Commit the current checkpoint.

   This preserves the verified reduction before touching high-risk active routing code.

2. Re-run the size baseline after the commit if desired.

   Keep `.tmp/swimlanes-size/swimlanes-js-size.md` as the local measurement artifact. The committed source should remain independent of `.tmp`.

3. Target `phase4.mergeDummies.ts` only for mechanical simplification.

   Best candidates:
   - extract repeated point-push patterns only if it deletes code after minification;
   - collapse local track reservation helpers only if behavior is byte-for-byte equivalent;
   - avoid changing lane side selection, track offsets, or obstacle-clearance logic without a focused DDLT pin.

   Expected gain: small. Stop if the diff starts describing a routing behavior change.

4. Target `direction/materializedGeometry.ts` next for helper reuse.

   Look for local rectangle, segment, and bend helpers that can call `direction/geometry.ts`. Keep this to mechanical replacement; do not change candidate selection or safety gates.

5. Treat `raykovGemini/raykov.ts` as a separate project.

   It is still the largest contributor at about 20.4 KiB minified, but it is core routing logic. Before editing it:
   - add or identify focused DDLT coverage for the branch being changed;
   - prefer deleting provably unused local helpers or unreachable branches;
   - avoid broad restructuring unless the goal is maintainability rather than bundle reduction;
   - expect bundle savings to require real code removal, not just function extraction.

6. Review `direction/geometry.ts` after the next reduction.

   It now has high fan-in and about 7.1 KiB minified contribution. Do not split it just for aesthetics, but consider pruning helpers that are used once if inlining would reduce total bundle size and keep readability acceptable.

## Deferred Ideas

- Add a tiny script/report that records runtime LOC, chunk bytes, gzip bytes, owned minified bytes, and aggregate score in one markdown checkpoint.
- Add a source-size budget in CI only after the swimlane API surface settles.
- Use Fallow health as a prioritization signal, not as an automatic refactor instruction. The top health files are active because they are central, not necessarily because they contain removable code.

## Do Not Do In The Next Pass

- Do not change DDLT validators, scoring, fixture loaders, captured fixture sizes, or parser behavior as part of size reduction.
- Do not remove active post-processing passes without fixture-specific before/after coverage.
- Do not chase the remaining 0.23% duplication unless it clearly reduces shipped bytes.
- Do not mix user fixture edits or local dev-page changes into the size-reduction commit.

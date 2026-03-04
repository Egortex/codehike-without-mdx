# Changelog

## 0.1.0 - 2026-03-04

Initial fork release as `codehike-without-mdx`.

### Added

- JSX-first API in `codehike-without-mdx/react`:
  - `ScrollyCoding`, `ScrollyStep`
  - `CodeTabs`, `Tab`
  - `FocusCode`, `focus`, `withFocusRanges`
  - generic `Code` renderer + `useHighlightedCode`
- Smooth token transition behavior for scrolly updates (tokens move instead of hard replace).
- Demo app: `apps/codehike-without-mdx-demo` with a live Scrollycoding editor.

### Changed

- Project/package/docs naming switched to `codehike-without-mdx`.
- Root scripts now target `codehike-without-mdx` and `codehike-without-mdx-demo`.

### Removed

- MDX compile pipeline and MDX block parser APIs.
- `packages/remark` and `packages/recma`.
- MDX-related exports and dependencies from the main package.

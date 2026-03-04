# codehike-without-mdx

## 0.1.0 - 2026-03-04

First release of the JSX-only fork.

### Added

- `react` module with:
  - `ScrollyCoding`, `ScrollyStep`
  - `CodeTabs`, `Tab`
  - `FocusCode`, `focus`, `withFocusRanges`
  - `Code`, `highlightCodeInput`, `useHighlightedCode`
- Smooth token transitions integrated into Scrollycoding updates.

### Removed

- `mdx` module and all MDX transform files.
- `blocks` module and block parser entry points.
- MDX-specific dependencies and tests.

### Notes

- This package is a fork of upstream Code Hike, optimized for JSX workflows without MDX compilation.

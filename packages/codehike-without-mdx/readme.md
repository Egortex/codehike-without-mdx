# codehike-without-mdx

Fork of Code Hike focused on JSX-first usage without MDX plugins.

## Install

```bash
npm i codehike-without-mdx
```

## Usage

```tsx
import { ScrollyCoding, ScrollyStep } from "codehike-without-mdx/react"
import { Pre, highlight } from "codehike-without-mdx/code"
```

## Included Modules

- `codehike-without-mdx/react`:
  - `ScrollyCoding`, `ScrollyStep`
  - `CodeTabs`, `Tab`
  - `FocusCode`, `focus`, `withFocusRanges`
  - `Code`, `useHighlightedCode`
- `codehike-without-mdx/code`:
  - `highlight`, `Pre`, `Inline`
  - low-level `InnerPre`, `InnerLine`, `InnerToken`, `getPreRef`
- `codehike-without-mdx/utils/*`:
  - token transitions
  - selection/scroller helpers
  - static fallback helpers

## Removed From Upstream

- MDX compile pipeline (`remark/recma` plugins)
- MDX block parser API (`parse`, `parseRoot`, `parseProps`, `blocks`)
- auxiliary `remark-codehike` and `recma-codehike` packages

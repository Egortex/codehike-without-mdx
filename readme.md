# codehike-without-mdx

`codehike-without-mdx` is a fork of [Code Hike](https://github.com/code-hike/codehike) with the MDX pipeline removed.

This repository keeps the React/JSX runtime parts and adds JSX-first APIs for:

- `ScrollyCoding`
- `Tabs`
- `Focus`
- low-level code rendering and token transitions

## What This Fork Changes

- Removes MDX plugin logic (`remarkCodeHike`, `recmaCodeHike`)
- Removes MDX block parsing layer (`parse`, `parseRoot`, `parseProps`, `blocks`)
- Removes `packages/remark` and `packages/recma`
- Keeps and extends React runtime APIs in `packages/codehike-without-mdx/src/react/*`

## Monorepo Layout

- `packages/codehike-without-mdx`: main library
- `apps/codehike-without-mdx-demo`: live editor/demo for ScrollyCoding

## Install (package only)

```bash
npm i codehike-without-mdx
```

## Usage

```tsx
import { ScrollyCoding, ScrollyStep } from "codehike-without-mdx/react"
import { Pre, highlight } from "codehike-without-mdx/code"
```

## Local Development

```bash
pnpm install
pnpm --filter codehike-without-mdx build
pnpm --filter codehike-without-mdx-demo dev
```

or from root:

```bash
npm run build
npm run demo
```

## Fork Notice

This is an independent fork tailored for JSX-only workflows.  
If you need full MDX features from upstream Code Hike, use the original project.

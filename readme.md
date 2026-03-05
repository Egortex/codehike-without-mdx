# codehike-without-mdx

`codehike-without-mdx` is a fork of [Code Hike](https://github.com/code-hike/codehike) with the MDX pipeline removed. For React@18

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
npm i @chepchik/codehike-without-mdx
```

## Usage

```tsx
import type { RawCode } from "@chepchik/codehike-without-mdx/code"
import {
  ScrollyCoding,
  ScrollyStep,
} from "@chepchik/codehike-without-mdx/react"

type Step = {
  id: string
  title: string
  notes: string[]
  codeblock: RawCode
}

const steps: Step[] = [
  {
    id: "step-1",
    title: "Step 1. Normalize input data",
    notes: [
      "Load user records and keep extra fields for later stages.",
      "Scroll slowly to see token movement.",
    ],
    codeblock: {
      lang: "ts",
      meta: "step-1.ts",
      value: `const a = 1`,
    },
  },
  {
    id: "step-2",
    title: "Step 2. Filter and sort",
    notes: [""],
    codeblock: {
      lang: "ts",
      meta: "step-2.ts",
      value: `const a = 2`,
    },
  },
  {
    id: "step-3",
    title: "Step 3. Build final view model",
    notes: ["", ""],
    codeblock: {
      lang: "ts",
      meta: "step-3.ts",
      value: `const a = 3`,
    },
  },
]

export function App() {
  return (
    <main className="page">
      <ScrollyCoding
        className="scrolly-expanded"
        minCodeHeight={680}
        transitionDurationMs={1100}
        preProps={{
          style: {
            paddingRight: 20,
            paddingBottom: 28,
          },
        }}
      >
        {steps.map((step, index) => (
          <ScrollyStep
            key={step.id}
            id={`${index}`}
            title={step.title}
            codeblock={step.codeblock}
          >
            <div className="step-content">
              {step.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </ScrollyStep>
        ))}
      </ScrollyCoding>
    </main>
  )
}
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

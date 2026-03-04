"use client"

import React from "react"
import { Pre } from "../code.js"
import type { AnnotationHandler, HighlightedCode } from "../code.js"
import {
  type CodeInput,
  type HighlightOptions,
  highlightCodeInput,
  isHighlightedCode,
} from "./code.js"

const EMPTY_HANDLERS: AnnotationHandler[] = []

export type CodeTab = {
  id?: string
  title: React.ReactNode
  codeblock: CodeInput
  annotationPrefix?: string
}

export type TabProps = CodeTab

export function Tab(_props: TabProps) {
  return null
}

type InternalCodeTabsProps = {
  tabs: CodeTab[]
  handlers?: AnnotationHandler[]
  loading?: React.ReactNode
  theme?: HighlightOptions["theme"]
  defaultIndex?: number
  className?: string
  preProps?: Omit<React.ComponentProps<typeof Pre>, "code" | "handlers">
}

type ChildrenCodeTabsProps = Omit<InternalCodeTabsProps, "tabs"> & {
  children: React.ReactNode
  tabs?: never
}

export type CodeTabsProps = InternalCodeTabsProps | ChildrenCodeTabsProps

function isTabElement(
  node: React.ReactNode,
): node is React.ReactElement<TabProps> {
  return React.isValidElement(node) && node.type === Tab
}

function getTabs(props: CodeTabsProps) {
  if ("tabs" in props && Array.isArray(props.tabs)) {
    return props.tabs
  }

  if (!("children" in props)) {
    return []
  }

  return React.Children.toArray(props.children)
    .filter(isTabElement)
    .map((node) => node.props)
}

function getInitialHighlightedTabs(tabs: CodeTab[]): HighlightedCode[] | null {
  if (!tabs.every((tab) => isHighlightedCode(tab.codeblock))) {
    return null
  }
  return tabs.map((tab) => tab.codeblock as HighlightedCode)
}

export function CodeTabs({
  handlers = EMPTY_HANDLERS,
  loading = null,
  theme = "github-dark" as HighlightOptions["theme"],
  defaultIndex = 0,
  className,
  preProps,
  ...props
}: CodeTabsProps) {
  const tabsInput = "tabs" in props ? props.tabs : props.children
  const tabs = React.useMemo(() => getTabs(props), [tabsInput])
  const [activeIndex, setActiveIndex] = React.useState(defaultIndex)
  const [highlightedTabs, setHighlightedTabs] = React.useState<
    HighlightedCode[] | null
  >(() => getInitialHighlightedTabs(tabs))

  React.useEffect(() => {
    let active = true
    setHighlightedTabs(getInitialHighlightedTabs(tabs))

    Promise.all(
      tabs.map((tab) =>
        highlightCodeInput(tab.codeblock, {
          theme,
          annotationPrefix: tab.annotationPrefix,
        }),
      ),
    ).then((values) => {
      if (active) {
        setHighlightedTabs(values)
      }
    })

    return () => {
      active = false
    }
  }, [tabs, theme])

  React.useEffect(() => {
    if (activeIndex > tabs.length - 1) {
      setActiveIndex(0)
    }
  }, [activeIndex, tabs.length])

  const activeCode = highlightedTabs?.[activeIndex]

  return (
    <div
      className={className}
      style={{
        border: "1px solid #334155",
        borderRadius: 10,
        overflow: "hidden",
        background: "#0f172a",
      }}
    >
      <div
        role="tablist"
        aria-label="Code tabs"
        style={{
          display: "flex",
          gap: 8,
          padding: 8,
          borderBottom: "1px solid #334155",
          background: "#0b1220",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab, i) => {
          const selected = i === activeIndex
          const id = tab.id || `${i}`
          return (
            <button
              key={id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveIndex(i)}
              style={{
                cursor: "pointer",
                border: "1px solid #475569",
                background: selected ? "#1d4ed8" : "#111827",
                color: "#e2e8f0",
                borderRadius: 8,
                padding: "0.35rem 0.7rem",
                fontSize: 13,
              }}
            >
              {tab.title}
            </button>
          )
        })}
      </div>

      <div role="tabpanel">
        {!activeCode ? (
          loading
        ) : (
          <Pre
            code={activeCode}
            handlers={handlers}
            className="m-0"
            style={{ margin: 0, background: "#020617" }}
            {...preProps}
          />
        )}
      </div>
    </div>
  )
}

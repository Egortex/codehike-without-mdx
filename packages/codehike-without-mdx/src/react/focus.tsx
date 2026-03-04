"use client"

import React, { useLayoutEffect, useRef } from "react"
import { InnerLine, InnerPre, Pre, getPreRef } from "../code.js"
import type {
  AnnotationHandler,
  BlockAnnotation,
  CustomPreProps,
  HighlightedCode,
} from "../code.js"
import {
  type CodeInput,
  type HighlightOptions,
  useHighlightedCode,
} from "./code.js"

const EMPTY_HANDLERS: AnnotationHandler[] = []

export type FocusRange = Pick<
  BlockAnnotation,
  "fromLineNumber" | "toLineNumber"
> & {
  query?: string
}

function toFocusAnnotation(range: FocusRange): BlockAnnotation {
  return {
    name: "focus",
    query: range.query || "",
    fromLineNumber: range.fromLineNumber,
    toLineNumber: range.toLineNumber,
  }
}

export function withFocusRanges(
  highlighted: HighlightedCode,
  ranges: FocusRange | FocusRange[],
) {
  const list = Array.isArray(ranges) ? ranges : [ranges]
  const nonFocus = highlighted.annotations.filter((a) => a.name !== "focus")

  return {
    ...highlighted,
    annotations: [...nonFocus, ...list.map(toFocusAnnotation)],
  }
}

function PreWithFocus(props: CustomPreProps) {
  const ref = getPreRef(props)
  useScrollToFocus(ref)
  return <InnerPre merge={props} />
}

function useScrollToFocus(ref: React.RefObject<HTMLPreElement>) {
  const firstRender = useRef(true)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }

    const focusedElements = element.querySelectorAll(
      "[data-focus=true]",
    ) as NodeListOf<HTMLElement>
    const containerRect = element.getBoundingClientRect()

    let top = Infinity
    let bottom = -Infinity
    focusedElements.forEach((focusedElement) => {
      const rect = focusedElement.getBoundingClientRect()
      top = Math.min(top, rect.top - containerRect.top)
      bottom = Math.max(bottom, rect.bottom - containerRect.top)
    })

    if (bottom > containerRect.height || top < 0) {
      element.scrollTo({
        top: element.scrollTop + top - 10,
        behavior: firstRender.current ? "auto" : "smooth",
      })
    }

    firstRender.current = false
  })
}

export const focus: AnnotationHandler = {
  name: "focus",
  onlyIfAnnotated: true,
  PreWithRef: PreWithFocus,
  Line: (props) => (
    <InnerLine merge={props} style={{ opacity: 0.5, padding: "0 0.5rem" }} />
  ),
  AnnotatedLine: (props) => (
    <InnerLine
      merge={props}
      data-focus={true}
      style={{
        padding: "0 0.5rem",
        background: "rgba(100, 116, 139, 0.25)",
      }}
    />
  ),
}

export type FocusCodeProps = Omit<
  React.ComponentProps<typeof Pre>,
  "code" | "handlers"
> & {
  codeblock: CodeInput
  range: FocusRange | FocusRange[]
  handlers?: AnnotationHandler[]
  loading?: React.ReactNode
  theme?: HighlightOptions["theme"]
  annotationPrefix?: string
}

export function FocusCode({
  codeblock,
  range,
  handlers = EMPTY_HANDLERS,
  loading = null,
  theme = "github-dark" as HighlightOptions["theme"],
  annotationPrefix,
  ...rest
}: FocusCodeProps) {
  const highlighted = useHighlightedCode(codeblock, { theme, annotationPrefix })

  if (!highlighted) {
    return <>{loading}</>
  }

  return (
    <Pre
      code={withFocusRanges(highlighted, range)}
      handlers={[focus, ...handlers]}
      {...rest}
    />
  )
}

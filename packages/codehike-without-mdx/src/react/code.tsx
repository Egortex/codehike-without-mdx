"use client"

import React from "react"
import { highlight, Pre } from "../code.js"
import type { AnnotationHandler, HighlightedCode, RawCode } from "../code.js"

const EMPTY_HANDLERS: AnnotationHandler[] = []
type HighlightTheme = Parameters<typeof highlight>[1]

export type CodeInput = RawCode | HighlightedCode

export type HighlightOptions = {
  theme?: HighlightTheme
  annotationPrefix?: string
}

export function isHighlightedCode(
  codeblock: CodeInput,
): codeblock is HighlightedCode {
  return Array.isArray((codeblock as HighlightedCode).tokens)
}

export async function highlightCodeInput(
  codeblock: CodeInput,
  options: HighlightOptions = {},
) {
  if (isHighlightedCode(codeblock)) {
    return codeblock
  }

  const { theme = "github-dark" as HighlightTheme, annotationPrefix } = options
  return highlight(codeblock, theme, { annotationPrefix })
}

export function useHighlightedCode(
  codeblock: CodeInput,
  options: HighlightOptions = {},
) {
  const [highlighted, setHighlighted] = React.useState<HighlightedCode | null>(
    () => (isHighlightedCode(codeblock) ? codeblock : null),
  )

  React.useEffect(() => {
    let active = true

    if (isHighlightedCode(codeblock)) {
      setHighlighted(codeblock)
      return () => {
        active = false
      }
    }

    setHighlighted(null)
    highlightCodeInput(codeblock, options).then((next) => {
      if (active) {
        setHighlighted(next)
      }
    })

    return () => {
      active = false
    }
  }, [codeblock, options.annotationPrefix, options.theme])

  return highlighted
}

export type CodeProps = Omit<
  React.ComponentProps<typeof Pre>,
  "code" | "handlers"
> & {
  codeblock: CodeInput
  handlers?: AnnotationHandler[]
  loading?: React.ReactNode
  theme?: HighlightTheme
  annotationPrefix?: string
}

export function Code({
  codeblock,
  handlers = EMPTY_HANDLERS,
  loading = null,
  theme = "github-dark" as HighlightTheme,
  annotationPrefix,
  ...rest
}: CodeProps) {
  const highlighted = useHighlightedCode(codeblock, {
    theme,
    annotationPrefix,
  })

  if (!highlighted) {
    return <>{loading}</>
  }

  return <Pre code={highlighted} handlers={handlers} {...rest} />
}

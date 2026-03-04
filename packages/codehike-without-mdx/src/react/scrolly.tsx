"use client"

import React from "react"
import { InnerPre, InnerToken, Pre, getPreRef } from "../code.js"
import type {
  AnnotationHandler,
  CustomPreProps,
  HighlightedCode,
} from "../code.js"
import {
  Selectable,
  SelectionProvider,
  useSelectedIndex,
} from "../utils/selection.js"
import {
  TokenTransitionsSnapshot,
  calculateTransitions,
  getStartingSnapshot,
} from "../utils/token-transitions.js"
import {
  type CodeInput,
  type HighlightOptions,
  highlightCodeInput,
  isHighlightedCode,
} from "./code.js"

const EMPTY_HANDLERS: AnnotationHandler[] = []
const DEFAULT_TRANSITION_DURATION_MS = 900

export type ScrollyCodingStep = {
  id?: string
  title: React.ReactNode
  children?: React.ReactNode
  codeblock: CodeInput
  annotationPrefix?: string
}

export type ScrollyStepProps = ScrollyCodingStep

export function ScrollyStep(_props: ScrollyStepProps) {
  return null
}

type InternalScrollyCodingProps = {
  steps: ScrollyCodingStep[]
  handlers?: AnnotationHandler[]
  loading?: React.ReactNode
  theme?: HighlightOptions["theme"]
  animateTransitions?: boolean
  transitionDurationMs?: number
  className?: string
  style?: React.CSSProperties
  rootMargin?: string | { top: number; height: number }
  minCodeHeight?: number
  preProps?: Omit<React.ComponentProps<typeof Pre>, "code" | "handlers">
}

type ChildrenScrollyCodingProps = Omit<InternalScrollyCodingProps, "steps"> & {
  children: React.ReactNode
  steps?: never
}

export type ScrollyCodingProps =
  | InternalScrollyCodingProps
  | ChildrenScrollyCodingProps

function isScrollyStepElement(
  node: React.ReactNode,
): node is React.ReactElement<ScrollyStepProps> {
  return React.isValidElement(node) && node.type === ScrollyStep
}

function getSteps(props: ScrollyCodingProps) {
  if ("steps" in props && Array.isArray(props.steps)) {
    return props.steps
  }

  if (!("children" in props)) {
    return []
  }

  return React.Children.toArray(props.children)
    .filter(isScrollyStepElement)
    .map((node) => node.props)
}

function getInitialHighlightedSteps(
  steps: ScrollyCodingStep[],
): HighlightedCode[] | null {
  if (!steps.every((step) => isHighlightedCode(step.codeblock))) {
    return null
  }
  return steps.map((step) => step.codeblock as HighlightedCode)
}

function ScrollyMessage({
  step,
  index,
}: {
  step: ScrollyCodingStep
  index: number
}) {
  const [selectedIndex] = useSelectedIndex()
  const selected = selectedIndex === index

  return (
    <Selectable
      index={index}
      selectOn={["click", "scroll"]}
      style={{
        border: "1px solid #334155",
        borderLeft: `4px solid ${selected ? "#3b82f6" : "#334155"}`,
        borderRadius: 10,
        padding: "1rem",
        background: "#111827",
        color: "#e2e8f0",
        opacity: selected ? 1 : 0.55,
        transition: "opacity 0.2s ease",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "0.6rem", fontSize: 20 }}>
        {step.title}
      </h3>
      <div>{step.children}</div>
    </Selectable>
  )
}

function createSmoothTokenTransitions(durationMs: number): AnnotationHandler {
  class SmoothPreWithRef extends React.Component<CustomPreProps> {
    ref: React.RefObject<HTMLPreElement>

    constructor(props: CustomPreProps) {
      super(props)
      this.ref = getPreRef(this.props)
    }

    render() {
      return <InnerPre merge={this.props} style={{ position: "relative" }} />
    }

    getSnapshotBeforeUpdate() {
      const element = this.ref.current
      if (!element) {
        return null
      }
      return getStartingSnapshot(element)
    }

    componentDidUpdate(
      prevProps: CustomPreProps,
      prevState: never,
      snapshot: TokenTransitionsSnapshot | null,
    ) {
      const element = this.ref.current
      if (!element || !snapshot) {
        return
      }

      const transitions = calculateTransitions(element, snapshot)
      transitions.forEach(({ element, keyframes, options }) => {
        const { translateX, translateY, ...kf } = keyframes as any
        if (translateX && translateY) {
          kf.translate = [
            `${translateX[0]}px ${translateY[0]}px`,
            `${translateX[1]}px ${translateY[1]}px`,
          ]
        }

        element.animate(kf, {
          duration: options.duration * durationMs,
          delay: options.delay * durationMs,
          easing: options.easing,
          fill: "both",
        })
      })
    }
  }

  return {
    name: "token-transitions-smooth",
    PreWithRef: SmoothPreWithRef,
    Token: (props) => (
      <InnerToken merge={props} style={{ display: "inline-block" }} />
    ),
  }
}

function ScrollyCodePanel({
  highlightedSteps,
  handlers,
  loading,
  animateTransitions,
  transitionDurationMs,
  minCodeHeight,
  preProps,
}: {
  highlightedSteps: HighlightedCode[] | null
  handlers: AnnotationHandler[]
  loading: React.ReactNode
  animateTransitions: boolean
  transitionDurationMs: number
  minCodeHeight: number
  preProps?: Omit<React.ComponentProps<typeof Pre>, "code" | "handlers">
}) {
  const [selectedIndex] = useSelectedIndex()
  const code = highlightedSteps?.[selectedIndex]
  const smoothTransitionsHandler = React.useMemo(
    () => createSmoothTokenTransitions(transitionDurationMs),
    [transitionDurationMs],
  )
  const mergedHandlers = React.useMemo(
    () =>
      animateTransitions ? [smoothTransitionsHandler, ...handlers] : handlers,
    [animateTransitions, smoothTransitionsHandler, handlers],
  )

  if (!code) {
    return <>{loading}</>
  }

  const { style: preStyle, ...restPreProps } = preProps || {}

  return (
    <Pre
      code={code}
      handlers={mergedHandlers}
      style={{
        margin: 0,
        minHeight: minCodeHeight,
        height: "100%",
        overflow: "auto",
        background: "#020617",
        ...preStyle,
      }}
      {...restPreProps}
    />
  )
}

export function ScrollyCoding({
  handlers = EMPTY_HANDLERS,
  loading = null,
  theme = "github-dark" as HighlightOptions["theme"],
  animateTransitions = true,
  transitionDurationMs = DEFAULT_TRANSITION_DURATION_MS,
  className,
  style,
  rootMargin,
  minCodeHeight = 560,
  preProps,
  ...props
}: ScrollyCodingProps) {
  const stepsInput = "steps" in props ? props.steps : props.children
  const steps = React.useMemo(() => getSteps(props), [stepsInput])
  const [highlightedSteps, setHighlightedSteps] = React.useState<
    HighlightedCode[] | null
  >(() => getInitialHighlightedSteps(steps))

  React.useEffect(() => {
    let active = true
    setHighlightedSteps(getInitialHighlightedSteps(steps))

    Promise.all(
      steps.map((step) =>
        highlightCodeInput(step.codeblock, {
          theme,
          annotationPrefix: step.annotationPrefix,
        }),
      ),
    ).then((values) => {
      if (active) {
        setHighlightedSteps(values)
      }
    })

    return () => {
      active = false
    }
  }, [steps, theme])

  return (
    <SelectionProvider
      className={className}
      rootMargin={rootMargin}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(260px, 1fr) minmax(320px, 1fr)",
        gap: "1rem",
        alignItems: "start",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          paddingTop: "7rem",
          paddingBottom: "65vh",
        }}
      >
        {steps.map((step, i) => (
          <ScrollyMessage key={step.id || `${i}`} step={step} index={i} />
        ))}
      </div>

      <div
        style={{
          border: "1px solid #334155",
          borderRadius: 10,
          overflow: "hidden",
          background: "#020617",
          position: "sticky",
          top: 24,
          height: "calc(100vh - 48px)",
        }}
      >
        <div style={{ height: "100%" }}>
          <ScrollyCodePanel
            highlightedSteps={highlightedSteps}
            handlers={handlers}
            loading={loading}
            animateTransitions={animateTransitions}
            transitionDurationMs={transitionDurationMs}
            minCodeHeight={minCodeHeight}
            preProps={preProps}
          />
        </div>
      </div>
    </SelectionProvider>
  )
}

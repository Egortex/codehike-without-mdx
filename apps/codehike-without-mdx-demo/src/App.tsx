import { useMemo, useState } from "react"
import type { RawCode } from "@chepchik/codehike-without-mdx/code"
import {
  ScrollyCoding,
  ScrollyStep,
} from "@chepchik/codehike-without-mdx/react"

type EditableStep = {
  id: string
  title: string
  notesText: string
  lang: string
  file: string
  code: string
}

const initialSteps: EditableStep[] = [
  {
    id: "step-1",
    title: "Step 1. Normalize input data",
    notesText: [
      "Load user records and keep extra fields for later stages.",
      "This text area is editable and supports multi-line notes.",
      "Scroll slowly in preview to see token movement.",
    ].join("\n"),
    lang: "ts",
    file: "step-1.ts",
    code: `const users = [
  { id: 1, name: "Ada", active: true },
  { id: 2, name: "Linus", active: false },
  { id: 3, name: "Grace", active: true },
  { id: 4, name: "Ken", active: true },
]

const normalizedUsers = users.map((user) => ({
  ...user,
  lowerName: user.name.toLowerCase(),
  profilePath: "/users/" + user.id,
}))

console.log(normalizedUsers)`,
  },
  {
    id: "step-2",
    title: "Step 2. Filter and sort",
    notesText: [
      "Keep only active users and sort by lower-case name.",
      "Common tokens stay visible and move smoothly to new places.",
      "Try changing this code and compare transitions.",
    ].join("\n"),
    lang: "ts",
    file: "step-2.ts",
    code: `const users = [
  { id: 1, name: "Ada", active: true },
  { id: 2, name: "Linus", active: false },
  { id: 3, name: "Grace", active: true },
  { id: 4, name: "Ken", active: true },
]

const normalizedUsers = users.map((user) => ({
  ...user,
  lowerName: user.name.toLowerCase(),
  profilePath: "/users/" + user.id,
}))

const activeUsers = normalizedUsers
  .filter((user) => user.active)
  .sort((a, b) => a.lowerName.localeCompare(b.lowerName))

console.log(activeUsers)`,
  },
  {
    id: "step-3",
    title: "Step 3. Build final view model",
    notesText: [
      "The right panel is sticky and static.",
      "Code itself scrolls inside that panel.",
      "Increase code size and adjust min height in controls.",
    ].join("\n"),
    lang: "ts",
    file: "step-3.ts",
    code: `const users = [
  { id: 1, name: "Ada", active: true },
  { id: 2, name: "Linus", active: false },
  { id: 3, name: "Grace", active: true },
  { id: 4, name: "Ken", active: true },
]

const normalizedUsers = users.map((user) => ({
  ...user,
  lowerName: user.name.toLowerCase(),
  profilePath: "/users/" + user.id,
  tags: user.active ? ["online"] : ["archived"],
}))

const activeUsers = normalizedUsers
  .filter((user) => user.active)
  .sort((a, b) => a.lowerName.localeCompare(b.lowerName))

const viewModel = activeUsers.map((user) => ({
  key: user.id,
  label: user.name.toUpperCase(),
  href: user.profilePath,
  tags: user.tags.join(", "),
}))

const html = viewModel
  .map((item) => \`<a href="\${item.href}">\${item.label}</a>\`)
  .join("\\n")

console.log(html)`,
  },
]

function asRawCode(step: EditableStep): RawCode {
  return {
    lang: step.lang || "txt",
    meta: step.file || "snippet.txt",
    value: step.code,
  }
}

function stepNotes(step: EditableStep) {
  return step.notesText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function App() {
  const [steps, setSteps] = useState<EditableStep[]>(initialSteps)
  const [selectedStepId, setSelectedStepId] = useState(initialSteps[0].id)
  const [transitionMs, setTransitionMs] = useState(1100)
  const [minCodeHeight, setMinCodeHeight] = useState(680)

  const selectedStep =
    steps.find((step) => step.id === selectedStepId) || steps[0]

  const previewSteps = useMemo(
    () =>
      steps.map((step) => ({
        ...step,
        notes: stepNotes(step),
        codeblock: asRawCode(step),
      })),
    [steps],
  )

  function updateStep(id: string, patch: Partial<EditableStep>) {
    setSteps((current) =>
      current.map((step) => (step.id === id ? { ...step, ...patch } : step)),
    )
  }

  function addStep() {
    const nextIndex = steps.length + 1
    const id = `step-${Date.now()}`
    const newStep: EditableStep = {
      id,
      title: `Step ${nextIndex}. New step`,
      notesText: "Describe the step here.",
      lang: "ts",
      file: `step-${nextIndex}.ts`,
      code: `const message = "Edit this code"
console.log(message)`,
    }
    setSteps((current) => [...current, newStep])
    setSelectedStepId(id)
  }

  function deleteSelectedStep() {
    if (!selectedStep || steps.length <= 1) {
      return
    }
    const index = steps.findIndex((step) => step.id === selectedStep.id)
    const next = steps.filter((step) => step.id !== selectedStep.id)
    setSteps(next)
    setSelectedStepId(next[Math.max(0, index - 1)].id)
  }

  return (
    <main className="page">
      <header className="hero">
        <h1>Scrollycoding Editor</h1>
        <p>
          Edit steps and code on the left. Scroll the preview to validate sticky
          right panel and smooth token movement.
        </p>
      </header>

      <section className="section">
        <div className="editor-grid">
          <aside className="editor-sidebar">
            <div className="editor-actions">
              <button onClick={addStep}>+ Add step</button>
              <button onClick={deleteSelectedStep} disabled={steps.length <= 1}>
                Delete
              </button>
            </div>

            <div className="step-list">
              {steps.map((step, index) => {
                const selected = step.id === selectedStep?.id
                return (
                  <button
                    key={step.id}
                    className={selected ? "step-item active" : "step-item"}
                    onClick={() => setSelectedStepId(step.id)}
                  >
                    <span>{index + 1}.</span> {step.title}
                  </button>
                )
              })}
            </div>

            <div className="editor-controls">
              <label>
                Transition duration (ms)
                <input
                  type="number"
                  min={200}
                  max={3000}
                  step={100}
                  value={transitionMs}
                  onChange={(event) =>
                    setTransitionMs(Number(event.target.value) || 1100)
                  }
                />
              </label>
              <label>
                Min code height (px)
                <input
                  type="number"
                  min={320}
                  max={1400}
                  step={20}
                  value={minCodeHeight}
                  onChange={(event) =>
                    setMinCodeHeight(Number(event.target.value) || 680)
                  }
                />
              </label>
            </div>
          </aside>

          <div className="editor-form">
            <label>
              Step title
              <input
                value={selectedStep?.title || ""}
                onChange={(event) =>
                  selectedStep &&
                  updateStep(selectedStep.id, { title: event.target.value })
                }
              />
            </label>

            <div className="editor-form-row">
              <label>
                Language
                <input
                  value={selectedStep?.lang || ""}
                  onChange={(event) =>
                    selectedStep &&
                    updateStep(selectedStep.id, { lang: event.target.value })
                  }
                />
              </label>
              <label>
                File name
                <input
                  value={selectedStep?.file || ""}
                  onChange={(event) =>
                    selectedStep &&
                    updateStep(selectedStep.id, { file: event.target.value })
                  }
                />
              </label>
            </div>

            <label>
              Notes (one paragraph per line)
              <textarea
                rows={6}
                value={selectedStep?.notesText || ""}
                onChange={(event) =>
                  selectedStep &&
                  updateStep(selectedStep.id, { notesText: event.target.value })
                }
              />
            </label>

            <label>
              Code
              <textarea
                rows={22}
                className="code-editor"
                value={selectedStep?.code || ""}
                onChange={(event) =>
                  selectedStep &&
                  updateStep(selectedStep.id, { code: event.target.value })
                }
              />
            </label>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Preview</h2>
        <ScrollyCoding
          className="scrolly-expanded"
          minCodeHeight={minCodeHeight}
          transitionDurationMs={transitionMs}
          preProps={{
            style: {
              paddingRight: 20,
              paddingBottom: 28,
            },
          }}
        >
          {previewSteps.map((step, index) => (
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
      </section>
    </main>
  )
}

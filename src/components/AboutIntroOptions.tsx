import { createPortal } from "react-dom"

export type IntroOption = "a" | "b" | "c"

const options = [
  { value: "a", name: "Compact pill" },
  { value: "b", name: "Chat bubble" },
  { value: "c", name: "Stacked buttons" },
] as const

export default function AboutIntroOptions({ value, onChange }: {
  value: IntroOption
  onChange: (value: IntroOption) => void
}) {
  return createPortal(<aside className="about-intro-options" aria-label="Introduction design options">
    <div role="group" aria-label="Choose introduction style">
      {options.map(option => <button key={option.value} type="button"
        aria-label={`${option.value.toUpperCase()}: ${option.name}`}
        aria-pressed={value === option.value} onClick={() => onChange(option.value)}>
        {option.value.toUpperCase()}
      </button>)}
    </div>
    <span>{options.find(option => option.value === value)?.name}</span>
  </aside>, document.body)
}

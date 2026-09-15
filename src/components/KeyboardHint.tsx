export type KeyboardHintItem = {
  keys: string[]
  label: string
}

/**
 * The keys a focused widget answers to, drawn as keycaps beside what each
 * does. It is only a picture: the widget owns when it shows (on
 * `:focus-visible`, never under a pointer) and says the same thing to a screen
 * reader through its own `aria-describedby`, in words rather than glyphs.
 */
export function KeyboardHint({ items, className }: { items: KeyboardHintItem[]; className?: string }) {
  return (
    <span className={`keyboard-hint${className ? ` ${className}` : ""}`} aria-hidden="true">
      {items.map((item) => (
        <span key={item.label} className="keyboard-hint-item">
          {item.keys.map((key) => (
            <kbd key={key}>{key}</kbd>
          ))}
          {item.label}
        </span>
      ))}
    </span>
  )
}

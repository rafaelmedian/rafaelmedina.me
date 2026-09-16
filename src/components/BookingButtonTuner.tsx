import { useEffect } from "react"
import { DialRoot, useDialKit } from "dialkit"
import "dialkit/styles.css"

function stateControls(pressed = false, hover = false) {
  return {
    shadowY: [pressed ? 1 : hover ? 4 : 1, -8, 16, 0.5],
    shadowBlur: [pressed ? 4 : hover ? 12 : 10, 0, 32, 0.5],
    shadowOpacity: [pressed ? 0.08 : hover ? 0.2 : 0.15, 0, 1, 0.01],
    shineHeight: [hover ? 28 : 22, 0, 40, 1],
    shineBlur: [pressed ? 2 : hover ? 4 : 0.5, 0, 12, 0.5],
    shineOpacity: [pressed ? 0.2 : hover ? 1 : 0.8, 0, 1, 0.01],
    shineScale: [1.12, 0.5, 1.5, 0.01],
    innerShadowY: [pressed ? 2 : -6, -12, 12, 0.5],
    innerShadowBlur: [pressed ? 6 : 2, 0, 24, 0.5],
    innerShadowOpacity: [pressed ? 0.75 : 0.38, 0, 1, 0.01],
    highlightY: [pressed ? -1 : -2, -12, 12, 0.5],
    highlightBlur: [pressed ? 2 : 6, 0, 24, 0.5],
    highlightOpacity: [pressed ? 0.3 : 0.75, 0, 1, 0.01],
    depthY: [pressed ? 1 : -4, -12, 12, 0.5],
    depthBlur: [pressed ? 2 : 16, 0, 32, 0.5],
    depthOpacity: [pressed ? 0.38 : 0.3, 0, 1, 0.01],
  } satisfies Record<string, [number, number, number, number]>
}

/** Development-only overrides; copy chosen values into contact.css to keep them. */
export default function BookingButtonTuner() {
  const values = useDialKit("Booking button", {
    preview: { type: "select", options: ["Live", "Rest", "Hover", "Pressed"], default: "Live" },
    rest: stateControls(),
    hover: stateControls(false, true),
    pressed: stateControls(true),
  })

  useEffect(() => {
    const style = document.createElement("style")
    style.dataset.bookingButtonTuner = ""
    const selector = "html body .mosaic-booking-pill"
    function rules(target: string, state: typeof values.rest, pressed: boolean) {
      return `
        ${target} { box-shadow: 0 ${state.shadowY}px ${state.shadowBlur}px rgb(${pressed ? "46 42 42" : "0 0 0"} / ${state.shadowOpacity}); }
        ${target}::before {
          height: ${state.shineHeight}px;
          filter: blur(${state.shineBlur}px);
          opacity: ${state.shineOpacity};
          transform: translateX(-50%) scaleX(${state.shineScale});
        }
        ${target}::after { box-shadow:
          inset 0 ${state.innerShadowY}px ${state.innerShadowBlur}px rgb(0 0 0 / ${state.innerShadowOpacity}),
          inset 0 ${state.highlightY}px ${state.highlightBlur}px rgb(255 255 255 / ${state.highlightOpacity}),
          inset 0 ${state.depthY}px ${state.depthBlur}px rgb(0 0 0 / ${state.depthOpacity});
        }`
    }
    if (values.preview === "Live") {
      style.textContent = rules(selector, values.rest, false)
        + rules(`${selector}:hover`, values.hover, false)
        + rules(`${selector}:focus-visible`, values.hover, false)
        + rules(`${selector}:active`, values.pressed, true)
    } else {
      const state = values.preview === "Pressed" ? values.pressed : values.preview === "Hover" ? values.hover : values.rest
      style.textContent = rules(`${selector}:is(button)`, state, values.preview === "Pressed")
    }
    document.head.append(style)
    return () => style.remove()
  }, [values])

  return <DialRoot position="top-right" theme="light" />
}

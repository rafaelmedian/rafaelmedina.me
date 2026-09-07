import { useEffect } from "react"
import { DialRoot, useDialKit } from "dialkit"
import "dialkit/styles.css"
import "./elastic-edge-options.css"

import {
  DEFAULT_ELASTIC_EDGE_SETTINGS,
  ELASTIC_EDGE_RANDOMIZE_EVENT,
  ELASTIC_EDGE_REPLAY_EVENT,
  ELASTIC_EDGE_SETTINGS_EVENT,
} from "../lib/elasticEdgeGradient"

function replay() {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" })
  window.requestAnimationFrame(() => window.dispatchEvent(new Event(ELASTIC_EDGE_REPLAY_EVENT)))
}

export default function ElasticEdgeTuner() {
  const { variant, grain, height, rise, stagger, riseDuration, fadeDuration, intensity } = useDialKit("Page-edge aurora", {
    variant: {
      type: "select",
      options: [
        { value: "soft-curve", label: "1. Soft Curve" },
        { value: "curtains", label: "2. Feathered Curtains" },
        { value: "arcs", label: "3. Overlapping Arcs" },
        { value: "rolling", label: "4. Rolling Glow" },
      ],
      default: "soft-curve",
    },
    grain: [0.41, 0, 0.6],
    height: [65, 32, 80],
    rise: [10, 2, 16],
    stagger: [40, 0, 50],
    riseDuration: [710, 300, 1200],
    fadeDuration: [1148, 900, 3000],
    intensity: [0.91, 0.2, 1],
    replay: { type: "action", label: "Replay" },
    colors: { type: "action", label: "New random colors" },
  }, {
    onAction: (action) => {
      if (action === "colors") window.dispatchEvent(new Event(ELASTIC_EDGE_RANDOMIZE_EVENT))
      replay()
    },
  })

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(ELASTIC_EDGE_SETTINGS_EVENT, {
      detail: {
        ...DEFAULT_ELASTIC_EDGE_SETTINGS,
        height,
        risePx: rise,
        staggerMs: stagger,
        riseDurationMs: riseDuration,
        fadeDurationMs: fadeDuration,
        sectionOpacity: intensity,
      },
    }))
  }, [height, rise, stagger, riseDuration, fadeDuration, intensity])

  useEffect(() => {
    const edge = document.querySelector<HTMLElement>(".elastic-scroll-edge")
    if (!edge) return
    edge.dataset.edgeVariant = variant
    edge.style.setProperty("--edge-noise", String(grain))
    replay()
  }, [variant, grain])

  useEffect(() => {
    return () => {
      const edge = document.querySelector<HTMLElement>(".elastic-scroll-edge")
      if (edge) {
        delete edge.dataset.edgeVariant
        edge.style.removeProperty("--edge-noise")
      }
      window.dispatchEvent(new CustomEvent(ELASTIC_EDGE_SETTINGS_EVENT, { detail: DEFAULT_ELASTIC_EDGE_SETTINGS }))
    }
  }, [])

  return <DialRoot position="top-right" theme="light" />
}

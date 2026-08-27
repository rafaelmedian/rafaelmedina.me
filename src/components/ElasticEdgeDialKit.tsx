import { useEffect } from "react"
import { DialRoot, useDialKit } from "dialkit"

import "dialkit/styles.css"

import {
  DEFAULT_ELASTIC_EDGE_SETTINGS,
  ELASTIC_EDGE_RANDOMIZE_EVENT,
  ELASTIC_EDGE_SETTINGS_EVENT,
  type ElasticEdgeSettings,
} from "../lib/elasticEdgeGradient"

function ElasticEdgeControls() {
  const params = useDialKit(
    "End gradient",
    {
      preview: DEFAULT_ELASTIC_EDGE_SETTINGS.preview,
      shape: {
        height: [DEFAULT_ELASTIC_EDGE_SETTINGS.height, 32, 160, 1],
        centerWidth: [DEFAULT_ELASTIC_EDGE_SETTINGS.centerWidth, 24, 72, 1],
        colorSpread: [DEFAULT_ELASTIC_EDGE_SETTINGS.colorSpread, 32, 84, 1],
      },
      appearance: {
        blur: [DEFAULT_ELASTIC_EDGE_SETTINGS.blur, 4, 14, 1],
        saturation: [DEFAULT_ELASTIC_EDGE_SETTINGS.saturation, 0.8, 1.25, 0.01],
      },
      depth: {
        coreOpacity: [DEFAULT_ELASTIC_EDGE_SETTINGS.coreOpacity, 0.65, 1, 0.01],
        lightOpacity: [DEFAULT_ELASTIC_EDGE_SETTINGS.lightOpacity, 0, 0.48, 0.01],
        translucency: [DEFAULT_ELASTIC_EDGE_SETTINGS.translucency, 0.15, 0.65, 0.01],
      },
      newPalette: { type: "action", label: "New palette" },
    },
    {
      id: "elastic-edge-gradient",
      onAction: (action) => {
        if (action === "newPalette") window.dispatchEvent(new Event(ELASTIC_EDGE_RANDOMIZE_EVENT))
      },
    },
  )

  useEffect(() => {
    const settings: ElasticEdgeSettings = {
      preview: params.preview,
      height: params.shape.height,
      centerWidth: params.shape.centerWidth,
      colorSpread: params.shape.colorSpread,
      blur: params.appearance.blur,
      saturation: params.appearance.saturation,
      coreOpacity: params.depth.coreOpacity,
      lightOpacity: params.depth.lightOpacity,
      translucency: params.depth.translucency,
    }

    window.dispatchEvent(new CustomEvent(ELASTIC_EDGE_SETTINGS_EVENT, { detail: settings }))
  }, [
    params.preview,
    params.shape.height,
    params.shape.centerWidth,
    params.shape.colorSpread,
    params.appearance.blur,
    params.appearance.saturation,
    params.depth.coreOpacity,
    params.depth.lightOpacity,
    params.depth.translucency,
  ])

  return null
}

export function ElasticEdgeDialKit() {
  return (
    <>
      <ElasticEdgeControls />
      <DialRoot position="bottom-right" theme="system" />
    </>
  )
}

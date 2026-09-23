import { useEffect, useRef, useState } from "react"

type Recognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}
type SpeechWindow = Window & {
  SpeechRecognition?: new () => Recognition
  webkitSpeechRecognition?: new () => Recognition
}

export function useMessageDictation(active: boolean, onTranscript: (text: string) => void) {
  const recognitionRef = useRef<Recognition | null>(null)
  const [listening, setListening] = useState(false)
  const [status, setStatus] = useState("")

  if (!active && (listening || status)) {
    setListening(false)
    setStatus("")
  }

  useEffect(() => {
    return () => {
      const recognition = recognitionRef.current
      recognitionRef.current = null
      if (recognition) {
        recognition.onresult = recognition.onerror = recognition.onend = null
        recognition.abort()
      }
    }
  }, [active])

  const start = () => {
    if (!active || recognitionRef.current) return
    const speechWindow = window as SpeechWindow
    const SpeechRecognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setStatus("Voice typing isn’t supported in this browser. You can use your keyboard’s dictation or type here.")
      return
    }
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = navigator.language || "en-US"
    recognition.continuous = true
    recognition.interimResults = true
    let receivedText = false
    let failed = false
    recognition.onresult = event => {
      const transcript = Array.from(event.results, result => result[0]?.transcript ?? "").join(" ").trim().slice(0, 2000)
      if (transcript) {
        receivedText = true
        onTranscript(transcript)
      }
    }
    recognition.onerror = event => {
      failed = true
      setListening(false)
      const errors: Record<string, string> = {
        "not-allowed": "Microphone access was denied. Allow it in your browser settings, or type your message.",
        "service-not-allowed": "Voice typing is unavailable in this browser. You can type your message instead.",
        "audio-capture": "No microphone is available. Check your microphone and try again.",
        "no-speech": "I didn’t catch anything. Tap the microphone to try again.",
        network: "Voice typing couldn’t connect. Try again, or type your message.",
      }
      setStatus(errors[event.error] ?? "Voice typing stopped. You can try again or type your message.")
    }
    recognition.onend = () => {
      recognitionRef.current = null
      setListening(false)
      if (!failed) setStatus(receivedText ? "Review your message before sending." : "I didn’t catch anything. Tap the microphone to try again.")
    }
    setListening(true)
    setStatus("Listening… Tap stop when you’re done.")
    try {
      recognition.start()
    } catch {
      recognitionRef.current = null
      setListening(false)
      setStatus("Couldn’t start voice typing. Check microphone access and try again.")
    }
  }

  return { listening, status, start, stop: () => recognitionRef.current?.stop() }
}

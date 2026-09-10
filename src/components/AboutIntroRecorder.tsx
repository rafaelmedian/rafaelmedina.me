import { useEffect, useRef, useState } from "react"
import { Download, Pause, Play, RotateCcw, Square, Video } from "lucide-react"

const MAX_BYTES = 8 * 1024 * 1024
const label = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds) % 60).padStart(2, "0")}`

export default function AboutIntroRecorder({ onChange, active }: { onChange: (clip: Blob | null) => void; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const aliveRef = useRef(true)
  const activeRef = useRef(active)
  const urlRef = useRef("")
  const [state, setState] = useState<"idle" | "requesting" | "recording" | "preview">("idle")
  const [clip, setClip] = useState<Blob | null>(null)
  const [url, setUrl] = useState("")
  const [seconds, setSeconds] = useState(0)
  const [position, setPosition] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    aliveRef.current = true
    const stop = () => {
      const recorder = recorderRef.current
      if (recorder && recorder.state !== "inactive") recorder.stop()
      streamRef.current?.getTracks().forEach(track => track.stop())
      streamRef.current = null
      if (timerRef.current) clearInterval(timerRef.current)
    }
    const onVisibility = () => {
      if (document.hidden) {
        stop()
        videoRef.current?.pause()
      }
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      aliveRef.current = false
      stop()
      URL.revokeObjectURL(urlRef.current)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  useEffect(() => {
    activeRef.current = active
    if (!active) {
      if (recorderRef.current?.state === "recording") recorderRef.current.stop()
      streamRef.current?.getTracks().forEach(track => track.stop())
      videoRef.current?.pause()
    }
  }, [active])

  const record = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("This browser can’t record video. You can still send a note.")
      return
    }
    setState("requesting")
    setError("")
    videoRef.current?.pause()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: "user" }, audio: true,
      })
      if (!aliveRef.current || !activeRef.current || document.hidden) {
        stream.getTracks().forEach(track => track.stop())
        if (aliveRef.current) setState(clip ? "preview" : "idle")
        return
      }
      streamRef.current = stream
      const mimeType = ["video/mp4", "video/webm;codecs=vp8,opus", "video/webm"].find(type => MediaRecorder.isTypeSupported(type))
      const recorder = new MediaRecorder(stream, { ...(mimeType ? { mimeType } : {}), videoBitsPerSecond: 650_000, audioBitsPerSecond: 64_000 })
      recorderRef.current = recorder
      const chunks: Blob[] = []
      let bytes = 0
      let failed = false
      // eslint-disable-next-line react-hooks/purity -- This runs only in the camera button event, after permission resolves.
      const began = performance.now()
      recorder.ondataavailable = event => {
        bytes += event.data.size
        if (bytes > MAX_BYTES) {
          failed = true
          if (recorder.state !== "inactive") recorder.stop()
        } else if (event.data.size) chunks.push(event.data)
      }
      recorder.onerror = () => { failed = true; stop() }
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop())
        streamRef.current = null
        if (timerRef.current) clearInterval(timerRef.current)
        if (!aliveRef.current) return
        if (failed || !bytes) {
          setError(bytes > MAX_BYTES ? "That clip was too large. Try a shorter one." : "Couldn’t record that clip. Please try again.")
          setState(clip ? "preview" : "idle")
          return
        }
        const next = new Blob(chunks, { type: recorder.mimeType })
        URL.revokeObjectURL(urlRef.current)
        urlRef.current = URL.createObjectURL(next)
        setClip(next)
        setUrl(urlRef.current)
        setPosition(0)
        setPlaying(false)
        setSeconds(Math.max(0.1, Math.min(60, (performance.now() - began) / 1000)))
        setState("preview")
        onChange(next)
      }
      recorder.start(250)
      setSeconds(0)
      setState("recording")
      timerRef.current = setInterval(() => {
        const elapsed = (performance.now() - began) / 1000
        setSeconds(Math.min(60, elapsed))
        if (elapsed >= 60) stop()
      }, 250)
    } catch {
      streamRef.current?.getTracks().forEach(track => track.stop())
      streamRef.current = null
      if (!aliveRef.current) return
      setState(clip ? "preview" : "idle")
      setError("Camera or microphone unavailable. Check your browser permissions, or send a note instead.")
    }
  }

  const stop = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop()
    streamRef.current?.getTracks().forEach(track => track.stop())
    if (timerRef.current) clearInterval(timerRef.current)
  }

  return (
    <div className="about-intro-recorder">
      {(state === "recording" || state === "preview") && <video key={state} ref={node => {
        videoRef.current = node
        if (node && state === "recording" && streamRef.current && node.srcObject !== streamRef.current) {
          node.srcObject = streamRef.current
          void node.play().catch(() => { /* Recording can continue without a live preview. */ })
        }
      }} src={state === "preview" ? url : undefined} muted={state === "recording"} playsInline
        aria-label={state === "recording" ? "Your camera preview" : "Your recorded reply"}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
        onTimeUpdate={event => { if (state === "preview") setPosition(event.currentTarget.currentTime) }} />}
      {state === "recording" ? (
        <button type="button" className="about-intro-reply-primary" onClick={stop}><Square size={16} fill="currentColor" aria-hidden="true" /> Stop recording · {label(seconds)}</button>
      ) : state === "preview" ? (
        <>
          <div className="about-intro-recorded-controls">
            <button type="button" className="about-intro-button" aria-label={playing ? "Pause your reply" : "Play your reply"}
              onClick={() => {
                if (playing) videoRef.current?.pause()
                else void videoRef.current?.play().catch(() => setError("Couldn’t play that preview. Try again."))
              }}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
            <input type="range" aria-label="Seek your reply" min={0} max={seconds} step={0.1} value={Math.min(position, seconds)}
              onChange={event => { if (videoRef.current) videoRef.current.currentTime = Number(event.target.value); setPosition(Number(event.target.value)) }} />
            <button type="button" className="about-intro-button" aria-label="Retake video" onClick={() => void record()}><RotateCcw size={18} /></button>
          </div>
          <a className="about-intro-reply-back" href={url} download={`hello-rafael.${clip?.type.includes("mp4") ? "mp4" : "webm"}`}><Download size={16} aria-hidden="true" /> Download video to attach</a>
        </>
      ) : (
        <button type="button" className="about-intro-reply-primary" disabled={state === "requesting"} onClick={() => void record()}>
          <Video size={18} aria-hidden="true" />{state === "requesting" ? "Waiting for camera…" : "Record a video"}
        </button>
      )}
      <p className="about-intro-reply-note">Up to 60 seconds. Stays in this tab until you download or send it.</p>
      {error && <p role="alert">{error}</p>}
    </div>
  )
}

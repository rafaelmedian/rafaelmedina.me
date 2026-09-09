import { useEffect, useRef, useState, type ReactNode } from "react"
import { personalPhotoItems as photos } from "../data/personalPhotos"
import { createModuleLoader, useDeferredModule } from "../lib/deferredModule"
import { PersonalPhotosPreview, type OpenPhoto } from "./PersonalPhotosPreview"
import { usePreviewCount } from "../lib/photoLayout"
import type { PersonalPhotosSheetHandle } from "./PersonalPhotosSheet"

export { PersonalPhotosPreview } from "./PersonalPhotosPreview"
const loadSheet = createModuleLoader(() => import("./PersonalPhotosSheet"), "PersonalPhotosSheet")

export function PersonalPhotos({ children }: { children?: (openPhoto: OpenPhoto) => ReactNode }) {
  const { module, status, load, warm } = useDeferredModule(loadSheet)
  const Sheet = module?.PersonalPhotosSheet
  const sheetRef = useRef<PersonalPhotosSheetHandle>(null)
  const [request, setRequest] = useState<{ opener: HTMLElement } | null>(null)
  const [previewImages, setPreviewImages] = useState<Record<string, string>>({})
  const count = usePreviewCount()
  const preview = photos.slice(0, count).map(photo => ({ photo, src: previewImages[photo.id] ?? `/images/personal/${photo.name}-thumb.webp` }))
  const openPhoto: OpenPhoto = opener => {
    setRequest({ opener })
    if (!Sheet) void load()
  }
  useEffect(() => {
    if (!Sheet || !request) return
    sheetRef.current?.openPhoto(request.opener)
  }, [Sheet, request])
  useEffect(() => {
    if (Sheet || !request) return
    const cancel = (event: KeyboardEvent) => { if (event.key === "Escape") setRequest(null) }
    window.addEventListener("keydown", cancel)
    return () => window.removeEventListener("keydown", cancel)
  }, [Sheet, request])

  return (
    <>
      {children ? children(openPhoto) : <PersonalPhotosPreview onOpen={openPhoto} onIntent={warm} status={status} items={preview} />}
      {Sheet ? <Sheet ref={sheetRef} onPreviewImagesChange={setPreviewImages} /> : null}
    </>
  )
}

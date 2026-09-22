import { PHOTO_WALL_WARP_SCALE } from "./photoWallWarp"

/** Composite visible photographs into one texture, then bend that entire
 * texture. No per-photo rotation or deformation is involved. */
export function renderPhotoWall(canvas: HTMLCanvasElement, stage: HTMLElement, surface: HTMLElement) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true })
  if (!gl) return null
  const vertex = `attribute vec2 position; varying vec2 uv;
    void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`
  const makeProgram = (fragment: string) => {
    const program = gl.createProgram()!
    for (const [type, code] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, code); gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); gl.deleteProgram(program); return null }
      gl.attachShader(program, shader); gl.deleteShader(shader)
    }
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); return null }
    return program
  }
  const photo = makeProgram(`precision mediump float; varying vec2 uv;
    uniform sampler2D image; uniform vec2 size; uniform float radius; uniform float level; uniform float opacity;
    void main(){
      vec2 point=(uv-.5)*size;
      vec2 q=abs(point)-(size*.5-radius);
      float d=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
      float alpha=1.-smoothstep(-.6,.6,d);
      vec2 sampleUV=uv;
      if(level>0.){float a=-.05236; vec2 p=(uv-.5)*size;
        sampleUV=(mat2(cos(a),-sin(a),sin(a),cos(a))*p/1.09)/size+.5;}
      vec4 color=texture2D(image,sampleUV);
      gl_FragColor=vec4(color.rgb,color.a*alpha*opacity);
    }`)
  const warp = makeProgram(`precision highp float; varying vec2 uv;
    uniform sampler2D image; uniform vec2 size; uniform float bend; uniform float rim;
    void main(){
      vec2 p=vec2(uv.x,1.-uv.y); vec2 n=p*2.-1.;
      vec2 offset=vec2(bend*sin(p.y*6.283185307)*sin(p.x*3.141592654)+rim*n.x*n.y*n.y*(1.-n.x*n.x),rim*n.y*n.x*n.x*(1.-n.y*n.y));
      offset*=min(size.x,size.y)*${PHOTO_WALL_WARP_SCALE / 2}/size;
      gl_FragColor=texture2D(image,uv+vec2(offset.x,-offset.y));
    }`)
  if (!photo || !warp) { if (photo) gl.deleteProgram(photo); if (warp) gl.deleteProgram(warp); return null }
  const buffer = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)
  const texture = () => {
    const value = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, value)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return value
  }
  const scene = texture()
  const framebuffer = gl.createFramebuffer()!
  const textures = new Map<string, WebGLTexture>()
  const slides = Array.from(surface.querySelectorAll<HTMLElement>(".personal-photos-slide"))
  const reduced = matchMedia("(prefers-reduced-motion: reduce)")
  let frame = 0
  let disposed = false
  const bindProgram = (program: WebGLProgram) => {
    gl.useProgram(program)
    const position = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  }
  const paint = () => {
    frame = 0
    if (disposed || gl.isContextLost()) return
    const settings = getComputedStyle(stage)
    const bend = parseFloat(settings.getPropertyValue("--wall-bend")) || 0
    const rim = parseFloat(settings.getPropertyValue("--wall-rim")) || 0
    const enabled = !reduced.matches && Boolean(bend || rim) && !stage.hasAttribute("data-held") && !stage.hasAttribute("data-hold-snap") && !surface.querySelector(".personal-photos-slide:focus-visible")
    surface.toggleAttribute("data-warp-ready", enabled)
    if (!enabled) return
    const bounds = stage.getBoundingClientRect()
    const ratio = Math.min(devicePixelRatio, 2)
    const width = Math.round(bounds.width * ratio), height = Math.round(bounds.height * ratio)
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width; canvas.height = height
      gl.bindTexture(gl.TEXTURE_2D, scene)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, scene, 0)
    }
    let pendingImage = false
    const visible = slides.flatMap(slide => {
      const box = slide.getBoundingClientRect()
      if (box.right < bounds.left || box.left > bounds.right || box.bottom < bounds.top || box.top > bounds.bottom) return []
      const img = slide.querySelector("img")!
      if (!img.complete || !img.naturalWidth) { pendingImage = true; return [] }
      const style = getComputedStyle(slide)
      return [{ img, box, opacity: parseFloat(style.opacity), radius: parseFloat(style.borderTopLeftRadius) * box.width / slide.offsetWidth, level: Boolean(slide.querySelector(".personal-photo-level")) }]
    })
    if (pendingImage) { surface.removeAttribute("data-warp-ready"); return }
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    bindProgram(photo)
    for (const { img, box, opacity, radius, level } of visible) {
      let bitmap = textures.get(img.currentSrc)
      if (!bitmap) {
        bitmap = texture()
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        textures.set(img.currentSrc, bitmap)
      }
      gl.bindTexture(gl.TEXTURE_2D, bitmap)
      gl.viewport(Math.round((box.left-bounds.left)*ratio),Math.round((bounds.bottom-box.bottom)*ratio),Math.round(box.width*ratio),Math.round(box.height*ratio))
      gl.uniform2f(gl.getUniformLocation(photo,"size"),box.width,box.height)
      gl.uniform1f(gl.getUniformLocation(photo,"radius"),radius)
      gl.uniform1f(gl.getUniformLocation(photo,"level"),level?1:0)
      gl.uniform1f(gl.getUniformLocation(photo,"opacity"),opacity)
      gl.drawArrays(gl.TRIANGLES,0,6)
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER,null)
    gl.disable(gl.BLEND)
    gl.viewport(0,0,width,height)
    gl.clear(gl.COLOR_BUFFER_BIT)
    bindProgram(warp)
    gl.bindTexture(gl.TEXTURE_2D,scene)
    gl.uniform2f(gl.getUniformLocation(warp,"size"),bounds.width,bounds.height)
    gl.uniform1f(gl.getUniformLocation(warp,"bend"),bend)
    gl.uniform1f(gl.getUniformLocation(warp,"rim"),rim)
    gl.drawArrays(gl.TRIANGLES,0,6)
    // Selection/release transitions run briefly; the idle wall has no loop.
    if (surface.getAnimations({subtree:true}).some(animation=>animation.playState === "running")) request()
  }
  const request = () => { if (!disposed && !frame) frame = requestAnimationFrame(paint) }
  const observer = new ResizeObserver(request)
  observer.observe(stage)
  const mutations = new MutationObserver(request)
  mutations.observe(stage,{subtree:true,attributes:true,attributeFilter:["style","data-held","data-hold-snap"]})
  surface.addEventListener("focusin",request)
  surface.addEventListener("focusout",request)
  surface.addEventListener("load",request,true)
  surface.addEventListener("transitionrun",request)
  stage.addEventListener("photo-wall-paint",request)
  window.addEventListener("photo-wall-curve-change",request)
  reduced.addEventListener("change",request)
  const lost = (event: Event) => { event.preventDefault(); surface.removeAttribute("data-warp-ready") }
  canvas.addEventListener("webglcontextlost",lost)
  request()
  return () => {
    disposed=true; cancelAnimationFrame(frame); observer.disconnect(); mutations.disconnect()
    surface.removeAttribute("data-warp-ready")
    surface.removeEventListener("focusin",request); surface.removeEventListener("focusout",request)
    surface.removeEventListener("load",request,true); surface.removeEventListener("transitionrun",request)
    stage.removeEventListener("photo-wall-paint",request); window.removeEventListener("photo-wall-curve-change",request)
    reduced.removeEventListener("change",request); canvas.removeEventListener("webglcontextlost",lost)
    textures.forEach(value=>gl.deleteTexture(value)); gl.deleteTexture(scene); gl.deleteFramebuffer(framebuffer)
    gl.deleteBuffer(buffer); gl.deleteProgram(photo); gl.deleteProgram(warp)
  }
}

/**
 * The glass pebble from the personal-photos material study, drawn for the
 * whole photo globe in one WebGL canvas.
 *
 * Each photo is a closed slab: a gently domed face, and a shoulder that rolls
 * through a semicircle to the underside, with the photograph wrapping over it.
 * The shader keeps the middle of the photo untouched and lights only the
 * shoulder, with a narrow fresnel rim and a soft off-axis reflection — glass,
 * not a white frame. The study gave every pebble a canvas of its own; a globe
 * of thirty-three would be thirty-three WebGL contexts, more than a browser
 * keeps alive at once, so here one context draws them all.
 */

const vertexSource = `
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;
  attribute float shoulder;
  uniform vec2 angles;
  uniform vec2 center;
  uniform float halfWidth;
  uniform vec2 viewport;
  uniform float depth;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vShoulder;
  vec3 rotate(vec3 p) {
    float sx = sin(angles.x), cx = cos(angles.x);
    float sy = sin(angles.y), cy = cos(angles.y);
    p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
    return vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  }
  void main() {
    vec3 p = rotate(position);
    vPosition = p;
    vNormal = rotate(normal);
    vUv = uv;
    vShoulder = shoulder;
    // The study's own camera, six widths out, applied per pebble around its
    // centre; the globe's perspective is already in the centre and the size.
    float f = 1.0 / (1.0 - p.z / 6.0);
    vec2 screen = center + vec2(p.x, -p.y) * f * halfWidth;
    // Nearer the viewer is smaller: the globe's depth sorts the pebbles, and
    // each pebble's own thickness sorts its face over its shoulder.
    float z = -(depth + p.z * halfWidth) / 8192.0;
    gl_Position = vec4(screen.x / viewport.x * 2.0 - 1.0, 1.0 - screen.y / viewport.y * 2.0, z, 1.0);
  }
`

const fragmentSource = `
  precision highp float;
  uniform sampler2D photograph;
  uniform float shade;
  uniform float alpha;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vShoulder;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 view = normalize(vec3(0.0, 0.0, 6.0) - vPosition);
    vec3 light = normalize(vec3(-0.6, 0.85, 1.4));
    vec3 halfVector = normalize(light + view);
    vec3 image = texture2D(photograph, vUv).rgb;
    float edge = smoothstep(0.05, 0.75, vShoulder);
    float diffuse = max(0.0, dot(n, light));
    // Preserve the photograph through the middle. The curved side catches
    // directional light, making the same image read as wrapping into depth.
    float lighting = mix(0.97 + 0.035 * diffuse, 0.61 + 0.37 * diffuse, edge);
    vec3 color = image * lighting;
    float fresnel = pow(1.0 - max(0.0, dot(n, view)), 4.0);
    float softbox = pow(max(0.0, dot(n, halfVector)), 72.0);
    float broadReflection = pow(max(0.0, dot(n, halfVector)), 12.0);
    // A clear, narrow rim and a soft off-axis reflection, not a white frame.
    float glass = fresnel * (0.16 + 0.42 * diffuse)
      + softbox * mix(0.018, 0.48, edge)
      + broadReflection * edge * 0.035;
    color = mix(color, vec3(1.0), clamp(glass, 0.0, 0.48));
    // The far side of the globe falls into shadow, as the slides do.
    color *= 1.0 - shade;
    gl_FragColor = vec4(color * alpha, alpha);
  }
`

type Point = [number, number]

/** The pebble's silhouette, clockwise with y up, as `count` points evenly
    spaced along it: a rectangle `2` wide and `2 * aspect` tall whose corners
    are quarter superellipses of exponent 4 — the study's continuous corner,
    which meets each straight side without a kink in curvature. */
function silhouette(aspect: number, count: number): Point[] {
  const r = 0.42 * Math.min(1, aspect)
  const corners: [number, number, number][] = [
    [1 - r, aspect - r, Math.PI / 2],
    [1 - r, -aspect + r, 0],
    [-1 + r, -aspect + r, -Math.PI / 2],
    [-1 + r, aspect - r, -Math.PI],
  ]
  const dense: Point[] = []
  for (const [cx, cy, from] of corners) {
    for (let step = 0; step <= 48; step++) {
      const t = from - step / 48 * Math.PI / 2
      const c = Math.cos(t), s = Math.sin(t)
      dense.push([cx + r * Math.sign(c) * Math.abs(c) ** 0.5, cy + r * Math.sign(s) * Math.abs(s) ** 0.5])
    }
  }
  // Resample by arc length, so the straight sides get their share of points.
  const lengths = [0]
  for (let index = 1; index <= dense.length; index++) {
    const [ax, ay] = dense[index - 1], [bx, by] = dense[index % dense.length]
    lengths.push(lengths[index - 1] + Math.hypot(bx - ax, by - ay))
  }
  const total = lengths[dense.length]
  const points: Point[] = []
  let segment = 0
  for (let index = 0; index < count; index++) {
    const at = index / count * total
    while (lengths[segment + 1] < at) segment++
    const [ax, ay] = dense[segment], [bx, by] = dense[(segment + 1) % dense.length]
    const t = (at - lengths[segment]) / (lengths[segment + 1] - lengths[segment] || 1)
    points.push([ax + (bx - ax) * t, ay + (by - ay) * t])
  }
  return points
}

/** The study's slab, fitted to a slide's own box: the silhouette is the
    slide's outline, so the pebble covers exactly the rectangle the pointer
    and the flights aim at. The flat underside is left out — the globe never
    turns a pebble far enough to show it. */
function pebbleMesh(aspect: number) {
  const count = 128
  const outline = silhouette(aspect, count)
  const outward = outline.map((_, index) => {
    const [px, py] = outline[(index + count - 1) % count]
    const [nx, ny] = outline[(index + 1) % count]
    const dx = nx - px, dy = ny - py
    const magnitude = Math.hypot(dx, dy)
    return [-dy / magnitude, dx / magnitude]
  })
  // World width is 2: at a 160px photo that is a 12px thick slab with a 6px
  // shoulder.
  const halfDepth = 0.075
  const rollWidth = 0.075
  const rings: { fraction: number; inset: number; z: number; angle: number; edge: number }[] = []
  for (const fraction of [0, 0.2, 0.4, 0.6, 0.8, 1]) {
    rings.push({ fraction, inset: rollWidth, z: halfDepth + 0.012 * (1 - fraction * fraction), angle: 0, edge: 0 })
  }
  // The top, equator and underside are one continuous semicircular surface.
  for (let index = 1; index <= 20; index++) {
    const angle = index / 20 * Math.PI
    rings.push({ fraction: 1, inset: rollWidth * (1 - Math.sin(angle)), z: halfDepth * Math.cos(angle), angle, edge: Math.sin(angle / 2) })
  }
  const vertices: number[] = []
  const indices: number[] = []
  rings.forEach((ring, ringIndex) => {
    outline.forEach(([x, y], index) => {
      const [nx, ny] = outward[index]
      const px = (x - nx * ring.inset) * ring.fraction
      const py = (y - ny * ring.inset) * ring.fraction
      const normalSlope = ring.angle === 0 ? 0.025 * ring.fraction : Math.sin(ring.angle)
      // The outermost pixels continue over the side instead of ending at
      // the front face. Texture coordinates remain continuous at every ring.
      const wrap = ring.angle / Math.PI * rollWidth * 1.65
      const u = 0.5 + (px + nx * wrap) / 2
      const v = 0.5 + (py + ny * wrap) / (2 * aspect)
      vertices.push(px, py, ring.z, nx * normalSlope, ny * normalSlope, Math.cos(ring.angle), u, v, ring.edge)
      if (ringIndex > 0) {
        const a = (ringIndex - 1) * count + index
        const b = (ringIndex - 1) * count + (index + 1) % count
        const c = ringIndex * count + index
        const d = ringIndex * count + (index + 1) % count
        indices.push(a, c, b, b, c, d)
      }
    })
  })
  return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) }
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "shader")
  return shader
}

export type PebbleDraw = {
  /** The photo's height over its width. */
  aspect: number
  /** The photo's file; every copy of one photo shares its texture. */
  image: HTMLImageElement
  /** Centre, in CSS pixels of the canvas. */
  x: number
  y: number
  /** Half the drawn width, in CSS pixels. */
  halfWidth: number
  /** Distance towards the viewer, in CSS pixels, for sorting. */
  depth: number
  /** The pebble's lean, in radians: about the screen's x axis, then its y. */
  tiltX: number
  tiltY: number
  shade: number
  alpha: number
}

export type PebbleRenderer = {
  /** Whether the image's texture is uploaded, uploading it if the file is ready. */
  prepare: (image: HTMLImageElement) => boolean
  /** Draws a frame at the canvas's CSS size, which the caller measures so a
      frame never forces a layout read mid-write. */
  draw: (pebbles: PebbleDraw[], width: number, height: number) => void
  dispose: () => void
}

export function createPebbleRenderer(canvas: HTMLCanvasElement, onLost: () => void): PebbleRenderer | null {
  // WebGL 2 for mipmaps on the photos' non-power-of-two sizes: without them
  // a pebble shrinking round the rim samples its photo sparsely and shimmers
  // as the globe turns.
  const gl = canvas.getContext("webgl2", { alpha: true, antialias: true, premultipliedAlpha: true })
  if (!gl) return null
  let program: WebGLProgram
  try {
    program = gl.createProgram()!
    const shaders = [compile(gl, gl.VERTEX_SHADER, vertexSource), compile(gl, gl.FRAGMENT_SHADER, fragmentSource)]
    shaders.forEach((shader) => gl.attachShader(program, shader))
    gl.linkProgram(program)
    shaders.forEach((shader) => gl.deleteShader(shader))
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "link")
  } catch {
    return null
  }
  gl.useProgram(program)
  const uniform = (name: string) => gl.getUniformLocation(program, name)
  const locations = {
    angles: uniform("angles"), center: uniform("center"), halfWidth: uniform("halfWidth"), viewport: uniform("viewport"),
    depth: uniform("depth"), shade: uniform("shade"), alpha: uniform("alpha"), photograph: uniform("photograph"),
  }
  const attributes = (["position", "normal", "uv", "shoulder"] as const).map((name, index) => ({
    location: gl.getAttribLocation(program, name), size: [3, 3, 2, 1][index], offset: [0, 3, 6, 8][index],
  }))
  gl.uniform1i(locations.photograph, 0)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)

  const meshes = new Map<string, { vao: WebGLVertexArrayObject; count: number }>()
  const meshFor = (aspect: number) => {
    const key = aspect.toFixed(4)
    let mesh = meshes.get(key)
    if (!mesh) {
      const { vertices, indices } = pebbleMesh(aspect)
      const vao = gl.createVertexArray()!
      gl.bindVertexArray(vao)
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
      attributes.forEach(({ location, size, offset }) => {
        gl.enableVertexAttribArray(location)
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, 36, offset * 4)
      })
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
      gl.bindVertexArray(null)
      mesh = { vao, count: indices.length }
      meshes.set(key, mesh)
    }
    return mesh
  }

  const textures = new Map<string, WebGLTexture>()
  const prepare = (image: HTMLImageElement) => {
    const key = image.currentSrc
    if (!key || !image.complete || !image.naturalWidth) return false
    if (textures.has(key)) return true
    const texture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    textures.set(key, texture)
    return true
  }

  const onContextLost = (event: Event) => {
    event.preventDefault()
    onLost()
  }
  canvas.addEventListener("webglcontextlost", onContextLost)

  const draw = (pebbles: PebbleDraw[], width: number, height: number) => {
    // Drawn at the device's density, up to 2x; past that the photos' own
    // files have nothing more to give.
    const density = Math.min(devicePixelRatio || 1, 2)
    const pixelWidth = Math.max(1, Math.round(width * density)), pixelHeight = Math.max(1, Math.round(height * density))
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth
      canvas.height = pixelHeight
    }
    gl.viewport(0, 0, pixelWidth, pixelHeight)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.uniform2f(locations.viewport, width, height)
    // Back to front, so a pebble fading out round the rim blends over the
    // ones behind it rather than punching a hole through them.
    for (const pebble of [...pebbles].sort((a, b) => a.depth - b.depth)) {
      const texture = textures.get(pebble.image.currentSrc)
      if (!texture) continue
      const mesh = meshFor(pebble.aspect)
      gl.bindVertexArray(mesh.vao)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.uniform2f(locations.angles, pebble.tiltX, pebble.tiltY)
      gl.uniform2f(locations.center, pebble.x, pebble.y)
      gl.uniform1f(locations.halfWidth, pebble.halfWidth)
      gl.uniform1f(locations.depth, pebble.depth)
      gl.uniform1f(locations.shade, pebble.shade)
      gl.uniform1f(locations.alpha, pebble.alpha)
      gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0)
    }
    gl.bindVertexArray(null)
  }

  const dispose = () => {
    canvas.removeEventListener("webglcontextlost", onContextLost)
    gl.getExtension("WEBGL_lose_context")?.loseContext()
  }

  return { prepare, draw, dispose }
}

// The package exports individual icon modules, but 4.3.2 only ships the
// catalog's declaration file. Each default export uses the renderer's SVG type.
declare module "@hugeicons/core-free-icons/*" {
  const icon: import("@hugeicons/react").IconSvgElement
  export default icon
}

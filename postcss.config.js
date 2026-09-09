export default {
  plugins: {
    // Tailwind's own Lightning CSS pass rewrites the site's gradients and colour
    // syntax (reversing `to top` stops, dropping implied positions), which the
    // browser tests read back verbatim. Autoprefixer keeps the vendor prefixes
    // that pass would otherwise have added, and Vite still minifies the output.
    "@tailwindcss/postcss": { optimize: false },
    autoprefixer: {},
  },
}

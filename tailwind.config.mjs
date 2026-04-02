/** @type {import('tailwindcss').Config} */
export default {
  // Important: we inject legacy HTML via `set:html`, so Tailwind must also scan `/en/*.html`
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}", "./en/**/*.html", "./public/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};


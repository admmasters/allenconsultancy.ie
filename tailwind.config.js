/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "allen-primary": "#1e40af",
        "allen-primary-dark": "#1e3a8a",
        "allen-primary-light": "#3b82f6",
        "allen-secondary": "#64748b",
        "allen-secondary-dark": "#475569",
        "allen-secondary-light": "#94a3b8",
        "allen-accent": "#059669",
        "allen-warning": "#d97706",
        "allen-error": "#dc2626",
      },
      fontFamily: {
        allen: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      spacing: {
        "allen-xs": "0.25rem",
        "allen-sm": "0.5rem",
        "allen-md": "1rem",
        "allen-lg": "1.5rem",
        "allen-xl": "2rem",
        "allen-2xl": "3rem",
      },
      boxShadow: {
        "allen-sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "allen-md":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "allen-lg":
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        allen: "0.5rem",
      },
    },
  },
  plugins: [],
};

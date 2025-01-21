/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.html", "./template/*.html"],
  plugins: [require("@tailwindcss/typography")],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        "inticoy-dark": {
          DEFAULT: "#303B47", // 기본 색상 (더 밝은 색)
        },
      },
    },
  },
};

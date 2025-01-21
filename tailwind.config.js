/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.html", "./template/*.html"],
  plugins: [require("@tailwindcss/typography")],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        "inticoy-dark": {
          DEFAULT: "#303B47",
        },
        "inticoy-blue": {
          DEFAULT: "#3C4C55",
        },
      },
      fontFamily: {
        sans: ["'Noto Sans KR'", "sans-serif"], // 기본 sans를 Noto Sans KR로 설정
      },
    },
  },
};

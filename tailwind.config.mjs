/** @type {import('tailwindcss').Config} */
export default {
  plugins: [require("@tailwindcss/typography")],
  darkMode: "class", // 다크 모드 전환을 위해 'class' 설정
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
        sans: ["'Noto Sans KR'", "sans-serif"],
      },
    },
  },
};

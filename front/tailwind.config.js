/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html", // 루트 폴더의 모든 html 파일
    "./src/**/*.html", // src 폴더가 있다면 그 안의 모든 html 파일
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

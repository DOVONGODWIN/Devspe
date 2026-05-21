/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15172B",
        sub: "#5A5C6E",
        nexbg: "#F4F5FA",
        primary: "#4A3FB5",
        violet2: "#6A3FBF",
        indigo2: "#3B3B92",
        silver: "#D6D8F0",
      },
      backgroundImage: {
        "nex-grad": "linear-gradient(135deg, #3B3B92 0%, #6A3FBF 100%)",
      },
      borderRadius: { xl2: "20px" },
      fontFamily: { sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
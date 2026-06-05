/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Navy blue — extracted from logo text, star & book */
        brand: {
          50: "#eef1f8",
          100: "#d9e1f2",
          200: "#b3c3e5",
          300: "#8da4d4",
          400: "#5f7fbf",
          500: "#3d5fa3",
          600: "#1b3575",
          700: "#152961",
          800: "#0f2047",
          900: "#0a1633",
          950: "#060e22",
        },
        /* Red — extracted from logo border ring */
        accent: {
          50: "#fdf2f2",
          100: "#fce8e8",
          200: "#f9cfcf",
          300: "#f4a8a8",
          400: "#e86b6b",
          500: "#d42b2b",
          600: "#c62828",
          700: "#a91e1e",
          800: "#8b1818",
          900: "#731616",
          950: "#400a0a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        brand: "0 4px 14px 0 rgba(27, 53, 117, 0.15)",
        "brand-lg": "0 10px 40px -10px rgba(27, 53, 117, 0.25)",
        accent: "0 4px 14px 0 rgba(198, 40, 40, 0.2)",
        card: "0 1px 3px rgba(15, 32, 71, 0.06), 0 4px 16px rgba(15, 32, 71, 0.04)",
        "card-hover": "0 8px 30px rgba(15, 32, 71, 0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        ticker: "ticker 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

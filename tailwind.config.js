/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    darkMode: "class",
    extend: {
      colors: {
        "primary": "#EBECF4",
        "secondary": "#172b4d",
        "card": "#f4f8fa",
        "d-gray": "#d4d7dd",
        "button": {
          "primary": "#0953c1",
          "hover": "#084baf"
        },
        "dark-brd": "#14213d",
        "dark-blue": "#0747A6",
        "light-blue": "#dfe9ff",
        "accent": "#ef476f",
        "danger": "#F00",
        "success": "#0F0",
        
        "dark": {
          "primary": "#17171f",
          "secondary": "#434354",
          "light": "#bdc0c3",
          "btn-text": "#DDD",
          "card": "#22252b",
          "l-gray": "#afb4b7",
          "d-gray": "#d4d7dd",
          "dark": "#14213d",
          "dark-blue": "#17191e",
          "light-blue": "#dfe9ff",
          "accent": "#9496e2",
          // "accent": "#5255ca",
          "accent-2": "#3F3F5D",
          "danger": "#F00",
          "success": "#0F0"
        },
        
      },
      borderColor: {
        "light": "#e6e9eb",
        "dark": "#353a3e",
        "file-inp": "#0953c1"
      },
      fontSize: {
        "xsm": "0.8rem"
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif']
      }
    },
  },
  plugins: [],
}

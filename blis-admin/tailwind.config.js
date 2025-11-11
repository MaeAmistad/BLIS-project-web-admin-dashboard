/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        "dark-purple":"#081a51",
        "light-white":"rgba(255,255,255,0.18",
      },
      fontFamily:{
        poppins: ["Poppins", "sans-serif"],
      },
      
    },
  },
  plugins: [],
  variants:{
    extend:{
      display: ["focus-group"]
    }
  }
}


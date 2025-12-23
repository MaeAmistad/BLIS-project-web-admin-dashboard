/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];

export const theme = {
  extend: {
    blur: {
      xs: "2px",
    },
    width: {
      50: "200px",
      75: "310px",
      85: "450px",
      100: "610px",
      "1/2": "60%",
      58: "238px",
      30: "115px",
    },
    animation: {
      "wave-slow": "waveUpDown 6s ease-in-out infinite",
      "wave-medium": "waveUpDown 4s ease-in-out infinite",
      "wave-fast": "waveUpDown 3s ease-in-out infinite",
    },
    keyframes: {
      waveUpDown: {
        "0%, 100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(12px)" },
      },
    },

    /* ✅ MOVE COLORS HERE */
    colors: {
      primary: {
        DEFAULT: "#2E7D32",
        light: "#4CAF50",
      },
      neutral: {
        white: "#FFFFFF",
        light: "#F5F5F5",
        dark: "#424242",
      },
      secondary: {
        DEFAULT: "#1565C0",
        light: "#1E88E5",
      },
      accent: {
        yellow: "#FBC02D",
        orange: "#FB8C00",
        red: "#D32F2F",
      },
    },
  },
};

export const plugins = [];

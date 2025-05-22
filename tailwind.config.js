/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./modules/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary:'#003b73',
        secondary:{
          DEFAULT:'#4a90e2',
          100:'',
          200:''
        }
      } 
    },
  },
  plugins: [],
}


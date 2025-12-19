import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(180deg, #FFF7E8 0%, #FFFFFF 60%)',
        'cta-gradient': 'linear-gradient(180deg, #0F1B2E 0%, #0B1422 100%)',
        'gold-button': 'linear-gradient(180deg, #F8A219 0%, #E28A00 100%)',
      },
      boxShadow: {
        card: '0 4px 20px rgba(11, 20, 34, 0.06)',
      },
      borderRadius: {
        xl: '16px',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        goldTheme: {
          'primary': '#F8A219',
          'primary-focus': '#E28A00',
          'secondary': '#FFF7E8',
          'neutral': '#0B1422',
          'base-100': '#FFFFFF',
          'accent': '#F5A000',
        },
      },
    ],
    logs: false,
  },
}

export default config

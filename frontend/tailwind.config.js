/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0A2540',
          slate: '#0F172A',
          canvas: '#F6F8FB',
          surface: '#FFFFFF',
          subtle: '#F1F5F9',
          border: '#E2E8F0',
        },
        traffic: {
          green: '#00875A',
          greenSubtle: '#E6F8F3',
          red: '#D92D20',
          redSubtle: '#FEE4E2',
          amber: '#F79009',
          amberSubtle: '#FEF0C7',
          blue: '#155EEF',
          blueSubtle: '#EFF4FF',
          purple: '#6938EF',
          purpleSubtle: '#F4F3FF',
          orange: '#EA580C',
          orangeSubtle: '#FFEDD5',
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        'xs': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}

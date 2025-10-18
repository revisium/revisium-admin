import { createSystem, defaultConfig } from '@chakra-ui/react'

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        gray: {
          50: { value: '#F7FAFC' },
          100: { value: '#EDF2F7' },
          200: { value: '#E2E8F0' },
          300: { value: '#CBD5E0' },
          400: { value: '#A0AEC0' },
          500: { value: '#718096' },
          600: { value: '#4A5568' },
          700: { value: '#2D3748' },
          800: { value: '#1A202C' },
          900: { value: '#171923' },
        },
        newGray: {
          50: { value: '#F7FAFC' },
          100: { value: '#F5F5F5' },
          200: { value: '#E5E5E5' },
          300: { value: '#D4D4D4' },
          400: { value: '#A3A3A3' },
          500: { value: '#737373' },
          600: { value: '#525252' },
          700: { value: '#2D3748' },
          800: { value: '#1A202C' },
          900: { value: '#171717' },
        },
      },
    },
  },
})

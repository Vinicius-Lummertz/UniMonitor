/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Paleta Pastel Padrão (Beige & Rosa)
                primary: {
                    50: '#FFF9F5',
                    100: '#FFF4ED',
                    200: '#FFE4D6',
                    300: '#FFD4BF',
                    400: '#F5C6A8',
                    500: '#E8B897',
                    600: '#D4A485',
                    700: '#C09073',
                    800: '#A87D62',
                    900: '#8C6A51',
                },
                secondary: {
                    50: '#FFF5F7',
                    100: '#FFE4E9',
                    200: '#FFC1CC',
                    300: '#FF9EB0',
                    400: '#FF7B94',
                    500: '#F87171',
                    600: '#E85D5D',
                    700: '#D44949',
                    800: '#C03636',
                    900: '#A02323',
                },
                neutral: {
                    50: '#FAFAF9',
                    100: '#F5F5F4',
                    200: '#E7E5E4',
                    300: '#D6D3D1',
                    400: '#A8A29E',
                    500: '#78716C',
                    600: '#57534E',
                    700: '#44403C',
                    800: '#292524',
                    900: '#1C1917',
                },
                // Temas customizáveis (definidos via CSS vars)
                theme: {
                    50: 'rgb(var(--theme-50) / <alpha-value>)',
                    100: 'rgb(var(--theme-100) / <alpha-value>)',
                    200: 'rgb(var(--theme-200) / <alpha-value>)',
                    300: 'rgb(var(--theme-300) / <alpha-value>)',
                    400: 'rgb(var(--theme-400) / <alpha-value>)',
                    500: 'rgb(var(--theme-500) / <alpha-value>)',
                    600: 'rgb(var(--theme-600) / <alpha-value>)',
                    700: 'rgb(var(--theme-700) / <alpha-value>)',
                    800: 'rgb(var(--theme-800) / <alpha-value>)',
                    900: 'rgb(var(--theme-900) / <alpha-value>)',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
                'soft-lg': '0 8px 24px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04)',
                'colored': '0 4px 14px var(--shadow-color, rgba(0, 0, 0, 0.1))',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}

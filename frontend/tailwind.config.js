/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#667eea',
                    secondary: '#764ba2',
                    accent: '#f093fb',
                },
                surface: {
                    white: '#ffffff',
                    off: '#f8f9ff',
                },
                text: {
                    main: '#333333',
                    muted: '#666666',
                    light: '#ffffff',
                }
            },
            fontFamily: {
                sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 20px 60px rgba(0,0,0,0.3)',
                'hover': '0 10px 20px rgba(102, 126, 234, 0.3)',
            },
            backgroundImage: {
                'main-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'btn-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'btn-accent': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            }
        },
    },
    plugins: [],
}

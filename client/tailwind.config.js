module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0c1d40',
                    100: '#3c4a66',
                    50: '#ced1d8',
                },
                secondary: {
                    DEFAULT: '#19aec0',
                },
                black: {
                    DEFAULT: '#333333',
                },
                'db-secondary': {
                    DEFAULT: '#FF815C',
                    400: '#FFA68C',
                    100: '#FFF2EE',
                },
                // use this for dashboard background???
                'light-gray': {
                    DEFAULT: '#F8F8F9',
                },
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                'ping-button': {
                    '75%, 100%': { transform: 'scale(1.1, 1.2)', opacity: 0 },
                },
            },
            animation: {
                wiggle: 'wiggle 1s ease-in-out infinite',
                'ping-button': 'ping-button 1s cubic-bezier(0, 0, 0.2, 1) infinite',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        // ...
    ],
};


// primary: #19aec0

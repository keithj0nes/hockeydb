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
                },
                secondary: {
                    DEFAULT: '#19aec0',
                },
                black: {
                    DEFAULT: '#333333',
                },

                'db-secondary': {
                    DEFAULT: '#ff815c',
                },

                // use this for dashboard background???
                'light-gray': {
                    DEFAULT: '#F8F8F9',
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        // ...
    ],
};


// primary: #19aec0

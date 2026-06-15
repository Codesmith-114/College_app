/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './client/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                accent: 'var(--color-accent)',
            },
        },
    },
    plugins: [],
};

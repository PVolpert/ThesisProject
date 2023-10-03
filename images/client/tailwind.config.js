/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            gridTemplateColumns: {
                autofit: 'repeat(auto-fit, minmax(min(10ch,100%),35ch))',
            },
            colors: {
                springred: '#BE1F35',
                springblue: '#4590FF',
            },
        },
    },
    plugins: [],
};

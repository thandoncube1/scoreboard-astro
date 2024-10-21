/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        screens: {
            sm: "576px",
            // => @media (min-width: 576px) { ... }

            md: "960px",
            // => @media (min-width: 960px) { ... }

            lg: "1440px",
            // => @media (min-width: 1440px) { ... }
        },
        extend: {},
    },
    plugins: [],
};

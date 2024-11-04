/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
        "./src/components/**/*.{tsx,html,astro,jsx,md,js,mdx}"
    ],
    theme: {
        screens: {
            sm: { "min": "360px", "max": "700px" },
            // => @media (min-width: 576px) { ... }

            md: { "min": "768px", "max": "1280px"},
            // => @media (min-width: 960px) { ... }

            lg: "1440px",
            // => @media (min-width: 1440px) { ... }
            xl: "2448px"
        },
        extend: {
            colors: {
                background: "var-(--background)",
                foreground: "var-(--foreground)",
                primary: "#B388EB"
            }
        },
    },
    plugins: [],
};

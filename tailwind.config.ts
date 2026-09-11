/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: "#FBF3EC",
                    100: "#F5E4D4",
                    200: "#EACBAE",
                    300: "#DBA97B",
                    400: "#C58A54",
                    500: "#A9713F",
                    600: "#8A5A32",
                    700: "#6E4627",
                    800: "#5A3A22",
                    900: "#3F2818",
                },
                cream: "#F4F2EF",
                ink: "#26201B",
                muted: "#8A8078",
            },
            fontFamily: {
                display: ["'Fraunces'", "serif"],
                body: ["'Manrope'", "sans-serif"],
            },
            boxShadow: {
                card: "0 4px 24px rgba(60, 45, 30, 0.06)",
                soft: "0 12px 40px rgba(60, 45, 30, 0.10)",
            },
            borderRadius: {
                xl2: "1.75rem",
            },
        },
    },
    plugins: [],
};

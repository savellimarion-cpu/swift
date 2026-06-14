import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Base (charte : fond clair, accents turquoise/violet) ---
        paper: "#FAFAFC",
        ink: "#08080F",
        line: "#E4E4ED",

        // --- Accent agent (violet/pink utilisent les teintes Tailwind
        // violet-500 #8b5cf6 et pink-500 #ec4899, qui correspondent déjà à
        // la charte / au 3e accent proposé) ---
        // Le turquoise de la charte (#00E5D4) est très clair : en texte ou
        // bordure sur fond clair, le contraste est ~1.6:1 (illisible).
        // `turquoise` est donc une version assombrie (même teinte, ~3:1) ;
        // `turquoise-bright` garde la valeur exacte de la charte pour un
        // usage en remplissage (fond saturé + texte sombre dessus).
        turquoise: "#00A99B",
        "turquoise-bright": "#00E5D4",

        // --- Couleurs sémantiques (statuts : validé/publié/erreur) ---
        forest: "#3C6E4F",
        steel: "#3A5A8C",
        clay: "#A4523A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

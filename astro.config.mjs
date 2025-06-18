import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
// Suppression de l'import compress
// import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  experimental: {
    viewTransitions: true,
  },
  integrations: [
    tailwind()
    // Suppression de l'intégration compress
    // compress()
  ],
  // Configuration pour générer tous les fichiers HTML à la racine du répertoire dist
  build: {
    format: 'file'
  }
});

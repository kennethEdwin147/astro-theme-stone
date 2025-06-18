import fs from 'fs';
import path from 'path';

// Fonction pour parcourir récursivement un répertoire
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// Fonction pour modifier les chemins dans un fichier HTML
function fixHtmlPaths(filePath) {
  console.log(`Traitement du fichier HTML: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remplacer les chemins absolus par des chemins relatifs
  content = content.replace(/href="\//g, 'href="./');
  content = content.replace(/src="\//g, 'src="./');
  content = content.replace(/href="\/_astro\//g, 'href="./_astro/');
  content = content.replace(/src="\/_astro\//g, 'src="./_astro/');
  
  // Corriger les chemins dans les attributs Alpine.js
  content = content.replace(/:src="(\$store\.theme\.isDark \? ')\/assets\/([^']+)' : '\/assets\/([^']+)'/g, 
                           `:src="$1./assets/$2' : './assets/$3'`);
  
  fs.writeFileSync(filePath, content);
  console.log(`Chemins corrigés dans: ${filePath}`);
}

// Fonction pour modifier les chemins dans un fichier CSS
function fixCssPaths(filePath) {
  console.log(`Traitement du fichier CSS: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remplacer les chemins absolus par des chemins relatifs dans les URL CSS
  content = content.replace(/url\(\/_astro\//g, 'url(../_astro/');
  
  fs.writeFileSync(filePath, content);
  console.log(`Chemins corrigés dans: ${filePath}`);
}

// Traiter les fichiers dans le répertoire dist
const distDir = '/home/kenneth/dev/templates/astro-theme-stone/dist';

// Traiter les fichiers HTML
fs.readdirSync(distDir).forEach(file => {
  if (file.endsWith('.html')) {
    fixHtmlPaths(path.join(distDir, file));
  }
});

// Traiter les fichiers CSS dans le répertoire _astro
const astroDir = path.join(distDir, '_astro');
if (fs.existsSync(astroDir)) {
  fs.readdirSync(astroDir).forEach(file => {
    if (file.endsWith('.css')) {
      fixCssPaths(path.join(astroDir, file));
    }
  });
}

console.log('Tous les chemins ont été corrigés avec succès!');

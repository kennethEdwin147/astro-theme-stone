import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fonction pour parcourir récursivement un répertoire
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// Fonction pour déterminer le chemin relatif à partir d'un fichier HTML vers la racine
function getRelativePath(filePath) {
  const distDir = path.resolve('/home/kenneth/dev/templates/astro-theme-stone/dist');
  const fileDir = path.dirname(filePath);
  const relativePath = path.relative(fileDir, distDir);
  return relativePath === '' ? '.' : relativePath;
}

// Fonction pour modifier les chemins dans un fichier HTML
function fixPaths(filePath) {
  if (!filePath.endsWith('.html')) return;
  
  console.log(`Traitement du fichier: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const relativePath = getRelativePath(filePath);
  
  // Remplacer les chemins absolus par des chemins relatifs
  content = content.replace(/href="\//g, `href="${relativePath}/`);
  content = content.replace(/src="\//g, `src="${relativePath}/`);
  content = content.replace(/href="\/_astro\//g, `href="${relativePath}/_astro/`);
  content = content.replace(/src="\/_astro\//g, `src="${relativePath}/_astro/`);
  
  // Cas spécial pour les fichiers à la racine (comme index.html)
  if (relativePath === '.') {
    content = content.replace(/href="\.\/\//g, 'href="./');
    content = content.replace(/src="\.\/\//g, 'src="./');
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Chemins corrigés dans: ${filePath}`);
}

// Parcourir tous les fichiers HTML dans le répertoire dist
const distDir = '/home/kenneth/dev/templates/astro-theme-stone/dist';
walkDir(distDir, fixPaths);

console.log('Tous les chemins ont été corrigés avec succès!');

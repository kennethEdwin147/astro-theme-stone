import fs from 'fs';
import path from 'path';

// Fonction pour parcourir les fichiers HTML dans le répertoire dist
function processHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile() && file.endsWith('.html')) {
      console.log(`Traitement du fichier: ${filePath}`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remplacer les chemins absolus par des chemins relatifs
      // Comme tous les fichiers sont maintenant à la racine, nous pouvons simplement remplacer / par ./
      content = content.replace(/href="\//g, 'href="./');
      content = content.replace(/src="\//g, 'src="./');
      content = content.replace(/href="\/_astro\//g, 'href="./_astro/');
      content = content.replace(/src="\/_astro\//g, 'src="./_astro/');
      
      fs.writeFileSync(filePath, content);
      console.log(`Chemins corrigés dans: ${filePath}`);
    }
  });
}

// Traiter les fichiers HTML dans le répertoire dist
const distDir = '/home/kenneth/dev/templates/astro-theme-stone/dist';
processHtmlFiles(distDir);

console.log('Tous les chemins ont été corrigés avec succès!');

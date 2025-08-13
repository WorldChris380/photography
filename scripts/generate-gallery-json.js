// Wichtig: Diese Datei kann mit 
// node scripts/generate-gallery-json.js 
// ausgeführt werden und erstellt dann ein einziges gallery.json mit allen Bildern

const fs = require('fs');
const path = require('path');

const IMG_ROOT = path.join(__dirname, '../public/img/photography');
const OUTPUT_FILE = path.join(__dirname, '../src/assets/gallery.json');
const SERVER_BASE = 'assets/img/photography/';

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (/\.(jpe?g|png|webp)$/i.test(file)) {
      results.push(fullPath);
    }
  });
  return results;
}

function relGalleryPath(fullPath) {
  return path.relative(IMG_ROOT, fullPath).replace(/\\/g, '/');
}

const allImages = walk(IMG_ROOT).map(fullPath => {
  const relPath = relGalleryPath(fullPath);
  const fileName = path.basename(fullPath, path.extname(fullPath)).replace(/-/g, ' ');
  return {
  src: SERVER_BASE + relPath,
    description: fileName
  };
});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allImages, null, 2));
console.log(`gallery.json mit ${allImages.length} Bildern wurde erstellt!`);
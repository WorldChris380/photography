// Wichtig: Diese Datei kann mit 
// node scripts/generate-gallery-json.js 
// ausgeführt werden und erstellt dann das Bilder JSON inklusive Bildbeschreibungen aus dem Dateinamen
// Die Pfade für die Konstanten IMG_DIR und OUT_FILE müssen evtl. angepasst werden!

const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, '../src/assets/img/photography');
const OUT_FILE = path.join(__dirname, '../src/assets/gallery.json');

function walk(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, filelist);
    } else if (/\.(jpe?g|png|gif|webp)$/i.test(file)) {
      filelist.push(filepath);
    }
  });
  return filelist;
}

const images = walk(IMG_DIR).map(fullPath => {
  // src ab assets/img/... erzeugen
  const relPath = 'assets/img/photography/' + path.relative(IMG_DIR, fullPath).replace(/\\/g, '/');
  // Kategorie aus erstem Unterordner nach img extrahieren
  const parts = path.relative(IMG_DIR, fullPath).split(path.sep);
  const category = parts.length > 1 ? parts[0] : 'uncategorized';
  // Beschreibung aus Dateinamen ohne Endung
  const fileName = path.basename(fullPath, path.extname(fullPath)).replace(/-/g, ' ');
  return {
    src: relPath,
    category,
    description: fileName
  };
});

fs.writeFileSync(OUT_FILE, JSON.stringify(images, null, 2));
console.log(`Gallery JSON written to ${OUT_FILE}`);
// Dieses Skript kann mit
// node scripts/resize-images.js
// ausgeführt werden. 
// sharp muss installiert sein (npm install sharp)

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Mehrere Input-Ordner
const inputDirs = [
  'D:/Bilder/Aviation',
  'D:/Bilder/Travel'
];
const outputDir = path.join(__dirname, '../src/assets/img/photography');
const allowedExtensions = ['.jpg', '.jpeg'];

function resizeImage(inputPath, outputPath) {
  const extname = path.extname(inputPath).toLowerCase();
  const quality = 60; // Set quality to 60%

  let resizeOperation = sharp(inputPath).resize({ width: 1280, withoutEnlargement: true }); // Bildgröße einstellen

  if (extname === '.jpg' || extname === '.jpeg') {
    resizeOperation = resizeOperation.jpeg({ quality });
  } else if (extname === '.webp') {
    resizeOperation = resizeOperation.webp({ quality });
  }

  return resizeOperation
    .toFile(outputPath)
    .then(() => console.log(`Resized: ${outputPath}`))
    .catch(err => console.error(`Error resizing ${inputPath}:`, err));
}

function processDir(dir, outputMainDir, baseDir) {
  fs.readdirSync(dir).forEach(file => {
    const inputPath = path.join(dir, file);
    const relPath = path.relative(baseDir, inputPath);
    const outputPath = path.join(outputMainDir, relPath);

    if (fs.statSync(inputPath).isDirectory()) {
      if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });
      processDir(inputPath, outputMainDir, baseDir); // <--- outputMainDir bleibt immer gleich!
    } else if (allowedExtensions.includes(path.extname(file).toLowerCase())) {
      const outputFolder = path.dirname(outputPath);
      if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });
      resizeImage(inputPath, outputPath);
    }
  });
}

// Für jeden Input-Ordner die Struktur beibehalten
inputDirs.forEach(inputDir => {
  const mainFolder = path.basename(inputDir);
  const outputMainDir = path.join(outputDir, mainFolder);
  processDir(inputDir, outputMainDir, inputDir);
});
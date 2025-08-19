// Dieses Skript kann mit
// node scripts/resize-images.js
// ausgeführt werden. 
// sharp muss installiert sein (npm install sharp)

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Mehrere Input-Ordner
const inputDirs = [
  'D:/Bilder/Aviation',
  'D:/Bilder/Travel'
];
const outputDir = 'D:/Bilder/Kompilierte Website Bilder';
const allowedExtensions = ['.jpg', '.jpeg'];

// Zielbreite für das Skalieren
const TARGET_WIDTH = 1200;

// Nur Dateien, die mit "web.jpg" oder "web.jpeg" enden
function isWebImage(filename) {
  const lower = filename.toLowerCase();
  return (
    (lower.endsWith('web.jpg') || lower.endsWith('web.jpeg')) &&
    allowedExtensions.includes(path.extname(lower))
  );
}

function resizeAndCopyWebImage(inputPath, outputPath) {
  // Entferne "web" vor der Dateiendung
  const parsed = path.parse(outputPath);
  const newBase = parsed.name.replace(/web$/, '') + parsed.ext;
  const newOutputPath = path.join(parsed.dir, newBase);

  sharp(inputPath)
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 70 }) // Qualität auf 70% setzen
    .toFile(newOutputPath)
    .then(() => {
      console.log(`Resized & copied: ${newOutputPath}`);
    })
    .catch(err => {
      console.error(`Error resizing ${inputPath}:`, err);
    });
}

function processDir(dir, outputMainDir, baseDir) {
  fs.readdirSync(dir).forEach(file => {
    const inputPath = path.join(dir, file);
    const relPath = path.relative(baseDir, inputPath);
    const outputPath = path.join(outputMainDir, relPath);

    if (fs.statSync(inputPath).isDirectory()) {
      // Prüfe rekursiv, ob im Unterordner passende Bilder liegen
      let hasWebImages = false;
      function checkForWebImages(subdir) {
        return fs.readdirSync(subdir).some(subfile => {
          const subpath = path.join(subdir, subfile);
          if (fs.statSync(subpath).isDirectory()) {
            return checkForWebImages(subpath);
          }
          return isWebImage(subfile);
        });
      }
      hasWebImages = checkForWebImages(inputPath);

      if (hasWebImages) {
        if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });
        processDir(inputPath, outputMainDir, baseDir);
      }
    } else if (isWebImage(file)) {
      const outputFolder = path.dirname(outputPath);
      if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });
      resizeAndCopyWebImage(inputPath, outputPath);
    }
  });
}

// Für jeden Input-Ordner die Struktur beibehalten
inputDirs.forEach(inputDir => {
  const mainFolder = path.basename(inputDir);
  const outputMainDir = path.join(outputDir, mainFolder);
  processDir(inputDir, outputMainDir, inputDir);
});
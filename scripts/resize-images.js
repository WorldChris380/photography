// Dieses skript kann mit node scripts/resize-images.js ausgeführt werden. sharp muss installiert sein (npm install sharp)

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../src/assets/img/photography_original');
const outputDir = path.join(__dirname, '../src/assets/img/photography_resized');
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

function resizeImage(inputPath, outputPath) {
  const extname = path.extname(inputPath).toLowerCase();
  const quality = 60; // Set quality to 60%

  let resizeOperation = sharp(inputPath).resize({ width: 1920, withoutEnlargement: true });

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

function processDir(dir, outDir) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.readdirSync(dir).forEach(file => {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(outDir, file);
    if (fs.statSync(inputPath).isDirectory()) {
      processDir(inputPath, outputPath);
    } else if (allowedExtensions.includes(path.extname(file).toLowerCase())) {
      resizeImage(inputPath, outputPath);
    }
  });
}

processDir(inputDir, outputDir);
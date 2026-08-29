const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png'));

console.log(`Found ${files.length} PNG files to convert...`);

async function convert() {
  for (const file of files) {
    const inputPath = path.join(assetsDir, file);
    const outputPath = path.join(assetsDir, file.replace('.png', '.webp'));
    
    try {
      await sharp(inputPath)
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outputPath);
      
      const origSize = fs.statSync(inputPath).size;
      const newSize = fs.statSync(outputPath).size;
      const reduction = ((1 - newSize/origSize) * 100).toFixed(1);
      
      console.log(`✓ ${file} → ${file.replace('.png', '.webp')} (${reduction}% smaller)`);
    } catch (err) {
      console.error(`✗ Error converting ${file}:`, err.message);
    }
  }
  console.log('\nDone!');
}

convert();

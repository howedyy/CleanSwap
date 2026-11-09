const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateFrames() {
  const inputPath = path.join(process.cwd(), 'public', 'client-logo-transparent.png');
  const outDir = path.join(process.cwd(), 'public', 'eye-sequence');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const baseImg = sharp(inputPath);
  const metadata = await baseImg.metadata();
  const width = metadata.width;
  const height = metadata.height;

  // Frame 3: 100% Original Logo (Fully Open)
  await baseImg.clone().toFile(path.join(outDir, 'logo-frame-3.png'));
  console.log('Saved logo-frame-3.png');

  // Frame 4: Awakened Eye with Specular Starburst & Luminous Pupil Energy
  const awakenedSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="irisBloom" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="25%" stop-color="#38b6ff" stop-opacity="0.95" />
          <stop offset="60%" stop-color="#0a3463" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#0a3463" stop-opacity="0" />
        </radialGradient>
      </defs>
      <!-- Radiant Iris Core -->
      <circle cx="142" cy="61" r="22" fill="url(#irisBloom)" />
      <!-- Starburst Sparkle Glint -->
      <path d="M 142 40 L 142 82 M 121 61 L 163 61" stroke="#ffffff" stroke-width="2.2" opacity="0.95" stroke-linecap="round" />
      <path d="M 127 46 L 157 76 M 157 46 L 127 76" stroke="#38b6ff" stroke-width="1.4" opacity="0.8" stroke-linecap="round" />
      <circle cx="142" cy="61" r="6" fill="#ffffff" />
    </svg>
  `);
  await baseImg.clone().composite([{ input: awakenedSvg, blend: 'over' }]).toFile(path.join(outDir, 'logo-frame-4.png'));
  console.log('Saved logo-frame-4.png');

  // Frame 1: Fully Closed Eye
  // The upper lid meets the lower lid along the seam curve
  const closedSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Mask out internal eye sclera/iris with sleek dark eyelid tone -->
      <path d="M 43 60 Q 135 34 223 60 Q 135 78 43 60 Z" fill="#08182d" opacity="0.94" />
      <path d="M 43 60 Q 135 52 223 60 Q 135 68 43 60 Z" fill="#0c2340" opacity="0.85" />
      <!-- Main Closed Eyelid Navy Seam Line -->
      <path d="M 42 60 Q 135 64 224 60" stroke="#013668" stroke-width="5.5" stroke-linecap="round" fill="none" />
      <!-- Upper crease line shadow -->
      <path d="M 54 53 Q 135 48 212 53" stroke="#002140" stroke-width="2" opacity="0.45" stroke-linecap="round" fill="none" />
    </svg>
  `);
  await baseImg.clone().composite([{ input: closedSvg, blend: 'over' }]).toFile(path.join(outDir, 'logo-frame-1.png'));
  console.log('Saved logo-frame-1.png');

  // Frame 2: Half-Open Eye (45% open)
  // Eyelid is halfway down, showing bottom portion of pupil & sclera
  const halfSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Upper half of eye aperture covered by descending eyelid -->
      <path d="M 43 60 Q 135 34 223 60 Q 135 52 43 60 Z" fill="#08182d" opacity="0.94" />
      <!-- Eyelid edge halfway down -->
      <path d="M 42 60 Q 135 52 224 60" stroke="#013668" stroke-width="5" stroke-linecap="round" fill="none" />
      <!-- Crease shadow -->
      <path d="M 52 47 Q 135 42 214 47" stroke="#002140" stroke-width="1.8" opacity="0.38" stroke-linecap="round" fill="none" />
    </svg>
  `);
  await baseImg.clone().composite([{ input: halfSvg, blend: 'over' }]).toFile(path.join(outDir, 'logo-frame-2.png'));
  console.log('Saved logo-frame-2.png');
}

generateFrames().then(() => {
  console.log('All logo frames successfully generated!');
}).catch(err => {
  console.error('Error generating frames:', err);
  process.exit(1);
});


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
  const baseRaw = await baseImg.raw().toBuffer({ resolveWithObject: true });
  const width = baseRaw.info.width;
  const height = baseRaw.info.height;

  // Helper to strictly enforce the base image's transparent alpha channel
  async function applyBaseAlpha(sharpInstance) {
    const raw = await sharpInstance.raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < raw.data.length; i += 4) {
      // If base image is fully transparent, force output to be 0 alpha
      if (baseRaw.data[i + 3] === 0) {
        raw.data[i + 3] = 0;
      }
    }
    return sharp(raw.data, { raw: { width, height, channels: 4 } }).png();
  }

  // -------------------------------------------------------------
  // Frame 3: 100% Original Brand Logo (Fully Open & Pristine)
  // -------------------------------------------------------------
  await baseImg.clone().png().toFile(path.join(outDir, 'logo-frame-3.png'));
  console.log('Saved logo-frame-3.png (Original Brand Logo)');

  // -------------------------------------------------------------
  // Frame 4: Awakened Eye - Photorealistic Glossy Cornea Specular Reflections & Iris Lucidity
  // -------------------------------------------------------------
  const awakenedSvg = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Luminous Iris Core Bloom -->
        <radialGradient id="irisLuminescence" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
          <stop offset="25%" stop-color="#70d6ff" stop-opacity="0.85" />
          <stop offset="55%" stop-color="#00a6fb" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#051923" stop-opacity="0" />
        </radialGradient>

        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.7" />
        </filter>
      </defs>

      <!-- Soft Iris Core Radiance -->
      <circle cx="142" cy="61" r="20" fill="url(#irisLuminescence)" />

      <!-- Primary Realistic Corneal Specular Reflection (Curved Softbox Light Window) -->
      <ellipse cx="137" cy="55" rx="4.5" ry="3" transform="rotate(-15 137 55)" fill="#ffffff" opacity="0.95" />
      <ellipse cx="137" cy="55" rx="6" ry="4" transform="rotate(-15 137 55)" fill="#ffffff" opacity="0.45" filter="url(#softGlow)" />

      <!-- Secondary Wet Eyeball Catchlight Dots -->
      <circle cx="148" cy="66" r="1.6" fill="#ffffff" opacity="0.9" />
      <circle cx="140" cy="63" r="1.1" fill="#cbf6f9" opacity="0.75" />

      <!-- Fine Starburst Micro-Glint Lines -->
      <path d="M 142 49 L 142 73 M 130 61 L 154 61" stroke="#ffffff" stroke-width="1.1" opacity="0.6" stroke-linecap="round" />
      <path d="M 134 53 L 150 69 M 150 53 L 134 69" stroke="#70d6ff" stroke-width="0.8" opacity="0.45" stroke-linecap="round" />
    </svg>
  `);

  const frame4Composite = baseImg.clone().composite([{ input: awakenedSvg, blend: 'over' }]);
  const frame4Clean = await applyBaseAlpha(frame4Composite);
  await frame4Clean.toFile(path.join(outDir, 'logo-frame-4.png'));
  console.log('Saved logo-frame-4.png (Awakened Eye with Specular Wet Gloss)');

  // -------------------------------------------------------------
  // Precise Internal Eye Aperture Geometry
  // Left corner: (50, 63), Upper peak: (135, 48), Right corner: (206, 67), Lower dip: (135, 73)
  // -------------------------------------------------------------
  const fullEyeAperture = "M 50 63 C 80 47, 160 47, 206 67 C 170 75, 85 75, 50 63 Z";

  // -------------------------------------------------------------
  // Frame 1: Fully Closed Eye with Photorealistic Skin Tone & 3D Anatomical Curvature
  // -------------------------------------------------------------
  const closedSvg = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="closedAperture">
          <path d="${fullEyeAperture}" />
        </clipPath>

        <!-- 3D Spherical Eyeball Curvature Gradient (Lifelike Warm Skin Tone) -->
        <!-- Highlights the 3D ocular globe dome under the closed eyelid -->
        <radialGradient id="eyeballVolume" cx="52%" cy="48%" r="48%" fx="51%" fy="43%">
          <stop offset="0%" stop-color="#fae7d6" />
          <stop offset="22%" stop-color="#f0d3bc" />
          <stop offset="50%" stop-color="#dead87" />
          <stop offset="78%" stop-color="#c68f66" />
          <stop offset="100%" stop-color="#9a613b" />
        </radialGradient>

        <!-- Soft Skin Highlight & Crease Filters -->
        <filter id="skinBlur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.75" />
        </filter>
        <filter id="fineBlur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.35" />
        </filter>
      </defs>

      <g clip-path="url(#closedAperture)">
        <!-- 1. Base 3D Spherical Skin Tone -->
        <rect x="45" y="42" width="165" height="35" fill="url(#eyeballVolume)" />

        <!-- 2. Anatomical Subsurface Warmth Over Cornea Dome -->
        <ellipse cx="140" cy="58" rx="28" ry="11" fill="#e8987b" opacity="0.32" filter="url(#skinBlur)" />

        <!-- 3. Soft Specular Light Catch on Convex Eyelid -->
        <ellipse cx="138" cy="54" rx="20" ry="5.5" fill="#ffffff" opacity="0.28" filter="url(#skinBlur)" />

        <!-- 4. Upper Eyelid Sulcus Crease Fold (Natural Skin Fold) -->
        <path d="M 62 58 C 95 49, 155 49, 196 60" stroke="#633316" stroke-width="2.2" fill="none" opacity="0.55" filter="url(#skinBlur)" />
        <path d="M 68 57 C 98 50, 152 50, 190 59" stroke="#48220d" stroke-width="0.9" fill="none" opacity="0.75" />

        <!-- 5. Eyelid Closure Seam (Where Upper & Lower Lids Seal) -->
        <path d="M 50 63 C 95 67.5, 160 67.5, 206 67" stroke="#1d0d06" stroke-width="2.6" stroke-linecap="round" fill="none" />
        <!-- Soft contact shadow beneath seam on lower lid margin -->
        <path d="M 52 64 C 95 68.5, 160 68.5, 204 68" stroke="#4a210f" stroke-width="1.6" fill="none" opacity="0.55" filter="url(#fineBlur)" />

        <!-- 6. Delicate Realistic Eyelash Fringe (Cilia along the Seam) -->
        <path d="
          M 72 63.5 L 70 65.5
          M 80 64.2 L 78.5 66.8
          M 88 64.8 L 87 67.8
          M 96 65.4 L 95 68.8
          M 104 66.0 L 103 69.8
          M 112 66.5 L 111.5 70.8
          M 120 66.8 L 120 71.5
          M 128 67.1 L 128 72.0
          M 136 67.3 L 136.5 72.2
          M 144 67.3 L 145 72.0
          M 152 67.1 L 153.5 71.5
          M 160 66.8 L 162 70.8
          M 168 66.4 L 170.5 69.8
          M 176 66.0 L 179 68.8
          M 184 65.5 L 187.5 67.8
          M 192 65.0 L 195.5 66.8
        " stroke="#160904" stroke-width="0.85" opacity="0.7" stroke-linecap="round" />
      </g>
    </svg>
  `);

  const frame1Composite = baseImg.clone().composite([{ input: closedSvg, blend: 'over' }]);
  const frame1Clean = await applyBaseAlpha(frame1Composite);
  await frame1Clean.toFile(path.join(outDir, 'logo-frame-1.png'));
  console.log('Saved logo-frame-1.png (Photorealistic Closed Eye with Anatomical Skin Tone)');

  // -------------------------------------------------------------
  // Frame 2: Half-Open Eye (~45% open)
  // Descending eyelid covers upper half down to y ≈ 59, casting a realistic shadow onto the peeking iris & sclera
  // -------------------------------------------------------------
  const halfSvg = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="halfAperture">
          <path d="${fullEyeAperture}" />
        </clipPath>

        <!-- Eyelid 3D Skin Gradient for Descending Lid -->
        <linearGradient id="descendingLidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#9a613b" />
          <stop offset="22%" stop-color="#c68f66" />
          <stop offset="60%" stop-color="#f0d3bc" />
          <stop offset="90%" stop-color="#dead87" />
          <stop offset="100%" stop-color="#703617" />
        </linearGradient>

        <!-- Realistic Soft Cast Shadow dropped by descending lid onto eyeball below -->
        <linearGradient id="lidCastShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0a1828" stop-opacity="0.8" />
          <stop offset="45%" stop-color="#0d253d" stop-opacity="0.55" />
          <stop offset="85%" stop-color="#0d253d" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#0d253d" stop-opacity="0" />
        </linearGradient>

        <filter id="shadowBlur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      <g clip-path="url(#halfAperture)">
        <!-- 1. The Descending Eyelid Cover (Top Half of Eye) -->
        <path d="M 50 63 C 80 47, 160 47, 206 67 C 160 60, 95 60, 50 63 Z" fill="url(#descendingLidGrad)" />

        <!-- 2. Gentle Highlight on Descending Lid Dome -->
        <ellipse cx="140" cy="53" rx="22" ry="4" fill="#ffffff" opacity="0.22" filter="url(#shadowBlur)" />

        <!-- 3. Upper Lid Crease -->
        <path d="M 68 54 C 100 48, 155 48, 190 56" stroke="#52270f" stroke-width="1.1" fill="none" opacity="0.6" />

        <!-- 4. Descending Eyelash Margin (Lower Rim of Descending Lid) -->
        <path d="M 50 63 C 95 60, 160 60, 206 67" stroke="#1d0d06" stroke-width="2.0" stroke-linecap="round" fill="none" />

        <!-- Fine descending lashes -->
        <path d="
          M 78 61.5 L 77 63.8
          M 92 60.8 L 91.5 63.8
          M 106 60.3 L 105.5 64.0
          M 120 60.0 L 120 64.2
          M 134 60.0 L 134.5 64.3
          M 148 60.1 L 149 64.2
          M 162 60.5 L 163.5 64.0
          M 176 61.2 L 178 63.8
        " stroke="#160904" stroke-width="0.8" opacity="0.65" stroke-linecap="round" />

        <!-- 5. Realistic Cast Shadow Dropped Onto Exposed Eyeball (y=60 to y=65) -->
        <path d="M 50 63 C 95 60, 160 60, 206 67 L 206 70 C 160 64.5, 95 64.5, 50 67 Z" fill="url(#lidCastShadow)" filter="url(#shadowBlur)" />
      </g>
    </svg>
  `);

  const frame2Composite = baseImg.clone().composite([{ input: halfSvg, blend: 'over' }]);
  const frame2Clean = await applyBaseAlpha(frame2Composite);
  await frame2Clean.toFile(path.join(outDir, 'logo-frame-2.png'));
  console.log('Saved logo-frame-2.png (Photorealistic Half-Open Eye with Lid Cast Shadow)');
}

generateFrames().then(() => {
  console.log('All logo frames successfully generated with photorealistic rendering!');
}).catch(err => {
  console.error('Error generating frames:', err);
  process.exit(1);
});

const sharp = require('sharp');
const path = require('path');

// Create OG image 1200x630
const width = 1200;
const height = 630;

const svgImage = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fef3c7;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fde68a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#00000033"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bgGrad)"/>
  
  <!-- Gold bars decoration -->
  <rect x="50" y="450" width="120" height="60" rx="8" fill="#d97706" opacity="0.3"/>
  <rect x="70" y="420" width="120" height="60" rx="8" fill="#f59e0b" opacity="0.4"/>
  <rect x="90" y="390" width="120" height="60" rx="8" fill="#fbbf24" opacity="0.5"/>
  
  <rect x="1030" y="450" width="120" height="60" rx="8" fill="#d97706" opacity="0.3"/>
  <rect x="1010" y="420" width="120" height="60" rx="8" fill="#f59e0b" opacity="0.4"/>
  <rect x="990" y="390" width="120" height="60" rx="8" fill="#fbbf24" opacity="0.5"/>
  
  <!-- Main content card -->
  <rect x="100" y="80" width="1000" height="470" rx="24" fill="white" filter="url(#shadow)"/>
  
  <!-- Logo circle with dollar sign -->
  <circle cx="600" cy="180" r="70" fill="url(#goldGrad)" filter="url(#shadow)"/>
  <text x="600" y="205" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle">$</text>
  
  <!-- Gold bag icon decoration -->
  <circle cx="560" cy="145" r="15" fill="#fde68a"/>
  <circle cx="640" cy="145" r="15" fill="#fde68a"/>
  
  <!-- Main title -->
  <text x="600" y="310" font-family="Arial, sans-serif" font-size="52" font-weight="bold" fill="#78350f" text-anchor="middle">GoldChecker</text>
  
  <!-- Subtitle -->
  <text x="600" y="370" font-family="Arial, sans-serif" font-size="28" fill="#92400e" text-anchor="middle">Live Gold Price &amp; Profit Calculator</text>
  
  <!-- UAE Badge -->
  <rect x="480" y="400" width="240" height="50" rx="25" fill="url(#goldGrad)"/>
  <text x="600" y="433" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle">🇦🇪 UAE</text>
  
  <!-- Features text -->
  <text x="600" y="500" font-family="Arial, sans-serif" font-size="18" fill="#78350f" text-anchor="middle">24K • 22K • 21K • 18K • Live Rates • Fair Deal Check</text>
  
  <!-- Website URL -->
  <text x="600" y="590" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#d97706" text-anchor="middle">www.goldchecker.ae</text>
</svg>
`;

async function generateOGImage() {
  try {
    await sharp(Buffer.from(svgImage))
      .png()
      .toFile(path.join(__dirname, '../public/og-image.png'));
    console.log('OG image generated successfully!');
    
    // Also create a Twitter card image (same as OG for consistency)
    await sharp(Buffer.from(svgImage))
      .png()
      .toFile(path.join(__dirname, '../public/twitter-image.png'));
    console.log('Twitter image generated successfully!');
    
  } catch (error) {
    console.error('Error generating image:', error);
  }
}

generateOGImage();

// Mini App Splash Screen API - 1200x630
export default async function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#2d2d2d;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#f7931a;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#f7931a;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  
  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="8" fill="#f7931a"/>
  
  <!-- Main Bitcoin symbol with glow -->
  <circle cx="300" cy="315" r="120" fill="#f7931a" opacity="0.2"/>
  <circle cx="300" cy="315" r="80" fill="#f7931a"/>
  <text x="300" y="340" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
        fill="white" text-anchor="middle">₿</text>
  
  <!-- Lightning bolt -->
  <text x="300" y="200" font-family="Arial, sans-serif" font-size="80" 
        fill="#f7931a" text-anchor="middle">⚡</text>
  
  <!-- Main title -->
  <text x="700" y="200" font-family="Arial, sans-serif" font-size="72" font-weight="bold" 
        fill="white" text-anchor="middle">Bitcoin TX</text>
  <text x="700" y="280" font-family="Arial, sans-serif" font-size="72" font-weight="bold" 
        fill="#f7931a" text-anchor="middle">Battle Royale</text>
  
  <!-- Subtitle -->
  <text x="700" y="340" font-family="Arial, sans-serif" font-size="32" 
        fill="#cccccc" text-anchor="middle">Predict • Compete • Win</text>
  
  <!-- $Seconds branding -->
  <text x="700" y="420" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
        fill="#f7931a" text-anchor="middle">Powered by $Seconds</text>
  
  <!-- Loading indicator dots -->
  <circle cx="650" cy="500" r="8" fill="#f7931a">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="680" cy="500" r="8" fill="#f7931a">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="710" cy="500" r="8" fill="#f7931a">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="1s" repeatCount="indefinite"/>
  </circle>
  <circle cx="740" cy="500" r="8" fill="#f7931a">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="1.5s" repeatCount="indefinite"/>
  </circle>
  
  <!-- Bottom accent -->
  <rect x="0" y="622" width="1200" height="8" fill="#f7931a"/>
  
  <!-- Decorative elements -->
  <circle cx="1000" cy="150" r="60" fill="#f7931a" opacity="0.1"/>
  <circle cx="1050" cy="200" r="40" fill="#f7931a" opacity="0.2"/>
  <circle cx="980" cy="250" r="25" fill="#f7931a" opacity="0.3"/>
</svg>`;
    
    return res.status(200).send(svg.trim());
    
  } catch (error) {
    console.error('Splash generation error:', error);
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.status(200).send(`
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#1a1a1a"/>
        <text x="600" y="315" font-family="Arial" font-size="64" fill="#f7931a" text-anchor="middle">Bitcoin TX Battle</text>
      </svg>
    `);
  }
}

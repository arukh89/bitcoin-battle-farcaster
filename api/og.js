// Fixed OG Image API for Bitcoin Battle
export default async function handler(req, res) {
  try {
    // Set proper headers first
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Get current block info for dynamic content
    let blockInfo = '';
    let roundNumber = '';
    
    try {
      const response = await fetch('https://mempool.space/api/blocks/tip/height');
      const blockHeight = await response.json();
      const nextBlock = blockHeight + 1;
      roundNumber = Math.floor((nextBlock - 900000) / 10) + 100;
      blockInfo = `Block #${nextBlock} • Round #${roundNumber}`;
    } catch (error) {
      blockInfo = 'Next Bitcoin Block';
      console.log('Failed to fetch block data for OG image');
    }
    
    // Create SVG with exact 1200x630 dimensions
    const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#2d2d2d;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" style="stop-color:#f7931a;stop-opacity:0.2" />
      <stop offset="100%" style="stop-color:#f7931a;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  
  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="8" fill="#f7931a"/>
  <rect x="0" y="622" width="1200" height="8" fill="#f7931a"/>
  
  <!-- Main Bitcoin symbol -->
  <circle cx="200" cy="315" r="100" fill="#f7931a" opacity="0.2"/>
  <circle cx="200" cy="315" r="70" fill="#f7931a"/>
  <text x="200" y="335" font-family="Arial, sans-serif" font-size="70" font-weight="bold" 
        fill="white" text-anchor="middle">₿</text>
  
  <!-- Lightning bolt -->
  <text x="200" y="200" font-family="Arial, sans-serif" font-size="60" 
        fill="#f7931a" text-anchor="middle">⚡</text>
  
  <!-- Main title -->
  <text x="650" y="180" font-family="Arial, sans-serif" font-size="64" font-weight="bold" 
        fill="#f7931a" text-anchor="middle">Bitcoin TX Battle</text>
  
  <!-- Subtitle -->
  <text x="650" y="240" font-family="Arial, sans-serif" font-size="36" 
        fill="white" text-anchor="middle">Predict • Compete • Win</text>
  
  <!-- Block info -->
  <text x="650" y="290" font-family="Arial, sans-serif" font-size="28" 
        fill="#cccccc" text-anchor="middle">${blockInfo}</text>
  
  <!-- Prize info -->
  <rect x="480" y="320" width="340" height="80" rx="40" fill="rgba(247, 147, 26, 0.1)" stroke="#f7931a" stroke-width="2"/>
  <text x="650" y="350" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        fill="#f7931a" text-anchor="middle">🏆 Prize Pool</text>
  <text x="650" y="380" font-family="Arial, sans-serif" font-size="20" 
        fill="white" text-anchor="middle">500 + 250 $SECONDS</text>
  
  <!-- CTA -->
  <rect x="500" y="430" width="300" height="60" rx="30" fill="#f7931a"/>
  <text x="650" y="470" font-family="Arial, sans-serif" font-size="28" font-weight="bold" 
        fill="white" text-anchor="middle">🎮 Play Now</text>
  
  <!-- Footer -->
  <text x="650" y="540" font-family="Arial, sans-serif" font-size="20" 
        fill="#888888" text-anchor="middle">Powered by $Seconds • Built for Farcaster</text>
  
  <!-- Decorative elements -->
  <circle cx="1000" cy="150" r="50" fill="#f7931a" opacity="0.1"/>
  <circle cx="1050" cy="200" r="30" fill="#f7931a" opacity="0.2"/>
  <circle cx="950" cy="250" r="20" fill="#f7931a" opacity="0.3"/>
</svg>`;
    
    return res.status(200).send(svg);
    
  } catch (error) {
    console.error('OG image error:', error);
    
    // Ultra-simple fallback that definitely works
    const fallback = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#1a1a1a"/>
      <rect x="0" y="0" width="1200" height="8" fill="#f7931a"/>
      <rect x="0" y="622" width="1200" height="8" fill="#f7931a"/>
      <text x="600" y="280" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#f7931a" text-anchor="middle">Bitcoin TX Battle</text>
      <text x="600" y="350" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle">Predict • Compete • Win</text>
    </svg>`;
    
    return res.status(200).send(fallback);
  }
}

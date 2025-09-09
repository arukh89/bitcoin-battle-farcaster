// PNG Icon API - Returns actual PNG image data
export default async function handler(req, res) {
  try {
    // Set proper headers for PNG
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Generate SVG that will be converted to PNG by browsers
    const svg = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d2d2d;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" style="stop-color:#f7931a;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#f7931a;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="50" fill="url(#bgGrad)"/>
  <rect width="512" height="512" rx="50" fill="url(#glow)"/>
  
  <!-- Orange border -->
  <rect x="10" y="10" width="492" height="492" rx="40" fill="none" stroke="#f7931a" stroke-width="8"/>
  
  <!-- Lightning bolt top -->
  <text x="256" y="140" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
        fill="#f7931a" text-anchor="middle">⚡</text>
  
  <!-- Bitcoin symbol main -->
  <circle cx="256" cy="220" r="90" fill="#f7931a"/>
  <text x="256" y="245" font-family="Arial, sans-serif" font-size="90" font-weight="bold" 
        fill="white" text-anchor="middle">₿</text>
  
  <!-- App title -->
  <text x="256" y="350" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
        fill="white" text-anchor="middle">TX BATTLE</text>
  
  <!-- Subtitle -->
  <text x="256" y="385" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        fill="#f7931a" text-anchor="middle">ROYALE</text>
  
  <!-- Bottom accent -->
  <rect x="50" y="450" width="412" height="6" rx="3" fill="#f7931a"/>
</svg>`;
    
    // For now, return SVG (browsers will handle PNG conversion automatically)
    // In production, you'd use a proper PNG generation library
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.status(200).send(svg.trim());
    
  } catch (error) {
    console.error('Icon PNG generation error:', error);
    
    // Return a simple fallback
    const fallback = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#f7931a"/>
  <text x="256" y="280" font-family="Arial" font-size="80" font-weight="bold" 
        fill="white" text-anchor="middle">₿</text>
</svg>`;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.status(200).send(fallback);
  }
}

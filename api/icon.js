// Mini App Icon API - 512x512 PNG
export default async function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const svg = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="512" rx="50" fill="#1a1a1a"/>
  
  <!-- Orange border -->
  <rect x="10" y="10" width="492" height="492" rx="40" fill="none" stroke="#f7931a" stroke-width="8"/>
  
  <!-- Bitcoin symbol -->
  <circle cx="256" cy="180" r="80" fill="#f7931a"/>
  <text x="256" y="200" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
        fill="white" text-anchor="middle">₿</text>
  
  <!-- Lightning bolt -->
  <text x="256" y="120" font-family="Arial, sans-serif" font-size="60" 
        fill="#f7931a" text-anchor="middle">⚡</text>
  
  <!-- App name -->
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
        fill="white" text-anchor="middle">TX BATTLE</text>
  
  <!-- Subtitle -->
  <text x="256" y="360" font-family="Arial, sans-serif" font-size="24" 
        fill="#f7931a" text-anchor="middle">ROYALE</text>
  
  <!-- Bottom accent -->
  <rect x="50" y="420" width="412" height="4" rx="2" fill="#f7931a"/>
</svg>`;
    
    return res.status(200).send(svg.trim());
    
  } catch (error) {
    console.error('Icon generation error:', error);
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.status(200).send(`
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="#f7931a"/>
        <text x="256" y="256" font-family="Arial" font-size="48" fill="white" text-anchor="middle">₿</text>
      </svg>
    `);
  }
}

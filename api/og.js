// Simple OG Image API for Bitcoin Battle
export default async function handler(req, res) {
  try {
    // Set proper headers
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Simple SVG image
    const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="#1a1a1a"/>
  
  <!-- Bitcoin orange accent -->
  <rect x="0" y="0" width="1200" height="10" fill="#f7931a"/>
  <rect x="0" y="620" width="1200" height="10" fill="#f7931a"/>
  
  <!-- Main title -->
  <text x="600" y="200" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
        fill="#f7931a" text-anchor="middle">⚡ Bitcoin TX Battle</text>
  
  <!-- Subtitle -->
  <text x="600" y="280" font-family="Arial, sans-serif" font-size="40" 
        fill="white" text-anchor="middle">Predict • Compete • Win</text>
  
  <!-- Description -->
  <text x="600" y="350" font-family="Arial, sans-serif" font-size="32" 
        fill="#cccccc" text-anchor="middle">Guess transactions in the next Bitcoin block</text>
  
  <!-- CTA -->
  <rect x="450" y="400" width="300" height="80" rx="40" fill="#f7931a"/>
  <text x="600" y="450" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
        fill="white" text-anchor="middle">🎮 Play Now</text>
  
  <!-- Footer -->
  <text x="600" y="550" font-family="Arial, sans-serif" font-size="24" 
        fill="#888888" text-anchor="middle">Powered by $Seconds • Built for Farcaster</text>
  
  <!-- Decorative Bitcoin symbol -->
  <circle cx="100" cy="100" r="60" fill="#f7931a" opacity="0.2"/>
  <text x="100" y="120" font-family="Arial, sans-serif" font-size="60" 
        fill="#f7931a" text-anchor="middle" opacity="0.5">₿</text>
</svg>`;
    
    return res.status(200).send(svg.trim());
    
  } catch (error) {
    console.error('OG image error:', error);
    
    // Ultra-simple fallback
    const fallback = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#1a1a1a"/>
      <text x="600" y="315" font-family="Arial" font-size="48" fill="#f7931a" text-anchor="middle">Bitcoin TX Battle</text>
    </svg>`;
    
    return res.status(200).send(fallback);
  }
}

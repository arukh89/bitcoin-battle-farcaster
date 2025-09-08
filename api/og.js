// Generate Open Graph image for Bitcoin Battle
export default async function handler(req, res) {
  try {
    // Set headers for image response
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    // Generate SVG image
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2d2d2d;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="1200" height="630" fill="url(#bgGradient)"/>
        
        <!-- Bitcoin symbol background -->
        <circle cx="1050" cy="150" r="80" fill="#f7931a" opacity="0.1"/>
        <text x="1050" y="170" font-family="Arial, sans-serif" font-size="80" fill="#f7931a" text-anchor="middle" opacity="0.3">₿</text>
        
        <!-- Main content -->
        <text x="60" y="150" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#f7931a">⚡ Bitcoin TX Battle</text>
        <text x="60" y="220" font-family="Arial, sans-serif" font-size="48" fill="white">Predict • Compete • Win</text>
        
        <!-- Description -->
        <text x="60" y="300" font-family="Arial, sans-serif" font-size="32" fill="#cccccc">Guess the number of transactions</text>
        <text x="60" y="340" font-family="Arial, sans-serif" font-size="32" fill="#cccccc">in the next Bitcoin block</text>
        
        <!-- CTA -->
        <rect x="60" y="400" width="300" height="80" rx="40" fill="#f7931a"/>
        <text x="210" y="450" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">🎮 Play Now</text>
        
        <!-- Powered by -->
        <text x="60" y="550" font-family="Arial, sans-serif" font-size="24" fill="#888888">Powered by $Seconds • Built for Farcaster</text>
        
        <!-- Decorative elements -->
        <circle cx="900" cy="500" r="40" fill="#f7931a" opacity="0.2"/>
        <circle cx="950" cy="480" r="25" fill="#f7931a" opacity="0.3"/>
        <circle cx="980" cy="520" r="15" fill="#f7931a" opacity="0.4"/>
      </svg>
    `;
    
    // Convert SVG to PNG (simplified - in production, use a proper image generation library)
    // For now, we'll return the SVG as PNG content-type
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.status(200).send(svg);
    
  } catch (error) {
    console.error('OG image generation error:', error);
    
    // Fallback: return a simple colored rectangle
    const fallbackSvg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#1a1a1a"/>
        <text x="600" y="315" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="#f7931a" text-anchor="middle">Bitcoin TX Battle</text>
      </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.status(200).send(fallbackSvg);
  }
}

// Share Bitcoin Battle to Farcaster API
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get current Bitcoin block height
    const response = await fetch('https://mempool.space/api/blocks/tip/height');
    const blockHeight = await response.json();
    const nextBlock = blockHeight + 1;
    
    // Generate round number (you can make this more sophisticated)
    const roundNumber = Math.floor(Math.random() * 300) + 150; // Random between 150-450

    const shareText = `⛏️ BITCOIN BLOCKS ROUND #${roundNumber} — POWERED BY $SECONDS ⏱️

🎯 Objective:
Predict the number of transactions in Bitcoin Block #${nextBlock}. Comment your guess below and the closest answer wins.

Prize pool 🏆
🥇 1st place: 500 $SECONDS 
🥈 2nd place: 250 $SECONDS

Play now: https://bitcoin-battle-farcaster-zeta.vercel.app/`;

    // Create Farcaster share URL
    const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`;

    // Return HTML with auto-redirect or manual link
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Share Bitcoin Battle to Farcaster</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: Arial, sans-serif;
              background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
              color: white;
              text-align: center;
              padding: 40px 20px;
              min-height: 100vh;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: rgba(247, 147, 26, 0.1);
              padding: 30px;
              border-radius: 15px;
              border: 1px solid rgba(247, 147, 26, 0.3);
            }
            .share-button {
              background: #8B5CF6;
              color: white;
              padding: 15px 30px;
              border: none;
              border-radius: 10px;
              font-size: 18px;
              font-weight: bold;
              text-decoration: none;
              display: inline-block;
              margin: 20px 10px;
              cursor: pointer;
              transition: background 0.3s;
            }
            .share-button:hover {
              background: #7C3AED;
            }
            .preview {
              background: rgba(0,0,0,0.3);
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
              text-align: left;
              white-space: pre-line;
              font-family: monospace;
              border-left: 4px solid #f7931a;
            }
            .bitcoin-symbol {
              font-size: 3em;
              color: #f7931a;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="bitcoin-symbol">₿</div>
            <h1>Share Bitcoin Battle Round #${roundNumber}</h1>
            <p>Ready to challenge your Farcaster network?</p>
            
            <div class="preview">
              <strong>Preview:</strong>
              ${shareText}
            </div>

            <a href="${farcasterUrl}" class="share-button" target="_blank">
              🚀 Share to Warpcast
            </a>
            
            <br>
            
            <a href="https://bitcoin-battle-farcaster-zeta.vercel.app/" class="share-button" style="background: #f7931a;">
              🎮 Play Now
            </a>

            <p style="margin-top: 30px; font-size: 0.9em; opacity: 0.8;">
              Block #${nextBlock} • Round #${roundNumber} • Powered by $SECONDS
            </p>
          </div>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);

  } catch (error) {
    console.error('Share API error:', error);
    return res.status(500).json({ error: 'Failed to generate share content' });
  }
}

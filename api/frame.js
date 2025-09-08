// Main Farcaster Frame API handler
export default async function handler(req, res) {
  // Handle GET requests (when someone visits the URL directly)
  if (req.method === 'GET') {
    return handleDefault(req, res);
  }

  // Handle POST requests (Farcaster frame interactions)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { untrustedData } = req.body;
    const fid = untrustedData?.fid;
    const buttonIndex = untrustedData?.buttonIndex;

    console.log('Frame interaction:', { fid, buttonIndex });

    switch (buttonIndex) {
      case 1: // Join Battle
        return handleJoinBattle(req, res, fid);
      case 2: // View Stats
        return handleViewStats(req, res, fid);
      default:
        return handleDefault(req, res);
    }
  } catch (error) {
    console.error('Frame API error:', error);
    return handleError(res, 'Something went wrong. Please try again.');
  }
}

async function handleJoinBattle(req, res, fid) {
  try {
    // Get current Bitcoin data
    const response = await fetch('https://mempool.space/api/blocks/tip/height');
    const blockHeight = await response.json();
    const nextBlock = blockHeight + 1;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:title" content="Bitcoin Battle - Block #${nextBlock}" />
          <meta property="fc:frame:description" content="Make your prediction for block #${nextBlock}" />
          <meta property="fc:frame:image" content="https://bitcoin-battle-farcaster-zeta.vercel.app/battle-frame.png" />
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
          <meta property="fc:frame:button:1" content="Submit Guess" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:input:text" content="Enter TX prediction..." />
          <meta property="fc:frame:post_url" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/frame/guess" />
        </head>
        <body>
          <h1>Bitcoin TX Battle - Block #${nextBlock}</h1>
          <p>Battle active! Make your prediction.</p>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (error) {
    return handleError(res, 'Failed to join battle');
  }
}

async function handleViewStats(req, res, fid) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:title" content="Bitcoin Battle Stats" />
        <meta property="fc:frame:description" content="Your battle statistics" />
        <meta property="fc:frame:image" content="https://bitcoin-battle-farcaster-zeta.vercel.app/stats-frame.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="🎮 New Battle" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:post_url" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/frame" />
      </head>
      <body>
        <h1>Your Battle Stats</h1>
        <p>FID: ${fid || 'Not provided'}</p>
      </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}

async function handleDefault(req, res) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:title" content="$Seconds Bitcoin TX Battle Royale" />
        <meta property="fc:frame:description" content="Predict Bitcoin transactions and win $Seconds tokens!" />
        <meta property="fc:frame:image" content="https://bitcoin-battle-farcaster-zeta.vercel.app/bitcoin-battle-frame.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="🎮 Join Battle" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:2" content="📊 View Stats" />
        <meta property="fc:frame:button:2:action" content="post" />
        <meta property="fc:frame:post_url" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/frame" />
      </head>
      <body>
        <h1>$Seconds Bitcoin TX Battle Royale</h1>
        <p>Welcome to the ultimate Bitcoin prediction game!</p>
        <div style="margin: 20px 0; padding: 20px; background: rgba(247, 147, 26, 0.1); border-radius: 10px;">
          <p><strong>🎮 How to play:</strong></p>
          <p>1. This is a Farcaster Frame - use it in a Farcaster client</p>
          <p>2. Click "Join Battle" to make your Bitcoin TX prediction</p>
          <p>3. Win $Seconds tokens for accurate predictions!</p>
        </div>
      </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}

async function handleError(res, message) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:title" content="Bitcoin Battle - Error" />
        <meta property="fc:frame:description" content="${message}" />
        <meta property="fc:frame:image" content="https://bitcoin-battle-farcaster-zeta.vercel.app/error-frame.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="🔄 Try Again" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:post_url" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/frame" />
      </head>
      <body>
        <h1>Error</h1>
        <p>${message}</p>
      </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}

// Handle Bitcoin TX prediction submissions
export default async function handler(req, res) {
  // Handle GET requests (when someone visits the URL directly)
  if (req.method === 'GET') {
    return res.redirect('/api/frame');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { untrustedData } = req.body;
    const fid = untrustedData?.fid;
    const inputText = untrustedData?.inputText;
    const buttonIndex = untrustedData?.buttonIndex;

    console.log('Guess submission:', { fid, inputText, buttonIndex });

    // Handle button clicks from guess submitted screen
    if (!inputText && buttonIndex) {
      switch (buttonIndex) {
        case 1: // New Battle
          return res.redirect('/api/frame');
        case 2: // View Stats
          return handleViewStats(res, fid);
        case 3: // Share Battle
          return handleShareBattle(res, fid);
        default:
          return res.redirect('/api/frame');
      }
    }

    // Validate the prediction input
    const prediction = parseInt(inputText?.trim());
    
    if (!prediction || prediction < 1 || prediction > 10000) {
      return handleInvalidGuess(res, inputText);
    }

    // Get current Bitcoin block data
    const response = await fetch('https://mempool.space/api/blocks/tip/height');
    const blockHeight = await response.json();
    const nextBlock = blockHeight + 1;

    // Store the guess (in a real app, you'd save to database)
    // For now, we'll just simulate the submission
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:title" content="Guess Submitted! - Block #${nextBlock}" />
          <meta property="fc:frame:description" content="Your prediction: ${prediction} transactions for block #${nextBlock}" />
          <meta property="fc:frame:image" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/og" />
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
          <meta property="fc:frame:button:1" content="🎮 New Battle" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:button:2" content="📊 View Stats" />
          <meta property="fc:frame:button:2:action" content="post" />
          <meta property="fc:frame:button:3" content="📢 Share Battle" />
          <meta property="fc:frame:button:3:action" content="post" />
          <meta property="fc:frame:post_url" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/frame/guess" />
        </head>
        <body>
          <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; font-family: Arial, sans-serif; min-height: 100vh;">
            <h1 style="color: #f7931a; font-size: 2.5em;">🎯 Guess Submitted!</h1>
            <div style="background: rgba(247, 147, 26, 0.1); padding: 30px; border-radius: 15px; margin: 20px 0; border: 1px solid rgba(247, 147, 26, 0.3);">
              <h2>Block #${nextBlock} Prediction</h2>
              <p style="font-size: 1.5em; color: #f7931a;"><strong>${prediction}</strong> transactions</p>
              <p>FID: ${fid || 'Anonymous'}</p>
            </div>
            <p>Good luck! 🍀 Results will be available when the block is mined.</p>
            <div style="margin-top: 30px;">
              <p style="font-size: 0.9em; opacity: 0.8;">💡 Tip: Bitcoin blocks typically contain 2000-4000 transactions</p>
              <p style="font-size: 0.9em; color: #f7931a;">📢 Share this battle with friends to grow the community!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);

  } catch (error) {
    console.error('Guess submission error:', error);
    return handleError(res, 'Failed to submit guess. Please try again.');
  }
}

async function handleViewStats(res, fid) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:title" content="Bitcoin Battle Stats" />
        <meta property="fc:frame:description" content="Your battle statistics" />
        <meta property="fc:frame:image" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/og" />
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

async function handleShareBattle(res, fid) {
  try {
    // Get current Bitcoin data
    const response = await fetch('https://mempool.space/api/blocks/tip/height');
    const blockHeight = await response.json();
    const nextBlock = blockHeight + 1;
    const roundNumber = Math.floor(Math.random() * 300) + 150;

    const shareText = `⛏️ BITCOIN BLOCKS ROUND #${roundNumber} — POWERED BY $SECONDS ⏱️

🎯 Objective:
Predict the number of transactions in Bitcoin Block #${nextBlock}. Comment your guess below and the closest answer wins.

Prize pool 🏆
🥇 1st place: 500 $SECONDS 
🥈 2nd place: 250 $SECONDS

Play: https://bitcoin-battle-farcaster-zeta.vercel.app/`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:title" content="Share Bitcoin Battle Round #${roundNumber}" />
          <meta property="fc:frame:description" content="Challenge your network! Block #${nextBlock} prediction battle" />
          <meta property="fc:frame:image" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/og" />
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
          <meta property="fc:frame:button:1" content="🚀 Share Now" />
          <meta property="fc:frame:button:1:action" content="link" />
          <meta property="fc:frame:button:1:target" content="https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}" />
          <meta property="fc:frame:button:2" content="🎮 New Battle" />
          <meta property="fc:frame:button:2:action" content="post" />
          <meta property="fc:frame:post_url" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/frame" />
        </head>
        <body>
          <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; font-family: Arial, sans-serif; min-height: 100vh;">
            <h1 style="color: #f7931a; font-size: 2.5em;">📢 Share Round #${roundNumber}</h1>
            <div style="background: rgba(247, 147, 26, 0.1); padding: 30px; border-radius: 15px; margin: 20px 0; border: 1px solid rgba(247, 147, 26, 0.3);">
              <h2>Block #${nextBlock} Challenge</h2>
              <p style="font-size: 1.2em;">💰 Total Prize: 750 $SECONDS</p>
              <p>Share with friends and grow the community! 🚀</p>
            </div>
          </div>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (error) {
    return handleError(res, 'Failed to create share content');
  }
}

async function handleInvalidGuess(res, inputText) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:title" content="Invalid Prediction" />
        <meta property="fc:frame:description" content="Please enter a valid number between 1-10000" />
        <meta property="fc:frame:image" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/og" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="🔄 Try Again" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:post_url" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/frame" />
      </head>
      <body>
        <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; font-family: Arial, sans-serif; min-height: 100vh;">
          <h1 style="color: #ff6b35;">❌ Invalid Prediction</h1>
          <div style="background: rgba(255, 107, 53, 0.1); padding: 30px; border-radius: 15px; margin: 20px 0; border: 1px solid rgba(255, 107, 53, 0.3);">
            <p>You entered: <strong>${inputText || 'Nothing'}</strong></p>
            <p>Please enter a valid number between <strong>1</strong> and <strong>10,000</strong></p>
          </div>
          <p>💡 Tip: Most Bitcoin blocks have 2000-4000 transactions</p>
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
        <meta property="fc:frame:image" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/og" />
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

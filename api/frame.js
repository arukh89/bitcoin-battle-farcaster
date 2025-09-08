// Fixed and Enhanced Frame API Handler
export default async function handler(req, res) {
  // Handle CORS for Mini App
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET requests
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
      case 3: // Share Battle
        return handleShareBattle(req, res, fid);
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
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          
          <!-- Farcaster Frame Meta Tags -->
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:title" content="Bitcoin Battle - Block #${nextBlock}" />
          <meta property="fc:frame:description" content="Make your prediction for block #${nextBlock}" />
          <meta property="fc:frame:image" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/og" />
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
          <meta property="fc:frame:button:1" content="Submit Guess" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:input:text" content="Enter TX prediction (1-10000)..." />
          <meta property="fc:frame:post_url" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/frame/guess" />
          
          <!-- Mini App Support -->
          <meta property="fc:miniapp" content='{"name":"Bitcoin TX Battle","icon":"https://bitcoin-battle-farcaster-zeta.vercel.app/api/icon","splash":"https://bitcoin-battle-farcaster-zeta.vercel.app/api/splash","url":"https://bitcoin-battle-farcaster-zeta.vercel.app/"}' />
          
          <title>Bitcoin TX Battle - Block #${nextBlock}</title>
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
            .bitcoin-symbol {
              font-size: 3em;
              color: #f7931a;
              margin-bottom: 20px;
            }
            .block-info {
              background: rgba(0,0,0,0.3);
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
              border-left: 4px solid #f7931a;
            }
            .tips {
              background: rgba(255, 255, 255, 0.05);
              padding: 15px;
              border-radius: 8px;
              margin-top: 20px;
              font-size: 0.9em;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="bitcoin-symbol">⚡₿</div>
            <h1>Bitcoin TX Battle - Block #${nextBlock}</h1>
            <p>Battle is active! Make your prediction.</p>
            
            <div class="block-info">
              <h3>📊 Prediction Challenge</h3>
              <p><strong>Target Block:</strong> #${nextBlock}</p>
              <p><strong>Your FID:</strong> ${fid || 'Anonymous'}</p>
              <p><strong>Prize Pool:</strong> 750 $SECONDS total</p>
            </div>
            
            <div class="tips">
              <p><strong>💡 Pro Tips:</strong></p>
              <p>• Most Bitcoin blocks contain 2,000-4,000 transactions</p>
              <p>• High activity periods can reach 5,000+ transactions</p>
              <p>• Low activity periods might have 1,500-2,500 transactions</p>
            </div>
            
            <p><strong>Enter your prediction in the input field above and hit "Submit Guess"!</strong></p>
          </div>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (error) {
    console.error('Join battle error:', error);
    return handleError(res, 'Failed to join battle');
  }
}

async function handleViewStats(req, res, fid) {
  try {
    // In a real app, fetch user stats from database
    const mockStats = {
      totalBattles: Math.floor(Math.random() * 20) + 1,
      wins: Math.floor(Math.random() * 5),
      tokensWon: Math.floor(Math.random() * 1000) + 50,
      bestRank: Math.floor(Math.random() * 100) + 1
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:title" content="Bitcoin Battle Stats" />
          <meta property="fc:frame:description" content="Your battle statistics and achievements" />
          <meta property="fc:frame:image" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/og" />
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
          <meta property="fc:frame:button:1" content="🎮 New Battle" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:button:2" content="📢 Share Stats" />
          <meta property="fc:frame:button:2:action" content="post" />
          <meta property="fc:frame:post_url" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/frame" />
          
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
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin: 20px 0;
            }
            .stat-card {
              background: rgba(247, 147, 26, 0.1);
              padding: 20px;
              border-radius: 10px;
              border: 1px solid rgba(247, 147, 26, 0.3);
            }
            .stat-value {
              font-size: 2em;
              font-weight: bold;
              color: #f7931a;
            }
            .stat-label {
              font-size: 0.9em;
              color: #cccccc;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          <div style="max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f7931a;">📊 Your Battle Stats</h1>
            <p>FID: ${fid || 'Anonymous Player'}</p>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${mockStats.totalBattles}</div>
                <div class="stat-label">Total Battles</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${mockStats.wins}</div>
                <div class="stat-label">Wins</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${mockStats.tokensWon}</div>
                <div class="stat-label">$SECONDS Won</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">#${mockStats.bestRank}</div>
                <div class="stat-label">Best Rank</div>
              </div>
            </div>
            
            <p style="margin-top: 30px; color: #cccccc; font-size: 0.9em;">
              Keep playing to improve your stats and earn more $SECONDS tokens! 🚀
            </p>
          </div>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (error) {
    return handleError(res, 'Failed to load stats');
  }
}

async function handleShareBattle(req, res, fid) {
  try {
    // Get current Bitcoin data
    const response = await fetch('https://mempool.space/api/blocks/tip/height');
    const blockHeight = await response.json();
    const nextBlock = blockHeight + 1;
    const roundNumber = Math.floor((nextBlock - 900000) / 10) + 100;

    const shareText = `⛏️ BITCOIN BLOCKS ROUND #${roundNumber} — POWERED BY $SECONDS ⏱️

🎯 Objective:
Predict the number of transactions in Bitcoin Block #${nextBlock}. Comment your guess below and the closest answer wins.

Prize pool 🏆
🥇 1st place: 500 $SECONDS 
🥈 2nd place: 250 $SECONDS

🎮 Play: https://bitcoin-battle-farcaster-zeta.vercel.app/`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:title" content="Share Bitcoin Battle Round #${roundNumber}" />
          <meta property="fc:frame:description" content="Challenge your network! Block #${nextBlock} prediction battle" />
          <meta property="fc:frame:image" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/og" />
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
          <meta property="fc:frame:button:1" content="🚀 Share on Warpcast" />
          <meta property="fc:frame:button:1:action" content="link" />
          <meta property="fc:frame:button:1:target" content="https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}" />
          <meta property="fc:frame:button:2" content="🎮 New Battle" />
          <meta property="fc:frame:button:2:action" content="post" />
          <meta property="fc:frame:post_url" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/frame" />
          
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
            .share-preview {
              background: rgba(255, 255, 255, 0.05);
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
              text-align: left;
              font-family: monospace;
              font-size: 0.85em;
              border-left: 4px solid #f7931a;
              white-space: pre-line;
            }
          </style>
        </head>
        <body>
          <div style="max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f7931a;">📢 Share Round #${roundNumber}</h1>
            <p>Block #${nextBlock} Challenge • Total Prize: 750 $SECONDS</p>
            
            <div class="share-preview">${shareText}</div>
            
            <p>Share with friends and grow the Bitcoin TX Battle community! 🚀</p>
            <p style="font-size: 0.9em; color: #cccccc;">FID: ${fid || 'Anonymous'}</p>
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

async function handleDefault(req, res) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <!-- Farcaster Frame Meta Tags -->
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:title" content="$Seconds Bitcoin TX Battle Royale" />
        <meta property="fc:frame:description" content="Predict Bitcoin transactions and win $Seconds tokens!" />
        <meta property="fc:frame:image" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/og" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="🎮 Join Battle" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:2" content="📊 View Stats" />
        <meta property="fc:frame:button:2:action" content="post" />
        <meta property="fc:frame:button:3" content="📢 Share" />
        <meta property="fc:frame:button:3:action" content="post" />
        <meta property="fc:frame:post_url" content="https://bitcoin-battle-farcaster-zeta.vercel.app/api/frame" />
        
        <!-- Mini App Manifest -->
        <meta property="fc:miniapp" content='{"name":"Bitcoin TX Battle Royale","icon":"https://bitcoin-battle-farcaster-zeta.vercel.app/api/icon","splash":"https://bitcoin-battle-farcaster-zeta.vercel.app/api/splash","url":"https://bitcoin-battle-farcaster-zeta.vercel.app/"}' />
        
        <title>$Seconds Bitcoin TX Battle Royale</title>
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
          .hero {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(247, 147, 26, 0.1);
            padding: 40px;
            border-radius: 20px;
            border: 1px solid rgba(247, 147, 26, 0.3);
          }
          .logo {
            font-size: 4em;
            color: #f7931a;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="hero">
          <div class="logo">⚡₿</div>
          <h1 style="color: #f7931a; font-size: 2.5em; margin-bottom: 20px;">
            Bitcoin TX Battle Royale
          </h1>
          <p style="font-size: 1.3em; margin-bottom: 30px;">
            Predict • Compete • Win $Seconds
          </p>
          
          <div style="background: rgba(0,0,0,0.3); padding: 30px; border-radius: 15px; margin: 30px 0; text-align: left;">
            <h3 style="color: #f7931a; text-align: center;">🎮 How to Play</h3>
            <p>1. This is a Farcaster Frame - use it in a Farcaster client like Warpcast</p>
            <p>2. Click "Join Battle" to make your Bitcoin TX prediction for the next block</p>
            <p>3. Closest prediction wins $Seconds tokens!</p>
            <p>4. Share to invite more players and grow the prize pool</p>
          </div>
          
          <div style="background: rgba(255, 215, 0, 0.1); padding: 20px; border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3);">
            <h3 style="color: #ffd700;">🏆 Prize Pool</h3>
            <p><strong>🥇 1st place:</strong> 500 $SECONDS</p>
            <p><strong>🥈 2nd place:</strong> 250 $SECONDS</p>
          </div>
          
          <p style="margin-top: 30px; color: #cccccc;">
            Powered by $Seconds • Built for Farcaster
          </p>
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
        
        <title>Bitcoin Battle - Error</title>
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
          .error-container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 107, 53, 0.1);
            padding: 30px;
            border-radius: 15px;
            border: 1px solid rgba(255, 107, 53, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1 style="color: #ff6b35;">❌ Oops!</h1>
          <p>${message}</p>
          <p style="margin-top: 20px; font-size: 0.9em; opacity: 0.8;">
            Please try again or contact support if the issue persists.
          </p>
        </div>
      </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}

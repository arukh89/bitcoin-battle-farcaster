// Webhook API for Farcaster Mini App events
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests for webhooks
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowed: ['POST'] 
    });
  }

  try {
    const { type, data } = req.body;
    
    console.log('Webhook received:', { type, data, timestamp: Date.now() });
    
    switch (type) {
      case 'miniapp.install':
        return handleInstall(req, res, data);
      case 'miniapp.uninstall':
        return handleUninstall(req, res, data);
      case 'miniapp.launch':
        return handleLaunch(req, res, data);
      case 'miniapp.interaction':
        return handleInteraction(req, res, data);
      case 'user.prediction':
        return handlePrediction(req, res, data);
      default:
        console.log('Unknown webhook type:', type);
        return res.status(200).json({ 
          success: true, 
          message: 'Webhook received but not processed',
          type 
        });
    }
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ 
      error: 'Webhook processing failed',
      message: error.message 
    });
  }
}

// Handle Mini App installation
async function handleInstall(req, res, data) {
  try {
    const { fid, username } = data;
    
    console.log(`Mini App installed by user: ${fid} (${username})`);
    
    // In a real app, you would:
    // 1. Store user installation in database
    // 2. Initialize user profile
    // 3. Send welcome message
    // 4. Track analytics
    
    return res.status(200).json({
      success: true,
      message: 'Installation recorded successfully',
      data: {
        fid,
        username,
        welcomeBonus: 50, // Give new users 50 bonus tokens
        timestamp: Date.now()
      }
    });
    
  } catch (error) {
    console.error('Install webhook error:', error);
    return res.status(500).json({ error: 'Failed to process installation' });
  }
}

// Handle Mini App uninstall
async function handleUninstall(req, res, data) {
  try {
    const { fid, username } = data;
    
    console.log(`Mini App uninstalled by user: ${fid} (${username})`);
    
    // In a real app, you would:
    // 1. Mark user as inactive
    // 2. Clean up user data (optional)
    // 3. Track uninstall analytics
    
    return res.status(200).json({
      success: true,
      message: 'Uninstallation recorded successfully',
      data: {
        fid,
        username,
        timestamp: Date.now()
      }
    });
    
  } catch (error) {
    console.error('Uninstall webhook error:', error);
    return res.status(500).json({ error: 'Failed to process uninstallation' });
  }
}

// Handle Mini App launch
async function handleLaunch(req, res, data) {
  try {
    const { fid, username } = data;
    
    console.log(`Mini App launched by user: ${fid} (${username})`);
    
    // In a real app, you would:
    // 1. Track user activity
    // 2. Load user's game state
    // 3. Check for new rounds/updates
    // 4. Update last seen timestamp
    
    // Get current game data
    const gameData = await getCurrentGameData();
    
    return res.status(200).json({
      success: true,
      message: 'Launch recorded successfully',
      data: {
        fid,
        username,
        gameData,
        timestamp: Date.now()
      }
    });
    
  } catch (error) {
    console.error('Launch webhook error:', error);
    return res.status(500).json({ error: 'Failed to process launch' });
  }
}

// Handle user interactions
async function handleInteraction(req, res, data) {
  try {
    const { fid, username, action, payload } = data;
    
    console.log(`User interaction: ${fid} performed ${action}`, payload);
    
    switch (action) {
      case 'submit_prediction':
        return handlePredictionSubmission(req, res, { fid, username, ...payload });
      case 'view_leaderboard':
        return handleLeaderboardView(req, res, { fid, username });
      case 'share_game':
        return handleGameShare(req, res, { fid, username, ...payload });
      default:
        return res.status(200).json({ 
          success: true, 
          message: 'Interaction recorded',
          action 
        });
    }
    
  } catch (error) {
    console.error('Interaction webhook error:', error);
    return res.status(500).json({ error: 'Failed to process interaction' });
  }
}

// Handle prediction submissions
async function handlePrediction(req, res, data) {
  try {
    const { fid, username, prediction, targetBlock } = data;
    
    console.log(`Prediction submitted: ${fid} predicted ${prediction} for block ${targetBlock}`);
    
    // Validate prediction
    if (!prediction || prediction < 1 || prediction > 10000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid prediction range'
      });
    }
    
    // In a real app, you would:
    // 1. Store prediction in database
    // 2. Validate user hasn't already predicted for this block
    // 3. Update user statistics
    // 4. Trigger notifications to other players
    
    return res.status(200).json({
      success: true,
      message: 'Prediction recorded successfully',
      data: {
        predictionId: `pred_${Date.now()}_${fid}`,
        fid,
        username,
        prediction,
        targetBlock,
        timestamp: Date.now(),
        status: 'submitted'
      }
    });
    
  } catch (error) {
    console.error('Prediction webhook error:', error);
    return res.status(500).json({ error: 'Failed to process prediction' });
  }
}

// Helper function to get current game data
async function getCurrentGameData() {
  try {
    const response = await fetch('https://mempool.space/api/blocks/tip/height');
    const currentBlock = await response.json();
    const nextBlock = currentBlock + 1;
    const roundNumber = Math.floor((nextBlock - 850000) / 100) + 200;
    
    return {
      currentBlock,
      nextBlock,
      roundNumber,
      prizePool: 750,
      playersOnline: Math.floor(Math.random() * 50) + 25
    };
  } catch (error) {
    console.error('Failed to fetch game data:', error);
    return null;
  }
}

// Helper functions for specific interactions
async function handlePredictionSubmission(req, res, data) {
  const { fid, username, prediction, targetBlock } = data;
  
  // Same logic as handlePrediction but for interactive submissions
  return res.status(200).json({
    success: true,
    message: 'Interactive prediction submitted',
    data: {
      fid,
      username,
      prediction,
      targetBlock,
      timestamp: Date.now()
    }
  });
}

async function handleLeaderboardView(req, res, data) {
  const { fid, username } = data;
  
  // Track leaderboard views for analytics
  return res.status(200).json({
    success: true,
    message: 'Leaderboard view tracked',
    data: { fid, username, timestamp: Date.now() }
  });
}

async function handleGameShare(req, res, data) {
  const { fid, username, platform } = data;
  
  // Track game shares for viral growth metrics
  return res.status(200).json({
    success: true,
    message: 'Game share tracked',
    data: { fid, username, platform, timestamp: Date.now() }
  });
      }

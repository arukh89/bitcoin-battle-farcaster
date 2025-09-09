// Mini App API Handler - handles game data and predictions
export default async function handler(req, res) {
  // Set CORS headers for Mini App
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { action } = req.query;
    
    switch (action) {
      case 'gameData':
        return await handleGameData(req, res);
      case 'submitPrediction':
        return await handleSubmitPrediction(req, res);
      case 'userStats':
        return await handleUserStats(req, res);
      case 'leaderboard':
        return await handleLeaderboard(req, res);
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
  } catch (error) {
    console.error('Mini App API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Get current game data
async function handleGameData(req, res) {
  try {
    // Fetch current Bitcoin block height
    const blockResponse = await fetch('https://mempool.space/api/blocks/tip/height');
    const currentBlock = await blockResponse.json();
    const nextBlock = currentBlock + 1;
    
    // Calculate round number (you can customize this formula)
    const roundNumber = Math.floor((nextBlock - 850000) / 100) + 200;
    
    // Simulate active players (in real app, get from database)
    const playersOnline = Math.floor(Math.random() * 50) + 25;
    
    // Get mempool data for additional context
    let mempoolData = null;
    try {
      const mempoolResponse = await fetch('https://mempool.space/api/mempool');
      mempoolData = await mempoolResponse.json();
    } catch (error) {
      console.log('Failed to fetch mempool data:', error.message);
    }
    
    const gameData = {
      currentBlock,
      nextBlock,
      roundNumber,
      playersOnline,
      prizePool: {
        first: 500,
        second: 250,
        total: 750,
        currency: '$SECONDS'
      },
      mempool: mempoolData ? {
        count: mempoolData.count || 0,
        vsize: mempoolData.vsize || 0,
        totalFees: mempoolData.total_fee || 0
      } : null,
      tips: {
        average: '2000-4500 transactions per block',
        highActivity: '4000+ transactions (busy periods)',
        lowActivity: '1500-2500 transactions (quiet periods)',
        recommendation: 'Check mempool.space for current network activity'
      },
      timestamp: Date.now()
    };
    
    return res.status(200).json({
      success: true,
      data: gameData
    });
    
  } catch (error) {
    console.error('Failed to fetch game data:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load game data',
      message: error.message
    });
  }
}

// Handle prediction submission
async function handleSubmitPrediction(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { prediction, fid, username } = req.body;
    
    // Validate prediction
    if (!prediction || prediction < 1 || prediction > 10000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid prediction. Must be between 1 and 10,000'
      });
    }
    
    // Get current block for validation
    const blockResponse = await fetch('https://mempool.space/api/blocks/tip/height');
    const currentBlock = await blockResponse.json();
    const targetBlock = currentBlock + 1;
    
    // In a real app, you would:
    // 1. Store prediction in database
    // 2. Validate user hasn't already submitted for this block
    // 3. Record timestamp and user info
    // 4. Update game statistics
    
    // For demo purposes, we'll simulate success
    const submissionData = {
      id: `pred_${Date.now()}_${fid || 'anon'}`,
      prediction,
      targetBlock,
      fid: fid || null,
      username: username || null,
      timestamp: Date.now(),
      status: 'submitted'
    };
    
    console.log('Prediction submitted:', submissionData);
    
    return res.status(200).json({
      success: true,
      message: 'Prediction submitted successfully!',
      data: {
        predictionId: submissionData.id,
        prediction,
        targetBlock,
        timestamp: submissionData.timestamp
      }
    });
    
  } catch (error) {
    console.error('Failed to submit prediction:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit prediction',
      message: error.message
    });
  }
}

// Get user statistics
async function handleUserStats(req, res) {
  try {
    const { fid } = req.query;
    
    if (!fid) {
      return res.status(400).json({ error: 'FID required' });
    }
    
    // In a real app, fetch from database
    // For demo, return mock data
    const mockStats = {
      fid,
      username: `Player_${fid}`,
      gamesPlayed: Math.floor(Math.random() * 25) + 1,
      wins: Math.floor(Math.random() * 5),
      tokensWon: Math.floor(Math.random() * 1500) + 100,
      bestRank: Math.floor(Math.random() * 50) + 1,
      averageAccuracy: Math.floor(Math.random() * 30) + 70, // 70-100%
      currentStreak: Math.floor(Math.random() * 5),
      totalPredictions: Math.floor(Math.random() * 30) + 5,
      lastPlayed: Date.now() - Math.floor(Math.random() * 86400000) // Within last 24h
    };
    
    return res.status(200).json({
      success: true,
      data: mockStats
    });
    
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load user statistics'
    });
  }
}

// Get leaderboard
async function handleLeaderboard(req, res) {
  try {
    const { limit = 10 } = req.query;
    
    // In a real app, fetch from database
    // For demo, generate mock leaderboard
    const mockLeaderboard = [];
    for (let i = 0; i < parseInt(limit); i++) {
      mockLeaderboard.push({
        rank: i + 1,
        fid: 100000 + i,
        username: `Player_${100000 + i}`,
        tokensWon: Math.floor(Math.random() * 5000) + 1000 - (i * 200),
        wins: Math.floor(Math.random() * 10) + 5 - i,
        gamesPlayed: Math.floor(Math.random() * 30) + 10,
        winRate: Math.floor((Math.random() * 40) + 60 - (i * 2)), // Decreasing win rate
        avatar: `https://avatar.vercel.sh/${100000 + i}`,
        lastActive: Date.now() - Math.floor(Math.random() * 3600000) // Within last hour
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        leaderboard: mockLeaderboard,
        totalPlayers: Math.floor(Math.random() * 500) + 200,
        lastUpdated: Date.now()
      }
    });
    
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load leaderboard'
    });
  }
                      }

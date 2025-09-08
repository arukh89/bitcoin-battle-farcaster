#!/bin/bash
# Bitcoin TX Battle Royale - Repository Setup Script
# Run this script in your repository root directory

echo "ðŸš€ Setting up Bitcoin TX Battle Royale repository structure..."

# Create directory structure
mkdir -p .well-known
mkdir -p api/frame api/game api/blockchain
mkdir -p public/images
mkdir -p battle stats leaderboard admin
mkdir -p lib styles components scripts
mkdir -p middleware hooks cron
mkdir -p database/migrations
mkdir -p tests docs assets/fonts assets/sounds assets/animations
mkdir -p .github/workflows
mkdir -p docker

echo "ðŸ“ Directory structure created!"

# Create .well-known/farcaster.json
cat > .well-known/farcaster.json << 'EOF'
{
  "accountAssociation": {
    "header": "eyJmaWQiOjI1MDcwNCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDE1MzY1NzE0NWVBMmQ1Nzk2OTFhMTQ2YzdFYTRDRkFFMzdEMjdGYWUifQ",
    "payload": "eyJkb21haW4iOiJ5b3VyLWRvbWFpbi5jb20ifQ",
    "signature": "MHhkZTY0ZTY5YjI0OGE0MTU3NmI5OTQxZjEzOTliZTgwYTc3NWNjOTExOWVkYjI4OTE5OTQxMGVhYjE1ZDE3YjZiMzZmYmNmZTZiMjRhNzQ1ZDc2OWUwNDc5NTI0NzkzMDcwMDA4NDNmNDQyNDgyNzhkOWU5YzM1YTk1OTc2NzA0ODFj"
  },
  "miniapp": {
    "version": "1",
    "name": "$Seconds Bitcoin TX Battle Royale",
    "iconUrl": "https://your-domain.com/bitcoin-icon.png",
    "homeUrl": "https://your-domain.com/",
    "splashImageUrl": "https://your-domain.com/bitcoin-splash.png",
    "splashBackgroundColor": "#1e3a8a",
    "subtitle": "Predict Bitcoin transactions and win $Seconds tokens",
    "description": "Real-time Bitcoin block prediction game where players compete to guess the number of transactions in the next block. Winners earn $Seconds tokens!",
    "primaryCategory": "game",
    "tags": [
      "bitcoin",
      "blockchain",
      "game",
      "prediction",
      "crypto",
      "competition",
      "battle-royale"
    ],
    "heroImageUrl": "https://your-domain.com/bitcoin-battle-hero.png",
    "tagline": "Battle to predict Bitcoin transactions",
    "ogTitle": "$Seconds Bitcoin TX Battle Royale",
    "ogDescription": "Predict Bitcoin block transactions and win $Seconds tokens in this real-time blockchain battle royale!",
    "ogImageUrl": "https://your-domain.com/bitcoin-battle-og.png"
  }
}
EOF

# Create package.json
cat > package.json << 'EOF'
{
  "name": "bitcoin-battle-farcaster",
  "version": "1.0.0",
  "description": "Bitcoin TX Battle Royale for Farcaster",
  "main": "index.html",
  "scripts": {
    "dev": "vercel dev",
    "test": "vitest",
    "lint": "eslint .",
    "format": "prettier --write .",
    "deploy": "vercel --prod",
    "setup": "./scripts/setup.sh"
  },
  "dependencies": {
    "@farcaster/miniapp-sdk": "^0.1.0",
    "@supabase/supabase-js": "^2.38.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "vercel": "^33.0.0",
    "vitest": "^1.0.0"
  },
  "keywords": [
    "farcaster",
    "bitcoin",
    "blockchain",
    "game",
    "crypto"
  ],
  "author": "Your Name",
  "license": "MIT"
}
EOF

# Create vercel.json
cat > vercel.json << 'EOF'
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/.well-known/farcaster.json",
      "headers": [
        {"key": "Access-Control-Allow-Origin", "value": "*"},
        {"key": "Content-Type", "value": "application/json"}
      ]
    },
    {
      "source": "/api/**",
      "headers": [
        {"key": "Access-Control-Allow-Origin", "value": "*"},
        {"key": "Access-Control-Allow-Methods", "value": "POST, GET, OPTIONS"},
        {"key": "Access-Control-Allow-Headers", "value": "Content-Type"}
      ]
    }
  ],
  "rewrites": [
    {"source": "/battle", "destination": "/battle/index.html"},
    {"source": "/stats", "destination": "/stats/index.html"},
    {"source": "/leaderboard", "destination": "/leaderboard/index.html"}
  ]
}
EOF

# Create .env.example
cat > .env.example << 'EOF'
# Farcaster Configuration
FARCASTER_HUB_URL=https://nemes.farcaster.xyz:2281

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/bitcoin_battle
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key

# Blockchain APIs
MEMPOOL_API_KEY=optional_api_key

# Token Contract
SECONDS_TOKEN_ADDRESS=0x...

# Security
ADMIN_SECRET=your_admin_secret
JWT_SECRET=your_jwt_secret

# Webhooks
WEBHOOK_URL=https://your-domain.com
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
.vercel
.netlify
dist/
build/

# Database
*.db
*.sqlite

# Logs
logs/
*.log

# OS generated files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/
.nyc_output

# Temporary files
tmp/
temp/
EOF

# Create main API handler
cat > api/frame.js << 'EOF'
// Main Farcaster Frame API handler
export default async function handler(req, res) {
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
          <meta property="fc:frame:image" content="https://your-domain.com/battle-frame.png" />
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
          <meta property="fc:frame:button:1" content="Submit Guess" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:input:text" content="Enter TX prediction..." />
          <meta property="fc:frame:post_url" content="https://your-domain.com/api/frame/guess" />
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
        <meta property="fc:frame:image" content="https://your-domain.com/stats-frame.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="ðŸŽ® New Battle" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:post_url" content="https://your-domain.com/api/frame" />
      </head>
      <body>
        <h1>Your Battle Stats</h1>
        <p>FID: ${fid}</p>
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
        <meta property="fc:frame:image" content="https://your-domain.com/bitcoin-battle-frame.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="ðŸŽ® Join Battle" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:2" content="ðŸ“Š View Stats" />
        <meta property="fc:frame:button:2:action" content="post" />
        <meta property="fc:frame:post_url" content="https://your-domain.com/api/frame" />
      </head>
      <body>
        <h1>$Seconds Bitcoin TX Battle Royale</h1>
        <p>Welcome to the ultimate Bitcoin prediction game!</p>
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
        <meta property="fc:frame:image" content="https://your-domain.com/error-frame.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="ðŸ”„ Try Again" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:post_url" content="https://your-domain.com/api/frame" />
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
EOF

# Create GitHub workflow
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
EOF

# Create README.md
cat > README.md << 'EOF'
# ðŸŽ® Bitcoin TX Battle Royale - Farcaster Edition

Real-time Bitcoin block prediction game built for Farcaster with $Seconds token rewards.

## ðŸš€ Quick Start

1. **Setup Repository:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Deploy:**
   ```bash
   npm install
   npm run deploy
   ```

## ðŸŽ¯ Features

- âš¡ Real-time Bitcoin mempool integration
- ðŸŸª Farcaster Frame + MiniApp support
- ðŸ† $Seconds token rewards
- ðŸ“Š Live statistics and leaderboards
- ðŸ”’ Secure user authentication

## ðŸ› ï¸ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Vercel Serverless Functions
- **Blockchain:** mempool.space API
- **Database:** Supabase (optional)
- **Deployment:** Vercel/Netlify

## ðŸ“± Usage

1. Share your Frame in Farcaster
2. Users click "Join Battle"
3. Players predict TX count for next Bitcoin block
4. Winners earn $Seconds tokens automatically

## ðŸ”§ Development

```bash
npm run dev          # Start development server
npm test             # Run tests
npm run lint         # Lint code
npm run format       # Format code
```

## ðŸ“„ License

MIT License - see LICENSE file for details.
EOF

echo "âœ… Repository structure created successfully!"
echo ""
echo "ðŸ”§ Next steps:"
echo "1. Run: chmod +x setup.sh && ./setup.sh"
echo "2. Replace 'your-domain.com' with your actual domain"
echo "3. Add your Frame images to public/images/"
echo "4. Configure environment variables"
echo "5. Deploy with: npm run deploy"
echo ""
echo "ðŸŽ® Your Bitcoin TX Battle Royale is ready!"

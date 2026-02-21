# Netlify Deployment Guide

This guide will help you deploy your Next.js Chat App to Netlify.

## Prerequisites

1. A Netlify account (sign up at https://www.netlify.com)
2. Your smart contract deployed on Sepolia testnet
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Install Netlify CLI (Optional)

```bash
npm install -g netlify-cli
```

## Step 2: Prepare Your Project

1. Make sure all your code is committed to Git
2. Push your code to GitHub/GitLab/Bitbucket

## Step 3: Deploy via Netlify Dashboard

### Option A: Connect via Git (Recommended)

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** 18 (or higher)

### Option B: Deploy via Netlify CLI

1. Login to Netlify:
```bash
netlify login
```

2. Initialize Netlify in your project:
```bash
netlify init
```

3. Deploy:
```bash
netlify deploy --prod
```

## Step 4: Configure Environment Variables

1. Go to your site dashboard on Netlify
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variables:

### Required Variables:
```
NEXT_PUBLIC_CHAT_APP_ADDRESS=your_deployed_contract_address
```
Replace `your_deployed_contract_address` with your actual deployed smart contract address on Sepolia testnet.

### Optional Variables (for IPFS file storage):
```
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret_key
```

**Important:** 
- Make sure to use `NEXT_PUBLIC_` prefix for any variables that need to be accessible in the browser
- After adding environment variables, you need to trigger a new deployment

## Step 5: Install Netlify Next.js Plugin

The `netlify.toml` file already includes the Next.js plugin configuration. Netlify will automatically install it during build.

If you need to install it manually:
```bash
npm install --save-dev @netlify/plugin-nextjs
```

## Step 6: Configure Build Settings

The `netlify.toml` file is already configured with:
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18
- Next.js plugin enabled

## Step 7: Deploy and Test

1. After deployment, Netlify will provide you with a URL
2. Test your application:
   - Connect your wallet
   - Create an account
   - Send messages
   - Test file sharing

## Troubleshooting

### Build Fails

1. Check build logs in Netlify dashboard
2. Ensure Node version is 18 or higher
3. Make sure all dependencies are in `package.json`
4. Check if environment variables are set correctly

### Runtime Errors

1. Check browser console for errors
2. Verify environment variables are set with `NEXT_PUBLIC_` prefix
3. Ensure your smart contract address is correct
4. Check network connectivity (Sepolia testnet)

### Routing Issues

The `public/_redirects` file handles Next.js routing. If you have custom routes, update it accordingly.

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CHAT_APP_ADDRESS` | Your deployed smart contract address on Sepolia testnet | Yes |
| `NEXT_PUBLIC_PINATA_API_KEY` | Pinata API key for IPFS file storage | No |
| `NEXT_PUBLIC_PINATA_SECRET_API_KEY` | Pinata secret API key for IPFS file storage | No |

## Additional Notes

- Netlify automatically handles Next.js serverless functions
- The app uses client-side rendering for blockchain interactions
- Make sure your RPC endpoints are publicly accessible
- IPFS file storage requires Pinata API keys (if using)

## Support

For issues specific to:
- **Netlify:** Check Netlify documentation or community forum
- **Next.js:** Check Next.js documentation
- **Blockchain:** Verify your contract deployment and RPC endpoints

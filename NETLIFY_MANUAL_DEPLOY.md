# Manual Netlify Deployment Guide for Next.js 12

Since Netlify auto-detects Next.js and tries to use a plugin that requires Next.js 13+, we need to deploy manually through the dashboard.

## Step 1: Go to Netlify Dashboard

1. Visit https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub account if not already connected
4. Select repository: **`ankitjzwar/p2p-Dapp`**

## Step 2: Configure Build Settings

**IMPORTANT:** Before clicking "Deploy site", click **"Show advanced"** and configure:

### Build Settings:
- **Base directory:** (leave empty)
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** `18` (or leave default)

### Environment Variables:
Click **"New variable"** and add:
- **Key:** `NEXT_PUBLIC_CHAT_APP_ADDRESS`
- **Value:** Your deployed smart contract address

(Optional - if using IPFS):
- **Key:** `NEXT_PUBLIC_PINATA_API_KEY`
- **Value:** Your Pinata API key
- **Key:** `NEXT_PUBLIC_PINATA_SECRET_API_KEY`
- **Value:** Your Pinata secret key

## Step 3: Disable Auto Plugin Detection

After the site is created:

1. Go to **Site settings** → **Build & deploy** → **Build settings**
2. Scroll down to **"Build plugins"**
3. If you see `@netlify/plugin-nextjs`, click on it and **disable** or **remove** it
4. Or add this to your `netlify.toml` (already done):

```toml
[build]
  command = "npm run build"
  publish = ".next"
```

## Step 4: Deploy

1. Click **"Deploy site"**
2. Wait for the build to complete
3. Your site will be live at: `https://your-site-name.netlify.app`

## Alternative: Use Netlify CLI with Skip Flag

If you want to use CLI, you can try:

```bash
# Set environment variable to skip plugin
export NETLIFY_NEXT_PLUGIN_SKIP=true
netlify deploy --prod
```

Or on Windows PowerShell:
```powershell
$env:NETLIFY_NEXT_PLUGIN_SKIP="true"
netlify deploy --prod
```

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure Node version is 18+
- Verify environment variables are set

### Plugin Still Runs
- The plugin auto-detects Next.js
- Use the dashboard method instead
- Or upgrade to Next.js 13+ (requires code changes)

### Site Works But Routes Don't
- Check `public/_redirects` file exists
- Ensure it has: `/*    /index.html   200`

## Recommended Approach

**Use the Netlify Dashboard method** - it's the most reliable for Next.js 12:
1. Connect GitHub repo
2. Configure build settings manually
3. Disable auto-detected plugin
4. Deploy

Your code is already on GitHub, so this should be straightforward!

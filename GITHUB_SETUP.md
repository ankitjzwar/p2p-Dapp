# GitHub Setup Guide

Your code has been committed locally! Now follow these steps to push it to GitHub:

## Step 1: Create a GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name:** `p2p-chat-app` (or any name you prefer)
   - **Description:** "P2P Chat Application with Blockchain Integration and IPFS File Sharing"
   - **Visibility:** Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

## Step 2: Add GitHub Remote and Push

After creating the repository, GitHub will show you commands. Use these commands:

### Option A: If you haven't created the repo yet
```bash
# Replace YOUR_USERNAME and REPO_NAME with your actual GitHub username and repository name
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### Option B: If you prefer SSH (if you have SSH keys set up)
```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Verify

After pushing, refresh your GitHub repository page. You should see all your files there!

## Quick Command Reference

```bash
# Check current status
git status

# View remote repositories
git remote -v

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git push -u origin main

# For future updates
git add .
git commit -m "Your commit message"
git push
```

## Troubleshooting

### If you get authentication errors:
- Use GitHub Personal Access Token instead of password
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### If remote already exists:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### If you need to update remote URL:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

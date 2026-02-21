# Push to GitHub Instructions

## Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `weather-app`
3. Description: "Modern weather application with glassmorphism UI, map integration, and autocomplete search"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 2: Push Your Code

After creating the repository, run these commands (replace YOUR_USERNAME with your GitHub username):

```bash
cd d:\projects\weather-app

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/weather-app.git

# Push to GitHub
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/weather-app.git
git push -u origin main
```

## If you get authentication errors:

1. **Use GitHub CLI** (recommended):
   ```bash
   gh auth login
   git push -u origin main
   ```

2. **Use Personal Access Token**:
   - Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
   - Generate a new token with `repo` permissions
   - Use the token as password when pushing

3. **Use GitHub Desktop**: Download GitHub Desktop and push through the GUI

## Verify Push

After pushing, visit: `https://github.com/YOUR_USERNAME/weather-app`

You should see all your files there!

# 🚀 Quick Deploy to Vercel

## Step 1: Push Code to GitHub

```bash
# If you haven't initialized git yet
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Log in"** (use your GitHub account)
3. Click **"Add New Project"**
4. Select your GitHub repository
5. Vercel will auto-detect settings - just click **"Deploy"**

## Step 3: Add Environment Variables

After deployment, go to your project settings:

**Project → Settings → Environment Variables**

Add these 4 variables:

```
NODE_ENV = production
RESEND_API_KEY = your_resend_api_key_here
GOOGLE_CLIENT_ID = your_google_client_id_here
GOOGLE_CLIENT_SECRET = your_google_client_secret_here
```

After adding variables, redeploy: **Deployments → ⋯ → Redeploy**

## Step 4: Update Google OAuth

1. Go to **https://console.cloud.google.com**
2. Navigate to **APIs & Services → Credentials**
3. Click your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://your-project-name.vercel.app/api/auth/callback
   ```
5. Click **Save**

## ✅ Done! Your App is Live!

- **Frontend**: https://your-project-name.vercel.app
- **API**: https://your-project-name.vercel.app/api/*

---

## Important URLs Structure

| Type | URL |
|------|-----|
| Main Website | `https://your-app.vercel.app` |
| Contact API | `https://your-app.vercel.app/api/contact` |
| OAuth Login | `https://your-app.vercel.app/api/oauth/google/redirect_url` |
| OAuth Callback | `https://your-app.vercel.app/api/auth/callback` |
| User Info | `https://your-app.vercel.app/api/users/me` |
| Logout | `https://your-app.vercel.app/api/logout` |

**Note**: Replace `your-app` with your actual Vercel project name.

---

## Troubleshooting

### ❌ Build Failed
- Check that `npm run build` works locally
- Review build logs in Vercel dashboard

### ❌ API Not Working
- Verify all 4 environment variables are set
- Check function logs in Vercel dashboard

### ❌ OAuth Not Working
- Ensure redirect URI in Google Console matches your Vercel URL exactly
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

---

## Need Help?
- [Vercel Documentation](https://vercel.com/docs)
- [Join Discord Community](https://discord.gg/shDEGBSe2d)


# ✅ Deployment Checklist

Follow this checklist to deploy your app to Vercel:

## Before You Start

- [ ] Make sure you have a GitHub account
- [ ] Make sure you have a Vercel account (or ready to sign up)
- [ ] Have your environment variables ready:
  - [ ] RESEND_API_KEY
  - [ ] GOOGLE_CLIENT_ID
  - [ ] GOOGLE_CLIENT_SECRET

---

## Part 1: Push to GitHub (5 minutes)

- [ ] Open terminal in your project folder
- [ ] Run: `git init`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Ready for deployment"`
- [ ] Create a new repository on GitHub.com
- [ ] Copy the repository URL
- [ ] Run: `git remote add origin YOUR_REPO_URL`
- [ ] Run: `git branch -M main`
- [ ] Run: `git push -u origin main`
- [ ] Verify your code is on GitHub

---

## Part 2: Deploy on Vercel (3 minutes)

- [ ] Go to https://vercel.com
- [ ] Click "Sign Up" or "Log In"
- [ ] Use "Continue with GitHub"
- [ ] Click "Add New Project"
- [ ] Find and select your repository
- [ ] Click "Deploy" (don't change any settings)
- [ ] Wait for deployment to complete (2-3 minutes)
- [ ] Copy your deployment URL (e.g., `https://your-app.vercel.app`)

---

## Part 3: Add Environment Variables (2 minutes)

- [ ] In Vercel, go to your project
- [ ] Click "Settings" tab
- [ ] Click "Environment Variables" in left sidebar
- [ ] Add these variables one by one:

  **Variable 1:**
  - [ ] Key: `NODE_ENV`
  - [ ] Value: `production`
  - [ ] Click "Add"

  **Variable 2:**
  - [ ] Key: `RESEND_API_KEY`
  - [ ] Value: (paste your Resend API key)
  - [ ] Click "Add"

  **Variable 3:**
  - [ ] Key: `GOOGLE_CLIENT_ID`
  - [ ] Value: (paste your Google Client ID)
  - [ ] Click "Add"

  **Variable 4:**
  - [ ] Key: `GOOGLE_CLIENT_SECRET`
  - [ ] Value: (paste your Google Client Secret)
  - [ ] Click "Add"

- [ ] Go to "Deployments" tab
- [ ] Click "⋯" next to latest deployment
- [ ] Click "Redeploy"
- [ ] Wait for redeployment to complete

---

## Part 4: Update Google OAuth (5 minutes)

- [ ] Go to https://console.cloud.google.com
- [ ] Click on your project
- [ ] Click "APIs & Services" in left menu
- [ ] Click "Credentials"
- [ ] Click on your "OAuth 2.0 Client ID"
- [ ] Scroll to "Authorized redirect URIs"
- [ ] Click "ADD URI"
- [ ] Paste: `https://your-actual-vercel-url.vercel.app/api/auth/callback`
- [ ] Click "SAVE"

---

## Part 5: Test Your Deployment (5 minutes)

- [ ] Open your Vercel URL in browser
- [ ] Test the home page loads correctly
- [ ] Test navigation works
- [ ] Try the contact form
- [ ] Try Google OAuth login
- [ ] Check that all features work

---

## 🎉 Deployment Complete!

Your app is now live at: `https://your-project-name.vercel.app`

---

## Common Issues & Solutions

### Issue: Build Failed
- ✅ Check build logs in Vercel dashboard
- ✅ Make sure `npm run build` works locally first
- ✅ Verify all dependencies are in `package.json`

### Issue: API Routes Not Working
- ✅ Make sure all 4 environment variables are added
- ✅ Make sure you redeployed after adding variables
- ✅ Check function logs in Vercel dashboard

### Issue: OAuth Not Working
- ✅ Verify redirect URI in Google Console is exactly: `https://your-url.vercel.app/api/auth/callback`
- ✅ Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- ✅ Make sure there are no extra spaces in environment variables

---

## Need Help?
- Read: `DEPLOY_TO_VERCEL.md` for detailed instructions
- Read: `DEPLOYMENT_SUMMARY.md` for quick overview
- Visit: https://vercel.com/docs
- Join: https://discord.gg/shDEGBSe2d


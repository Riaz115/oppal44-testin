# Vercel Deployment Guide for Opal44

## Overview
This project is a full-stack application with React frontend and Express backend. Both will be deployed together on Vercel.

## Deployment Steps

### 1. Push to GitHub
```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit for Vercel deployment"

# Create a new repository on GitHub and push
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the settings
6. Add your environment variables (see below)
7. Click "Deploy"

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### 3. Configure Environment Variables

In Vercel Dashboard, go to: **Project Settings → Environment Variables**

Add these variables:

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `NODE_ENV` | Environment | `production` |
| `RESEND_API_KEY` | Resend API key for emails | `re_xxxxxxxxxxxxx` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-xxxxxxxxxxxxx` |

**Important**: Make sure to set these for "Production", "Preview", and "Development" environments.

### 4. Update Google OAuth Settings

After deployment, you need to update your Google OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to: **APIs & Services → Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add these to **Authorized redirect URIs**:
   - `https://your-project-name.vercel.app/api/auth/callback`
   - `https://your-custom-domain.com/api/auth/callback` (if using custom domain)

### 5. Update CORS Settings (if needed)

If you have a custom domain, update the CORS origins in `src/server/index.ts`:

```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-custom-domain.com', 'https://www.your-custom-domain.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
```

## URLs After Deployment

- **Frontend**: `https://your-project-name.vercel.app`
- **API Endpoints**: `https://your-project-name.vercel.app/api/*`
  - Contact form: `https://your-project-name.vercel.app/api/contact`
  - OAuth: `https://your-project-name.vercel.app/api/auth/callback`
  - User info: `https://your-project-name.vercel.app/api/users/me`

## Vercel Configuration Details

The `vercel.json` file configures:
- ✅ Build command and output directory
- ✅ API route handling under `/api`
- ✅ Client-side routing (SPA) support
- ✅ Node.js runtime for serverless functions

## Custom Domain (Optional)

To add a custom domain:
1. Go to: **Project Settings → Domains**
2. Add your domain
3. Update DNS records as instructed by Vercel
4. Update Google OAuth redirect URIs
5. Update CORS settings in code

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify build commands work locally: `npm run build`
- Check build logs in Vercel dashboard

### API Routes Not Working
- Ensure environment variables are set in Vercel
- Check function logs in Vercel dashboard
- Verify API routes start with `/api`

### OAuth Issues
- Verify redirect URIs in Google Console match Vercel URL
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Ensure cookies are enabled and CORS is properly configured

## Local Development

To continue local development:
```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:3000`

## Support

Need help? Check:
- [Vercel Documentation](https://vercel.com/docs)
- [Join Discord Community](https://discord.gg/shDEGBSe2d)


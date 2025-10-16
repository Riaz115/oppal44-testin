# Setup Guide: Google OAuth & Node.js Deployment

## What You Need to Obtain

### 1. Google Cloud Console Setup

#### Step 1: Create/Access Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your **Project ID** (you'll need this)

#### Step 2: Enable Required APIs
Enable these APIs in your Google Cloud project:
- **Google Analytics Reporting API**
- **Google Analytics Data API**
- **Google OAuth 2.0 API**

#### Step 3: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Choose **Web application**
4. Set up authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback`
   - For production: `https://opal44.com/api/auth/callback`
5. Save and note down:
   - **Client ID**
   - **Client Secret**

#### Step 4: OAuth Consent Screen (CRITICAL - This fixes the 403 error)
1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you have Google Workspace)
3. Fill in required fields:
   - **App name**: Opal44 (or your preferred name)
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Add **Authorized domains**:
   - `opal44.com`
   - `analytics.mocha.app`
5. Add required **scopes**:
   - `https://www.googleapis.com/auth/analytics.readonly`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
6. **IMPORTANT - Choose one of these options to fix the 403 error:**

   **Option A: Add Test Users (Quick Fix)**
   - In the OAuth consent screen, go to **Test users**
   - Click **Add users** and add your email address
   - This allows you to test immediately while app is in "Testing" status

   **Option B: Publish the App (Production Ready)**
   - Complete all OAuth consent screen fields
   - Click **Publish App** 
   - Note: May require Google verification for sensitive scopes
   - This allows any Google user to sign in

### 2. OpenAI API Setup

#### Step 1: Create OpenAI Account
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to **API Keys** section

#### Step 2: Generate API Key
1. Click **Create new secret key**
2. Name it (e.g., "Opal44 Production")
3. Copy and securely store the **API Key**
4. Note your **Organization ID** if you have one

#### Step 3: Set up Billing (if needed)
- Add payment method for API usage
- Set usage limits if desired

## How to Set Up Your Environment Variables

Create a `.env` file in your project root with your credentials:

### Required Environment Variables:
```env
NODE_ENV=production
PORT=3000

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_client_id_from_google_console
GOOGLE_CLIENT_SECRET=your_client_secret_from_google_console

# Email Service
RESEND_API_KEY=your_resend_api_key

# Optional API Keys
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
```

**Important**: Make sure your Google Cloud Console has these redirect URIs configured:
- Development: `http://localhost:3000/api/auth/callback`
- Production: `https://opal44.com/api/auth/callback`

### OpenAI Credentials:
```
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORGANIZATION_ID=your_org_id_here (optional)
```

## Fixing the 403 "Access Denied" Error

If you're seeing a **403 error** when clicking "Continue with Google", this means your OAuth app is in "Testing" mode. Here's how to fix it:

### Quick Fix (For Testing):
1. Go to **Google Cloud Console** > **APIs & Services** > **OAuth consent screen**
2. Scroll down to **Test users** section
3. Click **Add users** and add your email address
4. Save changes
5. Try signing up again - it should work immediately

### Production Fix (For Public Use):
1. Complete all required fields in the OAuth consent screen
2. Click **Publish App** 
3. Your app will be available to all Google users

## Current Implementation Status

✅ **Google OAuth Flow** - COMPLETED
   - Express.js backend with Google OAuth
   - Session management with secure cookies
   - GA4 permissions included in OAuth scope

✅ **Node.js Architecture** - MIGRATED
   - Converted from Cloudflare Workers to Express.js
   - Standard Node.js hosting compatible
   - Works with Heroku, Vercel, Railway, DigitalOcean, etc.

⚠️ **Action Required to Fix 403 Error**
   - Add your email as a test user in Google Cloud Console
   - OR publish your OAuth app for public use

🔄 **Ready for Deployment**
   - Set environment variables in your hosting platform
   - Deploy to any Node.js hosting service
   - Update redirect URIs in Google Cloud Console

🚀 **Available Features**
   - Google sign-in with GA4 access verification
   - Session management with httpOnly cookies
   - Contact form with email notifications
   - Partner program integration
   - Mobile-responsive dashboard

## Security Notes

- Never share credentials in plain text
- Use environment variables for all secrets
- Rotate API keys regularly
- Monitor API usage and costs

## Next Steps

1. **Set up your Google Cloud Console** (follow steps above)
2. **Update the app secrets** with your credentials:
   - Replace `GOOGLE_CLIENT_ID` with your Client ID
   - Replace `GOOGLE_CLIENT_SECRET` with your Client Secret
3. **Test the OAuth flow** - users will sign in with your Google app
4. **Monitor API usage** in your Google Cloud Console

## Development and Testing

### Local Development
1. **First**: Add your email as a test user in Google Cloud Console (see "Fixing the 403 Error" above)
2. Copy `.env.example` to `.env` and fill in your credentials
3. Run `npm run dev` to start both frontend and backend
4. Visit `http://localhost:5173/signup`
5. Click "Continue with Google" and test the OAuth flow

### Production Testing
1. Deploy to your hosting platform
2. Set all environment variables
3. Update Google Cloud Console redirect URIs
4. Visit your domain and test the complete flow

## Troubleshooting Common Issues

**403 Error: "You do not have access to this page"**
- Your OAuth app is in testing mode
- Add your email as a test user in Google Cloud Console
- OR publish your app for public access

**400 Error: "redirect_uri_mismatch"**
- Check that `https://analytics.mocha.app/auth/callback` is added to authorized redirect URIs
- Make sure there are no typos in the redirect URI

**Invalid Client Error**
- Double-check your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET values
- Ensure they match your Google Cloud Console OAuth credentials

The OAuth flow is fully implemented and ready to use your credentials!

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';
import { Resend } from 'resend';
import { 
  GoogleOAuthHandler, 
  GoogleOAuthConfig, 
  UserSession, 
  SESSION_COOKIE_NAME, 
  createSessionToken, 
  parseSessionToken 
} from './google-oauth.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://opal44.com', 'https://www.opal44.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files from the client build
app.use(express.static(join(__dirname, '../../dist/client')));

// Contact form submission schema
const ContactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  subject: z.string().optional()
});

// Contact form submission endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const validation = ContactFormSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Invalid form data", 
        details: validation.error.errors 
      });
    }

    const { name, email, company, message, subject } = validation.data;

    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email to paul@digitalawol.com
    await resend.emails.send({
      from: "Opal44 Contact Form <noreply@opal44.com>",
      to: ["paul@digitalawol.com"],
      subject: subject ? `${subject} - ${name}` : `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">${subject || 'New Contact Form Submission'}</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #374151;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #374151;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;">
              <strong>Reply to:</strong> ${email}
            </p>
          </div>
        </div>
      `,
      text: `
${subject || 'New Contact Form Submission'}

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ''}

Message:
${message}

Reply to: ${email}
      `
    });

    res.json({ success: true, message: "Thank you for your message! We'll get back to you soon." });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

// Google OAuth redirect URL endpoint
app.get('/api/oauth/google/redirect_url', async (req, res) => {
  try {
    const config: GoogleOAuthConfig = {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: process.env.NODE_ENV === 'production' 
        ? 'https://opal44.com/api/auth/callback'
        : 'http://localhost:3000/api/auth/callback',
    };

    const oauthHandler = new GoogleOAuthHandler(config);
    const redirectUrl = oauthHandler.getAuthUrl();

    res.json({ redirectUrl });
  } catch (error) {
    console.error('OAuth redirect error:', error);
    res.status(500).json({ error: 'Failed to generate redirect URL' });
  }
});

// Get the current user object for the frontend
app.get("/api/users/me", async (req, res) => {
  try {
    const sessionToken = req.cookies[SESSION_COOKIE_NAME];
    
    if (!sessionToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const session = parseSessionToken(sessionToken);
    
    if (!session) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    res.json({
      id: session.id,
      email: session.email,
      name: session.name,
      picture: session.picture,
      hasGA4Access: session.hasGA4Access,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// OAuth callback route - handles the redirect from Google
app.get('/api/auth/callback', async (req, res) => {
  const code = req.query.code as string;
  const error = req.query.error as string;

  // Handle OAuth errors
  if (error) {
    return res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Authentication Error</h2>
        <p style="color: #6b7280; margin: 20px 0;">There was an error during the sign-in process: ${error}</p>
        <a href="/signup" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Try Again</a>
      </div>
    `);
  }

  if (!code) {
    return res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Missing Authorization Code</h2>
        <p style="color: #6b7280; margin: 20px 0;">No authorization code was received from Google.</p>
        <a href="/signup" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Try Again</a>
      </div>
    `);
  }

  try {
    const config: GoogleOAuthConfig = {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: process.env.NODE_ENV === 'production' 
        ? 'https://opal44.com/api/auth/callback'
        : 'http://localhost:3000/api/auth/callback',
    };

    const oauthHandler = new GoogleOAuthHandler(config);
    
    // Exchange code for tokens
    const tokens = await oauthHandler.exchangeCodeForToken(code);
    
    // Get user info
    const userInfo = await oauthHandler.getUserInfo(tokens.access_token);
    
    // Verify GA4 access
    const hasGA4Access = await oauthHandler.verifyGA4Access(tokens.access_token);

    // Create session
    const userSession: UserSession = {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000),
      hasGA4Access,
    };

    const sessionToken = createSessionToken(userSession);

    res.cookie(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: "/",
      sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
    });

    // Redirect to dashboard after successful authentication
    const redirectUrl = process.env.NODE_ENV === 'production' 
      ? 'https://opal44.com/dashboard'
      : 'http://localhost:5173/dashboard';
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Authentication Failed</h2>
        <p style="color: #6b7280; margin: 20px 0;">Failed to complete sign up. Please try again.</p>
        <a href="/signup" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Try Again</a>
      </div>
    `);
  }
});

// Logout endpoint
app.get('/api/logout', async (req, res) => {
  try {
    res.cookie(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      path: '/',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Catch-all route for client-side routing (SPA)
// This must be last to avoid interfering with API routes
app.use((req, res) => {
  // For API routes, return 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // For all other routes, serve the main HTML file to enable client-side routing
  res.sendFile(join(__dirname, '../../dist/client/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

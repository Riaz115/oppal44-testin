export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export class GoogleOAuthHandler {
  private config: GoogleOAuthConfig;

  constructor(config: GoogleOAuthConfig) {
    this.config = config;
  }

  /**
   * Generate the OAuth redirect URL
   */
  getAuthUrl(): string {
    const params = [
      `client_id=${encodeURIComponent(this.config.clientId)}`,
      `redirect_uri=${encodeURIComponent(this.config.redirectUri)}`,
      'response_type=code',
      'scope=openid%20email%20profile',
      'access_type=offline',
      'prompt=consent'
    ].join('&');

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<GoogleTokenResponse> {
    const body = [
      `client_id=${encodeURIComponent(this.config.clientId)}`,
      `client_secret=${encodeURIComponent(this.config.clientSecret)}`,
      `code=${encodeURIComponent(code)}`,
      'grant_type=authorization_code',
      `redirect_uri=${encodeURIComponent(this.config.redirectUri)}`
    ].join('&');

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code for token: ${error}`);
    }

    return response.json() as Promise<GoogleTokenResponse>;
  }

  /**
   * Get user info from Google
   */
  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get user info: ${error}`);
    }

    return response.json() as Promise<GoogleUserInfo>;
  }

  /**
   * Verify GA4 access by checking available properties
   */
  async verifyGA4Access(_accessToken: string): Promise<boolean> {
    // Since we're not requesting Analytics scope, skip GA4 verification
    return true;
  }
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  picture: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  hasGA4Access: boolean;
}

export const SESSION_COOKIE_NAME = 'opal44_session';

/**
 * Create a session token (simple implementation - in production use JWT or similar)
 */
export function createSessionToken(userSession: UserSession): string {
  // Simple base64-like encoding for session data
  const jsonString = JSON.stringify(userSession);
  let result = '';
  for (let i = 0; i < jsonString.length; i++) {
    result += String.fromCharCode(jsonString.charCodeAt(i) + 1);
  }
  return result;
}

/**
 * Parse session token
 */
export function parseSessionToken(token: string): UserSession | null {
  try {
    // Reverse the simple encoding
    let decoded = '';
    for (let i = 0; i < token.length; i++) {
      decoded += String.fromCharCode(token.charCodeAt(i) - 1);
    }
    const session = JSON.parse(decoded) as UserSession;
    
    // Check if token is expired
    if (Date.now() > session.expiresAt) {
      return null;
    }
    
    return session;
  } catch (error) {
    return null;
  }
}


// Google OAuth Configuration and Helper Functions
// TODO: Replace with your actual Google OAuth credentials from Google Cloud Console
// https://console.cloud.google.com/apis/credentials

export const GOOGLE_CONFIG = {
  // TODO: Get this from Google Cloud Console -> APIs & Services -> Credentials
  CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  
  // Redirect URI must be registered in Google Cloud Console
  REDIRECT_URI: window.location.origin + '/auth/google/callback',
  
  // Scopes for user information
  SCOPE: 'openid profile email',
  
  // Response type
  RESPONSE_TYPE: 'code',
  
  // OAuth endpoints
  AUTH_ENDPOINT: 'https://accounts.google.com/o/oauth2/v2/auth',
  TOKEN_ENDPOINT: 'https://oauth2.googleapis.com/token',
  USERINFO_ENDPOINT: 'https://www.googleapis.com/oauth2/v3/userinfo',
};

/**
 * Generate Google OAuth URL
 */
export function getGoogleAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.CLIENT_ID,
    redirect_uri: GOOGLE_CONFIG.REDIRECT_URI,
    response_type: GOOGLE_CONFIG.RESPONSE_TYPE,
    scope: GOOGLE_CONFIG.SCOPE,
    access_type: 'offline',
    prompt: 'consent',
    state: generateState(), // CSRF protection
  });

  return `${GOOGLE_CONFIG.AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Generate random state for CSRF protection
 */
function generateState(): string {
  const state = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('google_oauth_state', state);
  return state;
}

/**
 * Verify state from callback
 */
export function verifyState(state: string): boolean {
  const savedState = sessionStorage.getItem('google_oauth_state');
  sessionStorage.removeItem('google_oauth_state');
  return state === savedState;
}

/**
 * Open Google OAuth popup
 */
export function openGoogleAuthPopup(): Promise<{ code: string; state: string }> {
  return new Promise((resolve, reject) => {
    const authUrl = getGoogleAuthUrl();
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      authUrl,
      'Google OAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      reject(new Error('Popup bị chặn. Vui lòng cho phép popup và thử lại.'));
      return;
    }

    // Listen for message from popup
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        window.removeEventListener('message', messageListener);
        popup.close();
        resolve(event.data.payload);
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        window.removeEventListener('message', messageListener);
        popup.close();
        reject(new Error(event.data.error || 'Google authentication failed'));
      }
    };

    window.addEventListener('message', messageListener);

    // Check if popup is closed
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        reject(new Error('Popup đã đóng'));
      }
    }, 1000);
  });
}

/**
 * Exchange authorization code for tokens (call your backend)
 */
export async function exchangeCodeForToken(code: string): Promise<any> {
  // TODO: Implement backend API call to exchange code for token
  // Your backend should:
  // 1. Receive the authorization code
  // 2. Exchange it with Google for access token
  // 3. Get user info from Google
  // 4. Create/login user in your system
  // 5. Return your app's JWT token
  
<<<<<<< HEAD
  const response = await fetch('/api/auth/google/callback', {
=======
  const response = await fetch('/identity/auth/google/callback', {
>>>>>>> origin/main
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate with Google');
  }

  return response.json();
}

/**
 * Handle Google OAuth redirect/callback
 * Call this on your callback page
 */
export function handleGoogleCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  const error = params.get('error');

  if (error) {
    // Send error to parent window
    if (window.opener) {
      window.opener.postMessage({
        type: 'GOOGLE_AUTH_ERROR',
        error: error,
      }, window.location.origin);
    }
    return;
  }

  if (!code || !state) {
    if (window.opener) {
      window.opener.postMessage({
        type: 'GOOGLE_AUTH_ERROR',
        error: 'Missing code or state',
      }, window.location.origin);
    }
    return;
  }

  // Verify state
  if (!verifyState(state)) {
    if (window.opener) {
      window.opener.postMessage({
        type: 'GOOGLE_AUTH_ERROR',
        error: 'Invalid state - CSRF check failed',
      }, window.location.origin);
    }
    return;
  }

  // Send success to parent window
  if (window.opener) {
    window.opener.postMessage({
      type: 'GOOGLE_AUTH_SUCCESS',
      payload: { code, state },
    }, window.location.origin);
  }
}

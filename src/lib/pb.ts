import PocketBase from 'pocketbase';

const AUTH_STATE_KEY = 'authState';
const REDIRECT_PATH = '/admin/redirect';

/**
 * Shared PocketBase client. Auth state is persisted automatically by PocketBase to
 * localStorage, so it survives reloads and is shared across pb instances.
 */
export const pb = new PocketBase('https://db.guymon.family');

interface AuthProviderInfo {
	name: string;
	state: string;
	codeVerifier: string;
	authUrl: string;
}

/**
 * Check if the user is currently authenticated.
 * Note: per approved-user authorization is enforced by PocketBase collection rules.
 */
export function checkAuth(): boolean {
	return pb.authStore.isValid;
}

function getAuthState(): AuthProviderInfo | null {
	const stored = localStorage.getItem(AUTH_STATE_KEY);
	if (!stored) return null;
	try {
		return JSON.parse(stored) as AuthProviderInfo;
	} catch {
		return null;
	}
}

function setAuthState(provider: AuthProviderInfo): void {
	localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(provider));
}

/**
 * Start the Google OAuth flow: fetch providers, stash the PKCE verifier, and
 * redirect to Google. The callback comes back on "/admin/redirect".
 */
export async function initOAuth(): Promise<void> {
	const authMethods = await pb.collection('users').listAuthMethods();
	const provider = authMethods.authProviders.find((p) => p.name === 'google');

	if (!provider) {
		throw new Error('Google auth provider not found');
	}

	setAuthState(provider);

	const redirectUrl = window.location.origin + REDIRECT_PATH;
	window.location.href = provider.authUrl + redirectUrl;
}

/**
 * Complete the OAuth callback: validate state, exchange the code for a token, then
 * redirect to the admin page.
 */
export async function handleCallback(): Promise<void> {
	const params = new URL(window.location.href).searchParams;
	const provider = getAuthState();

	if (!provider) {
		throw new Error('No auth state found');
	}

	if (provider.state !== params.get('state')) {
		throw new Error("State parameters don't match");
	}

	const code = params.get('code');
	if (!code) {
		throw new Error('No authorization code received');
	}

	const redirectUrl = window.location.origin + REDIRECT_PATH;
	await pb
		.collection('users')
		.authWithOAuth2Code(provider.name, code, provider.codeVerifier, redirectUrl, {
			emailVisibility: false
		});

	window.location.href = '/admin';
}

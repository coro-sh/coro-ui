/**
 * Cloudflare Pages Function (Worker) that proxies API requests to the backend.
 *
 * This middleware:
 * 1. Intercepts requests to /api/*, /auth/*, /me/*
 * 2. Proxies them to the backend
 * 3. Adds X-Worker-Secret header for backend authentication
 *
 * Environment variables (set in Cloudflare Pages dashboard):
 * - BACKEND_URL: backend URL
 * - WORKER_SECRET: Shared secret for backend authentication
 */

export async function onRequest(context) {
	const { request, env, next } = context;
	const url = new URL(request.url);

	// API routes that should be proxied to backend
	const apiPaths = ['/api', '/auth', '/me', '/healthz'];
	const isApiRoute = apiPaths.some((path) => url.pathname.startsWith(path));

	if (!isApiRoute) {
		// Not an API route, continue to static assets
		return next();
	}

	// Get backend configuration from environment variables
	const backendUrl = env.BACKEND_URL;
	const workerSecret = env.WORKER_SECRET;

	// Validate configuration
	if (!backendUrl) {
		console.error('BACKEND_URL environment variable not set');
		return new Response('Service configuration error', { status: 500 });
	}

	if (!workerSecret) {
		console.error('WORKER_SECRET environment variable not set');
		return new Response('Service configuration error', { status: 500 });
	}

	// Build backend request URL
	const backendRequestUrl = new URL(url.pathname + url.search, backendUrl);

	// Create headers for backend request
	const backendHeaders = new Headers(request.headers);

	// Add Worker authentication header
	backendHeaders.set('X-Worker-Secret', workerSecret);

	// Add proxy forwarding headers for OIDC compatibility
	// These tell the backend what the original request looked like from the client's perspective
	backendHeaders.set('X-Forwarded-Host', url.hostname);
	backendHeaders.set('X-Forwarded-Proto', url.protocol.replace(':', ''));

	// Forward original client IP if available
	const clientIp = request.headers.get('CF-Connecting-IP');
	if (clientIp) {
		backendHeaders.set('X-Forwarded-For', clientIp);
	}

	// Remove Cloudflare-specific headers that shouldn't be forwarded
	backendHeaders.delete('cf-connecting-ip');
	backendHeaders.delete('cf-ray');
	backendHeaders.delete('cf-visitor');

	// Create backend request
	const backendRequest = new Request(backendRequestUrl, {
		method: request.method,
		headers: backendHeaders,
		body: request.body,
		redirect: 'manual',
	});

	try {
		// Proxy request to backend
		const response = await fetch(backendRequest);

		// Return backend response to client
		return response;
	} catch (error) {
		console.error('Backend request failed:', error);
		return new Response('Backend service unavailable', { status: 502 });
	}
}

/**
 * Phase 8B-8 — Trusted metadata resolver contract.
 *
 * Defines the security contract for an optional trusted metadata resolver.
 * This is NOT an implementation — it's the interface and guards that any
 * future resolver implementation must satisfy.
 *
 * The trusted resolver is a separate deployment (not in-browser) that can
 * safely fetch and parse article metadata. It is DISABLED by default and
 * requires a separate deployment/security ADR before activation.
 *
 * Required security properties (from spec):
 * - HTTPS-only production access
 * - DNS/IP validation before AND after redirects
 * - DNS-rebinding resistance
 * - Private/link-local/loopback/metadata-address blocking
 * - GET/HEAD only, no caller-controlled headers
 * - No cookies or forwarded credentials
 * - Strict compressed and expanded byte limits
 * - Streaming head parsing (no full page download)
 * - No script execution
 * - Per-origin and global rate limits
 * - Typed output (never raw HTML)
 * - Content-free logs (no URLs, content, or user data logged)
 * - Operator kill switch
 *
 * This module also provides Mastodon attribution-domain editing guards
 * for capability-gated profile settings.
 */

// ─── Resolver contract ───────────────────────────────────────────────────────

/**
 * The interface a trusted metadata resolver must implement.
 * This is the contract — NOT an implementation.
 */
export interface TrustedMetadataResolver {
  /** Unique identifier for this resolver instance. */
  readonly id: string;
  /** Version of the resolver implementation. */
  readonly version: string;
  /** Whether the resolver is currently enabled (operator kill switch). */
  isEnabled(): boolean;
  /** Whether the resolver can handle a given URL. */
  canResolve(url: string): boolean;
  /**
   * Resolve metadata for a URL.
   * Returns structured metadata only (never raw HTML).
   * Throws on security violations.
   */
  resolve(request: MetadataResolveRequest): Promise<MetadataResolveResponse>;
  /** Health check. */
  getHealth(): ResolverHealthStatus;
}

export interface MetadataResolveRequest {
  /** The URL to resolve metadata for. */
  readonly url: string;
  /** Preferred language for metadata. */
  readonly language?: string;
  /** AbortSignal for cancellation. */
  readonly signal?: AbortSignal;
  /** Maximum time to wait in ms. */
  readonly timeoutMs?: number;
}

export interface MetadataResolveResponse {
  /** The canonical URL (after redirect resolution). */
  readonly canonicalUrl: string;
  /** Title of the page. */
  readonly title?: string;
  /** Description. */
  readonly description?: string;
  /** Extracted author metadata. */
  readonly authors: ReadonlyArray<ResolvedAuthorMetadata>;
  /** fediverse:creator value if present. */
  readonly fediverseCreator?: string;
  /** Open Graph type. */
  readonly ogType?: string;
  /** Publication site name. */
  readonly siteName?: string;
  /** Publication domain. */
  readonly domain: string;
  /** When this metadata was fetched. */
  readonly fetchedAt: string;
  /** Whether the page required redirect resolution. */
  readonly wasRedirected: boolean;
}

export interface ResolvedAuthorMetadata {
  readonly name: string;
  readonly url?: string;
  readonly source: 'schema-org' | 'open-graph' | 'oembed' | 'dublin-core' | 'rel-author' | 'meta-author' | 'fediverse-creator';
}

export type ResolverHealthStatus = 'healthy' | 'degraded' | 'unavailable' | 'disabled';

// ─── Destination policy (URL safety validation) ──────────────────────────────

/**
 * Validate that a URL is safe to resolve through the trusted resolver.
 * Blocks private/internal ranges, unsafe protocols, and known-bad patterns.
 */
export function isUrlSafeForResolution(url: string): UrlSafetyResult {
  try {
    const parsed = new URL(url);

    // Protocol check
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, reason: 'Only HTTP(S) URLs are resolvable.' };
    }

    // No credentials in URL
    if (parsed.username || parsed.password) {
      return { safe: false, reason: 'URLs with credentials are not resolvable.' };
    }

    // Block known metadata/cloud endpoints that return sensitive data
    const blockedHosts = [
      '169.254.169.254', // AWS metadata
      'metadata.google.internal', // GCP metadata
      'metadata.google',
      '100.100.100.200', // Alibaba metadata
    ];
    if (blockedHosts.includes(parsed.hostname)) {
      return { safe: false, reason: 'Cloud metadata endpoints are blocked.' };
    }

    // Block private/link-local/loopback
    if (isPrivateHost(parsed.hostname)) {
      return { safe: false, reason: 'Private/internal addresses are not resolvable.' };
    }

    // Block extremely long URLs (potential abuse)
    if (url.length > 4096) {
      return { safe: false, reason: 'URL exceeds maximum length.' };
    }

    return { safe: true, reason: '' };
  } catch {
    return { safe: false, reason: 'Invalid URL.' };
  }
}

export interface UrlSafetyResult {
  readonly safe: boolean;
  readonly reason: string;
}

// ─── Attribution domain validation ───────────────────────────────────────────

/**
 * Validate and normalize a domain for Mastodon attribution_domains[] settings.
 * Rejects schemes, paths, credentials, ports, and wildcards.
 */
export function normalizeAttributionDomain(input: string): string | null {
  if (!input || typeof input !== 'string') return null;

  const trimmed = input.trim().toLowerCase();
  if (trimmed.length === 0 || trimmed.length > 253) return null;

  // Reject if it looks like a full URL
  if (trimmed.includes('://') || trimmed.includes('/') || trimmed.includes(':')) {
    return null;
  }

  // Reject credentials
  if (trimmed.includes('@')) return null;

  // Reject wildcards
  if (trimmed.includes('*')) return null;

  // Must look like a valid domain
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/.test(trimmed)) {
    return null;
  }

  // No consecutive hyphens or labels starting/ending with hyphen
  const labels = trimmed.split('.');
  for (const label of labels) {
    if (label.startsWith('-') || label.endsWith('-') || label.includes('--')) {
      return null;
    }
    if (label.length > 63) return null;
  }

  return trimmed;
}

/**
 * Validate an array of attribution domains.
 * Returns only the valid ones, preserving order.
 */
export function validateAttributionDomains(domains: ReadonlyArray<string>): string[] {
  const validated: string[] = [];
  const seen = new Set<string>();

  for (const domain of domains.slice(0, 50)) { // Cap at 50 domains
    const normalized = normalizeAttributionDomain(domain);
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      validated.push(normalized);
    }
  }

  return validated;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isPrivateHost(hostname: string): boolean {
  // Loopback
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return true;
  }

  // IPv4 private ranges
  const ipv4Match = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number);
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 169 && b === 254) return true; // 169.254.0.0/16 (link-local)
    if (a === 127) return true; // 127.0.0.0/8
    if (a === 0) return true; // 0.0.0.0/8
  }

  // IPv6 link-local (fe80::)
  if (hostname.startsWith('fe80:') || hostname.startsWith('[fe80:')) {
    return true;
  }

  return false;
}

/**
 * Phase 3B — Route manifest for the F7 shell.
 *
 * Enumerates all application routes with their properties for:
 * - Deep-link verification tests
 * - Route-level access control in the F7 shell
 * - Navigation state persistence (session restoration in 3D)
 *
 * This manifest is derived from the existing SwitchingColumnsArea routes
 * and serves as the canonical route registry for the adaptive shell.
 */

export interface RouteEntry {
  /** URL path pattern (React Router style) */
  path: string;
  /** Whether this route is accessible without authentication */
  publicRoute: boolean;
  /** Whether this route requires staff privileges */
  staffOnly: boolean;
  /** Whether this route requires admin privileges */
  adminOnly: boolean;
  /** Whether this route requires developer mode */
  developerOnly: boolean;
  /** Whether this route requires a specific feature flag */
  featureGated?: string;
  /** Human-readable label for navigation */
  label?: string;
  /** Whether this route should appear in bottom/sidebar navigation */
  navigable: boolean;
}

/**
 * Core navigation routes visible in phone bottom tabs and sidebar.
 */
export const NAVIGATION_ROUTES: RouteEntry[] = [
  { path: '/', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: true, label: 'Home' },
  { path: '/search', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: true, label: 'Search' },
  { path: '/notifications', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: true, label: 'Notifications' },
  { path: '/settings', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: true, label: 'Settings' },
];

/**
 * All application routes. Matches the routes defined in SwitchingColumnsArea.
 */
export const ROUTE_MANIFEST: RouteEntry[] = [
  // Auth/public
  { path: '/authorize_interaction', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/email-confirmation', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/logout', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },

  // Home
  { path: '/', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: true, label: 'Home' },

  // Timelines
  { path: '/timeline/local', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: true, label: 'Local', featureGated: 'federating' },
  { path: '/timeline/fediverse', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: true, label: 'Explore', featureGated: 'federating' },
  { path: '/timeline/bubble', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'bubbleTimeline' },
  { path: '/timeline/:instance', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'federating' },

  // Conversations
  { path: '/conversations', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'conversations' },

  // Discovery
  { path: '/tag/:id', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/search', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: true, label: 'Search' },
  { path: '/suggestions', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'suggestions' },
  { path: '/directory', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'profileDirectory' },

  // Lists and bookmarks
  { path: '/lists', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'lists' },
  { path: '/list/:id', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'lists' },
  { path: '/bookmarks', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'bookmarks' },

  // Notifications
  { path: '/notifications', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: true, label: 'Notifications' },

  // Social
  { path: '/follow_requests', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/followed_hashtags', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/blocks', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/domain_blocks', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'federating' },
  { path: '/mutes', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/filters', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'filters' },

  // Profiles
  { path: '/@:username', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/@:username/with_replies', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/@:username/followers', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/@:username/following', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/@:username/media', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/@:username/tagged/:tag', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/@:username/favorites', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/@:username/about', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/@:username/pins', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/@:username/posts/:statusId', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },

  // Statuses
  { path: '/statuses/compose', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/statuses/:statusId', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/scheduled_statuses', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'scheduledStatuses' },

  // Settings
  { path: '/settings/profile', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/settings/export', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'exportData' },
  { path: '/settings/import', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'importData' },
  { path: '/settings/aliases', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'accountAliases' },
  { path: '/settings/migration', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'accountMoving' },
  { path: '/settings/backups', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'backups' },
  { path: '/settings/email', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/settings/password', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/settings/account', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/settings/media_display', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/settings/mfa', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/settings/tokens', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/settings', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: true, label: 'Settings' },

  // Admin
  { path: '/soapbox/config', publicRoute: false, staffOnly: false, adminOnly: true, developerOnly: false, navigable: false },
  { path: '/soapbox/admin', publicRoute: false, staffOnly: true, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/soapbox/admin/approval', publicRoute: false, staffOnly: true, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/soapbox/admin/reports', publicRoute: false, staffOnly: true, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/soapbox/admin/log', publicRoute: false, staffOnly: true, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/soapbox/admin/users', publicRoute: false, staffOnly: true, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/info', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },

  // Developer
  { path: '/developers/apps/create', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: true, navigable: false },
  { path: '/developers/settings_store', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: true, navigable: false },
  { path: '/developers/timeline', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: true, navigable: false },
  { path: '/developers', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },

  // Misc
  { path: '/share', publicRoute: false, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/donate/crypto', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false },
  { path: '/federation_restrictions', publicRoute: true, staffOnly: false, adminOnly: false, developerOnly: false, navigable: false, featureGated: 'federating' },
];

/**
 * Returns routes that should appear in the F7 sidebar navigation.
 */
export function getSidebarRoutes(): RouteEntry[] {
  return ROUTE_MANIFEST.filter(r => r.navigable);
}

/**
 * Finds a route entry matching a given path.
 */
export function findRoute(pathname: string): RouteEntry | undefined {
  // Exact match first
  const exact = ROUTE_MANIFEST.find(r => r.path === pathname);
  if (exact) return exact;

  // Pattern match (simplified — handles :param segments)
  for (const route of ROUTE_MANIFEST) {
    const pattern = route.path.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(pathname)) return route;
  }

  return undefined;
}

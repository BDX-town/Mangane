import { ROUTE_MANIFEST, NAVIGATION_ROUTES, findRoute, getSidebarRoutes } from '../route-manifest';

describe('F7 Shell Route Manifest', () => {
  it('contains all navigation routes in the full manifest', () => {
    for (const navRoute of NAVIGATION_ROUTES) {
      const found = ROUTE_MANIFEST.find(r => r.path === navRoute.path);
      expect(found).toBeDefined();
      expect(found?.navigable).toBe(true);
    }
  });

  it('has unique paths (no duplicates except overloaded routes)', () => {
    const paths = ROUTE_MANIFEST.map(r => r.path);
    const duplicates = paths.filter((p, i) => paths.indexOf(p) !== i);
    // /search appears in both navigation and full manifest — allowed
    expect(duplicates.length).toBeLessThanOrEqual(1);
  });

  it('marks at least 4 routes as navigable', () => {
    const navigable = ROUTE_MANIFEST.filter(r => r.navigable);
    expect(navigable.length).toBeGreaterThanOrEqual(4);
  });

  it('has no public admin routes', () => {
    const publicAdmin = ROUTE_MANIFEST.filter(r => r.publicRoute && (r.staffOnly || r.adminOnly));
    expect(publicAdmin).toHaveLength(0);
  });

  it('findRoute matches exact paths', () => {
    expect(findRoute('/')).toBeDefined();
    expect(findRoute('/notifications')).toBeDefined();
    expect(findRoute('/settings')).toBeDefined();
    expect(findRoute('/nonexistent')).toBeUndefined();
  });

  it('findRoute matches parameterized paths', () => {
    const profileRoute = findRoute('/@someuser');
    expect(profileRoute).toBeDefined();
    expect(profileRoute?.path).toBe('/@:username');

    const statusRoute = findRoute('/@user/posts/12345');
    expect(statusRoute).toBeDefined();
    expect(statusRoute?.path).toBe('/@:username/posts/:statusId');
  });

  it('getSidebarRoutes returns only navigable routes', () => {
    const sidebar = getSidebarRoutes();
    expect(sidebar.every(r => r.navigable)).toBe(true);
    expect(sidebar.length).toBeGreaterThanOrEqual(4);
  });

  it('all routes have valid structure', () => {
    for (const route of ROUTE_MANIFEST) {
      expect(route.path).toMatch(/^\//);
      expect(typeof route.publicRoute).toBe('boolean');
      expect(typeof route.staffOnly).toBe('boolean');
      expect(typeof route.adminOnly).toBe('boolean');
      expect(typeof route.developerOnly).toBe('boolean');
      expect(typeof route.navigable).toBe('boolean');
    }
  });
});

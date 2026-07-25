# Source-map and Build-artifact Policy

Status: **Phase 0E complete**

- Production webpack uses `devtool: false` and cleans its output directory, so source maps are neither generated nor retained from older builds.
- Development source maps remain local and must not be deployed.
- OfflinePlugin excludes `**/*.map`, reports, stats, and instance customization from precache.
- CI does not upload bundles, source maps, environment dumps, Jest output, fixtures, snapshots, or coverage.
- The sole upload is the architecture inventory: deterministic repository paths, categories, line numbers, and counts; retention is 30 days and it contains no runtime/user data.
- Build configuration accepts documented public client values only. Secrets must never be injected into frontend configuration.

The authority gate detects source-map configuration and artifact-upload drift. Any new artifact requires content classification, secret scanning, least retention, fork/secrets analysis, and deletion ownership before upload.

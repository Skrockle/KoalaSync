# Development Scripts

This directory contains utility scripts for the KoalaSync development workflow.

## build-extension.js

The primary build tool for KoalaSync. This Node.js script automates two critical tasks:

1.  **Protocol Synchronization**: Copies the "Single Source of Truth" constants (`shared/constants.js`) and the domain blacklist (`shared/blacklist.js`) from the root `/shared` directory into the `extension/shared/` directory.
2.  **Artifact Generation**: Compiles the extension into browser-specific bundles for Chrome and Firefox, located in the `dist/` directory.

### Usage

From the **repository root**, run:

```bash
node scripts/build-extension.js
```

### Why this script exists
KoalaSync uses **Vanilla JS** in the extension to maintain zero runtime dependencies and maximum privacy. Since we don't use a bundler (like Webpack or Vite) inside the extension, this script serves as our lightweight "pre-build" step to ensure that the protocol constants remain synchronized between the extension and the relay server.

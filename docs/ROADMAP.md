# KoalaSync Roadmap

This document tracks future technical plans and optimizations for the KoalaSync system.

---

## Planned Optimizations & Technical Roadmap

### 1. Split large JavaScript files (> 800 lines) into smaller modules
* **Category**: Maintainability / AI Context Optimization
* **Background**: Core files like `background.js` and `popup.js` have grown large and exceed 800 lines. This makes manual debugging harder and wastes context window space for AI models.
* **Planned solution**:
  - Structurally split logic into separate focused modules (e.g., UI Renderer, Message Router, Storage Manager, Socket Client).
  - Use ES modules for clean separation and better reusability.

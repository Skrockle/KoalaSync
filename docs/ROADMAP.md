# KoalaSync Roadmap

This document tracks planned features, improvements, and their implementation details.

---

## Offene technische Fragen

### 1. Service Worker Fallback bei Room-State Verlust
Manifest V3 suspendiert den Service Worker nach ~30s Inaktivität. `chrome.alarms` weckt ihn auf, aber:
- **Problem:** Wenn der SW neu startet, sind alle Variablen (`currentRoom`, `socket`, `isNamespaceJoined`) weg
- **Aktueller Stand:** `chrome.storage.session` persistiert `currentRoom`, `peerId`, `eventQueue` — der SW stellt diese beim Start wieder her (`ensureState()`)
- **Gelöst:** WebSocket wird automatisch via `connect()` neu aufgebaut. Events werden während Reconnect gequeued und nach Namespace-Join geflushed. "Reconnecting..." Status wird im Popup + Badge angezeigt. KeepAlive-Alarm auf 30s reduziert. Reconnect-Backoff: 500ms Basis, max 5s (statt vorher 1s→30s).

### 7. Tests für Extensions
Stimmt, sind aufwändig. Praktische Ansätze:
- **Unit Tests:** `jest` + `jest-chrome` (mockt `chrome.*` APIs) — testet `popup.js` Logik, Server-Logik
- **Integration Tests:** `puppeteer` mit `--load-extension` Flag — testet Extension im echten Browser
- **Server Tests:** `supertest` + `socket.io-client` — testet WebSocket-Flows
- **Aufwand:** ~400-600 LOC für sinnvolle Testabdeckung der Kernlogik

---

## Zukünftige Features

Neue Features werden nur nach expliziter Freigabe hinzugefügt.

# KoalaSync

<div align="center">
  <img src="assets/SOCIAL_PREVIEW.png" alt="KoalaSync Banner" width="800">

  <p align="center">
    <b>Privacy-First, Zero-Dependency Synchronized Video Playback for Modern Browsers.</b>
  </p>

  <p align="center">
    <a href="https://github.com/Shik3i/KoalaSync/actions/workflows/release.yml"><img src="https://github.com/Shik3i/KoalaSync/actions/workflows/release.yml/badge.svg" alt="Release Status"></a>
    <a href="https://github.com/Shik3i/KoalaSync/releases"><img src="https://img.shields.io/github/v/release/Shik3i/KoalaSync" alt="GitHub release"></a>
    <a href="LICENSE"><img src="https://img.shields.io/github/license/Shik3i/KoalaSync?color=blue" alt="License"></a>
    <br>
    <img src="https://img.shields.io/badge/Extension_Deps-0-success" alt="Zero Dependencies">
    <img src="https://img.shields.io/badge/Privacy-Focused-indigo" alt="Privacy Focused">
    <img src="https://img.shields.io/badge/Manifest-V3-orange" alt="Manifest V3">
    <img src="https://img.shields.io/badge/Cross--Browser-Chrome%20|%20Firefox-blueviolet" alt="Cross Browser">
  </p>
</div>

---

KoalaSync is a premium, lightweight Browser Extension and Relay Server for synchronized video playback across any website—YouTube, Twitch, Netflix, and custom HTML5 players. Built with a focus on **Data Sovereignty** and **Extreme Performance**.

### 🌟 Why KoalaSync?

*   **🛡️ Privacy First**: Zero external requests. No Google Fonts, no CDNs, and absolutely no telemetry or data collection.
*   **⚡ Zero-Latency**: Native implementation of the Socket.IO v4 wire protocol for frame-perfect synchronization.
*   **📦 Zero Dependencies**: The extension is built with pure Vanilla JS. No heavy frameworks or third-party libraries.
*   **🏠 Self-Hostable**: Own your data. Deploy your own relay server in seconds using Docker.

---

### ✨ Key Features

- **Global Synchronization**: Synchronize Play, Pause, and Seeking on any website with a `<video>` tag.
- **Episode Auto-Sync**: Perfectly sync series binges. All peers wait until everyone has loaded the next episode before starting together.
- **Smart Matching**: Automatically highlights tabs containing matching video titles.
- **Dual Heartbeat Architecture**: Robust session tracking that prevents ghost rooms and stale connections.
- **Zero-Latency Relay**: Custom wire protocol implementation for maximum performance.
- **Seamless Invitations**: Smart links that automatically configure server and room credentials for your friends.

---

### 📂 Repository Structure

- `extension/`: Chrome & Firefox Extension (Manifest V3, Vanilla JS).
- `server/`: Node.js + Socket.IO Relay Server (Containerized).
- `website/`: Marketing landing page & Invitation Bridge.
- `shared/`: **Single Source of Truth** for protocol constants.
- `scripts/`: Automated build and synchronization utilities.
- `docs/`: Technical deep-dives ([Architecture](docs/ARCHITECTURE.md), [Sync Guide](docs/SYNC_GUIDE.md)).

---

### 🚀 Quick Start

#### For Users (Installation)
The easiest way to install KoalaSync is to download the pre-compiled version from the [Releases](https://github.com/Shik3i/KoalaSync/releases) page.
1. Download the latest `koalasync-chrome.zip` or `koalasync-firefox.zip`.
2. Extract the file and load it as an "Unpacked Extension" in your browser's Developer Mode.

#### For Developers (Building)
To build the extension from source and synchronize protocol constants:
```bash
npm install
node scripts/build-extension.js
```
The compiled artifacts will be available in the `dist/` directory.

#### For Self-Hosting (Docker)
Deploy your own private relay server:
```bash
docker-compose up -d --build
```
The server will be available at `ws://localhost:3000`.

---

### 📖 Documentation & Links

- **[PRIVACY.md](PRIVACY.md)**: Our commitment to your data sovereignty.
- **[CONTRIBUTING.md](CONTRIBUTING.md)**: How to help make KoalaSync better.
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: Deep-dive into the two-phase sync and heartbeat logic.
- **[SECURITY.md](SECURITY.md)**: Disclosure policy and security practices.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Shik3i">Shik3i</a>. KoalaSync is Open Source under the <a href="LICENSE">MIT License</a>.</sub>
</div>

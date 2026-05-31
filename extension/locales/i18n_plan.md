# KoalaSync Browser Extension v2.0 - i18n Technical Implementation Plan

Welcome, future Antigravity AI agent! This document is placed directly in the codebase at `/extension/locales/i18n_plan.md` to serve as a comprehensive architectural handbook for the next steps in adding **full internationalization (i18n) support to the browser extension itself** while maintaining 100% video-sync and background communication safety.

---

## 🔍 Context & Audited Scope

KoalaSync is a lightweight, premium browser extension (Chrome & Firefox Manifest V3) for synchronized video playback. The landing pages are already compiled dynamically in 6 languages:
*   English (`en`)
*   German (`de`)
*   French (`fr`)
*   Spanish (`es`)
*   Portuguese (Brazil) (`pt-BR`)
*   Russian (`ru`)

Our goal is to build an identical, premium translation engine for the extension itself.

---

## 🏛️ Architectural Choice: Custom JSON Dictionary Engine (Approach B)

We evaluated two paths:
1.  **Approach A (Native `chrome.i18n` API):** Uses `_locales/` directory. Too rigid—cannot support real-time dynamic switching inside the extension Settings dropdown without closing/re-opening the popup.
2.  **Approach B (Custom Unified JSON Engine):** Uses flat JSON files matching our website files (`"KEY": "Value"`). Dynamically merges the target dictionary with baseline English `en.json` at runtime, programmatically providing an **airtight English fallback** and **real-time DOM translations** without popup reload.

We chose **Approach B** for maximum compatibility, premium real-time toggling, and clean fallback safety.

---

## 🔄 Resolve, Load, & State Flow

1.  **On launch:** Look for saved language in `chrome.storage.sync.get('locale')`.
2.  **Fallback Autodetect:** If no saved language, read `navigator.language` or `chrome.i18n.getUILanguage()`.
    *   If the detected locale is supported, set as active.
    *   If not supported, default to English (`en`).
3.  **Dictionary Resolution:**
    *   Asynchronously load the English baseline dictionary (`/extension/locales/en.json`).
    *   If the target language is different, load target JSON (e.g. `/extension/locales/de.json`) and execute `Object.assign({}, enDict, targetDict)`. This guarantees dynamic translation while cleanly falling back to English for any missing keys.
4.  **DOM Replacements:** Scan for `data-i18n`, `data-i18n-title`, and `data-i18n-placeholder` attributes, and translate them on the fly.
5.  **Persistence:** Save dynamic selection modifications from the dropdown into `chrome.storage.sync`. Trigger instant DOM re-translation on change.

---

## 📂 Proposed File Structure

```
KoalaPlay/
└── extension/
    ├── locales/                # [NEW] Contains flat translation maps
    │   ├── i18n_plan.md        # This roadmap file
    │   ├── en.json             # Flat English baseline keys
    │   ├── de.json             # German keys
    │   ├── fr.json             # French keys
    │   ├── es.json             # Spanish keys
    │   ├── pt-BR.json          # Portuguese (Brasil) keys
    │   └── ru.json             # Russian keys
    ├── i18n.js                 # [NEW] ESM translation engine module
    ├── popup.html              # Modified with data-i18n attributes
    ├── popup.js                # Modified to initialize locales and update variables
    └── background.js           # Modified to push localized notification alerts
```

---

## 🛠️ Draft Code Snippets

### 1. `i18n.js` (Zero-Dependency Engine Module)
```javascript
// extension/i18n.js
export const SUPPORTED_LANGUAGES = ['en', 'de', 'fr', 'es', 'pt-BR', 'ru'];
export const DEFAULT_LANGUAGE = 'en';

let activeDictionary = {};

export async function loadLocale(langCode) {
    const resolvedLang = SUPPORTED_LANGUAGES.includes(langCode) ? langCode : DEFAULT_LANGUAGE;
    try {
        const enResponse = await fetch(chrome.runtime.getURL(`locales/${DEFAULT_LANGUAGE}.json`));
        const enDict = await enResponse.json();
        
        if (resolvedLang === DEFAULT_LANGUAGE) {
            activeDictionary = enDict;
            return;
        }

        const targetResponse = await fetch(chrome.runtime.getURL(`locales/${resolvedLang}.json`));
        const targetDict = await targetResponse.json();
        
        activeDictionary = Object.assign({}, enDict, targetDict);
    } catch (err) {
        console.error('[i18n] Failed to load dictionary. Falling back to English:', err);
        const rescue = await fetch(chrome.runtime.getURL(`locales/${DEFAULT_LANGUAGE}.json`));
        activeDictionary = await rescue.json();
    }
}

export function getMessage(key) {
    return activeDictionary[key] || key;
}

export function translateDOM() {
    // Translate text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = getMessage(key);
        const img = el.querySelector('img');
        if (img) {
            el.innerHTML = '';
            el.appendChild(img);
            el.appendChild(document.createTextNode(' ' + translated));
        } else {
            el.textContent = translated;
        }
    });

    // Translate tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.setAttribute('title', getMessage(key));
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', getMessage(key));
    });
}
```

### 2. Markup Changes (`popup.html`)
*   Annotate text elements: `<button class="tab-btn" data-tab="tab-settings" data-i18n="TAB_SETTINGS" data-i18n-title="TAB_SETTINGS_TOOLTIP">Settings</button>`
*   Add Language Dropdown in the Settings Panel:
    ```html
    <div class="form-group" style="display: flex; align-items: center; justify-content: space-between; background: var(--card); padding: 10px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #334155;">
        <label style="margin-bottom: 0;" data-i18n="LABEL_LANGUAGE" title="Choose your preferred extension language">App Language</label>
        <select id="langSelector" style="width: 150px; padding: 6px 10px; font-size: 13px; cursor: pointer;">
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="pt-BR">Português (Brasil)</option>
            <option value="ru">Русский</option>
        </select>
    </div>
    ```

### 3. Dynamic Script Wiring (`popup.js`)
*   Import our engine: `import { loadLocale, translateDOM, getMessage } from './i18n.js';`
*   Initialize during startup:
    ```javascript
    async function init() {
        const data = await chrome.storage.sync.get(['locale', ...]);
        let activeLang = data.locale;
        if (!activeLang) {
            const systemLang = (navigator.language || chrome.i18n.getUILanguage()).split('-')[0];
            activeLang = ['en', 'de', 'fr', 'es', 'pt', 'ru'].includes(systemLang) ? (systemLang === 'pt' ? 'pt-BR' : systemLang) : 'en';
            chrome.storage.sync.set({ locale: activeLang });
        }
        await loadLocale(activeLang);
        translateDOM();
        
        // Select matching option in selector
        const langSelector = document.getElementById('langSelector');
        if (langSelector) langSelector.value = activeLang;
        
        // rest of standard init...
    }
    ```
*   Listen to Settings change event:
    ```javascript
    const langSelector = document.getElementById('langSelector');
    if (langSelector) {
        langSelector.addEventListener('change', async () => {
            const selectedLang = langSelector.value;
            await chrome.storage.sync.set({ locale: selectedLang });
            await loadLocale(selectedLang);
            translateDOM();
            // Re-render empty elements and tab list using new dynamic strings
            refreshLogs();
            refreshHistory();
            populateTabs();
        });
    }
    ```

### 4. Background Notifications (`background.js`)
*   Notifications inside `showNotification` should fetch dynamic keys based on `chrome.storage.sync` language settings and build clean alerts dynamically using `chrome.storage.sync.get('locale')`.
*   Ensure that WebSocket event transmissions and video player scripts in `content.js` remain **completely untouched and unaware** of the localization engine.

---

## 🔒 Safety Guardrail

*   **WebSocket Engine Integrity:** Under no circumstances should `background.js` Socket.IO handshakes, rate limits, or binary protocol headers be adjusted. i18n is strictly an interface rendering skin layer.
*   **Player Control Pipeline Integrity:** `content.js` expectedEvent suppression tables, HLS buffer calculations, and Media Session API listeners must remain untouched. Do not bind any i18n logic into the content script's active tracking loop.

---

## 🧪 Verification Tasks

1.  **Autodetection Audit:** Force-load the extension in Chrome/Firefox in a non-English language container and ensure it starts in that language or English gracefully.
2.  **Integrity Validation Script:** Write a sanity node checker script `/scripts/test-locales.js` to ensure all key structures are uniform across all JSON files.
3.  **Real-Time Refresh Verification:** Change dynamic drop-down preferences and verify that every element and alert swaps languages cleanly with zero redraw glitches or page crashes.

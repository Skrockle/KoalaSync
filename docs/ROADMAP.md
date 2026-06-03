# KoalaSync Roadmap

Dieses Dokument erfasst zukünftige technische Pläne und Optimierungen für das KoalaSync-System.

---

## Geplante Optimierungen & Technische Roadmap

### 1. Behebung des synchronen Sortierungs-Flaschenhalses bei Auth-Failure LRU-Eviction
* **Kategorie**: Performance / DoS-Prävention
* **Hintergrund**: Der Server schützt Räume vor Brute-Force-Angriffen durch die Nachverfolgung fehlerhafter Anmeldeversuche (`failedAuthAttempts` Map). Bei Erreichen des Limits von 50.000 Einträgen wird ein Bereinigungsverfahren gestartet, das die gesamte Map in ein Array konvertiert und dieses per `Array.from().sort()` sortiert.
* **Problem**: Dies blockiert den Node.js-Main-Thread für mehrere Millisekunden und stellt einen potenziellen Denial-of-Service-Vektor (DoS) dar, wenn ein Angreifer gezielt Fehlversuche spamt.
* **Geplante Lösung**: 
  - Umstellung auf eine echte, $O(1)$-basierte LRU-Cache-Datenstruktur (z. B. doppelt verkettete Liste in Kombination mit einer Map).
  - Alternativ: Ein vereinfachtes zeitbasiertes Ablauf-Verfahren oder ein schrittweises Löschen von Segmenten (Chunk-Eviction), um Blockaden des Main-Threads vollständig auszuschließen.

### 2. Aufteilung großer JavaScript-Dateien (> 800 Zeilen) in kleinere Module
* **Kategorie**: Wartbarkeit / AI-Kontext-Optimierung
* **Hintergrund**: Einige Kern-Dateien wie `background.js` und `popup.js` sind stark angewachsen und überschreiten 800 Zeilen. Dies erschwert das manuelle Debugging und verbraucht unnötig viel Kontextfenster bei AI-Modellen.
* **Geplante Lösung**: 
  - Strukturierte Aufteilung der Logik in separate, fokussierte Module (z. B. UI-Renderer, Message-Router, Storage-Manager, Socket-Client).
  - Nutzung von ES-Modulen zur sauberen Strukturierung und besseren Wiederverwendbarkeit.

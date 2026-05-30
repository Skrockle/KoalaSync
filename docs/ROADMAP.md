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

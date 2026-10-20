# Me-App

Meine persönliche Web-App (PWA) mit mehreren Modulen, gehostet über GitHub Pages.

| Modul | Ordner | Status |
|---|---|---|
| Training (Satzbuch) | `satzbuch/` | in Benutzung |
| Rezepte | – | in Planung |

## Was liegt wo?

| Was | Wo | Wer sieht es |
|---|---|---|
| App (dieser Ordner: HTML, Bilder, Icons) | GitHub-Repository → GitHub Pages | öffentlich, enthält **keine** persönlichen Daten |
| Daten (Trainings usw.) | im Browser des jeweiligen Geräts (IndexedDB) | nur das Gerät |
| Abgleich iPhone ↔ Laptop | Ordner `MeApp/` in der eigenen Nextcloud, eine JSON-Datei pro Modul | nur ich |
| Nextcloud-Zugangsdaten | nur im Browser des jeweiligen Geräts | nur das Gerät |

## Dateien

- `index.html` – Startseite mit Kacheln und Nextcloud-Verbindung
- `satzbuch/index.html` – Trainings-Modul (Vanilla JS, keine Bibliotheken)
- `satzbuch/img/` – Übungsbilder aus [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (gemeinfrei)
- `sw.js` – Service Worker: speichert die App auf dem Gerät, damit sie offline startet
- `manifest.webmanifest`, `icons/` – damit sie sich wie eine App auf den Homescreen legen lässt
- Schriften: Barlow / Barlow Condensed über Google Fonts

## Nextcloud-Sync einrichten (einmalig)

1. Nextcloud-App **WebAppPassword** installieren.
2. Verwaltungseinstellungen → WebAppPassword → **Allowed origins**: `https://<benutzername>.github.io`
3. Nextcloud → Persönliche Einstellungen → Sicherheit → neues App-Passwort.
4. In der Me-App auf der Startseite unter „Nextcloud“ eintragen → „Speichern und testen“.

## Installieren (iPhone)

Startseite in **Safari** öffnen → Teilen → **Zum Home-Bildschirm**. Danach immer über das Icon starten.

## Updates

Geänderte Dateien in das Repository hochladen. Die App lädt die neue Version im Hintergrund und zeigt sie beim **nächsten** Öffnen an.

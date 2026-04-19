# Changelog

All notable changes to Daybar are documented here.

---

## [1.1.2] — 2026-04-19

### Fixed
- Download link on daybar.app now always serves the correct version (was incorrectly returning v1.1.0 due to a GitHub token scope mismatch)
- macOS DMG artifacts are no longer wiped when building the Windows installer in the same pipeline
- `roundedCorners` BrowserWindow option now correctly guarded to macOS only — prevents crash on Windows

### Changed
- Windows build pipeline now pushes `latest.yml` for auto-updater support
- Website restructured: Netlify publish root changed to `site/` subfolder for cleaner repo layout

### Added
- In-app analytics via PostHog — anonymous install-level events: app launch, Pro activation, trial start, calendar connections, caffeinate, Pomodoro, widget, shortcuts, tray style, and launch-at-login

---

## [1.1.1] — 2026-04-18

### Added
- **Windows Beta** — first Windows build (NSIS x64 installer)
- Platform guards for all macOS-only features: iCloud Calendar, mouse jiggle, Accessibility client check
- Windows taskbar edge detection — popover positions correctly above bottom/left/right taskbars
- Windows tray icon — PNG fallback with dark-mode swap via `nativeTheme`
- `daybar://` deep-link protocol registered cross-platform
- Font stack updated to include `system-ui` (resolves to Segoe UI on Windows)

---

## [1.1.0] — 2026-04-10

### Added
- **Duration chips in quick-add** — 30m / 1h / 2h / 3h / All Day selector when creating Google Calendar events
- **Google Calendar account picker in quick-add** — per-account pills let you choose which account receives the new event
- **Default Google Calendar account setting** — "Default for new events" card in Settings → Accounts when 2+ accounts are connected
- Microsoft identity verification on sign-in

### Fixed
- Google Calendar event creation: timezone handling, immediate re-fetch after create, better error surfacing
- Missing event dots on today's calendar cell
- Activate page button overflow (box-sizing fix)

### Changed
- UX polish: contextual empty state messages, toast feedback on actions, inline delete confirmation, Pro lock icons on gated features, trial countdown banner, NLP quick-add hints, world clock scrubber discoverability improvements

---

## [1.0.0] — 2026-03-31

### Initial public release

**Calendar integrations**
- Google Calendar — multi-account, read + write-back, PKCE-protected OAuth, encrypted token storage
- Microsoft / Outlook Calendar — Azure-registered OAuth, multi-account
- Apple Calendar & Reminders — native JXA bridge, no account required

**UI**
- macOS menu bar app (300 × 440 px) with popover-style popup
- Month calendar view, week view, event list, Pomodoro timer, world clocks
- Widget mode (always-on-top transparent overlay)
- 4 built-in themes: Auto, Light, Dark, AI Dark — Pro unlocks 5 more
- Quick-add event form with natural-language parsing

**Settings**
- Sidebar-based settings window with Accounts, Appearance, General, Notifications, and Support panels
- Calendar visibility toggles per account
- Custom keyboard shortcut registration

**Licensing**
- Lemon Squeezy Pro license ($14.99 one-time)
- 7-day free trial — no account required
- Deep-link activation (`daybar://activate?key=...`)
- 7-day money-back refund policy

**Security**
- `contextIsolation: true`, `nodeIntegration: false` on all windows
- `shell:open` URL scheme allowlist (https, http, mailto only)
- DevTools blocked in production builds
- Accelerator/action allowlist for global shortcuts
- JXA input sanitized before script interpolation
- safeStorage (OS Keychain) for all OAuth tokens

**Distribution**
- Hardened Runtime + notarization
- Auto-updater via GitHub Releases (`electron-updater`)
- arm64 DMG

---

## [0.2.0-beta] — 2026-03-01

- Microsoft Calendar + Apple Calendar integrations added
- Redesigned settings with sidebar navigation
- Hard meeting alerts and daily agenda notifications
- Theme system expanded (Auto / Light / Dark / AI Dark)
- Multi-account Google Calendar support

---

## [0.1.0-beta] — 2026-02-01

- Initial beta release
- Google Calendar sync (single account)
- Pomodoro timer, world clocks
- Basic Pro license system

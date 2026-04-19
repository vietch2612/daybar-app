# Daybar Privacy Policy

**Last updated: April 8, 2026**

## 1. Overview

Daybar ("the app", "we") is a macOS menu bar application for calendar and task management. This policy explains what data the app accesses, how it is stored, and what is transmitted to third parties.

**Short version:** Daybar stores everything on your device. No personal data is sent to Daybar servers. Calendar events, reminders, and account credentials never leave your Mac.

---

## 2. Data the App Accesses

### 2.1 Google Calendar
When you connect a Google account, Daybar:
- Requests OAuth 2.0 access to your Google Calendar (`https://www.googleapis.com/auth/calendar`) to read and optionally create/update/delete events.
- Stores your OAuth access and refresh tokens **encrypted** on your device using macOS Keychain (via Electron `safeStorage`), at `~/Library/Application Support/Daybar/`.
- Stores your Google account email address **encrypted** on your device.
- Caches fetched calendar events **encrypted** locally to improve performance. The cache is pruned automatically after 3 months.
- Never transmits calendar events to any Daybar server.

### 2.2 Microsoft / Outlook Calendar
When you connect a Microsoft account, Daybar:
- Requests OAuth 2.0 access to your Microsoft calendars (`Calendars.Read User.Read offline_access`) to read events and your profile name/email.
- Stores your OAuth tokens **encrypted** on your device using macOS Keychain.
- Stores your Microsoft account email and display name **encrypted** on your device.
- Caches fetched calendar events **encrypted** locally. The cache is pruned automatically after 3 months.
- Never transmits calendar events to any Daybar server.

### 2.3 Apple Calendar & Reminders
When you enable Apple Calendar support, Daybar:
- Uses macOS Automation (Apple Events / JXA via `osascript`) to read calendar events and reminders directly from the Calendar.app and Reminders.app on your device.
- Reads event fields: title, start/end time, location, notes/description, UID, all-day flag, and calendar name.
- Reads reminder fields: name, due date, body text, and list name.
- **All data is processed in-memory only and is never cached to disk or transmitted anywhere.**
- macOS will prompt you to grant Calendar and Reminders access the first time this feature is enabled. You can revoke this permission at any time in **System Settings → Privacy & Security → Automation**.

### 2.4 Stay Active Everywhere (Mouse Jiggle)
When you enable the "Stay Active Everywhere" feature, Daybar:
- Uses macOS Automation (`osascript`) to move your mouse cursor ±1 pixel every 60 seconds, preventing Slack, Zoom, and Teams from showing you as Away.
- No cursor position data is stored or transmitted.
- macOS will prompt you to grant Accessibility permission for this feature. You can revoke it at any time in **System Settings → Privacy & Security → Accessibility**.

---

## 3. License and Payment Data

Daybar uses **LemonSqueezy** as its payment and license management provider.

- When you activate a license key, Daybar sends your license key and a locally-generated instance name to `https://api.lemonsqueezy.com/v1/licenses/activate` to register the activation.
- Your license key and instance ID are stored **encrypted** on your device using macOS Keychain. They are never stored in plain text.
- License validation requests are sent periodically to LemonSqueezy to confirm your license remains valid.
- If you request a refund, your license key is sent to a serverless function hosted on Netlify (`https://daybar.app/.netlify/functions/refund-license`) which processes the refund via the LemonSqueezy API. No other personal data is included in this request.
- Payment and billing information is handled entirely by LemonSqueezy. Daybar never sees or stores payment card details. LemonSqueezy's privacy policy applies: https://www.lemonsqueezy.com/privacy

---

## 4. Local Storage

Daybar stores the following data locally on your device:

| Data | Location | Encrypted? |
|---|---|---|
| Google OAuth tokens | `~/Library/Application Support/Daybar/gcal-tokens-*.bin` | Yes (macOS Keychain) |
| Google account list | `~/Library/Application Support/Daybar/gcal-accounts.json` | Yes (macOS Keychain) |
| Google Calendar event cache | `~/Library/Application Support/Daybar/gcal-events-cache.json` | Yes (macOS Keychain) |
| Microsoft OAuth tokens | `~/Library/Application Support/Daybar/mscal-tokens-*.bin` | Yes (macOS Keychain) |
| Microsoft account list | `~/Library/Application Support/Daybar/mscal-accounts.json` | Yes (macOS Keychain) |
| Microsoft Calendar event cache | `~/Library/Application Support/Daybar/mscal-events-cache.json` | Yes (macOS Keychain) |
| License data (key + instance ID) | `~/Library/Application Support/Daybar/license-data.json` | Yes (macOS Keychain) |
| Trial start timestamp | `~/Library/Application Support/Daybar/.trial` | No (plain text timestamp) |
| UI preferences (theme, tray style, settings) | Browser localStorage | No (non-sensitive) |

All encrypted files use Electron's `safeStorage` API, which integrates with the macOS Keychain. The encrypted data is machine- and user-specific and cannot be decrypted on another machine.

---

## 5. Third-Party Services

Daybar communicates with the following external services:

| Service | Purpose | Data Sent | Privacy Policy |
|---|---|---|---|
| Google Calendar API (`googleapis.com`) | Fetch/create calendar events | OAuth tokens, calendar read/write requests | https://policies.google.com/privacy |
| Microsoft Graph API (`graph.microsoft.com`) | Fetch calendar events | OAuth tokens, calendar read requests | https://privacy.microsoft.com |
| LemonSqueezy License API (`api.lemonsqueezy.com`) | License activation and validation | License key, instance ID, product ID | https://www.lemonsqueezy.com/privacy |
| Daybar Netlify Function (`daybar.app`) | Refund processing | License key, product ID | (Operated by Daybar) |
| GitHub Releases (`github.com`) | Auto-update checks | App version, OS version | https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement |

**Daybar does not use analytics, crash reporting, or advertising SDKs of any kind.**

---

## 6. Data Retention and Deletion

- **Account disconnection:** When you disconnect a Google or Microsoft account, all OAuth tokens and cached events for that account are immediately deleted from your device.
- **App uninstall:** Uninstalling Daybar does not automatically delete data in `~/Library/Application Support/Daybar/`. To fully remove all data, delete this folder manually after uninstalling.
- **Calendar event cache:** Cached events older than 3 months are pruned automatically.
- **Trial data:** The trial start timestamp in `.trial` is a plain integer and contains no personal data.

---

## 7. Your Rights (GDPR / CCPA)

If you are located in the European Union, California, or other jurisdictions with data protection laws, you have the right to:

- **Access** the data stored by the app (it is all on your device, in the paths listed above).
- **Delete** your data by disconnecting accounts and/or deleting `~/Library/Application Support/Daybar/`.
- **Portability** is not applicable — the app reads data from services you control (Google, Microsoft, Apple) and does not generate independent personal data.

For questions about data stored by LemonSqueezy (purchase records, email address used at checkout), contact LemonSqueezy directly.

---

## 8. Children

Daybar is not directed at children under 13. We do not knowingly collect personal data from children.

---

## 9. Changes to This Policy

We may update this policy as the app adds new features. The "Last updated" date at the top of this document will reflect any changes. Continued use of the app after changes constitutes acceptance of the updated policy.

---

## 10. Contact

For privacy questions: **support@daybar.app**

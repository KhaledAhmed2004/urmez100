# Screen 06: Profile (Mobile)

> **Section**: App APIs (User-Facing)
> **Base URL**: `{{baseUrl}}` = see [system-concepts.md](../system-concepts.md#base-url--environment)
> **Response format**: see [Standard Response Envelope](../system-concepts.md#standard-response-envelope)
> **Roles**: see [system-concepts.md → User Roles](../system-concepts.md#user-roles)
> **Related screens**: Auth (Login/Logout flow) — profile depends on active session and redirects on auth failure
> **Doc version**: `v1` — last reviewed `2026-05-01`

---

## Open Questions

These items affect session handling, subscription correctness, and legal content consistency.

- **Q1 `[NEEDS INFO]`** — Subscription sync source of truth during In-App Purchase (IAP): should the client trust local purchase success and refresh later, or must it always wait for server verification via `GET /subscriptions/me` before updating UI state? This impacts perceived upgrade success and retry UX. **`[ANS: ]`**

- **Q2 `[NEEDS INFO]`** — Legal pages behavior: should `GET /legal` be cached on device (offline-first read) or always fetched fresh on every profile open? This impacts offline UX and loading performance. **`[ANS: ]`**

---

## Screen Overview

- **Purpose**: Let the user view and update their profile, manage subscription status, access legal documents, and securely log out.
- **Primary user(s)**: `USER` (authenticated end user)
- **Entry points**: Bottom navigation → Profile tab; forced redirect after `401 Unauthorized`
- **Exit / next screens**: Login screen (on logout or auth failure)
- **Success criteria**: User can view profile data, update it, manage subscription, and safely logout without stale session state
- **Key constraints**: Must handle token expiry gracefully and prevent partial profile update inconsistency

---

## Common UI Rules

- **Submit protection**: disable button + show loader during request to prevent duplicate updates
- **Offline handling**: block mutations; show inline message *"You're offline. Check connection and try again."*
- **5xx errors**: toast *"Something went wrong. Please try again."*
- **Validation (`422`)**: field-level inline errors only; no generic toast
- **Unauthorized (`401`)**: clear session and redirect to Login
- **Forbidden (`403`)**: show modal explaining access restriction
- **Not found (`404`)**: show empty state (not crash)
- **Conflict (`409`)**: show inline recovery message (rare in profile context)
- **Rate limit (`429`)**: use `Retry-After` (server wait time header) and show countdown UI

---

## UX Flow

### Load Profile Screen
1. User taps **Profile** tab from bottom navigation.
2. App triggers parallel requests:
   - `[GET /users/profile](../modules/user.md#61-get-profile)`
   - `[GET /subscriptions/me](../modules/subscription.md#63-get-my-subscription)`
3. UI renders:
   - Name, email, UID, hospital, specialty, profile image
   - Subscription status badge (FREE / PREMIUM / ACTIVE)

> **WHY parallel loading?** Reduces perceived wait time by fetching independent data streams together. Prevents sequential blocking where profile waits on subscription API.

---

### Edit Profile Flow
1. User taps **Edit Profile**
2. Form opens with pre-filled values from profile cache
3. User updates fields (name, hospital, specialty, image)
4. Submit triggers:
   - `[PATCH /users/profile](../modules/user.md#62-update-profile)`
5. On success:
   - Update local UI state
   - Re-render profile header immediately

> **WHY partial update allowed?** PATCH (partial update) avoids forcing user to resend unchanged fields, reducing payload size and conflict risk.

---

### Subscription Flow
1. User opens **My Subscription** section
2. System shows current plan from:
   - `[GET /subscriptions/me](../modules/subscription.md#63-get-my-subscription)`
3. If plan = `FREE`:
   - Show **Upgrade to Premium** CTA
4. On upgrade:
   - Trigger In-App Purchase (external system flow)
   - Sync result back via subscription refresh

---

### Legal Pages Flow
1. User opens **Terms / Privacy**
2. Load list:
   - `[GET /legal](../modules/legal.md#64-list-legal-pages)`
3. User selects a page (slug-based navigation)
4. Fetch content:
   - `[GET /legal/:slug](../modules/legal.md#65-get-legal-page-by-slug)`
5. Render HTML/Markdown content safely in viewer

---

### Logout Flow
1. User taps **Logout**
2. Confirmation modal appears
3. On confirm:
   - `[POST /auth/logout](../modules/auth.md#17-logout)`
4. Clear local session
5. Redirect to Login screen

> **WHY server logout call?** Ensures refresh token invalidation server-side so stolen tokens cannot be reused. Prevents session replay risk.

---

## Storage & Session

| Token | Storage | Lifetime | Cleared when |
| --- | --- | --- | --- |
| Access token | Memory (or SecureStorage if persisted) | ~15 min (confirm) | Logout / expiry / refresh failure |
| Refresh token | SecureStorage (hardware-backed key vault: OS-level encrypted storage like Keychain / Android Keystore) | ~30 days (confirm) | Logout / token rotation failure |

> **WHY SecureStorage?** It stores secrets inside hardware-protected OS vaults. Even if device storage is compromised, tokens cannot be directly extracted.

---

## Validation Rules

| Field | Rule | Inline error |
| --- | --- | --- |
| `name` | min 2 chars, max 100 | "Name must be at least 2 characters" |
| `hospital` | max 150 chars | "Hospital name is too long" |
| `specialty` | max 100 chars | "Specialty is too long" |
| `phone` | valid international format | "Enter a valid phone number" |
| `profilePicture` | JPEG/PNG, max 5MB | "Image must be JPG or PNG under 5MB" |

---

## Edge Cases

### Unauthorized Session Expiry
- **Trigger**: `401 Unauthorized` on any API
- **UI response**: immediate logout + redirect
- **Message**: *"Session expired. Please log in again."*
- **Action**: clear storage + navigate to Login

### Empty Legal Pages
- **Trigger**: `GET /legal` returns empty array
- **UI response**: empty state screen
- **Message**: *"No legal documents available."*
- **Action**: none

### Subscription Sync Delay
- **Trigger**: IAP success but backend not updated yet
- **UI response**: show “pending verification” badge
- **Action**: retry subscription fetch

---

## UX Audit

**Critical**
- Profile + Subscription parallel fetch has no retry coordination  
  **Why**: one request can succeed while the other fails, causing partial UI state  
  **Fix**: introduce lightweight retry for subscription fetch with fallback skeleton state

**Minor**
- No loading skeleton defined for profile header  
  **Fix**: add skeleton UI to avoid layout shift (prevents visual jitter on load)

---

## Endpoints Used

| # | Method | Endpoint | Module Spec | Used in flow |
| --- | --- | --- | --- | --- |
| 1 | GET | `/users/profile` | [User #6.1](../modules/user.md#61-get-profile) | Load Profile |
| 2 | PATCH | `/users/profile` | [User #6.2](../modules/user.md#62-update-profile) | Edit Profile |
| 3 | GET | `/subscriptions/me` | [Subscription #6.3](../modules/subscription.md#63-get-my-subscription) | Subscription view |
| 4 | GET | `/legal` | [Legal #6.4](../modules/legal.md#64-list-legal-pages) | Legal list |
| 5 | GET | `/legal/:slug` | [Legal #6.5](../modules/legal.md#65-get-legal-page-by-slug) | Legal detail |
| 6 | POST | `/auth/logout` | [Auth #1.7](../modules/auth.md#17-logout) | Logout flow |
# Screen 9: Series Player (Mobile)

> **Section**: App APIs (User-Facing)  
> **Base URL**: `{{baseUrl}}` = see [system-concepts.md](../system-concepts.md#base-url--environment)  
> **Response format**: see [Standard Response Envelope](../system-concepts.md#standard-response-envelope)  
> **Roles**: see [system-concepts.md → User Roles](../system-concepts.md#user-roles)  
> **Related screens**: [Shots](./08-shots.md) — entry point for series playback · [Home](./02-home.md) — series discovery  
> **Doc version**: `v1` — last reviewed `2026-05-01`

---

## Open Questions

These must be resolved before implementation.

- **Q1 `[NEEDS INFO]`** — When the user is watching an episode, and the episode sidebar is open, should swipe navigation still change episodes, or should swipe be disabled until the sidebar is closed? This affects gesture conflict resolution and state priority. **`[ANS: ]`**

- **Q2 `[NEEDS INFO]`** — Should the selected episode persist across app restart or session refresh (requires local persistence like SecureStorage — OS-level encrypted storage such as Keychain on iOS or Android Keystore), or should it reset to episode 1 every time? This impacts UX continuity and state management. **`[ANS: ]`**

- **Q3 `[NEEDS INFO]`** — What is the exact navigation target when a user taps a locked episode CTA? Current spec says "subscription prompt/banner", but no endpoint or screen is defined for purchase flow. Should this redirect to a subscription screen or open a modal? **`[ANS: ]`**

---

## Screen Overview

- **Purpose**: Let users watch a full series, switch between episodes, and handle locked content access.
- **Primary user(s)**: `USER` (authenticated end user)
- **Entry points**: Tap "Watch Full Series" from Shots screen or select a series from Home
- **Exit / next screens**: Back to Shots (`08-shots`) or Home (`02-home`) or Subscription flow (TBD)
- **Success criteria**: User can play unlocked episodes and navigate between episodes without interruption
- **Key constraints**: Locked episodes must not expose playable content (video URL must not be usable on client side if locked)

---

## Common UI Rules

- **Submit protection**: Not applicable (no form submission)
- **Offline**: Show inline message *"You're offline. Check your connection and try again."*
- **5xx**: Toast *"Something went wrong. Please try again."*
- **Validation (`422`)**: Not expected for this screen
- **Rate-limit (`429`)**: Show retry countdown using `Retry-After` header
- **Status mapping**:
  - `401` → redirect to login
  - `403` → show access restriction state
  - `404` → show empty state (series not found)
  - `5xx` → toast error
- **Media safety rule**: Never autoplay next episode without user interaction unless explicitly enabled in settings (prevents accidental data usage spikes)

---

## UX Flow

### Series Load & Initial Playback
1. User enters Series Player from Shots or Home.
2. App calls `[GET /series/:seriesId/episodes](../modules/series.md#9.1-get-series-episodes)` with seriesId.
3. First unlocked episode is selected automatically.
4. Video player loads selected episode stream.

> **WHY first unlocked episode?** Prevents user landing on locked content and hitting a dead end. Improves completion rate and reduces bounce friction.

---

### Episode Selection (Sidebar)
1. User taps **Episodes** button.
2. Sidebar opens showing:
   - Episode title
   - Duration
   - Lock/Unlock status
3. User taps an unlocked episode.
4. Player switches to selected episode and reloads video.

---

### Swipe Navigation
1. User swipes left or right on player area.
2. System moves to next/previous episode in order.
3. Only unlocked episodes are eligible for playback.
4. If next episode is locked → show subscription prompt instead of switching.

> **WHY lock-first check?** Prevents exposing premium content URLs in navigation flow even temporarily. The server already enforces lock status, but client-side filtering reduces accidental access attempts.

---

### Locked Episode Interaction
1. User taps locked episode in sidebar OR swipes into locked episode.
2. System blocks playback.
3. Show subscription prompt (modal or banner).

---

## Edge Cases

### Locked Episode Access Attempt
- **Trigger**: User taps locked episode or swipe lands on locked episode
- **UI response**: Modal or banner
- **Message**: *"This episode is locked. Subscribe to continue."*
- **Action**: Open subscription flow (TBD in Q3)
- **Note**: Must not preload video URL for locked episodes

---

### Episode Load Failure
- **Trigger**: Video URL fails to load
- **UI response**: Inline retry state
- **Message**: *"Unable to load episode. Try again."*
- **Action**: Retry playback

---

### Offline Mode
- **Trigger**: No network detected
- **UI response**: Playback disabled overlay
- **Message**: *"You're offline. Connect to continue watching."*
- **Action**: Retry when online

---

### Invalid Series ID
- **Trigger**: API returns `404`
- **UI response**: Empty state screen
- **Message**: *"Series not found."*
- **Action**: Navigate back to Home

---

## UX Audit

**Minor**
- Swipe + sidebar interaction may create gesture conflict if both remain active simultaneously.  
  **Why**: Competing input layers increase cognitive load (Miller’s Law — too many simultaneous choices overwhelm working memory).  
  **Fix**: Disable swipe when sidebar is open OR prioritize sidebar input over gesture navigation.

---

## Endpoints Used

| # | Method | Endpoint | Module Spec | Used in flow |
|---|--------|----------|-------------|--------------|
| 1 | GET | `/series/:seriesId/episodes` | [Series Module](../modules/series.md#9.1-get-series-episodes) | Series Load & Initial Playback |
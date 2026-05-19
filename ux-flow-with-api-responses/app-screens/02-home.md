# Screen 2: Home (Mobile)

> **Section**: App APIs (User-Facing)  
> **Base URL**: `{{baseUrl}}` = see [system-concepts.md](../system-concepts.md#base-url--environment)  
> **Response format**: see [Standard Response Envelope](../system-concepts.md#standard-response-envelope)  
> **Roles**: see [system-concepts.md → User Roles](../system-concepts.md#user-roles)  
> **Related screens**:  
- [Auth](./01-auth.md) — entry point after successful login  
- [Video Details](./07-video-details.md) — content tap deep navigation  
- [Profile](./06-profile.md) — user history and preferences  
> **Doc version**: `v1` — last reviewed `2026-04-30`

---

## Screen Overview

- **Purpose**: Personalized content discovery feed with horizontally scrollable sections.
- **Primary user(s)**: `USER` (authenticated end user)
- **Entry points**: After login success, or app cold start with valid session (JWT — a signed token used to identify the user without querying the database every request)
- **Exit / next screens**: Video Details screen, Profile screen, or Search results flow
- **Success criteria**: Home feed renders with at least partial content or stable skeleton states without blocking interaction
- **Key constraints**: Must support partial API failure without breaking layout

---

## Common UI Rules

- **Submit protection**: Disable action button on tap and show spinner to prevent duplicate requests.
- **Offline**: Show inline banner *"You're offline. Check your connection and try again."*
- **5xx errors**: Toast *"Something went wrong. Please try again."* and log error for monitoring.
- **Validation (422)**: Field-level inline errors only, no global toast.
- **Rate limit (429)**: Respect `Retry-After` header (server cooldown instruction) and show inline countdown.
- **401**: Force session re-authentication; redirect to login screen.
- **403**: Show access restriction message or modal depending on context.
- **404**: Render empty state safely without crash.
- **409**: Show inline conflict message with recovery option.
- **Loading strategy**: Section-level skeletons, never full screen lock.

---

## UX Flow

### Home Initialization (Parallel Load)

1. User opens app or lands after login success.
2. System triggers parallel requests:
   - [GET /home/content](../modules/home.md#01-home-content)
   - [GET /users/me/recently-watched](../modules/users.md#02-recently-watched)
3. UI renders skeleton loaders per section instead of blocking screen.

> **WHY parallel loading?** Parallel requests reduce total waiting time compared to sequential loading. This improves perceived performance and keeps user engagement stable during startup.

---

### Home Feed Rendering (LOLOMO Sections)

1. System receives feed data grouped into sections.
2. Each section renders as a horizontal scroll row:
   - Trending content
   - Recommended for you
   - Premium / VIP content
   - Ranked lists (daily, weekly, monthly)
3. Cards inside each row are independently scrollable.

> **WHY row-based feed model?** A fixed layout limits personalization. Row-based structure allows dynamic rearrangement without changing the client UI structure.

---

### Search & Discovery Flow

1. User types query in search bar.
2. Optional filters applied:
   - Popular
   - New
   - Categories
3. On input change or submit:
   - [GET /content/search](../modules/content.md#02-search-content)
4. Results render as a list of content cards.

**Empty search result**
- **Trigger**: API returns empty array
- **UI response**: Empty state screen
- **Message**: *"No results found"*
- **Action**: Reset filters or modify query

**Rate limit handling**
- **Trigger**: 429 response
- **UI response**: Inline toast + temporary input disable
- **Message**: *"Too many requests. Try again in a moment."*
- **Action**: Auto retry allowed after cooldown

> **WHY debounce + rate limit combo?** Client debounce (delayed request batching) reduces unnecessary API calls, while server rate limit protects backend from abuse. Both layers are required for stability.

---

### Content Interaction

1. User taps a content card.
2. System navigates to Video Details screen.
3. Context passed includes content ID and type.

---

### Slow Feed Loading Behavior

- **Trigger**: delayed `/home/content` response
- **UI response**: skeleton per section
- **Message**: none (silent loading)
- **Action**: render sections progressively as data arrives
- **Note**: improves perceived performance under slow networks

---

## Edge Cases

### Partial Feed Failure
- **Trigger**: one or more feed sections fail to load
- **UI response**: render available sections only
- **Message**: none or subtle retry indicator
- **Action**: retry failed section in background
- **Note**: prevents full screen failure due to single API issue

### Empty Entire Feed
- **Trigger**: `/home/content` returns empty dataset
- **UI response**: global empty state
- **Message**: *"No content available right now"*
- **Action**: refresh or retry

### Search Empty State
- **Trigger**: no results
- **UI response**: empty results view
- **Message**: *"No results found"*
- **Action**: adjust filters or query

---

## UX Audit

**Critical**
- Home feed depends on multiple APIs without strict merge strategy.  
  **Why**: single API failure can reduce visible content unexpectedly.  
  **Fix**: implement section-level fallback rendering with independent retry per section.

**Minor**
- Search debounce not formally defined.  
  **Why**: risk of excessive API calls under fast typing.  
  **Fix**: add 300–500ms client debounce.

- Empty-state behavior is inconsistent across feed sections.  
  **Why**: reduces visual consistency and user trust.  
  **Fix**: standardize shared empty state component for all sections.

---

## Endpoints Used

| # | Method | Endpoint | Module Spec | Used in flow |
|---|---|---|---|---|
| 1 | GET | `/home/content` | [Home Module](../modules/home.md#01-home-content) | Home Initialization |
| 2 | GET | `/users/me/recently-watched` | [Users Module](../modules/users.md#02-recently-watched) | Home Initialization |
| 3 | GET | `/content/search` | [Content Module](../modules/content.md#02-search-content) | Search Flow |

> Note: Playback is never handled on this screen. All video playback logic is delegated to the Video Details screen.
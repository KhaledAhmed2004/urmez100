# Screen 4: My List (Mobile)

> **Section**: App APIs (User-Facing)
> **Base URL**: `{{baseUrl}}` = see [system-concepts.md](../system-concepts.md#base-url--environment)
> **Response format**: see [Standard Response Envelope](../system-concepts.md#standard-response-envelope)
> **Roles**: see [system-concepts.md → User Roles](../system-concepts.md#user-roles)
> **Related screens**: None — standalone library screen for user content history and saved items
> **Doc version**: `v1` — last reviewed `2026-05-01`

---

## Screen Overview

- **Purpose**: Let the user quickly resume watched content and access saved or purchased items.
- **Primary user(s)**: `USER`
- **Entry points**: Bottom navigation → “My List” tab
- **Exit / next screens**: Content Details screen on item tap
- **Success criteria**: User sees up-to-date recently watched and saved content without manual refresh
- **Key constraints**: Must handle partial data load and empty states without layout shift

---

## Common UI Rules

- **Submit protection**: Disabled interactions during loading states to prevent duplicate navigation or actions.
- **Offline handling**: Show inline message: “You are offline. Check your connection and try again.”
- **5xx errors**: Show toast: “Something went wrong. Please try again.” and log error internally.
- **Validation (`422`)**: Not applicable for this screen (read-only APIs).
- **Rate-limit (`429`)**: Read `Retry-After` header (server tells how many seconds to wait before retrying).
- **Status mapping**:
  - `400` → inline error state
  - `401` → redirect to login
  - `403` → access denied toast
  - `404` → empty state
  - `409` → not expected here
  - `422` → not expected here
  - `429` → retry countdown UI
  - `5xx` → toast + retry option

---

## UX Flow

### Initial Load (Parallel Fetch)
1. User opens “My List” tab from bottom navigation.
2. UI triggers two parallel API calls:
   - Recently Watched → [`GET /users/me/recently-watched`](../modules/user.service.ts#getRecentlyWatchedFromDB)
   - My Collection → [`GET /users/me/collection`](../modules/user.service.ts#getMyCollectionFromDB)
3. While loading:
   - Show skeleton placeholders for both sections.
4. When responses arrive:
   - Render sections independently (one can load even if the other fails).

> **WHY parallel fetch?**
> It reduces total wait time. Both datasets are independent, so sequential loading would unnecessarily delay first meaningful paint.

---

### Recently Watched Section Render
1. Display items in reverse chronological order (most recent first).
2. Each item shows progress bar based on watch completion.
3. Tap on item → navigate to content details screen.

---

### My Collection Section Render
1. Display saved or purchased content sorted by most recently added.
2. Each item shows minimal card data (title, thumbnail, rating).
3. Tap on item → navigate to content details screen.

---

### Remove From Collection (if supported)
1. User taps remove icon on a collection item.
2. Call remove action API [endpoint pending module spec].
3. On success → item is removed from UI instantly (optimistic update).

---

## Edge Cases

### Empty State (Both Sections Empty)
- **Trigger**: Both APIs return empty arrays
- **UI response**: Show full empty state illustration
- **Message**: “No content found”
- **Action**: Suggest browsing content library
- **Note**: Avoid showing two separate empty messages; merge into one unified state

---

### Partial Failure (One API Fails)
- **Trigger**: One API returns `5xx` or network error
- **UI response**: Show valid section + error placeholder for failed section
- **Message**: “Failed to load this section. Try again.”
- **Action**: Retry button for that section only
- **Note**: Prevent full-screen failure when only one dataset fails

---

### Sync Delay Across Devices
- **Trigger**: User watches content on another device
- **UI response**: Data may be stale until refresh
- **Action**: Pull-to-refresh updates both lists
- **Note**: Backend is eventual consistent; no real-time sync guaranteed

---

## Endpoints Used

| # | Method | Endpoint | Module Spec | Used in flow |
| --- | --- | --- | --- | --- |
| 1 | GET | `/users/me/recently-watched` | [User Service](../modules/user.service.ts#getRecentlyWatchedFromDB) | Initial Load → Recently Watched |
| 2 | GET | `/users/me/collection` | [User Service](../modules/user.service.ts#getMyCollectionFromDB) | Initial Load → My Collection |

---

> Note: Collection remove action endpoint is not defined in current spec and must be confirmed before implementation.
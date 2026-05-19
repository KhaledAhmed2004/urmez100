# Screen 10: Rewards (Mobile)

> **Section**: App APIs (User-Facing)  
> **Base URL**: `{{baseUrl}}` = see [system-concepts.md](../system-concepts.md#base-url--environment)  
> **Response format**: see [Standard Response Envelope](../system-concepts.md#standard-response-envelope)  
> **Roles**: see [system-concepts.md → User Roles](../system-concepts.md#user-roles)  
> **Related screens**: Home (Mobile) — Rewards entry point from feed/profile  
> **Doc version**: `v1` — last reviewed `2026-05-01`

---

## 00-project-overview.md (Context)

> Student-facing reward system for engagement-based coins.

- Users earn coins by completing platform activities (watching content, sharing, daily check-ins, profile completion).
- Coins are stored as a single aggregated balance per user.
- Tasks are dynamic and may be progress-based or one-time rewards.
- Rewards are claimed manually after backend marks task as eligible.
- System prioritizes real-time perceived progress, but final truth always comes from server state.

---

## Open Questions

(No blocking gaps identified in this screen scope.)

---

## Common UI Rules

- **Submit protection**: disable button immediately after tap + show spinner. Prevent duplicate claims.
- **Offline mode**: show inline message *"You're offline. Check your connection and try again."*
- **5xx errors**: toast *"Something went wrong. Please try again."* and log error for monitoring.
- **Validation (422)**: show field-level error directly under affected UI element.
- **Rate-limit (429)**: read `Retry-After` header and show countdown *"Try again in {N}s."*
- **401 (unauthorized)**: force session refresh or redirect to login.
- **403 (forbidden)**: show toast *"You are not allowed to perform this action."*
- **409 (conflict)**: show inline recovery state (already claimed / already completed).
- **Idempotency (calling the same action twice has the same effect as once)** must be respected for reward claims.

---

## UX Flow

### Rewards Dashboard Load

1. User opens Rewards screen from profile or sidebar.
2. App triggers parallel API calls:
   - [GET `/users/me/coins`](../modules/users.md#10.1)
   - [GET `/rewards/tasks`](../modules/rewards.md#10.2)
3. UI renders progressively:
   - Coin balance card loads first (top priority visual anchor).
   - Task list renders with skeleton placeholders.
   - Daily check-in tile appears separately as a highlighted card.

> **WHY parallel loading?**  
> Coin balance and task list are independent data sources. Fetching them together reduces perceived latency and avoids blocking the UI on a single slow endpoint.

---

### Task Interaction & Progress Update

1. User views task list.
2. Each task shows state:
   - Pending
   - In progress
   - Completed but unclaimed
3. Progress updates are server-driven (client does not calculate final completion).
4. UI updates optimistically only for progress bars, not final reward state.

---

### Claim Reward Flow

1. User taps **Claim** on a completed task.
2. App calls:
   - [POST `/rewards/tasks/:taskId/claim`](../modules/rewards.md#10.3)
3. On success:
   - Update coin balance instantly in UI
   - Mark task as “claimed”
   - Show success toast + small coin animation
4. On failure:
   - If already claimed → show inline *"Already claimed."*
   - If expired → show *"Reward expired."*

> **WHY server-side claim validation?**  
> Claiming coins is a financial-like operation (virtual currency). Server must be single source of truth to prevent duplication, race conditions (two requests at same time both succeeding), or client manipulation.

---

## Edge Cases

### Task already claimed
- **Trigger**: `409 CONFLICT`
- **UI response**: inline disabled state
- **Message**: *"This reward has already been claimed."*
- **Action**: hide Claim button
- **Note**: prevents duplicate crediting

### Partial progress mismatch
- **Trigger**: server progress differs from client expectation
- **UI response**: silent sync refresh
- **Action**: refetch `/rewards/tasks`
- **Note**: server is authoritative source

### Claim retry spam
- **Trigger**: multiple taps on Claim
- **UI response**: button lock + spinner
- **Action**: ignore duplicate requests (idempotent behavior)
- **Note**: prevents double reward due to race condition

---

## UX Audit

**Minor**

- Task list lacks strong visual hierarchy between:
  - completed but unclaimed
  - in-progress tasks  
  **Why**: users may miss claimable rewards (Hick’s Law — more similar choices increases decision time).  
  **Fix**: visually elevate "Claimable" state with distinct color + sticky top grouping.

---

## Endpoints Used

| # | Method | Endpoint | Module Spec | Used in flow |
|---|--------|----------|-------------|--------------|
| 1 | GET | `/users/me/coins` | [Users Module](../modules/users.md#10.1) | Dashboard load |
| 2 | GET | `/rewards/tasks` | [Rewards Module](../modules/rewards.md#10.2) | Dashboard load |
| 3 | POST | `/rewards/tasks/:taskId/claim` | [Rewards Module](../modules/rewards.md#10.3) | Claim flow |

---

## Storage & Session

(Not required for this screen — no token mutation or persistence logic introduced.)
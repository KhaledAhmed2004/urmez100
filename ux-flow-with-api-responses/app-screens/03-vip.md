# Screen 3: VIP (Subscription) (Mobile)

> **Section**: App APIs (User-Facing)  
> **Base URL**: `{{baseUrl}}` = see [system-concepts.md](../system-concepts.md#base-url--environment)  
> **Response format**: see [Standard Response Envelope](../system-concepts.md#standard-response-envelope)  
> **Roles**: see [system-concepts.md → User Roles](../system-concepts.md#user-roles)  
> **Related screens**: [Subscription Flow](./03-subscription.md) — handles purchase and plan activation after VIP selection  
> **Doc version**: `v1` — last reviewed `2026-05-01`

---

## Screen Overview

- **Purpose**: Let users browse VIP-only content sections and start a subscription if needed.
- **Primary user(s)**: `USER`
- **Entry points**: Bottom navigation → VIP tab
- **Exit / next screens**: Subscription flow screen (`03-subscription.md`) or content detail screen
- **Success criteria**: VIP sections render correctly and premium access state is applied if subscribed
- **Key constraints**: Must not show empty sections; must degrade gracefully if content fetch fails

---

## Common UI Rules

- **Submit protection**: disabled on tap + spinner; prevents duplicate actions
- **Offline**: show inline message — *"You're offline. Check your connection and try again."*
- **5xx errors**: toast — *"Something went wrong. Please try again."*
- **Validation (422)**: field-level errors only (no generic toast)
- **Rate-limit (429)**: read `Retry-After` (server cooldown value in seconds) and show countdown
- **401 Unauthorized**: force token refresh or redirect to login
- **403 Forbidden**: show access restriction message (no content leak)
- **Empty state rule**: hide section if no items exist (no placeholder rows)

---

## UX Flow

### VIP Feed Load
1. User taps **VIP** tab in bottom navigation.
2. System calls  
   → [`GET /vip/content`](../modules/vip-content.md#3.1-get-vip-content)
3. Server returns grouped VIP sections.
4. UI renders sections as horizontal shelves (LOLOMO layout — layered content rows with horizontal scroll).
5. Each section displays title + scrollable content cards.

> **WHY LOLOMO layout?** It improves content scanning speed by reducing vertical scrolling friction and allows quick genre-based discovery without page transitions.

---

### Subscription Entry Flow
1. User taps a premium item or subscription CTA.
2. System navigates to subscription flow  
   → [`Subscription Flow`](./03-subscription.md)
3. If user completes payment:
   - VIP badge state is activated globally
   - UI unlocks premium items across sections

---

### Already Subscribed State
1. System detects active subscription on load.
2. VIP badge is shown in UI header or profile context.
3. Premium content is fully accessible without restrictions.

---

## Edge Cases

### Empty VIP Sections
- **Trigger**: API returns `sections: []` or section has no items
- **UI response**: Hide section completely
- **Message**: none
- **Action**: none
- **Note**: Prevents empty shelf UI clutter

---

### VIP Content Fetch Failure
- **Trigger**: network error or `5xx`
- **UI response**: fallback toast + retry button
- **Message**: *"Unable to load VIP content. Try again."*
- **Action**: retry fetch `/vip/content`
- **Note**: No partial rendering unless cached data exists

---

## UX Audit

**Minor**
- Horizontal shelves may overload first-time users if too many sections render at once.  
  **Why**: Cognitive load increases when multiple LOLOMO rows compete for attention.  
  **Fix**: Limit initial render to top 3 sections + lazy-load rest on scroll.

---

## Endpoints Used

| # | Method | Endpoint | Module Spec | Used in flow |
|---|--------|----------|-------------|--------------|
| 1 | GET | `/vip/content` | [VIP Content](../modules/vip-content.md#3.1-get-vip-content) | VIP Feed Load |

---
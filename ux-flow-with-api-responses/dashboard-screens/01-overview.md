# Screen 1: Overview

> **Section**: Dashboard APIs (Admin-Facing)
> **Base URL**: `{{baseUrl}}` = `http://localhost:5000/api/v1`
> **Auth**: All endpoints require `Bearer {{accessToken}}` with `SUPER_ADMIN` role
> **Response format**: See [Standard Response Envelope](#standard-response-envelope) below
> **Related screens**: [User Management](./02-user-management.md), [Movies Management](./03-movies-management.md), [Series Management](./03.2-series-management.md)

---

## Standard Response Envelope

All endpoints in this section follow a unified envelope.

**Object Response (Stats/Single Item):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Human-readable description",
  "data": { ... }
}
```

**List Response (Pagination):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Human-readable description",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPage": 10
  },
  "data": [ ... ]
}
```

**Error Envelope:**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Error description",
  "data": null
}
```

---

## UX Flow

### Dashboard Load Flow
1. Admin Dashboard e login korle "Overview" screen render hoy
2. Page load e **parallel API calls** chole stats display korar jonno:
   - Growth metrics (Users, Reviews, Content, Subscriptions) → `GET /admin/growth-metrics` (→ 2.1)
   - Visitors analytics chart → `GET /admin/visitors/analytics?range=all_time` (→ 2.2)
   - Watchlist status breakdown → `GET /admin/watchlist/status?period=this_month` (→ 2.3)
3. Screen render hoy:
   - Top section e **Summary Cards** (Total count + growth direction + change percentage) dekhay
   - Middle section e **Visitors Analytics** (Line/Bar charts) different time ranges er data show kore
   - Bottom section e **Watchlist Status** breakdown by genres dekhay

---

## Edge Cases

| Scenario | Behavior |
| :--- | :--- |
| **No Data (New System)** | `value` 0 return korbe, `changePct` 0 hobe, `direction` `"neutral"` hobe, ebong analytics series empty array hobe. |
| **First Period Data** | `lastPeriodCount` 0 hole `changePct` automatically `100` show korbe, `direction` `"up"` hobe. |
| **Database Latency** | Parallel calls use kora hoyeche, tai dashboard partial load hote pare — **Skeleton screens strongly recommended**. |
| **Unauthorized Access** | `SUPER_ADMIN` role chara dashboard stats access kora jabe na → `403 Forbidden`. |
| **Future Range Data** | Analytics e range select korle future dates er data `null` hobe (0 noy) — frontend e null check kore chart point skip korbe. |

---

<!-- ══════════════════════════════════════ -->
<!--              OVERVIEW FLOW              -->
<!-- ══════════════════════════════════════ -->

### 2.1 Growth Metrics (Stats)

```
GET /admin/growth-metrics
Auth: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Dashboard-er summary cards-er jonno ei endpoint use hoy. Monthly growth calculate kore: current month vs last month.

**Query Parameters:**

| Param | Type | Required | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| `range` | `string` | No | `"month"` | Options: `"week"`, `"month"`, `"year"`, `"custom"` |
| `startDate` | `string` | No | - | ISO date string (Required if range is `"custom"`) |
| `endDate` | `string` | No | - | ISO date string |

**Example (Custom Range):**
`{{baseUrl}}/admin/growth-metrics?range=custom&startDate=2026-01-01&endDate=2026-03-31`

**Implementation:**
- **Route**: [admin.route.ts](file:///src/app/modules/admin/admin.route.ts)
- **Controller**: [admin.controller.ts](file:///src/app/modules/admin/admin.controller.ts) — `getDashboardStats`
- **Service**: [admin.service.ts](file:///src/app/modules/admin/admin.service.ts) — `getAdminDashboardStats`

**Field Reference:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `meta.comparisonPeriod` | `string` | The period used for growth comparison (e.g., `"week"`, `"month"`, `"year"`, `"custom"`) |
| `{metric}.value` | `number` | Total count as of now |
| `{metric}.changePct` | `number` | Always a **positive** magnitude (e.g. `25`, `7.14`). Use `direction` for sign. |
| `{metric}.direction` | `"up" \| "down" \| "neutral"` | `"up"` = growth, `"down"` = decline, `"neutral"` = no change |

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Admin dashboard metrics",
  "data": {
    "meta": {
      "comparisonPeriod": "month"
    },
    "totalUsers": {
      "value": 1500,
      "changePct": 12.5,
      "direction": "up"
    },
    "totalReviews": {
      "value": 450,
      "changePct": 5.2,
      "direction": "up"
    },
    "totalContent": {
      "value": 820,
      "changePct": 2.1,
      "direction": "up"
    },
    "totalSubscribe": {
      "value": 320,
      "changePct": 15.0,
      "direction": "up"
    }
  }
}
```

---

### 2.2 Visitors Analytics

```
GET /admin/visitors/analytics
Auth: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Visitors-er analytics chart render korar jonno data return kore. Multiple time ranges support kore.

**Query Parameters:**

| Param | Type | Required | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| `range` | `string` | No | `"all_time"` | Options: `"all_time"`, `"last_year"`, `"last_90_days"`, `"last_30_days"`, `"last_7_days"`, `"this_month"`, `"this_week"`, `"custom"` |
| `tz` | `string` | No | `"UTC"` | IANA timezone for bucket boundaries |
| `startDate` | `string` | No | - | ISO date string (Required if range is `"custom"`) |
| `endDate` | `string` | No | - | ISO date string |

**Example (Custom Range):**
`{{baseUrl}}/admin/visitors/analytics?range=custom&startDate=2026-01-01&endDate=2026-03-31`

**Implementation:**
- **Route**: [admin.route.ts](file:///src/app/modules/admin/admin.route.ts)
- **Controller**: [admin.controller.ts](file:///src/app/modules/admin/admin.controller.ts) — `getVisitorAnalytics`
- **Service**: [admin.service.ts](file:///src/app/modules/admin/admin.service.ts) — `getVisitorAnalyticsData`

**Response:** 
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Visitor analytics retrieved successfully.",
  "data": {
    "meta": {
      "range": "30_days",
      "timezone": "UTC"
    },
    "summary": {
      "total": 12450,
      "avg_per_period": 415,
      "peak": {
        "date": "2026-04-10",
        "count": 620
      }
    },
    "series": [
      {
        "label": "Apr 01",
        "count": 380
      },
      {
        "label": "Apr 02",
        "count": 410
      }
      // ... more data points based on range
    ]
  }
}
```

---

### 2.3 Watchlist Status

```
GET /admin/watchlist/status
Auth: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Watchlist-er status breakdown return kore categorized by genres (Views based).

**Query Parameters:**

| Param | Type | Required | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| `range` | `string` | No | `"last_30_days"` | Options: `"all_time"`, `"last_year"`, `"last_90_days"`, `"last_30_days"`, `"last_7_days"`, `"this_month"`, `"this_week"`, `"custom"` |
| `tz` | `string` | No | `"UTC"` | IANA timezone for bucket boundaries |
| `startDate` | `string` | No | - | ISO date string (Required if range is `"custom"`) |
| `endDate` | `string` | No | - | ISO date string |

**Example (Custom Range):**
`{{baseUrl}}/admin/watchlist/status?range=custom&startDate=2026-01-01&endDate=2026-03-31`

**Implementation:**
- **Route**: [admin.route.ts](file:///src/app/modules/admin/admin.route.ts)
- **Controller**: [admin.controller.ts](file:///src/app/modules/admin/admin.controller.ts) — `getWatchlistStatus`
- **Service**: [admin.service.ts](file:///src/app/modules/admin/admin.service.ts) — `getWatchlistStatusBreakdown`

**Field Reference:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `series[].genre` | `string` | Genre name (e.g., Action, Drama, etc.) |
| `series[].count` | `number` | Total views in this genre within the selected period |
| `series[].percentage` | `number` | Percentage share of views for this genre |

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Watchlist status breakdown retrieved successfully.",
  "data": {
    "meta": {
      "period": "this_month"
    },
    "series": [
      {
        "genre": "Action",
        "count": 450,
        "percentage": 40
      },
      {
        "genre": "Thriller",
        "count": 300,
        "percentage": 25
      },
      {
        "genre": "Comedy",
        "count": 250,
        "percentage": 20
      }
    ]
  }
}
```

---

## API Status

| # | Endpoint | Method | Auth | Status | Notes |
|---|----------|:------:|:----:|:------:|-------|
| 2.1 | `/admin/growth-metrics` | GET | SUPER_ADMIN | ✅ Done | Metrics for Users, Reviews, Content, and Subscriptions |
| 2.2 | `/admin/visitors/analytics` | GET | SUPER_ADMIN | ✅ Done | Real-time analytics with time-range filtering |
| 2.3 | `/admin/watchlist/status` | GET | SUPER_ADMIN | ✅ Done | Updated to show genre-wise views with time filters |

---

# Screen 5: Subscribes

> **Section**: Dashboard APIs (Admin-Facing)
> **Base URL**: `{{baseUrl}}` = `http://localhost:5000/api/v1`
> **Response format**: See [Standard Response Envelope](../README.md#standard-response-envelope)
> **Related screens**: [Overview](./01-overview.md) (Global stats), [Revenues](./08-revenues.md)

## UX Flow

### Subscription Management Flow

1. Admin sidebar theke "Subscribes" module e click kore.
2. Page load e subscription stats cards fetch hoy → `GET /admin/subscriptions/stats` (→ 2.1)
3. Page load e subscription records fetch hoy → `GET /admin/subscriptions` (→ 3.1)
4. Admin search bar use kore **Transaction ID** search kore → `GET /admin/subscriptions?search=GPA.3312` (→ 3.1)
5. Subscription table render hoy:
   - **Transaction ID** (e.g. GPA.3312-4456-7789-12345)
   - **Plan** (Weekly, Monthly, Yearly, Free)
   - **Status** (Active, Paused, Cancelled)
   - **Start Date**
   - **Expiry Date** (Next renewal or access end date)
   - **Billing Cycle**
   - **Amount**
   - **Action** (Manage/View details)

---

## Edge Cases & Solutions

| Scenario | Behavior / Solution |
| :--- | :--- |
| **Search by User** | Admin can search by **User Name** or **Email** in the search bar. The system resolves the user identity to find relevant subscription records. |
| **Deleted Users** | If a user is deleted from the system, the subscription table will show **"Deleted User"** and email **"N/A"** instead of an empty field or error. |
| **Multiple Transaction IDs** | Search scans across `appleOriginalTransactionId`, `appleLatestTransactionId`, and `googleOrderId` to find matching records regardless of the platform. |
| **Billing Cycle Mapping** | Raw store product IDs (e.g., `premium_weekly`) are mapped to human-readable cycles like **"Weekly"**, **"Monthly"**, or **"Yearly"**. |
| **Sorting** | Results are sorted by **latest update** (`updatedAt`) by default so admins see the most recent activity at the top. |
| **No Results** | Returns 200 OK with an empty data array and 0 total in pagination. |

---

### 2.1 Subscription Stats (Overview Cards)
```http
GET /admin/subscriptions/stats
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> For the summary stat cards in the dashboard's subscription section.

**Business Logic:**
- **Total Users**: The total number of registered users in the system.
- **Subscription Revenue**: Total revenue generated specifically from subscription plans.
- **Active Subscribers**: Count of users who currently have an `active` status subscription. Growth is calculated against the previous month.
- **Growth Rate**: The percentage change in the number of active subscribers over the last 30 days.

**Field Reference:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `meta.comparisonPeriod` | `string` | Always `"month"` — current vs last calendar month |
| `{metric}.value` | `number \| string` | Total count as of now |
| `{metric}.changePct` | `number` | Always a positive magnitude (e.g. `25`, `7.14`). Use `direction` for sign. |
| `{metric}.direction` | `"up" \| "down" \| "neutral"` | `"up"` = growth, `"down"` = decline, `"neutral"` = no change |

#### Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Subscription stats retrieved successfully",
  "data": {
    "meta": {
      "comparisonPeriod": "month"
    },
    "totalUsers": {
      "value": 12450,
      "changePct": 0.5,
      "direction": "up"
    },
    "subscriptionRevenue": {
      "value": 21450000,
      "changePct": 18.2,
      "direction": "up"
    },
    "activeSubscribers": {
      "value": 671479,
      "changePct": 12.5,
      "direction": "up"
    },
    "growthRate": {
      "value": "+15.8%",
      "changePct": 3.2,
      "direction": "up"
    }
  }
}
```

---

### 3.1 Get/Search Subscriptions
```http
GET /admin/subscriptions
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Handles subscription records search, filtering, and pagination.

**Business Logic:**
- **Current State**: Fetches data from the `Subscription` collection, which holds the latest status for each user.
- **Search**: Supports searching by **Transaction ID** (Apple Original/Latest Transaction ID or Google Order ID).
- **Filtering**: Allows filtering by subscription `plan` and current `status`.
- **Relationship**: Each record is linked to a `User` to display their identity alongside their subscription details.

**Query Parameters:**
- `search`: Transaction ID search
- `page`: Pagination page number (Default: 1)
- `limit`: Pagination limit (Default: 10)

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Subscriptions list fetched",
  "pagination": { "page": 1, "limit": 10, "total": 671479, "totalPage": 67148 },
  "data": [
    {
      "transactionId": "GPA.3312-4456-7789-12345",
      "plan": "Weekly",
      "status": "Paused",
      "startDate": "2026-02-25T10:30:00.000Z",
      "expiryDate": "2026-03-25T10:30:00.000Z",
      "billingCycle": "Weekly",
      "amount": 2500
    },
    {
      "transactionId": "GPA.3345-1123-8890-54321",
      "plan": "Yearly",
      "status": "Cancelled",
      "startDate": "2020-02-20T10:30:00.000Z",
      "expiryDate": "2021-02-20T10:30:00.000Z",
      "canceledAt": "2020-12-01T15:00:00.000Z",
      "billingCycle": "Yearly",
      "amount": 4500
    },
    {
      "transactionId": "GPA.3392-7712-4456-00987",
      "plan": "Monthly",
      "status": "Active",
      "startDate": "2026-02-15T10:30:00.000Z",
      "expiryDate": "2026-03-15T10:30:00.000Z",
      "billingCycle": "Monthly",
      "amount": 2500
    },
    {
      "transactionId": "GPA.3301-2298-5543-11223",
      "plan": "Free",
      "status": "Active",
      "startDate": "2026-02-10T10:30:00.000Z",
      "expiryDate": null,
      "billingCycle": "Monthly",
      "amount": 0
    }
  ]
}
```

---

## API Status

| # | Endpoint | Status | Notes |
| :--- | :--- | :---: | :--- |
| 2.1 | `GET /admin/subscriptions/stats` | ✅ Done | Subscription growth & revenue stats |
| 3.1 | `GET /admin/subscriptions` | ✅ Done | Searchable subscription records |

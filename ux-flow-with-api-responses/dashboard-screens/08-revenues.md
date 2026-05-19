# Screen 8: Revenues

> **Section**: Dashboard APIs (Admin-Facing)
> **Base URL**: `{{baseUrl}}` = `http://localhost:5000/api/v1`
> **Response format**: See [Standard Response Envelope](../README.md#standard-response-envelope)
> **Related screens**: [Overview](./01-overview.md) (Global stats)

## UX Flow

### Revenue Management Flow

1. Admin clicks on the "Revenues" module from the sidebar.
2. Revenue stats cards are fetched on page load → `GET /admin/revenue/stats` (→ 2.1)
3. Transaction list is fetched on page load → `GET /admin/transactions` (→ 3.1)
4. Admin uses the search bar to search by **Email** or **TRX ID** → `GET /admin/transactions?search=sadat@gmail.com` (→ 3.1)
5. Transaction table renders:
   - **Email** (or "N/A" for guest users)
   - **UID** (Unique identifier for guest/anonymous users)
   - **TRX ID**
   - **Date**
   - **Coin** (Amount spent on coins)
   - **Subscription** (Amount spent on subscription)
   - **Total Amount** (Coin + Subscription)
   - **Action** (View receipt/details)

---

## Edge Cases

| Scenario | Behavior |
| :--- | :--- |
| **No Transactions** | Stats cards will return zero, and the table will show "No transactions found". |
| **Search No Result** | Returns 200 OK but with an empty data array. |
| **Partial Payments** | Transaction status is logically checked (only successful payments will be in the list). |

---

### 2.1 Revenue Stats (Overview Cards)
```http
GET /admin/revenue/stats
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> For the summary stat cards in the dashboard's revenue section.

**Business Logic:**
- **Total Users**: Counts the total active users (role: `USER`) in the system. Growth calculation is based on the current calendar month vs the last month.
- **Total Revenue**: Revenue is calculated by mapping product prices from subscription events (`SubscriptionEvent`) and adding the sum of users' existing points (Coins).
- **Total Subscribe**: Counts subscriptions that currently have an `active` status.

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
  "message": "Revenue stats retrieved successfully",
  "data": {
    "meta": {
      "comparisonPeriod": "month"
    },
    "totalUsers": {
      "value": 12450,
      "changePct": 0.5,
      "direction": "up"
    },
    "totalRevenue": {
      "value": 4367,
      "changePct": 0.5,
      "direction": "up"
    },
    "totalSubscribe": {
      "value": 780,
      "changePct": 0.5,
      "direction": "up"
    }
  }
}
```

---

### 3.1 Get/Search Transactions
```http
GET /admin/transactions
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Handles transaction list search, filtering, and pagination.

**Business Logic:**
- **Source**: Data is fetched from the `SubscriptionEvent` collection (CREATED, RENEWED, etc. events).
- **Anonymous Users**: Supports users who stream without an account. These users are identified by a `UID`.
- **Email Search**: If the search term matches an email, relevant `userIds` are found from the `User` collection to filter transactions.
- **UID/TRX ID Search**: A partial match search is performed on both `uid` and `externalTransactionId` (Apple/Google) fields.
- **Amounts**: `subscriptionAmount` is calculated by mapping the `productId`. `coinAmount` is not yet recorded as individual transactions, so it will default to 0 in the listing.

**Query Parameters:**
- `search`: Email or TRX ID search
- `page`: Pagination page number (Default: 1)
- `limit`: Pagination limit (Default: 10)

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Transactions list fetched",
  "pagination": { "page": 1, "limit": 10, "total": 1500, "totalPage": 150 },
  "data": [
    {
      "email": "sadat@gmail.com",
      "uid": "guest_12345",
      "trxId": "#TRX-8821",
      "date": "2026-02-25T10:30:00.000Z",
      "coinAmount": 0,
      "subscriptionAmount": 2500,
      "totalAmount": 2500
    },
    {
      "email": "N/A",
      "uid": "anon_998877",
      "trxId": "#TRX-9900",
      "date": "2026-02-24T15:45:00.000Z",
      "coinAmount": 0,
      "subscriptionAmount": 1000,
      "totalAmount": 1000
    }
  ]
}
```

---

## API Status

| # | Endpoint | Status | Notes |
| :--- | :--- | :---: | :--- |
| 2.1 | `GET /admin/revenue/stats` | ✅ Done | Revenue & platform growth stats |
| 3.1 | `GET /admin/transactions` | ✅ Done | Transaction list with search by email/TRX ID |

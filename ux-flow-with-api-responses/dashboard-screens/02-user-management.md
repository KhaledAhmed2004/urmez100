# Screen 2: User Management

> **Section**: Dashboard APIs (Admin-Facing)
> **Base URL**: `{{baseUrl}}` = `http://localhost:5000/api/v1`
> **Response format**: See [Standard Response Envelope](../README.md#standard-response-envelope)
> **Related screens**: [Overview](./01-overview.md) (Stats display)

---

## UX Flow

### User Management Flow

1. Admin clicks on the "User Management" module from the sidebar.
2. User stats cards are fetched on page load → `GET /admin/users/stats` (→ 2.1)
3. User list is fetched on page load → `GET /admin/users` (→ 3.1)
4. Admin uses the search bar to search by user name or email → `GET /admin/users?search=John` (→ 3.1)
5. Admin uses filters to select users by status → `GET /admin/users?status=ACTIVE` (→ 3.1)
6. Admin clicks the "Export" button to export the user list (CSV) → `GET /admin/users/export` (→ 3.5)
7. User table renders:
   - **User Name**
   - **Image** (Profile picture)
   - **Gmail** (Email)
   - **Account Status** (ACTIVE, RESTRICTED, etc.)
   - **Coins** (User balance)
   - **Subscription Status** (Active, Inactive, Plan name)
8. Clicking the "Edit" action opens a pre-filled form for updates → `PATCH /admin/users/:userId` (→ 3.3)
9. Clicking "Block/Activate" updates the user status → `PATCH /admin/users/:userId` with body `{ "status": "RESTRICTED" | "ACTIVE" }` (→ 3.3)
10. Clicking "Delete" opens a confirmation modal before submission → `DELETE /admin/users/:userId` (→ 3.4)
11. Admin can select multiple users for batch deletion → `DELETE /admin/users/bulk-delete` (→ 3.6)

---

### 2.1 User Stats (Overview Cards)

```http
GET /admin/users/stats
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> For the summary stat cards in the user management section.

**Business Logic:**
- **Total Users**: Calculated using `AggregationBuilder` on the `User` model with a monthly comparison. Returns total count, growth percentage, and direction.
- **New Active Users**: Counts users with `status: "ACTIVE"` created within the current calendar month, compared to the previous month.
- **Subscribed Users Growth**: Tracks growth of active subscriptions by querying the `Subscription` model for records created this month vs. last month.
- **Growth Calculation**: Uses standard calendar month boundaries (start of month to now vs. previous month's full range).

**Implementation:**
- **Route**: [admin.route.ts](file:///src/app/modules/admin/admin.route.ts)
- **Controller**: [user.controller.ts](file:///src/app/modules/user/user.controller.ts) — `getUsersStats`
- **Service**: [user.service.ts](file:///src/app/modules/user/user.service.ts) — `getUsersStatsFromDB`

**Query Parameters:** None

**Field Reference:**

| Field                   | Type                          | Description                                                                |
| :---------------------- | :---------------------------- | :------------------------------------------------------------------------- |
| `meta.comparisonPeriod` | `string`                      | Always `"month"` — current vs last calendar month                          |
| `{metric}.value`        | `number`                      | Total count as of now                                                      |
| `{metric}.changePct`    | `number`                      | Always a positive magnitude (e.g. `25`, `7.14`). Use `direction` for sign. |
| `{metric}.direction`    | `"up" \| "down" \| "neutral"` | `"up"` = growth, `"down"` = decline, `"neutral"` = no change               |

#### Responses

- **Scenario: Success (200)**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User stats retrieved successfully",
  "data": {
    "meta": {
      "comparisonPeriod": "month"
    },
    "totalUsers": {
      "value": 1500,
      "changePct": 12.5,
      "direction": "up"
    },
    "activeUsersNewThisMonth": {
      "value": 120,
      "changePct": 15,
      "direction": "up"
    },
    "totalSubscribedNewThisMonth": {
      "value": 45,
      "changePct": 8,
      "direction": "up"
    }
  }
}
```

---

### 3.1 Get/Search Users

```http
GET /admin/users
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Handles user list search, filtering, and pagination.

**Business Logic:**
- **Fetch**: Retrieves users with `role: "USER"`. Admin roles are excluded.
- **Search**: Supports case-insensitive partial matching on `name` and `email` using MongoDB `$regex`.
- **Filtering**: Filters by `status` (ACTIVE, INACTIVE, RESTRICTED).
- **Subscription Integration**: Performs an aggregation `$lookup` on the `subscriptions` collection to fetch the user's current `status` and `plan`.
- **Mapping**: The response maps the internal `points` field to `coins` for the frontend.
- **Pagination**: Returns standard metadata including `total`, `totalPages`, `hasNext`, and `hasPrev`.
- **Empty State**: If no users match the search or filters, the API returns a 200 OK with an empty `data` array and `total: 0`.

**Implementation:**
- **Route**: [admin.route.ts](file:///src/app/modules/admin/admin.route.ts)
- **Controller**: [user.controller.ts](file:///src/app/modules/user/user.controller.ts) — `getAllUserRoles`
- **Service**: [user.service.ts](file:///src/app/modules/user/user.service.ts) — `getAllUserRolesFromDB`

**Query Parameters:**

| Parameter   | Description                                           | Default     |
| :---------- | :---------------------------------------------------- | :---------- |
| `search`    | Search by name or email                               | —           |
| `status`    | Filter by status (`ACTIVE`, `INACTIVE`, `RESTRICTED`) | —           |
| `page`      | Pagination page number                                | `1`         |
| `limit`     | Pagination limit                                      | `10`        |
| `sortBy`    | Field name for sorting                                | `createdAt` |
| `sortOrder` | Sort direction (`asc` or `desc`)                      | `desc`      |

#### Responses

- **Scenario: Success (200)**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User list fetched",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1500,
    "totalPage": 150
  },
  "data": [
    {
      "_id": "664a1b2c3d4e5f6a7b8c9d0e",
      "name": "John Doe",
      "profilePicture": "https://example.com/images/john.jpg",
      "email": "john.doe@gmail.com",
      "status": "ACTIVE",
      "coins": 250,
      "subscriptionPlan": "PREMIUM"
    }
  ]
}
```

---

### 3.3 Update User

```http
PATCH /admin/users/:userId
Content-Type: application/json
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Updates user details or status.

**Business Logic:**
- **Whitelisted Fields**: Only specific fields can be updated: `name`, `email`, `phone`, `country`, `specialty`, `hospital`, `location`, `gender`, `dateOfBirth`, `profilePicture`, `status`, `role`, and `coins` (which updates the `points` field).
- **Sensitive Data**: Password and authentication objects are explicitly protected and cannot be modified via this endpoint.
- **Status Toggle**: Setting `status: "RESTRICTED"` blocks the user, while `"ACTIVE"` restores access.
- **Partial Update**: Uses `findByIdAndUpdate` logic to modify only provided fields.
- **Error Handling**: 
  - **Duplicate Email**: If the updated email is already taken by another user, the server returns a 400 Bad Request error.
  - **Invalid User**: Providing a `userId` that does not exist in the database returns a 400 Bad Request error.
  - **Validation**: Input is validated against `adminUpdateUserZodSchema`; invalid formats (e.g., invalid email) return a 400 error with field-specific details.

**Implementation:**
- **Route**: [admin.route.ts](file:///src/app/modules/admin/admin.route.ts)
- **Controller**: [user.controller.ts](file:///src/app/modules/user/user.controller.ts) — `adminUpdateUser`
- **Service**: [user.service.ts](file:///src/app/modules/user/user.service.ts) — `updateUserByAdminInDB`

**Request Body (any subset of these fields):**

```json
{
  "name": "Jane Updated",
  "status": "RESTRICTED"
}
```

#### Responses

- **Scenario: Success (200)**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User updated",
  "data": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0f",
    "email": "jane.smith@gmail.com",
    "status": "RESTRICTED"
  }
}
```

---

### 3.4 Delete User

```http
DELETE /admin/users/:userId
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Permanently removes a user account.

**Business Logic:**
- **Hard Delete**: Executes `findByIdAndDelete` to permanently remove the user record.
- **Cleanup**: Removes all associated authentication data.
- **Validation**: If the provided `userId` is invalid or not found, the server returns a 404 Not Found error.

**Implementation:**
- **Route**: [admin.route.ts](file:///src/app/modules/admin/admin.route.ts)
- **Controller**: [user.controller.ts](file:///src/app/modules/user/user.controller.ts) — `deleteUser`
- **Service**: [user.service.ts](file:///src/app/modules/user/user.service.ts) — `deleteUserPermanentlyFromDB`

#### Responses

- **Scenario: Success (200)**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User deleted"
}
```

---

### 3.5 Export Users

```http
GET /admin/users/export
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Exports the filtered user list to a CSV file.

**Business Logic:**
- **Filter Support**: Inherits search and status filters from the listing API to ensure the export matches the current UI view.
- **Unified Logic**: Reuses `getAllUserRolesFromDB` with a high limit (100k) to gather data.
- **CSV Generation**: Uses `ExportBuilder` to transform JSON data into a CSV buffer with formatted headers.
- **Download**: Sets `Content-Type: text/csv` and `Content-Disposition: attachment` for browser-triggered downloads.
- **Large Datasets**: For very high record counts, the export uses a high limit to fetch all matching records and streams the buffer to ensure the request doesn't timeout.

**Implementation:**
- **Route**: [admin.route.ts](file:///src/app/modules/admin/admin.route.ts)
- **Controller**: [user.controller.ts](file:///src/app/modules/user/user.controller.ts) — `exportUsers`
- **Service**: [user.service.ts](file:///src/app/modules/user/user.service.ts) — `exportUsersFromDB`

**Query Parameters:** Same as `GET /admin/users` (search, status, etc.)

**Response:** Returns a CSV file stream (`text/csv`).

---

### 3.6 Bulk Delete Users

```http
DELETE /admin/users/bulk-delete
Content-Type: application/json
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Deletes multiple user accounts in a single request.

**Business Logic:**
- **Batch Operation**: Uses `deleteMany` with the `$in` operator for atomic deletion of multiple IDs.
- **Verification**: Validates the payload to ensure `userIds` is a non-empty array.
- **Feedback**: Returns the count of successfully deleted records.

**Implementation:**
- **Route**: [admin.route.ts](file:///src/app/modules/admin/admin.route.ts)
- **Controller**: [user.controller.ts](file:///src/app/modules/user/user.controller.ts) — `bulkDeleteUsers`
- **Service**: [user.service.ts](file:///src/app/modules/user/user.service.ts) — `bulkDeleteUsersFromDB`

**Request Body:**
```json
{
  "userIds": ["664a1b2c3d4e5f6a7b8c9d0e", "664a1b2c3d4e5f6a7b8c9d0f"]
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "2 users deleted successfully"
}
```

---

## API Status

| #   | Endpoint                          | Module |   Status   | Notes                                     |
| :-- | :-------------------------------- | :----- | :--------: | :---------------------------------------- |
| 2.1 | `GET /admin/users/stats`          | User   | ✅ Done | Scoped under admin for SUPER_ADMIN access |
| 3.1 | `GET /admin/users`                | User   | ✅ Done | Scoped under admin                        |
| 3.3 | `PATCH /admin/users/:userId`      | User   | ✅ Done | Scoped under admin                        |
| 3.4 | `DELETE /admin/users/:userId`     | User   | ✅ Done | Scoped under admin                        |
| 3.5 | `GET /admin/users/export`         | User   | ✅ Done | Added CSV export via ExportBuilder        |
| 3.6 | `DELETE /admin/users/bulk-delete` | User   | ✅ Done | New: Bulk deletion for efficiency         |

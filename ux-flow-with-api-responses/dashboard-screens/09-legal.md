# Screen 9: Legal Pages

> **Section**: Dashboard APIs (Admin-Facing)
> **Base URL**: `{{baseUrl}}` = `http://localhost:5000/api/v1`
> **Response format**: See [Standard Response Envelope](../README.md#standard-response-envelope)
> **Related screens**: [Profile](../app-screens/06-profile.md) (Users ra legal pages eikhan theke dekhte paye)

## UX Flow

### Legal Content Management Flow

1. Admin sidebar theke "Legal Pages" module e click kore.
2. Shob legal pages er list fetch hoy page load e → `GET /legal` (→ 9.1)
3. Admin "Create Page" button e click kore:
   - **Title** ebong **Content** (Rich text/Markdown) input kore.
   - Submit → `POST /legal` (→ 9.2)
   - Success hole list update hoy ebong success message dekhay.
4. Admin kono existing page update korte chaile list theke select kore:
   - Page details load hoy → `GET /legal/:slug` (→ 9.3)
   - Content modify kore update button click kore → `PATCH /legal/:slug` (→ 9.4)
5. Delete icon e click korle confirmation modal ashe:
   - Confirm korle page delete hoy → `DELETE /legal/:slug` (→ 9.5)

---

## Edge Cases

| Scenario | Behavior |
| :--- | :--- |
| **Duplicate Title** | Jodi same title e onno page thake, tobe slug conflict hobe ebong 409 Conflict return korbe. |
| **Page Not Found** | Jodi invalid slug diye GET/PATCH/DELETE kora hoy, tobe 404 Not Found asbe. |
| **Empty Content** | Content optional thakle o standard practice e title mandatory. |

---

<!-- ══════════════════════════════════════ -->
<!--          LEGAL MANAGEMENT APIs         -->
<!-- ══════════════════════════════════════ -->

### 9.1 Get All Legal Pages

```http
GET /admin/legal
Auth: None
```

> Dashboard list e shob legal pages (Privacy Policy, Terms, etc.) dekhate use hoy.

**Implementation:**
- **Route**: [legal.route.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.route.ts)
- **Controller**: [legal.controller.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.controller.ts) — `getAll`
- **Service**: [legal.service.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.service.ts) — `getAllLegalPagesFromDB`

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Legal pages retrieved successfully",
  "data": [
    {
      "slug": "privacy-policy",
      "title": "Privacy Policy"
    },
    {
      "slug": "terms-and-conditions",
      "title": "Terms and Conditions"
    }
  ]
}
```

---

### 9.2 Create Legal Page

```http
POST /admin/legal
Content-Type: application/json
Auth: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Notun legal page (e.g. Refund Policy) add korar jonno use hoy. Title theke auto-slug generate hoy.

**Implementation:**
- **Route**: [legal.route.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.route.ts)
- **Controller**: [legal.controller.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.controller.ts) — `createLegalPage`
- **Service**: [legal.service.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.service.ts) — `createLegalPageToDB`

**Request Body:**
```json
{
  "title": "Privacy Policy",
  "content": "<h1>Privacy Policy</h1><p>Our data practices...</p>"
}
```

**Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Legal page created successfully",
  "data": {
    "slug": "privacy-policy",
    "title": "Privacy Policy",
    "content": "<h1>Privacy Policy</h1><p>Our data practices...</p>",
    "createdAt": "2026-05-14T10:00:00.000Z"
  }
}
```

---

### 9.3 Get Legal Page by Slug

```http
GET /admin/legal/:slug
Auth: None
```

> Specific legal page details dekhar jonno (Admin edit page e ba public profile section e).

**Implementation:**
- **Route**: [legal.route.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.route.ts)
- **Controller**: [legal.controller.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.controller.ts) — `getBySlug`
- **Service**: [legal.service.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.service.ts) — `getLegalPageBySlugFromDB`

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Legal page retrieved successfully",
  "data": {
    "slug": "privacy-policy",
    "title": "Privacy Policy",
    "content": "<h1>Privacy Policy</h1><p>Our data practices...</p>",
    "updatedAt": "2026-05-14T11:00:00.000Z"
  }
}
```

---

### 9.4 Update Legal Page

```http
PATCH /admin/legal/:slug
Content-Type: application/json
Auth: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Existing legal page update korar jonno. Title change korle slug o update hobe.

**Implementation:**
- **Route**: [legal.route.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.route.ts)
- **Controller**: [legal.controller.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.controller.ts) — `updateBySlug`
- **Service**: [legal.service.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.service.ts) — `updateLegalPageBySlugInDB`

**Request Body:**
```json
{
  "title": "Updated Privacy Policy",
  "content": "<p>New policy content...</p>"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Legal page updated successfully",
  "data": {
    "slug": "updated-privacy-policy",
    "title": "Updated Privacy Policy",
    "content": "<p>New policy content...</p>",
    "updatedAt": "2026-05-14T12:00:00.000Z"
  }
}
```

---

### 9.5 Delete Legal Page

```http
DELETE /admin/legal/:slug
Auth: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Kono legal page permanent remove korar jonno.

**Implementation:**
- **Route**: [legal.route.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.route.ts)
- **Controller**: [legal.controller.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.controller.ts) — `deleteBySlug`
- **Service**: [legal.service.ts](file:///d:/Khaled/uremz100/src/app/modules/legal/legal.service.ts) — `deleteLegalPageBySlugFromDB`

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Legal page deleted successfully"
}
```

---

## API Status

| # | Endpoint | Status | Notes |
| :--- | :--- | :---: | :--- |
| 9.1 | `GET /admin/legal` | ✅ Done | Fetch shob legal pages |
| 9.2 | `POST /admin/legal` | ✅ Done | Notun page create kora |
| 9.3 | `GET /admin/legal/:slug` | ✅ Done | Single page fetch kora |
| 9.4 | `PATCH /admin/legal/:slug` | ✅ Done | Content ba title update kora |
| 9.5 | `DELETE /admin/legal/:slug` | ✅ Done | Page remove kora |

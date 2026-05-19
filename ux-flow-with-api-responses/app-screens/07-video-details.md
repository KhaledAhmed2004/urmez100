# Screen 7: Video Details (Mobile)

> **Section**: App APIs (Student-Facing)
> **Base URL**: `{{baseUrl}}` = `http://localhost:5000/api/v1`
> **Response format**: See [Standard Response Envelope](../README.md#standard-response-envelope)
> **Related screens**: [Home](./02-home.md), [My List](./04-my-list.md)

## UX Flow

### Content Details Initial Load
1. User Home screen ba Search theke kono content-e tap korle details screen-e land kore.
2. Screen load-e details data fetch hoy: `GET /content/:contentId`
3. UI render hoy:
   - Top-e Video player (Streaming content).
   - Video title, genres, views, rating, ebong description.
   - **Favorite Toggle**: Ekta icon thake jeta user-ke favorite list-e add/remove korar option dey.
   - Related/Recommended content list niche dekhano hoy.

### Favorite Management
1. User jodi favorite icon-e tap kore:
   - Jodi favorite kora na thake: `POST /content/:contentId/favorite` (→ 7.1)
   - Jodi already favorite thake: `DELETE /content/:contentId/favorite` (→ 7.2)
2. Success hole toast message dekhay ebong favorite icon state update hoy.

---

<!-- ══════════════════════════════════════ -->
<!--              FAVORITES                  -->
<!-- ══════════════════════════════════════ -->

### 7.1 Favorite Content

```
POST /content/:contentId/favorite
Auth: Bearer {{accessToken}}
```

> Content favorite list-e add korar jonno.

#### Responses
- **Scenario: Success (200)**: `{ "success": true, "message": "Content favorited" }`

---

### 7.2 Unfavorite Content

```
DELETE /content/:contentId/favorite
Auth: Bearer {{accessToken}}
```

> Favorite list theke remove korar jonno.

#### Responses
- **Scenario: Success (200)**: `{ "success": true, "message": "Content unfavorited" }`

---

### 7.3 Sync Watch Progress

```
POST /user/me/recently-watched/:contentId/sync
Auth: Bearer {{accessToken}}
Content-Type: application/json

{
  "watchedSeconds": 450
}
```

> Video player theke heartbeat ba pause hole watch progress sync korar jonno. Eta admin dashboard-er "Real Engagement" analytics-er jonno proyojon.

#### Responses
- **Scenario: Success (200)**: 
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Watch progress synced successfully",
    "data": {
      "userId": "65f1a...",
      "contentId": "65f1b...",
      "watchedSeconds": 450,
      "completionPercentage": 15.5,
      "lastWatchedAt": "2024-03-20T..."
    }
  }
  ```

---

## API Status

| # | Endpoint | Method | Auth | Status | Notes |
|---|---|---|---|:---:|---|
| 7.1 | `/content/:contentId/favorite` | `POST` | Bearer | ✅ Done | Add to favorites |
| 7.2 | `/content/:contentId/favorite` | `DELETE` | Bearer | ✅ Done | Remove from favorites |
| 7.3 | `/user/me/recently-watched/:contentId/sync` | `POST` | Bearer | ✅ Done | Sync progress & Key Moments |

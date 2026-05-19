# Screen 8: Shots (Mobile)

> **Section**: App APIs (Student-Facing)
> **Base URL**: `{{baseUrl}}` = `http://localhost:5000/api/v1`
> **Response format**: See [Standard Response Envelope](../README.md#standard-response-envelope)

## UX Flow

### Shots Feed Initial Load
1. User bottom navigation ba onno kono entry point theke "Shots" screen-e land kore.
2. Screen load-e shots-er vertical feed data fetch hoy: `GET /shots` (→ 8.1)
3. UI render hoy:
   - Full-screen vertical scrolling video feed (TikTok/Reels style).
   - Video player automatically play hobe current shot-er jonno.
   - Side actions: **Favorite Icon**, **Share Icon**, **Comment Icon**.
   - Bottom-e Shot title, description, ebong **"Watch Full Series"** button thakbe (jodi shot-ti kono series-er ongsho hoy).
   - User kono shot-er details ba comment section-e tap korle [Shot Details](./08.1-shot-details.md) screen-e navigate kore.
   - **"Watch Full Series"** button-e click korle user-ke [Series Player](./09-series-player.md) screen-e niye jabe.


### Interaction Actions
1. **Favorite Management**:
   - User jodi favorite icon-e tap kore:
     - Jodi favorite kora na thake: `POST /shots/:shotId/favorite` (→ 8.2)
     - Jodi already favorite thake: `DELETE /shots/:shotId/favorite` (→ 8.3)
   - Success hole icon state update hobe (red heart).
2. **Share Shot**:
   - User share icon-e tap korle: `POST /shots/:shotId/share` (→ 8.4)
   - Eita muloto share count track korar jonno backend-e call kore, ebong frontend-e native share sheet open hoy.

---

<!-- ══════════════════════════════════════ -->
<!--                SHOTS FEED                -->
<!-- ══════════════════════════════════════ -->

### 8.1 Get Shots Feed

```
GET /shots?page=1&limit=10
Auth: Bearer {{accessToken}}
```

> Shots (short videos) er list fetch korar jonno.

#### Responses

- **Scenario: Success (200)**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Shots retrieved successfully",
    "pagination": { "page": 1, "limit": 10, "total": 50, "totalPage": 5 },
    "data": [
      {
        "id": "664a1b2c3d4e5f6a7b8c9d2c",
        "videoUrl": "https://cdn.example.com/shot1.mp4",
        "thumbnail": "https://cdn.example.com/shot1-thumb.jpg",
        "title": "Quick Surgery Tip",
        "description": "How to handle sutures efficiently.",
        "isFavorited": false,
        "favoriteCount": 120,
        "shareCount": 45
      }
    ]
  }
  ```

---

<!-- ══════════════════════════════════════ -->
<!--              FAVORITES                  -->
<!-- ══════════════════════════════════════ -->

### 8.2 Favorite Shot

```
POST /shots/:shotId/favorite
Auth: Bearer {{accessToken}}
```

> Shot favorite list-e add korar jonno.

#### Responses
- **Scenario: Success (200)**: `{ "success": true, "message": "Shot favorited" }`

---

### 8.3 Unfavorite Shot

```
DELETE /shots/:shotId/favorite
Auth: Bearer {{accessToken}}
```

> Shot favorite list theke remove korar jonno.

#### Responses
- **Scenario: Success (200)**: `{ "success": true, "message": "Shot unfavorited" }`

---

<!-- ══════════════════════════════════════ -->
<!--                SHARE                    -->
<!-- ══════════════════════════════════════ -->

### 8.4 Share Shot

```
POST /shots/:shotId/share
Auth: Bearer {{accessToken}}
```

> Shot-er share count track korar jonno.

#### Responses
- **Scenario: Success (200)**: `{ "success": true, "message": "Shot share tracked" }`

---

## API Status

| # | Endpoint | Method | Auth | Status | Notes |
|---|---|---|---|:---:|---|
| 8.1 | `/shots` | `GET` | Bearer | ✅ Done | Shots feed list |
| 8.2 | `/shots/:shotId/favorite` | `POST` | Bearer | ✅ Done | Favorite a shot |
| 8.3 | `/shots/:shotId/favorite` | `DELETE` | Bearer | ✅ Done | Unfavorite a shot |
| 8.4 | `/shots/:shotId/share` | `POST` | Bearer | ✅ Done | Track share action |

# UX Flow with API Responses

Screen-by-screen API flow — **Student App** ebong **Admin Dashboard** dutor jonno documentation. 
Each screen e APIs called, method/URL, auth requirement, ebong expected response shape ache.

> Base URL: `{{baseUrl}}` = `http://localhost:5000/api/v1`
> **[🗺️ User Journey & UX Flow Overview](./user-journey.md)** — Complete cross-screen user journeys with ASCII flow diagrams.
> **[API Inventory & Implementation Tracker](./api-inventory.md)** — All APIs at a glance.
> **[Database Design & Relationships](./database-design.md)** — Entity map ebong schema structure.

---

## Standard Response Envelope

Shob API ei format follow kore:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "data": "..."
}
```

`pagination` শুধু list endpoint e thake. `data` er shape endpoint bhede alada.

---

## Part 1: App APIs (Student-Facing)

| # | Screen | Description |
|---|--------|-------------|
| 1 | [Auth](./app-screens/01-auth.md) | Register, login, OTP verify, password reset, refresh token |
| 2 | [Home](./app-screens/02-home.md) | Search content, stats, popular, new, and series |
| 3 | [VIP](./app-screens/03-vip.md) | Subscription packages, Best Movies, and Coming Soon |
| 4 | [My List](./app-screens/04-my-list.md) | Recently watched and personal content collection |
| 5 | [Notifications](./app-screens/05-notifications.md) | User's notifications list, mark as read, delete |
| 6 | [Profile](./app-screens/06-profile.md) | User data, edit profile, subscription, legal pages |
| 7 | [Video Details](./app-screens/07-video-details.md) | Video player, details, and favorite management |
| 8 | [Shots](./app-screens/08-shots.md) | Vertical short video feed with favorite and share actions |
| 8.1 | [Shot Details](./app-screens/08.1-shot-details.md) | Full shot details with "More Like This" recommendations |
| 9 | [Series Player](./app-screens/09-series-player.md) | Full series view with episodes list and lock/unlock status |
| 10 | [Rewards](./app-screens/10-rewards.md) | User coins balance and reward tasks list |






---

## Part 2: Dashboard APIs (Admin-Facing)

| # | Screen | Description |
|---|--------|-------------|
| 0 | [Auth](./dashboard-screens/00-auth.md) | Admin login, token management, forget password flow |
| 1 | [Overview](./dashboard-screens/01-overview.md) | Dashboard stats, counts, recent activity |
| 2 | [User Management](./dashboard-screens/02-user-management.md) | User stats, search, filter, and management |
| 3 | [Content: Movies](./dashboard-screens/03.0-content-movies.md) | Movie list, search, filter, and upload |
| 3.1 | [Content: Movie Details](./dashboard-screens/03.1-content-movies-details.md) | Movie analytics and detailed performance stats |
| 3.2 | [Content: Series](./dashboard-screens/03.2-content-series.md) | Series list, seasons count, and status management |
| 3.3 | [Content: Series Details](./dashboard-screens/03.3-content-series-details.md) | Episode management and season details |
| 4 | [Genre Management](./dashboard-screens/04-genres.md) | Genres list, create, edit, and delete |
| 5 | [Subscribes](./dashboard-screens/05-subscribes.md) | Subscription plans and transaction history |
| 8 | [Revenues](./dashboard-screens/08-revenues.md) | Revenue stats and detailed transaction list |
| 9 | [Legal Pages](./dashboard-screens/09-legal.md) | Terms, Privacy Policy, ebong legal content management |
| 10 | [Profile Update](./dashboard-screens/10-profile-update.md) | Admin profile details ebong information management |

---

## Part 3: Technical Guides & Best Practices

| # | Guide | Description |
|---|-------|-------------|
| 1 | [Video Upload Strategy](./video-upload-guide.md) | S3 Multipart Upload + Presigned URLs implementation guide |

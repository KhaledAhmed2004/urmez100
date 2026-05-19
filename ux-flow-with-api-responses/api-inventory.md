# API Inventory & Implementation Tracker (Screen-Wise)

Ei file ta screen-wise API list track rakhe. Proti ti UI screen-er against-e kon backend endpoint use hocche ta eikhane pawa jabe.

> Mount prefixes (see `src/routes/index.ts`): `/users`, `/auth`, `/notifications`, `/subscription`, `/admin`, `/admin/genres`, `/admin/legal`, `/legal`, `/content`, `/home`, `/rankings`.
> **Note:** All Admin APIs are strictly prefixed with `/admin`. No `preference-cards`, `supplies`, or `sutures` modules exist in the current codebase.

---

## 🖥️ Dashboard Screens (Admin-Facing)

### 0. [Auth (Dashboard)](./dashboard-screens/00-auth.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 0.1 | `/auth/login` | `POST` | Public | [00-auth.md](./dashboard-screens/00-auth.md) | ✅ |
| 0.2 | `/auth/forgot-password` | `POST` | Public | [00-auth.md](./dashboard-screens/00-auth.md) | ✅ |
| 0.3 | `/auth/verify-otp` | `POST` | Public | [00-auth.md](./dashboard-screens/00-auth.md) | ✅ |
| 0.4 | `/auth/reset-password` | `POST` | Reset Token | [00-auth.md](./dashboard-screens/00-auth.md) | ✅ |
| 0.5 | `/auth/refresh-token` | `POST` | Refresh Token | [00-auth.md](./dashboard-screens/00-auth.md) | ✅ |
| 0.6 | `/auth/logout` | `POST` | All Auth | [00-auth.md](./dashboard-screens/00-auth.md) | ✅ |
| 0.7 | `/auth/change-password` | `POST` | All Auth | [00-auth.md](./dashboard-screens/00-auth.md) | ✅ |
| 0.8 | `/auth/resend-verify-email` | `POST` | Public | [00-auth.md](./dashboard-screens/00-auth.md) | ✅ |

### 1. [Overview (Dashboard)](./dashboard-screens/01-overview.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 1.1 | `/admin/growth-metrics` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 1.2 | `/admin/visitors/analytics` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 1.3 | `/admin/watchlist/status` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 1.4 | `/admin/subscriptions/stats` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 1.5 | `/admin/subscriptions` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |

### 2. [User Management](./dashboard-screens/02-user-management.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 2.1 | `/admin/users` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 2.2 | `/admin/users/stats` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 2.3 | `/admin/users/:userId` | `PATCH` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 2.4 | `/admin/users/:userId` | `DELETE` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 2.5 | `/admin/users/bulk-delete` | `DELETE` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 2.6 | `/admin/users/:userId/status` | `PATCH` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 2.7 | `/admin/users/:userId` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |

### 3. [Content: Movies](./dashboard-screens/03.0-content-movies.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 3.1 | `/admin/movies/stats` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.2 | `/admin/movies` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.3 | `/admin/movies` | `POST` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.4 | `/admin/movies/:movieId` | `PATCH` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.5 | `/admin/movies/:movieId` | `DELETE` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.6 | `/admin/movies/:movieId/status` | `PATCH` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.7 | `/admin/movies/upload/initiate` | `POST` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.8 | `/admin/movies/upload/presigned-urls` | `POST` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.9 | `/admin/movies/upload/complete` | `POST` | SUPER_ADMIN | `admin.route.ts` | ✅ |

### 3.1 [Content: Movie Details & Analytics](./dashboard-screens/03.1-content-movies-details.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 3.1.1 | `/admin/movies/:movieId` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.1.2 | `/admin/movies/:movieId/analytics/overview` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.1.3 | `/admin/movies/:movieId/analytics/engagement` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.1.4 | `/admin/movies/:movieId/analytics/audience` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.1.5 | `/admin/movies/:movieId/analytics/revenue` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |

### 3.2 [Content: Series](./dashboard-screens/03.2-content-series.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 3.2.1 | `/admin/series/stats` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.2.2 | `/admin/series` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.2.3 | `/admin/series` | `POST` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.2.4 | `/admin/series/:seriesId` | `PATCH` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.2.5 | `/admin/series/:seriesId` | `DELETE` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.2.6 | `/admin/series/:seriesId/status` | `PATCH` | SUPER_ADMIN | `admin.route.ts` | ✅ |

### 3.3 [Content: Series Details](./dashboard-screens/03.3-content-series-details.md)
**Integration Guides**: 
- [Create Series & Seasons](./dashboard-screens/03.2.1-content-series-create.md)
- [Get Seasons List](./dashboard-screens/03.2.2-content-series-seasons-list.md)
- [Edit Season Content (Update)](./dashboard-screens/03.2.3-content-series-seasons-update.md)
- [Get Season Episodes (Content)](./dashboard-screens/03.2.4-content-series-season-episodes.md)
- [Get Series Details](./dashboard-screens/03.2.5-content-series-get-details.md)
- [Create Series Episode](./dashboard-screens/03.3.1-content-series-episode-create.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 3.3.1 | `/admin/series/:seriesId/details` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.3.2 | `/admin/series/:seriesId/seasons` | `POST` | SUPER_ADMIN | `admin.route.ts` | [03.2.1](./dashboard-screens/03.2.1-content-series-create.md) |
| 3.3.3 | `/admin/series/:seriesId/seasons` | `GET` | SUPER_ADMIN | `admin.route.ts` | [03.2.2](./dashboard-screens/03.2.2-content-series-seasons-list.md) |
| 3.3.4 | `/admin/series/seasons/:seasonId` | `PATCH` | SUPER_ADMIN | `admin.route.ts` | [03.2.3](./dashboard-screens/03.2.3-content-series-seasons-update.md) |
| 3.3.5 | `/admin/series/seasons/:seasonId` | `DELETE` | SUPER_ADMIN | `admin.route.ts` | [03.2.3](./dashboard-screens/03.2.3-content-series-seasons-update.md) |
| 3.3.6 | `/admin/series/:seriesId/episodes` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.3.7 | `/admin/series/:seriesId/episodes` | `POST` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.3.8 | `/admin/series/episodes/:episodeId` | `PATCH` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 3.3.9 | `/admin/series/episodes/:episodeId` | `DELETE` | SUPER_ADMIN | `admin.route.ts` | ✅ |

### 4. [Genre Management](./dashboard-screens/04-genres.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 4.1 | `/admin/genres` | `GET` | SUPER_ADMIN | `genre.route.ts` | ✅ |
| 4.2 | `/admin/genres` | `POST` | SUPER_ADMIN | `genre.route.ts` | ✅ |
| 4.3 | `/admin/genres/:genreId` | `PATCH` | SUPER_ADMIN | `genre.route.ts` | ✅ |
| 4.4 | `/admin/genres/:genreId` | `DELETE` | SUPER_ADMIN | `genre.route.ts` | ✅ |

### 5. [Subscribes](./dashboard-screens/05-subscribes.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 5.1 | `/admin/subscriptions/stats` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 5.2 | `/admin/subscriptions` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |

### 8. [Revenues](./dashboard-screens/08-revenues.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 8.1 | `/admin/revenue/stats` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |
| 8.2 | `/admin/transactions` | `GET` | SUPER_ADMIN | `admin.route.ts` | ✅ |

### 9. [Legal Management](./dashboard-screens/09-legal.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 9.1 | `/admin/legal` | `GET` | Public | [09-legal.md](./dashboard-screens/09-legal.md) | ✅ |
| 9.2 | `/admin/legal` | `POST` | SUPER_ADMIN | [09-legal.md](./dashboard-screens/09-legal.md) | ✅ |
| 9.3 | `/admin/legal/:slug` | `GET` | Public | [09-legal.md](./dashboard-screens/09-legal.md) | ✅ |
| 9.4 | `/admin/legal/:slug` | `PATCH` | SUPER_ADMIN | [09-legal.md](./dashboard-screens/09-legal.md) | ✅ |
| 9.5 | `/admin/legal/:slug` | `DELETE` | SUPER_ADMIN | [09-legal.md](./dashboard-screens/09-legal.md) | ✅ |

### 10. [Profile Update](./dashboard-screens/10-profile-update.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 10.1 | `/users/profile` | `GET` | SUPER_ADMIN | [10-profile-update.md](./dashboard-screens/10-profile-update.md) | ✅ |
| 10.2 | `/users/profile` | `PATCH` | SUPER_ADMIN | [10-profile-update.md](./dashboard-screens/10-profile-update.md) | ✅ |

---

## 📱 App Screens (Student-Facing)

### 1. [Auth (Mobile)](./app-screens/01-auth.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 1.1 | `/users` | `POST` | Public | [01-auth.md](./app-screens/01-auth.md) | ✅ |
| 1.2 | `/auth/login` | `POST` | Public | [01-auth.md](./app-screens/01-auth.md) | ✅ |
| 1.3 | `/auth/verify-otp` | `POST` | Public | [01-auth.md](./app-screens/01-auth.md) | ✅ |
| 1.4 | `/auth/forgot-password` | `POST` | Public | [01-auth.md](./app-screens/01-auth.md) | ✅ |
| 1.5 | `/auth/reset-password` | `POST` | Reset Token | [01-auth.md](./app-screens/01-auth.md) | ✅ |
| 1.6 | `/auth/refresh-token` | `POST` | Refresh Token | [01-auth.md](./app-screens/01-auth.md) | ✅ |
| 1.7 | `/auth/logout` | `POST` | User | [01-auth.md](./app-screens/01-auth.md) | ✅ |
| 1.8 | `/auth/resend-verify-email` | `POST` | Public | [01-auth.md](./app-screens/01-auth.md) | ✅ |
| 1.9 | `/auth/google` | `GET` | Public | [01-auth.md](./app-screens/01-auth.md) | ✅ |
| 1.10 | `/auth/google/callback` | `GET` | Public | [01-auth.md](./app-screens/01-auth.md) | ✅ |

### 2. [Home (Mobile)](./app-screens/02-home.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 2.1 | `/home/content` | `GET` | User | `home.route.ts` | ✅ |
| 2.2 | `/content/search` | `GET` | User | `content.route.ts` | ✅ |
| 2.3 | `/content/:contentId/favorite` | `POST` | User | `content.route.ts` | ✅ |
| 2.4 | `/content/:contentId/favorite` | `DELETE` | User | `content.route.ts` | ✅ |

### 3. [VIP & Rankings (Mobile)](./app-screens/03-vip.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 3.1 | `/subscription/packages` | `GET` | User | `subscription.route.ts` | ✅ |
| 3.2 | `/content/best-movies` | `GET` | User | `content.route.ts` | ✅ |
| 3.3 | `/content/coming-soon` | `GET` | User | `content.route.ts` | ✅ |
| 3.4 | `/rankings/vip` | `GET` | User | `ranking.route.ts` | ✅ |
| 3.5 | `/subscription/apple/verify` | `POST` | User | `subscription.route.ts` | ✅ |
| 3.6 | `/subscription/google/verify` | `POST` | User | `subscription.route.ts` | ✅ |
| 3.7 | `/subscription/choose/free` | `POST` | User | `subscription.route.ts` | ✅ |

### 4. [My List (Mobile)](./app-screens/04-my-list.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 4.1 | `/users/me/recently-watched` | `GET` | User | `user.route.ts` | ✅ |
| 4.2 | `/users/me/collection` | `GET` | User | `user.route.ts` | ✅ |
| 4.3 | `/users/me/recently-watched/:contentId/sync` | `POST` | User | `user.route.ts` | ✅ |

### 5. [Notifications (Mobile)](./app-screens/05-notifications.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 5.1 | `/notifications` | `GET` | User/Admin | [05-notifications.md](./app-screens/05-notifications.md) | ✅ |
| 5.2 | `/notifications/:id/read` | `PATCH` | User/Admin | [05-notifications.md](./app-screens/05-notifications.md) | ✅ |
| 5.3 | `/notifications/read-all` | `PATCH` | User/Admin | [05-notifications.md](./app-screens/05-notifications.md) | ✅ |
| 5.4 | `/notifications/:id` | `DELETE` | User/Admin | [05-notifications.md](./app-screens/05-notifications.md) | ✅ |

### 6. [Profile (Mobile)](./app-screens/06-profile.md)
| ID | Endpoint | Method | Roles | Implementation | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| 6.1 | `/users/profile` | `GET` | User | [06-profile.md](./app-screens/06-profile.md) | ✅ |
| 6.2 | `/users/profile` | `PATCH` | User | [06-profile.md](./app-screens/06-profile.md) | ✅ |
| 6.3 | `/subscription/me` | `GET` | User | [06-profile.md](./app-screens/06-profile.md) | ✅ |
| 6.4 | `/legal` | `GET` | Public | [06-profile.md](./app-screens/06-profile.md) | ✅ |
| 6.5 | `/legal/:slug` | `GET` | Public | [06-profile.md](./app-screens/06-profile.md) | ✅ |
| 6.6 | `/users/:userId/user` | `GET` | User | `user.route.ts` | ✅ |

---

## 🛠️ Technical & Documentation APIs

Eikhane oi endpoint gulo ache jara direct UI screen-er part noy, kintu system documentation ba status check-er jonno proyojon.

| Module | Endpoint | Method | Roles | Purpose | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| **System** | `/` | `GET` | Public | Server Live Wallpaper / Status Check | ✅ |
| **Docs** | `/docs` | `GET` | Public | Swagger API Documentation | ✅ |

---

## 🛠️ Missing Implementation / To-Do

| Module | Endpoint | Method | Reason | Priority |
| :--- | :--- | :---: | :--- | :---: |
| **Subscription** | `/subscription/apple/webhook` | `POST` | Needs end-to-end testing with App Store Server Notifications V2 | High |
| **Subscription** | `/subscription/google/webhook` | `POST` | Needs end-to-end testing with Google Pub/Sub push | High |
| **Docs** | Subscription IAP screens | — | No UX flow doc for apple/google verify + choose-free flows | Medium |

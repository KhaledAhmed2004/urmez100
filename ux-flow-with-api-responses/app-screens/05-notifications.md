# Screen 5: Notifications Flow

> **Section**: System-Wide Push Notifications
> **Base URL**: `{{baseUrl}}` = `http://localhost:5000/api/v1`

## Overview

System-e bibhinno action-er upor vitti kore user-der **Push Notification** pathano hoy. App-er bhitor kono dedicated "Notification List" screen ba UI thakbe na. Shokol notification Firebase (FCM) er maddhome user-er mobile device-e direct push message hishebe jabe.

---

## Notification Types & Triggers

App-e nicher dhoron-er Push Notifications pathano hoy:

| Sl | Event (Kokhono Pathano Hoy) | Notification Content (Ki Message Jabe) |
|---|---|---|
| 1 | **User Verification Success** | `Welcome to Educoin! Start watching your favorite content now.` |
| 2 | **New Content Added** | `New Release: {{title}} is now streaming! Watch it now.` |
| 3 | **Subscription Activated** | `VIP Activated! Enjoy unlimited access to all premium content.` |
| 4 | **Subscription Expiring Soon (48h)** | `Your VIP access expires in 48 hours. Renew now to continue.` |
| 5 | **Admin Manual Alert** | `{{custom_title}}: {{custom_body}}` |
| 6 | **Continue Watching Reminder** | `Don't forget to finish "{{title}}". Continue where you left off!` |

---

## Implementation Details

- **Push Helper**: [pushNotificationHelper.ts](file:///src/app/modules/notification/pushNotificationHelper.ts) - Handles FCM (Firebase Cloud Messaging) integration.
- **Trigger Helper**: [notificationsHelper.ts](file:///src/app/modules/notification/notificationsHelper.ts) - Unified function to send push messages to user devices.
- **Device Tokens**: User login korar shomoy mobile app theke FCM token `PATCH /users/update-profile` (ba specific device token update endpoint) er maddhome backend-e pathay, jeta User model-er `deviceTokens` array-te save thake.

---

## API Status

| # | Endpoint | Method | Auth | Status | Notes |
|---|---|---|---|:---:|---|
| - | - | - | - | ✅ Done | No UI/List API needed. Push-only system. |

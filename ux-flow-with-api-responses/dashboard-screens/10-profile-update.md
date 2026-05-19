# Screen 10: Profile Update

> **Section**: Dashboard APIs (Admin-Facing)
> **Base URL**: `{{baseUrl}}` = `http://localhost:5000/api/v1`
> **Response format**: See [Standard Response Envelope](../README.md#standard-response-envelope)
> **Related screens**: [Auth](./00-auth.md) (Login/Logout), [Overview](./01-overview.md) (Dashboard Home)

## UX Flow

### Profile Update Flow

1. Admin sidebar theke profile icon ba settings e click kore.
2. Current profile details (Name, Email, Phone, Profile Picture etc.) fetch hoy → `GET /users/profile` (→ 1.1)
3. Admin profile picture change korte chaile gallery/camera theke photo select kore.
4. Form e name, phone, country, location update kore.
5. "Update Profile" button e click kore → `PATCH /users/profile` (→ 1.2)
6. API processing e thaka obosthay loading spinner dekhay.
7. Success hole toast message dekhay ebong profile layout update hoy.

---

## Edge Cases & Rules

- **File Upload**: `profilePicture` field e image file pathate hobe (multipart/form-data).
- **Phone Validation**: Phone number 7-15 digits er moddhe hote hobe.
- **Old Image Cleanup**: Profile picture update korle server theke purono image file auto-delete hoye jay.
- **Unauthorized**: Token expire hoye gele ba na thakle 401 Unauthorized return korbe.

---

<!-- ══════════════════════════════════════ -->
<!--           PROFILE MANAGEMENT APIs      -->
<!-- ══════════════════════════════════════ -->

### 1.1 Get Admin Profile

```http
GET /users/profile
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Dashboard e login thaka admin er nijer profile details fetch korar jonno use hoy.

**Implementation:**
- **Route**: [user.route.ts](file:///d:/Khaled/uremz100/src/app/modules/user/user.route.ts)
- **Controller**: [user.controller.ts](file:///d:/Khaled/uremz100/src/app/modules/user/user.controller.ts) — `getUserProfile`
- **Service**: [user.service.ts](file:///d:/Khaled/uremz100/src/app/modules/user/user.service.ts) — `getUserProfileFromDB`

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile data retrieved successfully",
  "data": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "name": "Admin User",
    "email": "admin@example.com",
    "phone": "+8801700000000",
    "role": "SUPER_ADMIN",
    "status": "ACTIVE",
    "verified": true,
    "profilePicture": "https://example.com/images/profile.jpg",
    "country": "Bangladesh",
    "location": "Dhaka"
  }
}
```

---

### 1.2 Update Admin Profile

```http
PATCH /users/profile
Content-Type: multipart/form-data
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Admin er name, phone, address ba profile picture update korar jonno use hoy.

**Implementation:**
- **Route**: [user.route.ts](file:///d:/Khaled/uremz100/src/app/modules/user/user.route.ts)
- **Controller**: [user.controller.ts](file:///d:/Khaled/uremz100/src/app/modules/user/user.controller.ts) — `updateProfile`
- **Service**: [user.service.ts](file:///d:/Khaled/uremz100/src/app/modules/user/user.service.ts) — `updateProfileToDB`

**Request Body (Multipart/Form-Data):**
- `name`: "Updated Admin Name" (String)
- `phone`: "+8801800000000" (String)
- `country`: "Bangladesh" (String)
- `location`: "Chittagong" (String)
- `profilePicture`: [File Binary]

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "name": "Updated Admin Name",
    "email": "admin@example.com",
    "phone": "+8801800000000",
    "role": "SUPER_ADMIN",
    "status": "ACTIVE",
    "verified": true,
    "profilePicture": "https://example.com/images/new-profile.jpg",
    "country": "Bangladesh",
    "location": "Chittagong"
  }
}
```

---

## API Status

| # | Endpoint | Status | Notes |
| :--- | :--- | :---: | :--- |
| 1.1 | `GET /users/profile` | ✅ Done | Admin profile data fetch |
| 1.2 | `PATCH /users/profile` | ✅ Done | Profile update with image support |

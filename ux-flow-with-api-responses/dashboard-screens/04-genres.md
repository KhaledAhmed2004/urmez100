# Screen 4: Genre Management

> **Section**: Dashboard APIs (Admin-Facing)
> **Base URL**: `{{baseUrl}}` = `http://localhost:5000/api/v1`
> **Response format**: See [Standard Response Envelope](../README.md#standard-response-envelope)
> **Related screens**: [Movies Management](./03.0-content-movies.md), [Series Management](./03.2-series-management.md)

## UX Flow

### Genre Management Flow

1. Admin clicks on the "Genre Management" module from the sidebar.
2. Genre list is fetched on page load → `GET /admin/genres` (→ 1.1)
3. Admin uses the search bar to search by **Genre Name** → `GET /admin/genres?search=Action` (→ 1.1)
4. Genre table renders:
   - **Genre Name**
   - **Description**
   - **Content Count** (Total movies/series linked to this Genre ID)
   - **Actions** (Edit, Delete)
5. Admin clicks the "Add Genre" button to create a new genre → `POST /admin/genres` (→ 1.2)
6. Admin edits an existing genre → `PATCH /admin/genres/:genreId` (→ 1.3)
7. Admin deletes a genre → `DELETE /admin/genres/:genreId` (→ 1.4)

---

## Edge Cases & Solutions

| Scenario | Behavior / Solution |
| :--- | :--- |
| **Duplicate Genre** | Genre names are unique. Attempting to create a genre with an existing name will return a 400/409 error. |
| **Genre with Content** | Content is linked to genres via **Object IDs**. Deleting a genre will remove the reference from the `genres` array in Content, but the content record itself remains. |
| **Search No Result** | Returns 200 OK but with an empty data array and total count as 0. |

---

### 1.1 Get/Search Genres
```http
GET /admin/genres
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Handles genre list search, filtering, and pagination.

**Business Logic:**
- **Fetch**: Uses `QueryBuilder` to fetch genres from the database with support for pagination and search.
- **Aggregation**: For each genre, the system dynamically counts the number of `Content` documents where the `genres` array contains the current **Genre ID**.
- **Sorting**: Defaults to the order of creation if no explicit sort is provided.

**Query Parameters:**
- `search`: Genre name search
- `page`: Pagination page number
- `limit`: Pagination limit

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Genres fetched successfully",
  "pagination": { "page": 1, "limit": 10, "total": 5, "totalPage": 1 },
  "data": [
    {
      "_id": "661e1b2c3d4e5f6a7b8c9d01",
      "name": "Action",
      "description": "Fast-paced movies with physical stunts",
      "contentCount": 120
    }
  ]
}
```

---

### 1.2 Create Genre
```http
POST /admin/genres
Content-Type: application/json
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Creates a new movie/series genre.

**Business Logic:**
- **Validation**: Ensures the genre name is provided and unique.
- **Normalization**: Trims leading and trailing spaces from the name and description.

**Request Body:**
```json
{
  "name": "Thriller",
  "description": "Movies that keep you on the edge of your seat"
}
```

---

### 1.3 Update Genre
```http
PATCH /admin/genres/:genreId
Content-Type: application/json
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Updates an existing genre's details.

**Business Logic:**
- **Update**: Allows partial updates to the name or description.
- **Uniqueness**: If the name is changed, the system ensures the new name does not conflict with an existing genre.

**Request Body:**
```json
{
  "name": "Action & Adventure",
  "description": "High energy movies with stunts and journeys"
}
```

---

### 1.4 Delete Genre
```http
DELETE /admin/genres/:genreId
Authorization: Bearer {{accessToken}} (SUPER_ADMIN)
```

> Removes a genre from the system.

**Business Logic:**
- **Removal**: Permanently deletes the genre record by its ID.

---

## API Status

| # | Endpoint | Status | Notes |
| :--- | :--- | :---: | :--- |
| 1.1 | `GET /admin/genres` | ✅ Done | List with content count (linked by ID) |
| 1.2 | `POST /admin/genres` | ✅ Done | Create new genre |
| 1.3 | `PATCH /admin/genres/:genreId` | ✅ Done | Update name/description |
| 1.4 | `DELETE /admin/genres/:genreId` | ✅ Done | Remove genre |

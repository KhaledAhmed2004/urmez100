# Video Upload Strategy: Cloudflare R2 + Bunny CDN (Complete Setup Guide)

This guide describes a modern, cost-effective, and high-performance method for uploading large video files (e.g., movies, series episodes). We will use **Cloudflare R2** as storage and **Bunny CDN** for delivery/streaming.

---

## 1. Why use this combination?

- **Zero Egress Fees**: No bandwidth costs for downloading files from Cloudflare R2 or sending them to a CDN. This significantly reduces costs compared to AWS S3.
- **Bunny CDN Performance**: Extremely fast and affordable for video streaming.
- **S3 Compatibility**: Cloudflare R2 fully supports the S3 API, so it can be used without major code changes.
- **Resumable & Parallel**: Large files can be uploaded quickly and securely in parts (Multipart).

---

## 2. Cloudflare R2 Setup (Step-by-Step)

### Step 1: Create a Bucket
1. Log in to the Cloudflare dashboard and go to **R2** from the left menu.
2. Click the **Create bucket** button.
3. Provide a unique **Bucket name** (e.g., `Video-Upload-App`).
4. Select `Automatic` for **Location Hint**.
5. Click **Create bucket** to complete.

### Step 2: CORS Configuration (Mandatory for Frontend Uploads)
Setting up CORS is essential for uploading large files directly from the frontend.
1. Go to the **Settings** tab inside your created bucket.
2. Scroll down to the **CORS Policy** section and click **Add CORS Policy**.
3. Paste the following JSON:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```
> *For security: In production, use your actual domain (e.g., `https://your-app.com`) in `AllowedOrigins`.*

### Step 3: Enable Public Access (For Development/Testing)
If you don't have a custom domain yet, you can use the built-in R2 subdomain.
1. In the same **Settings** tab, scroll to the **Public Development URL** section (it's just below Custom Domains).
2. Click the **Allow Access** button.
3. A confirmation box will appear. Type `allow` and click **Confirm**.
4. Once enabled, a URL will appear (e.g., `https://pub-xxxxxx.r2.dev`). **Copy this URL**; this is your **Origin URL** for Bunny CDN.

### Step 4: Create API Keys (Your Warehouse Keys)
**Why?** Your backend code needs a "Username" and "Password" to talk to Cloudflare.

**Where to find your Account ID?**
Before you create the token, look at the **R2 Overview** page (the main R2 page). On the right-hand side, you will see a box labeled **"Account Details"**. Your **Account ID** is listed there. It is a long string of random letters and numbers (e.g., `f1fd991f19...`).

1. Click **Manage R2 API Tokens** (top right).
2. Scroll down to the **User API Tokens** section and click the **Create User API token** button.
3. **Configure the Token:**
   - **Token name:** Give it a name, e.g., `Video-Upload-App`.
   - **Permissions:** Select **Admin Read & Write**. (This is required for uploading, deleting files, and managing buckets).
     - *Alternative (Object Read & Write):* Choose this if you only want to upload files to specific buckets.
   - **TTL (Time to Live):** Select **Forever**.
   - **Client IP Address Filtering:** Leave this default (empty).
4. Click the **Create API Token** button.
5. Copy and save the information displayed:
   - **Access Key ID:** This acts as your User ID.
   - **Secret Access Key:** This is your password (it will only be shown once).
   - **S3 Endpoint:** This is the connection URL (e.g., `https://<account_id>.r2.cloudflarestorage.com`).

---

## 3. Backend Configuration (.env)

Configure your backend's `.env` file with the information you received:

```env
# Cloudflare R2 Credentials
R2_ACCOUNT_ID=your_Account_ID
R2_ACCESS_KEY_ID=your_Access_Key_ID
R2_SECRET_ACCESS_KEY=your_Secret_Access_Key
R2_BUCKET_NAME=Video-Upload-App
R2_S3_API_URL=https://your_Account_ID.r2.cloudflarestorage.com
R2_CUSTOM_DOMAIN=https://your-bunny-cdn-hostname.b-cdn.net
```

---

## 4. Bunny CDN Delivery Setup (Step-by-Step for Client Account)

Since the client (Sajib) has already provided **Zone Access** and credentials, here is exactly what you need to do to link Cloudflare R2 with Bunny CDN:

### Step 1: Log in to Bunny.net
1. Go to [Bunny.net](https://bunny.net/).
2. Use the credentials provided:
   - **Email**: `eeeefefef@gmail.com`
   - **Password**: `4$Qo4=Ct2[Wp2=Oz`

### Step 2: Create the Pull Zone
A "Pull Zone" is what tells Bunny CDN where to find your videos.
1. In the left sidebar, click on **Pull Zones**.
2. Click the **+ Add Pull Zone** button.
3. **Name**: Enter a name like `uremz-video-stream`.
4. **Origin Type**: Keep it as **Default (HTTP/Origin URL)**.
5. **Origin URL**: Enter your Cloudflare R2 Public URL. 
   - **For Development**: Use the **Public Development URL** you enabled in [Step 3](#step-3-enable-public-access-for-developmenttesting) (e.g., `https://pub-xxxxxx.r2.dev`).
   - **For Production**: Use your Custom Domain (e.g., `https://media.yourdomain.com`).
   - **Where to find this?** Go to your Cloudflare Bucket -> **Settings** tab -> scroll down to **Public Development URL**.
6. **Pricing Zones**: Select the regions you want (Global is usually best for speed).
7. Click **Add Pull Zone**.

### Step 3: Link to Backend
Once the zone is created, Bunny will give you a **Hostname** (like `uremz-video-stream.b-cdn.net`). This Hostname is very important as it acts as your delivery URL.

**Why do we need R2_CUSTOM_DOMAIN?**
By default, Cloudflare R2 provides a long, internal URL. However, we want the backend to save the **Bunny CDN URL** in the database so that users get the fastest streaming experience automatically.

1. Go to your `.env` file.
2. Add the following variables (Both are needed: `R2_CUSTOM_DOMAIN` is used by the backend logic to generate URLs, and `BUNNY_CDN_URL` is used for general reference):
   ```env
   # The Hostname provided by Bunny.net (Step 3 above)
   R2_CUSTOM_DOMAIN=https://uremz-video-stream.b-cdn.net
   BUNNY_CDN_URL=https://uremz-video-stream.b-cdn.net
   ```

### Step 4: Final Test
To verify that everything (Cloudflare R2 + Bunny CDN + Backend API) is working correctly, you can run an automated test script.

**How to check:**
1. Ensure your backend server is running (`npm run dev`).
2. Open your terminal in the project root.
3. Run the following command:
   ```bash
   npx ts-node scripts/test-api-upload-flow.ts
   ```
4. **Expected Result:**
   - You should see "Logged in successfully!".
   - It will initiate a multipart upload and upload a dummy chunk.
   - Finally, it will provide a **Bunny CDN Link**.
   - Copy that link and paste it into your browser. If it downloads/plays, your setup is 100% successful!

---

## 5. Frontend Implementation Logic (Step-by-Step)

Uploading large files (e.g., 500MB+) should be done in chunks to avoid timeouts and allow for retry logic. Here is the exact logic the frontend should follow:

### Step 1: Initiate Upload
Get an `uploadId` and a unique `key` (path) from the backend.
- **Endpoint**: `POST /admin/movies/upload/initiate`
- **Payload**: `{ "fileName": "movie.mp4", "contentType": "video/mp4" }`
- **Save**: Keep the `uploadId` and `key` for the next steps.

### Step 2: Slice File & Get Presigned URLs
Divide the file into chunks (Minimum 5MB per chunk, except the last one).
- **Logic**: If the file is 15MB, slice it into 3 parts (Part 1: 0-5MB, Part 2: 5-10MB, Part 3: 10-15MB).
- **Request URLs**: Call `POST /admin/movies/upload/presigned-urls` with the `uploadId`, `key`, and an array of part numbers `[1, 2, 3]`.
- **Response**: You will get an array of URLs.

#### Axios (Lightweight / Custom Implementation)
If you don't want to use a heavy library like Uppy, you can implement the slicing logic using standard JavaScript and Axios:

```javascript
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB minimum

async function uploadVideo(file) {
  // 1. Initiate
  const initRes = await axios.post('/admin/movies/upload/initiate', { 
    fileName: file.name, 
    contentType: file.type 
  });
  const { uploadId, key } = initRes.data.data;

  const totalParts = Math.ceil(file.size / CHUNK_SIZE);
  const uploadedParts = [];

  for (let i = 1; i <= totalParts; i++) {
    const start = (i - 1) * CHUNK_SIZE;
    const end = Math.min(i * CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end); // <--- The Slicing Logic

    // 2. Get Presigned URL for this specific part
    const urlRes = await axios.post('/admin/movies/upload/presigned-urls', { 
      uploadId, key, partNumbers: [i] 
    });
    const { url } = urlRes.data.data[0];

    // 3. Upload Chunk directly to R2
    const uploadRes = await axios.put(url, chunk, {
      headers: { 'Content-Type': file.type }
    });
    
    // Save ETag from headers for completion
    uploadedParts.push({ 
      ETag: uploadRes.headers.etag, 
      PartNumber: i 
    });
  }

  // 4. Complete
  const finalRes = await axios.post('/admin/movies/upload/complete', { 
    uploadId, key, parts: uploadedParts 
  });
  return finalRes.data.data.location; // The Bunny CDN URL
}
```

### Step 3: Upload Chunks Directly to Cloudflare R2
For each part, send a **PUT** request to its corresponding Presigned URL.
- **Method**: `PUT`
- **Body**: The binary chunk (Blob/Buffer).
- **Headers**: `Content-Type: video/mp4`
- **CRITICAL**: After each successful PUT request, Cloudflare returns an **ETag** in the response headers. **You must save this ETag and the PartNumber.**

```javascript
// Example for one chunk
const response = await axios.put(presignedUrl, chunkBlob);
const etag = response.headers.etag; // Save this!
```

### Step 4: Complete Upload
Once all chunks are uploaded, notify the backend to merge them.
- **Endpoint**: `POST /admin/movies/upload/complete`
- **Payload**:
  ```json
  {
    "uploadId": "...",
    "key": "...",
    "parts": [
      { "ETag": "etag_from_part_1", "PartNumber": 1 },
      { "ETag": "etag_from_part_2", "PartNumber": 2 }
    ]
  }
  ```
- **Result**: The backend will return the final **Bunny CDN URL**. Use this URL to save the movie/content metadata.

---

## 6. Security Tips
- **Presigned URLs**: These URLs expire after 1 hour. If an upload takes longer, request new ones.
- **CORS**: Ensure the R2 bucket CORS policy allows `PUT` and `ExposeHeaders: ["ETag"]` (Already covered in [Section 2, Step 2](#step-2-cors-configuration-mandatory-for-frontend-uploads)).---

## 7. How to Test via Postman (Step-by-Step)

If you want to test the full flow without a frontend, follow these steps in Postman:

### 1. Initiate
- **POST** `{{baseUrl}}/admin/movies/upload/initiate`
- **Body**: `{ "fileName": "test.mp4", "contentType": "video/mp4" }`
- **Result**: Copy `uploadId` and `key`.

### 2. Get Presigned URL
- **POST** `{{baseUrl}}/admin/movies/upload/presigned-urls`
- **Body**: `{ "uploadId": "...", "key": "...", "partNumbers": [1] }`
- **Result**: Copy the `url`.

### 3. Upload the File (The Binary Part)
- Open a **NEW TAB** in Postman.
- **PUT** the `url` you just copied.
- **Body**: Select `binary` -> Choose a small file from your PC.
- **Headers**: Add `Content-Type: video/mp4`.
- **Send**: After success, go to the **Headers tab of the Response**.
- **CRITICAL**: Copy the value of the `ETag` header (e.g., `6bda72db...`).

### 4. Complete
- **POST** `{{baseUrl}}/admin/movies/upload/complete`
- **Body**:
  ```json
  {
    "uploadId": "...",
    "key": "...",
    "parts": [
      { "ETag": "your_copied_etag", "PartNumber": 1 }
    ]
  }
  ```
- **Result**: You will get the final Bunny CDN URL!

---

> **Tip:** Always use the Bunny CDN URL in your player to reduce buffering.

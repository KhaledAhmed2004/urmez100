# Infrastructure & Configuration Changes Log (Banglish Version)

Ei file-e amra infrastructure ba storage-e ja ja change korechi shegulo track kora hoyeche jate pore sohoje bujha jay.

---

## [2026-06-07] - BunnyCDN Bypass (Emergency Fix)

### **Somossya (Issue)**
- **Problem:** Video ebong image playback cholchilo na, browser-e "403 Forbidden" error ashchilo.
- **Error Details:** Domain hit korle bolchilo "Domain suspended or not configured".
- **Karon (Diagnosis):** BunnyCDN-er `uremz-video-stream.b-cdn.net` zone-ti suspend hoye geche. Somvoboto account-e balance ($0) sesh hoye geche ba trial expire hoyeche.

### **Amra ja korechi (Actions Taken)**
1.  **Investigation:** Cloudflare R2 check kore dekhlam file gulo okhane thikmotoi ache.
2.  **Noton Zone Attempt:** BunnyCDN-e noton ekta zone kholar chesta korechi kintu account-e permission/balance na thakay seta hoyni.
3.  **Final Fix:** BunnyCDN-ke bypass kore sorasori Cloudflare R2-er public URL use korar decision niyechi jate video playback chalu hoy.
4.  **Config Update:** `.env` file-e BunnyCDN-er link-er bodole Cloudflare-er public link boshiye diyechi.
5.  **Code Refactor:** Movies-er moto Series, Season, ebong Episode-er upload flow-o update korechi jate poster ebong videos sorasori Cloudflare R2-te save hoy.

### **Code-e ja change kora hoyeche**
- **Routes Update:** `AdminRoutes`-e `fileUploadHandler` (local storage) replace kore `fileHandler` (R2 storage) use kora hoyeche Series, Season, ebong Episode creation/update-er jonno.
- **Controller Update:** `AdminController`-e logic update kora hoyeche jate seta R2-theke asha URLs gulo thikmoto handle korte pare.

### **`.env` file-er change**
- **Ager Value:** `R2_CUSTOM_DOMAIN=https://uremz-video-stream.b-cdn.net`
- **Noton Value:** `R2_CUSTOM_DOMAIN=https://pub-085e3de5d2824de0bd78d99ef319730e.r2.dev`
- **Keno?** Jate video gulo BunnyCDN-er opor nirvortona kore sorasori Cloudflare theke load hoy.

### **Fofafol (Impact)**
- **Noton Upload:** Ekhon theke ja kichu upload korben, sob perfectly cholbe.
- **Purono Upload:** Database-e ager ja records ache (b-cdn.net link shoho), shegulo BunnyCDN active na hoya porjonto cholbe na.

---

## Pore BunnyCDN-e ferot jabo kibabe?
Jokhon BunnyCDN account-e balance add kora hobe ebong zone "Active" hobe:
1.  `.env` file-e jan.
2.  `R2_CUSTOM_DOMAIN` ta abar `https://uremz-video-stream.b-cdn.net` kore din.
3.  Bas, tarpor theke abar sob high-speed CDN diye cholbe.

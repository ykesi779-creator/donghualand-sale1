# 🎬 DonghuaLand

**A high-performance Chinese animation (Donghua) streaming platform.**  
Built with **Hono + TypeScript + Cloudflare Pages + D1 SQLite**.

---

## 📱 Mobile-First Deployment (No PC Required)

This project is designed to be deployed entirely through your mobile browser using the GitHub and Cloudflare web interfaces.

### 1. GitHub Setup
1. Create a **New Repository** on [GitHub](https://github.com) (e.g., `donghualand`).
2. Upload all project files to the repository.
3. Keep this tab open.

### 2. Create the Database (Cloudflare Dashboard)
1. Log in to [Cloudflare](https://dash.cloudflare.com).
2. Go to **Workers & Pages** > **D1**.
3. Tap **Create Database** > **Dashboard**.
4. Name it `donghualand-production` and tap **Create**.
5. **Copy the `Database ID`** (the long string of letters and numbers).

### 3. Update Configuration on GitHub
1. Go back to your GitHub repository.
2. Open the file `wrangler.jsonc`.
3. Tap the **Edit (pencil)** icon.
4. Replace `YOUR_DATABASE_ID_HERE` with the ID you copied in Step 2.
5. Tap **Commit changes**.

### 4. Setup Database Tables (SQL)
Since you cannot use a terminal, follow these steps:
1. On GitHub, open `migrations/0001_initial_schema.sql`.
2. **Copy** all the text inside that file.
3. Go back to the **Cloudflare D1 Dashboard**.
4. Tap your database (`donghualand-production`).
5. Go to the **Console** tab.
6. **Paste** the SQL code into the box and tap **Execute**.
   * *This manually creates your tables (Anime, Episodes, Users).*

### 5. Deploy to Cloudflare Pages
1. In Cloudflare, go to **Workers & Pages** > **Overview**.
2. Tap **Create** > **Pages** > **Connect to Git**.
3. Select your `donghualand` repository.
4. **Build Settings:**
   * **Framework preset:** `None`
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
5. Tap **Save and Deploy**. (The first build might fail—we need to add secrets next).

### 6. Link Database and Secrets
1. In your Pages project settings, go to **Settings** > **Functions**.
2. Scroll to **D1 database bindings** > **Add binding**.
   * **Variable name:** `DB`
   * **D1 database:** Select `donghualand-production`.
3. Go to **Settings** > **Environment Variables** > **Add variable**.
   * `ADMIN_USERNAME`: (Your chosen username)
   * `ADMIN_PASSWORD`: (Your chosen password)
   * `JWT_SECRET`: (Any long random string)
   * `TMDB_API_KEY`: (Optional - from themoviedb.org)
4. Tap **Save**.
5. Go to the **Deployments** tab and select **Retry deployment**.

---

## ✨ Features

### Public Site
- 🎠 **Hero Slider**: Automatic rotating slider for Featured anime.
- 🔥 **Curated Sections**: Sections for Trending and Popular anime.
- 📅 **Weekly Schedule**: Real-time airing schedule based on the database.
- 🔍 **Advanced Search**: Filter by genre, year, status, or title.
- 📱 **Fully Responsive**: Optimized for mobile and desktop viewing.
- 👤 **User Features**: Watchlists, watch history, and account management.

### Admin Panel (`/admin`)
- 📊 **Dashboard Stats**: See total views, users, and content at a glance.
- 🎬 **Anime Management**: Full CRUD (Create, Read, Update, Delete).
- 🔗 **TMDB Import**: Automatically fetch data from TheMovieDB.
- 📺 **Episode Control**: Add embed links or direct MP4 URLs.
- 💬 **Moderation**: Manage comments and ban/unban users.

---

## 🛠 Project Structure

```text
├── src/
│   ├── index.ts          # Entry point & Routes
│   ├── pages/            # HTML Templates (JSX-like Hono)
│   ├── routes/           # API Endpoints (Admin, Anime, Users)
│   └── utils/            # Auth & Helper functions
├── public/               # CSS, JS, and Images
├── migrations/           # SQL Database Schema
├── wrangler.jsonc        # Cloudflare Configuration
└── package.json          # Build Scripts & Deps
```

---

## 🔐 Environment Variables (Secrets)

| Variable | Required | Description |
| :--- | :--- | :--- |
| `ADMIN_USERNAME` | Yes | Username to access `/admin` |
| `ADMIN_PASSWORD` | Yes | Password to access `/admin` |
| `JWT_SECRET` | Yes | Secret string for login security |
| `TMDB_API_KEY` | No | Enables auto-fill data for anime |
| `CLOUDINARY_CLOUD_NAME`| No | Enables image uploads to Cloudinary |

---

## 🗄 Database Schema

| Table | Purpose |
| :--- | :--- |
| `anime` | Core data (title, cover, banner, status, etc.) |
| `episodes` | Video links and metadata |
| `users` | User registration and auth |
| `watchlist` | User-saved anime |
| `schedule` | Airing days for Donghua |
| `comments` | User feedback and discussion |

---

## 🔧 Troubleshooting (Mobile)

**1. Site shows "Error: DB not found"**
* Go to Cloudflare Pages > Settings > Functions. Ensure the D1 binding name is exactly `DB` and it is linked to `donghualand-production`.

**2. Images not showing**
* Ensure you are using a direct image link (ending in `.jpg` or `.png`). If using Cloudinary, check your API credentials.

**3. Build Failed**
* Check the Cloudflare build logs. Ensure your `package.json` has the command `"build": "hono-tsc"`.

**4. Admin Login Failed**
* Double-check your Environment Variables in Cloudflare. After changing them, you **must** redeploy the site for changes to take effect.

---

## 🚀 Updating the Site
When you want to change the code:
1. Edit the files directly on **GitHub.com**.
2. Commit the changes.
3. Cloudflare will automatically detect the change and start a new deployment.

---

**Built with ❤️by Salman.**
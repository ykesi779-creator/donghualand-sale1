# 🎬 DonghuaLand

**A complete Chinese animation (Donghua) streaming website** built with Hono + TypeScript + Cloudflare Pages + D1 SQLite database.

---

## 📋 Table of Contents

1. [What This Site Does](#-what-this-site-does)
2. [Features](#-features)
3. [Project Structure](#-project-structure)
4. [Quick Start (Local Development)](#-quick-start-local-development)
5. [Step-by-Step: Upload to GitHub](#-step-by-step-upload-to-github)
6. [Step-by-Step: Deploy to Cloudflare](#-step-by-step-deploy-to-cloudflare)
7. [Cloudflare Environment Variables (Secrets)](#-cloudflare-environment-variables-secrets)
8. [How to Use the Admin Panel](#-how-to-use-the-admin-panel)
9. [Database Schema](#-database-schema)
10. [API Reference](#-api-reference)
11. [Troubleshooting](#-troubleshooting)
12. [FAQ](#-faq)

---

## 🎯 What This Site Does

DonghuaLand is a **streaming site for Chinese anime (Donghua)**. It lets you:

- **Display anime** with beautiful hero slider, trending/popular sections
- **Stream episodes** using embed URLs (Streamtape, Mega, etc.) or direct MP4 links
- **Browse and search** anime by genre, status, type, year
- **Register/login** as a user with watchlist and watch history
- **Manage everything** from a secure admin panel at `/admin`

All content is stored in a **Cloudflare D1 SQLite database** — no dummy data, 100% real database.

---

## ✨ Features

### Public Website
- 🎠 **Hero Slider** — shows Featured anime (up to 5 slides, auto-rotating)
- 🔥 **Trending Section** — anime marked as Trending
- ⭐ **Popular Section** — anime marked as Popular
- 🕐 **Recent Episodes** — most recently updated anime
- 📅 **Weekly Schedule** — shows airing days and times
- 🔍 **Search** — filter by title, genre, status, type, year
- 📺 **Video Player** — supports embed URLs (iframe) and direct MP4
- 📱 **Mobile Ready** — fully responsive with bottom navigation bar
- 👤 **User Accounts** — register, login, watchlist, watch history

### Admin Panel (`/admin`)
- 🔐 **Secure Login** — credentials from Cloudflare environment variables
- 📊 **Dashboard** — stats: total anime, episodes, users, views, comments
- ➕ **Add/Edit/Delete Anime** — full CRUD with image previews
- 🔗 **TMDB Integration** — auto-fill anime data from TheMovieDB.org
- 🎬 **Episode Management** — add/edit/delete episodes with embed URLs
- 👥 **User Management** — view users, ban/unban
- 📅 **Schedule Management** — set weekly airing days
- 💬 **Comment Moderation** — approve/reject/delete comments
- ⚙️ **Site Settings** — site name, maintenance mode, registration toggle
- ☁️ **Cloudinary** — optional image hosting integration

---

## 📁 Project Structure

```
donghualand/
├── src/
│   ├── index.ts              # Main app entry - all page routes
│   ├── routes/
│   │   ├── admin.ts          # Admin API (login, CRUD, settings)
│   │   ├── anime.ts          # Public anime API
│   │   ├── episodes.ts       # Episodes API
│   │   ├── users.ts          # User auth (register/login)
│   │   ├── comments.ts       # Comments API
│   │   ├── search.ts         # Search API
│   │   ├── tmdb.ts           # TMDB integration
│   │   └── upload.ts         # Cloudinary image upload
│   ├── pages/
│   │   ├── layout.ts         # Main HTML layout (header/footer)
│   │   ├── home.ts           # Home page (hero, trending, etc.)
│   │   ├── anime.ts          # Anime detail page
│   │   ├── watch.ts          # Episode watch page
│   │   ├── adminPanel.ts     # Admin login + panel pages
│   │   ├── search.ts         # Search results page
│   │   ├── schedule.ts       # Weekly schedule page
│   │   └── ...               # Other pages
│   └── utils/
│       ├── auth.ts           # JWT tokens, password hashing
│       └── helpers.ts        # Utility functions
├── public/
│   └── static/
│       ├── app.js            # Frontend JavaScript
│       ├── admin.js          # Admin panel JavaScript
│       └── style.css         # CSS styles
├── migrations/
│   └── 0001_initial_schema.sql  # Database tables
├── .dev.vars                 # LOCAL development secrets (never commit!)
├── .gitignore                # Files NOT uploaded to GitHub
├── wrangler.jsonc            # Cloudflare configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

---

## 🚀 Quick Start (Local Development)

### Requirements
- **Node.js** v18 or newer → [Download](https://nodejs.org)
- **npm** (comes with Node.js)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Create local secrets file
cp .env.example .dev.vars
# Edit .dev.vars and set your credentials:
# ADMIN_USERNAME=admin
# ADMIN_PASSWORD=your-secure-password
# JWT_SECRET=any-random-long-string-at-least-32-chars

# 3. Set up local database
npm run db:migrate:local

# 4. Build the project
npm run build

# 5. Start development server
npx wrangler pages dev dist --ip 0.0.0.0 --port 3000
```

Open **http://localhost:3000** in your browser.
Admin panel: **http://localhost:3000/admin**

---

## 📤 Step-by-Step: Upload to GitHub

> **Beginner tip:** GitHub is where you store your code online. You need a free account at [github.com](https://github.com).

### Step 1: Install Git

- **Windows:** Download from [git-scm.com](https://git-scm.com) and install
- **Mac:** Run `git --version` in Terminal (it will prompt to install)
- **Linux:** `sudo apt install git`

### Step 2: Create GitHub Account

1. Go to [github.com](https://github.com)
2. Click **Sign up** and create a free account
3. Verify your email

### Step 3: Create a New Repository

1. Click the **+** icon (top right) → **New repository**
2. Repository name: `donghualand` (or any name you like)
3. Select **Private** (recommended for your streaming site)
4. **Do NOT** check "Add a README file" — you already have one
5. Click **Create repository**

### Step 4: Connect and Push Your Code

Open your terminal/command prompt in the `donghualand` folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - DonghuaLand streaming site"

# Connect to your GitHub repository
# Replace YOUR_USERNAME with your GitHub username
# Replace YOUR_REPO with your repository name
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

GitHub will ask for your username and password.
> **Note:** If you have 2FA enabled, use a [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) instead of your password.

### Step 5: Verify Upload

Go to `https://github.com/YOUR_USERNAME/YOUR_REPO` — you should see all your files!

---

## ☁️ Step-by-Step: Deploy to Cloudflare

> **Beginner tip:** Cloudflare Pages hosts your website for FREE with unlimited bandwidth.

### Step 1: Create Cloudflare Account

1. Go to [cloudflare.com](https://cloudflare.com)
2. Click **Sign Up** and create a free account
3. Verify your email

### Step 2: Install Wrangler CLI

Wrangler is Cloudflare's command-line tool. Install it globally:

```bash
npm install -g wrangler
```

### Step 3: Login to Cloudflare

```bash
wrangler login
```
This opens your browser — click **Allow** to authorize.

### Step 4: Create the D1 Database

```bash
wrangler d1 create donghualand-production
```

You will see output like this:
```
✅ Successfully created DB 'donghualand-production'

[[d1_databases]]
binding = "DB"
database_name = "donghualand-production"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Copy the `database_id`** — you need it in the next step.

### Step 5: Update wrangler.jsonc

Open `wrangler.jsonc` and find this section:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "donghualand-production",
    "database_id": "YOUR_DATABASE_ID_HERE"
  }
]
```

Replace `YOUR_DATABASE_ID_HERE` with the ID you copied in Step 4.

### Step 6: Apply Database Migrations

This creates all the tables in your production database:

```bash
wrangler d1 migrations apply donghualand-production
```

You should see:
```
✅ Applied migration 0001_initial_schema.sql
```

### Step 7: Build the Project

```bash
npm run build
```

### Step 8: Create Cloudflare Pages Project

```bash
wrangler pages project create donghualand --production-branch main
```

### Step 9: Deploy to Cloudflare Pages

```bash
wrangler pages deploy dist --project-name donghualand
```

After deployment, you'll get a URL like:
- `https://donghualand.pages.dev`
- `https://xxxxxxxx.donghualand.pages.dev`

### Step 10: Set Environment Secrets

These are your **secret settings** that Cloudflare stores securely. Run each command and type the value when prompted:

```bash
# Admin username (what you use to login to /admin)
wrangler pages secret put ADMIN_USERNAME --project-name donghualand

# Admin password (make it strong!)
wrangler pages secret put ADMIN_PASSWORD --project-name donghualand

# JWT secret (any long random string, e.g. a UUID)
wrangler pages secret put JWT_SECRET --project-name donghualand
```

**Optional secrets** (for TMDB auto-fill and image uploads):
```bash
# For TMDB anime data auto-fill (free at themoviedb.org)
wrangler pages secret put TMDB_API_KEY --project-name donghualand

# For Cloudinary image hosting (free at cloudinary.com)
wrangler pages secret put CLOUDINARY_CLOUD_NAME --project-name donghualand
wrangler pages secret put CLOUDINARY_API_KEY --project-name donghualand
wrangler pages secret put CLOUDINARY_API_SECRET --project-name donghualand
```

### Step 11: Bind D1 Database to Pages Project

Go to [Cloudflare Dashboard](https://dash.cloudflare.com):

1. Click **Workers & Pages** in the left menu
2. Click on your **donghualand** project
3. Click **Settings** tab
4. Click **Functions** section
5. Scroll to **D1 database bindings**
6. Click **Add binding**
7. Variable name: `DB`
8. D1 database: select `donghualand-production`
9. Click **Save**

### Step 12: Redeploy

After adding the D1 binding, redeploy so it takes effect:

```bash
wrangler pages deploy dist --project-name donghualand
```

### Step 13: Verify Everything Works

Visit your site URL and test:
- ✅ Home page loads: `https://donghualand.pages.dev`
- ✅ Admin login: `https://donghualand.pages.dev/admin`
- ✅ Login with your ADMIN_USERNAME and ADMIN_PASSWORD

---

## 🔐 Cloudflare Environment Variables (Secrets)

| Variable | Required | Description | How to Get |
|---|---|---|---|
| `ADMIN_USERNAME` | ✅ Yes | Your admin login username | Choose any username |
| `ADMIN_PASSWORD` | ✅ Yes | Your admin login password | Choose a strong password |
| `JWT_SECRET` | ✅ Yes | Secret for secure tokens | Generate: `openssl rand -hex 32` |
| `TMDB_API_KEY` | Optional | For auto-filling anime data | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) |
| `CLOUDINARY_CLOUD_NAME` | Optional | Cloud name for image uploads | [cloudinary.com/console](https://cloudinary.com/console) |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API key | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Optional | Cloudinary API secret | Cloudinary Dashboard |

### How to Set Secrets

**Via Cloudflare Dashboard:**
1. Go to Workers & Pages → your project → Settings → Environment Variables
2. Click **Add variable** under "Production"
3. Check **Encrypt** box for sensitive values

**Via Wrangler CLI:**
```bash
wrangler pages secret put VARIABLE_NAME --project-name donghualand
```

---

## 🛠 How to Use the Admin Panel

### Accessing the Admin Panel

1. Go to `https://your-site.pages.dev/admin`
2. Enter your `ADMIN_USERNAME` and `ADMIN_PASSWORD`
3. You're in! The admin panel has these sections:

### Dashboard
Shows statistics: total anime, episodes, users, views, comments.
Also shows your most recently added anime.

### Anime List
- See all your anime in a table
- Use the search box to filter
- Click **Edit** to modify an anime
- Click **Del** to delete (also deletes all its episodes)
- Click **EPs** to manage episodes for that anime

### Add Anime
Use this form to add new Donghua/anime:

| Field | Description |
|---|---|
| Title | The main display title (required) |
| Native Title | Original Chinese title (e.g., 斗破苍穹) |
| English Title | English translated title |
| Slug | URL identifier - auto-generated from title |
| Type | ONA, TV, Movie, OVA, etc. |
| Status | Ongoing, Completed, or Upcoming |
| Year | Release year |
| Rating | 0.0 to 10.0 |
| Description | Anime synopsis/description |
| Cover Image | Portrait image URL (poster) |
| Banner Image | Wide landscape image URL (hero background) |
| Trailer URL | YouTube or video URL |
| Genres | Comma-separated: Action, Fantasy, Romance |
| Studios | Comma-separated animation studio names |
| **Featured** ✅ | Shows in the **Hero Slider** on home page |
| **Trending** ✅ | Shows in the **Trending** section |
| **Popular** ✅ | Shows in the **Popular** section |

**TMDB Auto-Fill:**
If you have a TMDB API key set, you can search for anime by name and auto-fill all fields automatically!

### Episodes
1. Select an anime from the dropdown
2. Fill in: Episode Number, Title, Embed URL or Direct Video URL
3. Click **Add Episode**
4. Episodes appear in the list below — click **Edit** or **Del**

**Video URL Types:**
- **Embed URL**: Any iframe-compatible embed (Streamtape, Mega, etc.) — recommended
- **Direct Video URL**: Direct `.mp4` link — use for self-hosted videos

### Users
- See all registered users
- **Ban** a user to prevent them from logging in
- **Unban** to restore access

### Schedule
- Add anime to the weekly airing schedule
- Select anime, pick a day (Monday-Sunday), optionally add air time
- The schedule appears on the home page and `/schedule` page

### Settings
- **Site Name**: Displayed in header and browser tab
- **Registration**: Enable/disable new user registrations
- **Maintenance Mode**: Show maintenance page to visitors

### Change Password
- You can change your admin password from the Settings tab
- Note: The new password is stored in the database. The env var `ADMIN_PASSWORD` still takes priority — if you want the new password to work as primary, also update the Cloudflare secret.

---

## 🗄 Database Schema

The D1 database has these tables:

| Table | Purpose |
|---|---|
| `anime` | All anime information (title, images, flags, etc.) |
| `episodes` | All episodes with embed/video URLs |
| `users` | Registered user accounts |
| `admins` | Admin accounts (for password change feature) |
| `watchlist` | User watchlist (anime_id + user_id) |
| `watch_history` | What episodes each user has watched |
| `comments` | User comments on anime/episodes |
| `comment_likes` | Which users liked which comments |
| `schedule` | Weekly airing schedule |
| `settings` | Site configuration settings |

### Key Anime Fields

```sql
is_featured  -- 1 = shows in Hero Slider
is_trending  -- 1 = shows in Trending section
is_popular   -- 1 = shows in Popular section
status       -- 'Ongoing', 'Completed', 'Upcoming'
```

---

## 📡 API Reference

### Public APIs (no auth needed)

| Method | URL | Description |
|---|---|---|
| GET | `/api/anime` | List anime (with pagination) |
| GET | `/api/anime/:slug` | Get anime details + episodes |
| GET | `/api/episodes/anime/:id` | Get episodes for an anime |
| GET | `/api/search?q=...` | Search anime |
| GET | `/api/schedule` | Weekly schedule |

### Admin APIs (requires Bearer token)

Get a token first:
```bash
curl -X POST /api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpassword"}'
```

Then use: `Authorization: Bearer YOUR_TOKEN`

| Method | URL | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET/POST | `/api/admin/anime` | List / Add anime |
| PUT/DELETE | `/api/admin/anime/:id` | Update / Delete anime |
| GET/POST | `/api/admin/episodes` | List / Add episodes |
| PUT/DELETE | `/api/admin/episodes/:id` | Update / Delete episode |
| GET | `/api/admin/users` | List users |
| POST | `/api/admin/users/:id/ban` | Ban user |
| POST | `/api/admin/users/:id/unban` | Unban user |
| GET/POST | `/api/admin/schedule` | Schedule management |
| GET/POST | `/api/admin/settings` | Site settings |
| POST | `/api/admin/change-password` | Change admin password |

---

## 🔧 Troubleshooting

### "Admin login not working"
- Check that `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set as Cloudflare secrets
- In local dev, check your `.dev.vars` file has these set correctly
- Make sure there are no extra spaces in the values

### "Database not configured / no content showing"
- Make sure the D1 database is **bound** to your Pages project (Settings → Functions → D1 bindings)
- The variable name must be exactly `DB`
- After adding the binding, you MUST redeploy

### "Hero slider / sections not showing"
- This is correct behavior when the database is empty
- You need to add anime via the admin panel
- For anime to show in the hero, check the **Featured** checkbox when adding

### "Migrations failed"
```bash
# Reset local database and re-apply migrations
npm run db:reset

# For production, apply manually:
wrangler d1 migrations apply donghualand-production
```

### "Build failed"
```bash
# Clean install
rm -rf node_modules dist
npm install
npm run build
```

### "Wrangler login failed"
```bash
# Try logging out and back in
wrangler logout
wrangler login
```

### "TMDB not working"
- TMDB API key needs to be set: `wrangler pages secret put TMDB_API_KEY`
- Get a free key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- After setting, redeploy: `npm run build && wrangler pages deploy dist --project-name donghualand`

---

## ❓ FAQ

**Q: Will my hero slider and sections show after I add anime?**
> YES! When you add anime and check "Featured", "Trending", "Popular" checkboxes, those sections automatically appear on the home page with your real anime.

**Q: Can I use this with my own domain?**
> Yes! In Cloudflare Dashboard → Workers & Pages → your project → Custom Domains → Add domain.

**Q: Is it free to host?**
> Yes! Cloudflare Pages Free plan includes:
> - Unlimited bandwidth
> - 500 builds/month
> - D1 database: 5GB storage, 25M reads/day, 50K writes/day
> This is more than enough for a streaming site.

**Q: How do I add videos?**
> The easiest way is to use video hosting services:
> - **Streamtape.com** — upload your video, get an embed URL
> - **Mega.nz** — upload and embed
> - **Google Drive** — share publicly and embed
> Paste the embed URL in the Episode's "Embed URL" field.

**Q: How do I update my site after making changes?**
```bash
git add .
git commit -m "Updated something"
git push origin main
npm run build
wrangler pages deploy dist --project-name donghualand
```

**Q: Is my admin password secure?**
> Yes. Credentials are stored as encrypted Cloudflare secrets, never in your code or git repository. When you change the password in admin panel, it's stored as a secure hash in the database.

**Q: Can multiple people use the admin panel?**
> Currently there is one admin account (from env vars). For multiple admins, you would need to add admin management features.

---

## 🚀 Deployment Summary

```
Site URL:    https://donghualand.pages.dev
Admin URL:   https://donghualand.pages.dev/admin
Platform:    Cloudflare Pages
Database:    Cloudflare D1 (SQLite)
Runtime:     Cloudflare Workers (Edge)
Framework:   Hono v4 + TypeScript
```

---

## 📝 Changelog

### v1.0.0 (Current)
- ✅ Full Cloudflare D1 database integration
- ✅ All demo/dummy data removed
- ✅ Admin panel moved to /admin (no button on public site)
- ✅ Admin credentials from Cloudflare environment variables
- ✅ Full CRUD for anime, episodes, schedule, comments, users
- ✅ Hero slider, trending, popular sections from real database
- ✅ TMDB auto-fill integration
- ✅ Cloudinary image upload support
- ✅ Mobile-responsive design with bottom navigation
- ✅ User registration, login, watchlist, history
- ✅ Bug fixes: editAnime API format, title_english, studios fields, episode edit with air_date

---

*Built for streaming Chinese animation online. All content managed through the admin panel.*

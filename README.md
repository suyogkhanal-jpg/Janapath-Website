# Janapath Secondary School — Official Website

Production-ready Next.js website for **Janapath Secondary School**, Kalanki-14, Kathmandu, Nepal.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **Supabase** (PostgreSQL — primary database when configured)
- **MongoDB + Mongoose** (optional legacy fallback — in-memory store if neither is set)
- **JWT Auth** (admin panel)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and add Supabase credentials
cp .env.example .env.local

# 3. (First time) Run schema in Supabase SQL Editor if tables are missing
#    File: supabase/schema.sql

# 4. Test database connection
npm run db:test

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin Panel

- URL: [http://localhost:3000/admin](http://localhost:3000/admin)
- Email: `admin@janapath.com`
- Password: `admin1234`

## Project Structure

```
janapath-secondary-school/
├── app/
│   ├── layout.js              # Root layout (fonts, theme)
│   ├── page.js                # Home page
│   ├── about/page.js          # About page
│   ├── academics/page.js      # Academics + Computer Engineering
│   ├── notices/page.js        # Notices & news
│   ├── gallery/page.js        # Photo gallery with lightbox
│   ├── contact/page.js        # Contact form + map
│   ├── admin/
│   │   ├── page.js            # Admin login
│   │   └── dashboard/page.js  # Admin dashboard
│   └── api/
│       ├── auth/route.js      # POST login
│       ├── notices/route.js   # CRUD notices
│       ├── contact/route.js   # POST contact form
│       └── gallery/route.js   # CRUD gallery
├── components/
│   ├── Navbar.jsx             # Sticky nav + mobile menu
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── Highlights.jsx
│   ├── NoticesPreview.jsx
│   ├── PrincipalMessage.jsx
│   ├── GalleryPreview.jsx
│   ├── AnnouncementTicker.jsx
│   ├── ThemeProvider.jsx      # Dark mode
│   └── SiteShell.jsx
├── lib/
│   ├── data.js                # Static school content
│   ├── mongodb.js             # DB connection
│   ├── auth.js                # JWT helpers
│   ├── api.js                 # API utilities
│   └── memoryStore.js         # Fallback when no MongoDB
├── models/
│   ├── Notice.js
│   ├── Contact.js
│   └── Gallery.js
└── public/                    # Static assets
```

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notices` | No | List notices |
| POST | `/api/notices` | Admin | Create notice |
| PUT | `/api/notices` | Admin | Update notice |
| DELETE | `/api/notices?id=` | Admin | Delete notice |
| POST | `/api/contact` | No | Submit contact form |
| GET | `/api/gallery` | No | List gallery images |
| POST | `/api/gallery` | Admin | Add gallery item |
| DELETE | `/api/gallery?id=` | Admin | Delete gallery item |
| POST | `/api/auth` | No | Admin login |

## MongoDB (Optional)

Without `MONGODB_URI`, the app uses an **in-memory store** with seed data (works out of the box for demo).

To use MongoDB:

1. Install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Set in `.env.local`:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/janapath-school
   JWT_SECRET=your-secret-key
   ADMIN_EMAIL=admin@janapath.com
   ADMIN_PASSWORD=your-secure-password
   ```

## Features

- Premium responsive UI (mobile-first)
- Dark mode toggle
- Announcement ticker
- Computer Engineering technical stream section
- Dynamic notices system
- Contact form with validation
- Gallery with lightbox
- Admin dashboard (notices + gallery management)
- SEO metadata
- Loading skeletons

## Production Build

```bash
npm run build
npm start
```

## License

© Janapath Secondary School. All rights reserved.

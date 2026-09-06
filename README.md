# TaskFlow — Project Management SaaS

MERN-stack team project management app: workspaces, projects, Kanban boards, tasks, comments, and activity tracking. Auth supports email/password and Google Sign-In (Firebase).

## Run locally

**Prerequisites:** Node.js 18+, a MongoDB URI (Atlas or local)

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in:
   - `MONGODB_URI`, `JWT_SECRET`
   - Firebase Admin vars (`FIREBASE_SERVICE_ACCOUNT` or the 3 individual fields) — for Google Sign-In verification
   - `VITE_FIREBASE_*` vars — for the frontend Google Sign-In button
3. Run the app:
   ```
   npm run dev
   ```
   Open http://localhost:3000

## Deploying to Vercel

This repo is already configured for Vercel (`vercel.json` + `api/index.js` serverless function wrapping the Express API; the React app builds to `dist/` as static output).

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. In the Vercel project's **Environment Variables**, add everything from your `.env`:
   - `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`
   - `FIREBASE_SERVICE_ACCOUNT` (paste the whole service-account JSON as one line) — or the 3 individual `FIREBASE_*` fields
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
4. Deploy. Vercel runs `npm run build` and serves `dist/` as static, with `/api/*` routed to the serverless function.
5. After deploy, update the canonical/OG URLs in `index.html` and `public/robots.txt` / `public/sitemap.xml` to your real Vercel domain.
6. In the Firebase Console, add your Vercel domain under **Authentication → Settings → Authorized domains** (otherwise Google Sign-In popup will be blocked on the live domain).

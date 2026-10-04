# QuickShare

QuickShare is a full-stack community marketplace for sharing useful items, help, and local information. It uses a React/Vite client, an Express API, and MongoDB Atlas for persistent user, post, and bookmark data.

## Requirements

- Node.js 20 or newer and npm
- A MongoDB Atlas cluster and a database user

## Run locally

1. In the project root, install all workspace dependencies:

   ```bash
   npm install
   ```

2. Create `server/.env` from `server/.env.example` (PowerShell: `Copy-Item server\.env.example server\.env`). Open it with `notepad server\.env`. Set `MONGODB_URI` to your Atlas connection string, keep `MONGODB_DB_NAME=quickshare` (or choose another database name), set a unique random `JWT_SECRET` (at least 32 characters), and set `CLIENT_URL=http://localhost:5173`. For example, generate a secret in PowerShell with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`. The example values are placeholders and must be replaced; the API will not start with them.

   In Atlas, allow your development IP under **Network Access** and create a database user under **Database Access**. URL-encode special characters in the database user's password before inserting it into the connection string. QuickShare uses the `quickshare` database by default; MongoDB creates the database and its collections on the first account or post write.

3. The Vite development server proxies `/api` and `/uploads` to `http://127.0.0.1:5000`, so the default local setup needs no client `.env`. If the API runs at a different address, create `client/.env` from `client/.env.example` and set `VITE_API_URL` to its `/api` URL. The web app and API should use the same browser host (for example, use `localhost` consistently); the Vite proxy avoids local CORS issues.

4. Start the API and client together:

   ```bash
   npm run dev
   ```

   Open <http://localhost:5173>. Confirm the API printed a MongoDB connection message before creating your own account. QuickShare does not ship with demo users or posts. If the API fails its Atlas connection, signup/login and all database-backed pages remain unavailable until the URI, Atlas database user, and IP access list are correct.

If you created or changed `server/.env` while `npm run dev` was already running, stop the process with `Ctrl+C` and run `npm run dev` again so the API reloads its environment.

To build the client run `npm run build`. To start only the API in production mode run `npm start` from the project root. The API serves uploaded post/profile images from `server/uploads`; back up this directory if you need to preserve uploaded media.

## Environment variables

See `server/.env.example` and `client/.env.example`. The API refuses to start without a MongoDB URI and a sufficiently long JWT secret, and only begins listening once MongoDB connects. Never commit `.env` files.

## Features

- Account registration, password hashing, JWT login and protected API routes
- Search and category filtering over MongoDB-backed posts
- Create, edit, and delete your own posts; upload images; save and unsave posts
- Profile editing, public owner profiles, and post-owner contact details
- Responsive dashboard, category shortcuts, empty/loading/error states, and toast feedback

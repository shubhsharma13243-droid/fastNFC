# fastNFC

An NFC tag and QR code for each business. A customer taps the tag and sees the business's page: call button, WhatsApp, Instagram, Facebook, YouTube, directions, services and opening hours. The owner edits everything from a private dashboard.

Stack: MongoDB Atlas, Express, React (Vite), Node.js.

## How it works

- `/signup` and `/login`: the owner's account. Signing up also creates the business page and its unique link.
- `/dashboard`: private. The owner edits details, images, links, services and hours, and copies the NFC/QR link.
- `/b/<slug>`: public. This is the link written onto the NFC tag. No login.

## Run it on your computer

1. Create a free cluster on MongoDB Atlas, add a database user, allow your IP, and copy the connection string.
2. Server:
   ```bash
   cd server
   cp .env.example .env      # then edit .env: add MONGO_URI and a long random JWT_SECRET
   npm install
   npm run dev
   ```
3. Client (in a second terminal):
   ```bash
   cd client
   npm install
   npm run dev
   ```
4. Open http://localhost:5173, create an account, fill in the dashboard, then open your public link.

## Write the link to an NFC tag

1. Buy NTAG213 or NTAG215 tags.
2. Install the NFC Tools app on an Android phone or iPhone.
3. Choose Write, Add a record, URL, and paste the business link (for example `https://yourdomain.com/b/sharma-sweets`).
4. Hold the tag to the phone to write it. Test it, then lock it if you want to make it read-only.

The link must use your live domain, so deploy first. A link that starts with `localhost` only works on your own computer.

## Deploy (one server)

```bash
cd client && npm install && npm run build
cd ../server && npm install
NODE_ENV=production node server.js
```

In production, Express serves the built React app and the API from the same address. Use a host such as Render or Railway, set `MONGO_URI`, `JWT_SECRET` and `NODE_ENV=production`, and attach your domain. Uploaded images are saved in `server/uploads`, which many hosts erase on redeploy. Before real customers use it, move images to Cloudinary or S3.

## Not in version 1

Scan and click analytics, an admin panel, password reset, and payments. The folder layout leaves room for each.

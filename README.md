# Campus Connect — Backend

REST API and real-time server for **Campus Connect**, a student community platform. Students can create profiles, follow each other, share posts, chat in direct messages, organize campus events, and receive live notifications.

This repository is the backend only. It is built to pair with a separate frontend client.

---

## What it does

Campus Connect gives students a social layer on top of campus life:

| Area | Description |
|------|-------------|
| **Authentication** | Email/password signup with verification, plus Google and Facebook OAuth |
| **Profiles** | View and edit profile info, upload avatars, search for other students |
| **Network** | Follow and unfollow users; view your network |
| **Posts** | Create a feed of posts with optional media, likes, and comments |
| **Messaging** | One-to-one conversations with an inbox and chat history |
| **Events** | Create campus events, browse listings, RSVP, and manage attendance |
| **Notifications** | In-app alerts for likes, comments, follows, messages, and event RSVPs |
| **Real-time** | Socket.io pushes new posts, messages, and notifications to connected clients |

---

## Tech stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, bcrypt, Google OAuth, Facebook OAuth
- **Validation:** Zod
- **Real-time:** Socket.io
- **File uploads:** Multer (avatars and post media)
- **Email:** Nodemailer (verification emails)

---

## Project structure

```
src/
├── config/          # Environment and database connection
├── constants/       # Shared constants (HTTP status codes)
├── controllers/     # Route handlers
├── middlewares/     # Auth, validation, uploads, error handling
├── models/          # Mongoose schemas (User, Post, Event, Message, etc.)
├── routes/          # Express route definitions
├── schemas/         # Zod validation schemas
├── services/        # Business logic
├── utils/           # Helpers (AppError, email sender)
├── app.ts           # Express app setup
├── server.ts        # Entry point (DB, HTTP server, Socket.io)
└── socket.ts        # Socket.io initialization
```

---

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- SMTP credentials for email verification (e.g. Mailtrap for development)

### Installation

```bash
git clone <repository-url>
cd Full-stack-backend
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
# Required
PORT=5000
MONGO_URI=mongodb://localhost:27017/campus-connect
JWT_SECRET=your-secret-key
NODE_ENV=development
FRONTEND_DOMAIN=http://localhost:3000

# Email (for verification emails)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=your-mailtrap-user
EMAIL_PASSWORD=your-mailtrap-password

# OAuth (optional — only needed if using social login)
GOOGLE_CLIENT_ID=your-google-client-id
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

The server exits on startup if any required variable (`PORT`, `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`, `FRONTEND_DOMAIN`) is missing.

### Run locally

```bash
# Development (hot reload)
npm run dev

# Production build
npm run build
npm start
```

The API listens on the port defined in `PORT` (default `5000`).

Health check: `GET /health`

---

## API overview

All authenticated routes expect a JWT in the header:

```
Authorization: Bearer <token>
```

Base path: `/api/v1`

### Auth — `/api/v1/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create account (sends verification email) |
| POST | `/login` | Sign in with email and password |
| GET | `/verify-email/:token` | Verify email address |
| POST | `/google` | Sign in or register with Google ID token |
| POST | `/facebook` | Sign in or register with Facebook access token |

### Users — `/api/v1/users` *(protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/me` | Get current user profile |
| PUT | `/me` | Update profile (name, bio) |
| PUT | `/me/avatar` | Upload profile picture |
| GET | `/search?q=` | Search students by name |
| GET | `/network/me` | Get followers and following |
| POST | `/:targetId/follow` | Follow a user |
| DELETE | `/:targetId/unfollow` | Unfollow a user |
| GET | `/:id` | View another student's profile |

### Posts — `/api/v1/posts` *(protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create post (optional media upload) |
| GET | `/` | Get feed |
| GET | `/:id` | Get single post |
| PUT | `/:id` | Update post |
| DELETE | `/:id` | Delete post |
| POST | `/:id/like` | Toggle like |
| POST | `/:id/comment` | Add comment |

### Messages — `/api/v1/messages` *(protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/inbox` | List conversations |
| GET | `/:targetUserId` | Get chat history with a user |
| POST | `/send/:receiverId` | Send a message |

### Events — `/api/v1/events` *(protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create event |
| GET | `/` | List events |
| GET | `/:id` | Get event details |
| PUT | `/:id` | Update event |
| DELETE | `/:id` | Delete event |
| POST | `/:id/rsvp` | RSVP to event |
| DELETE | `/:id/rsvp` | Cancel RSVP |

### Notifications — `/api/v1/notifications` *(protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get notifications (paginated) |
| PUT | `/read-all` | Mark all as read |
| PUT | `/:id/read` | Mark one as read |

Uploaded files are served from `/uploads/...` (avatars and post media stored under `public/uploads/`).

---

## Real-time events (Socket.io)

Clients connect to the same server port and join a personal room:

```js
socket.emit("join", userId);
```

Server-emitted events:

| Event | When |
|-------|------|
| `new_post` | A post is created |
| `post_updated` | A post is liked, commented on, or edited |
| `new_message` | A direct message is sent |
| `new_notification` | A notification is created for the recipient |

---

## Data models

- **User** — name, email, password, bio, avatar, followers/following, email verification state
- **Post** — author, content, likes, comments, optional media, tagged users
- **Conversation / Message** — one-to-one chat threads and messages
- **Event** — organizer, title, description, date, location, capacity, attendees
- **Notification** — recipient, sender, type (`LIKE`, `COMMENT`, `FOLLOW`, `MESSAGE`, `EVENT_RSVP`), related entity

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production server |

---

## License

ISC

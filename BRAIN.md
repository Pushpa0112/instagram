# BRAIN.md (Project Long-Term Memory)

This document acts as the long-term memory for the project. It provides an overview of the technical architecture, database schemas, APIs, folder structure, coding conventions, known issues, and environment configurations.

---

## 1. Project Overview

This project is a full-stack social media web application (an Instagram-like clone) consisting of:
- **`backend`**: A Node.js and Express server that implements a REST API, handles user authentication via JWT cookies, manages media uploads via Multer and Cloudinary, processes images with Sharp, and enables real-time messaging/notifications via WebSockets (Socket.io).
- **`frontend`**: A React application built on Next.js 16 (App Router) using Tailwind CSS v4 and TypeScript.

---

## 2. Folder Structure

The project has the following directory structure:

```
insta/
├── backend/                       # Node.js + Express backend
│   ├── controllers/               # Route controllers (business logic)
│   │   ├── message.controller.js  # Messages and conversations logic
│   │   ├── post.controller.js     # Posts, likes, bookmarks, and comments logic
│   │   └── user.controller.js     # Register, login, logout, and profile logic
│   ├── middlewares/               # Express middlewares
│   │   ├── isAuthenticated.js     # JWT authentication verifier
│   │   └── multer.js              # Multer configuration for memory storage file upload
│   ├── models/                    # Mongoose database models
│   │   ├── comment.model.js       # Comment schema
│   │   ├── conversation.model.js  # Conversation schema
│   │   ├── message.model.js       # Message schema
│   │   ├── post.model.js          # Post schema
│   │   └── user.model.js          # User schema
│   ├── routes/                    # API route definitions
│   │   ├── message.route.js       # Routes for chatting and retrieving messages
│   │   ├── post.route.js          # Routes for posts and interactions
│   │   └── user.route.js          # Routes for user accounts and profiles
│   ├── socket/                    # WebSocket socket.io implementation
│   │   └── socket.js              # Express, HTTP server wrapper, and online users mapping
│   ├── utils/                     # Helper functions and configurations
│   │   ├── cloudinary.js          # Cloudinary configuration
│   │   ├── datauri.js             # Parses files to DataURIs
│   │   └── db.js                  # MongoDB Mongoose connection function
│   ├── index.js                   # Application entrypoint
│   └── package.json               # Backend dependencies and run scripts
└── frontend/                      # Next.js 16 frontend
    ├── public/                    # Static assets
    ├── src/                       # Source files
    │   ├── app/                   # Next.js App Router root layout & pages
    │   │   ├── globals.css        # Tailwind directives and CSS variables
    │   │   ├── layout.tsx         # Next.js root layout with Inter font and Providers
    │   │   ├── page.tsx           # Next.js main entry page
    │   │   └── providers.tsx      # TanStack Query Client Provider
    │   ├── components/            # UI Components
    │   │   ├── shared/            # Reusable shared components (Navbar, Sidebar)
    │   │   └── ui/                # shadcn/ui primitive components
    │   ├── features/              # Feature-sliced domain logic
    │   │   ├── auth/              # Authentication UI and logic
    │   │   ├── feed/              # Main feed logic
    │   │   ├── message/           # Chat messaging feature
    │   │   ├── post/              # Post creation and interactions
    │   │   ├── profile/           # User profile management
    │   │   ├── reel/              # Reels feature
    │   │   └── story/             # Stories feature
    │   ├── hooks/                 # Custom React hooks
    │   ├── lib/                   # Utility libraries
    │   │   ├── api/               # Axios instances and API helpers
    │   │   └── utils.ts           # shadcn tailwind-merge utilities
    │   ├── store/                 # Zustand global state stores
    │   │   ├── useAuthStore.ts    # User authentication state
    │   │   └── useUIStore.ts      # UI toggle states (modals, search)
    │   └── types/                 # TypeScript type definitions
    │       └── api.ts             # API interfaces (User, Post, Comment)
    ├── components.json            # shadcn/ui configuration
    ├── next.config.ts             # Next.js configuration
    └── package.json               # Frontend dependencies and run scripts
```

---

## 3. Tech Stack

- **Core Runtime & Frameworks**:
  - Node.js (with ES Modules)
  - Express.js (v5.2.1)
  - Next.js (v16.2.9)
  - React (v19.2.4)
- **Database**:
  - MongoDB (via Mongoose v9.7.1)
- **Real-Time Communication**:
  - Socket.io (v4.8.3)
- **Frontend State & Data**:
  - Zustand - Client UI & Auth state management.
  - TanStack Query - Server state management and caching.
  - Axios - HTTP client configured with interceptors.
- **Styling & UI**:
  - Tailwind CSS (v4)
  - shadcn/ui - Accessible component primitives.
  - Lucide React - Icons.
  - Framer Motion - Animations.
- **Forms & Validation**:
  - React Hook Form
  - Zod - Schema validation.
- **Media Uploads & Processing**:
  - Multer (v2.2.0) - in-memory storage.
  - Sharp (v0.35.2) - resizing and converting images to JPEG format.
  - Cloudinary (v2.10.0) - cloud storage provider.
  - Datauri (v4.1.0) - parses memory buffers to Data URIs.
- **Authentication**:
  - JSON Web Tokens (`jsonwebtoken` v9.0.3)
  - HTTP-Only Cookies (`cookie-parser` v1.4.7)
  - Password Hashing (`bcryptjs` v3.0.3)

---

## 4. Architecture

The codebase follows a decoupled **Client-Server Architecture**:

- **Frontend Architecture**: Feature-sliced design pattern placing domain-specific logic in `src/features/*`. Global states are managed by `zustand` (auth, UI toggles) and server state is fetched/cached using `TanStack Query` via an `axios` instance configured for HTTP-only cookies.
- **Backend API**: The Node.js application functions as an Express server. Routes are divided into `user`, `post`, and `message` paths mapping to specific controllers.
- **Real-time Engine**: Express and HTTP servers are wrapped by Socket.io in `backend/socket/socket.js`. It tracks connected clients in a `userSocketMap` object matching `userId -> socketId`. This enables real-time messaging and push notifications (e.g., likes).
- **Storage Strategy**: File uploads go through Multer as buffers, are optimized using Sharp (compressed to JPEGs at 80% quality), converted to base64 Data URIs, and uploaded to Cloudinary.

---

## 5. Database Schema

The project defines 5 schemas using Mongoose:

### User Schema (`User` model)
* **Fields**:
  - `username` (String, required, unique)
  - `email` (String, required, unique)
  - `password` (String, required)
  - `profilePicture` (String, default: `''`)
  - `bio` (String, default: `''`)
  - `gender` (String, enum: `['male', 'female']`)
  - `followers` (Array of ObjectIds, ref: `User`)
  - `following` (Array of ObjectIds, ref: `User`)
  - `posts` (Array of ObjectIds, ref: `Post`)
  - `bookmarks` (Array of ObjectIds, ref: `Post`)
* **Options**: `{ timestamps: true }` (generates `createdAt` and `updatedAt`)

### Post Schema (`Post` model)
* **Fields**:
  - `caption` (String, default: `''`)
  - `image` (String, required)
  - `author` (ObjectId, ref: `User`, required)
  - `likes` (Array of ObjectIds, ref: `User`)
  - `comments` (Array of ObjectIds, ref: `Comment`)
* **Options**: None (Missing timestamps - see *Known Issues*)

### Comment Schema (`Comment` model)
* **Fields**:
  - `text` (String, required)
  - `author` (ObjectId, ref: `User`, required)
  - `post` (ObjectId, ref: `Post`, required)
* **Options**: None (Missing timestamps)

### Message Schema (`Message` model)
* **Fields**:
  - `senderId` (ObjectId, ref: `User`)
  - `receiverId` (ObjectId, ref: `User`)
  - `message` (String, required)
* **Options**: None (Missing timestamps)

### Conversation Schema (`Conversation` model)
* **Fields**:
  - `participants` (Array of ObjectIds, ref: `User`)
  - `messages` (Array of ObjectIds, ref: `Message`)
* **Options**: None (Missing timestamps)

---

## 6. API Endpoints

All backend routes are prefixed with `/api/v1`.

### Authentication & Users (`/api/v1/user`)
| Method | Path | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | No | Creates a new user account with hashed password. |
| `POST` | `/login` | No | Validates credentials, creates a JWT cookie, and returns user profile. |
| `GET` | `/logout` | No | Clears user cookie `token` by setting its `maxAge` to `0`. |
| `GET` | `/:id/profile` | Yes | Retrieves profile data of the specified user ID (populates posts/bookmarks). |
| `POST` | `/profile/edit` | Yes | Edits bio, gender, or profile photo (`profilePhoto` multipart/form-data field). |
| `GET` | `/suggested` | Yes | Returns list of all registered users excluding the caller. |
| `POST` | `/followorunfollow/:id` | Yes | Toggles follow/unfollow status for the targeted user. |

### Posts (`/api/v1/post`)
| Method | Path | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/addpost` | Yes | Uploads a post image (`image` multipart/form-data field) with optional caption. |
| `GET` | `/all` | Yes | Retrieves all posts populated with author, comments, and comments' authors. |
| `GET` | `/userpost/all` | Yes | Retrieves posts created by the authenticated user. |
| `GET` | `/:id/like` | Yes | Adds authenticated user to post's likes list, triggers socket notification if owner is online. |
| `GET` | `/:id/dislike` | Yes | Removes authenticated user from post's likes list, triggers socket notification. |
| `POST` | `/:id/comment` | Yes | Adds a new comment to a post. |
| `GET` | `/:id/comment/all` | Yes | Retrieves all comments for a post. |
| `DELETE`| `/delete/:id` | Yes | Deletes a post if the caller is the author (removes comments and deletes DB entries). |
| `GET` | `/:id/bookmark` | Yes | Toggles bookmarking status of a post for the authenticated user. |

### Chat Messaging (`/api/v1/message`)
| Method | Path | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/send/:id` | Yes | Sends a message (`textMessage` in body) to a user, emits Socket.io event if online. |
| `GET` | `/all/:id` | Yes | Returns all populated messages belonging to the conversation with specified user ID. |

---

## 7. Authentication Flow

1. **Registration**: User posts credentials to `/api/v1/user/register`. Passwords are encrypted using `bcrypt.hash(password, 10)` before insertion.
2. **Session Creation**: User logs in via `/api/v1/user/login`. Upon validation:
   - A JWT is generated containing `{ userId: user._id }` signed by `SECRET_KEY` (expires in 1 day).
   - The token is attached to the response as an HTTP-only, `sameSite: 'strict'` cookie named `token`.
3. **Verification**: Private routes are protected by the `isAuthenticated` middleware.
   - It reads `req.cookies.token` via `cookie-parser`.
   - Verifies the signature with `jwt.verify`.
   - Injects the authenticated user ID into `req.id` and invokes `next()`.
4. **Session Termination**: `/api/v1/user/logout` overwrites the cookie to empty (`""`) with `maxAge: 0`.

---

## 8. Important Business Logic

- **Real-time Notifications**: On liking (`likePost`) or disliking (`dislikePost`) a post, if the post owner is not the one performing the action, the backend checks if the post owner is online. If yes, it emits a `notification` socket event with payload details.
- **Real-time Messaging**: When `sendMessage` is successfully executed, the server queries the active sockets for the `receiverId`. If online, it sends the new message via `io.to(receiverSocketId).emit('newMessage', newMessage)`.
- **Post Image Resizing**: To optimize storage and network transit, `addNewPost` intercepts file uploads, compresses them into JPEG (80% quality) at a bounded $800 \times 800$ resolution with Sharp, and uploads the base64 URI.

---

## 9. Reusable Components & Utilities

### Backend Utilities
- **`backend/utils/db.js`**: `connectDB()` logs in to MongoDB database.
- **`backend/utils/cloudinary.js`**: Configures Cloudinary API credentials.
- **`backend/utils/datauri.js`**: `getDataUri(file)` parses binary multer file buffer into a base64 encoded Data URI format.
- **`backend/middlewares/multer.js`**: `upload` middleware configured for handling uploads in-memory.

---

## 10. Coding Conventions

- **Module Syntax**: ES Modules are used (`import`/`export` keywords).
- **Import Extensions**: Relative paths require explicit file extensions (e.g., `import { User } from "../models/user.model.js"`).
- **Database Schema Modeling**: Schema files use the `*.model.js` suffix, models are named in singular PascalCase (e.g., `Comment`), and collections match plural camelCase.
- **Routing Structure**: Express routes are kept in separate files with `.route.js` and use `express.Router()`.

---

## 11. Dependencies

### Backend (`backend/package.json`)
- `bcryptjs` (^3.0.3) - Hashing passwords.
- `cloudinary` (^2.10.0) - Image cloud storage.
- `cookie-parser` (^1.4.7) - Parsing cookies for JWT.
- `cookies` (^0.9.1) - Backup cookie parsing (not actively imported in middleware).
- `cors` (^2.8.6) - Cross-Origin Resource Sharing.
- `datauri` (^4.1.0) - Convert buffers to URI formatting.
- `dotenv` (^17.4.2) - Local environment configurations.
- `express` (^5.2.1) - Web app framework.
- `jsonwebtoken` (^9.0.3) - Session tokens.
- `mongoose` (^9.7.1) - MongoDB Object Document Mapper.
- `multer` (^2.2.0) - Parse multipart form data.
- `nodemon` (^3.1.14) - Dev environment hot-reloader.
- `parser` (^0.1.4) - External utility parsing (unused).
- `sharp` (^0.35.2) - Image resizing library.
- `socket.io` (^4.8.3) - WebSockets implementation.

### Frontend (`frontend/package.json`)
- `next` (16.2.9)
- `react` (19.2.4)
- `react-dom` (19.2.4)
- `tailwindcss` (^4)
- `@tailwindcss/postcss` (^4)
- `typescript` (^5)

---

## 12. Environment Variables

Variables parsed in the backend from `backend/.env`:
- `PORT`: Server port (defaults to `8000`).
- `MONGO_URI`: Connection string for MongoDB database instance.
- `SECRET_KEY`: Private key signature salt used by JWT.
- `API_KEY`: Cloudinary API credential.
- `API_SECRET`: Cloudinary API credential.
- `CLOUD_NAME`: Cloudinary API credential (Fixed typo: previously `CLOUDE_NAME`).
- `URL`: Authorized CORS origin (defaults to `http://localhost:3000`).

---

## 13. Known Issues



### 2. Missing Schema Timestamps & Sorting Bug
- The models `Post`, `Comment`, `Message`, and `Conversation` do not have `{ timestamps: true }` declared.
- However, `post.controller.js` queries sort by `createdAt` in `getAllPost` (line 50), `getUserPost` (lines 71 & 76), and comments (`sort: { createdAt: -1 }`). Sorting will not work as expected because `createdAt` is missing.



### 4. Empty Exception Handlers
- The functions `likePost` and `dislikePost` in `post.controller.js` contain empty `catch (error) {}` blocks. If database operations fail, these routes will hang without returning an error response to the client.



---

## ✅ Fixed Issues

### [FIXED] Missing Imports in `user.controller.js` (2026-06-29)
- **Problem**: The user controller attempted to use `Post`, `getDataUri`, and `cloudinary` without importing them, causing runtime `ReferenceError` crashes (e.g., during login).
- **Fix**: Added the missing import statements to the top of the file.
- **File**: `backend/controllers/user.controller.js`

### [FIXED] Environment Variable Name Mismatch for Cloudinary (2026-06-29)
- **Problem**: In `.env`, the variable was spelled `CLOUDE_NAME=dj5nvxxrc`, but `backend/utils/cloudinary.js` expected `process.env.CLOUD_NAME`. This caused uploads to fail with `Error: Must supply cloud_name`.
- **Fix**: Corrected `CLOUDE_NAME` to `CLOUD_NAME` in the `.env` file.
- **File**: `backend/.env`

### [FIXED] Comments Fetch Method Choice (2026-06-29)
- **Problem**: The route to retrieve all comments was defined as `POST /:id/comment/all` rather than a standard `GET` query, causing confusion and 404 errors when tested as a GET.
- **Fix**: Changed the route method from `post` to `get`.
- **File**: `backend/routes/post.route.js`

### [FIXED] `isAuthenticated` catch block hangs request (2026-06-29)
- **Problem**: The `catch` block in `middlewares/isAuthenticated.js` only logged the error and returned nothing. Any JWT failure (expired, wrong secret, malformed) caused the request to hang indefinitely — it never reached multer, so `req.file` was always `undefined`.
- **Fix**: Added `return res.status(401).json({ message: '...', success: false })` inside the catch block.
- **File**: `backend/middlewares/isAuthenticated.js`

### [FIXED] CORS registered after body parsers — wrong middleware order (2026-06-29)
- **Problem**: In `index.js`, `cors()` was registered after `express.json()`, `cookieParser()`, and `express.urlencoded()`. Browser preflight `OPTIONS` requests could fail to receive CORS headers if routed before `cors()` ran.
- **Fix**: Moved `cors(corsOptions)` to be the **first** `app.use()` call, before all body parsers and route handlers.
- **File**: `backend/index.js`

---

## 14. Development Notes

- **Backend Startup**: To run the backend in development:
  ```bash
  cd backend
  npm run dev
  ```
- **Frontend Startup**: To run Next.js in development:
  ```bash
  cd frontend
  npm run dev
  ```
- **Build Step**:
  ```bash
  npm run build
  ```
  *(Runs backend build, installs dependencies in backend and frontend, then builds frontend static artifacts.)*

### Postman Checklist for `POST /api/v1/post/addpost`

If `req.file` is still undefined after the code fixes, verify every one of these in Postman:

1. **Do NOT manually set `Content-Type`** in Postman Headers. When using `form-data`, Postman auto-sets `Content-Type: multipart/form-data; boundary=...`. If you override it manually, the boundary parameter is lost and multer silently skips parsing → `req.file` is `undefined`.
2. **Field name must be exactly `image`** (lowercase, no typo). The route uses `upload.single('image')`.
3. **Select `File` type** for the image field in Postman body → form-data (not Text).
4. **Auth cookie**: Must send a valid `token` cookie. Use Postman's Cookie Manager or set it in the Cookies tab. The `isAuthenticated` middleware now returns a clear `401` if the token is missing/invalid, so check the response for that before assuming multer is the issue.
5. **Port**: Server runs on `8000`. URL should be `http://localhost:8000/api/v1/post/addpost`.

### [FIXED] Backend Crash on Duplicate Username during Registration (2026-06-30)
- **Problem**: The `/api/v1/user/register` route crashed the server or hung the request by throwing a `MongoServerError: E11000 duplicate key error` if a user attempted to register with an existing username, due to a lack of error handling.
- **Fix**: Added an explicit check `await User.findOne({ username })` and returning a 401 status with "Username is already taken". Also added a 500 error response in the `catch` block.
- **File**: `backend/controllers/user.controller.js`

---

## 15. Implementation Progress

### Phase 0: Project Foundation (Frontend)
- **State Management**: Set up `useAuthStore` and `useUIStore` using Zustand.
- **API Client**: Configured an Axios instance (`axios.ts`) with interceptors to normalize errors and handle HTTP-only cookies.
- **Data Fetching**: Set up TanStack React Query (`providers.tsx`) for server state management.
- **Architecture**: Established a feature-sliced domain structure (`src/features/*`) for scalable development.

### Phase 1: Authentication Flow (Frontend)
- **Zod & Forms**: Implemented strict validation schemas (`schemas.ts`) for login and registration. Used native `react-hook-form` along with standard `shadcn/ui` Inputs for the UI.
- **Zustand Persistence**: Integrated the `persist` middleware into `useAuthStore`, storing non-sensitive user data in `localStorage` to retain sessions on page reload (acting as a fallback since the backend lacks a `/me` endpoint).
- **Hooks**: Built custom React Query hooks (`useLogin`, `useRegister`, `useLogout`) for robust API calls and automatic cache invalidation.
- **UI & Routing**: Built Instagram-style `/login` and `/register` pages. Implemented a client-side `AuthGuard` wrapper component in `layout.tsx` to redirect users dynamically based on their authentication status.

### Phase 2: Persistent Navigation Shell (Frontend)
- **Layout Architecture**: Centralized authenticated views inside a Next.js Route Group (`app/(main)`).
- **Sidebar (Desktop)**: Built a responsive left sidebar that gracefully collapses from full labels (lg) to icon-only (md) and remains hidden on mobile. Dynamically highlights active routes.
- **BottomNav (Mobile)**: Added a fixed bottom navigation bar displaying icons (Home, Search, Create, Reels, Profile) for screens <768px.
- **Search Slide-over Modal**: Integrated a sleek UI slide-over connected to `useUIStore`. Features debounced input wired to a mock user search stub in `features/search/mock.ts`.
- **Create Post Trigger**: Wired up a global trigger to open a Create Post Modal that acts as a placeholder for file drag-and-drop operations (slated for Phase 4).

### Phase 3: Main Feed & Post Interactions (Frontend)
- **API Types & Adapters**: Defined UI-friendly `Post` and `Comment` types. Implemented a `getFeed` adapter in `features/feed/api.ts` to map raw backend responses into a structure ready for infinite scrolling pagination.
- **Infinite Scrolling Feed**: Rebuilt the main `page.tsx` feed using TanStack Query's `useInfiniteQuery`. Implemented a custom `useIntersectionObserver` hook to natively trigger fetching the next page when reaching the bottom of the feed. Includes empty, loading (`PostCardSkeleton`), and error states.
- **PostCard UI**: Built a responsive `PostCard` featuring author details, interactive action buttons (Like, Comment, Bookmark), and a double-tap heart-burst animation powered by Framer Motion.
- **Optimistic Interactions**: Built `useLikeToggle` and `useBookmarkToggle` mutations that instantly update the UI (and rollback on failure) to provide a snappy user experience.
- **Comment Drawer**: Created a dynamic slide-up `CommentDrawer` component. Integrated `useComments` (fetching existing comments via the POST endpoint) and `useAddComment` (with optimistic updates) so users can seamlessly read and add comments.
- **Next.js Config**: Allowed external images from Cloudinary (`res.cloudinary.com`) in `next.config.ts`.

### Phase 4: Post Creation & Own-Posts Management (Frontend)
- **Create Post Modal**: Updated the multi-step `CreatePostModal.tsx` to support drag-and-drop file selection, client-side aspect ratio toggling (Square vs Original), and a caption input validated securely via `react-hook-form` and `zod`.
- **Post Creation Mutation**: Validated `useCreatePost` hooked to the `POST /api/v1/post/addpost` endpoint. It uses native `FormData` for multipart uploads and tracks upload progress via Axios's `onUploadProgress`.
- **Profile Grid**: Built `MyPostsGrid.tsx` fetching user posts (`useMyPosts`) and rendering them in an Instagram-style responsive 3-column grid with a sleek hover overlay displaying like and comment counts.
- **Delete Post Flow**: Integrated an interactive `AlertDialog` triggered from the profile grid to delete posts. Powered by the `useDeletePost` mutation which optimistically updates the feed and profile query caches for instantaneous UI feedback.

### Phase 5: Profile & Follow System (Frontend)
- **Profile Page Route**: Migrated the profile route from `/[username]` to `/profile/[id]` to align directly with the backend's `GET /api/v1/user/:id/profile` expectations.
- **Profile View & Layout**: Designed a dynamic Profile Page `page.tsx` loading via TanStack Query's `useUserProfile`. It features a resilient loading skeleton, real post/follower/following counts extracted from the backend populations, and two tabs: Posts and Saved (the latter serving as an empty placeholder).
- **Edit Profile Modal**: Built `EditProfileModal.tsx` utilizing React Hook Form + Zod. Fields include Bio and Gender, and an integrated native file input handles instant client-side profile photo previewing. Uploads are handled via `FormData` to the backend.
- **Follow System**: Built `FollowButton.tsx` component that accepts a target `userId` and toggles Follow/Unfollow via the `useFollowUser` mutation. It optimistically invalidates caches to ensure instantaneous UI refreshes.
- **Suggested Users Sidebar**: Developed a `SuggestedUsers.tsx` sidebar widget integrated into the main feed, fetching from `useSuggestedUsers` and mapping `FollowButton`s to each suggested user.

### Phase 6: Real-Time Direct Messaging (Frontend)
- **Socket Integration**: Installed `socket.io-client` and built `lib/socket.ts` to manage a singleton socket connection authenticating with the active `userId`.
- **State Management**: Built `useMessageStore.ts` using Zustand to track the currently active chat thread and persist a local array of `knownPartners`. (This serves as a client-side proxy since the backend currently lacks a `GET /conversations` endpoint).
- **Messaging Hooks**: Developed `useMessages` (fetching the thread from `GET /message/all/:id`) and `useSendMessage` (posting to `POST /message/send/:id`). The `useSendMessage` hook implements an optimistic append to immediately render outgoing messages without waiting for the network loop.
- **Real-Time Wiring**: Configured `messages/page.tsx` to mount the socket connection upon loading and listen to `newMessage` events. It automatically appends incoming messages into the React Query cache, rendering them instantly.
- **Messaging Interface**: Designed a responsive two-pane `MessagesPage` layout. The left pane enumerates `knownPartners`, while the right pane renders `ThreadView.tsx`. `ThreadView` maps `MessageBubble` components and leverages a `useRef` auto-scroll mechanic to keep the view focused on the newest messages. Typing indicators are fully stubbed and ready to be turned on when the backend supports them.

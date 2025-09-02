## Overview

Humane is a real-time, privacy-focused, microservices-based social platform designed for authentic connections. The frontend is built with React (TypeScript) and supports posts, comments, chat, video calls, notifications, AI-powered content moderation, and Humane Points.

## Tech Stack

- React + TypeScript – Component-driven, strongly typed
- Redux – Client-side state management
- TanStack Query – Server-state synchronization (feed, posts, moderation updates)
- Tailwind CSS – Responsive styling
- Axios – API communication
- Socket.IO Client – Realtime updates for notifications, chat, calls
- WebRTC – One-to-one video/audio calls with media device switching
- CNN Model (via backend) – AI moderation pipeline (image/video/text content)

## Core Features

### 1. Authentication

- JWT-based login/signup/email verification
- Persistent sessions

### 2. Posts & Comments

- Text, photo, and video posts
- Friends-only or public visibility
- Comment & like system
- **Humane Points** for creator-approved comments
- **Moderation-aware publishing:**

  - New posts = `processing` state until CNN moderation is complete
  - UI badge: _“Under Review”_
  - Once approved → visible in friends feed
  - If rejected → user notified with reason

### 3. Feed

- Infinite scrolling
- Redis-backed caching
- Filters out posts not yet moderated (shows placeholders for author)

### 4. Real-time Notifications

- Friend requests, likes, comments, moderation results
- Socket.IO push

### 5. Chat

- One-to-one messaging
- Retry, typing indicator, unread counts

### 6. Video Calls (WebRTC)

- One-to-one calls
- **Media device switching**: camera, microphone, speaker
- Call status: ringing → in-progress → ended

### 7. **Search**

- Local filtering for instant feedback
- Global Elasticsearch-based search

## Project structure

```bash
src/
│
├── app/                    # Entry-point level setup (providers, router, global styles)
│   ├── App.tsx
│   ├── router.tsx
│   └── providers/          # React Contexts, Redux stores, etc.
│
├── assets/                 # Static assets like images, fonts
│
├── components/             # Reusable UI components (buttons, modals, inputs)
│   └── common/             # General shared components
│
├── features/               # Feature-based modules (scalable design pattern)
│   ├── auth/
│   │   ├── components/     # Auth-related components
│   │   ├── pages/          # Login, Register pages
│   │   ├── services/       # API calls
│   │   ├── hooks/          # Feature-specific custom hooks
│   │   └── Types/          # Types handled by the feature
│   └── dashboard/
│       └── ...
│
├── hooks/                  # App-wide custom hooks (e.g., useDebounce)
│
├── layouts/                # Layouts like AuthLayout, DashboardLayout
│
├── lib/                    # Utilities (Axios instance, formatters, validators)
│
├── types/                  # Global TypeScript types and interfaces
│
├── constants/              # App-wide constants (roles, routes, status codes)
│
├── env/                    # Environment configs
│   ├── config.ts           # `import.meta.env.VITE_*` wrappers
│
├── index.css               # Global styles (tailwind, css modules, sass)
└── main.tsx                # Application Entrypoint
```

## API Communication

- REST APIs for core services
- WebSocket for chat, notifications & moderation status
- preSigned URLs for media uploads

## Development Setup

```bash
git clone https://github.com/abhiram-ar/humane-frontend
cd humane-frontend
npm install
```

`.env` example:

```env
VITE_GOOGLE_CLIENT_ID= google client ID string
VITE_FRONTEND_BASE_URL= http://bedomain.dummy.com
VITE_BACKEND_BASE_URL= http://dummy.com
```

Start dev:

```bash
npm run dev
```

## Future Enhancements

- User appeal workflow for rejected posts
- Group video calls
- End-to-end encrypted chat/calls

## Notes

### Search chat

- We will fire API to search chat, this may take a while
- Instead on showing the user the loading indicator, we quickly filter out the chats in the local store(redux) and show it to the user
- One the API resolves these additonal chats are also appended to the local search results

---

### Content Moderation Flow (Frontend)

1. **User creates post** → marked as `processing`
2. Post is uploaded to backend & queued for CNN moderation
3. Frontend shows:

   - _Processing badge_ on post card
   - Disabled interactions (no comments/likes yet)

4. Backend emits moderation result event via Kafka → notification → Feed update
5. Frontend automatically updates via **TanStack Query server state** or WebSocket event:

   - Approved → Post becomes active
   - Rejected → Post is flagged in user profile + user gets notification

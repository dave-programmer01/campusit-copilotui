# CampusIT Co-Pilot — frontend

Unofficial, student-built chat UI for Lehman College tech help. A thin Next.js
client over the existing Spring Boot backend: it renders the conversation and
records whether the student actually got unstuck.

## Setup

```bash
cp .env.example .env.local   # then set the backend URL
npm install
npm run dev
```

`NEXT_PUBLIC_API_BASE_URL` is the only configuration. Nothing else is
hardcoded, and there are no secrets in the client — the student-facing
endpoints are public.

## Deploying to Vercel

Import the repo, then set `NEXT_PUBLIC_API_BASE_URL` in Project Settings →
Environment Variables (all environments). Both routes prerender as static
content; there is no server-side code.

## How it works

- `/` — splash screen.
- `/chat` — the chat client (`components/chat.tsx`).
- `lib/api.ts` — the only module that talks to the backend.

**Conversation state lives on the backend.** The client generates one
`conversationId` per session (`crypto.randomUUID()`, persisted in
`sessionStorage`, falling back to React state where storage is blocked) and
sends it on every turn. Only the new user message goes up — the local message
array exists purely to render the transcript.

The `/deflection` POST is the metric the project exists to collect: `resolved:
true` from "Yes, sorted", `false` from "Still stuck". `topic` and `device` are
sent only when the student picked them explicitly (a sidebar topic, a device
chip) — never guessed.

## Backend note

Rate-limit responses (429) are handled, but the `Retry-After` header is not
CORS-safelisted, so the browser cannot read it unless the backend also sends
`Access-Control-Expose-Headers: Retry-After`. Without it the UI says "try again
in a moment" instead of naming the number of seconds.

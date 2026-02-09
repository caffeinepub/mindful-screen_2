# Specification

## Summary
**Goal:** Build the “Mindful Screen” web app with mindful in-app time tracking, break suggestions, calming audio controls, mini-games, and per-user notes/settings secured by Internet Identity.

**Planned changes:**
- Create the app shell with navigation to Dashboard, Games, Notes, and Settings, with consistent calming theme and layout.
- Implement in-app usage timer that counts only while the tab is visible, shows today’s elapsed time, and tracks sessions.
- Add Settings to configure and persist a daily time limit (per user) and audio preferences (play/pause, volume, mute).
- Show a prominent mindful suggestion banner/card when the daily limit is exceeded, with at least 10 suggestions and a “New suggestion” action.
- Build Games section with a games landing page and four modes: Tic Tac Toe (2-player), simple puzzle (with shuffle/reset and completion detection), riddles (show answer/next), and math problems (validation, score, next).
- Implement Notes CRUD (create/view/edit/delete with confirmation), displaying title/first line and last-updated time; persist per signed-in user.
- Add Internet Identity sign-in/out and require authentication for saving/retrieving user data (time limit settings, time-tracking state, notes).
- Keep backend as a single Motoko actor to store and serve per-user settings, tracking state, and notes.
- Add and render generated static branding/ambiance assets from `frontend/public/assets/generated` (logo in header, background illustration on key screens).

**User-visible outcome:** Users can navigate the Mindful Screen app, see and configure their in-app daily time limit, get break suggestions after exceeding it, play included mini-games, listen to optional calming audio with saved preferences, and sign in to save/retrieve their settings and personal notes.

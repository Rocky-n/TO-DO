# Multi-Page Todo Application 

A strict Multi-Page Application (MPA) built with React.js (Vite), Node.js, Express, and SQLite. 

## Architectural Decisions
To strictly satisfy the assignment requirement of an **MPA rather than an SPA**, standard client-side routing (e.g., `react-router-dom`) was intentionally omitted. 
Instead, the application utilizes Vite's multi-page build configuration to generate distinct HTML entry points (`index.html` and `todo.html`). Navigation is handled via standard hard links, ensuring full page reloads, accurate browser history, and state separation.

## Features Built
*(Note: As per requirements, only documented features are listed below)*

1. **Multi-Page Architecture:** Strict separation between the Dashboard (List View) and Task Details (Single View).
2. **Relational Data Persistence:** Utilizes SQLite for zero-configuration, robust SQL data storage rather than temporary JSON files.
3. **Native Query Parsing:** Extracts `?id=` parameters using the native browser `URLSearchParams` API for the single view page.
4. **Full CRUD Operations:** - **Create:** Add new tasks from the dashboard.
   - **Read:** View all tasks on the dashboard, and view specific task details on the secondary page.
   - **Update:** Mark tasks as completed using optimistic UI updates.
   - **Delete:** Remove tasks with a browser confirmation safeguard.
5. **Modern UI/UX:** Styled completely with Tailwind CSS (v4) for a clean, responsive interface.

## Prerequisites to Run
- Node.js installed on your machine.
- No external database installation required (SQLite runs locally).

## How to Run

### 1. Start the Backend
```bash
cd backend
npm install
node server.js
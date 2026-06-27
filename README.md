# Multi-Page Todo Application (MPA)

A strict Multi-Page Application built to demonstrate clean architectural separation, relational data persistence, and modern UI/UX principles.

🚀 **Live Frontend (Vercel):** [http://to-do-neon-beta.vercel.app/]
🔌 **Live Backend (Render):** [https://todo-backend-naresh.onrender.com/]

*(Note: The backend is hosted on Render's free tier. It spins down after 15 minutes of inactivity, so the initial load may take 30-50 seconds. Because it uses an ephemeral file system, the SQLite database will periodically reset to a clean slate).*


## 🏗 Architectural Decisions

1. **Multi-Page Architecture (MPA) over SPA:** To strictly fulfill the requirement of an MPA rather than a Single Page Application, standard client-side routing was intentionally omitted. The application utilizes Vite's multi-page build configuration to generate distinct HTML entry points (`index.html` and `todo.html`). Navigation is handled via standard hard links, ensuring full page reloads and state separation.
2. **Relational Database over Flat Files:** Instead of using a simple JSON file for storage, the application implements **SQLite**. This demonstrates a solid understanding of SQL and relational data persistence while maintaining a zero-configuration setup for local reviewers.
3. **Environment-Aware API Routing:**
   The React frontend dynamically switches between the live deployed backend URL and `localhost:3000` depending on the build environment, ensuring seamless local development without code changes.

---

## 💻 Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS (v4), Lucide React (Icons)
* **Backend:** Node.js, Express.js
* **Database:** SQLite (Relational SQL)
* **Deployment:** Vercel (Frontend), Render (Backend)

---

## ✨ Features Built

* **Strict MPA Navigation:** Clean separation between the Dashboard (List View) and Task Details (Single View).
* **Native Query Parsing:** Extracts `?id=` parameters using the native browser `URLSearchParams` API.
* **Full CRUD APIs:** * **Create:** Add new tasks with descriptions.
  * **Read:** View all tasks dynamically filtered by status (Pending/Completed), and view deep-linkable individual task pages.
  * **Update:** Toggle completion status with optimistic UI updates.
  * **Delete:** Remove tasks with browser-native confirmation safeguards.
* **Premium UI/UX:** Features glassmorphism effects, interactive hover states, micro-animations, and a fully responsive grid layout.

---

## 🛠 How to Run Locally

If you prefer to run the application locally rather than using the live deployment:

### 1. Start the Backend
```bash
cd backend
npm install
node server.js

(The server will start on http://localhost:3000. It automatically generates a fresh database.sqlite file on the first run).

###2. Start the Frontend
Leave the backend running. Open a new terminal window, navigate to the project root, and run:

Bash
cd frontend
npm install
npm run dev
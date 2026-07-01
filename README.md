# DevCollab — Real-Time Task & Project Manager

DevCollab is a collaborative, production-ready project management application designed for agile teams. Built completely on a unified JavaScript architecture (MERN stack), this platform facilitates seamless project delegation, data isolation, and dynamic updates without requiring page refreshes.

## 👥 Engineering & Collaboration
This project was conceptualized, designed, and architected end-to-end as a joint full-stack initiative. While execution was specialized to optimize parallel development workflows, both engineers maintained total architectural oversight of the entire system stack:

* **Frontend Engineering & Client Architecture:**
    * *Focus:* Component model design, UI/UX optimization, reactive global state tracking, and live server synchronization handlers.
* **Backend Engineering & System Architecture:** 
    * *Focus:* Database normalization, relational schemas, secure cryptographic authorization, RESTful middleware routers, and WebSocket event pipelines.

---

## 🛠️ The Tech Stack

### Client-Side Architecture (Frontend)
* **React 18:** Leveraged for declarative, component-driven UI architecture, custom hooks, and high-performance virtual DOM reconciliation.
* **Tailwind CSS:** Utilized for utility-first, rapid responsive layouts, ensuring zero runtime CSS bundle overhead.
* **Zustand:** Implemented for a decoupled, ultra-lightweight global client state store (bypassing redundant Redux boilerplate).
* **Axios:** Configured with centralized API clients and HTTP interceptors to implicitly transport authorization cookies.
* **dnd-kit / React Beautiful DnD:** Selected for seamless pointer tracking and physics-based interactions on the Kanban interface.
* **Socket.io-client:** Integrated to open persistent, duplex client channels for immediate reactive UI renders.

### Server-Side Architecture (Backend)
* **Node.js & Express.js:** Deployed as the core asynchronous runtime and micro-routing engine for processing concurrent client streams.
* **MongoDB & Mongoose ODM:** Utilized as a flexible, JSON-native document engine configured with transactional validation models.
* **JWT & bcrypt:** Configured as the core security barrier—hashing credentials at rest and generating state-secure authorization tokens passed via strict `httpOnly` client cookies.
* **Socket.io (Server):** Designed as an event-driven synchronization tier utilizing targeted communication rooms grouped by active Project IDs.
* **Multer & Cloudinary API:** Integrated for parsing multipart form streams and offloading raw user asset optimization to a dedicated CDN.

---

## 🗄️ System Architecture & Data Topology

The application relies on a strictly relational data layout mapping user privileges down to specific contextual items:


```
              ┌───────────────────┐
              │     USER MODEL    │
              └─────────┬─────────┘
                        │ (1-to-Many)
                        ▼
              ┌───────────────────┐
              │   PROJECT MODEL   │
              └─────────┬─────────┘
                        │ (1-to-Many)
                        ▼
              ┌───────────────────┐
              │     TASK MODEL    │
              └───────────────────┘

```


* **User Document:** Captures structural identity attributes (`Name`, `Email`, `Hashed Password`, `Avatar Location`, and active bio details).
* **Project Document:** Configured with hard pointer parameters pointing to a master User ID (`Owner`) alongside a relational array of authorized participant IDs mapped to discrete operational permission markers (`Members`).
* **Task Document:** The structural unit tracking status flags (`todo`, `inprogress`, `done`), priority rankings (`low`, `medium`, `high`), assigned consumer contexts, and absolute deadline timestamps.

---

## 📡 Primary Operational Endpoints

### Authentication & Profiles
* `POST /api/auth/register` — Sanitizes inputs and provisions structural user accounts.
* `POST /api/auth/login` — Grants valid system access; sets signed cryptographic JWT cookies.
* `POST /api/auth/logout` — Destroys security cookies instantly across client browsers.
* `GET /api/users/me` — Resolves valid session authentication contexts.

### Workspace Projects
* `GET /api/projects` — Aggregates all project spaces a user owns or has been granted permission to access.
* `POST /api/projects` — Provisions a new workspace matrix.
* `POST /api/projects/:id/invite` — Appends user identities into target project permission lists.

### Task Matrix
* `POST /api/tasks` — Instantiates a tracking card restricted to a designated target project.
* `PUT /api/tasks/:id` — Dynamically modifies titles, user descriptions, assignment targets, or operational statuses.
* `DELETE /api/tasks/:id` — Prunes the target task record permanently from database registers.

---

## 🚀 Local Development Setup

### 1. Repository Initializing
```bash
git clone <your-github-repo-url>
cd devcollab

```

### 2. Frontend Execution Setup

```bash
cd client
npm install
npm run dev

```

### 3. Backend Implementation Setup

```bash
cd ../server
npm install
npm run dev

```

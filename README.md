# 🚀 DevLogs

> AI-powered GitHub activity analyzer that transforms raw GitHub events into meaningful developer insights.

DevLogs allows users to enter any GitHub username and instantly receive:

- 📊 Activity statistics
- 🗂️ Repository breakdowns
- 🤖 AI-generated summaries using Gemini
- 🔄 Automatic background syncing with APScheduler

---

## ✨ Features

### 🔍 GitHub Activity Sync

Fetches recent public GitHub events for any registered user.

### 🗄️ Persistent Storage

Stores users and events in PostgreSQL (NeonDB).

### 📈 Analytics

Generates useful metrics such as:

- Total events
- Events by type
- Events by repository

### 🤖 AI Digest

Uses Google Gemini to generate a concise engineering-style summary of a developer's recent activity.

### ⏰ Automatic Background Sync

APScheduler periodically refreshes data for all registered users.

### 🌐 Full-Stack Dashboard

Next.js frontend displays stats and AI summaries in a polished UI.

---

# 🏗️ Architecture

```text
GitHub API
    ↓
FastAPI Backend
    ├── Register Users
    ├── Sync Events
    ├── Compute Stats
    ├── Generate AI Digest
    └── APScheduler Auto Sync
    ↓
PostgreSQL (NeonDB)
    ↓
Next.js Frontend
```

---

# 🛠️ Tech Stack

## Backend

- FastAPI
- SQLAlchemy (Async)
- PostgreSQL (NeonDB)
- HTTPX
- APScheduler
- Google Gemini API
- Pydantic

## Frontend

- Next.js 15
- TypeScript
- Tailwind CSS

## Infrastructure

- NeonDB
- GitHub REST API
- Google Gemini

---

# 📁 Project Structure

```text
DevLogs/
├── backend/
│   ├── app/
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   └── models.py
│   │   ├── services/
│   │   │   └── scheduler.py
│   │   └── main.py
│   ├── api/
│   │   └── routes/
│   │       ├── user.py
│   │       ├── sync.py
│   │       ├── genai.py
│   │       └── analyze.py
│   ├── pyproject.toml
│   └── .env
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   └── profile/[username]/page.tsx
│   └── package.json
│
└── README.md
```

---

# 🔌 API Endpoints

## Register User

```http
POST /api/users/register
```

## Sync GitHub Events

```http
POST /api/users/sync
```

## Get Stats

```http
GET /api/users/{username}/stats
```

## Generate AI Digest

```http
GET /api/genai/{username}
```

## Analyze (One-Call Workflow)

```http
POST /api/users/analyze
```

This endpoint:

1. Registers the user if needed
2. Syncs GitHub events
3. Computes statistics
4. Generates an AI summary
5. Returns everything in one response

---

# 📦 Example Analyze Request

```json
{
  "username": "octocat"
}
```

## Example Response

```json
{
  "username": "octocat",
  "stats": {
    "total_events": 42,
    "events_by_type": {
      "PushEvent": 18,
      "PullRequestEvent": 5
    },
    "events_by_repo": {
      "octocat/Hello-World": 20
    }
  },
  "digest": "octocat has been highly active, with most work focused on PushEvents in Hello-World. This suggests consistent coding activity and strong repository engagement."
}
```

---

# ⚙️ Environment Variables

Create `backend/.env`:

```env
DB_URI=postgresql+asyncpg://...
GEMINI_API_KEY=your_gemini_api_key
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

# 🚀 Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/devlogs.git
cd devlogs
```

## 2. Backend Setup

```bash
python -m venv .venv
source .venv/Scripts/activate   # Windows Git Bash

cd backend
uv sync
uv run uvicorn app.main:app --reload
```

Backend will be available at:

- `http://127.0.0.1:8000`
- `http://127.0.0.1:8000/docs`

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at:

- `http://localhost:3000`

---

# 🔄 Background Scheduler

DevLogs uses APScheduler to automatically sync all registered users every few hours.

### Scheduler Workflow

```text
App Startup
    ↓
start_scheduler()
    ↓
Every 6 Hours
    ↓
sync_all_users()
    ↓
Fetch latest GitHub events
    ↓
Store only new events
```

Duplicate prevention is handled using GitHub's unique `event_id`.

---

# 🧠 AI Prompt Strategy

DevLogs sends GitHub stats to Gemini with a prompt that asks for:

- Overall activity level
- Most common event type
- Most active repository
- Productivity insights
- One recommendation

This produces concise and useful engineering summaries.

---

# 🖼️ Frontend Workflow

1. User enters a GitHub username.
2. Frontend calls `POST /api/users/analyze`.
3. Backend returns stats and digest.
4. Dashboard displays:
   - Total events
   - Event types
   - Repository breakdown
   - AI summary

---

# 📌 Example Use Cases

- Developer portfolio analysis
- Engineering productivity reports
- GitHub activity dashboards
- AI-powered weekly digests

---

# 🧪 Future Improvements

- 📊 Interactive charts with Recharts
- 📅 Weekly and monthly trends
- 🏆 Productivity scoring
- 📧 Email summaries
- 🔐 GitHub OAuth authentication
- ☁️ Deployment to Render/Railway/Vercel

---

# 🏆 What This Project Demonstrates

This project showcases:

- Async backend development with FastAPI
- Database modeling with SQLAlchemy
- Third-party API integration
- AI integration with Gemini
- Background job scheduling
- Full-stack development with Next.js

---

# 📸 Screenshots

Add screenshots here after deployment.

---

# 🚀 Deployment

## Backend

- Render
- Railway

## Frontend

- Vercel

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

# 📄 License

MIT License.

---

# 👨‍💻 Author

Built by **Ayan**.

If you found this project interesting, feel free to star the repository ⭐

# ✅ Task Tracker MVP

A modern, full-stack task management application built with React and FastAPI. Features real-time updates, user authentication, and a clean, responsive UI.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- **User Authentication** - Secure login and registration with JWT tokens
- **Task CRUD** - Create, read, update, and delete tasks
- **Priority Levels** - High, Medium, Low priority indicators
- **Due Dates** - Set and track task deadlines
- **Status Management** - Todo, In Progress, Completed states
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode** - Easy on the eyes dark theme

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Tailwind CSS | Styling |
| Axios | HTTP Client |
| React Router | Navigation |

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | API Framework |
| SQLite | Database |
| SQLAlchemy | ORM |
| JWT | Authentication |

## 📁 Project Structure

```
task-tracker-mvp/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   └── auth.py
│   └── requirements.txt
└── README.md
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/1a1a2e/00d9ff?text=Task+Dashboard)

## 👨‍💻 Author

**Ehtisham Ashraf**  
Senior AI Software Engineer | Full-Stack Developer

- GitHub: [@EhtishamProAI](https://github.com/EhtishamProAI)
- Email: kingehtsham0@gmail.com

# NutriPulse — Calorie Tracker & Personal Nutrition Recommendation System

NutriPulse is a production-style, full-stack MERN (MongoDB, Express.js, React, Node.js) Health & Nutrition Management Platform. The platform calculates user-specific Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the **Mifflin-St Jeor equation**, tracks daily calorie and macronutrient budgets, logs workouts, and provides an **AI-driven macro-matching recommendation engine** that suggests personalized daily menus.

---

## 🌟 Key Features

- **Authentication & Security**: JWT Access (15m) & HTTP-Only Refresh Tokens (7d), password hashing with bcrypt, Zod payload validation, and role-based access control (`USER`, `NUTRITIONIST`, `ADMIN`).
- **Biometric & Mifflin-St Jeor Engine**:
  - Male: \( 10 \times \text{weight(kg)} + 6.25 \times \text{height(cm)} - 5 \times \text{age(y)} + 5 \)
  - Female: \( 10 \times \text{weight(kg)} + 6.25 \times \text{height(cm)} - 5 \times \text{age(y)} - 161 \)
  - TDEE multipliers from Sedentary (1.2) to Extra Active (1.9).
  - Dynamic calorie deficit/surplus adjustment (-500 kcal for weight loss, +350 for muscle gain) and macro goal distribution (Protein, Carbs, Fat).
- **Food & Nutrition Database**: Full-text search and category filtering for verified global ingredients and custom user foods.
- **Daily Food & Workout Journal**:
  - Meal logging across Breakfast, Lunch, Dinner, and Snacks.
  - Workout & exercise logging with estimated calorie burn.
  - Real-time net calorie calculation: \( \text{Net Calories} = \text{Consumed Calories} - \text{Burned Calories} \).
- **Intelligent AI Recommendation Engine**: Reads real-time remaining macro budget and dietary preferences (Vegetarian, Vegan, Keto, High-Protein, Regular) to score and generate optimal meal suggestions.
- **Progress Tracking & Analytics**: Body weight logging with interactive **Recharts** analytical dashboards for Calorie Trends, Macro Breakdown, and Weight Progress.
- **Admin Command Center**: User role management, system audit logs, and global database metrics.

---

## 🏗️ System Architecture & Workflow

```
                                  +-----------------------+
                                  |     React Client      |
                                  | (Vite + Tailwind CSS  |
                                  |  + Recharts + Lucide) |
                                  +-----------+-----------+
                                              | Axios (JWT Credentials)
                                              v
                                  +-----------+-----------+
                                  |  Express.js REST API  |
                                  |  (Node.js ES Modules) |
                                  +-----------+-----------+
                                              |
        +-------------------------------------+-------------------------------------+
        |                                     |                                     |
        v                                     v                                     v
+---------------+                    +----------------+                    +------------------+
| Security &    |                    | Controllers &  |                    | Mifflin-St Jeor &|
| Validation    |                    | Middleware     |                    | Recommendation   |
| (JWT, Zod)    |                    +-------+--------+                    | Engine           |
+---------------+                            |                             +------------------+
                                             v
                                     +-------+--------+
                                     | Mongoose Models|
                                     +-------+--------+
                                             |
                                             v
                                     +-------+--------+
                                     | MongoDB Atlas/ |
                                     | Local MongoDB  |
                                     +----------------+
```

---

## 📁 Repository Structure

```
Calorie-Tracker/
├── backend/
│   ├── src/
│   │   ├── config/ (db.js, env.js, cloudinary.js)
│   │   ├── controllers/ (auth, profile, food, log, recommendation, progress, report, admin)
│   │   ├── models/ (User, HealthProfile, FoodItem, MealLog, ExerciseLog, ProgressLog, AuditLog)
│   │   ├── routes/ (auth, profile, foods, logs, recommendations, progress, analytics, admin)
│   │   ├── middlewares/ (auth, validation, error)
│   │   ├── services/ (recommendationEngine)
│   │   ├── validators/ (auth, profile, food, log)
│   │   ├── utils/ (mifflinStJeor, jwtUtils, seedData)
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/ (axiosClient, authApi, foodApi, logApi, recommendationApi, progressApi, reportApi, adminApi)
│   │   ├── components/ (common, logging, food)
│   │   ├── context/ (AuthContext, HealthContext)
│   │   ├── pages/ (Dashboard, Logging, FoodDatabase, Recommendation, Progress, Analytics, Admin, Login, Register, Onboarding)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
├── postman_collection.json
└── README.md
```

---

## ⚡ Quick Start & Installation Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/nutripulse`) or MongoDB Atlas connection string.

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5050
MONGO_URI=mongodb://localhost:27017/nutripulse
JWT_ACCESS_SECRET=nutripulse_jwt_access_secret_super_key_2026
JWT_REFRESH_SECRET=nutripulse_jwt_refresh_secret_super_key_2026
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Seed the baseline verified global foods and System Admin user:

```bash
node src/utils/seedData.js --run
```

Start the backend API server:

```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The web application will open at **`http://localhost:5173`**.

---

## 📮 API Endpoints Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **POST** | `/api/v1/auth/register` | Public | Register new user account |
| **POST** | `/api/v1/auth/login` | Public | Authenticate user & issue JWT tokens |
| **POST** | `/api/v1/auth/refresh` | Public | Refresh expired access token |
| **POST** | `/api/v1/auth/logout` | Private | Revoke refresh token cookie |
| **GET** | `/api/v1/auth/me` | Private | Get current user profile & auth status |
| **POST** | `/api/v1/profile` | Private | Save biometrics & calculate BMR/TDEE targets |
| **GET** | `/api/v1/profile` | Private | Get biometric health profile |
| **GET** | `/api/v1/foods` | Private | Search verified & custom food items |
| **POST** | `/api/v1/foods` | Private | Create custom food item |
| **POST** | `/api/v1/logs/meals` | Private | Log meal items (breakfast, lunch, dinner, snack) |
| **GET** | `/api/v1/logs/summary` | Private | Get dynamic net calorie & macro summary |
| **POST** | `/api/v1/logs/exercise` | Private | Log exercise session & calorie burn |
| **GET** | `/api/v1/recommendations` | Private | AI-driven remaining macro recommendation menu |
| **POST** | `/api/v1/progress` | Private | Log weight & body fat progress entry |
| **GET** | `/api/v1/analytics/calorie-trends` | Private | Recharts formatted calorie trends |
| **GET** | `/api/v1/admin/users` | Admin | List all system users |
| **PUT** | `/api/v1/admin/users/:id/role` | Admin | Update user role |

---

## 🧪 Postman Collection Testing

A pre-configured Postman collection is included in the project root: **`postman_collection.json`**.

### How to Import into Postman:
1. Open **Postman**.
2. Click **Import** -> Select `postman_collection.json`.
3. Set the environment variable `{{baseUrl}}` to `http://localhost:5050/api/v1`.
4. Run **Auth -> Login User** to automatically populate the `{{accessToken}}` variable for subsequent requests!

---

## 🤝 Git & GitHub Workflow Rules

When contributing to this repository:
1. Follow **Conventional Commits** (`feat:`, `fix:`, `docs:`, `refactor:`, `style:`).
2. Never commit `.env` files containing secrets to version control.
3. Ensure all code passes `npm run build` cleanly before creating a Pull Request.

---

## 📄 License
Distributed under the MIT License.

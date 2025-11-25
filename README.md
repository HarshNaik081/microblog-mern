# Microblog Analytics Platform

A full-stack microblogging platform with real-time analytics dashboard using MERN stack and Power BI integration.

## Features

- User Authentication (JWT)
- Microblogging (280 char limit)
- Real-time Analytics Dashboard
- MongoDB Aggregation Pipelines
- Power BI Integration

## Tech Stack

**Frontend:** React, Material-UI, Axios, React Router  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT  
**Analytics:** Power BI, DAX, MongoDB Aggregations

## Installation

### Prerequisites

- Node.js v14+
- MongoDB Atlas account
- Power BI Desktop (optional)

### Setup Instructions

**1. Clone Repository**
```bash
git clone https://github.com/HarshNaik081/microblog-mern.git
cd microblog-mern
```

**2. Backend Setup**
```bash
cd server
npm install
```

Create `.env` file in `server` directory:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

**3. Seed Sample Data**
```bash
node seedData.js
```

**4. Frontend Setup**
```bash
cd ../client
npm install
```

**5. Run Application**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

**6. Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Demo Login: `harsh@example.com` / `password123`

## Power BI Setup

**1. Export Data**
```bash
cd server
node exportData.js
```

**2. Import to Power BI**
- Open Power BI Desktop
- Get Data → JSON → Select `server/analytics_data.json`
- Transform data: Expand columns, convert dates

**3. Create DAX Measures**
```dax
DAU = CALCULATE(DISTINCTCOUNT(Posts[authorId]), Posts[Date] = TODAY())
MAU = CALCULATE(DISTINCTCOUNT(Posts[authorId]), Posts[Date] >= EOMONTH(TODAY(), -1) + 1)
Engagement Rate = DIVIDE(SUM(Posts[likes]) + SUM(Posts[comments]), COUNT(Posts[_id]), 0)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post (Auth required)
- `PUT /api/posts/:id/like` - Like post (Auth required)

### Analytics
- `GET /api/analytics/dau` - Daily active users
- `GET /api/analytics/mau` - Monthly active users
- `GET /api/analytics/engagement` - Engagement metrics
- `GET /api/analytics/top-users` - Top 10 active users

## Project Structure

```
microblog-analytics/
├── client/           # React frontend
├── server/           # Express backend
│   ├── config/       # Database config
│   ├── middleware/   # Auth middleware
│   ├── models/       # Mongoose models
│   └── routes/       # API routes
└── screenshots/      # App screenshots
```

## Author

**Harsh Naik**  
GitHub: [@HarshNaik081](https://github.com/HarshNaik081)

## License

MIT License

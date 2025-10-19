# App Store Project

A full-stack application store built with Node.js/Express backend and React frontend.

## 🚀 Features

- **User Authentication**: Sign up, login with JWT tokens
- **App Management**: Create, publish, and manage applications
- **App Discovery**: Browse, search, and filter apps
- **Reviews & Ratings**: Users can review and rate apps
- **File Upload**: S3 integration for app file uploads
- **Developer Dashboard**: Tools for app developers
- **Admin Features**: Download analytics and management

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **AWS S3** for file storage
- **bcrypt** for password hashing

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- AWS S3 account (optional, for file uploads)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to the project directory
cd "App Store"

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

### 2. Environment Setup

The `.env` file has been created in the Backend directory with default values:

```env
# Database
MONGO_URI=mongodb://localhost:27017/appstore

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# AWS S3 (optional - for file uploads)
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your_bucket_name

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# Windows (if installed as service)
net start MongoDB

# Or start MongoDB manually
mongod
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new user account |
| POST | `/api/auth/login` | Login user |

### App Endpoints (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apps` | Get all published apps |
| GET | `/api/apps/:slug` | Get app by slug |
| GET | `/api/apps/search?q=query` | Search apps |
| POST | `/api/apps/:id/reviews` | Add/update review (Auth required) |
| POST | `/api/apps/:id/download` | Record download (Auth required) |

### Developer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/dev/apps` | Create new app (Developer role) |
| POST | `/api/dev/apps/:id/upload-url` | Get S3 upload URL |
| POST | `/api/dev/apps/:id/complete-upload` | Complete file upload |
| POST | `/api/dev/apps/:id/publish` | Publish app |

## 🧪 Testing with Postman

Import the `App_Store_API.postman_collection.json` file into Postman to test all endpoints.

### Quick Test Sequence:

1. **Sign Up**: Create a new user account
2. **Login**: Get authentication token
3. **Create App**: Create a new app (requires developer role)
4. **Get Apps**: List all published apps
5. **Add Review**: Add a review to an app

## 🔧 Configuration

### MongoDB Connection
Update `MONGO_URI` in `.env` to point to your MongoDB instance:
```env
MONGO_URI=mongodb://localhost:27017/appstore
```

### AWS S3 Setup (Optional)
For file upload functionality:
1. Create an S3 bucket
2. Update AWS credentials in `.env`
3. Ensure proper IAM permissions

### CORS Configuration
The backend is configured to accept requests from `http://localhost:5173`. Update `FRONTEND_URL` in `.env` for production.

## 🐛 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **CORS Errors**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check if frontend is running on correct port

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests

4. **File Upload Issues**
   - Verify AWS credentials
   - Check S3 bucket permissions

## 📁 Project Structure

```
App Store/
├── Backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Auth middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── services/       # External services
│   ├── index.js           # Server entry point
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── pages/         # React pages
│   │   ├── services/      # API service
│   │   └── components/    # Reusable components
│   ├── index.html
│   └── package.json
└── App_Store_API.postman_collection.json
```

## 🚀 Deployment

### Backend Deployment:
1. Set production environment variables
2. Use PM2 for process management
3. Configure reverse proxy (nginx)

### Frontend Deployment:
1. Build production bundle: `npm run build`
2. Serve static files
3. Configure API endpoints

## 📝 Development Notes

- Password minimum length: 6 characters
- JWT tokens expire in 7 days
- Apps auto-approve after 5 minutes
- File uploads use presigned URLs
- All timestamps are in UTC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

# SanForge

AI-powered UI code generator that converts text prompts and wireframes into production-ready frontend code. Features rapid prototyping, secure JWT-based authentication with OTP, and a workspace to preview, manage, and export generated UI components—helping developers build interfaces faster and more efficiently.

## 🌐 Live Demo

| Service  | URL |
|----------|-----|
| 🖥️ Frontend | [https://sanforge-app.vercel.app](https://sanforge-app.vercel.app) |

> **Note:** The backend is hosted on Render's free tier and may take up to **50 seconds** to respond after inactivity (cold start).

## 🚀 Features

- **AI-Powered Code Generation**: Transform natural language prompts and wireframes into clean, production-ready UI components.
- **Multi-Framework Support**: Generate code for HTML+CSS, HTML+Tailwind, HTML+Bootstrap, HTML+CSS+JS, and React+Tailwind.
- **Rapid Prototyping**: Quickly generate and iterate on UI components without manual coding.
- **Secure Authentication**: JWT-based login with email OTP verification.
- **Component Management**: Save, preview, and export generated UI components.
- **Responsive Design**: Generated components are mobile-friendly and adaptable.
- **Real-time Preview**: Instant visualization of generated code via Sandpack.
- **Export Options**: Download components as reusable code files.

## 🛠 Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud NoSQL database
- **JWT** - Authentication tokens
- **Resend** - Email sending for OTP (production-ready)
- **bcrypt** - Password hashing

### Frontend

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client for API calls
- **Sandpack** - In-browser code editor & preview
- **Google Gemini API** - AI code generation

### Hosting

- **Vercel** - Frontend deployment
- **Render** - Backend deployment
- **MongoDB Atlas** - Database hosting
- **Cloudinary** - Image uploads
- **Resend** - Transactional email

## 📋 Prerequisites

Before running this application locally, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- A **MongoDB Atlas** account - [Sign up here](https://www.mongodb.com/atlas)
- A **Resend** account - [Sign up here](https://resend.com)
- A **Google Gemini API Key** - [Get here](https://aistudio.google.com/app/apikey)
- A **Cloudinary** account - [Sign up here](https://cloudinary.com)

## 🔧 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dvya207/sanforge.git
   cd sanforge
   ```

2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up backend environment variables:**

   Create a `.env` file in the `backend` directory:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_strong_jwt_secret
   FRONTEND_URL=http://localhost:5173
   RESEND_API_KEY=your_resend_api_key
   NODE_ENV=development
   ```

5. **Set up frontend environment variables:**

   Create a `.env` file in the `frontend` directory:

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
   ```

## 🚀 Running Locally

1. **Start the backend server:**

   ```bash
   cd backend
   npm start
   ```

   The server will run on `http://localhost:5000`.

2. **Start the frontend development server:**

   ```bash
   cd frontend
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

### Key Workflows

- **Sign Up**: Create an account with OTP email verification.
- **Login**: Authenticate securely with your credentials.
- **Generate UI**: Enter a text prompt or upload a wireframe to generate code.
- **Preview & Edit**: View the generated component in real-time.
- **Save & Export**: Save components to your workspace and export as code files.

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/send-signup-otp` | Send OTP for signup |
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET  | `/api/auth/profile` | Get current user profile |
| POST | `/api/auth/forgot-password` | Send password reset OTP |
| POST | `/api/auth/reset-password` | Reset password with OTP |

### Saved Components

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/saved` | Retrieve saved components |
| POST   | `/api/saved/save` | Save a generated component |
| DELETE | `/api/saved/:id` | Delete a saved component |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.



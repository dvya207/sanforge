<div align="center">

# ⚡ SanForge ⚡
### *Transforming Text & Wireframes into Production-Ready UI in Seconds*

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-sanforge--app.vercel.app-blueviolet?style=for-the-badge&logo=vercel)](https://sanforge-app.vercel.app)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

---

</div>

## ✨ Overview

**SanForge** is a state-of-the-art, fullstack AI workspace that bridges the gap between design concepts and front-end engineering. Powered by Google Gemini AI, modern MERN architecture, and interactive live previews, SanForge turns plain text descriptions and visual wireframes into clean, responsive, production-ready code instantly.

Whether you're prototyping a rapid MVP, crafting bespoke Tailwind UI components, or generating full multi-framework React structures, SanForge accelerates your frontend workflow with real-time editing, secure OTP authentication, and cloud-synced component management.

---

## 🌐 Live Application

🚀 Experience SanForge live in action: **[https://sanforge-app.vercel.app](https://sanforge-app.vercel.app)**

---

## 🚀 Key Highlights & Features

- 🧠 **AI-Powered Code Synthesis**: Convert natural language prompts and hand-drawn wireframes into modular, semantic code.
- 🎨 **Multi-Stack Output**: Seamlessly target `HTML + CSS`, `Tailwind CSS`, `Bootstrap`, `Vanilla JS`, or `React + Tailwind`.
- ⚡ **Live Interactive Preview**: Real-time code execution powered by **Sandpack** for instant in-browser feedback.
- 🔐 **Hardened Authentication**: Secure JWT session handling coupled with **Brevo HTTP API** for OTP verification.
- ☁️ **Cloud Workspace**: Save, edit, organize, and export your generated UI components anytime across devices.
- 📱 **Fully Responsive Layouts**: Automatically crafted with mobile-first responsiveness and dark-mode elegance.

---


## 🛠 Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud NoSQL database
- **JWT** - Authentication tokens
- **Brevo (Sendinblue)** - HTTP API email sending for OTP
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
- **Brevo** - Transactional email

## 📋 Prerequisites

Before running this application locally, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- A **MongoDB Atlas** account - [Sign up here](https://www.mongodb.com/atlas)
- A **Brevo** account - [Sign up here](https://www.brevo.com)
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
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_strong_jwt_secret
   FRONTEND_URL=http://localhost:5173
   BREVO_API_KEY=your_brevo_api_key
   BREVO_SENDER_EMAIL=your_verified_email@example.com
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



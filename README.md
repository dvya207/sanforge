# SanForge

![SanForge Logo](https://via.placeholder.com/150) <!-- Replace with actual logo if available -->

AI-powered UI code generator that converts text prompts and wireframes into production-ready frontend code. Features rapid prototyping, secure JWT-based authentication with OTP, and a workspace to preview, manage, and export generated UI components—helping developers build interfaces faster and more efficiently.

## 🚀 Features

- **AI-Powered Code Generation**: Transform natural language prompts and wireframes into clean, production-ready React components.
- **Rapid Prototyping**: Quickly generate and iterate on UI components without manual coding.
- **Secure Authentication**: JWT-based login with OTP verification for user security.
- **Component Management**: Save, preview, and export generated UI components.
- **Responsive Design**: Generated components are mobile-friendly and adaptable.
- **Real-time Preview**: Instant visualization of generated code in the browser.
- **Export Options**: Download components as reusable code snippets.

## 🛠 Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **Nodemailer** - Email sending for OTP
- **bcrypt** - Password hashing

### Frontend

- **React** - UI library
- **Vite** - Build tool and dev server
- **CSS** - Styling
- **Axios** - HTTP client for API calls

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## 🔧 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/sanforge.git
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

4. **Set up environment variables:**

   Create a `.env` file in the `backend` directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sanforge
   JWT_SECRET=your_jwt_secret_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

   For the frontend, create a `.env` file in the `frontend` directory:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB:**
   Ensure MongoDB is running on your system.

## 🚀 Usage

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

3. **Access the application:**
   Open your browser and navigate to `http://localhost:5173` to start using SanForge.

### Key Workflows

- **Sign Up/Login**: Create an account or log in with OTP verification.
- **Generate UI**: Enter a text prompt or upload a wireframe to generate code.
- **Preview & Edit**: View the generated component in real-time and make adjustments.
- **Save & Export**: Save components to your workspace and export as code files.

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/forgot-password` - Password reset request

### Component Management Endpoints

- `GET /api/saved` - Retrieve saved components
- `POST /api/saved` - Save a new component
- `DELETE /api/saved/:id` - Delete a saved component

For detailed API documentation, refer to the [API Docs](./backend/docs/api.md) (if available).

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

Please read our [Contributing Guidelines](./CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📞 Contact

- **Project Lead**: [Your Name](mailto:your.email@example.com)
- **GitHub**: [https://github.com/yourusername/sanforge](https://github.com/yourusername/sanforge)
- **Issues**: [Report bugs or request features](https://github.com/yourusername/sanforge/issues)

---

Made with ❤️ by the SanForge team.

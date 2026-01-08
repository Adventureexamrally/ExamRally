# ExamRally

A comprehensive online examination platform built with React and Vite, offering PDF courses, video courses, mock tests, and live tests for competitive exam preparation.

## 🚀 Features

- **PDF Courses**: Access comprehensive study materials for Prelims and Mains
- **Video Courses**: Learn through expertly curated video content
- **Mock Tests**: Practice with timed mock exams
- **Live Tests**: Participate in real-time competitive tests
- **User Authentication**: Secure login via Clerk
- **Payment Integration**: Subscription-based access to premium content
- **Performance Analytics**: Track your progress and test results
- **Responsive Design**: Optimized for all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Bootstrap 5** - Component library

### State Management
- **Redux Toolkit** - Global state management
- **React Query (TanStack Query)** - Server state management

### Authentication & APIs
- **Clerk** - User authentication and management
- **Axios** - HTTP client
- **Firebase** - Backend services

### UI Components & Libraries
- **Material-UI (MUI)** - React component library
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **Video.js** - Video player
- **SweetAlert2** - Beautiful alerts
- **React Toastify** - Notifications
- **DOMPurify** - HTML sanitization for XSS protection

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/examrally.git
   cd examrally
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   
   # API Configuration
   VITE_APP_API_BASE_URL=your_api_base_url
   
   # Optional: OneSignal (Push Notifications)
   VITE_ONESIGNAL_APP_ID=your_onesignal_app_id
   
   # Optional: Microsoft Clarity (Analytics)
   VITE_CLARITY_ID=your_clarity_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 🏗️ Project Structure

```
examrally/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable React components
│   ├── context/        # React Context providers
│   ├── pages/          # Page components
│   ├── service/        # API services
│   ├── slice/          # Redux slices
│   ├── store/          # Redux store configuration
│   ├── utils/          # Utility functions
│   │   ├── logger.js   # Development-only logger
│   │   └── sanitizeHtml.js  # HTML sanitization
│   ├── App.jsx         # Main App component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── .env                # Environment variables (not tracked)
├── .gitignore          # Git ignore rules
├── index.html          # HTML entry point
├── package.json        # Project dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md           # This file
```

## 🔐 Security

- **XSS Protection**: All HTML content is sanitized using DOMPurify before rendering
- **Authentication**: Secure user authentication via Clerk
- **Environment Variables**: Sensitive data stored in environment variables
- **HTTPS**: Production deployment uses HTTPS

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set up environment variables in Vercel dashboard

### Manual Build

1. Create production build:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains the production-ready files

3. Deploy the `dist/` folder to your hosting provider

## 🧪 Testing

The application includes various test types and categories accessible through the UI:
- Mock tests for practice
- Live tests for real-time competition
- Descriptive question tests
- Section-wise tests with time management

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- ExamRally Team

## 🙏 Acknowledgments

- React team for the amazing framework
- All open-source contributors whose libraries made this project possible

## 📞 Support

For support, email support@examrally.in or visit our website at [https://examrally.in](https://examrally.in)

---

**Note**: Make sure to configure your environment variables before running the application. Never commit the `.env` file to version control.
# [**MedicSecure: Secure Healthcare Record Management System**](https://medicsecure.netlify.app)

Welcome to **MedicSecure**, a modern, secure, and seamless healthcare record management system designed to protect sensitive medical data while providing an intuitive user experience for patients and healthcare providers.

---

## **Screenshots**

![Landing Page](https://i.imgur.com/IJvfGcB.jpeg)
![Patient Dashboard](https://i.imgur.com/4B1Jqgw.jpeg)

---

## **Table of Contents**
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Usage](#usage)
7. [Contributing](#contributing)
8. [License](#license)

---

## **Overview**

**MedicSecure** is a web-based application that allows patients to securely upload, manage, and share their medical records with healthcare providers. It also provides doctors with a dashboard to access shared records, ensuring a streamlined and secure workflow.

---

## **Features**

- **Patient Portal**: 
  - Upload and manage medical records.
  - Share records with healthcare providers.
  - Secure authentication and role-based access control.

- **Doctor Dashboard**:
  - Access shared medical records.
  - Download records securely.
  - View detailed metadata for each record.

- **Security**:
  - End-to-end encryption for sensitive data.
  - Role-based access control (RBAC).
  - Compliance with healthcare privacy standards (HIPAA, GDPR).

- **Modern UI/UX**:
  - Responsive design for all devices.
  - Intuitive and user-friendly interface.
  - Real-time feedback with notifications.

---

## **Tech Stack**

### **Frontend**
- **React**: Component-based UI development.
- **TypeScript**: Strongly typed JavaScript for better code quality.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Framer Motion**: Smooth animations and transitions.

### **Backend**
- **Supabase**: Backend-as-a-service for authentication, database, and storage.

### **Build Tools**
- **Vite**: Fast and modern build tool for development and production.
- **ESLint**: Linting for consistent code quality.
- **PostCSS**: CSS transformations and optimizations.

---

## **Getting Started**

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn package manager

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/medicsecure.git
   cd medicsecure
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=<your-supabase-url>
     VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
     ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## **Project Structure**

```
MedicSecure/
├── src/
│   ├── components/         # Reusable React components
│   │   ├── auth/           # Authentication-related components
│   │   ├── landing/        # Landing page components
│   │   ├── modals/         # Modal components
│   │   └── ...             # Other components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries (e.g., Supabase client)
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── supabase/               # Supabase migration files
├── public/                 # Static assets
├── .env                    # Environment variables
├── package.json            # Project metadata and dependencies
└── vite.config.ts          # Vite configuration
```

---

## **Usage**

### **For Patients**
1. **Sign Up**: Create an account using your email and password.
2. **Upload Records**: Add medical records with metadata (e.g., title, type).
3. **Share Records**: Share records with doctors by email and set permissions.

### **For Doctors**
1. **Login**: Access the doctor dashboard using your credentials.
2. **View Records**: See records shared by patients.
3. **Download Records**: Securely download medical records for review.

---

## **License**

This project is licensed under the MIT License.

---

**Thank you for using MedicSecure! Your health data, protected and secure.**
# ApexOS - AI Operating System for Human Performance

## About

**ApexOS** is a sophisticated, bilingual (English & Persian) sports coaching and athlete management platform. Designed as an "AI Operating System for Human Performance," it provides coaches and sports scientists with a centralized hub for monitoring, analyzing, and optimizing athlete performance through real-time biometrics, motion analysis, and personalized training programs. This platform aims to empower sports professionals with data-driven insights to enhance athlete development, prevent injuries, and maximize performance potential.

---

## 🚀 Key Features

### 📊 Coach Dashboard
A high-level overview of team performance, featuring:
- **Live Metrics:** Heart rate, sprint distance, and strain ratios (ACWR).
- **AI Recommendations:** Automated alerts for injury prevention and training adjustments.
- **Performance Analytics:** Interactive stamina and performance charts powered by Recharts.

### 🧬 Biometrics & Telemetry Lab
In-depth tracking of physiological data, including:
- Heart rate variability (HRV), sleep quality, and recovery scores.
- Real-time biometric calibration and synchronization with wearable devices.

### 🎥 Vision Kinematics (Motion Analysis)
Advanced motion tracking and biomechanical analysis to:
- Monitor joint angles and movement efficiency.
- Identify potential injury risks through visual kinematics.

### 🏋️ Workout Builder & Nutrition Studio
- **Dynamic Workouts:** Create and manage personalized training programs from an extensive exercise database.
- **Nutritional Planning:** Tailor caloric and macronutrient intake based on athlete-specific needs and performance goals.

### 👤 Athlete 360 Profile
A comprehensive view of each athlete's journey, combining:
- Physical stats and medical history.
- Performance trends and psychological readiness.
- Mobile simulator for viewing the athlete's app experience.

### 🌍 Bilingual Support
Full support for both **English (LTR)** and **Persian (RTL)**, including localized typography (Vazirmatn) and data.

---

## 🛠 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Linting:** [Oxlint](https://oxc.rs/)

---

## ▶️ How to Run It

To get ApexOS up and running on your local machine, follow these steps:

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- A package manager: [pnpm](https://pnpm.io/) (recommended) or `npm`

### Installation and Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mmadrb/apex-os.git
   cd apex-os
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```

### Development Mode
To start the development server with hot-reloading:
```bash
npm run dev
```
This will typically open the application in your browser at `http://localhost:5173` (or a similar port).

### Production Build
To build the project for production deployment:
```bash
npm run build
```
This command compiles and optimizes the application for deployment, placing the output in the `dist` directory.

### Preview Production Build
To locally preview the optimized production build:
```bash
npm run preview
```

---

## 📄 License
This project is private and intended for internal use.

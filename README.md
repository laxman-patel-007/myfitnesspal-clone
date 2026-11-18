# MyFitnessPal Web Clone — Nutrition & Health Tracking Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Live-Demo%20on%20GitHub%20Pages-2ea44f?logo=github)](https://laxman-patel-007.github.io/myfitnesspal-clone/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3 Design Tokens](https://img.shields.io/badge/CSS3-Design%20Tokens-1572B6?logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Chart.js](https://img.shields.io/badge/Visualizations-Chart.js-FF6384?logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)

A responsive web application replicating the core user flows, health analytics, and design system of **MyFitnessPal**. Built with vanilla web technologies, modular architecture, algorithmic calorie/macro budgeting, and zero external framework dependencies.

---

## 🚀 Live Demo & Recruiter Fast-Track

🔗 **Live Website**: [https://laxman-patel-007.github.io/myfitnesspal-clone/](https://laxman-patel-007.github.io/myfitnesspal-clone/)

- **1-Click Recruiter Demo**: On the login page, click **"⚡ 1-Click Demo Login"** to instantly access an active demo account (*Sarah Jenkins*) pre-seeded with:
  - Active **14-day logging streak**
  - Complete daily multi-meal diary entries (Breakfast, Lunch, Dinner, Snacks) with accurate macros
  - Logged cardio workouts with MET-based calorie burn calculations
  - Historical weight trendline showing a **-4.3 kg** progression
  - Interactive 8-glass water tracker (6/8 glasses logged)

---

## 🌟 Key Features

### 1. Modern Landing Page
- Authentic MFP brand aesthetic using royal blue, deep navy, and cyan accents.
- Floating 3D mobile mockup previewing live calorie rings and macro gauges.
- **Interactive Calorie & Macro Target Calculator** utilizing the **Mifflin-St Jeor BMR formula**.
- **Interactive Food Search Widget** with category filter pills and live results.
- Member testimonials, 3.5M 5-star rating trust bar, and accordion FAQ.

### 2. Signature Daily Dashboard
- **Calorie Equation Hero Card**: `Goal (2,100) - Food (1,911) + Exercise (345) = Remaining (535 kcal)` with a dynamic budget progress bar.
- **Macronutrient Doughnut Chart**: Chart.js donut chart with centered total calories and Carbs / Protein / Fat progress bars.
- **Interactive 8-Glass Water Tracker**: Clickable glasses updating hydration volume in 250 ml increments with immediate localStorage persistence.
- **Quick Action Hub**: Shortcuts to log meals, workouts, weight, and water.

### 3. Comprehensive Food Diary
- Granular meal breakdown for **Breakfast, Lunch, Dinner, and Snacks**.
- Detailed nutrition metrics: Calories, Carbs (g), Fat (g), Protein (g), Sodium (mg), and Sugar (g).
- Subtotal badges for every meal and a Grand Totals comparison table (Consumed vs. Goal vs. Remaining).
- Real-time food search modal across a 52+ item verified food database.
- Dynamic **FDA Nutrition Facts label preview** with serving size multipliers.
- **5-Week Weight Loss Projection**: Calculates estimated future weight based on cumulative daily caloric deficit.

### 4. Exercise Diary & Activity Tracking
- Tracks cardio and strength exercises with MET-based calorie burn per minute.
- Daily summaries of calories burned, active workout minutes, and weekly goal progress (e.g., 4/4 days).

### 5. Progress Analytics & Historical Charts
- Interactive Chart.js weight loss trendline with smooth Bézier curves and goal target line.
- Daily calorie intake bar charts with macronutrient averages.
- 7-day, 30-day, and 90-day time range filters.

### 6. Nutrition Goals & Macro Ratio Splitter
- Configurable weight goals with pace selector (`0.25 kg` to `1.0 kg/week`) and completion date estimator.
- Interactive macro percentage sliders with real-time gram conversion and 100% ratio integrity check.

### 7. Coaches Directory & Premium Showcase
- Directory of certified personal trainers and registered dietitians with ratings, specialties, and booking modal.
- Premium membership page with feature comparison and an **interactive Free/Premium plan toggle**.

---

## 💻 Tech Stack & Architecture

- **Core**: Semantic HTML5, Vanilla JavaScript (ES6+ Classes & Modules)
- **Styling**: Modern CSS3 (CSS Grid, Flexbox, Custom Properties / Design Tokens)
- **Data Visualization**: [Chart.js](https://www.chartjs.org/)
- **Icons & Typography**: FontAwesome 6, Google Fonts (*Plus Jakarta Sans*, *Inter*)
- **Storage**: Custom `Storage` abstraction layer over `localStorage` and `sessionStorage` with JSON serialization.
- **Routing**: Relative path resolution ensuring zero broken links whether deployed on a root domain, subfolder (GitHub Pages), or local development server.

---

## 🏃 Quick Start (Run Locally)

No build steps, bundlers, or `npm install` required!

```bash
# Clone the repository
git clone https://github.com/laxman-patel-007/myfitnesspal-clone.git
cd myfitnesspal-clone

# Start local dev server
python3 dev_server.py

# Open in your browser
http://localhost:3000
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

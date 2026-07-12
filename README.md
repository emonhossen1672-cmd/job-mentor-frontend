# Job Mentor

চাকরি প্রস্তুতির সেরা মোবাইল অ্যাপ — MCQ পরীক্ষা, লিখিত পরীক্ষা, ফলাফল এবং প্রোফাইল এক জায়গায়।

A modern, mobile-first React application for job exam preparation in Bengali. Features MCQ practice with timer & scoring, written exam with file uploads, result tracking, and profile management.

## Features

### 1. Home (হোম)
- Hero banner with quick action buttons
- Exam categories (সরকারি চাকরি, ব্যাংক চাকরি, BCS প্রস্তুতি, প্রাইভেট চাকরি)
- Subject list (বাংলা, ইংরেজি, গণিত, সাধারণ জ্ঞান, বিজ্ঞান, আইসিটি)
- Statistics dashboard
- Sample MCQ with interactive answer feedback

### 2. MCQ Exam (MCQ পরীক্ষা)
- Loads questions from `https://job-mentor.onrender.com/api/mcqs/`
- 4 multiple-choice options per question
- Correct/Wrong color feedback (green/red)
- 30-second countdown timer per question
- Real-time score tracking
- Progress bar
- Subject filters
- Final results summary with percentage

### 3. Written Exam (লিখিত পরীক্ষা)
- Loads questions from `https://job-mentor.onrender.com/api/written-questions`
- Text answer input
- Image upload (with preview)
- PDF upload
- Submit answer to API
- Success/error feedback

### 4. Result (ফলাফল)
- Loads student submissions from API
- Shows pending or graded status
- Displays marks for graded submissions
- Summary statistics (total, pending, graded)
- Overall score banner

### 5. Profile (প্রোফাইল)
- User avatar and basic info
- Editable profile fields (name, email, phone, location, education, target)
- Activity statistics
- Settings menu
- Logout button

## Tech Stack

- **React 18** — UI library
- **Vite 5** — Build tool & dev server
- **React Router 6** — Client-side routing
- **Axios** — HTTP client
- **React Icons** — Icon library (Heroicons)
- **Tailwind CSS 3** — Utility-first styling
- **Hind Siliguri** — Bengali font

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs at `http://localhost:5173`.

## API Endpoints

The app connects to `https://job-mentor.onrender.com/api`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcqs/` | GET | Fetch MCQ questions |
| `/written-questions` | GET | Fetch written exam questions |
| `/submissions` | GET | Fetch student submissions |
| `/submissions` | POST | Submit written exam answer |

## Project Structure

```
job-mentor/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── ErrorState.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── PageHeader.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── MCQ.jsx
│   │   ├── WrittenExam.jsx
│   │   ├── Result.jsx
│   │   └── Profile.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Design

- **Mobile-first** layout with max-width container
- **Blue gradient** theme (brand color system)
- **Bengali language** throughout (Hind Siliguri font)
- **Bottom navigation** with 5 tabs
- **Smooth animations** — fade-in, slide-up, slide-in, pop, shake
- **Responsive** — works on mobile, tablet, and desktop
- **Accessible** — proper contrast, tap targets, semantic HTML

## License

MIT
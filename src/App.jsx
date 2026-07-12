import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav.jsx'
import Home from './pages/Home.jsx'
import MCQ from './pages/MCQ.jsx'
import Topics from './pages/Topics.jsx'
import WrittenExam from './pages/WrittenExam.jsx'
import Result from './pages/Result.jsx'
import Profile from './pages/Profile.jsx'

export default function App() {
  return (
    <div className="app-container">
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mcq" element={<MCQ />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/written" element={<WrittenExam />} />
          <Route path="/result" element={<Result />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

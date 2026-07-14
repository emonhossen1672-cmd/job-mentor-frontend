import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav.jsx'
import Home from './pages/Home.jsx'
import QuestionBank from './pages/QuestionBank.jsx'
import MCQ from './pages/MCQ.jsx'
import Topics from './pages/Topics.jsx'
import WrittenHub from './pages/WrittenHub.jsx'
import WrittenExam from './pages/WrittenExam.jsx'
import ExamPapers from './pages/ExamPapers.jsx'
import ModelTestList from './pages/ModelTestList.jsx'
import ModelTestExam from './pages/ModelTestExam.jsx'
import Result from './pages/Result.jsx'
import Profile from './pages/Profile.jsx'

export default function App() {
  return (
    <div className="app-container">
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/question-bank" element={<QuestionBank />} />
          <Route path="/mcq" element={<MCQ />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/written" element={<WrittenHub />} />
          <Route path="/written/study" element={<WrittenExam />} />
          <Route path="/exam-papers" element={<ExamPapers />} />
          <Route path="/model-tests" element={<ModelTestList />} />
          <Route path="/model-tests/:id/exam" element={<ModelTestExam />} />
          <Route path="/result" element={<Result />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

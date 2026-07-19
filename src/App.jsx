import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import BottomNav from './components/BottomNav.jsx'
import Home from './pages/Home.jsx'
import QuestionBank from './pages/QuestionBank.jsx'
import MCQ from './pages/MCQ.jsx'
import MCQHub from './pages/MCQHub.jsx'
import Topics from './pages/Topics.jsx'
import WrittenModelTestList from './pages/WrittenModelTestList.jsx'
import WrittenModelTestExam from './pages/WrittenModelTestExam.jsx'

import WrittenHub from './pages/WrittenHub.jsx'
import WrittenExam from './pages/WrittenExam.jsx'
import ExamPapers from './pages/ExamPapers.jsx'
import ModelTestList from './pages/ModelTestList.jsx'
import ModelTestExam from './pages/ModelTestExam.jsx'
import Result from './pages/Result.jsx'
import Profile from './pages/Profile.jsx'
import BookmarkedQuestions from './pages/BookmarkedQuestions.jsx'
import Login from './pages/Login.jsx'
import ComingSoon from './pages/ComingSoon.jsx'

export default function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <main className="min-h-screen">
          <Routes>
            {/* লগইন ছাড়াই খোলা */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/question-bank" element={<QuestionBank />} />
            <Route path="/mcq" element={<MCQHub />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/written" element={<WrittenHub />} />
            <Route path="/written-model-tests" element={<WrittenModelTestList />} />
            <Route path="/exam-papers" element={<ExamPapers />} />
            <Route path="/model-tests" element={<ModelTestList />} />
            <Route path="/profile" element={<Profile />} />

            {/* Study Section */}
            <Route path="/study/free-hand-writing" element={<ComingSoon />} />
            <Route path="/study/editorial" element={<ComingSoon />} />
            <Route path="/study/newspaper-vocabulary" element={<ComingSoon />} />
            <Route path="/study/current-affairs" element={<ComingSoon />} />
            <Route path="/study/bangla-mukhosto" element={<ComingSoon />} />
            <Route path="/study/translation" element={<ComingSoon />} />
            <Route path="/study/translation-newspaper" element={<ComingSoon />} />

            {/* লগইন বাধ্যতামূলক */}
            <Route
              path="/mcq/practice"
              element={
                <ProtectedRoute>
                  <MCQ />
                </ProtectedRoute>
              }
            />
            <Route
              path="/written-model-tests/:id/exam"
              element={
                <ProtectedRoute>
                  <WrittenModelTestExam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/written/study"
              element={
                <ProtectedRoute>
                  <WrittenExam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/model-tests/:id/exam"
              element={
                <ProtectedRoute>
                  <ModelTestExam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/result"
              element={
                <ProtectedRoute>
                  <Result />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <BookmarkedQuestions />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </AuthProvider>
  )
}

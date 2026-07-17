import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { fetchModelTestQuestions, submitModelTest, fetchModelTestLeaderboard } from '../services/api'

const toBengaliNumber = (num) => {
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' }
  return String(num).replace(/[0-9]/g, (d) => map[d])
}

export default function ModelTestExam() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const title = location.state?.title || 'মডেল টেস্ট'
  const durationMinutes = location.state?.duration_minutes || 60

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState('loading')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [studentName, setStudentName] = useState(() => localStorage.getItem('jobMentorStudentName') || '')
  const [studentPhone, setStudentPhone] = useState(() => localStorage.getItem('jobMentorStudentPhone') || '')
  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const [submittedScore, setSubmittedScore] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    fetchModelTestQuestions(id)
      .then((data) => {
        setQuestions(data)
        setSecondsLeft(durationMinutes * 60)
        setPhase('name')
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const finishExam = useCallback(async () => {
    clearInterval(timerRef.current)
    setSubmitting(true)
    try {
      const answersPayload = questions.map((q) => ({
        question_id: q.id,
        selected: answers[q.id] || null
      }))
      const result = await submitModelTest(id, {
        student_name: studentName,
        student_phone: studentPhone,
        answers: answersPayload
      })
      setSubmittedScore(result)
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
    setPhase('result')
  }, [questions, answers, id, studentName, studentPhone])

  useEffect(() => {
    if (phase !== 'exam') return
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          finishExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, finishExam])

  useEffect(() => {
    if (phase !== 'result') return
    setLeaderboardLoading(true)
    fetchModelTestLeaderboard(id)
      .then((data) => setLeaderboard(data))
      .catch((err) => console.error(err))
      .finally(() => setLeaderboardLoading(false))
  }, [phase, id])

  const startExam = () => {
    if (!studentName.trim()) return
    localStorage.setItem('jobMentorStudentName', studentName.trim())
    if (studentPhone.trim()) {
      localStorage.setItem('jobMentorStudentPhone', studentPhone.trim())
    }
    setPhase('exam')
  }

  const selectAnswer = (questionId, letter) => {
    setAnswers((prev) => ({ ...prev, [questionId]: letter }))
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${toBengaliNumber(String(m).padStart(2, '0'))}:${toBengaliNumber(String(sec).padStart(2, '0'))}`
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-500">লোড হচ্ছে...</div>
  }

  if (phase === 'name') {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-xl font-bold mb-1">{title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          প্রশ্ন: {toBengaliNumber(questions.length)} | সময়: {toBengaliNumber(durationMinutes)} মিনিট
        </p>
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">আপনার নাম</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="নাম লিখুন"
            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">মোবাইল নম্বর (ঐচ্ছিক)</label>
          <input
            type="tel"
            value={studentPhone}
            onChange={(e) => setStudentPhone(e.target.value)}
            placeholder="যেমন: ০১৭xxxxxxxx"
            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
          <p className="text-xs text-gray-400 mt-1.5">লিডারবোর্ডে আপনাকে আলাদাভাবে চিনতে সাহায্য করবে</p>
        </div>
        <button
          onClick={startExam}
          disabled={!studentName.trim()}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl active:scale-95 transition disabled:opacity-50"
        >
          পরীক্ষা শুরু করুন
        </button>
      </div>
    )
  }

  if (phase === 'result') {
    const score = submittedScore?.score ?? 0
    const total = submittedScore?.total ?? questions.length
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0

    return (
      <div className="p-4 pb-20">
        <h1 className="text-xl font-bold mb-4">{title} — ফলাফল</h1>
        <div className="bg-white rounded-xl shadow p-6 text-center mb-4">
          <p className="text-4xl font-bold text-blue-600 mb-1">{toBengaliNumber(percentage)}%</p>
          <p className="text-sm text-gray-500">সাফল্যের হার</p>
          <div className="flex justify-around mt-5 pt-5 border-t border-gray-100">
            <div>
              <p className="text-xl font-bold text-emerald-600">{toBengaliNumber(score)}</p>
              <p className="text-xs text-gray-400">সঠিক</p>
            </div>
            <div>
              <p className="text-xl font-bold text-red-500">{toBengaliNumber(total - score)}</p>
              <p className="text-xs text-gray-400">ভুল</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-700">{toBengaliNumber(total)}</p>
              <p className="text-xs text-gray-400">মোট</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <h2 className="text-sm font-bold text-gray-800 mb-3">🏆 লিডারবোর্ড — শীর্ষ স্কোরার</h2>
          {leaderboardLoading ? (
            <p className="text-xs text-gray-400 text-center py-3">লোড হচ্ছে...</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-3">এখনো কেউ পরীক্ষা দেয়নি</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((row) => {
                const isMe =
                  (studentPhone.trim() && row.student_phone === studentPhone.trim()) ||
                  (!studentPhone.trim() && row.student_name === studentName.trim() && !row.student_phone)
                return (
                  <div
                    key={`${row.student_name}-${row.student_phone || row.rank}`}
                    className={`flex items-center justify-between p-2.5 rounded-lg ${isMe ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        row.rank === 1 ? 'bg-amber-400 text-white' :
                        row.rank === 2 ? 'bg-gray-300 text-gray-700' :
                        row.rank === 3 ? 'bg-orange-300 text-white' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {toBengaliNumber(row.rank)}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {row.student_name}{isMe ? ' (আপনি)' : ''}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {toBengaliNumber(row.score)}/{toBengaliNumber(row.total)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const userAnswer = answers[q.id]
            return (
              <div key={q.id} className="bg-white rounded-xl shadow p-4">
                <p className="font-medium text-gray-800 mb-2">{toBengaliNumber(idx + 1)}. {q.question}</p>
                {['a', 'b', 'c', 'd'].map((opt) => {
                  const letter = opt.toUpperCase()
                  const isUserPick = userAnswer === letter
                  const isRightAns = q.correct_answer === letter
                  let cls = 'border-gray-200'
                  if (isRightAns) cls = 'border-emerald-500 bg-emerald-50'
                  else if (isUserPick) cls = 'border-red-500 bg-red-50'
                  return (
                    <div key={opt} className={`p-2 rounded border mb-1.5 text-sm ${cls}`}>
                      ({opt === 'a' ? 'ক' : opt === 'b' ? 'খ' : opt === 'c' ? 'গ' : 'ঘ'}) {q[`option_${opt}`]}
                    </div>
                  )
                })}
                {!userAnswer && <p className="text-xs text-amber-600 mt-1">উত্তর দেওয়া হয়নি</p>}
              </div>
            )
          })}
        </div>

        <button
          onClick={() => navigate(-2)}
          className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 rounded-xl active:scale-95 transition"
        >
          মডেল টেস্ট লিস্টে ফিরে যান
        </button>
      </div>
    )
  }

  const currentQ = questions[currentIndex]
  if (!currentQ) {
    return <div className="p-6 text-center text-gray-500">কোনো প্রশ্ন পাওয়া যায়নি</div>
  }

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">{title}</h1>
        <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${secondsLeft <= 60 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
          ⏱ {formatTime(secondsLeft)}
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        প্রশ্ন {toBengaliNumber(currentIndex + 1)} / {toBengaliNumber(questions.length)}
      </p>

      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <p className="font-medium text-gray-800 mb-4">{currentQ.question}</p>
        <div className="space-y-2">
          {['a', 'b', 'c', 'd'].map((opt) => {
            const letter = opt.toUpperCase()
            const isSelected = answers[currentQ.id] === letter
            return (
              <button
                key={opt}
                onClick={() => selectAnswer(currentQ.id, letter)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                ({opt === 'a' ? 'ক' : opt === 'b' ? 'খ' : opt === 'c' ? 'গ' : 'ঘ'}) {currentQ[`option_${opt}`]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex-1 py-3 rounded-xl border border-gray-300 font-medium disabled:opacity-40"
        >
          পূর্ববর্তী
        </button>
        {currentIndex + 1 < questions.length ? (
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium"
          >
            পরবর্তী
          </button>
        ) : (
          <button
            onClick={finishExam}
            disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-medium disabled:opacity-60"
          >
            {submitting ? 'জমা হচ্ছে...' : 'পরীক্ষা শেষ করুন'}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(idx)}
            className={`w-9 h-9 rounded-lg text-xs font-semibold ${
              idx === currentIndex
                ? 'bg-blue-600 text-white'
                : answers[q.id]
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {toBengaliNumber(idx + 1)}
          </button>
        ))}
      </div>
    </div>
  )
}

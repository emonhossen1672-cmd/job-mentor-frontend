import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { fetchWrittenModelTestQuestions, submitWrittenModelTest } from '../services/api'

const toBengaliNumber = (num) => {
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' }
  return String(num).replace(/[0-9]/g, (d) => map[d])
}

export default function WrittenModelTestExam() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const title = location.state?.title || 'রিটেন মডেল টেস্ট'
  const durationMinutes = location.state?.duration_minutes || 90

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState('loading') // loading | exam | submitted
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [studentName, setStudentName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    fetchWrittenModelTestQuestions(id)
      .then((data) => {
        setQuestions(data)
        setSecondsLeft(durationMinutes * 60)
        setPhase('exam')
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (phase !== 'exam') return
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  const formatTime = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${toBengaliNumber(String(h).padStart(2, '0'))}:${toBengaliNumber(String(m).padStart(2, '0'))}:${toBengaliNumber(String(sec).padStart(2, '0'))}`
  }

  const updateAnswer = (questionId, text) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }))
  }

  const handleSubmit = async () => {
    if (!studentName.trim()) {
      alert('আপনার নাম লিখুন')
      return
    }
    setSubmitting(true)
    clearInterval(timerRef.current)
    try {
      const answersPayload = questions.map((q) => ({
        question_id: q.id,
        question_text: q.question_text,
        answer: answers[q.id] || ''
      }))
      await submitWrittenModelTest(id, { student_name: studentName, answers: answersPayload })
      setPhase('submitted')
    } catch (err) {
      console.error(err)
      alert('জমা দিতে সমস্যা হয়েছে, আবার চেষ্টা করুন')
    }
    setSubmitting(false)
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-500">লোড হচ্ছে...</div>
  }

  if (phase === 'submitted') {
    return (
      <div className="p-4 pb-20 text-center">
        <div className="bg-white rounded-xl shadow p-8 mt-10">
          <div className="text-5xl mb-3">✅</div>
          <h1 className="text-lg font-bold mb-2">উত্তর জমা হয়েছে!</h1>
          <p className="text-sm text-gray-500 mb-6">অ্যাডমিন রিভিউ করে নম্বর দেবেন।</p>
          <button
            onClick={() => navigate('/written')}
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl"
          >
            রিটেন হাবে ফিরে যান
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-50 py-2 z-10">
        <h1 className="text-lg font-bold">{title}</h1>
        <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${secondsLeft <= 300 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
          ⏱ {formatTime(secondsLeft)}
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium text-gray-800 flex-1">
                {toBengaliNumber(idx + 1)}. {q.question_text}
              </p>
              <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">({toBengaliNumber(q.marks)} মার্ক)</span>
            </div>
            <textarea
              value={answers[q.id] || ''}
              onChange={(e) => updateAnswer(q.id, e.target.value)}
              placeholder="আপনার উত্তর লিখুন..."
              rows={5}
              className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-blue-400"
            />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-4 mt-4">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">আপনার নাম</label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="নাম লিখুন"
          className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full mt-4 bg-emerald-600 text-white font-semibold py-3 rounded-xl active:scale-95 transition disabled:opacity-60"
      >
        {submitting ? 'জমা হচ্ছে...' : 'উত্তর জমা দিন'}
      </button>
    </div>
  )
}

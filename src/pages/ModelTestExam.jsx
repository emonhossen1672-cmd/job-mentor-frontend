import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { fetchModelTestQuestions } from '../services/api'

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
  const [phase, setPhase] = useState('loading') // loading | exam | result
  const [secondsLeft, setSecondsLeft] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    fetchModelTestQuestions(id)
      .then((data) => {
        setQuestions(data)
        setSecondsLeft(durationMinutes * 60)
        setPhase('exam')
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const finishExam = useCallback(() => {
    clearInterval(timerRef.current)
    setPhase('result')
  }, [])

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

  if (phase === 'result') {
    let score = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) score++
    })
    const total = questions.length
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

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const userAnswer = answers[q.id]
            const isCorrect = userAnswer === q.correct_answer
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
            className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-medium"
          >
            পরীক্ষা শেষ করুন
          </button>
        )}
      </div>

      {/* Question navigator */}
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

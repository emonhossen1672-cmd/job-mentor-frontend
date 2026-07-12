import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiArrowRight,
  HiRefresh,
  HiStar,
  HiLightBulb,
} from 'react-icons/hi'
import { FaTrophy } from 'react-icons/fa'
import { fetchMCQs } from '../services/api.js'
import PageHeader from '../components/PageHeader.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorState from '../components/ErrorState.jsx'

const QUESTION_TIME = 30
const toBengaliNumber = (num) => {
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' }
  return String(num).replace(/[0-9]/g, (d) => map[d])
}

export default function MCQ() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [phase, setPhase] = useState('loading')
  const [error, setError] = useState(null)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [activeSubject, setActiveSubject] = useState('all')
  const timerRef = useRef(null)

  const loadQuestions = useCallback(async () => {
    setPhase('loading')
    setError(null)
    try {
      const data = await fetchMCQs()
      const list = Array.isArray(data) ? data : data?.data || data?.questions || []
      if (!list.length) throw new Error('কোনো প্রশ্ন পাওয়া যায়নি')
      const letterToIndex = { A: 0, B: 1, C: 2, D: 3 }
      const normalized = list.map((q, i) => {
        const correctLetter = (q.correct_answer || q.correctAnswer || 'A').toUpperCase()
        return {
          id: q.id || i,
          question: q.question || q.title || q.text || '',
          options: [q.option_a, q.option_b, q.option_c, q.option_d].filter((o) => o != null),
          correctAnswer: letterToIndex[correctLetter] ?? 0,
          subject: q.subject || 'সাধারণ',
          chapter: q.chapter || '',
          topic: q.topic || '',
          explanation: q.explanation || '',
          difficulty: q.difficulty || '',
        }
      })
      setQuestions(normalized)
      setActiveSubject('all')
      setCurrentIndex(0)
      setSelectedOption(null)
      setShowAnswer(false)
      setScore(0)
      setAnsweredCount(0)
      setTimeLeft(QUESTION_TIME)
      setPhase('quiz')
    } catch (err) {
      setError(err.message || 'প্রশ্ন লোড করতে সমস্যা হয়েছে')
      setPhase('error')
    }
  }, [])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startTimer = useCallback(() => {
    clearTimer()
    setTimeLeft(QUESTION_TIME)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer()
          setShowAnswer(true)
          setAnsweredCount((c) => c + 1)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    if (phase === 'quiz') {
      startTimer()
    }
    return clearTimer
  }, [phase, currentIndex, startTimer])

  const handleSelect = (index) => {
    if (showAnswer) return
    setSelectedOption(index)
    setShowAnswer(true)
    clearTimer()
    setAnsweredCount((c) => c + 1)
    if (index === questions[currentIndex].correctAnswer) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 >= filteredQuestions.length) {
      clearTimer()
      setPhase('result')
      return
    }
    setCurrentIndex((i) => i + 1)
    setSelectedOption(null)
    setShowAnswer(false)
  }

  const handleRestart = () => {
    loadQuestions()
  }

  const subjects = useMemo(() => {
    const set = new Set(questions.map((q) => q.subject).filter(Boolean))
    return ['all', ...Array.from(set)]
  }, [questions])

  const filteredQuestions = useMemo(() => {
    if (activeSubject === 'all') return questions
    return questions.filter((q) => q.subject === activeSubject)
  }, [questions, activeSubject])

  const currentQ = filteredQuestions[currentIndex]
  const progress = filteredQuestions.length > 0 ? ((currentIndex) / filteredQuestions.length) * 100 : 0
  const timerColor = timeLeft <= 5 ? 'text-red-500' : timeLeft <= 10 ? 'text-amber-500' : 'text-brand-600'
  const timerBg = timeLeft <= 5 ? 'bg-red-50' : timeLeft <= 10 ? 'bg-amber-50' : 'bg-brand-50'

  if (phase === 'loading') {
    return (
      <div>
        <PageHeader title="MCQ পরীক্ষা" subtitle="প্রশ্ন লোড হচ্ছে..." />
        <LoadingSpinner text="প্রশ্ন লোড হচ্ছে..." />
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div>
        <PageHeader title="MCQ পরীক্ষা" subtitle="ত্রুটি" />
        <ErrorState message={error} onRetry={loadQuestions} />
      </div>
    )
  }

  if (phase === 'result') {
    const total = filteredQuestions.length || questions.length
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0
    const isGood = percentage >= 60
    return (
      <div className="page-content animate-fade-in">
        <div className="gradient-header -mx-4 -mt-4 px-4 pt-10 pb-12 rounded-b-3xl mb-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm animate-pop">
              <FaTrophy className="text-4xl" />
            </div>
            <h2 className="text-2xl font-bold mb-1">পরীক্ষা সম্পন্ন!</h2>
            <p className="text-brand-100 text-sm">আপনার ফলাফল নিচে দেওয়া হলো</p>
          </div>
        </div>

        <div className="card p-6 text-center animate-slide-up mb-4">
          <p className="text-5xl font-bold text-brand-600 mb-1">{toBengaliNumber(percentage)}%</p>
          <p className="text-sm text-slate-500">সাফল্যের হার</p>
          <div className="flex justify-around mt-6 pt-6 border-t border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 justify-center text-emerald-500 mb-1">
                <HiCheckCircle className="text-lg" />
                <span className="text-xl font-bold">{toBengaliNumber(score)}</span>
              </div>
              <p className="text-xs text-slate-400">সঠিক</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 justify-center text-red-500 mb-1">
                <HiXCircle className="text-lg" />
                <span className="text-xl font-bold">{toBengaliNumber(total - score)}</span>
              </div>
              <p className="text-xs text-slate-400">ভুল</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 justify-center text-brand-500 mb-1">
                <HiStar className="text-lg" />
                <span className="text-xl font-bold">{toBengaliNumber(total)}</span>
              </div>
              <p className="text-xs text-slate-400">মোট</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl mb-4 ${isGood ? 'bg-emerald-50' : 'bg-amber-50'}`}>
          <p className={`text-sm font-medium ${isGood ? 'text-emerald-700' : 'text-amber-700'}`}>
            {isGood
              ? 'চমৎকার! আপনি খুব ভালো করেছেন। পরবর্তী পরীক্ষার জন্য প্রস্তুতি চালিয়ে যান।'
              : 'আরও অনুশীলন দরকার। আবার চেষ্টা করুন এবং নিজেকে উন্নত করুন।'}
          </p>
        </div>

        <button onClick={handleRestart} className="btn-primary w-full flex items-center justify-center gap-2">
          <HiRefresh /> আবার পরীক্ষা দিন
        </button>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="MCQ পরীক্ষা" subtitle={`${toBengaliNumber(currentIndex + 1)} / ${toBengaliNumber(filteredQuestions.length)}`} />

      {/* Subject Filters */}
      {subjects.length > 2 && (
        <div className="px-4 pt-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => {
                  setActiveSubject(subj)
                  setCurrentIndex(0)
                  setSelectedOption(null)
                  setShowAnswer(false)
                  setScore(0)
                  setAnsweredCount(0)
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  activeSubject === subj
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-brand-300'
                }`}
              >
                {subj === 'all' ? 'সব বিষয়' : subj}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="px-4 pt-4">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="page-content">
        {/* Timer & Score */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${timerBg} transition-colors`}>
            <HiClock className={`text-lg ${timerColor}`} />
            <span className={`font-bold text-lg ${timerColor}`}>{toBengaliNumber(timeLeft)}s</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50">
            <HiCheckCircle className="text-lg text-emerald-500" />
            <span className="font-bold text-lg text-emerald-600">{toBengaliNumber(score)}</span>
          </div>
        </div>

        {/* Question Card */}
        <div key={currentIndex} className="card p-5 mb-4 animate-slide-in-right">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
              প্রশ্ন {toBengaliNumber(currentIndex + 1)}
            </span>
            {currentQ.subject && (
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {currentQ.subject}
              </span>
            )}
            {currentQ.chapter && (
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {currentQ.chapter}
              </span>
            )}
            {currentQ.difficulty && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                currentQ.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600'
                  : currentQ.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600'
                  : 'bg-red-50 text-red-600'
              }`}>
                {currentQ.difficulty === 'Easy' ? 'সহজ' : currentQ.difficulty === 'Medium' ? 'মাঝারি' : 'কঠিন'}
              </span>
            )}
          </div>
          <p className="font-semibold text-slate-800 mb-5 text-lg leading-relaxed">{currentQ.question}</p>

          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              let cls = 'border-slate-200 hover:border-brand-300 hover:bg-brand-50/50'
              let badgeCls = 'bg-slate-100 text-slate-600'
              if (showAnswer) {
                if (idx === currentQ.correctAnswer) {
                  cls = 'border-emerald-500 bg-emerald-50'
                  badgeCls = 'bg-emerald-500 text-white'
                } else if (idx === selectedOption) {
                  cls = 'border-red-500 bg-red-50 animate-shake'
                  badgeCls = 'bg-red-500 text-white'
                } else {
                  cls = 'border-slate-200 opacity-50'
                }
              } else if (selectedOption === idx) {
                cls = 'border-brand-500 bg-brand-50'
                badgeCls = 'bg-brand-500 text-white'
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showAnswer}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${cls} ${
                    !showAnswer ? 'active:scale-[0.98]' : 'cursor-default'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${badgeCls}`}>
                    {String.fromCharCode(2465 + idx)}
                  </span>
                  <span className="text-sm font-medium text-slate-700 flex-1">{opt}</span>
                  {showAnswer && idx === currentQ.correctAnswer && (
                    <HiCheckCircle className="text-emerald-500 text-xl flex-shrink-0" />
                  )}
                  {showAnswer && idx === selectedOption && idx !== currentQ.correctAnswer && (
                    <HiXCircle className="text-red-500 text-xl flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {showAnswer && (
            <div className="mt-4 animate-slide-up">
              {selectedOption === currentQ.correctAnswer ? (
                <p className="text-sm text-emerald-600 font-medium bg-emerald-50 p-3 rounded-xl flex items-center gap-2">
                  <HiCheckCircle className="text-lg" /> সঠিক উত্তর!
                </p>
              ) : selectedOption === null ? (
                <p className="text-sm text-amber-600 font-medium bg-amber-50 p-3 rounded-xl">
                  সময় শেষ! সঠিক উত্তর: {currentQ.options[currentQ.correctAnswer]}
                </p>
              ) : (
                <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-xl flex items-center gap-2">
                  <HiXCircle className="text-lg" /> সঠিক উত্তর: {currentQ.options[currentQ.correctAnswer]}
                </p>
              )}
              {currentQ.explanation && (
                <div className="mt-3 p-3 bg-blue-50 rounded-xl flex items-start gap-2">
                  <HiLightBulb className="text-lg text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600"><span className="font-semibold text-blue-600">ব্যাখ্যা: </span>{currentQ.explanation}</p>
                </div>
              )}
              <button
                onClick={handleNext}
                className="btn-primary w-full mt-3 flex items-center justify-center gap-2 text-sm"
              >
                {currentIndex + 1 >= filteredQuestions.length ? 'ফলাফল দেখুন' : 'পরবর্তী প্রশ্ন'}
                <HiArrowRight />
              </button>
            </div>
          )}
        </div>

        {/* Answered indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>উত্তর দেওয়া হয়েছে: {toBengaliNumber(answeredCount)} / {toBengaliNumber(filteredQuestions.length)}</span>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import {
  fetchTopics, fetchSubtopics, fetchSubtopicMCQs,
  fetchTopicMCQs, fetchTopicRandomQuiz, fetchSubtopicRandomQuiz,
  toggleTopicLike, toggleSubtopicLike, markQuestionViewed
} from '../services/api'
import { useAuth } from '../context/AuthContext.jsx'

const categories = [
  { key: 'bcs', label: 'বিসিএস প্রশ্নব্যাংক', icon: '📘', bg: 'linear-gradient(135deg,#60a5fa,#1d4ed8)' },
  { key: 'primary', label: 'প্রাইমারি প্রশ্নব্যাংক', icon: '🏫', bg: 'linear-gradient(135deg,#34d399,#047857)' },
  { key: 'nibondhon', label: 'নিবন্ধন প্রশ্নব্যাংক', icon: '📝', bg: 'linear-gradient(135deg,#fbbf24,#b45309)' },
  { key: 'grade_9_20', label: '৯-২০ গ্রেড জব সলুশন', icon: '💼', bg: 'linear-gradient(135deg,#c084fc,#7e22ce)' },
  { key: 'topic_guru', label: 'টপিকগুরু', icon: '🎯', bg: 'linear-gradient(135deg,#fb7185,#be123c)' },
]

const cardThemes = [
  { bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', ring: '#3b82f6', chip: 'bg-blue-100 text-blue-700' },
  { bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', ring: '#16a34a', chip: 'bg-emerald-100 text-emerald-700' },
  { bg: 'linear-gradient(135deg,#fff7ed,#ffedd5)', ring: '#f97316', chip: 'bg-orange-100 text-orange-700' },
  { bg: 'linear-gradient(135deg,#fdf4ff,#fae8ff)', ring: '#a855f7', chip: 'bg-purple-100 text-purple-700' },
  { bg: 'linear-gradient(135deg,#fff1f2,#ffe4e6)', ring: '#e11d48', chip: 'bg-rose-100 text-rose-700' },
  { bg: 'linear-gradient(135deg,#fefce8,#fef9c3)', ring: '#ca8a04', chip: 'bg-yellow-100 text-yellow-700' },
]

function ProgressRing({ viewed, total, color }) {
  const pct = total > 0 ? Math.min(100, Math.round((viewed / total) * 100)) : 0
  const r = 23
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#ffffffaa" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 32 32)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-gray-700">
        {pct}%
      </div>
    </div>
  )
}

function HeartButton({ liked, count, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 text-base font-bold flex-shrink-0 active:scale-90 transition-transform"
    >
      <span className={liked ? 'text-red-500' : 'text-gray-300'} style={{ fontSize: '20px' }}>
        {liked ? '❤️' : '🤍'}
      </span>
      <span className="text-gray-600">{count}</span>
    </button>
  )
}

export default function Topics() {
  const { user } = useAuth()
  const uid = user?.uid

  const [view, setView] = useState('categories') // categories | topics | subtopics | questions | quiz
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [topics, setTopics] = useState([])
  const [subtopics, setSubtopics] = useState([])
  const [questions, setQuestions] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedSubtopic, setSelectedSubtopic] = useState(null)
  const [questionsTitle, setQuestionsTitle] = useState('')
  const [loading, setLoading] = useState(false)

  async function openCategory(cat) {
    setSelectedCategory(cat)
    setLoading(true)
    try {
      const data = await fetchTopics(cat.key, uid)
      setTopics(data)
      setView('topics')
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function openTopic(topic) {
    setSelectedTopic(topic)
    setLoading(true)
    try {
      const data = await fetchSubtopics(topic.id, uid)
      setSubtopics(data)
      setView('subtopics')
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function openAllTopicQuestions(topic) {
    setSelectedTopic(topic)
    setQuestionsTitle(`${topic.name} — সব প্রশ্ন`)
    setLoading(true)
    try {
      const data = await fetchTopicMCQs(topic.id)
      setQuestions(data)
      setView('questions')
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function openTopicRandomQuiz(topic) {
    setSelectedTopic(topic)
    setQuestionsTitle(`${topic.name} — Random Quiz`)
    setLoading(true)
    try {
      const data = await fetchTopicRandomQuiz(topic.id, 20)
      setQuestions(data)
      setView('quiz')
      if (uid) data.forEach((q) => markQuestionViewed(q.id, uid))
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function openSubtopic(subtopic) {
    setSelectedSubtopic(subtopic)
    setQuestionsTitle(subtopic.name)
    setLoading(true)
    try {
      const data = await fetchSubtopicMCQs(subtopic.id)
      setQuestions(data)
      setView('questions')
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function openSubtopicRandomQuiz(subtopic) {
    setSelectedSubtopic(subtopic)
    setQuestionsTitle(`${subtopic.name} — Random Quiz`)
    setLoading(true)
    try {
      const data = await fetchSubtopicRandomQuiz(subtopic.id, 20)
      setQuestions(data)
      setView('quiz')
      if (uid) data.forEach((q) => markQuestionViewed(q.id, uid))
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function handleTopicLike(topic) {
    if (!uid) return
    try {
      const result = await toggleTopicLike(topic.id, uid)
      setTopics((prev) => prev.map((t) => t.id === topic.id ? { ...t, is_liked: result.liked ? 1 : 0, like_count: result.like_count } : t))
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSubtopicLike(sub) {
    if (!uid) return
    try {
      const result = await toggleSubtopicLike(sub.id, uid)
      setSubtopics((prev) => prev.map((s) => s.id === sub.id ? { ...s, is_liked: result.liked ? 1 : 0, like_count: result.like_count } : s))
    } catch (err) {
      console.error(err)
    }
  }

  function goBack() {
    if (view === 'quiz') { setView(selectedSubtopic ? 'subtopics' : 'topics'); setQuestions([]) }
    else if (view === 'questions') { setView(selectedSubtopic ? 'subtopics' : 'topics'); setQuestions([]); setSelectedSubtopic(null) }
    else if (view === 'subtopics') { setView('topics'); setSubtopics([]) }
    else if (view === 'topics') { setView('categories'); setTopics([]); setSelectedCategory(null) }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500 text-lg">লোড হচ্ছে...</div>
  }

  const totalQuestions = topics.reduce((s, t) => s + Number(t.question_count || 0), 0)
  const totalSubtopics = topics.reduce((s, t) => s + Number(t.subtopic_count || 0), 0)

  return (
    <div className="p-4 pb-24" style={{ minHeight: '100vh' }}>
      {view !== 'categories' && (
        <button onClick={goBack} className="mb-4 text-blue-600 font-bold text-lg flex items-center gap-1">
          ← ফিরে যান
        </button>
      )}

      {view === 'categories' && (
        <div>
          <h1 className="text-2xl font-extrabold mb-5 text-gray-800">প্রিলি প্রস্তুতি</h1>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.key}
                onClick={() => openCategory(cat)}
                className="rounded-2xl shadow-md p-5 active:scale-95 transition-transform flex flex-col items-center text-center text-white"
                style={{ background: cat.bg }}
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <div className="font-bold text-base leading-snug">{cat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'topics' && (
        <div>
          <h1 className="text-2xl font-extrabold mb-1 text-gray-800">{selectedCategory?.label}</h1>
          <p className="text-sm text-gray-500 mb-5 font-medium">
            মোট প্রশ্ন: {totalQuestions}টি, সাবটপিক: {totalSubtopics}টি
          </p>
          <div className="space-y-4">
            {topics.map((topic, idx) => {
              const theme = cardThemes[idx % cardThemes.length]
              return (
                <div
                  key={topic.id}
                  className="rounded-2xl shadow-md p-4"
                  style={{ background: theme.bg }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <ProgressRing viewed={topic.viewed_count || 0} total={topic.question_count || 0} color={theme.ring} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-extrabold text-gray-800 text-lg leading-snug">{idx + 1}. {topic.name}</div>
                        <HeartButton
                          liked={!!Number(topic.is_liked)}
                          count={topic.like_count || 0}
                          onToggle={() => handleTopicLike(topic)}
                        />
                      </div>
                      <div className={`inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full ${theme.chip}`}>
                        সাবটপিক: {topic.subtopic_count} · প্রশ্ন: {topic.question_count}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => openAllTopicQuestions(topic)}
                      className="bg-white/80 text-gray-800 text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform shadow-sm"
                    >
                      সব প্রশ্ন
                    </button>
                    <button
                      onClick={() => openTopic(topic)}
                      className="bg-white/80 text-gray-800 text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform shadow-sm"
                    >
                      সাবটপিক
                    </button>
                    <button
                      onClick={() => openTopicRandomQuiz(topic)}
                      className="bg-gray-800 text-white text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform shadow-sm"
                    >
                      Random Quiz
                    </button>
                  </div>
                </div>
              )
            })}
            {topics.length === 0 && (
              <div className="text-center text-gray-400 py-10 text-lg">কোনো টপিক পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      )}

      {view === 'subtopics' && (
        <div>
          <h1 className="text-2xl font-extrabold mb-5 text-gray-800">{selectedTopic?.name}</h1>
          <div className="space-y-4">
            {subtopics.map((sub, idx) => {
              const theme = cardThemes[idx % cardThemes.length]
              return (
                <div
                  key={sub.id}
                  className="rounded-2xl shadow-md p-4"
                  style={{ background: theme.bg }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <ProgressRing viewed={sub.viewed_count || 0} total={sub.question_count || 0} color={theme.ring} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-gray-800 text-base leading-snug">{idx + 1}. {sub.name}</div>
                        <HeartButton
                          liked={!!Number(sub.is_liked)}
                          count={sub.like_count || 0}
                          onToggle={() => handleSubtopicLike(sub)}
                        />
                      </div>
                      <div className={`inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full ${theme.chip}`}>
                        প্রশ্ন: {sub.question_count}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openSubtopic(sub)}
                      className="bg-white/80 text-gray-800 text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform shadow-sm"
                    >
                      সব প্রশ্ন
                    </button>
                    <button
                      onClick={() => openSubtopicRandomQuiz(sub)}
                      className="bg-gray-800 text-white text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform shadow-sm"
                    >
                      Random Quiz
                    </button>
                  </div>
                </div>
              )
            })}
            {subtopics.length === 0 && (
              <div className="text-center text-gray-400 py-10 text-lg">কোনো সাবটপিক পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      )}

      {(view === 'questions' || view === 'quiz') && (
        <div>
          <h1 className="text-2xl font-extrabold mb-5 text-gray-800">{questionsTitle}</h1>
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-2xl shadow-md p-4">
                <div className="font-bold text-gray-800 mb-3 text-base leading-relaxed">
                  {idx + 1}. {q.question}
                </div>
                <div className="space-y-2 text-sm">
                  <Option label="ক" text={q.option_a} correct={q.correct_answer === 'A'} />
                  <Option label="খ" text={q.option_b} correct={q.correct_answer === 'B'} />
                  <Option label="গ" text={q.option_c} correct={q.correct_answer === 'C'} />
                  <Option label="ঘ" text={q.option_d} correct={q.correct_answer === 'D'} />
                </div>
                {q.explanation && (
                  <div className="mt-3 text-sm text-gray-600 bg-blue-50 rounded-xl p-3">
                    💡 ব্যাখ্যা: {q.explanation}
                  </div>
                )}
              </div>
            ))}
            {questions.length === 0 && (
              <div className="text-center text-gray-400 py-10 text-lg">কোনো প্রশ্ন পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Option({ label, text, correct }) {
  return (
    <div className={`p-2.5 rounded-xl border text-[15px] font-medium ${correct ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-700'}`}>
      ({label}) {text}
    </div>
  )
}

import { useState } from 'react'
import {
  fetchTopics, fetchSubtopics, fetchSubSubtopics, fetchSubtopicMCQs,
  fetchTopicMCQs, fetchTopicRandomQuiz, fetchSubtopicRandomQuiz,
  toggleTopicLike, toggleSubtopicLike, markQuestionViewed, markQuestionViewedBulk
} from '../services/api'
import { useAuth } from '../context/AuthContext.jsx'
import { addBookmarkedQuestion, removeBookmarkedQuestion, getBookmarkedQuestions } from './bookmarks.js'

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

const letters = { A: 'ক', B: 'খ', C: 'গ', D: 'ঘ' }

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

function QuestionCard({ q, idx, isRead, onToggleRead, showCheckbox }) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [bookmarked, setBookmarked] = useState(() => getBookmarkedQuestions().some((b) => b.id === q.id))

  const toggleBookmark = () => {
    if (bookmarked) {
      removeBookmarkedQuestion(q.id)
      setBookmarked(false)
    } else {
      addBookmarkedQuestion({
        id: q.id,
        question: q.question,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        correctAnswer: { A: 0, B: 1, C: 2, D: 3 }[q.correct_answer] ?? 0,
        subject: q.subject || '',
        explanation: q.explanation || '',
      })
      setBookmarked(true)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="font-bold text-gray-800 text-base leading-relaxed flex-1">
          {q.id}. {q.question}
        </div>
        {showCheckbox && (
          <input
            type="checkbox"
            checked={isRead}
            onChange={() => onToggleRead(q.id)}
            className="w-5 h-5 flex-shrink-0 mt-1 accent-blue-600"
          />
        )}
      </div>
      <div className="space-y-2 mb-3">
        {['A', 'B', 'C', 'D'].map((letter) => {
          const text = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }[letter]
          const isCorrect = showAnswer && q.correct_answer === letter
          return (
            <div
              key={letter}
              className={`flex items-center gap-3 p-2.5 rounded-xl border text-[15px] font-medium ${
                isCorrect ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-700'
              }`}
            >
              <span className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {letters[letter]}
              </span>
              <span>{text}</span>
            </div>
          )
        })}
      </div>
      {showExplanation && q.explanation && (
        <div className="mb-3 text-sm text-gray-600 bg-blue-50 rounded-xl p-3">
          💡 ব্যাখ্যা: {q.explanation}
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setShowAnswer((v) => !v)}
          className={`text-sm font-bold py-2 rounded-xl border ${showAnswer ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 text-gray-700'}`}
        >
          উত্তর
        </button>
        <button
          onClick={() => setShowExplanation((v) => !v)}
          disabled={!q.explanation}
          className={`text-sm font-bold py-2 rounded-xl border disabled:opacity-40 ${showExplanation ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 text-gray-700'}`}
        >
          ব্যাখ্যা
        </button>
        <button
          onClick={toggleBookmark}
          className={`text-sm font-bold py-2 rounded-xl border ${bookmarked ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-300 text-gray-700'}`}
        >
          {bookmarked ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  )
}

export default function Topics() {
  const { user } = useAuth()
  const uid = user?.uid

  const [view, setView] = useState('categories') // categories | topics | subtopics | subsubtopics | questions | quiz
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [topics, setTopics] = useState([])
  const [subtopics, setSubtopics] = useState([])
  const [subsubtopics, setSubsubtopics] = useState([])
  const [questions, setQuestions] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedSubtopic, setSelectedSubtopic] = useState(null)
  const [parentSubtopic, setParentSubtopic] = useState(null)
  const [questionsTitle, setQuestionsTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [readIds, setReadIds] = useState(new Set())

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
    setParentSubtopic(null)
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

  async function openSubtopic(sub) {
    setParentSubtopic(sub)
    setLoading(true)
    try {
      const data = await fetchSubSubtopics(sub.id, uid)
      setSubsubtopics(data)
      setView('subsubtopics')
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function openAllTopicQuestions(topic, pageNum = 1) {
    setSelectedTopic(topic)
    setSelectedSubtopic(null)
    setQuestionsTitle(topic.name)
    setLoading(true)
    try {
      const res = await fetchTopicMCQs(topic.id, pageNum, 50)
      setQuestions(res.data)
      setPage(res.page)
      setTotalPages(res.totalPages)
      setReadIds(new Set())
      setView('questions')
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function openAllSubtopicQuestions(subtopic, pageNum = 1) {
    setSelectedSubtopic(subtopic)
    setQuestionsTitle(subtopic.name)
    setLoading(true)
    try {
      const res = await fetchSubtopicMCQs(subtopic.id, pageNum, 50)
      setQuestions(res.data)
      setPage(res.page)
      setTotalPages(res.totalPages)
      setReadIds(new Set())
      setView('questions')
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  function goToPage(p) {
    if (p < 1 || p > totalPages) return
    if (selectedSubtopic) openAllSubtopicQuestions(selectedSubtopic, p)
    else if (selectedTopic) openAllTopicQuestions(selectedTopic, p)
  }

  async function openTopicRandomQuiz(topic) {
    setSelectedTopic(topic)
    setSelectedSubtopic(null)
    setQuestionsTitle(`${topic.name} — Random Quiz`)
    setLoading(true)
    try {
      const data = await fetchTopicRandomQuiz(topic.id, 20)
      setQuestions(data)
      setView('quiz')
      if (uid) markQuestionViewedBulk(data.map((q) => q.id), uid)
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
      if (uid) markQuestionViewedBulk(data.map((q) => q.id), uid)
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

  async function handleSubSubtopicLike(sub) {
    if (!uid) return
    try {
      const result = await toggleSubtopicLike(sub.id, uid)
      setSubsubtopics((prev) => prev.map((s) => s.id === sub.id ? { ...s, is_liked: result.liked ? 1 : 0, like_count: result.like_count } : s))
    } catch (err) {
      console.error(err)
    }
  }

  function toggleRead(id) {
    setReadIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    if (uid) markQuestionViewed(id, uid)
  }

  function markAllRead() {
    const ids = questions.map((q) => q.id)
    setReadIds(new Set(ids))
    if (uid) markQuestionViewedBulk(ids, uid)
  }

  function goBack() {
    if (view === 'quiz') { setView(parentSubtopic ? 'subsubtopics' : (selectedSubtopic ? 'subtopics' : 'topics')); setQuestions([]) }
    else if (view === 'questions') { setView(parentSubtopic ? 'subsubtopics' : (selectedSubtopic ? 'subtopics' : 'topics')); setQuestions([]); setSelectedSubtopic(null) }
    else if (view === 'subsubtopics') { setView('subtopics'); setSubsubtopics([]); setParentSubtopic(null) }
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
                <div key={topic.id} className="rounded-2xl shadow-md p-4" style={{ background: theme.bg }}>
                  <div className="flex items-start gap-3 mb-4">
                    <ProgressRing viewed={topic.viewed_count || 0} total={topic.question_count || 0} color={theme.ring} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-extrabold text-gray-800 text-lg leading-snug">{idx + 1}. {topic.name}</div>
                        <HeartButton liked={!!Number(topic.is_liked)} count={topic.like_count || 0} onToggle={() => handleTopicLike(topic)} />
                      </div>
                      <div className={`inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full ${theme.chip}`}>
                        সাবটপিক: {topic.subtopic_count} · প্রশ্ন: {topic.question_count}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => openAllTopicQuestions(topic, 1)} className="bg-white/80 text-gray-800 text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform shadow-sm">
                      সব প্রশ্ন
                    </button>
                    <button onClick={() => openTopic(topic)} className="bg-white/80 text-gray-800 text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform shadow-sm">
                      সাবটপিক
                    </button>
                    <button onClick={() => openTopicRandomQuiz(topic)} className="bg-gray-800 text-white text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform shadow-sm">
                      Random Quiz
                    </button>
                  </div>
                </div>
              )
            })}
            {topics.length === 0 && <div className="text-center text-gray-400 py-10 text-lg">কোনো টপিক পাওয়া যায়নি</div>}
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
                <div key={sub.id} className="rounded-2xl shadow-md p-4" style={{ background: theme.bg }}>
                  <div className="flex items-start gap-3 mb-4">
                    <ProgressRing viewed={sub.viewed_count || 0} total={sub.question_count || 0} color={theme.ring} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-gray-800 text-base leading-snug">{idx + 1}. {sub.name}</div>
                        <HeartButton liked={!!Number(sub.is_liked)} count={sub.like_count || 0} onToggle={() => handleSubtopicLike(sub)} />
                      </div>
                      <div className={`inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full ${theme.chip}`}>
                        সাবটপিক: {sub.subtopic_count} · প্রশ্ন: {sub.question_count}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => openAllSubtopicQuestions(sub, 1)} className="bg-white/80 text-gray-800 text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform shadow-sm">
                      সব প্রশ্ন
                    </button>
                    <button onClick={() => openSubtopic(sub)} className="bg-white/80 text-gray-800 text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform shadow-sm">
                      সাবটপিক
                    </button>
                    <button onClick={() => openSubtopicRandomQuiz(sub)} className="bg-gray-800 text-white text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform shadow-sm">
                      Random Quiz
                    </button>
                  </div>
                </div>
              )
            })}
            {subtopics.length === 0 && <div className="text-center text-gray-400 py-10 text-lg">কোনো সাবটপিক পাওয়া যায়নি</div>}
          </div>
        </div>
      )}

      {view === 'subsubtopics' && (
        <div>
          <h1 className="text-2xl font-extrabold mb-5 text-gray-800">{parentSubtopic?.name}</h1>
          <div className="space-y-4">
            {subsubtopics.map((sub, idx) => {
              const theme = cardThemes[idx % cardThemes.length]
              return (
                <div key={sub.id} className="rounded-2xl shadow-md p-4" style={{ background: theme.bg }}>
                  <div className="flex items-start gap-3 mb-4">
                    <ProgressRing viewed={sub.viewed_count || 0} total={sub.question_count || 0} color={theme.ring} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-gray-800 text-base leading-snug">{idx + 1}. {sub.name}</div>
                        <HeartButton liked={!!Number(sub.is_liked)} count={sub.like_count || 0} onToggle={() => handleSubSubtopicLike(sub)} />
                      </div>
                      <div className={`inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full ${theme.chip}`}>
                        প্রশ্ন: {sub.question_count}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => openAllSubtopicQuestions(sub, 1)} className="bg-white/80 text-gray-800 text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform shadow-sm">
                      সব প্রশ্ন
                    </button>
                    <button onClick={() => openSubtopicRandomQuiz(sub)} className="bg-gray-800 text-white text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform shadow-sm">
                      Random Quiz
                    </button>
                  </div>
                </div>
              )
            })}
            {subsubtopics.length === 0 && <div className="text-center text-gray-400 py-10 text-lg">কোনো সাবটপিক পাওয়া যায়নি</div>}
          </div>
        </div>
      )}

      {view === 'questions' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-extrabold text-gray-800 flex-1">{questionsTitle}</h1>
          </div>
          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 mb-4">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-bold disabled:opacity-30"
            >
              ‹
            </button>
            <span className="text-sm font-bold text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-bold disabled:opacity-30"
            >
              ›
            </button>
          </div>
          <button
            onClick={markAllRead}
            className="w-full mb-4 bg-gray-100 text-gray-700 text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform"
          >
            Mark all as read
          </button>
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                q={q}
                idx={idx}
                isRead={readIds.has(q.id)}
                onToggleRead={toggleRead}
                showCheckbox={true}
              />
            ))}
            {questions.length === 0 && <div className="text-center text-gray-400 py-10 text-lg">কোনো প্রশ্ন পাওয়া যায়নি</div>}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 mt-4">
              <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-bold disabled:opacity-30">‹</button>
              <span className="text-sm font-bold text-gray-700">Page {page} of {totalPages}</span>
              <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-bold disabled:opacity-30">›</button>
            </div>
          )}
        </div>
      )}

      {view === 'quiz' && (
        <div>
          <h1 className="text-xl font-extrabold mb-4 text-gray-800">{questionsTitle}</h1>
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <QuestionCard key={q.id} q={q} idx={idx} isRead={true} onToggleRead={() => {}} showCheckbox={false} />
            ))}
            {questions.length === 0 && <div className="text-center text-gray-400 py-10 text-lg">কোনো প্রশ্ন পাওয়া যায়নি</div>}
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { HiXCircle, HiCheckCircle, HiTrash, HiLightBulb } from 'react-icons/hi'
import PageHeader from '../components/PageHeader.jsx'
import { getBookmarkedQuestions, removeBookmarkedQuestion, clearBookmarkedQuestions } from '../utils/bookmarks.js'

const toBengaliNumber = (num) => {
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' }
  return String(num).replace(/[0-9]/g, (d) => map[d])
}

export default function BookmarkedQuestions() {
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(getBookmarkedQuestions())
  }, [])

  const handleRemove = (id) => {
    removeBookmarkedQuestion(id)
    setItems(getBookmarkedQuestions())
  }

  const handleClearAll = () => {
    if (!window.confirm('সব ভুল প্রশ্ন মুছে ফেলতে চান?')) return
    clearBookmarkedQuestions()
    setItems([])
  }

  return (
    <div>
      <PageHeader title="ভুল প্রশ্ন রিভিউ" subtitle={`${toBengaliNumber(items.length)}টি প্রশ্ন সেভ করা আছে`} />
      <div className="page-content">
        {items.length === 0 ? (
          <div className="text-center text-slate-400 py-16 text-sm">
            এখনো কোনো ভুল প্রশ্ন সেভ হয়নি। MCQ প্র্যাকটিস করলে ভুল উত্তরগুলো এখানে জমা হবে।
          </div>
        ) : (
          <>
            <button
              onClick={handleClearAll}
              className="w-full mb-4 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 py-2.5 rounded-xl active:scale-95 transition"
            >
              সব মুছে ফেলুন
            </button>
            <div className="space-y-3">
              {items.map((q) => (
                <div key={q.id} className="card p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {q.subject && (
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                          {q.subject}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemove(q.id)}
                      className="text-slate-400 hover:text-red-500 flex-shrink-0"
                    >
                      <HiTrash className="text-lg" />
                    </button>
                  </div>
                  <p className="font-semibold text-slate-800 mb-3">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border text-sm flex items-center gap-2 ${
                          idx === q.correctAnswer ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'
                        }`}
                      >
                        <span className="font-bold">{String.fromCharCode(2465 + idx)}.</span>
                        <span className="flex-1">{opt}</span>
                        {idx === q.correctAnswer && <HiCheckCircle className="text-emerald-500 flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-xl flex items-start gap-2">
                      <HiLightBulb className="text-lg text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold text-blue-600">ব্যাখ্যা: </span>{q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

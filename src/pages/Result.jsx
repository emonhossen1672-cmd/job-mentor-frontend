import { useState, useEffect } from 'react'
import { fetchResults } from '../services/api'

const toBengaliNumber = (num) => {
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' }
  return String(num).replace(/[0-9]/g, (d) => map[d])
}

const categoryLabels = {
  bcs: 'বিসিএস',
  primary: 'প্রাইমারি',
  nibondhon: 'নিবন্ধন',
  grade_9_20: '৯-২০ গ্রেড',
}

export default function Result() {
  const [studentName, setStudentName] = useState(() => localStorage.getItem('jobMentorStudentName') || '')
  const [inputName, setInputName] = useState(() => localStorage.getItem('jobMentorStudentName') || '')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (studentName) {
      loadResults(studentName)
    }
  }, [])

  async function loadResults(name) {
    setLoading(true)
    try {
      const data = await fetchResults(name)
      setResults(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  function handleSearch() {
    if (!inputName.trim()) return
    localStorage.setItem('jobMentorStudentName', inputName.trim())
    setStudentName(inputName.trim())
    loadResults(inputName.trim())
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">ফলাফল</h1>

      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">আপনার নাম দিন</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="নাম লিখুন"
            className="flex-1 p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white font-semibold px-5 rounded-xl"
          >
            খুঁজুন
          </button>
        </div>
      </div>

      {loading && <div className="text-center text-gray-500 py-6">লোড হচ্ছে...</div>}

      {!loading && results && (
        <>
          {results.mcq.length === 0 && results.written.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              "{studentName}" নামে কোনো পরীক্ষার ফলাফল পাওয়া যায়নি
            </div>
          )}

          {results.mcq.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-gray-500 mb-2">প্রিলি (MCQ) মডেল টেস্ট</h2>
              <div className="space-y-3">
                {results.mcq.map((r) => {
                  const percentage = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0
                  return (
                    <div key={r.id} className="bg-white rounded-xl shadow p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{r.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {categoryLabels[r.category] || r.category} • {formatDate(r.submitted_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${percentage >= 60 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {toBengaliNumber(percentage)}%
                          </p>
                          <p className="text-xs text-gray-400">{toBengaliNumber(r.score)}/{toBengaliNumber(r.total)}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {results.written.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-2">রিটেন মডেল টেস্ট</h2>
              <div className="space-y-3">
                {results.written.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl shadow p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{r.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {categoryLabels[r.category] || r.category} • {formatDate(r.submitted_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        {r.status === 'reviewed' ? (
                          <p className="text-lg font-bold text-emerald-600">{toBengaliNumber(r.total_score)}</p>
                        ) : (
                          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                            পর্যালোচনাধীন
                          </span>
                        )}
                      </div>
                    </div>
                    {r.admin_feedback && (
                      <div className="mt-2 pt-2 border-t border-gray-100 text-sm text-gray-600">
                        মন্তব্য: {r.admin_feedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

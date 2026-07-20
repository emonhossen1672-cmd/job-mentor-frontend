import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchModelTestSubmissionResult } from '../services/api'

const toBengaliNumber = (num) => {
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' }
  return String(num).replace(/[0-9]/g, (d) => map[d])
}

export default function ResultDetail() {
  const { submissionId } = useParams()
  const navigate = useNavigate()

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchModelTestSubmissionResult(submissionId)
      .then((data) => setResult(data))
      .catch(() => setError('ফলাফল পাওয়া যায়নি'))
      .finally(() => setLoading(false))
  }, [submissionId])

  if (loading) {
    return <div className="p-6 text-center text-gray-500">লোড হচ্ছে...</div>
  }

  if (error || !result) {
    return <div className="p-6 text-center text-red-500">{error || 'ফলাফল পাওয়া যায়নি'}</div>
  }

  const { score, total, wrong_count, wrong_questions, student_name } = result
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-1">ফলাফল</h1>
      <p className="text-sm text-gray-500 mb-4">{student_name}</p>

      <div className="bg-white rounded-xl shadow p-6 text-center mb-4">
        <p className="text-4xl font-bold text-blue-600 mb-1">{toBengaliNumber(percentage)}%</p>
        <p className="text-sm text-gray-500">সাফল্যের হার</p>
        <div className="flex justify-around mt-5 pt-5 border-t border-gray-100">
          <div>
            <p className="text-xl font-bold text-emerald-600">{toBengaliNumber(score)}</p>
            <p className="text-xs text-gray-400">সঠিক</p>
          </div>
          <div>
            <p className="text-xl font-bold text-red-500">{toBengaliNumber(wrong_count)}</p>
            <p className="text-xs text-gray-400">ভুল</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-700">{toBengaliNumber(total)}</p>
            <p className="text-xs text-gray-400">মোট</p>
          </div>
        </div>
      </div>

      <h2 className="text-sm font-bold text-gray-800 mb-3">
        ❌ ভুল হওয়া প্রশ্নসমূহ ({toBengaliNumber(wrong_count)}টি)
      </h2>

      {wrong_count === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-emerald-600 font-medium">
          🎉 সব প্রশ্নের উত্তর সঠিক হয়েছে!
        </div>
      ) : (
        <div className="space-y-3">
          {wrong_questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-xl shadow p-4">
              <p className="font-medium text-gray-800 mb-2">{toBengaliNumber(idx + 1)}. {q.question}</p>
              {['a', 'b', 'c', 'd'].map((opt) => {
                const letter = opt.toUpperCase()
                const isUserPick = q.your_answer === letter
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
              {!q.your_answer && <p className="text-xs text-amber-600 mt-1">উত্তর দেওয়া হয়নি</p>}
              {q.explanation && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-blue-600 mb-0.5">ব্যাখ্যা:</p>
                  <p className="text-xs text-gray-600">{q.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 rounded-xl active:scale-95 transition"
      >
        ফিরে যান
      </button>
    </div>
  )
}


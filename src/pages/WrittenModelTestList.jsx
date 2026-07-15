import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchWrittenModelTests } from '../services/api'

const categories = [
  { key: 'bcs', label: 'বিসিএস', icon: '📘' },
  { key: 'primary', label: 'প্রাইমারি', icon: '🏫' },
  { key: 'nibondhon', label: 'নিবন্ধন', icon: '📝' },
  { key: 'grade_9_20', label: '৯-২০ গ্রেড', icon: '💼' },
]

export default function WrittenModelTestList() {
  const navigate = useNavigate()
  const [view, setView] = useState('categories')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(false)

  async function openCategory(cat) {
    setSelectedCategory(cat)
    setLoading(true)
    try {
      const data = await fetchWrittenModelTests(cat.key)
      setTests(data)
      setView('tests')
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  function startTest(test) {
    navigate(`/written-model-tests/${test.id}/exam`, {
      state: { title: test.title, duration_minutes: test.duration_minutes }
    })
  }

  function goBack() {
    if (view === 'tests') { setView('categories'); setTests([]); setSelectedCategory(null) }
    else navigate(-1)
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-500">লোড হচ্ছে...</div>
  }

  return (
    <div className="p-4 pb-20">
      <button onClick={goBack} className="mb-4 text-blue-600 font-medium">
        ← ফিরে যান
      </button>

      {view === 'categories' && (
        <div>
          <h1 className="text-xl font-bold mb-4">রিটেন মডেল টেস্ট</h1>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.key}
                onClick={() => openCategory(cat)}
                className="bg-white rounded-xl shadow p-4 active:bg-gray-50 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-2xl mb-2">
                  {cat.icon}
                </div>
                <div className="font-semibold text-gray-800 text-sm">{cat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'tests' && (
        <div>
          <h1 className="text-xl font-bold mb-4">{selectedCategory?.label} মডেল টেস্ট</h1>
          <div className="space-y-3">
            {tests.map((test) => (
              <div
                key={test.id}
                onClick={() => startTest(test)}
                className="bg-white rounded-xl shadow p-4 active:bg-gray-50"
              >
                <div className="font-semibold text-gray-800">{test.title}</div>
                <div className="text-sm text-gray-500 mt-1">
                  প্রশ্ন: {test.question_count} | সময়: {test.duration_minutes} মিনিট
                </div>
              </div>
            ))}
            {tests.length === 0 && (
              <div className="text-center text-gray-400 py-8">কোনো মডেল টেস্ট পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

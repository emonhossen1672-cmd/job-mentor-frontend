import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { fetchExamPapers } from '../services/api'

const categories = [
  { key: 'bcs', label: 'বিসিএস', icon: '📘' },
  { key: 'primary', label: 'প্রাইমারি', icon: '🏫' },
  { key: 'nibondhon', label: 'নিবন্ধন', icon: '📝' },
  { key: 'grade_9_20', label: '৯-২০ গ্রেড', icon: '💼' },
]

export default function ExamPapers() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const examType = searchParams.get('type') || 'preli'

  const [view, setView] = useState('categories')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [papers, setPapers] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [selectedInstitution, setSelectedInstitution] = useState(null)
  const [loading, setLoading] = useState(false)

  async function openCategory(cat) {
    setSelectedCategory(cat)
    setLoading(true)
    try {
      const data = await fetchExamPapers(cat.key, examType)
      setPapers(data)
      const uniqueInstitutions = [...new Set(data.map(p => p.institution_name))]
      setInstitutions(uniqueInstitutions)
      setView('institutions')
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  function openInstitution(name) {
    setSelectedInstitution(name)
    setView('papers')
  }

  function goBack() {
    if (view === 'papers') { setView('institutions'); setSelectedInstitution(null) }
    else if (view === 'institutions') { setView('categories'); setPapers([]); setInstitutions([]); setSelectedCategory(null) }
    else navigate(-1)
  }

  const filteredPapers = papers.filter(p => p.institution_name === selectedInstitution)

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
          <h1 className="text-xl font-bold mb-4">
            {examType === 'written' ? 'রিটেন প্রশ্নপত্র' : 'প্রিলি প্রশ্নপত্র'}
          </h1>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.key}
                onClick={() => openCategory(cat)}
                className="bg-white rounded-xl shadow p-4 active:bg-gray-50 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl mb-2">
                  {cat.icon}
                </div>
                <div className="font-semibold text-gray-800 text-sm">{cat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'institutions' && (
        <div>
          <h1 className="text-xl font-bold mb-4">{selectedCategory?.label} প্রতিষ্ঠান</h1>
          <div className="space-y-3">
            {institutions.map((name) => (
              <div
                key={name}
                onClick={() => openInstitution(name)}
                className="bg-white rounded-xl shadow p-4 active:bg-gray-50"
              >
                <div className="font-semibold text-gray-800">{name}</div>
              </div>
            ))}
            {institutions.length === 0 && (
              <div className="text-center text-gray-400 py-8">কোনো প্রশ্নপত্র পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      )}

      {view === 'papers' && (
        <div>
          <h1 className="text-xl font-bold mb-4">{selectedInstitution}</h1>
          <div className="space-y-3">
            {filteredPapers.map((paper) => (
              <a
                key={paper.id}
                href={paper.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl shadow p-4 active:bg-gray-50"
              >
                <div className="font-medium text-gray-800">{paper.exam_title}</div>
                {paper.post_name && <div className="text-sm text-gray-500 mt-1">পদ: {paper.post_name}</div>}
                {paper.exam_date && <div className="text-sm text-gray-500">তারিখ: {paper.exam_date.split('T')[0]}</div>}
                {paper.subject_tag && <div className="text-xs text-blue-500 mt-1">{paper.subject_tag}</div>}
                <div className="text-xs text-gray-400 mt-1">{paper.file_type === 'pdf' ? '📄 PDF দেখুন' : '🖼️ ছবি দেখুন'}</div>
              </a>
            ))}
            {filteredPapers.length === 0 && (
              <div className="text-center text-gray-400 py-8">কোনো প্রশ্নপত্র পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

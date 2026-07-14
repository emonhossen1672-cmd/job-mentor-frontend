import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { fetchExamPapers } from '../services/api'

export default function ExamPapers() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const examType = searchParams.get('type') || 'preli'

  const [view, setView] = useState('institutions') // institutions | papers | viewer
  const [papers, setPapers] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [selectedInstitution, setSelectedInstitution] = useState(null)
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPapers()
  }, [])

  async function loadPapers() {
    setLoading(true)
    try {
      const data = await fetchExamPapers(null, examType)
      setPapers(data)
      const uniqueInstitutions = [...new Set(data.map(p => p.institution_name))]
      setInstitutions(uniqueInstitutions)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  function openInstitution(name) {
    setSelectedInstitution(name)
    setView('papers')
  }

  function openPaper(paper) {
    setSelectedPaper(paper)
    setView('viewer')
  }

  function goBack() {
    if (view === 'viewer') { setView('papers'); setSelectedPaper(null) }
    else if (view === 'papers') { setView('institutions'); setSelectedInstitution(null) }
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

      {view === 'institutions' && (
        <div>
          <h1 className="text-xl font-bold mb-4">
            {examType === 'written' ? 'রিটেন প্রশ্নপত্র' : 'প্রিলি প্রশ্নপত্র'}
          </h1>
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
              <div
                key={paper.id}
                onClick={() => openPaper(paper)}
                className="bg-white rounded-xl shadow p-4 active:bg-gray-50 cursor-pointer"
              >
                <div className="font-medium text-gray-800">{paper.exam_title}</div>
                {paper.post_name && <div className="text-sm text-gray-500 mt-1">পদ: {paper.post_name}</div>}
                {paper.exam_date && <div className="text-sm text-gray-500">তারিখ: {paper.exam_date.split('T')[0]}</div>}
                {paper.subject_tag && <div className="text-xs text-blue-500 mt-1">{paper.subject_tag}</div>}
                <div className="text-xs text-gray-400 mt-1">{paper.file_type === 'pdf' ? '📄 PDF দেখুন' : '🖼️ ছবি দেখুন'}</div>
              </div>
            ))}
            {filteredPapers.length === 0 && (
              <div className="text-center text-gray-400 py-8">কোনো প্রশ্নপত্র পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      )}

      {view === 'viewer' && selectedPaper && (
        <div>
          <h1 className="text-lg font-bold mb-3">{selectedPaper.exam_title}</h1>
          {selectedPaper.file_type === 'pdf' ? (
            <div className="w-full" style={{ height: '75vh' }}>
              <iframe
                src={selectedPaper.file_url}
                title={selectedPaper.exam_title}
                className="w-full h-full rounded-xl border border-gray-200"
              />
            </div>
          ) : (
            <img
              src={selectedPaper.file_url}
              alt={selectedPaper.exam_title}
              className="w-full rounded-xl"
            />
          )}
          <a
            href={selectedPaper.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-blue-600 text-sm font-medium mt-3"
          >
            নতুন ট্যাবে খুলুন
          </a>
        </div>
      )}
    </div>
  )
}

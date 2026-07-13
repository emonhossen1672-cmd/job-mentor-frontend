import { useState, useEffect } from 'react'
import { fetchExamPapers, fetchExamPapersByInstitution } from '../services/api'

export default function QuestionBank() {
  const [view, setView] = useState('institutions') // institutions | papers
  const [papers, setPapers] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [selectedInstitution, setSelectedInstitution] = useState(null)
  const [institutionPapers, setInstitutionPapers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const data = await fetchExamPapers()
      setPapers(data)

      // প্রতিষ্ঠান অনুযায়ী গ্রুপ করা
      const grouped = {}
      data.forEach(p => {
        if (!grouped[p.institution_name]) {
          grouped[p.institution_name] = { name: p.institution_name, count: 0 }
        }
        grouped[p.institution_name].count++
      })
      setInstitutions(Object.values(grouped))
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function openInstitution(inst) {
    setSelectedInstitution(inst)
    setLoading(true)
    try {
      const data = await fetchExamPapersByInstitution(inst.name)
      setInstitutionPapers(data)
      setView('papers')
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  function goBack() {
    setView('institutions')
    setInstitutionPapers([])
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-500">লোড হচ্ছে...</div>
  }

  return (
    <div className="p-4 pb-20">
      {view !== 'institutions' && (
        <button onClick={goBack} className="mb-4 text-blue-600 font-medium">
          ← ফিরে যান
        </button>
      )}

      {view === 'institutions' && (
        <div>
          <h1 className="text-xl font-bold mb-1">লিখিত প্রশ্নব্যাংক</h1>
          <p className="text-sm text-gray-500 mb-4">৯ম-২০তম গ্রেড | প্রতিষ্ঠানভিত্তিক পরীক্ষার প্রশ্নপত্র</p>
          <div className="space-y-3">
            {institutions.map(inst => (
              <div
                key={inst.name}
                onClick={() => openInstitution(inst)}
                className="bg-white rounded-xl shadow p-4 active:bg-gray-50 flex justify-between items-center"
              >
                <div className="font-semibold text-gray-800">{inst.name}</div>
                <div className="text-sm text-gray-500">{inst.count}টি প্রশ্নপত্র</div>
              </div>
            ))}
            {institutions.length === 0 && (
              <div className="text-center text-gray-400 py-8">এখনো কোনো প্রশ্নপত্র আপলোড হয়নি</div>
            )}
          </div>
        </div>
      )}

      {view === 'papers' && (
        <div>
          <h1 className="text-xl font-bold mb-4">{selectedInstitution?.name}</h1>
          <div className="space-y-3">
            {institutionPapers.map(paper => (
              <div key={paper.id} className="bg-white rounded-xl shadow p-4">
                <div className="font-medium text-gray-800">{paper.exam_title}</div>
                {paper.post_name && (
                  <div className="text-sm text-gray-500 mt-1">পদ: {paper.post_name}</div>
                )}
                {paper.exam_date && (
                  <div className="text-sm text-gray-500">তারিখ: {paper.exam_date}</div>
                )}
                {paper.subject_tag && (
                  <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                    {paper.subject_tag}
                  </span>
                )}
                <a
                  href={paper.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 text-center bg-blue-600 text-white rounded-lg py-2 text-sm font-medium"
                >
                  {paper.file_type === 'pdf' ? 'PDF দেখুন/ডাউনলোড' : 'ছবি দেখুন/ডাউনলোড'}
                </a>
              </div>
            ))}
            {institutionPapers.length === 0 && (
              <div className="text-center text-gray-400 py-8">কোনো প্রশ্নপত্র পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

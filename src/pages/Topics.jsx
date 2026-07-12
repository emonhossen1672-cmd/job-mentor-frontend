import { useState, useEffect } from 'react'
import { fetchTopics, fetchSubtopics, fetchSubtopicMCQs } from '../services/api'

export default function Topics() {
  const [view, setView] = useState('topics') // topics | subtopics | questions
  const [topics, setTopics] = useState([])
  const [subtopics, setSubtopics] = useState([])
  const [questions, setQuestions] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedSubtopic, setSelectedSubtopic] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTopics()
  }, [])

  async function loadTopics() {
    setLoading(true)
    try {
      const data = await fetchTopics()
      setTopics(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function openTopic(topic) {
    setSelectedTopic(topic)
    setLoading(true)
    try {
      const data = await fetchSubtopics(topic.id)
      setSubtopics(data)
      setView('subtopics')
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function openSubtopic(subtopic) {
    setSelectedSubtopic(subtopic)
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

  function goBack() {
    if (view === 'questions') { setView('subtopics'); setQuestions([]) }
    else if (view === 'subtopics') { setView('topics'); setSubtopics([]) }
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-500">লোড হচ্ছে...</div>
  }

  return (
    <div className="p-4 pb-20">
      {view !== 'topics' && (
        <button onClick={goBack} className="mb-4 text-blue-600 font-medium">
          ← ফিরে যান
        </button>
      )}

      {view === 'topics' && (
        <div>
          <h1 className="text-xl font-bold mb-4">টপিক গুরু</h1>
          <div className="space-y-3">
            {topics.map(topic => (
              <div
                key={topic.id}
                onClick={() => openTopic(topic)}
                className="bg-white rounded-xl shadow p-4 active:bg-gray-50"
              >
                <div className="font-semibold text-gray-800">{topic.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  প্রশ্ন: {topic.question_count} | সাবটপিক: {topic.subtopic_count}
                </div>
              </div>
            ))}
            {topics.length === 0 && (
              <div className="text-center text-gray-400 py-8">কোনো টপিক পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      )}

      {view === 'subtopics' && (
        <div>
          <h1 className="text-xl font-bold mb-4">{selectedTopic?.name}</h1>
          <div className="space-y-3">
            {subtopics.map(sub => (
              <div
                key={sub.id}
                onClick={() => openSubtopic(sub)}
                className="bg-white rounded-xl shadow p-4 active:bg-gray-50"
              >
                <div className="font-medium text-gray-800">{sub.name}</div>
                <div className="text-sm text-gray-500 mt-1">প্রশ্ন: {sub.question_count}</div>
              </div>
            ))}
            {subtopics.length === 0 && (
              <div className="text-center text-gray-400 py-8">কোনো সাবটপিক পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      )}

      {view === 'questions' && (
        <div>
          <h1 className="text-xl font-bold mb-4">{selectedSubtopic?.name}</h1>
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-xl shadow p-4">
                <div className="font-medium text-gray-800 mb-3">
                  {idx + 1}. {q.question}
                </div>
                <div className="space-y-2 text-sm">
                  <Option label="ক" text={q.option_a} correct={q.correct_answer === 'A'} />
                  <Option label="খ" text={q.option_b} correct={q.correct_answer === 'B'} />
                  <Option label="গ" text={q.option_c} correct={q.correct_answer === 'C'} />
                  <Option label="ঘ" text={q.option_d} correct={q.correct_answer === 'D'} />
                </div>
                {q.explanation && (
                  <div className="mt-3 text-sm text-gray-600 bg-gray-50 rounded p-2">
                    ব্যাখ্যা: {q.explanation}
                  </div>
                )}
              </div>
            ))}
            {questions.length === 0 && (
              <div className="text-center text-gray-400 py-8">কোনো প্রশ্ন পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Option({ label, text, correct }) {
  return (
    <div className={`p-2 rounded border ${correct ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200'}`}>
      ({label}) {text}
    </div>
  )
}

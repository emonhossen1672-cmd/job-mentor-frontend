import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { fetchWrittenModelTestQuestions, submitWrittenModelTest, uploadWrittenAnswerFiles } from '../services/api'

const toBengaliNumber = (num) => {
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' }
  return String(num).replace(/[0-9]/g, (d) => map[d])
}

export default function WrittenModelTestExam() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const title = location.state?.title || 'রিটেন মডেল টেস্ট'
  const durationMinutes = location.state?.duration_minutes || 90

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState('loading')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [studentName, setStudentName] = useState('')
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    fetchWrittenModelTestQuestions(id)
      .then((data) => {
        setQuestions(data)
        setSecondsLeft(durationMinutes * 60)
        setPhase('exam')
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (phase !== 'exam') return
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  const formatTime = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${toBengaliNumber(String(h).padStart(2, '0'))}:${toBengaliNumber(String(m).padStart(2, '0'))}:${toBengaliNumber(String(sec).padStart(2, '0'))}`
  }

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || [])
    if (selected.length === 0) return

    const isPdf = selected[0].type === 'application/pdf'
    const isImage = selected[0].type.startsWith('image/')

    if (isPdf && selected.length > 1) {
      setError('PDF হলে শুধু একটি ফাইল দেওয়া যাবে')
      return
    }
    if (!isPdf && !isImage) {
      setError('শুধু ছবি বা PDF আপলোড করা যাবে')
      return
    }

    const combined = [...files, ...selected].slice(0, 6)
    setFiles(combined)
    setError('')

    const newPreviews = combined.map((f) =>
      f.type === 'application/pdf' ? { name: f.name, type: 'pdf' } : { url: URL.createObjectURL(f), type: 'image', name: f.name }
    )
    setPreviews(newPreviews)
  }

  const removeFile = (idx) => {
    const updated = files.filter((_, i) => i !== idx)
    setFiles(updated)
    setPreviews(updated.map((f) =>
      f.type === 'application/pdf' ? { name: f.name, type: 'pdf' } : { url: URL.createObjectURL(f), type: 'image', name: f.name }
    ))
  }

  const handleSubmit = async () => {
    if (!studentName.trim()) {
      setError('আপনার নাম লিখুন')
      return
    }
    if (files.length === 0) {
      setError('অন্তত একটি ছবি বা PDF আপলোড করুন')
      return
    }

    setSubmitting(true)
    setError('')
    clearInterval(timerRef.current)
    try {
      const uploadResult = await uploadWrittenAnswerFiles(files)
      await submitWrittenModelTest(id, {
        student_name: studentName,
        answers: {
          file_urls: uploadResult.urls,
          file_type: uploadResult.file_type
        }
      })
      setPhase('submitted')
    } catch (err) {
      console.error(err)
      setError('জমা দিতে সমস্যা হয়েছে, আবার চেষ্টা করুন')
    }
    setSubmitting(false)
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-500">লোড হচ্ছে...</div>
  }

  if (phase === 'submitted') {
    return (
      <div className="p-4 pb-20 text-center">
        <div className="bg-white rounded-xl shadow p-8 mt-10">
          <div className="text-5xl mb-3">✅</div>
          <h1 className="text-lg font-bold mb-2">উত্তর খাতা জমা হয়েছে!</h1>
          <p className="text-sm text-gray-500 mb-6">অ্যাডমিন রিভিউ করে নম্বর দেবেন।</p>
          <button
            onClick={() => navigate('/written')}
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl"
          >
            রিটেন হাবে ফিরে যান
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-50 py-2 z-10">
        <h1 className="text-lg font-bold">{title}</h1>
        <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${secondsLeft <= 300 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
          ⏱ {formatTime(secondsLeft)}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700">
        নিচের প্রশ্নগুলো খাতায় লিখে উত্তর দিন, তারপর পুরো উত্তর খাতার ছবি বা PDF নিচে আপলোড করে জমা দিন।
      </div>

      <div className="space-y-3 mb-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-start justify-between">
              <p className="font-medium text-gray-800 flex-1">
                {toBengaliNumber(idx + 1)}. {q.question_text}
              </p>
              <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">({toBengaliNumber(q.marks)} মার্ক)</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">আপনার নাম</label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="নাম লিখুন"
          className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
        />
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">উত্তর খাতা আপলোড করুন (ছবি বা PDF)</label>

        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {previews.map((p, idx) => (
              <div key={idx} className="relative">
                {p.type === 'image' ? (
                  <img src={p.url} alt={`page ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-24 bg-red-50 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-2xl">📄</span>
                    <span className="text-[10px] text-gray-500 truncate max-w-full px-1">{p.name}</span>
                  </div>
                )}
                <button
                  onClick={() => removeFile(idx)}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-300">
          <span className="text-2xl text-gray-300 mb-1">📎</span>
          <span className="text-xs text-gray-400">ছবি (একাধিক পাতা) বা একটি PDF নির্বাচন করুন</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 rounded-xl text-sm text-red-600">{error}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl active:scale-95 transition disabled:opacity-60"
      >
        {submitting ? 'জমা হচ্ছে...' : 'উত্তর খাতা জমা দিন'}
      </button>
    </div>
  )
}

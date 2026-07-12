import { useState, useEffect, useCallback } from 'react'
import {
  HiDocumentText,
  HiPhotograph,
  HiCloudUpload,
  HiCheckCircle,
  HiXCircle,
  HiArrowRight,
  HiTrash,
} from 'react-icons/hi'
import { fetchWrittenQuestions, submitWrittenAnswer } from '../services/api.js'
import PageHeader from '../components/PageHeader.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorState from '../components/ErrorState.jsx'

const toBengaliNumber = (num) => {
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' }
  return String(num).replace(/[0-9]/g, (d) => map[d])
}

export default function WrittenExam() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [answer, setAnswer] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)
  const [validationError, setValidationError] = useState('')

  const loadQuestions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchWrittenQuestions()
      const list = Array.isArray(data) ? data : data?.data || data?.questions || []
      if (!list.length) throw new Error('কোনো প্রশ্ন পাওয়া যায়নি')
      const normalized = list.map((q, i) => ({
        id: q.id || i,
        question: q.question || q.title || q.text || '',
        subject: q.subject || q.category || 'সাধারণ',
        marks: q.marks || q.total_marks || 10,
      }))
      setQuestions(normalized)
      setCurrentIndex(0)
    } catch (err) {
      setError(err.message || 'প্রশ্ন লোড করতে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  const resetForm = () => {
    setAnswer('')
    setImageFile(null)
    setPdfFile(null)
    setImagePreview(null)
    setSubmitResult(null)
    setValidationError('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationError('ছবির সাইজ ৫MB এর কম হতে হবে')
        return
      }
      setImageFile(file)
      setValidationError('')
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setValidationError('PDF সাইজ ১০MB এর কম হতে হবে')
        return
      }
      setPdfFile(file)
      setValidationError('')
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const removePdf = () => {
    setPdfFile(null)
  }

  const handleSubmit = async () => {
    if (!answer.trim() && !imageFile && !pdfFile) {
      setValidationError('অন্তত একটি উত্তর দিন (টেক্সট, ছবি বা PDF)')
      return
    }

    setSubmitting(true)
    setValidationError('')
    setSubmitResult(null)

    const formData = new FormData()
    formData.append('questionId', currentQ.id)
    formData.append('answer', answer)
    if (imageFile) formData.append('image', imageFile)
    if (pdfFile) formData.append('pdf', pdfFile)

    try {
      const result = await submitWrittenAnswer(formData)
      setSubmitResult({ success: true, message: 'আপনার উত্তর সফলভাবে জমা হয়েছে!' })
    } catch (err) {
      setSubmitResult({ success: false, message: err.response?.data?.message || 'জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      loadQuestions()
      return
    }
    setCurrentIndex((i) => i + 1)
    resetForm()
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="লিখিত পরীক্ষা" subtitle="প্রশ্ন লোড হচ্ছে..." />
        <LoadingSpinner text="প্রশ্ন লোড হচ্ছে..." />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <PageHeader title="লিখিত পরীক্ষা" subtitle="ত্রুটি" />
        <ErrorState message={error} onRetry={loadQuestions} />
      </div>
    )
  }

  const currentQ = questions[currentIndex]

  return (
    <div>
      <PageHeader title="লিখিত পরীক্ষা" subtitle={`${toBengaliNumber(currentIndex + 1)} / ${toBengaliNumber(questions.length)}`} />

      {/* Progress */}
      <div className="px-4 pt-4">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="page-content">
        {/* Question Card */}
        <div key={currentIndex} className="card p-5 mb-4 animate-slide-in-right">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
              প্রশ্ন {toBengaliNumber(currentIndex + 1)}
            </span>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {currentQ.subject}
            </span>
          </div>
          <p className="font-semibold text-slate-800 mb-2 leading-relaxed">{currentQ.question}</p>
          <p className="text-xs text-slate-400">মান: {toBengaliNumber(currentQ.marks)}</p>
        </div>

        {/* Answer Text Area */}
        <div className="card p-4 mb-4">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">আপনার উত্তর</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="এখানে আপনার উত্তর লিখুন..."
            rows={6}
            className="w-full p-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">{toBengaliNumber(answer.length)} অক্ষর</p>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Image Upload */}
          <div className="card p-4">
            <label className="text-sm font-semibold text-slate-700 mb-3 block">ছবি আপলোড</label>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="preview" className="w-full h-28 object-cover rounded-xl" />
                <button
                  onClick={removeImage}
                  className="absolute top-1 right-1 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 active:scale-90 transition-all"
                >
                  <HiTrash className="text-sm" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-brand-300 hover:bg-brand-50/50 transition-all">
                <HiPhotograph className="text-2xl text-slate-300 mb-1" />
                <span className="text-xs text-slate-400">ছবি নির্বাচন করুন</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* PDF Upload */}
          <div className="card p-4">
            <label className="text-sm font-semibold text-slate-700 mb-3 block">PDF আপলোড</label>
            {pdfFile ? (
              <div className="flex flex-col items-center justify-center h-28 bg-red-50 rounded-xl relative">
                <HiDocumentText className="text-3xl text-red-400 mb-1" />
                <p className="text-xs text-slate-600 font-medium truncate max-w-[90%]">{pdfFile.name}</p>
                <button
                  onClick={removePdf}
                  className="absolute top-1 right-1 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 active:scale-90 transition-all"
                >
                  <HiTrash className="text-sm" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-brand-300 hover:bg-brand-50/50 transition-all">
                <HiDocumentText className="text-2xl text-slate-300 mb-1" />
                <span className="text-xs text-slate-400">PDF নির্বাচন করুন</span>
                <input type="file" accept="application/pdf" onChange={handlePdfChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="mb-4 p-3 bg-red-50 rounded-xl animate-shake">
            <p className="text-sm text-red-500 font-medium flex items-center gap-2">
              <HiXCircle className="text-lg" /> {validationError}
            </p>
          </div>
        )}

        {/* Submit Result */}
        {submitResult && (
          <div className={`mb-4 p-4 rounded-xl animate-slide-up ${submitResult.success ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              {submitResult.success ? (
                <HiCheckCircle className="text-xl text-emerald-500" />
              ) : (
                <HiXCircle className="text-xl text-red-500" />
              )}
              <p className={`text-sm font-medium ${submitResult.success ? 'text-emerald-700' : 'text-red-700'}`}>
                {submitResult.message}
              </p>
            </div>
            {submitResult.success && (
              <button
                onClick={handleNext}
                className="btn-primary w-full mt-2 flex items-center justify-center gap-2 text-sm"
              >
                {currentIndex + 1 >= questions.length ? 'শেষ প্রশ্ন' : 'পরবর্তী প্রশ্ন'}
                <HiArrowRight />
              </button>
            )}
          </div>
        )}

        {/* Submit Button */}
        {!submitResult?.success && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                জমা হচ্ছে...
              </>
            ) : (
              <>
                <HiCloudUpload className="text-lg" /> উত্তর জমা দিন
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

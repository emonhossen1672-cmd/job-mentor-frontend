import { useState, useEffect, useCallback } from 'react'
import {
  HiClock,
  HiCheckCircle,
  HiStar,
  HiDocumentText,
  HiCalendar,
  HiRefresh,
  HiChartBar,
} from 'react-icons/hi'
import { fetchSubmissions } from '../services/api.js'
import PageHeader from '../components/PageHeader.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorState from '../components/ErrorState.jsx'

const toBengaliNumber = (num) => {
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' }
  return String(num).replace(/[0-9]/g, (d) => map[d])
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
    return `${toBengaliNumber(d.getDate())} ${months[d.getMonth()]}, ${toBengaliNumber(d.getFullYear())}`
  } catch {
    return dateStr
  }
}

export default function Result() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadSubmissions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchSubmissions()
      const list = Array.isArray(data) ? data : data?.data || data?.submissions || []
      const normalized = list.map((s, i) => ({
        id: s.id || i,
        questionTitle: s.questionTitle || s.question || s.title || 'প্রশ্ন',
        subject: s.subject || s.category || 'সাধারণ',
        status: s.status || (s.marks != null ? 'graded' : 'pending'),
        marks: s.marks ?? null,
        totalMarks: s.totalMarks || s.total_marks || 10,
        submittedAt: s.submittedAt || s.submitted_at || s.createdAt || s.created_at || null,
        type: s.type || 'written',
      }))
      setSubmissions(normalized)
    } catch (err) {
      setError(err.message || 'ফলাফল লোড করতে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSubmissions()
  }, [loadSubmissions])

  const pendingCount = submissions.filter((s) => s.status === 'pending').length
  const gradedCount = submissions.filter((s) => s.status === 'graded').length
  const totalMarks = submissions.reduce((sum, s) => sum + (s.marks || 0), 0)
  const maxMarks = submissions.reduce((sum, s) => sum + (s.totalMarks || 0), 0)

  if (loading) {
    return (
      <div>
        <PageHeader title="ফলাফল" subtitle="লোড হচ্ছে..." />
        <LoadingSpinner text="ফলাফল লোড হচ্ছে..." />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <PageHeader title="ফলাফল" subtitle="ত্রুটি" />
        <ErrorState message={error} onRetry={loadSubmissions} />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="ফলাফল" subtitle="আপনার জমা ও নম্বর" />

      <div className="page-content">
        {/* Summary Cards */}
        {submissions.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="card p-3 text-center animate-slide-up">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-1.5">
                <HiDocumentText className="text-lg text-blue-500" />
              </div>
              <p className="text-lg font-bold text-slate-800">{toBengaliNumber(submissions.length)}</p>
              <p className="text-[10px] text-slate-400">মোট জমা</p>
            </div>
            <div className="card p-3 text-center animate-slide-up" style={{ animationDelay: '80ms' }}>
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mx-auto mb-1.5">
                <HiClock className="text-lg text-amber-500" />
              </div>
              <p className="text-lg font-bold text-slate-800">{toBengaliNumber(pendingCount)}</p>
              <p className="text-[10px] text-slate-400">মূল্যায়ন বাকি</p>
            </div>
            <div className="card p-3 text-center animate-slide-up" style={{ animationDelay: '160ms' }}>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-1.5">
                <HiCheckCircle className="text-lg text-emerald-500" />
              </div>
              <p className="text-lg font-bold text-slate-800">{toBengaliNumber(gradedCount)}</p>
              <p className="text-[10px] text-slate-400">মূল্যায়িত</p>
            </div>
          </div>
        )}

        {/* Total Score Banner */}
        {gradedCount > 0 && (
          <div className="card p-4 mb-5 bg-gradient-to-br from-brand-50 to-blue-50 border-brand-100 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-md">
                <HiChartBar className="text-2xl text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700">মোট প্রাপ্ত নম্বর</p>
                <p className="text-2xl font-bold text-brand-600">
                  {toBengaliNumber(totalMarks)}
                  <span className="text-sm text-slate-400 font-normal"> / {toBengaliNumber(maxMarks)}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-brand-600">
                  {maxMarks > 0 ? toBengaliNumber(Math.round((totalMarks / maxMarks) * 100)) : '০'}%
                </p>
                <p className="text-[10px] text-slate-400">সাফল্যের হার</p>
              </div>
            </div>
          </div>
        )}

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <HiDocumentText className="text-3xl text-slate-300" />
            </div>
            <p className="text-sm text-slate-500 mb-1">কোনো জমা নেই</p>
            <p className="text-xs text-slate-400 mb-4">লিখিত পরীক্ষা দিয়ে ফলাফল দেখুন</p>
            <button onClick={loadSubmissions} className="btn-secondary text-sm flex items-center gap-2">
              <HiRefresh /> রিফ্রেশ
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="section-title">
              <HiStar className="text-brand-500" />
              জমাসমূহ
            </h2>
            {submissions.map((sub, idx) => (
              <div
                key={sub.id}
                className="card p-4 animate-slide-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-slate-800 mb-1 leading-snug">{sub.questionTitle}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                        {sub.subject}
                      </span>
                      {sub.submittedAt && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                          <HiCalendar /> {formatDate(sub.submittedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  {sub.status === 'pending' ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex-shrink-0">
                      <HiClock /> মূল্যায়ন বাকি
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex-shrink-0">
                      <HiCheckCircle /> মূল্যায়িত
                    </span>
                  )}
                </div>
                {sub.status === 'graded' && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500">প্রাপ্ত নম্বর</span>
                    <span className="font-bold text-brand-600">
                      {toBengaliNumber(sub.marks || 0)} / {toBengaliNumber(sub.totalMarks)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

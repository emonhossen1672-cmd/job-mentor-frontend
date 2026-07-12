import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiAcademicCap,
  HiBookOpen,
  HiClipboardCheck,
  HiDocumentText,
  HiTrendingUp,
  HiClock,
  HiUsers,
  HiStar,
  HiArrowRight,
  HiFire,
  HiLightBulb,
} from 'react-icons/hi';
import { fetchMCQs } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const categories = [
  { id: 1, name: 'সরকারি চাকরি', icon: HiAcademicCap, color: 'from-blue-500 to-blue-600', count: '৬২০+' },
  { id: 2, name: 'ব্যাংক চাকরি', icon: HiTrendingUp, color: 'from-emerald-500 to-emerald-600', count: '৮৫+' },
  { id: 3, name: 'BCS প্রস্তুতি', icon: HiStar, color: 'from-amber-500 to-orange-500', count: '২০০+' },
  { id: 4, name: 'প্রাইভেট চাকরি', icon: HiUsers, color: 'from-purple-500 to-pink-500', count: '৯৫+' },
]

const subjects = [
  { id: 1, name: 'বাংলা সাহিত্য', icon: '📖', total: 450, color: 'bg-rose-50 text-rose-600' },
  { id: 2, name: 'ইংরেজি', icon: '🔤', total: 380, color: 'bg-blue-50 text-blue-600' },
  { id: 3, name: 'গণিত', icon: '📊', total: 520, color: 'bg-emerald-50 text-emerald-600' },
  { id: 4, name: 'সাধারণ জ্ঞান', icon: '🌍', total: 600, color: 'bg-amber-50 text-amber-600' },
  { id: 5, name: 'বিজ্ঞান', icon: '🔬', total: 310, color: 'bg-purple-50 text-purple-600' },
  { id: 6, name: 'আইসিটি', icon: '💻', total: 220, color: 'bg-cyan-50 text-cyan-600' },
]

const stats = [
  { label: 'মোট প্রশ্ন', value: '২,৫০০+', icon: HiClipboardCheck, color: 'text-blue-500' },
  { label: 'সক্রিয় শিক্ষার্থী', value: '১৫,০০০+', icon: HiUsers, color: 'text-emerald-500' },
  { label: 'সম্পূর্ণ পরীক্ষা', value: '৪৫,০০০+', icon: HiFire, color: 'text-orange-500' },
  { label: 'সাফল্যের হার', value: '৭৮%', icon: HiTrendingUp, color: 'text-purple-500' },
]

const toBengaliNumber = (num) => {
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' }
  return String(num).replace(/[0-9]/g, (d) => map[d])
}

export default function Home() {
  const navigate = useNavigate()
  const [sampleMCQ, setSampleMCQ] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    fetchMCQs()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || data?.questions || []
        if (list.length > 0) {
          setSampleMCQ(list[0])
        }
      })
      .catch(() => {
        setSampleMCQ({
          question: 'বাংলাদেশের রাজধানী কোন শহর?',
          options: ['চট্টগ্রাম', 'ঢাকা', 'রাজশাহী', 'খুলনা'],
          correctAnswer: 1,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const handleOptionClick = (index) => {
    if (showAnswer) return
    setSelectedOption(index)
    setShowAnswer(true)
  }

  const getOptionClass = (index) => {
    if (!showAnswer) {
      return selectedOption === index
        ? 'border-brand-500 bg-brand-50'
        : 'border-slate-200 hover:border-brand-300 hover:bg-brand-50/50'
    }
    if (index === sampleMCQ.correctAnswer) {
      return 'border-emerald-500 bg-emerald-50'
    }
    if (index === selectedOption) {
      return 'border-red-500 bg-red-50'
    }
    return 'border-slate-200 opacity-60'
  }

  return (
    <div className="page-content animate-fade-in">
      <section className="gradient-header -mx-4 -mt-4 px-4 pt-8 pb-10 rounded-b-3xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <HiAcademicCap className="text-2xl" />
            </div>
            <span className="text-sm font-medium text-brand-100">Job Mentor</span>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-balance">
            চাকরি প্রস্তুতি এখন আরও সহজ
          </h1>
          <p className="text-sm text-brand-100 mb-5 max-w-xs">
            MCQ ও লিখিত পরীক্ষার অনুশীলন করুন, ফলাফল দেখুন, সবকিছু এক আপে
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/mcq')}
              className="bg-white text-brand-600 font-semibold py-2.5 px-5 rounded-xl text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
            >
              <HiClipboardCheck className="text-lg" />
              পরীক্ষা শুরু করুন
            </button>
            <button
              onClick={() => navigate('/written')}
              className="bg-white/15 backdrop-blur-sm text-white font-semibold py-2.5 px-5 rounded-xl text-sm border border-white/20 hover:bg-white/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <HiDocumentText className="text-lg" />
              লিখিত পরীক্ষা
            </button>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="section-title">
          <HiLightBulb className="text-brand-500" />
          ক্যাটাগরি
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, idx) => {
            const Icon = cat.icon
            return (
              <div
                key={cat.id}
                onClick={() => navigate('/mcq')}
                className="card card-hover p-4 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon className="text-xl text-white" />
                </div>
                <h3 className="font-semibold text-sm text-slate-800 mb-0.5">{cat.name}</h3>
                <p className="text-xs text-slate-400">{cat.count} প্রশ্ন</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title mb-0">
            <HiBookOpen className="text-brand-500" />
            বিষয়সমূহ
          </h2>
          <button onClick={() => navigate('/mcq')} className="text-xs text-brand-600 font-medium flex items-center gap-1">
            সব দেখুন <HiArrowRight />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              onClick={() => navigate('/mcq')}
              className="card card-hover p-4 cursor-pointer min-w-[130px] flex-shrink-0"
            >
              <div className={`w-10 h-10 rounded-lg ${sub.color} flex items-center justify-center text-xl mb-2`}>
                {sub.icon}
              </div>
              <h3 className="font-semibold text-sm text-slate-800">{sub.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{toBengaliNumber(sub.total)} প্রশ্ন</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="section-title">
          <HiTrendingUp className="text-brand-500" />
          পরিসংখ্যান
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="card p-4 animate-slide-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <Icon className={`text-2xl ${stat.color} mb-2`} />
                <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mb-4">
        <h2 className="section-title">
          <HiClipboardCheck className="text-brand-500" />
          নমুনা প্রশ্ন
        </h2>
        {loading ? (
          <LoadingSpinner text="প্রশ্ন লোড হচ্ছে..." />
        ) : sampleMCQ ? (
          <div className="card p-5 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                নমুনা MCQ
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <HiClock /> ৩০ সেকেন্ড
              </span>
            </div>
            <p className="font-semibold text-slate-800 mb-4">{sampleMCQ.question}</p>
            <div className="space-y-2.5">
              {(sampleMCQ.options || []).map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  className={"w-full text-left p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 " + getOptionClass(idx)}
                >
                  <span className={"w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold " + (showAnswer && idx === sampleMCQ.correctAnswer ? "bg-emerald-500 text-white" : showAnswer && idx === selectedOption ? "bg-red-500 text-white" : "bg-slate-100 text-slate-600")}>
                    {String.fromCharCode(2465 + idx)}
                  </span>
                  <span className="text-sm font-medium text-slate-700">{opt}</span>
                </button>
              ))}
            </div>
            {showAnswer && (
              <div className="mt-4 animate-slide-up">
                {selectedOption === sampleMCQ.correctAnswer ? (
                  <p className="text-sm text-emerald-600 font-medium bg-emerald-50 p-3 rounded-xl">
                    সঠিক উত্তর, শাবাশ
                  </p>
                ) : (
                  <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-xl">
                    ভুল হয়েছে। সঠিক উত্তর: {sampleMCQ.options[sampleMCQ.correctAnswer]}
                  </p>
                )}
                <button
                  onClick={() => navigate('/mcq')}
                  className="btn-primary w-full mt-3 text-sm flex items-center justify-center gap-2"
                >
                  আরও প্রশ্ন অনুশীলন করুন <HiArrowRight />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </section>
    </div>
  )
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiBookOpen,
  HiClipboardCheck,
  HiDocumentText,
  HiTrendingUp,
  HiClock,
  HiUsers,
  HiArrowRight,
  HiFire,
} from 'react-icons/hi';
import { fetchMCQs } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

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
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="logo-mark text-base">🎯</div>
        <div className="text-xl font-extrabold flex items-baseline">
          <span className="logo-gradient-text">Job</span>
          <span className="text-red-500 text-2xl leading-none mx-0.5">.</span>
          <span className="text-slate-900 ml-0.5">Mentor</span>
        </div>
      </div>

      {/* Hero */}
      <section className="hero-banner mb-6">
        <div className="relative z-10">
          <div className="hero-badge">
            <span className="live-dot" />
            ৯ম-২০তম গ্রেড · সকল ক্যাডার বহির্ভূত পদ
          </div>
          <h1 className="hero-title">
            {['বিসিএসসহ,', '৯ম-২০', 'গ্রেডে', 'চাকরি', 'পান'].map((word, idx) => (
              <span
                key={word}
                className="hero-word"
                style={{ animationDelay: `${0.05 + idx * 0.08}s` }}
              >
                {word}
              </span>
            ))}
            <span className="hero-word hero-word-accent" style={{ animationDelay: '0.45s' }}>
              দ্রুত
            </span>
          </h1>
          <div className="hero-sub">
            <span className="spark-icon">✨</span>
            সকল প্রিলি + রিটেন প্রস্তুতি এক প্লাটফর্মে
          </div>
          <div className="flex gap-3 mt-5 relative z-10">
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

      {/* প্রিলি / রিটেন — বড় কার্ড */}
      <section className="mb-6">
        <h2 className="section-title">প্রস্তুতি শুরু করুন</h2>
        <div className="grid grid-cols-1 gap-3">
          <div
            onClick={() => navigate('/topics')}
            className="type-card-lg cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#1e40af)' }}
          >
            <div className="relative z-10 text-3xl">📘</div>
            <h3 className="type-card-lg-title">প্রিলি প্রস্তুতি</h3>
            <p className="relative z-10 text-xs opacity-90 mt-1">MCQ + টপিক গুরু</p>
            <span className="relative z-10 inline-block bg-white/20 text-[11px] font-bold px-3 py-1 rounded-full mt-3">
              ৮,০০০+ MCQ
            </span>
          </div>
          <div
            onClick={() => navigate('/written')}
            className="type-card-lg cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#c2410c)' }}
          >
            <div className="relative z-10 text-3xl">📝</div>
            <h3 className="type-card-lg-title" style={{ animationDelay: '0.15s' }}>রিটেন প্রস্তুতি</h3>
            <p className="relative z-10 text-xs opacity-90 mt-1">লিখিত + প্রশ্নব্যাংক</p>
            <span className="relative z-10 inline-block bg-white/20 text-[11px] font-bold px-3 py-1 rounded-full mt-3">
              ১,২০০+ প্রশ্নপত্র
            </span>
          </div>
        </div>
      </section>

      {/* পরীক্ষা দিন */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title mb-0">পরীক্ষা দিন</h2>
          <button onClick={() => navigate('/model-tests')} className="text-xs text-brand-600 font-medium flex items-center gap-1">
            সব দেখুন <HiArrowRight />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => navigate('/model-tests')}
            className="exam-card cursor-pointer"
            style={{ background: 'linear-gradient(160deg,#60a5fa,#1d4ed8 60%,#1e3a8a)' }}
          >
            <span className="exam-badge">
              <span className="live-dot" /> লাইভ
            </span>
            <div className="exam-icon">🧩</div>
            <h4 className="relative z-10 text-sm font-extrabold mt-2">Preliminary</h4>
            <p className="relative z-10 text-[10px] opacity-90 mt-1">৩২টি মডেল টেস্ট</p>
            <span className="exam-cta">পরীক্ষা দিন</span>
          </div>
          <div
            onClick={() => navigate('/model-tests?type=written')}
            className="exam-card cursor-pointer"
            style={{ background: 'linear-gradient(160deg,#fbbf24,#f97316 60%,#9a3412)', animationDelay: '0.2s' }}
          >
            <span className="exam-badge">
              <span className="live-dot" /> নতুন
            </span>
            <div className="exam-icon">✍️</div>
            <h4 className="relative z-10 text-sm font-extrabold mt-2">Written</h4>
            <p className="relative z-10 text-[10px] opacity-90 mt-1">১৮টি রিটেন পরীক্ষা</p>
            <span className="exam-cta">পরীক্ষা দিন</span>
          </div>
        </div>
      </section>

      {/* ফলাফল */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title mb-0">ফলাফল</h2>
          <button onClick={() => navigate('/result')} className="text-xs text-brand-600 font-medium flex items-center gap-1">
            সব দেখুন <HiArrowRight />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => navigate('/result')}
            className="card cursor-pointer text-center p-4 opacity-0"
            style={{ borderTop: '3px solid #2563eb', animation: 'fadeSlideUp .55s ease .05s forwards' }}
          >
            <div className="result-ring result-ring-prelim"><span>৭২%</span></div>
            <h5 className="text-sm font-extrabold text-slate-800">Preliminary</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">গড় স্কোর</p>
            <div className="text-[9px] text-slate-300 mt-1.5">১২টি পরীক্ষা সম্পন্ন</div>
          </div>
          <div
            onClick={() => navigate('/result')}
            className="card cursor-pointer text-center p-4 opacity-0"
            style={{ borderTop: '3px solid #ea580c', animation: 'fadeSlideUp .55s ease .2s forwards' }}
          >
            <div className="result-ring result-ring-written"><span>৬৫%</span></div>
            <h5 className="text-sm font-extrabold text-slate-800">Written</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">গড় স্কোর</p>
            <div className="text-[9px] text-slate-300 mt-1.5">৭টি পরীক্ষা সম্পন্ন</div>
          </div>
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

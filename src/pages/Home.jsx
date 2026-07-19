import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiBookOpen,
  HiClipboardCheck,
  HiDocumentText,
  HiArrowRight,
  HiClock,
} from 'react-icons/hi';
import { fetchLiveUpdates } from '../services/api.js';

const subjects = [
  { id: 1, name: 'বাংলা সাহিত্য', icon: '📖', total: 450, color: 'bg-rose-50 text-rose-600' },
  { id: 2, name: 'ইংরেজি', icon: '🔤', total: 380, color: 'bg-blue-50 text-blue-600' },
  { id: 3, name: 'গণিত', icon: '📊', total: 520, color: 'bg-emerald-50 text-emerald-600' },
  { id: 4, name: 'সাধারণ জ্ঞান', icon: '🌍', total: 600, color: 'bg-amber-50 text-amber-600' },
  { id: 5, name: 'বিজ্ঞান', icon: '🔬', total: 310, color: 'bg-purple-50 text-purple-600' },
  { id: 6, name: 'আইসিটি', icon: '💻', total: 220, color: 'bg-cyan-50 text-cyan-600' },
]

const studySection = [
  { id: 1, name: 'Free Hand Writing', icon: '✍️', route: '/study/free-hand-writing', color: 'bg-rose-50 text-rose-600' },
  { id: 2, name: 'Editorial (Bangla/English)', icon: '📰', route: '/study/editorial', color: 'bg-blue-50 text-blue-600' },
  { id: 3, name: 'Newspaper Vocabulary', icon: '📖', route: '/study/newspaper-vocabulary', color: 'bg-emerald-50 text-emerald-600' },
  { id: 4, name: 'Current Affairs', icon: '🌍', route: '/study/current-affairs', color: 'bg-amber-50 text-amber-600' },
  { id: 5, name: 'Vocabulary', icon: '🔤', route: '/study/vocabulary', color: 'bg-purple-50 text-purple-600' },
  { id: 6, name: 'বাংলা মুখস্থবিদ্যা', icon: '📚', route: '/study/bangla-mukhosto', color: 'bg-cyan-50 text-cyan-600' },
  { id: 7, name: 'Translation', icon: '🔁', route: '/study/translation', color: 'bg-pink-50 text-pink-600' },
  { id: 8, name: 'Translation (Newspaper)', icon: '📄', route: '/study/translation-newspaper', color: 'bg-teal-50 text-teal-600' },
]

const categoryLabels = {
  bcs: 'বিসিএস',
  primary: 'প্রাইমারি',
  nibondhon: 'নিবন্ধন',
  grade_9_20: '৯-২০ গ্রেড',
}

const toBengaliNumber = (num) => {
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' }
  return String(num).replace(/[0-9]/g, (d) => map[d])
}

function formatDateTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString('bn-BD', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function Home() {
  const navigate = useNavigate()
  const [liveUpdates, setLiveUpdates] = useState([])
  const [loadingUpdates, setLoadingUpdates] = useState(true)

  useEffect(() => {
    fetchLiveUpdates()
      .then((data) => setLiveUpdates(data))
      .catch(() => setLiveUpdates([]))
      .finally(() => setLoadingUpdates(false))
  }, [])

  function goToExam(item) {
    if (item.type === 'written') navigate(`/written-model-tests/${item.id}/exam`)
    else navigate(`/model-tests/${item.id}/exam`)
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

      {/* লাইভ পরীক্ষার আপডেট */}
      {!loadingUpdates && liveUpdates.length > 0 && (
        <section className="mb-6">
          <h2 className="section-title">
            <span className="live-dot" style={{ display: 'inline-block' }} />
            লাইভ পরীক্ষার আপডেট
          </h2>
          <div className="space-y-3">
            {liveUpdates.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => item.status === 'live' && goToExam(item)}
                className={`card p-4 flex items-center justify-between gap-3 ${item.status === 'live' ? 'cursor-pointer' : ''}`}
                style={{
                  borderLeft: `4px solid ${item.status === 'live' ? '#16a34a' : item.status === 'upcoming' ? '#f59e0b' : '#94a3b8'}`,
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.status === 'live' && (
                      <span className="text-[10px] font-bold text-white bg-green-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="live-dot" /> লাইভ
                      </span>
                    )}
                    {item.status === 'upcoming' && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        আসন্ন
                      </span>
                    )}
                    {item.status === 'ended' && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        সমাপ্ত
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">{categoryLabels[item.category] || item.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                    <HiClock />
                    {formatDateTime(item.scheduled_at)}
                  </div>
                </div>
                {item.status === 'live' && (
                  <button className="bg-green-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex-shrink-0">
                    অংশ নিন
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

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

      {/* Study Section */}
      <section className="mb-4">
        <h2 className="section-title">
          <HiBookOpen className="text-brand-500" />
          Study Section
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {studySection.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => navigate(item.route)}
              className="card card-hover p-4 cursor-pointer animate-slide-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center text-xl mb-2`}>
                {item.icon}
              </div>
              <h3 className="font-semibold text-sm text-slate-800 leading-snug">{item.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

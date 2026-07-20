import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiBookOpen,
  HiClipboardCheck,
  HiDocumentText,
  HiArrowRight,
  HiClock,
  HiSparkles,
} from 'react-icons/hi';
import { fetchLiveUpdates } from '../services/api.js';

const subjects = [
  { id: 1, name: 'বাংলা সাহিত্য', icon: '📖', total: 450, gradient: 'linear-gradient(135deg,#fb7185,#be123c)' },
  { id: 2, name: 'ইংরেজি', icon: '🔤', total: 380, gradient: 'linear-gradient(135deg,#60a5fa,#1d4ed8)' },
  { id: 3, name: 'গণিত', icon: '📊', total: 520, gradient: 'linear-gradient(135deg,#34d399,#047857)' },
  { id: 4, name: 'সাধারণ জ্ঞান', icon: '🌍', total: 600, gradient: 'linear-gradient(135deg,#fbbf24,#b45309)' },
  { id: 5, name: 'বিজ্ঞান', icon: '🔬', total: 310, gradient: 'linear-gradient(135deg,#c084fc,#7e22ce)' },
  { id: 6, name: 'আইসিটি', icon: '💻', total: 220, gradient: 'linear-gradient(135deg,#22d3ee,#0e7490)' },
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
      <style>{`
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0px rgba(255,255,255,0); }
          50% { box-shadow: 0 6px 24px -2px var(--glow-color, rgba(0,0,0,.35)); }
        }
        @keyframes sparkleSpin {
          from { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.15); }
          to { transform: rotate(360deg) scale(1); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes shimmerMove {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .glow-card {
          animation: glowPulse 2.6s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }
        .glow-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,.28) 50%, transparent 70%);
          background-size: 200% 100%;
          animation: shimmerMove 3.2s linear infinite;
        }
        .sparkle-icon {
          animation: sparkleSpin 3s ease-in-out infinite;
          display: inline-block;
        }
        .subject-tile {
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .subject-tile:active {
          transform: scale(0.94);
        }
        .subject-icon-badge {
          animation: floatY 2.8s ease-in-out infinite;
        }
      `}</style>

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
              className="bg-white text-brand-600

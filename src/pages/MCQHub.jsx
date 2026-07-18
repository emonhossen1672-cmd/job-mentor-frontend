import { useNavigate } from 'react-router-dom'
import { HiBookmark, HiArrowRight } from 'react-icons/hi'
import PageHeader from '../components/PageHeader.jsx'
import { getBookmarkedQuestions } from './bookmarks.js'

const toBengaliNumber = (num) => {
  const map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' }
  return String(num).replace(/[0-9]/g, (d) => map[d])
}

const subjects = [
  { name: 'বাংলা সাহিত্য', icon: '📖' },
  { name: 'ইংরেজি', icon: '🔤' },
  { name: 'গণিত', icon: '📊' },
  { name: 'সাধারণ জ্ঞান', icon: '🌍' },
  { name: 'বিজ্ঞান', icon: '🔬' },
  { name: 'আইসিটি', icon: '💻' },
]

export default function MCQHub() {
  const navigate = useNavigate()
  const bookmarkCount = getBookmarkedQuestions().length

  const startPractice = (subject) => {
    navigate('/mcq/practice', { state: { subject } })
  }

  return (
    <div>
      <PageHeader title="MCQ প্র্যাকটিস" subtitle="বিষয় বেছে শুরু করুন" />
      <div className="page-content">
        <button
          onClick={() => startPractice('all')}
          className="w-full bg-brand-600 text-white rounded-2xl p-5 mb-4 flex items-center justify-between shadow-md active:scale-[0.98] transition"
        >
          <div className="text-left">
            <p className="font-bold text-lg">সব বিষয় মিলিয়ে</p>
            <p className="text-brand-100 text-sm">র‍্যান্ডম প্রশ্ন থেকে প্র্যাকটিস করুন</p>
          </div>
          <HiArrowRight className="text-xl flex-shrink-0" />
        </button>

        <p className="text-sm font-semibold text-slate-500 mb-3">নির্দিষ্ট বিষয় বেছে নিন</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {subjects.map((s) => (
            <button
              key={s.name}
              onClick={() => startPractice(s.name)}
              className="card p-4 text-center active:scale-95 transition"
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="text-sm font-semibold text-slate-700">{s.name}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/bookmarks')}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 py-3.5 rounded-xl active:scale-95 transition"
        >
          <HiBookmark className="text-lg" />
          ভুল প্রশ্ন রিভিউ করুন
          {bookmarkCount > 0 && <span>({toBengaliNumber(bookmarkCount)}টি)</span>}
        </button>
      </div>
    </div>
  )
}

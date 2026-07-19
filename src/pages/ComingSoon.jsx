import { useNavigate, useLocation } from 'react-router-dom'
import { HiArrowLeft, HiSparkles } from 'react-icons/hi'

const titles = {
  '/study/free-hand-writing': 'Free Hand Writing',
  '/study/editorial': 'Editorial (Bangla/English)',
  '/study/newspaper-vocabulary': 'Newspaper Vocabulary',
  '/study/current-affairs': 'Current Affairs',
  '/study/bangla-mukhosto': 'বাংলা মুখস্থবিদ্যা',
  '/study/translation': 'Translation',
  '/study/translation-newspaper': 'Translation from Newspaper',
}

export default function ComingSoon() {
  const navigate = useNavigate()
  const location = useLocation()
  const title = titles[location.pathname] || 'এই সেকশন'

  return (
    <div className="page-content animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-slate-500 font-medium mb-6">
        <HiArrowLeft /> ফিরে যান
      </button>
      <div className="flex flex-col items-center justify-center text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-3xl mb-4">
          <HiSparkles className="text-brand-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-1">{title}</h2>
        <p className="text-sm text-slate-400">এই সেকশনটি শীঘ্রই আসছে</p>
      </div>
    </div>
  )
}

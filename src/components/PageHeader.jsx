import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, subtitle, showBack = false }) {
  const navigate = useNavigate()

  return (
    <header className="gradient-header px-4 pt-6 pb-8 rounded-b-3xl shadow-lg shadow-brand-500/20 animate-slide-up">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl hover:bg-white/10 active:scale-90 transition-all"
            aria-label="পিছনে যান"
          >
            <HiArrowLeft className="text-xl" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-brand-100 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </header>
  )
}

import { NavLink } from 'react-router-dom'
import { HiHome, HiClipboardCheck, HiDocumentText, HiChartBar, HiUser } from 'react-icons/hi'
import { HiHome, HiClipboardCheck, HiDocumentText, HiChartBar, HiUser, HiBookOpen } from 'react-icons/hi'
const navItems = [
  { to: '/', label: 'হোম', icon: HiHome, end: true },
  { to: '/mcq', label: 'MCQ', icon: HiClipboardCheck },
const navItems = [
  { to: '/', label: 'হোম', icon: HiHome, end: true },
  { to: '/mcq', label: 'MCQ', icon: HiClipboardCheck },
  { to: '/topics', label: 'টপিক', icon: HiBookOpen },
  { to: '/written', label: 'লিখিত', icon: HiDocumentText },
  { to: '/result', label: 'ফলাফল', icon: HiChartBar },
  { to: '/profile', label: 'প্রোফাইল', icon: HiUser },
]
  
  { to: '/written', label: 'লিখিত', icon: HiDocumentText },
  { to: '/result', label: 'ফলাফল', icon: HiChartBar },
  { to: '/profile', label: 'প্রোফাইল', icon: HiUser },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-lg border-t border-slate-200 z-50 safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 flex-1 ${
                  isActive
                    ? 'text-brand-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1.5 rounded-xl transition-all duration-200 ${
                      isActive ? 'bg-brand-100 scale-110' : 'scale-100'
                    }`}
                  >
                    <Icon className="text-xl" />
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

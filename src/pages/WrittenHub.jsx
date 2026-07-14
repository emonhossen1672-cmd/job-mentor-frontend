import { useNavigate } from 'react-router-dom'

const subjects = [
  { key: 'বাংলা', label: 'বাংলা', icon: '📖' },
  { key: 'ইংরেজি', label: 'ইংরেজি', icon: '🔤' },
  { key: 'গণিত', label: 'গণিত', icon: '📊' },
  { key: 'সাধারণ জ্ঞান', label: 'সাধারণ জ্ঞান', icon: '🌍' },
]

export default function WrittenHub() {
  const navigate = useNavigate()

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">রিটেন প্রস্তুতি</h1>

      <div
        onClick={() => navigate('/exam-papers?type=written')}
        className="bg-white rounded-xl shadow p-4 active:bg-gray-50 flex items-center gap-3 mb-4"
      >
        <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-2xl">📄</div>
        <div>
          <div className="font-semibold text-gray-800">প্রতিষ্ঠান অনুযায়ী প্রশ্নপত্র</div>
          <div className="text-xs text-gray-500 mt-0.5">পুরনো প্রশ্নপত্র আর্কাইভ</div>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-gray-500 mb-3">বিষয়ভিত্তিক স্টাডি</h2>
      <div className="grid grid-cols-2 gap-3">
        {subjects.map((s) => (
          <div
            key={s.key}
            onClick={() => navigate(`/written/study?subject=${encodeURIComponent(s.key)}`)}
            className="bg-white rounded-xl shadow p-4 active:bg-gray-50 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl mb-2">
              {s.icon}
            </div>
            <div className="font-semibold text-gray-800 text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

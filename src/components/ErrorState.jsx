import { FiAlertCircle } from 'react-icons/fi'

export default function ErrorState({ message = 'কিছু সমস্যা হয়েছে', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <FiAlertCircle className="text-3xl text-red-400" />
      </div>
      <p className="text-sm text-slate-600 text-center mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary text-sm">
          আবার চেষ্টা করুন
        </button>
      )}
    </div>
  )
}

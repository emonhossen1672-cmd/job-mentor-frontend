import { FiLoader } from 'react-icons/fi'

export default function LoadingSpinner({ text = 'লোড হচ্ছে...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-brand-100" />
        <FiLoader className="absolute inset-0 m-auto text-2xl text-brand-500 animate-spin" />
      </div>
      <p className="mt-4 text-sm text-slate-500 font-medium">{text}</p>
    </div>
  )
}

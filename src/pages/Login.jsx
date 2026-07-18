import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { HiPhone, HiMail } from 'react-icons/hi'
import { auth } from '../firebase.js'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const recaptchaRef = useRef(null)

  useEffect(() => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      })
    }
  }, [])

  const formatPhone = (p) => {
    const digits = p.replace(/\D/g, '')
    if (digits.startsWith('880')) return `+${digits}`
    if (digits.startsWith('0')) return `+88${digits}`
    return `+880${digits}`
  }

  const sendOtp = async () => {
    setError('')
    if (!phone.trim()) {
      setError('মোবাইল নম্বর দিন')
      return
    }
    setLoading(true)
    try {
      const formatted = formatPhone(phone)
      const result = await signInWithPhoneNumber(auth, formatted, recaptchaRef.current)
      setConfirmationResult(result)
      setStep('otp')
    } catch (err) {
      console.error(err)
      setError('OTP পাঠাতে সমস্যা হয়েছে। নম্বরটি আবার চেক করুন।')
    }
    setLoading(false)
  }

  const verifyOtp = async () => {
    setError('')
    if (!otp.trim()) {
      setError('OTP কোড দিন')
      return
    }
    setLoading(true)
    try {
      await confirmationResult.confirm(otp.trim())
      navigate(redirectTo, { replace: true })
    } catch (err) {
      console.error(err)
      setError('ভুল OTP কোড। আবার চেষ্টা করুন।')
    }
    setLoading(false)
  }

  const loginWithGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      console.error(err)
      setError('Google লগইনে সমস্যা হয়েছে। আবার চেষ্টা করুন।')
    }
    setLoading(false)
  }

  return (
    <div className="page-content">
      <div className="text-center mt-8 mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">লগইন করুন</h1>
        <p className="text-sm text-slate-500">পরীক্ষা দিতে ও ফলাফল দেখতে লগইন করুন</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 text-center">{error}</div>
      )}

      <button
        onClick={loginWithGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 border border-slate-200 py-3.5 rounded-xl font-semibold text-slate-700 active:scale-95 transition disabled:opacity-60 mb-4"
      >
        <HiMail className="text-lg" /> Google দিয়ে লগইন করুন
      </button>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400">মোবাইল নম্বর দিয়ে লগইন শীঘ্রই আসছে</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {step === 'phone' && (
        <div className="card p-5 mb-4 opacity-50 pointer-events-none">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">মোবাইল নম্বর</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="০১৭xxxxxxxx"
            className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 mb-4"
            disabled
          />
          <button
            onClick={sendOtp}
            disabled
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <HiPhone /> OTP পাঠান
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div className="card p-5 mb-4">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            OTP কোড দিন (পাঠানো হয়েছে {phone})
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="৬ ডিজিট কোড"
            className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 mb-4 tracking-widest text-center text-lg"
          />
          <button
            onClick={verifyOtp}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? 'যাচাই হচ্ছে...' : 'যাচাই করুন'}
          </button>
          <button onClick={() => setStep('phone')} className="w-full mt-2 text-sm text-slate-400">
            নম্বর পরিবর্তন করুন
          </button>
        </div>
      )}

      <div id="recaptcha-container"></div>
    </div>
  )
}

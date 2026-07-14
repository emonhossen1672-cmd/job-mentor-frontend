import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiUser,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiAcademicCap,
  HiPencil,
  HiLogout,
  HiCog,
  HiBell,
  HiShieldCheck,
  HiStar,
  HiFire,
  HiCheckCircle,
  HiX,
} from 'react-icons/hi'
import PageHeader from '../components/PageHeader.jsx'

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState({
    name: 'রাহুল আহমেদ',
    email: 'rahul.ahmed@example.com',
    phone: '০১৭১২৩৪৫৬৭৮',
    location: 'ঢাকা, বাংলাদেশ',
    education: 'স্নাতক (বিএসসি)',
    target: 'BCS প্রশাসন',
  })

  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState(profile)
  const [activeMenu, setActiveMenu] = useState(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleSave = () => {
    setProfile(formData)
    setEditing(false)
  }

  const handleCancel = () => {
    setFormData(profile)
    setEditing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('jobMentorToken')
    setShowLogoutConfirm(false)
    navigate('/')
  }

  const stats = [
    { label: 'পরীক্ষা দেওয়া', value: '৪৮', icon: HiCheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'সঠিক উত্তর', value: '৩৮৫', icon: HiStar, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'ধারাবাহিকতা', value: '১২ দিন', icon: HiFire, color: 'text-orange-500', bg: 'bg-orange-50' },
  ]

  const menuItems = [
    { icon: HiBell, label: 'নোটিফিকেশন', color: 'text-blue-500' },
    { icon: HiShieldCheck, label: 'প্রাইভেসি', color: 'text-emerald-500' },
    { icon: HiCog, label: 'সেটিংস', color: 'text-slate-500' },
  ]

  return (
    <div>
      <PageHeader title="প্রোফাইল" subtitle="আপনার তথ্য" />

      <div className="page-content">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center mb-6 animate-slide-up">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <HiUser className="text-4xl text-white" />
            </div>
            <button
              onClick={() => setEditing(true)}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md hover:bg-brand-50 active:scale-90 transition-all"
            >
              <HiPencil className="text-sm text-brand-600" />
            </button>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-3">{profile.name}</h2>
          <p className="text-sm text-slate-400">{profile.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="card p-3 text-center animate-slide-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-1.5`}>
                  <Icon className={`text-lg ${stat.color}`} />
                </div>
                <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                <p className="text-[10px] text-slate-400">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Profile Info / Edit Form */}
        {editing ? (
          <div className="card p-5 mb-4 animate-slide-up">
            <h3 className="font-semibold text-slate-800 mb-4">তথ্য সম্পাদনা</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">নাম</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">ইমেইল</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">ফোন</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">অবস্থান</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">শিক্ষাগত যোগ্যতা</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">লক্ষ্য</label>
                <input
                  type="text"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} className="btn-primary flex-1 text-sm">
                সংরক্ষণ করুন
              </button>
              <button onClick={handleCancel} className="btn-secondary flex-1 text-sm">
                বাতিল
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-5 mb-4 animate-slide-up">
            <h3 className="font-semibold text-slate-800 mb-4">ব্যক্তিগত তথ্য</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <HiMail className="text-lg text-brand-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">ইমেইল</p>
                  <p className="text-sm font-medium text-slate-700">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <HiPhone className="text-lg text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">ফোন</p>
                  <p className="text-sm font-medium text-slate-700">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <HiLocationMarker className="text-lg text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">অবস্থান</p>
                  <p className="text-sm font-medium text-slate-700">{profile.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <HiAcademicCap className="text-lg text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">শিক্ষা</p>
                  <p className="text-sm font-medium text-slate-700">{profile.education}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                  <HiStar className="text-lg text-rose-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">লক্ষ্য</p>
                  <p className="text-sm font-medium text-slate-700">{profile.target}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="card overflow-hidden mb-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => setActiveMenu(activeMenu === item.label ? null : item.label)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 active:bg-slate-100 transition-all ${
                  idx !== menuItems.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <Icon className={`text-xl ${item.color}`} />
                <span className="text-sm font-medium text-slate-700 flex-1 text-left">{item.label}</span>
                <span className="text-slate-300">›</span>
              </button>
            )
          })}
        </div>
        {activeMenu && (
          <div className="flex items-center justify-between p-3 mb-4 rounded-xl bg-brand-50 animate-slide-up">
            <p className="text-xs text-brand-700 font-medium">{activeMenu} ফিচারটি শীঘ্রই আসছে</p>
            <button onClick={() => setActiveMenu(null)} className="p-1 text-brand-400 hover:text-brand-600">
              <HiX className="text-base" />
            </button>
          </div>
        )}

        {/* Logout */}
        {showLogoutConfirm ? (
          <div className="card p-4 mb-4 animate-slide-up">
            <p className="text-sm font-medium text-slate-700 mb-3 text-center">আপনি কি নিশ্চিতভাবে লগআউট করতে চান?</p>
            <div className="flex gap-3">
              <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 p-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 active:scale-95 transition-all text-sm">
                <HiLogout /> হ্যাঁ, লগআউট
              </button>
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 btn-secondary text-sm">
                বাতিল
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-500 font-semibold rounded-2xl hover:bg-red-100 active:scale-95 transition-all"
          >
            <HiLogout className="text-lg" />
            লগআউট
          </button>
        )}

        <p className="text-center text-xs text-slate-300 mt-6">Job Mentor v১.০.০</p>
      </div>
    </div>
  )
}

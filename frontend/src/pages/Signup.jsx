import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Signup() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { signup } = useAuth()
    const navigate = useNavigate()

    const validate = () => {
        const errs = {}
        if (!name.trim()) errs.name = 'Full name is required'
        if (!email.trim()) errs.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email'
        if (!password) errs.password = 'Password is required'
        else if (password.length < 6) errs.password = 'Password must be at least 6 characters'
        if (!confirmPassword) errs.confirmPassword = 'Please confirm your password'
        else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        const success = await signup(name, email, password)
        setLoading(false)
        if (success) navigate('/dashboard')
    }

    const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
    const strengthLabel = ['', 'Weak', 'Good', 'Strong'][strength]
    const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'][strength]

    return (
        <div className="relative flex min-h-[calc(100vh-64px)] overflow-x-hidden">

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-blue-700/8 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-700/6 rounded-full blur-3xl" />
            </div>

            <div className="flex-1 flex items-center justify-center p-6 py-14">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">

                    {/* Left — benefits */}
                    <div className="hidden lg:flex lg:col-span-2 flex-col gap-6 pt-4">
                        <div>
                            <div className="badge badge-blue mb-4">Free Account</div>
                            <h1 className="text-4xl font-black text-white leading-tight">
                                Start verifying<br />
                                devices with <span className="gradient-text">AI</span>
                            </h1>
                            <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                                Create your account and get instant access to YOLOv8-powered damage detection, severity scoring, and price recommendations.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { icon: 'cloud_upload', text: 'Upload up to 5 images per scan' },
                                { icon: 'bar_chart', text: 'Detailed severity score (0–10)' },
                                { icon: 'payments', text: 'AI-driven price recommendations' },
                                { icon: 'history', text: 'Unlimited report history' },
                            ].map(({ icon, text }) => (
                                <div key={text} className="flex items-center gap-3 text-sm text-slate-400">
                                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-blue-400" style={{ fontSize: '15px' }}>{icon}</span>
                                    </div>
                                    {text}
                                </div>
                            ))}
                        </div>

                        <div className="glass rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: '16px' }}>verified</span>
                                <span className="text-sm font-semibold text-white">No credit card required</span>
                            </div>
                            <p className="text-xs text-slate-500">Free to use. Your data is stored securely in your own database instance.</p>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="lg:col-span-3 w-full max-w-md mx-auto">
                        <div className="glass rounded-3xl p-8 md:p-10 gradient-border">
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-white">Create your account</h2>
                                <p className="text-slate-400 text-sm mt-1">Already have an account? <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Sign in</Link></p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                                {/* Full name */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Full name</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" style={{ fontSize: '18px' }}>person</span>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Jatin Upadhyay"
                                            className={`input-field pl-10 ${errors.name ? 'border-red-500/60' : ''}`}
                                            autoComplete="name"
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Email address</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" style={{ fontSize: '18px' }}>mail</span>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className={`input-field pl-10 ${errors.email ? 'border-red-500/60' : ''}`}
                                            autoComplete="email"
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" style={{ fontSize: '18px' }}>lock</span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="At least 6 characters"
                                            className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-500/60' : ''}`}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                                                {showPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </button>
                                    </div>
                                    {/* Strength bar */}
                                    {password.length > 0 && (
                                        <div className="mt-2">
                                            <div className="flex gap-1 h-1 mb-1">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-white/10'}`} />
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-slate-500">Password strength: <span className={strength === 1 ? 'text-red-400' : strength === 2 ? 'text-amber-400' : 'text-emerald-400'}>{strengthLabel}</span></p>
                                        </div>
                                    )}
                                    {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
                                </div>

                                {/* Confirm password */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Confirm password</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" style={{ fontSize: '18px' }}>lock</span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder="Repeat password"
                                            className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500/60' : ''}`}
                                            autoComplete="new-password"
                                        />
                                        {confirmPassword && password === confirmPassword && (
                                            <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400" style={{ fontSize: '18px' }}>check_circle</span>
                                        )}
                                    </div>
                                    {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword}</p>}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-3.5 text-base mt-2 justify-center"
                                >
                                    {loading ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <>
                                            Create Account
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="mt-6 text-center text-xs text-slate-500">
                                By creating an account, you agree to our{' '}
                                <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

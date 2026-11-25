import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { login } = useAuth()
    const navigate = useNavigate()

    const validate = () => {
        const errs = {}
        if (!email.trim()) errs.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email'
        if (!password) errs.password = 'Password is required'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        const success = await login(email, password)
        setLoading(false)
        if (success) navigate('/dashboard')
    }

    return (
        <div className="relative flex min-h-[calc(100vh-64px)] overflow-x-hidden">

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-700/8 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-700/6 rounded-full blur-3xl" />
            </div>

            <div className="flex-1 flex items-center justify-center p-6 py-14">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">

                    {/* Left — Feature highlight */}
                    <div className="hidden lg:flex lg:col-span-2 flex-col gap-6">
                        <div>
                            <div className="badge badge-blue mb-4">Secure Sign In</div>
                            <h1 className="text-4xl font-black text-white leading-tight">
                                Welcome back to<br />
                                <span className="gradient-text">TrustLens AI</span>
                            </h1>
                            <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                                Access your dashboard, review past scan reports, and continue analyzing devices with our AI pipeline.
                            </p>
                        </div>

                        {/* Features list */}
                        <div className="space-y-3">
                            {[
                                { icon: 'history', text: 'Full scan history preserved' },
                                { icon: 'shield', text: 'JWT-secured session' },
                                { icon: 'bolt', text: 'Instant analysis results' },
                            ].map(({ icon, text }) => (
                                <div key={text} className="flex items-center gap-3 text-sm text-slate-400">
                                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-blue-400" style={{ fontSize: '15px' }}>{icon}</span>
                                    </div>
                                    {text}
                                </div>
                            ))}
                        </div>

                        {/* Mini stat card */}
                        <div className="glass rounded-2xl p-5 mt-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white" style={{ fontSize: '16px' }}>lens_blur</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">TrustLens AI</p>
                                    <p className="text-sm font-bold text-white">Last Report</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center">
                                    <p className="text-xl font-black text-blue-400">7</p>
                                    <p className="text-[10px] text-slate-500">Severity</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-black text-amber-400">3</p>
                                    <p className="text-[10px] text-slate-500">Issues</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-black text-emerald-400">-40%</p>
                                    <p className="text-[10px] text-slate-500">Discount</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="lg:col-span-3 w-full max-w-md mx-auto">
                        <div className="glass rounded-3xl p-8 md:p-10 gradient-border">
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-white">Sign in to your account</h2>
                                <p className="text-slate-400 text-sm mt-1">Don't have an account? <Link to="/signup" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Create one free</Link></p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                                            className={`input-field pl-10 ${errors.email ? 'border-red-500/60 focus:ring-red-500/40' : ''}`}
                                            autoComplete="email"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>error</span>
                                            {errors.email}
                                        </p>
                                    )}
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
                                            placeholder="Enter your password"
                                            className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-500/60 focus:ring-red-500/40' : ''}`}
                                            autoComplete="current-password"
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
                                    {errors.password && (
                                        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>error</span>
                                            {errors.password}
                                        </p>
                                    )}
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
                                            Sign In
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-white/[0.07] text-center">
                                <p className="text-xs text-slate-500">
                                    New to TrustLens AI?{' '}
                                    <Link to="/signup" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                                        Create a free account →
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

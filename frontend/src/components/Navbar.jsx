import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Detect scroll for navbar background
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handler)
        return () => window.removeEventListener('scroll', handler)
    }, [])

    // Close mobile menu on route change
    useEffect(() => { setMobileOpen(false) }, [location.pathname])

    const scrollToSection = (id) => {
        setMobileOpen(false)
        if (location.pathname !== '/') {
            navigate('/')
            setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 350)
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const isActive = (path) => location.pathname === path

    return (
        <>
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-[#080c14]/95 backdrop-blur-xl border-b border-white/[0.07] shadow-xl shadow-black/40'
                    : 'bg-transparent border-b border-transparent'
            }`}>
                <div className="container-xl">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-shadow">
                                <span className="material-symbols-outlined text-white text-lg" style={{ fontSize: '18px' }}>lens_blur</span>
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">
                                Trust<span className="text-blue-400">Lens</span> <span className="text-slate-400 font-medium text-sm">AI</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className={`btn-ghost ${isActive('/dashboard') ? 'text-blue-400 bg-blue-500/10' : ''}`}
                                    >
                                        <span className="material-symbols-outlined text-base" style={{ fontSize: '16px' }}>grid_view</span>
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/upload"
                                        className={`btn-ghost ${isActive('/upload') ? 'text-blue-400 bg-blue-500/10' : ''}`}
                                    >
                                        <span className="material-symbols-outlined text-base" style={{ fontSize: '16px' }}>cloud_upload</span>
                                        New Scan
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => scrollToSection('features')} className="btn-ghost">Features</button>
                                    <button onClick={() => scrollToSection('workflow')} className="btn-ghost">How it works</button>
                                </>
                            )}
                        </div>

                        {/* Desktop Right */}
                        <div className="hidden md:flex items-center gap-3">
                            {isAuthenticated ? (
                                <>
                                    {/* User pill */}
                                    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <span className="text-sm font-medium text-slate-200 max-w-[100px] truncate">{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="btn-ghost text-slate-400 hover:text-red-400"
                                    >
                                        <span className="material-symbols-outlined text-base" style={{ fontSize: '16px' }}>logout</span>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn-ghost">Sign in</Link>
                                    <Link to="/signup" className="btn-primary text-sm py-2 px-5">
                                        Get Started
                                        <span className="material-symbols-outlined text-base" style={{ fontSize: '16px' }}>arrow_forward</span>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
                            aria-label="Toggle menu"
                        >
                            <span className="material-symbols-outlined">
                                {mobileOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMobileOpen(false)}
                />

                {/* Drawer panel */}
                <div className={`absolute top-0 right-0 h-full w-72 bg-[#0d1420] border-l border-white/[0.08] shadow-2xl transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/[0.08]">
                            <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white" style={{ fontSize: '16px' }}>lens_blur</span>
                                </div>
                                <span className="font-bold text-white">TrustLens AI</span>
                            </Link>
                            <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        {/* Nav links */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-1">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive('/dashboard') ? 'bg-blue-500/10 text-blue-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                                        <span className="material-symbols-outlined text-lg">grid_view</span>
                                        Dashboard
                                    </Link>
                                    <Link to="/upload" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive('/upload') ? 'bg-blue-500/10 text-blue-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                                        <span className="material-symbols-outlined text-lg">cloud_upload</span>
                                        New Scan
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => scrollToSection('features')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
                                        <span className="material-symbols-outlined text-lg">auto_awesome</span>
                                        Features
                                    </button>
                                    <button onClick={() => scrollToSection('workflow')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
                                        <span className="material-symbols-outlined text-lg">schema</span>
                                        How it works
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Footer actions */}
                        <div className="p-5 border-t border-white/[0.08] space-y-3">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                                            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { handleLogout(); setMobileOpen(false) }}
                                        className="w-full flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-base">logout</span>
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full btn-secondary text-center justify-center">
                                        Sign in
                                    </Link>
                                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="w-full btn-primary text-center justify-center">
                                        Get Started Free
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

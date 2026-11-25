import { Link } from 'react-router-dom'

const features = [
    {
        icon: 'manage_search',
        title: 'Precision Damage Detection',
        desc: 'YOLOv8 deep-learning model identifies cracks, scratches, and stains with pixel-level accuracy across any device type.',
        color: 'from-blue-600/20 to-blue-500/5',
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-500/10',
    },
    {
        icon: 'monitoring',
        title: 'Severity Scoring 0–10',
        desc: 'Area-weighted class scoring assigns an objective damage grade — from cosmetic wear to critical structural compromise.',
        color: 'from-cyan-600/20 to-cyan-500/5',
        iconColor: 'text-cyan-400',
        iconBg: 'bg-cyan-500/10',
    },
    {
        icon: 'currency_rupee',
        title: 'Smart Price Valuation',
        desc: 'AI-driven resale pricing with 5 graduated discount tiers mapped to real-world market depreciation curves.',
        color: 'from-indigo-600/20 to-indigo-500/5',
        iconColor: 'text-indigo-400',
        iconBg: 'bg-indigo-500/10',
    },
    {
        icon: 'history_edu',
        title: 'Detailed Report History',
        desc: 'Every analysis is saved to your account. Build a complete condition history for every device in your inventory.',
        color: 'from-violet-600/20 to-violet-500/5',
        iconColor: 'text-violet-400',
        iconBg: 'bg-violet-500/10',
    },
]

const steps = [
    { n: '01', icon: 'cloud_upload',          title: 'Upload Photos',      desc: 'Drop up to 5 device images from any angle for comprehensive coverage.' },
    { n: '02', icon: 'precision_manufacturing', title: 'AI Scans',          desc: 'YOLOv8 detects every crack, scratch, and stain with bounding-box precision.' },
    { n: '03', icon: 'bar_chart',              title: 'Severity Scored',    desc: 'Each detection is weighted by type and area to produce a 0–10 grade.' },
    { n: '04', icon: 'verified',               title: 'Price Recommended',  desc: 'Receive a fair resale price and a full condition report instantly.' },
]

const stats = [
    { value: '3+', label: 'Damage Classes', sub: 'crack · scratch · stain' },
    { value: '0–10', label: 'Severity Scale', sub: 'area-weighted scoring' },
    { value: '5×', label: 'Price Tiers', sub: 'up to 55% discount' },
    { value: '<2s', label: 'Analysis Time', sub: 'per image batch' },
]

export default function Landing() {
    return (
        <div className="relative flex flex-col min-h-screen overflow-x-hidden">

            {/* ===== BACKGROUND GLOWS ===== */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-700/10 rounded-full blur-3xl" />
                <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-cyan-700/8 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-700/8 rounded-full blur-3xl" />
            </div>

            {/* ===== HERO ===== */}
            <section className="pt-20 pb-24 md:pt-28 md:pb-32">
                <div className="container-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

                        {/* Left — Copy */}
                        <div className="flex flex-col gap-7 order-2 lg:order-1 animate-fade-in">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                YOLOv8 · Deep Learning · Real-time
                            </div>

                            <div>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.07] tracking-tight text-white">
                                    AI-Powered<br />
                                    <span className="gradient-text">Product Diagnostics</span>
                                </h1>
                                <p className="mt-5 text-slate-400 text-lg md:text-xl leading-relaxed max-w-[500px]">
                                    Instantly detect damage, score severity, and get a fair resale price — all in under 2 seconds.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-1">
                                <Link to="/signup" className="btn-primary text-base py-3.5 px-8">
                                    Start Free Scan
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                                <Link to="/login" className="btn-secondary text-base py-3.5 px-8">
                                    Sign In
                                </Link>
                            </div>

                            {/* Trust strip */}
                            <div className="flex items-center gap-6 pt-2">
                                {[
                                    { icon: 'shield', text: 'Secure' },
                                    { icon: 'bolt', text: 'Instant Results' },
                                    { icon: 'cloud_off', text: 'No Credit Card' },
                                ].map(({ icon, text }) => (
                                    <div key={text} className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                        <span className="material-symbols-outlined text-slate-600" style={{ fontSize: '15px' }}>{icon}</span>
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — Visual */}
                        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-[420px]">
                                {/* Glow behind card */}
                                <div className="absolute inset-0 bg-blue-600/20 rounded-3xl blur-2xl scale-105" />

                                {/* Main card */}
                                <div className="relative glass rounded-3xl p-6 gradient-border">
                                    {/* Scan header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white" style={{ fontSize: '18px' }}>lens_blur</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">TrustLens AI</p>
                                            <p className="text-sm font-bold text-white">Damage Analysis</p>
                                        </div>
                                        <div className="ml-auto flex items-center gap-1 text-xs text-emerald-400 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            Live
                                        </div>
                                    </div>

                                    {/* Device preview area */}
                                    <div className="relative w-full h-52 bg-surface-100 rounded-2xl overflow-hidden border border-white/5 mb-4">
                                        {/* Simulated device */}
                                        <div className="absolute inset-4 bg-surface-200 rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined text-5xl text-slate-600">smartphone</span>
                                        </div>

                                        {/* Scan line */}
                                        <div className="scan-line absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 shadow-[0_0_12px_3px_rgba(6,182,212,0.6)]" />

                                        {/* Detection boxes */}
                                        <div className="absolute top-8 left-8 w-16 h-10 border-2 border-red-500 rounded">
                                            <span className="absolute -top-5 left-0 text-[9px] font-bold text-red-400 bg-red-500/20 px-1 rounded whitespace-nowrap">crack 94%</span>
                                        </div>
                                        <div className="absolute bottom-10 right-10 w-20 h-8 border-2 border-amber-500 rounded">
                                            <span className="absolute -top-5 left-0 text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1 rounded whitespace-nowrap">scratch 88%</span>
                                        </div>
                                    </div>

                                    {/* Results */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-surface-100 rounded-xl p-3 text-center">
                                            <p className="text-lg font-black text-red-400">6</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Severity</p>
                                        </div>
                                        <div className="bg-surface-100 rounded-xl p-3 text-center">
                                            <p className="text-lg font-black text-amber-400">2</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Detections</p>
                                        </div>
                                        <div className="bg-surface-100 rounded-xl p-3 text-center">
                                            <p className="text-lg font-black text-blue-400">₹9k</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Suggested</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating badge */}
                                <div className="absolute -top-4 -right-4 glass rounded-xl px-3 py-2 flex items-center gap-2 border border-emerald-500/20 float-anim">
                                    <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: '14px' }}>check_circle</span>
                                    <span className="text-xs font-semibold text-emerald-400">Analysis complete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== STATS STRIP ===== */}
            <section className="py-12 border-y border-white/[0.05]">
                <div className="container-xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map(({ value, label, sub }) => (
                            <div key={label} className="text-center">
                                <p className="text-3xl md:text-4xl font-black gradient-text">{value}</p>
                                <p className="text-sm font-semibold text-slate-300 mt-1">{label}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section id="features" className="py-24">
                <div className="container-xl">
                    <div className="text-center mb-14">
                        <div className="badge badge-blue mb-4">Product Capabilities</div>
                        <h2 className="text-4xl md:text-5xl font-black text-white">
                            Everything you need to <span className="gradient-text">verify products</span>
                        </h2>
                        <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
                            One platform for damage detection, severity grading, and price recommendation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {features.map(({ icon, title, desc, iconColor, iconBg, color }) => (
                            <div key={title} className={`relative glass rounded-2xl p-6 overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
                                {/* Background gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-50 group-hover:opacity-80 transition-opacity`} />
                                <div className="relative z-10">
                                    <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
                                        <span className={`material-symbols-outlined ${iconColor}`} style={{ fontSize: '20px' }}>{icon}</span>
                                    </div>
                                    <h3 className="font-bold text-white mb-2 text-base">{title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== WORKFLOW ===== */}
            <section id="workflow" className="py-24 bg-surface-50/30">
                <div className="container-xl">
                    <div className="text-center mb-14">
                        <div className="badge badge-blue mb-4">The Process</div>
                        <h2 className="text-4xl md:text-5xl font-black text-white">
                            From upload to report <span className="gradient-text">in seconds</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                        {/* Connector line (desktop) */}
                        <div className="absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent hidden lg:block" />

                        {steps.map(({ n, icon, title, desc }) => (
                            <div key={n} className="relative flex flex-col items-center text-center">
                                {/* Step number & icon */}
                                <div className="relative mb-5">
                                    <div className="w-16 h-16 rounded-2xl bg-surface-100 border border-white/[0.08] flex items-center justify-center shadow-lg shadow-black/40">
                                        <span className="material-symbols-outlined text-blue-400" style={{ fontSize: '28px' }}>{icon}</span>
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                        <span className="text-[9px] font-black text-white">{n}</span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-white mb-2">{title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="py-24">
                <div className="container-xl">
                    <div className="relative glass rounded-3xl p-10 md:p-16 text-center overflow-hidden gradient-border">
                        {/* Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-transparent to-cyan-600/10 pointer-events-none" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <div className="badge badge-blue mb-5">Free to Use</div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                                Start verifying products <span className="gradient-text">today</span>
                            </h2>
                            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
                                Join repair networks and resellers who rely on TrustLens AI for objective, AI-backed condition verification.
                            </p>
                            <Link to="/signup" className="btn-primary text-base py-4 px-10 shadow-glow-blue">
                                Create Free Account
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-white/[0.06] py-12">
                <div className="container-xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
                        {/* Brand */}
                        <div className="col-span-2 md:col-span-1">
                            <Link to="/" className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white" style={{ fontSize: '15px' }}>lens_blur</span>
                                </div>
                                <span className="font-bold text-white text-sm">TrustLens AI</span>
                            </Link>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                AI-powered device condition verification using YOLOv8 computer vision.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Product</h4>
                            <ul className="space-y-2.5 text-slate-500 text-xs">
                                <li><Link to="/signup" className="hover:text-blue-400 transition-colors">Damage Scanner</Link></li>
                                <li><Link to="/signup" className="hover:text-blue-400 transition-colors">Severity Grading</Link></li>
                                <li><Link to="/signup" className="hover:text-blue-400 transition-colors">Price Reports</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Company</h4>
                            <ul className="space-y-2.5 text-slate-500 text-xs">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">GitHub</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Legal</h4>
                            <ul className="space-y-2.5 text-slate-500 text-xs">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-slate-600 text-xs">© 2026 TrustLens AI. All rights reserved.</p>
                        <p className="text-slate-600 text-xs">Powered by YOLOv8 · FastAPI · React</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

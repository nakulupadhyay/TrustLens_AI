import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

function getSeverityMeta(s) {
    if (s === 0) return { badge: 'badge-blue', label: 'No Damage', barColor: 'bg-blue-500', icon: 'check_circle' }
    if (s <= 2) return { badge: 'badge-green', label: 'Minor', barColor: 'bg-emerald-500', icon: 'check_circle' }
    if (s <= 5) return { badge: 'badge-yellow', label: 'Moderate', barColor: 'bg-amber-500', icon: 'warning' }
    if (s <= 7) return { badge: 'badge-red', label: 'Severe', barColor: 'bg-orange-500', icon: 'report' }
    return { badge: 'badge-red', label: 'Critical', barColor: 'bg-red-600', icon: 'dangerous' }
}

export default function Dashboard() {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => { fetchReports() }, [])

    const fetchReports = async () => {
        try {
            const res = await api.get('/reports')
            setReports(res.data)
        } catch (err) {
            console.error('Failed to fetch reports', err)
        } finally {
            setLoading(false)
        }
    }

    const avgSeverity = reports.length > 0
        ? (reports.reduce((a, r) => a + r.severity, 0) / reports.length).toFixed(1)
        : '—'

    const totalImages = reports.reduce((a, r) => a + (r.image_urls?.length || 0), 0)
    const totalValue = reports.reduce((a, r) => a + ((r.final_price ?? r.recommended_price) || 0), 0)

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading your reports..." />
            </div>
        )
    }

    return (
        <div className="relative min-h-[calc(100vh-64px)]">

            {/* Background glows */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-blue-700/8 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-700/5 rounded-full blur-3xl" />
            </div>

            <div className="container-xl py-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <span className="text-slate-400 text-sm font-medium">Welcome back, <span className="text-white font-semibold">{user?.name}</span></span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Dashboard</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {reports.length > 0
                                ? `${reports.length} scan${reports.length > 1 ? 's' : ''} completed — keep verifying devices`
                                : 'Get started by uploading your first device image'}
                        </p>
                    </div>
                    <Link to="/upload" className="btn-primary py-3 px-6 flex-shrink-0">
                        <span className="material-symbols-outlined">add_circle</span>
                        New Scan
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                        {
                            icon: 'description',
                            label: 'Total Reports',
                            value: reports.length,
                            iconBg: 'bg-blue-500/10',
                            iconColor: 'text-blue-400',
                            sub: reports.length === 1 ? '1 analysis done' : `${reports.length} analyses done`,
                        },
                        {
                            icon: 'health_and_safety',
                            label: 'Avg Severity',
                            value: avgSeverity,
                            iconBg: 'bg-amber-500/10',
                            iconColor: 'text-amber-400',
                            sub: 'out of 10',
                        },
                        {
                            icon: 'photo_library',
                            label: 'Images Scanned',
                            value: totalImages,
                            iconBg: 'bg-cyan-500/10',
                            iconColor: 'text-cyan-400',
                            sub: 'across all reports',
                        },
                        {
                            icon: 'currency_rupee',
                            label: 'Total Value',
                            value: `₹${totalValue.toLocaleString()}`,
                            iconBg: 'bg-emerald-500/10',
                            iconColor: 'text-emerald-400',
                            sub: 'recommended prices',
                        },
                    ].map(({ icon, label, value, iconBg, iconColor, sub }) => (
                        <div key={label} className="glass rounded-2xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
                                    <span className={`material-symbols-outlined ${iconColor}`} style={{ fontSize: '18px' }}>{icon}</span>
                                </div>
                            </div>
                            <p className="text-2xl font-black text-white">{value}</p>
                            <p className="text-sm font-semibold text-slate-300 mt-0.5">{label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                        </div>
                    ))}
                </div>

                {/* Reports Section */}
                {reports.length === 0 ? (
                    /* Empty state */
                    <div className="glass rounded-3xl p-16 text-center gradient-border">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5">
                            <span className="material-symbols-outlined text-blue-400 text-4xl">image_search</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No scans yet</h3>
                        <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
                            Upload your first device photo to get an instant AI-powered damage assessment and price recommendation.
                        </p>
                        <Link to="/upload" className="btn-primary py-3 px-7">
                            <span className="material-symbols-outlined">cloud_upload</span>
                            Upload First Image
                        </Link>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-400" style={{ fontSize: '20px' }}>history</span>
                                Scan History
                            </h2>
                            <span className="badge badge-blue">{reports.length} reports</span>
                        </div>

                        <div className="space-y-3">
                            {reports.map((report) => {
                                const meta = getSeverityMeta(report.severity)
                                return (
                                    <Link
                                        key={report.id}
                                        to={`/report/${report.id}`}
                                        className="glass-hover rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 group block"
                                    >
                                        {/* Thumbnail */}
                                        <div className="w-14 h-14 rounded-xl bg-surface-200 overflow-hidden flex-shrink-0 border border-white/[0.07]">
                                            {report.image_urls?.[0] ? (
                                                <img src={report.image_urls[0]} alt="Device" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-slate-600 text-2xl">image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                                <span className="font-bold text-white text-sm">Report #{report.id}</span>
                                                {(report.brand || report.model_name) && (
                                                    <span className="text-xs text-surface-400 bg-surface-700/50 px-2 py-0.5 rounded-full">
                                                        {[report.brand, report.model_name].filter(Boolean).join(' ')}
                                                        {report.storage_capacity && ` · ${report.storage_capacity}`}
                                                    </span>
                                                )}
                                                <span className={`badge ${meta.badge}`}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>{meta.icon}</span>
                                                    {meta.label} · {report.severity}/10
                                                </span>
                                                {report.image_urls?.length > 1 && (
                                                    <span className="text-xs text-slate-500">+{report.image_urls.length} images</span>
                                                )}
                                            </div>
                                            <p className="text-slate-400 text-xs truncate leading-relaxed">{report.explanation}</p>

                                            {/* Severity bar */}
                                            <div className="mt-2.5 flex items-center gap-2">
                                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${meta.barColor} transition-all`}
                                                        style={{ width: `${report.severity * 10}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-slate-500 flex-shrink-0">{report.severity}/10</span>
                                            </div>
                                        </div>

                                        {/* Price + date */}
                                        <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5 flex-shrink-0">
                                            <div className="font-black text-blue-400 text-lg flex items-center gap-0.5">
                                                <span className="text-sm font-bold">₹</span>
                                                {(report.final_price ?? report.recommended_price)?.toLocaleString('en-IN')}
                                            </div>
                                            <span className="text-slate-500 text-xs">
                                                {report.created_at ? new Date(report.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                                            </span>
                                        </div>

                                        {/* Arrow */}
                                        <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 group-hover:bg-blue-500/20 group-hover:text-blue-400 text-slate-500 transition-all">
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

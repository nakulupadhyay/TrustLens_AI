import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

function getSeverityMeta(s) {
    if (s === 0) return { badge: 'badge-blue', label: 'No Damage', barColor: 'bg-blue-500', textColor: 'text-blue-400', glow: 'shadow-blue-500/30', icon: 'check_circle' }
    if (s <= 2) return { badge: 'badge-green', label: 'Minor Damage', barColor: 'bg-emerald-500', textColor: 'text-emerald-400', glow: 'shadow-emerald-500/30', icon: 'check_circle' }
    if (s <= 4) return { badge: 'badge-yellow', label: 'Moderate Damage', barColor: 'bg-amber-500', textColor: 'text-amber-400', glow: 'shadow-amber-500/30', icon: 'warning' }
    if (s <= 7) return { badge: 'badge-red', label: 'Severe Damage', barColor: 'bg-orange-500', textColor: 'text-orange-400', glow: 'shadow-orange-500/30', icon: 'report' }
    return { badge: 'badge-red', label: 'Critical Damage', barColor: 'bg-red-600', textColor: 'text-red-400', glow: 'shadow-red-600/30', icon: 'dangerous' }
}

const DETECTION_COLORS = {
    crack: '#ef4444', scratch: '#f59e0b', stain: '#8b5cf6',
    dent: '#3b82f6', chip: '#ec4899', broken_screen: '#dc2626',
    water_damage: '#06b6d4', bent_frame: '#f97316',
}

function BoundingBoxCanvas({ src, detections }) {
    const canvasRef = useRef(null)
    const imgRef = useRef(null)

    useEffect(() => {
        const img = imgRef.current
        const canvas = canvasRef.current
        if (!img || !canvas) return
        const draw = () => {
            const ctx = canvas.getContext('2d')
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            ctx.drawImage(img, 0, 0)
            detections?.forEach((det) => {
                const [x1, y1, x2, y2] = det.bbox
                const w = x2 - x1, h = y2 - y1
                const color = DETECTION_COLORS[det.label] || '#2563eb'
                const label = `${det.label.replace(/_/g, ' ')} ${Math.round(det.confidence * 100)}%`
                ctx.shadowColor = color; ctx.shadowBlur = 12
                ctx.strokeStyle = color; ctx.lineWidth = Math.max(2, canvas.width / 300)
                ctx.strokeRect(x1, y1, w, h); ctx.shadowBlur = 0
                ctx.font = `bold ${Math.max(12, canvas.width / 60)}px Inter, sans-serif`
                const metrics = ctx.measureText(label)
                const lh = Math.max(18, canvas.width / 50), pad = 6
                ctx.fillStyle = color + 'cc'
                ctx.beginPath()
                if (ctx.roundRect) ctx.roundRect(x1, Math.max(0, y1 - lh - pad * 2), metrics.width + pad * 2, lh + pad * 2, 4)
                else ctx.rect(x1, Math.max(0, y1 - lh - pad * 2), metrics.width + pad * 2, lh + pad * 2)
                ctx.fill()
                ctx.fillStyle = '#ffffff'
                ctx.fillText(label, x1 + pad, Math.max(lh, y1 - pad))
            })
        }
        if (img.complete && img.naturalWidth > 0) draw()
        else img.onload = draw
    }, [src, detections])

    return (
        <div className="relative rounded-xl overflow-hidden bg-surface-100 border border-white/[0.07]">
            <img ref={imgRef} src={src} alt="Device scan" className="hidden" crossOrigin="anonymous" />
            <canvas ref={canvasRef} className="w-full h-auto block" />
        </div>
    )
}

/* ── Price Breakdown Bar ── */
function PriceBreakdownCard({ report }) {
    const bp = report.price_breakdown
    if (!bp) return null

    const base = bp.base_price
    const steps = bp.steps || []
    const final = bp.final_price ?? report.final_price ?? report.recommended_price

    const stepColors = [
        { bar: 'bg-purple-500', text: 'text-purple-400', icon: '📅' },
        { bar: 'bg-orange-500', text: 'text-orange-400', icon: '🔍' },
        { bar: 'bg-amber-500', text: 'text-amber-400', icon: '🔋' },
        { bar: 'bg-red-500', text: 'text-red-400', icon: '🔧' },
        { bar: 'bg-blue-500', text: 'text-blue-400', icon: '📊' },
    ]

    const totalDeductionPct = ((base - final) / base * 100).toFixed(1)
    const retainedPct = (final / base * 100).toFixed(1)

    return (
        <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-cyan" style={{ fontSize: '18px' }}>calculate</span>
                Price Breakdown
            </h3>

            {/* Summary banner */}
            <div className="rounded-xl bg-gradient-to-r from-brand-blue/20 to-brand-cyan/10 border border-brand-blue/30 p-4 mb-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <p className="text-surface-400 text-xs mb-1">Original Price</p>
                        <p className="text-white text-xl font-bold">₹{base?.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-surface-400 text-2xl font-light">→</div>
                    <div className="text-right">
                        <p className="text-surface-400 text-xs mb-1">Estimated Resale</p>
                        <p className="text-brand-cyan text-2xl font-black">₹{final?.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                {/* Visual retained bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-surface-500 mb-1">
                        <span>Value retained: <span className="text-green-400 font-semibold">{retainedPct}%</span></span>
                        <span>Total deduction: <span className="text-red-400 font-semibold">{totalDeductionPct}%</span></span>
                    </div>
                    <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan rounded-full transition-all duration-1000"
                            style={{ width: `${retainedPct}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Step-by-step table */}
            <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-surface-700">
                    <span className="text-surface-400 text-xs font-semibold uppercase tracking-wider">Step</span>
                    <span className="text-surface-400 text-xs font-semibold uppercase tracking-wider">Deduction</span>
                    <span className="text-surface-400 text-xs font-semibold uppercase tracking-wider">Price After</span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                    <span className="text-surface-300 text-sm flex items-center gap-2">
                        <span>🏷️</span> Original Price
                    </span>
                    <span className="text-surface-500 text-sm">—</span>
                    <span className="text-white font-semibold text-sm">₹{base?.toLocaleString('en-IN')}</span>
                </div>

                {steps.map((s, i) => {
                    const c = stepColors[i] || stepColors[0]
                    const isBonus = s.deduction_pct < 0
                    const isZero = s.deduction_pct === 0
                    const pctStr = isZero ? '0%' : isBonus
                        ? `+${Math.abs(s.deduction_pct).toFixed(1)}%`
                        : `−${s.deduction_pct.toFixed(1)}%`
                    return (
                        <div key={i} className="rounded-lg bg-surface-800/50 p-3">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm text-white flex items-center gap-2 font-medium">
                                    <span>{c.icon}</span> {s.label}
                                </span>
                                <div className="flex items-center gap-4">
                                    <span className={`text-sm font-bold ${isBonus ? 'text-green-400' : isZero ? 'text-surface-500' : 'text-red-400'}`}>
                                        {pctStr}
                                    </span>
                                    <span className="text-sm font-semibold text-white w-24 text-right">
                                        ₹{s.price_after?.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                            {!isZero && (
                                <div className="h-1 bg-surface-700 rounded-full overflow-hidden mt-2">
                                    <div
                                        className={`h-full ${c.bar} rounded-full`}
                                        style={{ width: `${Math.min(Math.abs(s.deduction_pct), 100)}%` }}
                                    />
                                </div>
                            )}
                            <p className="text-xs text-surface-500 mt-1.5">{s.note}</p>
                        </div>
                    )
                })}

                {/* Final */}
                <div className="flex items-center justify-between py-3 border-t border-brand-blue/30 mt-2">
                    <span className="text-white font-bold text-sm flex items-center gap-2">
                        <span>✅</span> Final Resale Price
                    </span>
                    <span />
                    <span className="text-brand-cyan font-black text-lg">₹{final?.toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
    )
}

/* ── Phone Details Card ── */
function PhoneDetailsCard({ report }) {
    const hasDetails = report.brand || report.model_name || report.storage_capacity || report.purchase_date || report.battery_health != null
    if (!hasDetails) return null

    const rows = [
        { label: 'Brand', value: report.brand, icon: '🏢' },
        { label: 'Model', value: report.model_name, icon: '📱' },
        { label: 'Storage', value: report.storage_capacity, icon: '💾' },
        { label: 'Purchase Date', value: report.purchase_date, icon: '📅' },
        { label: 'Phone Age', value: report.phone_age_years != null ? `${report.phone_age_years.toFixed(1)} years` : null, icon: '⏱️' },
        { label: 'Battery Health', value: report.battery_health != null ? `${report.battery_health}% (user-reported)` : null, icon: '🔋' },
    ].filter(r => r.value)

    const brokenIssues = report.functional_issues
        ? Object.entries(report.functional_issues).filter(([, v]) => v).map(([k]) => k)
        : []

    const issueLabels = {
        touchscreen: 'Touchscreen', display: 'Display', front_camera: 'Front Camera',
        rear_camera: 'Rear Camera', speaker: 'Speaker', microphone: 'Microphone',
        charging_port: 'Charging Port', buttons: 'Buttons', wifi_network: 'Wi-Fi/Network',
        biometrics: 'Biometrics',
    }

    return (
        <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-blue" style={{ fontSize: '18px' }}>smartphone</span>
                Phone Details
            </h3>
            <div className="space-y-2.5">
                {rows.map(r => (
                    <div key={r.label} className="flex items-center justify-between">
                        <span className="text-surface-500 text-sm flex items-center gap-1.5">
                            <span>{r.icon}</span> {r.label}
                        </span>
                        <span className="text-white text-sm font-medium">{r.value}</span>
                    </div>
                ))}
            </div>
            {brokenIssues.length > 0 && (
                <div className="mt-4 pt-4 border-t border-surface-700">
                    <p className="text-surface-500 text-xs mb-2">Reported Functional Issues</p>
                    <div className="flex flex-wrap gap-1.5">
                        {brokenIssues.map(k => (
                            <span key={k} className="text-xs bg-red-900/40 text-red-300 border border-red-700/30 px-2 py-0.5 rounded-full">
                                {issueLabels[k] || k}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

/* ── Main Component ── */
export default function AnalysisResult() {
    const { id } = useParams()
    const location = useLocation()
    const [report, setReport] = useState(location.state || null)
    const [loading, setLoading] = useState(!location.state)
    const [activeImage, setActiveImage] = useState(0)

    useEffect(() => {
        if (!location.state) fetchReport()
    }, [id])

    const fetchReport = async () => {
        try {
            const res = await api.get(`/report/${id}`)
            setReport(res.data)
        } catch (err) {
            console.error('Failed to fetch report', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading analysis report..." />
        </div>
    )

    if (!report) return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
            <div className="glass rounded-3xl p-14 text-center max-w-md gradient-border">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
                    <span className="material-symbols-outlined text-red-400" style={{ fontSize: '32px' }}>error</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-3">Report Not Found</h2>
                <p className="text-surface-400 text-sm mb-6">This report may have been deleted or the link is invalid.</p>
                <Link to="/dashboard" className="btn-primary px-6 py-2.5 inline-block">← Back to Dashboard</Link>
            </div>
        </div>
    )

    const meta = getSeverityMeta(report.severity)
    const finalPrice = report.final_price ?? report.recommended_price
    const detectionCounts = {}
    report.detections?.forEach(d => { detectionCounts[d.label] = (detectionCounts[d.label] || 0) + 1 })

    return (
        <div className="min-h-screen bg-brand-dark py-8 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <Link to="/dashboard" className="text-surface-400 hover:text-white text-sm flex items-center gap-1 mb-2 transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-2xl font-bold text-white">
                            Analysis Report
                            <span className="text-surface-500 font-normal text-base ml-2">#{report.id}</span>
                        </h1>
                        {(report.brand || report.model_name) && (
                            <p className="text-surface-400 text-sm mt-1">
                                {[report.brand, report.model_name, report.storage_capacity].filter(Boolean).join(' · ')}
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-surface-500 text-xs mb-1">Estimated Resale Price</p>
                        <p className="text-brand-cyan text-3xl font-black">₹{finalPrice?.toLocaleString('en-IN')}</p>
                        <p className="text-surface-500 text-xs">
                            {report.created_at ? new Date(report.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* LEFT: Images + Detections */}
                    <div className="lg:col-span-3 space-y-5">

                        {/* Image viewer */}
                        <div className="glass rounded-2xl p-5">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand-blue" style={{ fontSize: '18px' }}>image_search</span>
                                AI Damage Detection
                                {report.detections?.length > 0 && (
                                    <span className="ml-auto text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                                        {report.detections.length} defect{report.detections.length !== 1 ? 's' : ''} found
                                    </span>
                                )}
                                {report.detections?.length === 0 && (
                                    <span className="ml-auto text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                                        No damage detected
                                    </span>
                                )}
                            </h3>

                            {report.image_urls?.length > 0 && (
                                <BoundingBoxCanvas
                                    src={report.image_urls[activeImage]}
                                    detections={report.detections?.filter(d =>
                                        !d.image_index || d.image_index === activeImage
                                    )}
                                />
                            )}

                            {/* Image thumbnails */}
                            {report.image_urls?.length > 1 && (
                                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                                    {report.image_urls.map((url, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImage(i)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                                activeImage === i ? 'border-brand-blue' : 'border-surface-600 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Detection breakdown */}
                        {report.detections?.length > 0 && (
                            <div className="glass rounded-2xl p-5">
                                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-400" style={{ fontSize: '18px' }}>crisis_alert</span>
                                    Detected Defects
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {Object.entries(detectionCounts).map(([label, count]) => (
                                        <div key={label} className="flex items-center gap-2 bg-surface-800/60 rounded-lg p-2.5">
                                            <div
                                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: DETECTION_COLORS[label] || '#94a3b8' }}
                                            />
                                            <div>
                                                <p className="text-white text-xs font-semibold capitalize">{label.replace(/_/g, ' ')}</p>
                                                <p className="text-surface-500 text-xs">{count}×</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Detailed list */}
                                <div className="mt-4 space-y-1.5">
                                    {report.detections.map((det, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-surface-700/50 last:border-0">
                                            <span className="flex items-center gap-2 text-surface-300">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DETECTION_COLORS[det.label] || '#94a3b8', display: 'inline-block' }} />
                                                <span className="capitalize">{det.label?.replace(/_/g, ' ')}</span>
                                            </span>
                                            <span className="text-surface-400">
                                                Confidence: <span className="text-white font-semibold">{Math.round(det.confidence * 100)}%</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AI Explanation */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-400" style={{ fontSize: '18px' }}>lightbulb</span>
                                Full Valuation Explanation
                            </h3>
                            <div className="text-sm text-surface-400 leading-relaxed space-y-2 max-h-96 overflow-y-auto pr-1">
                                {report.explanation?.split('\n').map((line, i) => {
                                    if (line.startsWith('## ')) return <h2 key={i} className="text-white font-bold text-base mt-2">{line.replace('## ', '')}</h2>
                                    if (line.startsWith('### ')) return <h3 key={i} className="text-white font-semibold mt-3 mb-1">{line.replace('### ', '')}</h3>
                                    if (line.startsWith('**')) {
                                        const parts = line.split('**')
                                        return <p key={i}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-white">{p}</strong> : p)}</p>
                                    }
                                    if (line.startsWith('|')) {
                                        return <div key={i} className="font-mono text-xs text-surface-500 bg-surface-800/60 px-2 py-0.5 rounded">{line}</div>
                                    }
                                    if (line.startsWith('---')) return <hr key={i} className="border-surface-700 my-2" />
                                    if (line.startsWith('*')) return <p key={i} className="text-surface-500 text-xs italic">{line.replace(/^\*/, '')}</p>
                                    return line ? <p key={i}>{line}</p> : null
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Scores + Breakdown */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Severity */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-400" style={{ fontSize: '18px' }}>health_and_safety</span>
                                Physical Damage Score
                            </h3>
                            <div className="text-center mb-4">
                                <span className={`text-5xl font-black ${meta.textColor}`}>{report.severity}</span>
                                <span className="text-surface-500 font-bold text-lg">/10</span>
                            </div>
                            <div className="relative h-3 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600 rounded-full mb-1 opacity-30" />
                            <div className="relative h-3 bg-white/5 rounded-full overflow-hidden -mt-3 mb-3">
                                <div
                                    className={`h-full ${meta.barColor} rounded-full transition-all duration-1000 ease-out shadow-lg ${meta.glow}`}
                                    style={{ width: `${report.severity * 10}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-surface-500 uppercase tracking-widest mb-4">
                                <span>Minor</span><span>Moderate</span><span>Severe</span>
                            </div>
                            <div className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl ${
                                meta.badge === 'badge-green' ? 'bg-emerald-500/10' :
                                meta.badge === 'badge-yellow' ? 'bg-amber-500/10' :
                                meta.badge === 'badge-blue' ? 'bg-blue-500/10' : 'bg-red-500/10'
                            }`}>
                                <span className={`material-symbols-outlined ${meta.textColor}`} style={{ fontSize: '18px' }}>{meta.icon}</span>
                                <span className={`font-bold text-sm ${meta.textColor}`}>{meta.label}</span>
                            </div>
                        </div>

                        {/* Phone Details */}
                        <PhoneDetailsCard report={report} />

                        {/* Price Breakdown */}
                        <PriceBreakdownCard report={report} />

                        {/* Report metadata */}
                        <div className="glass rounded-xl p-4">
                            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Report Details</p>
                            <div className="space-y-2.5">
                                {[
                                    { icon: 'tag', label: 'Report ID', value: `#${report.id}` },
                                    { icon: 'photo_library', label: 'Images', value: `${report.image_urls?.length || 0} uploaded` },
                                    { icon: 'schedule', label: 'Date', value: report.created_at ? new Date(report.created_at).toLocaleDateString('en-IN') : '—' },
                                    { icon: 'crisis_alert', label: 'Detections', value: `${report.detections?.length || 0} found` },
                                ].map(({ icon, label, value }) => (
                                    <div key={label} className="flex items-center justify-between">
                                        <span className="text-xs text-surface-500 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>{icon}</span>
                                            {label}
                                        </span>
                                        <span className="text-xs font-semibold text-surface-300">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Link to="/upload" className="btn-primary flex-1 text-center py-2.5 text-sm">
                                + New Assessment
                            </Link>
                            <Link to="/dashboard" className="btn-secondary flex-1 text-center py-2.5 text-sm">
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

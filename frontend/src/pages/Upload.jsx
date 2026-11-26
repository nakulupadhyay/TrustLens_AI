import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'


const BRANDS = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'Oppo', 'Realme', 'Motorola', 'Nokia', 'Other']
const STORAGES = ['8GB','16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB']

const FUNCTIONAL_QUESTIONS = [
  { key: 'touchscreen', label: 'Touchscreen', icon: '📱', desc: 'Is the touchscreen responding correctly?' },
  { key: 'display', label: 'Display', icon: '🖥️', desc: 'Is the display clear with no dead pixels or burn-in?' },
  { key: 'front_camera', label: 'Front Camera', icon: '🤳', desc: 'Is the selfie/front camera working?' },
  { key: 'rear_camera', label: 'Rear Camera', icon: '📷', desc: 'Are the rear cameras working correctly?' },
  { key: 'speaker', label: 'Speakers', icon: '🔊', desc: 'Is the speaker producing clear audio?' },
  { key: 'microphone', label: 'Microphone', icon: '🎙️', desc: 'Is the microphone working during calls/recordings?' },
  { key: 'charging_port', label: 'Charging Port', icon: '🔌', desc: 'Is the charging port functioning properly?' },
  { key: 'buttons', label: 'Physical Buttons', icon: '🔘', desc: 'Are all physical buttons (power, volume) working?' },
  { key: 'wifi_network', label: 'Wi-Fi / Network', icon: '📶', desc: 'Is Wi-Fi, cellular data, and Bluetooth working?' },
  { key: 'biometrics', label: 'Face ID / Fingerprint', icon: '🔐', desc: 'Is biometric authentication working (if applicable)?' },
]

const STEPS = ['Images', 'Phone Details', 'Condition', 'Review']

export default function Upload() {
  const [step, setStep] = useState(0)

  // Step 0: Images
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  // Step 1: Phone details
  const [brand, setBrand] = useState('')
  const [customBrand, setCustomBrand] = useState('')
  const [modelName, setModelName] = useState('')
  const [storageCapacity, setStorageCapacity] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')

  // Step 2: Condition
  const [batteryHealth, setBatteryHealth] = useState(85)
  const [batteryProvided, setBatteryProvided] = useState(false)
  const [functionalIssues, setFunctionalIssues] = useState(
    Object.fromEntries(FUNCTIONAL_QUESTIONS.map(q => [q.key, false]))
  )

  // Submission
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const navigate = useNavigate()

  /* ---- File helpers ---- */
  const addFiles = (selected) => {
    const valid = Array.from(selected).filter(f => f.type.startsWith('image/'))
    if (files.length + valid.length > 5) { toast.error('Maximum 5 images allowed'); return }
    const newFiles = [...files, ...valid].slice(0, 5)
    setFiles(newFiles)
    setPreviews(newFiles.map(f => URL.createObjectURL(f)))
  }
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }
  const removeFile = (i) => {
    const nf = files.filter((_, idx) => idx !== i)
    setFiles(nf); setPreviews(nf.map(f => URL.createObjectURL(f)))
  }

  /* ---- Navigation ---- */
  const goNext = () => {
    if (step === 0 && files.length === 0) { toast.error('Upload at least one image'); return }
    if (step === 1) {
      const p = parseFloat(basePrice)
      if (!p || p <= 0) { toast.error('Enter a valid original purchase price'); return }
    }
    setStep(s => Math.min(s + 1, 3))
  }
  const goPrev = () => setStep(s => Math.max(s - 1, 0))

  /* ---- Submit ---- */
  const handleSubmit = async () => {
    const price = parseFloat(basePrice)
    if (!price || price <= 0) { toast.error('Enter a valid price'); return }
    if (files.length === 0) { toast.error('No images uploaded'); return }

    try {
      setUploading(true)
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      const uploadRes = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      const imageUrls = uploadRes.data.image_urls
      setUploading(false)

      setAnalyzing(true)
      const effectiveBrand = brand === 'Other' ? (customBrand || 'Other') : brand

      const analyzePayload = {
        image_urls: imageUrls,
        base_price: price,
        brand: effectiveBrand || null,
        model_name: modelName || null,
        storage_capacity: storageCapacity || null,
        purchase_date: purchaseDate || null,
        battery_health: batteryProvided ? batteryHealth : null,
        functional_issues: functionalIssues,
      }

      const analyzeRes = await api.post('/analyze', analyzePayload)
      setAnalyzing(false)
      navigate(`/report/${analyzeRes.data.id}`, { state: analyzeRes.data })
    } catch (err) {
      setUploading(false); setAnalyzing(false)
      toast.error(err.response?.data?.detail || 'Analysis failed. Please try again.')
    }
  }

  /* ---- Battery colour ---- */
  const batteryColor = batteryHealth >= 80 ? '#10b981' : batteryHealth >= 60 ? '#f59e0b' : '#ef4444'

  if (uploading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <LoadingSpinner />
      <p className="text-surface-300 text-lg">Uploading images…</p>
    </div>
  )
  if (analyzing) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <LoadingSpinner />
      <p className="text-surface-300 text-lg">Running AI analysis…</p>
      <p className="text-surface-500 text-sm">YOLO detection + multi-factor valuation in progress</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-dark py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Smartphone Assessment</h1>
          <p className="text-surface-400">AI-powered damage detection & resale valuation</p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div className={`h-0.5 flex-1 transition-colors duration-300 ${i <= step ? 'bg-brand-blue' : 'bg-surface-700'}`} />
                )}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  i < step ? 'bg-brand-blue text-white' :
                  i === step ? 'bg-brand-blue text-white ring-4 ring-brand-blue/30' :
                  'bg-surface-700 text-surface-400'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 transition-colors duration-300 ${i < step ? 'bg-brand-blue' : 'bg-surface-700'}`} />
                )}
              </div>
              <span className={`text-xs mt-2 font-medium ${i === step ? 'text-brand-blue' : 'text-surface-500'}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="glass rounded-2xl p-6 md:p-8 mb-6">

          {/* STEP 0: Images */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Upload Phone Images</h2>
              <p className="text-surface-400 text-sm mb-6">Upload up to 5 images. All angles help the AI assess damage more accurately.</p>

              <div
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
                  dragOver ? 'border-brand-blue bg-brand-blue/10' : 'border-surface-600 hover:border-surface-500 bg-surface-800/40'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current.click()}
              >
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
                <div className="text-5xl mb-3">📸</div>
                <p className="text-white font-medium">Drop images here or click to browse</p>
                <p className="text-surface-500 text-sm mt-1">JPG, PNG, WEBP — max 5 images</p>
              </div>

              {previews.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden aspect-square bg-surface-800">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-600 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >✕</button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center text-xs text-white py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {files[i]?.name?.slice(0, 16)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {files.length > 0 && (
                <p className="text-surface-400 text-sm mt-3 text-center">{files.length} image{files.length > 1 ? 's' : ''} selected</p>
              )}
            </div>
          )}

          {/* STEP 1: Phone Details */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Phone Details</h2>
              <p className="text-surface-400 text-sm mb-6">Help us identify the phone for accurate market pricing.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Brand</label>
                  <select
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    className="form-field"
                  >
                    <option value="">Select brand…</option>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {brand === 'Other' && (
                    <input
                      type="text"
                      placeholder="Enter brand name"
                      value={customBrand}
                      onChange={e => setCustomBrand(e.target.value)}
                      className="mt-2 form-field"
                    />
                  )}
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Model Name</label>
                  <input
                    type="text"
                    placeholder="e.g. iPhone 14 Pro, Galaxy S23"
                    value={modelName}
                    onChange={e => setModelName(e.target.value)}
                    className="form-field"
                  />
                </div>

                {/* Storage */}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Storage Capacity</label>
                  <select
                    value={storageCapacity}
                    onChange={e => setStorageCapacity(e.target.value)}
                    className="form-field"
                  >
                    <option value="">Select storage…</option>
                    {STORAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">
                    Original Purchase Price <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 font-medium">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 75000"
                      value={basePrice}
                      onChange={e => setBasePrice(e.target.value)}
                      min="1"
                      className="form-field pl-8"
                    />
                  </div>
                </div>

                {/* Purchase Date */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-surface-300 mb-2">Purchase Date</label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={e => setPurchaseDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="form-field"
                  />
                  <p className="text-surface-500 text-xs mt-1">Used to calculate age-based depreciation</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Condition */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Condition Assessment</h2>
              <p className="text-surface-400 text-sm mb-6">Honest answers lead to fairer valuations.</p>

              {/* Battery Health */}
              <div className="glass bg-surface-800/60 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">🔋 Battery Health</h3>
                    <p className="text-surface-500 text-xs">User-reported — not verified by AI</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-surface-400 text-sm">Provide battery info</span>
                    <div
                      className={`w-11 h-6 rounded-full transition-colors duration-200 ${batteryProvided ? 'bg-brand-blue' : 'bg-surface-600'} relative cursor-pointer`}
                      onClick={() => setBatteryProvided(v => !v)}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${batteryProvided ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                  </label>
                </div>
                {batteryProvided && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-surface-300 text-sm">Battery Health</span>
                      <span className="text-2xl font-bold" style={{ color: batteryColor }}>{batteryHealth}%</span>
                    </div>
                    <input
                      type="range" min="1" max="100" value={batteryHealth}
                      onChange={e => setBatteryHealth(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: batteryColor }}
                    />
                    <div className="flex justify-between text-xs text-surface-500 mt-1">
                      <span>1%</span>
                      <span className="font-medium" style={{ color: batteryColor }}>
                        {batteryHealth >= 90 ? 'Excellent' : batteryHealth >= 80 ? 'Good' : batteryHealth >= 70 ? 'Fair' : batteryHealth >= 60 ? 'Below Average' : 'Poor'}
                      </span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Functional Checks */}
              <h3 className="text-white font-semibold mb-3">🔧 Functional Condition</h3>
              <p className="text-surface-500 text-xs mb-4">Mark any components that are NOT working correctly.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FUNCTIONAL_QUESTIONS.map(q => {
                  const isBroken = functionalIssues[q.key]
                  return (
                    <button
                      key={q.key}
                      onClick={() => setFunctionalIssues(prev => ({ ...prev, [q.key]: !prev[q.key] }))}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-150 ${
                        isBroken
                          ? 'border-red-500/70 bg-red-900/20 text-red-300'
                          : 'border-surface-600 bg-surface-800/40 text-surface-300 hover:border-surface-500'
                      }`}
                    >
                      <span className="text-xl mt-0.5">{q.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{q.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isBroken ? 'bg-red-700/50 text-red-300' : 'bg-green-900/40 text-green-400'}`}>
                            {isBroken ? 'Faulty' : 'Working'}
                          </span>
                        </div>
                        <p className="text-xs text-surface-500 mt-0.5 leading-snug">{q.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Review & Analyze</h2>
              <p className="text-surface-400 text-sm mb-6">Confirm the details before running the AI assessment.</p>

              <div className="space-y-4">
                {/* Images */}
                <div className="glass bg-surface-800/60 rounded-xl p-4">
                  <h3 className="text-surface-300 font-medium text-sm mb-3">📷 Images ({files.length})</h3>
                  <div className="flex gap-2 flex-wrap">
                    {previews.map((src, i) => (
                      <img key={i} src={src} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>

                {/* Phone */}
                <div className="glass bg-surface-800/60 rounded-xl p-4">
                  <h3 className="text-surface-300 font-medium text-sm mb-3">📱 Phone Details</h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-surface-500">Brand</span>
                    <span className="text-white">{brand === 'Other' ? (customBrand || '—') : (brand || '—')}</span>
                    <span className="text-surface-500">Model</span>
                    <span className="text-white">{modelName || '—'}</span>
                    <span className="text-surface-500">Storage</span>
                    <span className="text-white">{storageCapacity || '—'}</span>
                    <span className="text-surface-500">Original Price</span>
                    <span className="text-white font-semibold">₹{parseFloat(basePrice || 0).toLocaleString('en-IN')}</span>
                    <span className="text-surface-500">Purchase Date</span>
                    <span className="text-white">{purchaseDate || '—'}</span>
                  </div>
                </div>

                {/* Condition */}
                <div className="glass bg-surface-800/60 rounded-xl p-4">
                  <h3 className="text-surface-300 font-medium text-sm mb-3">🔧 Condition</h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-surface-500">Battery Health</span>
                    <span className="text-white">{batteryProvided ? `${batteryHealth}%` : 'Not provided'}</span>
                    <span className="text-surface-500">Functional Issues</span>
                    <span className="text-white">
                      {Object.values(functionalIssues).filter(Boolean).length} reported
                    </span>
                  </div>
                  {Object.entries(functionalIssues).filter(([, v]) => v).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {Object.entries(functionalIssues).filter(([, v]) => v).map(([k]) => {
                        const q = FUNCTIONAL_QUESTIONS.find(x => x.key === k)
                        return (
                          <span key={k} className="text-xs bg-red-900/40 text-red-300 border border-red-700/40 px-2 py-0.5 rounded-full">
                            {q?.icon} {q?.label}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-xl p-4 text-sm text-brand-cyan">
                  ℹ️ Physical damage will be detected by YOLO AI from your uploaded images. All calculations are transparent and rule-based.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={goPrev}
            disabled={step === 0}
            className="btn-secondary px-6 py-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Back
          </button>

          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-brand-blue' : i < step ? 'w-3 bg-brand-blue/60' : 'w-3 bg-surface-600'}`} />
            ))}
          </div>

          {step < 3 ? (
            <button onClick={goNext} className="btn-primary px-6 py-2.5">
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn-primary px-8 py-2.5 font-semibold"
            >
              🔍 Analyze Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

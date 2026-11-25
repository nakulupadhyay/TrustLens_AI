export default function LoadingSpinner({ size = 'md', text = '', className = '' }) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    }
    const borderSizes = {
        sm: 'border-2',
        md: 'border-2',
        lg: 'border-[3px]',
        xl: 'border-[3px]',
    }

    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <div className="relative">
                {/* Outer ring */}
                <div className={`${sizes[size]} rounded-full ${borderSizes[size]} border-white/10 border-t-blue-500 animate-spin`} />
                {/* Inner ring */}
                <div
                    className={`absolute inset-1 rounded-full ${borderSizes[size]} border-white/5 border-b-cyan-400 animate-spin`}
                    style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
                />
                {/* Center dot for xl */}
                {size === 'xl' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    </div>
                )}
            </div>
            {text && (
                <p className="text-slate-400 text-sm font-medium animate-pulse">{text}</p>
            )}
        </div>
    )
}

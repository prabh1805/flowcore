import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, type = 'text', ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
      </label>
    )}
    <input
      ref={ref}
      type={type}
      className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500
        focus:outline-none focus:ring-2 transition-all duration-300
        ${error
          ? 'border-red-500/50 focus:ring-red-500/30'
          : 'border-white/10 focus:ring-sky-500/30 focus:border-sky-500/50'
        }`}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
  </div>
))

Input.displayName = 'Input'
export default Input

import { motion } from 'framer-motion'

export default function Button({ children, loading, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={loading}
      className={`w-full py-3 px-6 rounded-xl font-semibold text-white
        bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500
        hover:from-sky-400 hover:via-blue-400 hover:to-indigo-400
        disabled:opacity-60 disabled:cursor-not-allowed
        transition-all duration-300 shadow-lg shadow-blue-500/25
        cursor-pointer ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </span>
      ) : children}
    </motion.button>
  )
}

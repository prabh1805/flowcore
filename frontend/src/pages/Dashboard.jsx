import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import logo from '@/assets/logo/flowCore.svg'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl" />

      {/* Nav */}
      <nav className="relative z-10 border-b border-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src={logo} alt="FlowCore" className="h-10 w-auto" />
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-gray-400 mb-10">Here&apos;s your account overview</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Name', value: user?.name || '—' },
            { label: 'Email', value: user?.email || '—' },
            { label: 'Member since', value: user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : '—'
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * (i + 1) }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <p className="text-sm text-gray-500 mb-1">{item.label}</p>
              <p className="text-lg font-medium">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

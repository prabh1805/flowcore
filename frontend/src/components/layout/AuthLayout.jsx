import logo from '@/assets/logo/flowCore.svg'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="FlowCore" className="h-14 w-auto" />
        </div>
        {children}
      </div>
    </div>
  )
}

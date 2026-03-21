export default function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-500 animate-spin" />
        <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-blue-500 animate-spin [animation-direction:reverse]" />
      </div>
    </div>
  )
}

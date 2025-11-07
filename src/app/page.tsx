'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handlePlay = () => {
    router.push('/game')
  }

  const handleLogin = () => {
    router.push('/auth/signin')
  }

  const today = new Date()
  const gameNumber = Math.floor((today.getTime() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)) + 1

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Wordle Logo */}
        <div className="mb-6 flex justify-center">
          <div className="grid grid-cols-3 gap-1 w-16 h-16">
            <div className="bg-white border border-gray-400 rounded-sm"></div>
            <div className="bg-white border border-gray-400 rounded-sm"></div>
            <div className="bg-white border border-gray-400 rounded-sm"></div>
            <div className="bg-green-500 border border-gray-400 rounded-sm"></div>
            <div className="bg-yellow-500 border border-gray-400 rounded-sm"></div>
            <div className="bg-white border border-gray-400 rounded-sm"></div>
            <div className="bg-white border border-gray-400 rounded-sm"></div>
            <div className="bg-white border border-gray-400 rounded-sm"></div>
            <div className="bg-white border border-gray-400 rounded-sm"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-black mb-4">Wordle</h1>

        {/* Subtitle */}
        <p className="text-gray-700 text-lg mb-8 leading-relaxed">
          Get 6 chances to guess<br />
          a 5-letter word.
        </p>

        {/* Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={handleLogin}
            className="w-full py-3 px-6 bg-gray-300 text-black font-medium rounded-full border border-gray-400 hover:bg-gray-400 transition-colors"
          >
            Log in
          </button>

          <button
            onClick={handlePlay}
            className="w-full py-3 px-6 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            Play
          </button>
        </div>

        {/* Game Info */}
        <div className="text-gray-600 text-sm">
          <p>{today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p>No. {gameNumber}</p>
          <p>Edited by Tracy Bennett</p>
        </div>
      </div>
    </div>
  )
}

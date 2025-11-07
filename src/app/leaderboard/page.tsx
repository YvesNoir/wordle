'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface LeaderboardEntry {
  userId: string
  username: string
  gamesPlayed: number
  gamesWon: number
  winRate: number
  averageAttempts: number
  averageTime: number
  bestTime: number
  streak: number
}

export default function LeaderboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session) {
      fetchLeaderboard()
    }
  }, [session, status, router])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      const data = await response.json()
      setLeaderboard(data.leaderboard || [])
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white">Cargando ranking...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-4">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-6">
          <div className="flex justify-between items-center py-2">
            <Link
              href="/game"
              className="text-gray-400 hover:text-white"
            >
              ← Volver
            </Link>
            <h1 className="text-lg font-semibold text-white">Ranking</h1>
            <div className="w-16"></div>
          </div>
        </header>

        <main>
          {leaderboard.length === 0 ? (
            <div className="text-center text-gray-300">
              <p>Aún no hay estadísticas disponibles.</p>
              <p>¡Sé el primero en jugar!</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Posición
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Jugador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Partidas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      % Victoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Prom. Intentos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Mejor Tiempo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Racha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry.userId}
                      className={`${
                        entry.userId === session?.user?.id
                          ? 'bg-blue-900/30 border-l-4 border-blue-400'
                          : 'hover:bg-gray-700/50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && `${index + 1}°`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {entry.username}
                          {entry.userId === session?.user?.id && ' (Tú)'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {entry.gamesPlayed} ({entry.gamesWon}W)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {entry.winRate.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {entry.averageAttempts.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {entry.bestTime > 0 ? formatTime(entry.bestTime) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {entry.streak > 0 ? `🔥 ${entry.streak}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
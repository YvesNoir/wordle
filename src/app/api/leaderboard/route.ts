import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        games: {
          where: {
            completed: true
          },
          select: {
            won: true,
            attempts: true,
            startTime: true,
            endTime: true
          }
        }
      }
    })

    const leaderboard = users.map(user => {
      const games = user.games
      const gamesPlayed = games.length
      const gamesWon = games.filter(game => game.won).length
      const winRate = gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0

      const wonGames = games.filter(game => game.won && game.endTime)
      const averageAttempts = wonGames.length > 0
        ? wonGames.reduce((sum, game) => sum + game.attempts, 0) / wonGames.length
        : 0

      const times = wonGames.map(game => {
        if (game.startTime && game.endTime) {
          return Math.floor((new Date(game.endTime).getTime() - new Date(game.startTime).getTime()) / 1000)
        }
        return 0
      }).filter(time => time > 0)

      const averageTime = times.length > 0
        ? times.reduce((sum, time) => sum + time, 0) / times.length
        : 0
      const bestTime = times.length > 0 ? Math.min(...times) : 0

      let currentStreak = 0
      const sortedGames = games.sort((a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      )

      for (const game of sortedGames) {
        if (game.won) {
          currentStreak++
        } else {
          break
        }
      }

      return {
        userId: user.id,
        username: user.username,
        gamesPlayed,
        gamesWon,
        winRate,
        averageAttempts,
        averageTime,
        bestTime,
        streak: currentStreak
      }
    }).filter(entry => entry.gamesPlayed > 0)
    .sort((a, b) => {
      if (b.winRate !== a.winRate) return b.winRate - a.winRate
      if (b.gamesWon !== a.gamesWon) return b.gamesWon - a.gamesWon
      if (a.averageAttempts !== b.averageAttempts) return a.averageAttempts - b.averageAttempts
      return a.averageTime - b.averageTime
    })

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
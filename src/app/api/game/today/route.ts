import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { getRandomWord } from '@/lib/words'

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let todaysWord = await prisma.word.findUnique({
      where: { date: today }
    })

    if (!todaysWord) {
      todaysWord = await prisma.word.create({
        data: {
          word: getRandomWord(),
          date: today
        }
      })
    }

    const existingGame = await prisma.game.findUnique({
      where: {
        userId_wordId: {
          userId: session.user.id,
          wordId: todaysWord.id
        }
      }
    })

    return NextResponse.json({
      targetWord: todaysWord.word,
      game: existingGame ? {
        ...existingGame,
        guesses: existingGame.guesses as string[]
      } : null
    })
  } catch (error) {
    console.error('Error getting today\'s game:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { guesses, completed, won, attempts } = await request.json()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todaysWord = await prisma.word.findUnique({
      where: { date: today }
    })

    if (!todaysWord) {
      return NextResponse.json(
        { error: 'No se encontró la palabra del día' },
        { status: 404 }
      )
    }

    const existingGame = await prisma.game.findUnique({
      where: {
        userId_wordId: {
          userId: session.user.id,
          wordId: todaysWord.id
        }
      }
    })

    if (existingGame) {
      const updatedGame = await prisma.game.update({
        where: { id: existingGame.id },
        data: {
          guesses,
          attempts,
          completed,
          won,
          endTime: completed ? new Date() : null
        }
      })

      return NextResponse.json({ game: updatedGame })
    } else {
      const newGame = await prisma.game.create({
        data: {
          userId: session.user.id,
          wordId: todaysWord.id,
          guesses,
          attempts,
          completed,
          won,
          endTime: completed ? new Date() : null
        }
      })

      return NextResponse.json({ game: newGame })
    }
  } catch (error) {
    console.error('Error saving game:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
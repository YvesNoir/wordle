import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    await requireAdmin()

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username y password son requeridos' },
        { status: 400 }
      )
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'El username debe tener al menos 3 caracteres' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user
    })
  } catch (error) {
    console.error('Error creating user:', error)

    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
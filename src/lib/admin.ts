import { getServerSession } from 'next-auth'

export const ADMIN_USERNAME = 'sebastianfente'

export async function isAdmin() {
  const session = await getServerSession()
  return session?.user?.username === ADMIN_USERNAME
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Admin access required')
  }
  return true
}
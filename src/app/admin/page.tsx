'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
  id: string
  username: string
  createdAt: string
}

export default function AdminPanel() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [createForm, setCreateForm] = useState({
    username: '',
    password: ''
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user?.username !== 'sebastianfente') {
      router.push('/game')
      return
    }

    fetchUsers()
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.username || !createForm.password) return

    setCreating(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createForm)
      })

      if (response.ok) {
        setCreateForm({ username: '', password: '' })
        fetchUsers()
        alert('Usuario creado exitosamente')
      } else {
        const error = await response.json()
        alert(error.error || 'Error al crear usuario')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error al crear usuario')
    } finally {
      setCreating(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando panel de administración...</div>
      </div>
    )
  }

  if (!session || session.user?.username !== 'sebastianfente') {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <button
            onClick={() => router.push('/game')}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            Ir al Juego
          </button>
        </div>

        {/* Create User Form */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Crear Nuevo Usuario</h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre de usuario
              </label>
              <input
                type="text"
                value={createForm.username}
                onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                placeholder="Ingrese el nombre de usuario"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                placeholder="Ingrese la contraseña"
                required
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {creating ? 'Creando...' : 'Crear Usuario'}
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Usuarios ({users.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-3">Usuario</th>
                  <th className="pb-3">Fecha de Creación</th>
                  <th className="pb-3">Admin</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800">
                    <td className="py-3 font-medium">{user.username}</td>
                    <td className="py-3 text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3">
                      {user.username === 'sebastianfente' ? (
                        <span className="px-2 py-1 bg-green-600 text-xs rounded">Admin</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-600 text-xs rounded">Usuario</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No hay usuarios registrados
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
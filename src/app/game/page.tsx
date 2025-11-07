'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { WordleGrid } from '@/components/WordleGrid'
import { WordleKeyboard } from '@/components/WordleKeyboard'
import { isValidWord } from '@/lib/words'

const MAX_GUESSES = 6
const WORD_LENGTH = 5

interface GameState {
  targetWord: string
  guesses: string[]
  currentGuess: string
  gameOver: boolean
  won: boolean
  startTime: number
}

export default function GamePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState>({
    targetWord: '',
    guesses: [],
    currentGuess: '',
    gameOver: false,
    won: false,
    startTime: Date.now()
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session) {
      fetchTodaysGame()
    }
  }, [session, status, router])

  const fetchTodaysGame = async () => {
    try {
      const response = await fetch('/api/game/today')
      const data = await response.json()

      if (data.game) {
        setGameState({
          targetWord: data.targetWord,
          guesses: data.game.guesses || [],
          currentGuess: '',
          gameOver: data.game.completed,
          won: data.game.won,
          startTime: new Date(data.game.startTime).getTime()
        })
      } else {
        setGameState(prev => ({
          ...prev,
          targetWord: data.targetWord,
          startTime: Date.now()
        }))
      }
    } catch (error) {
      console.error('Error fetching game:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveGame = async (guesses: string[], completed: boolean, won: boolean) => {
    try {
      await fetch('/api/game/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guesses,
          completed,
          won,
          attempts: guesses.length
        }),
      })
    } catch (error) {
      console.error('Error saving game:', error)
    }
  }

  const handleKeyPress = useCallback((key: string) => {
    if (gameState.gameOver) return

    setGameState(prev => {
      if (key === 'ENTER') {
        if (prev.currentGuess.length !== WORD_LENGTH) {
          setMessage('La palabra debe tener 5 letras')
          setTimeout(() => setMessage(''), 2000)
          return prev
        }

        if (!isValidWord(prev.currentGuess)) {
          setMessage('Palabra no válida')
          setTimeout(() => setMessage(''), 2000)
          return prev
        }

        const newGuesses = [...prev.guesses, prev.currentGuess]
        const won = prev.currentGuess === prev.targetWord
        const gameOver = won || newGuesses.length >= MAX_GUESSES

        const newState = {
          ...prev,
          guesses: newGuesses,
          currentGuess: '',
          gameOver,
          won
        }

        if (gameOver) {
          saveGame(newGuesses, true, won)
          if (won) {
            const attempts = newGuesses.length
            const timeElapsed = Math.floor((Date.now() - prev.startTime) / 1000)
            setMessage(`¡Felicidades! Lo resolviste en ${attempts} intentos en ${timeElapsed}s`)
          } else {
            setMessage(`Juego terminado. La palabra era: ${prev.targetWord}`)
          }
        }

        return newState
      }

      if (key === 'BACKSPACE') {
        return {
          ...prev,
          currentGuess: prev.currentGuess.slice(0, -1)
        }
      }

      if (prev.currentGuess.length < WORD_LENGTH && /^[A-ZÑ]$/.test(key)) {
        return {
          ...prev,
          currentGuess: prev.currentGuess + key
        }
      }

      return prev
    })
  }, [gameState.gameOver, gameState.targetWord, gameState.startTime])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase()
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-ZÑ]$/.test(key)) {
        event.preventDefault()
        handleKeyPress(key)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyPress])

  const getGuessedLetters = () => {
    const letters = new Set<string>()
    gameState.guesses.forEach(guess => {
      for (const letter of guess) {
        letters.add(letter)
      }
    })
    return letters
  }

  const getCorrectLetters = () => {
    const letters = new Set<string>()
    gameState.guesses.forEach(guess => {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === gameState.targetWord[i]) {
          letters.add(guess[i])
        }
      }
    })
    return letters
  }

  const getWrongPositionLetters = () => {
    const letters = new Set<string>()
    gameState.guesses.forEach(guess => {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] !== gameState.targetWord[i] && gameState.targetWord.includes(guess[i])) {
          letters.add(guess[i])
        }
      }
    })
    return letters
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-white">Cargando juego...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header with menu button */}
      <div className="flex justify-between items-center px-4 py-2">
        <button className="text-gray-400">
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className="w-6 h-0.5 bg-gray-400"></div>
            <div className="w-6 h-0.5 bg-gray-400"></div>
            <div className="w-6 h-0.5 bg-gray-400"></div>
          </div>
        </button>
        <h1 className="text-white text-lg font-semibold">Wordle</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/leaderboard')}
            className="text-gray-400 hover:text-white"
          >
            📊
          </button>
          <button
            onClick={() => signOut()}
            className="text-gray-400 hover:text-white"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="px-4 py-2">
          <div className={`text-center p-3 rounded text-sm ${gameState.won ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {message}
          </div>
        </div>
      )}

      {/* Game content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 space-y-6">
        <WordleGrid
          currentGuess={gameState.currentGuess}
          guesses={gameState.guesses}
          targetWord={gameState.targetWord}
          maxGuesses={MAX_GUESSES}
        />

        <WordleKeyboard
          onKeyPress={handleKeyPress}
          guessedLetters={getGuessedLetters()}
          correctLetters={getCorrectLetters()}
          wrongPositionLetters={getWrongPositionLetters()}
        />
      </div>

      {/* Bottom icons */}
      <div className="flex justify-center space-x-8 pb-8">
        <button className="text-gray-500 text-xl">❌</button>
        <button className="text-gray-500 text-xl">📷</button>
        <button className="text-gray-500 text-xl">📊</button>
        <button className="text-gray-500 text-xl">❓</button>
      </div>
    </div>
  )
}
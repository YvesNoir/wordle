'use client'

import { useState, useEffect } from 'react'

interface WordleGridProps {
  currentGuess: string
  guesses: string[]
  targetWord: string
  maxGuesses: number
}

export function WordleGrid({ currentGuess, guesses, targetWord, maxGuesses }: WordleGridProps) {
  const getCellClass = (letter: string, index: number, guess: string) => {
    if (!letter) return 'border-2 border-gray-600 bg-transparent'

    if (guess === currentGuess) {
      return 'border-2 border-gray-500 bg-transparent text-white'
    }

    const targetLetter = targetWord[index]

    if (letter === targetLetter) {
      return 'bg-green-600 text-white border-0'
    }

    if (targetWord.includes(letter)) {
      return 'bg-yellow-500 text-white border-0'
    }

    return 'bg-gray-600 text-white border-0'
  }

  const renderGrid = () => {
    const rows = []

    for (let i = 0; i < maxGuesses; i++) {
      const guess = guesses[i] || ''
      const isCurrentRow = i === guesses.length && guesses.length < maxGuesses
      const displayGuess = isCurrentRow ? currentGuess : guess

      const cells = []
      for (let j = 0; j < 5; j++) {
        const letter = displayGuess[j] || ''
        cells.push(
          <div
            key={j}
            className={`w-12 h-12 flex items-center justify-center text-lg font-bold uppercase transition-colors duration-300 ${getCellClass(letter, j, displayGuess)}`}
          >
            {letter}
          </div>
        )
      }

      rows.push(
        <div key={i} className="flex gap-1">
          {cells}
        </div>
      )
    }

    return rows
  }

  return (
    <div className="flex flex-col gap-1">
      {renderGrid()}
    </div>
  )
}
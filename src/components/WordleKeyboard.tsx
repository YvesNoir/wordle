'use client'

interface WordleKeyboardProps {
  onKeyPress: (key: string) => void
  guessedLetters: Set<string>
  correctLetters: Set<string>
  wrongPositionLetters: Set<string>
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
]

export function WordleKeyboard({
  onKeyPress,
  guessedLetters,
  correctLetters,
  wrongPositionLetters
}: WordleKeyboardProps) {
  const getKeyClass = (key: string) => {
    const baseClass = 'h-12 rounded font-semibold text-sm transition-colors duration-200 flex items-center justify-center'

    if (key === 'ENTER' || key === 'BACKSPACE') {
      return `${baseClass} bg-gray-600 hover:bg-gray-500 text-white px-3 min-w-[60px]`
    }

    if (correctLetters.has(key)) {
      return `${baseClass} bg-green-600 text-white w-10`
    }

    if (wrongPositionLetters.has(key)) {
      return `${baseClass} bg-yellow-500 text-white w-10`
    }

    if (guessedLetters.has(key)) {
      return `${baseClass} bg-gray-700 text-white w-10`
    }

    return `${baseClass} bg-gray-500 hover:bg-gray-400 text-white w-10`
  }

  return (
    <div className="flex flex-col gap-1 max-w-sm">
      {KEYBOARD_ROWS.map((row, index) => (
        <div
          key={index}
          className={`flex gap-1 justify-center ${index === 1 ? 'px-4' : ''}`}
        >
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={getKeyClass(key)}
            >
              {key === 'BACKSPACE' ? '⌫' : key === 'ENTER' ? 'ENTER' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
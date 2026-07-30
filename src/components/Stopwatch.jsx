import { useState, useEffect } from 'react'

function Stopwatch() {
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [isRunning, setIsRunning] = useState(false)
  const [breathCount, setBreathCount] = useState(0)

  const isFinished = secondsLeft === 0

  useEffect(() => {
    if (!isRunning) return

    const timerId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId)
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerId)
  }, [isRunning])

  function handleStart() {
    setIsRunning(true)
  }

  function handleReset() {
    setIsRunning(false)
    setSecondsLeft(60)
    setBreathCount(0)
  }

  function handleTap() {
    setBreathCount((prev) => prev + 1)
  }

  return (
    <div className="stopwatch">
      <p className="stopwatch-time">{secondsLeft}</p>
      <p className="breath-count">{breathCount}</p>

      <button
        className='tap-button'
        disabled={!isRunning}
        onClick={handleTap}
      >
        タップ
      </button>

      {!isRunning && !isFinished && (
        <button onClick={handleStart}>スタート</button>
      )} 

      {isFinished && (
        <button className="confirm-button">確定</button>
      )}

      <button onClick={handleReset}>リセット</button>
    </div>
  )
}

export default Stopwatch
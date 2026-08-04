import { useState, useEffect } from 'react'

function Stopwatch() {
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [isRunning, setIsRunning] = useState(false)
  const [breathCount, setBreathCount] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

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
    setIsSaved(false)
  }

  function handleTap() {
    setBreathCount((prev) => prev + 1)
  }

  async function handleConfirm() {
    await fetch('http://localhost:3001/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ breathCount })
    })
    setIsSaved(true)
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

      {isFinished && !isSaved && (
        <button className="confirm-button" onClick={handleConfirm}>
          確定
        </button>
      )}

      {isSaved && <p className="saved-message">保存しました</p>}

      <button onClick={handleReset}>リセット</button>
    </div>
  )
}

export default Stopwatch
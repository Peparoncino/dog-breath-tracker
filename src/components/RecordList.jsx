import { useState } from "react";

function formatDate(isoString) {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}/${month}/${day} ${hours}:${minutes}`
}

function RecordList() {
  const [isOpen, setIsOpen] = useState(false)
  const [records, setRecords] = useState([])

  async function handleToggle() {
    if (isOpen) {
      setIsOpen(false)
      return
    }

    const res = await fetch('http://localhost:3001/records')
    const data = await res.json()
    setRecords(data)
    setIsOpen(true)
  }
  return (
    <div className="record-list">
      <button onClick={handleToggle}>
        {isOpen ? '一覧を閉じる' : '記録を見る'}
      </button>

      {isOpen && (
        <ul>
          {records.map((record) => (
            <li key={record.id}>
              {formatDate(record.recorded_at)} {record.breath_count}回
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default RecordList
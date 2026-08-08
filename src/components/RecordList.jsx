import { useState } from 'react'

function RecordList() {
  const [isOpen, setIsOpen] = useState(false)
  const [records, setRecords] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editCount, setEditCount] = useState('')
  const [editMemo, setEditMemo] = useState('')

  async function fetchRecords() {
    const res = await fetch('http://localhost:3001/records')
    const data = await res.json()
    setRecords(data)
  }

  async function handleToggle() {
    if (isOpen) {
      setIsOpen(false)
      return
    }
    await fetchRecords()
    setIsOpen(true)
  }

  function handleStartEdit(record) {
    setEditingId(record.id)
    setEditCount(record.breath_count)
    setEditMemo(record.memo || '')
  }

  function handleCancelEdit() {
    setEditingId(null)
  }

  async function handleSaveEdit(id) {
    await fetch(`http://localhost:3001/records/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ breathCount: editCount, memo: editMemo })
    })
    setEditingId(null)
    await fetchRecords()
  }

  async function handleDelete(id) {
    await fetch(`http://localhost:3001/records/${id}`, {
      method: 'DELETE'
    })
    await fetchRecords()
  }

  function formatDate(isoString) {
    const date = new Date(isoString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}/${month}/${day} ${hours}:${minutes}`
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
              {editingId === record.id ? (
                <div className="edit-form">
                  <input
                    type="number"
                    value={editCount}
                    onChange={(e) => setEditCount(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editMemo}
                    onChange={(e) => setEditMemo(e.target.value)}
                    placeholder="メモ"
                  />
                  <button onClick={() => handleSaveEdit(record.id)}>保存</button>
                  <button onClick={handleCancelEdit}>キャンセル</button>
                  <button onClick={() => handleDelete(record.id)}>削除</button>
                </div>
              ) : (
                <span onClick={() => handleStartEdit(record)}>
                  {formatDate(record.recorded_at)} {record.breath_count}回
                  {record.memo && `（${record.memo}）`}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default RecordList
import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'

const app = express()
const PORT = 3001

app.use(cors({
  origin: 'http://localhost:5173'
}))
app.use(express.json())

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'dog_breath_tracker'
})

app.get('/', (req, res) => {
  res.send('サーバーは正常に稼働中...')
})

app.post('/records', async (req, res) => {
  const { breathCount } = req.body

  const [result] = await db.execute(
    'INSERT INTO records (recorded_at, breath_count) VALUES (NOW(), ?)',
    [breathCount]
  )
  res.json({ id: result.insertId })
})

app.put('/records/:id', async (req, res) => {
  const { id } = req.params
  const { breathCount, memo } = req.body

  await db.execute(
    'UPDATE records SET breath_count = ?, memo = ? WHERE id = ?',
    [breathCount, memo, id]
  )
  res.json({ success: true })
})

app.delete('/records/:id', async (req, res) => {
  const { id } = req.params

  await db.execute('DELETE FROM records WHERE id = ?', [id])
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`サーバーがポートに${PORT}で起動しました`)
})

app.get('/records', async (req, res) => {
  const [rows] = await db.execute(
    'select * from records order by recorded_at desc'
  )
  res.json(rows)
})
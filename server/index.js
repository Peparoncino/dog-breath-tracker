import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.CLIENT_ORIGIN
}))
app.use(express.json())

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
})

app.get('/', (req, res) => {
  res.send('サーバーは正常に稼働中...')
})

app.post('/records', async (req, res) => {
  const { breathCount } = req.body

  const now = new Date()
  const jstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const formatted = jstNow.toISOString().slice(0, 19).replace('T', ' ')
  
  const [result] = await db.execute(
    'INSERT INTO records (recorded_at, breath_count) VALUES (?, ?)',
    [formatted, breathCount]
  )
  res.json({ id: result.insertId })
})

app.get('/records', async (req, res) => {
  const [rows] = await db.execute(
    'select * from records order by recorded_at desc'
  )
  res.json(rows)
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
const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'productos_db'
})

app.get('/productos', async (req, res) => {
  const connection = await pool.getConnection()
  const rows = await connection.query('SELECT * FROM productos')
  connection.release()
  res.json()
})

app.post('/productos', async (req, res) => {
  const { nombre, precio } = req.body
  const connection = await pool.getConnection()
  await connection.query('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, parseFloat(precio)])
  connection.release()
  res.redirect('/')
})

app.use(express.static(__dirname))

app.listen(port, () => {
  console.log(`El servidor está corriendo en http://localhost:${port}`)
})
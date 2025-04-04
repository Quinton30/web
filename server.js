const express = require('express')
const { Pool } = require('pg')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 5000

// PostgreSQL connection
/*const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'students',
  password: 'murimi',
  port: 5432, // Default PostgreSQL port
}) */

const pool = new Pool({
  user: 'students_fqe5_user',
  host: 'cvi01adrie7s73ebi45g-a.oregon-postgres.render.com',
  database: 'students_fqe5',
  password: 'Rqur05qinOVXKi1EEbi3wE8XOAHczozY',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Middleware

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public')) // Serve static files (HTML, CSS, JS)

// Route to handle form submission
app.post('/submit', async (req, res) => {
  const { name, email, age, dob } = req.body // Ensure field names match your HTML form

  if (!name || !email || !age || !dob) {
    return res.status(400).send('Error: All fields are required')
  }

  try {
    const result = await pool.query(
      'INSERT INTO students (name, email, age, dob) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, age, dob]
    )
    res.send('Data inserted successfully!')
  } catch (err) {
    console.error(err)
    res.status(500).send('Database error occurred.')
  }
})

// Route to get all data
app.get('/view-data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY id ASC')
    if (result.rowCount === 0) {
      return res.status(200).json([]) // Return empty array if no data
    }
    res.json(result.rows)
  } catch (err) {
    console.error('Database error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

//added endpoints
// Get distinct users (ID & Name) for dropdown
app.get('/get-distinct-users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT id, name FROM students ORDER BY name ASC'
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get user details by ID
app.get('/get-user-details', async (req, res) => {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'User ID is required' })

  try {
    const result = await pool.query(
      'SELECT id, name, email FROM students WHERE id = $1',
      [id]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'User not found' })

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update user data by ID
app.put('/modify-data', async (req, res) => {
  const { id, name, email } = req.body

  if (!id || !name || !email) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const result = await pool.query(
      'UPDATE students SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    )

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: 'User not found or no changes made' })
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      updatedUser: result.rows[0],
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');  // Ensure you're using mysql2/promise
const cors = require('cors');
const app = express();

const port = 8000;
app.use(bodyParser.json());
app.use(cors());

let conn = null;

// Initialize MySQL connection
const initMYSQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8820,
    });
};

// Test DB connection
app.get('/testdb', async (req, res) => {
    try {
        const [results] = await conn.query('SELECT * FROM users');
        res.json(results);
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Test DB with a specific query (example)
app.get('/testdbnew', async (req, res) => {
    try {
        const [results] = await conn.query('SELECT idx FROM users');
        res.json(results);
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /users - Fetch all users
app.get('/users', async (req, res) => {
    try {
        const [results] = await conn.query('SELECT * FROM users');
        res.json(results);
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /users - Create a new user
app.post('/users', async (req, res) => {
    try {
        let user = req.body;
        const results = await conn.query('INSERT INTO users SET ?', user);
        res.json({
            message: 'Create user successfully',
            data: results[0]
        });
    } catch (error) {
        console.error("error",error.Message)
        res.status(500).json({
            message: 'something went worng',
            errorMessage: error.message
        })
        
    }
});

// GET /user/:id - Fetch user by ID
app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('SELECT * FROM users WHERE idx = ?', id);
        if (results[0].length == 0) {

            throw {statusCode: 404, message: 'User not found'};
        }
        res.json(results[0][0]);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ 
            message: "something went wrong",
            errorMessage: error.message});
    }
});

// PUT /user/:id - Update user by ID
app.put('/user/:id', async (req, res) => {
    const id = req.params.id;
    const updateUser = req.body;

    try {
        const [results] = await conn.query('UPDATE users SET ? WHERE idx = ?', [updateUser, id]);
        if (results.affectedRows > 0) {
            res.json({
                message: 'Update user successfully',
                data: updateUser
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /user/:id - Delete user by ID
app.delete('/user/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const [results] = await conn.query('DELETE FROM users WHERE idx = ?', [id]);
        if (results.affectedRows > 0) {
            res.json({
                message: 'Delete user successfully'
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, async () => {
    await initMYSQL();
    console.log('Http Server is running on port ' + port);
});

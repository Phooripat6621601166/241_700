const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');  // Ensure you're using mysql2/promise
const cors = require('cors');
const app = express();
const port = 8000;
app.use(bodyParser.json());
app.use(cors());

let conn = null;
//งาน
// Initialize MySQL connection
const initMYSQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8820,
    });
}

const vallidateData = (userData) => {
    let errors =[]


    if (!userData.firstName) {
        errors.push('กรุณากรอกชื่อ')
    }
    if (!userData.lastName) {
        errors.push('กรุณากรอกนามสกุล')
    }
    if (!userData.age) {
        errors.push('กรุณากรอกอายุ')
    }
    if (!userData.gender) {
        errors.push('กรุณาเลือกเพศ')
    }
    if (!userData.interests) {
        errors.push('กรุณาเลือกความสนใจ')
    }
    if (!userData.description) {
        errors.push('กรุณากรอกคำอธิบาย')
    }
    return errors
}


const submitData =  async () => {
    let firstNameDOM = document.querySelector('input[name=firstname]');
    let lastNameDOM = document.querySelector('input[name=lastname]');
    let ageDOM = document.querySelector('input[name=age]');
    let genderDOM = document.querySelector('input[name=gender]:checked')||{}
    let interestDOMs = document.querySelectorAll('input[name=interest]:checked')||{}
    let descriptionDOM = document.querySelector('textarea[name=description]');

    let messageDOM = document.getElementById('message');

    try{
    let interest = '';
    for (let i = 0; i < interestDOMs.length; i++) {
        interest += interestDOMs[i].value 
        if (i < interestDOMs.length - 1) {
            interest += ',';
        }
    }

    let userData = {
        firstName: firstNameDOM.value,
        lastName:  lastNameDOM.value,
        age: ageDOM.value,
        gender: genderDOM.value,
        description: descriptionDOM.value,
        interests: interest
    }
    console.log('submitData',userData);

/*
    const errors = vallidateData(userData)
    if(errors.length > 0){
            //มี error
            throw {
            message:'กรุณากรอกข้อมูลให้ครบถ้วน',
            errors: errors
         }
    }
  */  
    const responce = await axios.post('http://localhost:8000/users',userData)
    console.log('responce',responce.data);
    messageDOM.innerText = 'บันทึกข้อมูลเรียบร้อย'
    messageDOM.className = 'message success'
} catch (error) {
    console.log('error message',error.message);
    console.log('error',error.errors);
     
    if (error.response){
        console.log('error',error.response.data.message)
        error.errors = error.response.data.errors
    } 

    let htmlData = '<div>'
    htmlData `<div> $ {error.message} + </div>`
    htmlData += '<ul>'
    for (let i = 0; i < error.error.length; i++){
        htmlData += `<li> ${error.errors[i]} + </li>`
    }
    htmlData += '</ul>'
    htmlData += '</div>'

        
    messageDOM.innerText = 'บันทึกข้อมูลไม่สำเร็จ'
    messageDOM.className = 'message danger'
    }
}

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
        const error = vallidateData(user)
        if (error.length > 0) {
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                errors: error
            };
        }
        const results = await conn.query('INSERT INTO users SET ?', user);
        res.json({
            message: 'Create user successfully',
            data: results[0]
        });
    } catch (error) {
        const errorMessages = error.message || 'Something went wrong'
        console.errors = error.errors || [] 
        console.error('error message:', error.message)
        res.status(500).json({
            message: errorMessages,
            errorMessage: errors
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

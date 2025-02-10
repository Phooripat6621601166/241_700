const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 8000;
app.use(bodyParser.json());

let users = []
let count = 1

/*
GET /users แสดงข้อมูล user ทั้งหมด
POST /user สร้างข้อมูล user ใหม่
Get /user/:id แสดงข้อมูล user ตาม id
PUT /user/:id แก้ไขข้อมูล user ตาม id
DELETE /user/:id ลบข้อมูล user ตาม id
*/




//path =  GET /users แสดงข้อมูล user ทั้งหมด
app.get('/users', (req, res) => {
   res.json(users);

})
//path: = POST /user สร้างข้อมูล user ใหม่

app.post('/user', (req, res) => {
    let user = req.body;
    user.id = counter
    counter += 1
    users.push(user);
    res.json({
        message: 'Create new user successfully',
        user: user
    });
})

app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;
    
    let selectIndex = users.findIndex(user =>  user.id == id)


    if (updateUser.firstname) {
        users[selectIndex].firstname = updateUser.firstname || users[selectIndex].firstname
    }
    if (updateUser.lastname) {
    users[selectIndex].lastname = updateUser.lastname || users[selectIndex].lastname
    }

    res.json({
        message: 'Update user successfully',
        data: {
            user: updateUser,
            indexUpdated: selectIndex
        }
    })
})

    app.delete('/user/:id', (req, res) => {
        let id = req.params.id;

        let selectIndex = users.findIndex(user => user.id == id)
        
        //ลบ
         users.splice[selectIndex, 1]
         res.json({
            message: 'Delete user successfully',
            indexDeleted: selectIndex
        })
    })


app.listen(port, (req,res) => {
    console.log('Http Server is running on port' + port)
});

//cd change directory
//ls list
//pwd print working directory
// cd.. กลับไปที่ directory ก่อนหน้า go back
// exit ออกจาก terminal
//docker stop <container id> หยุด container
//docker system prune -a ลบ container ทั้งหมด
//docker -compose up รัน container
//docker-compose down หยุด container
const express = require('express')

const app = express()
const mysql = require('mysql')
let listOfUsers = []

// for parsing json
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'sqluser', // change the user id
    password: 'password', // cahnge the password
    database: 'evstudios' // change the database name 
})

// create connection
db.connect(function(err) {
    if (!!err) {
        console.log(err)
    }else {
        console.log('connection established')
    }
})

// create database
app.get('/createdb', (req, res) => {
    let sql = "CREATE DATABASE evstudios"
    db.query(sql,(err) => {
        if (err) {
            console.error('Data base error')
        }
        res.send("Database created")
    })
})

// for create comapny table
app.get('/createCompanyTable', (req, res) => {
    let sql = `CREATE TABLE  
    company(companyId int not null auto_increment primary key,
        companyName VARCHAR(255));`
    db.query(sql, (err) => {
        if (err) {
            res.send('Cannot create Table an Error Occured' + err.message)
        }else{
        res.send('company Table created')
    }})
})

// for creating user table

app.get('/createUserTable', (req, res) => {
    let sql = `CREATE TABLE user(
        userId int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        userName VARCHAR(255),
        email VARCHAR(265),
        mobile int,
        PASSWORD VARCHAR(255),
        companyId int ,
        CONSTRAINT FOREIGN KEY (companyId)
        REFERENCES company(companyId)
      );`

    db.query(sql, (err) => {
        if (err) {
            res.send('An occured while creating the user table' + err.message)
        } else {
        res.send('user Table created')
    }})
})


// to Insert data into the company table

app.post('/users/insert', (req, res) => {
    const {user_name,email,mobile, password,companyId} = req.body
    const sql = `
    INSERT INTO user(userName,email,mobile,password,companyId)
    VALUES('${user_name}','${email}','${mobile}','${password}',' ${companyId}');
    `
    const getdata = `SELECT * from user;`
    db.query(getdata, (err, result) => {
        if (err) {
            res.send('Error: ' + err.message);
        } else {
            const response = result.filter(item => item.email.toLowerCase() === email.toLowerCase());

            if (response.length === 0) {
                db.query(sql, (err) => {
                    if (err) {
                        res.send('an error occurred while Insering data into the user Table' + err.message )
                    } else{
                    res.send('data inserted into the table successfully')}
                })
            } else {
                res.send('user already exists')
            }

        }
    })

   
})


// for inserting data into the company table
app.post('/company/insert' , async (req, res) => {
    const {companyName} = req.body
    const sql = `INSERT INTO company(companyName) VALUES ('${companyName}');`

    const getData = `SELECT * FROM company;`
    db.query(getData,(err,result) => {
        if (err) {
            res.send('Error' + err.message)
        } else {
            const response = result.filter(item => item.companyName.toLowerCase() === companyName.toLowerCase());
            if (response.length === 0) {
                db.query(sql, (err) => {
                        if (err) {
                            res.send('An erro occured while Insertinfg data into the company table ' + err.message)
                        }
                        res.send('data inserted into the table successfully')
                    })
            } else {
                res.send('company name already exists')
            }
        }
    })

    

})


// function to get the user by the company Id

app.get('/getUsers', (req, res) => {
    const {id} = req.headers
    
    const sql = `
    select * from user where companyId ='${id}';
    `
    db.query(sql, (err,results) => {
        if (err) {
            res.send('An error occured')
        } else {
            
            res.send(results)
        }
    })

})


app.listen(3004,()=> {
    console.log('listening on http://localhost')
})


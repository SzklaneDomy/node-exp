const express = require('express')
const morgan = require('morgan')
const port = 1337
const mysql = require('mysql')
const cookieParser = require('cookie-parser')
const app = express();
const bodyParser = require('body-parser')
const ejs = require('ejs')
const path = require('path')
const fileUpload = require('express-fileupload')

// app.use(express.static('./routes'))
// app.use(morgan('short'))
// app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'ejs');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'users',
    password: 'password',
    insecureAuth: true,
})


// index page
app.get('/', (req, res) => {
    res.render('pages/index');
})

//user list
let obj = {};
app.get('/users', (req, res) => {
        connection.query('SELECT * FROM users.user_info',(err,rows,fields) => {
            if(err){
                throw err;
            }else{
                obj = {print: rows};
                res.render('pages/user_list', obj)
            }
     });
})

// show user with ID 

 app.get('/user/:id', (req,res) => {
    
    const userId = req.params.id
    const queryString = 'SELECT * FROM users.user_info WHERE user_id = ?';
    
    connection.query(queryString,[userId],(err,rows,fields) => {
        if(err){
            throw err;
        }else{
            obj = {print: rows};
            res.render('pages/user', obj)
        }
    })

 });


app.get('/add', (req, res) => {
    res.render('pages/add_user')
})

//Add a user
app.post('/add/new_user', (req,res) => {
    console.log(`${req.body.new_first_name}  ${req.body.new_last_name}`)
    const newFirstName = req.body.new_first_name;
    const newLastName = req.body.new_last_name;
    
    const queryString = "INSERT INTO users.user_info (first_name, last_name) VALUES (?,?)"

    connection.query(queryString, [newFirstName, newLastName], (err,result,fields) => {
        if(err){
            console.log(err)
        }else{
            console.log(`new user with id ${result.insertId} created`);
            res.redirect('/users')
        }
    });
});

//Remove user
app.get('/delete', (req,res) => {
    res.render('pages/delete')
})
 
app.use('/delete/user_delete', (req,res) => {
    console.log(req.body.user_delete);
    const DelUserId = req.body.user_delete;
    const queryString = "DELETE FROM users.user_info where user_id = ?";

    connection.query(queryString, [DelUserId], (err,result,fields) => {
        if(err){
            console.log(err)
        }else{
            res.redirect('/users')
        }
    });
});

app.listen(port)
console.log(`Im running on port ${port}`)

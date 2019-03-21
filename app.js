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
    password: 'rootpasswordgiven',

})


// index page
app.get('/', (req, res) => {
    res.render('pages/index');
})

//user list
let obj = {};
app.get('/users', (req, res) => {
        connection.query('SELECT * FROM users.users_data',(err,rows,fields) => {
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
    const queryString = 'SELECT * FROM users.users_data WHERE id = ?';
    
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
    
    const queryString = "INSERT INTO users.users_data (first_name, last_name) VALUES (?,?)"

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
app.use('/users/delete', (req,res) => {

});

app.listen(port)
console.log(`Im running on port ${port}`)


// app.get('/', (req,res) => {
//     res.send('hello')
// });

// app.post('/user_create', (req,res) => {
//     console.log(`${req.body.create_first_name} ${req.body.create_last_name}`)
//     const newFirstName = req.body.create_first_name;
//     const newLastName = req.body.create_last_name;

//     const queryString = "INSERT INTO users.users_data (first_name, last_name) VALUES (?,?)"
//     connection.query(queryString, [newFirstName, newLastName], (err, results, fields) => {
//         if(err){
//             console.log(err)
//             res.sendStatus(500)
//         }

//         console.log(`Inserted new user with ID: ${results.insertId}`)
//         res.redirect('/users')
//         res.end()
//     })
// })

//  app.get('/user/:id', (req,res) => {
    
//     const userId = req.params.id
//     const queryString = 'SELECT * FROM users.users_data WHERE id = ?';
    
//     connection.query(queryString,[userId],(err,rows,fields) => {
//         res.json(rows)
//     })

//  });

//  const router = express.Router()
//  router.get('/messages', (req,res) => {
//      console.log('xDxdxD')
//      res.end()
//  })

//  app.use(router);

//  app.get('/users',(req,res) => {
//     connection.query('SELECT * FROM users.users_data',(err,rows,fields) => {
//         res.json(rows)
//     })

//  });


// app.listen(port, (e) => {
//     console.log(`im running on port ${port}`)
//     if(e){
//         console.log(`there is a problem : ${e}`)
//     }
// });


const express = require('express');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const e = require('express');
const app = express();
const port = 3001;

app.use(express.json());

//database design
let userId= 1;
let expenseId= 1;

const users=[{
    id: 1,
    username: 'john',
    password: '1234'
}];
const expense=[{
    id: 1,
    title: 'chicken',
    category: 'food',
    amount: 100,
    date: '2023-06-01'
}];

//create endpoints

app.post('/signup', (req, res) => {
    const username= req.body.username;
    const password= req.body.password;

    const userExists = users.find(u => u.username === username);
    if(userExists) {
        return res.status(401).json({message: 'User already exists'});
    }
    users.push({ id: userId++, username, password });
    res.status(201).json({ message: 'User created successfully' });

});
app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = users.find(u => u.username === username && u.password === password);
    if(!userExists) {
        return res.status(402).json({message: 'Invalid username or password'});
    }
    const token = jwt.sign({ id: userExists.id}, "nix123");
    res.status(200).json({ message: 'User signed in successfully', token });
});

app.post('/expense', middleware, (req, res) => {})


// read endpoints: 
app.get('/', middleware, (req, res) => {})

app.get('/expense', middleware, (req, res) => {})
app.get('/expense/:id', middleware, (req, res) => {})

app.get('/expense/total', middleware, (req, res) => {})
app.get('/expense/summary', middleware, (req, res) => {})

//update endpoints:
app.put('/expense/:id', middleware, (req, res) => {})

//delete endpoints:
app.delete('/expense/:id', middleware, (req, res) => {})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

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
const expenses=[{
    userId: 1,
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

app.post('/expense', middleware, (req, res) => {
    const { title, category, amount, date } = req.body;
    const userId = req.userId;
    if (!title || !category || amount == null || !date || !userId) {
        return res.status(400).json({
        message: "All fields are required (title, category, amount, date, userId)."
    });
}
    const newExpense = {
        userId: userId,
        id: expenseId++,
        title,
        category,
        amount: Number(amount),
        date
    };

    expenses.push(newExpense);
    res.status(201).json({ message: 'Expense created successfully', expense: newExpense });
})


// read endpoints: 
app.get('/', middleware, (req, res) => {
    res.send('/Users/nixonpaul/Code_learn/WebDev26/expense_tracker/Expense_tacker/frontend/dashboard.html');

})
app.get('/signup', (req, res) => {
    res.send('/Users/nixonpaul/Code_learn/WebDev26/expense_tracker/Expense_tacker/frontend/signup.html');
});
app.get('/signin', (req, res) => {
    res.send('/Users/nixonpaul/Code_learn/WebDev26/expense_tracker/Expense_tacker/frontend/signin.html');
});
app.get('/expense', middleware, (req, res) => {})
app.get('/expense/:id', middleware, (req, res) => {})

app.get('/expense/total', middleware, (req, res) => {})
app.get('/expense/summary', middleware, (req, res) => {})

//update endpoints:
app.put('/expense/:id', middleware, (req, res) => {})

//delete endpoints:
app.delete('/expense/:id', middleware, (req, res) => {
    const expenseId = parseInt(req.params.id);
    const userId = req.userId;

    const expenseIndex = expenses.findIndex(expense => expense.id === expenseId && expense.userId === userId);
    if(expenseIndex === -1){
        return res.status(401).json({message: 'expense not found or you are not authorized to delete this expense'});
    }

    expenses.splice(expenseIndex, 1);
    res.status(200).json({message: 'expense deleted successfully'});
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

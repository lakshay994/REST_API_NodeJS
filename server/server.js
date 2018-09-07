const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {User} = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((result) => {
        res.send(result)
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.listen(3000, () => {
    console.log('Server listening at port 3000....');
});
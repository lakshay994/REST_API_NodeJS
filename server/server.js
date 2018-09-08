const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {User} = require('./models/user');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((result) => {
        res.send(result);
        console.log(result);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }).catch((e) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req,res) => {
    let id = req.params.id;

    // validate the user id
    if(!ObjectID.isValid(id)){
        console.log('Invalid id');
        return res.status(404).send();
    }
    
    Todo.findById(id).then((todo) => {
        if(!todo){
            console.log('No data found for the corresponding id');
           return res.status(400).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(404).send();
    });
});

app.listen(port, () => {
    console.log(`Server listening at port ${port}....`);
});

module.exports = {
    app: app
}
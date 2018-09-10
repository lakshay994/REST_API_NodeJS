const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    let todo = new Todo({
        text: req.body.text,
        _created: req.user._id
    });

    todo.save().then((result) => {
        res.send(result);
        console.log(result);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _created: req.user._id
    }).then((todos) => {
        res.send({todos});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate, (req,res) => {
    let id = req.params.id;

    // validate the user id
    if(!ObjectID.isValid(id)){
        console.log('Invalid id');
        return res.status(404).send();
    }
    
    Todo.findOne({
        _id: id,
        _created: req.user._id
    }).then((todo) => {
        if(!todo){
            console.log('No data found for the corresponding id');
           return res.status(400).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(404).send();
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;

    // validate the user id
    if(!ObjectID.isValid(id)){
        console.log('Invalid id');
        return res.status(404).send();
    }
    
    Todo.findOneAndRemove({
        _id: id,
        _created: req.user._id
    }).then((todo) => {
        if(!todo){
            console.log('No data found for the corresponding id');
           return res.status(400).send();
        }
        res.status(200);
    }).catch((e) => {
        res.status(404).send();
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        console.log('Invalid id');
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime()
    }
    else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _created: req.body._id
    }, {$set: body}, {new: true}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        return res.status(400).send();
    })
});

app.post('/users', (req, res) => {
    
    let user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save().then(() => {
        return user.genearateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {

    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        res.send(user);
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {

    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Server listening at port ${port}....`);
});

module.exports = {
    app: app
}
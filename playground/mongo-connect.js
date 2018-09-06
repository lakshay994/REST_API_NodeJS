const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
    if(err){
        return console.log('Could not connect to Mongo Database');
    }
    console.log('Connect to Database');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Could not connect to Mongo Database');
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('Users').insertOne({
        name: 'Lakshay Sharma',
        age: 23,
        location: 'Pleasanto, CA'
    }, (err, result) => {
        if(err){
            return console.log('Could not add to collection');
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    client.close();
});
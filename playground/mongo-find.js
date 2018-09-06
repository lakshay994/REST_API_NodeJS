const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUmlParser: true}, (err, client) => {
    
    if(err){
        return console.log('Error connectiong to the the database....');
    }

    console.log('Connected to the database....');
    const db = client.db('TodoApp');

    db.collection('Users').find({location: 'San Francisco, CA'}).toArray().then((results) => {
        console.log('Data: ', results);
    }, (err) => {
        console.log('Could not fetch data');
    });


});
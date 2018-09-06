const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUmlParser: true}, (err, client) => {
    
    if(err){
        return console.log('Error connectiong to the the database....');
    }

    console.log('Connected to the database....');
    const db = client.db('TodoApp');

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5b910e035d91380848d14246')
    }).then((result) => {
        console.log(result);
    });

});
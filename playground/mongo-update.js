const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {

    if(err){
        return console.log('Could not connect to database');
    }

    console.log('Connected to database');
    const db = client.db('TodoApp');

    db.collection('Users').findOneAndUpdate(
        {
            _id: new ObjectID('5b910df14d4b1f08474c4f34')
        },
        {
            // $set: {
            //     location: 'SF'
            // }
            $inc: {
                age: 1
            }
        },
        {
            returnOriginal: false
        }
    ).then((result) => {
        console.log(result);
    });
});
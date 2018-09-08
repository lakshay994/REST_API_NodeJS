const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server')
const {Todo} = require('./../models/todos');

const TodoData = [
    {
        _id: new ObjectID(),
        text: 'Todo test1'
    },
    {
        _id: new ObjectID(),
        text: 'Todo test2'
    }
];

beforeEach((done) => {
    Todo.deleteMany({}, () => {}).then(() => {
        return Todo.insertMany(TodoData, () => {});
    }).then(() => done());
});

describe('TODO Post Request', () => {
    it('should create a new Todo', (done) => {
        let text = 'Test test1';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    console.log(res.body);
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });

    it('should not insert invalid data to the database', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });
});

describe('/GET request', () => {

    it('should return a Todo', (done) => {

        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('/GET request by ID', () => {
    
    it('should return Todo object', (done) => {
        request(app)
            .get(`todos/${TodoData[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(TodoData[0].text);
            })
            .end(done);
    });
});
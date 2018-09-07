const mongoose = require('mongoose');

const Todo = mongoose.model('Todo',{
    text: {
        type: String,
        require: true,
        minLength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: true
    },
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = {
    Todo: Todo
}
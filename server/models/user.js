const mongoose = require('mongoose');

const User = mongoose.model('User', {
    email: {
        type: String,
        require: true,
        minLength: 1,
        trim: true
    }
});

module.exports = {
    User: User
}
const mongoose = require('mongoose');

module.exports = mongoose.model('Subscription', {
    email: {
        type: String,
        required: true,
    },
    stamp: {
        type: Date,
        required: true,
    },
});

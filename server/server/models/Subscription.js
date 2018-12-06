const mongoose = require('mongoose');

module.exports = mongoose.model('Subscription', {
    email: {
        type: String,
        required: true,
    },
    wantTest: {
        type: Boolean,
        required: true,
    },
    wantMessage: {
        type: Boolean,
        required: true,
    },
    stamp: {
        type: Date,
        required: true,
    },
});

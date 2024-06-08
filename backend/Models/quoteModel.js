const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    author: {
        type: String
    },
    quoteText: {
        type: String,
        required: true,
    },
    date: {
        type: Date
    },
})
module.exports = mongoose.model('Quote', quoteSchema);
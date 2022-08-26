const mongoose = require('mongoose');


const counterSchema = new mongoose.Schema({
    value: String
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = {
    Counter
}
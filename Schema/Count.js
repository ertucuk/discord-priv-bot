const mongoose = require('mongoose');

const model = mongoose.model("Ertu-Count", mongoose.Schema({
    count: Number,
}))

module.exports = model;
const mongoose = require('mongoose');

const model = mongoose.model("Ertu-SecretRoom", mongoose.Schema({
    id: String,
    ownerId: String,
}))

module.exports = model;
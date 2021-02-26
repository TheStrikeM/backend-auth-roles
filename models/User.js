const {Schema, model} = require("mongoose")

const User = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'Role'}]
})

module.exports = model("User", User)
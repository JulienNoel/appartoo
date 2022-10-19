const mongoose = require("mongoose");

const friendSchema = mongoose.Schema({
    name: String,
    img: String,
})

const userSchema = mongoose.Schema({
    token : String,
    name : String,
    password: String,
    img: String,
    role: String,
    friend: [friendSchema]
    
});



const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
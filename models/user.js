const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    token : String,
    name : String,
    password: String,
    img: String,
    role: String,
    
});



const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"First name must be required."]
    },
    lastName:{
        type:String,
        required:[true,"Last name must be required."]
    },
    regNumber:{
        type:Number,
        required:[true,"Registration number must be required."],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password must be required."]
    },
    role:{
        type:String,
        enum:["librarian","teacher","student"],

    }
},{timestamps:true})

const User = mongoose.model("User",userSchema);
module.exports = User;
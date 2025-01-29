const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title must be included."]
    },
    author:{
        type:String,
        required:[true,"Author must be included."]
    },
    ISBN:{
        type:String,
        required:[true,"ISBN must be included."],
        unique:true
    },
    genre:{
        type:[String],
        required:true
    },
    publicationYear:{
        type:Number,
        required:[true,"Publication date must be included."],
        min:1500,
        max:new Date().getFullYear()
    }
},{timestamps:true})

const Book = mongoose.model("Book",bookSchema);
module.exports = Book;
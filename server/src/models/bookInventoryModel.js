const mongoose = require('mongoose');

const bookInventorySchema = new mongoose.Schema({
    bookID:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true],
        ref:"Book"
    },
    totalNumberOfBooks:{
        type:Number,
        required:true
    },
    currentNoOfBooks:{
        type:Number,
        required:true,
        default:function(){
            return this.totalNumberOfBooks;
        }
    }
},{timestamps:true});

const BookInventory = mongoose.model("BookInventory",bookInventorySchema);
module.exports = BookInventory;
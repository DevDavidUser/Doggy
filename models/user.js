const mongoose= require("mongoose");

const dogSchema = new mongoose.Schema({
    name:String
});
const Dog = mongoose.model('Dog',dogSchema);;
const userSchema = new mongoose.Schema({
    name:String,
    date:Date,
    dogs:[dogSchema]
});
const User = mongoose.model('User',userSchema);

module.exports=User;

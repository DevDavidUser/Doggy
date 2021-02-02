const mongoose= require("mongoose");

const adminSchema = new mongoose.Schema({
    idadmin:Number,
    name:String,
    date:Date,
    password:String
});
const Admin = mongoose.model('Admin',adminSchema);;

module.exports=Admin;

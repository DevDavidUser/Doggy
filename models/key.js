const mongoose= require("mongoose");

const userKey = new mongoose.Schema({
    word:String
});
const Key = mongoose.model('Key',userKey);

module.exports=Key;
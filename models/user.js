var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    email: {type: String, required:true},
    password: {type: String, required:true}
});

userSchema.methods.encryptPassword = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5),null);
};

userSchema.methods.vaildPassword = (password,hash)=>{
    return bcrypt.compareSync(password, hash);
};

module.exports = mongoose.model('User',userSchema);
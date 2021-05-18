const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 30
    },
    user_name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: true,
        min:3
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    hash_password: {
        type: String,
        required: true
    },
    userinfo: {
        type: String,
        trim: true,
    },
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    },
    profile: {
        type: String
    },
    contact: {
        type: String
    }
}, { timestamps: true })

UserSchema.virtual('password')
.set(function(password){
    this.hash_password = bcrypt.hashSync(password, 10);
});

UserSchema.virtual('fullName')
.get(function(){
    return `${this.firstName} ${this.lastName}`
})

UserSchema.methods = {
    authenticate: function(password){
        return bcrypt.compareSync(password, this.hash_password); 
    }
}


module.exports = mongoose.model("User", UserSchema);
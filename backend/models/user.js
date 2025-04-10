const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcrypt');
const user = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
},{timestamps: true})

user.statics.signup = async function(username, email, password) {
console.log(username,email, password);
    if(!username || !email || !password) {
        throw Error('All fields must be filled');
    }
    const emailExists = await this.findOne({ email });
    if(emailExists) {
        throw Error('Email already in use');
    }
    const usernameExist = await this.findOne({ username });
    if (usernameExist) {
        throw Error('Username already in use');
    }
    if(!validator.isEmail(email)) {
        throw Error('Enter an email');
    }
    if(!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await this.create({ username, email, password: hash });
    return user;
}

user.statics.login = async function(email, password) {
    if(!email || !password) {
        throw Error('All fields must be filled');
    }
    const user = await this.findOne({ email });
    if(!user) {
        throw Error('Incorrect email');
    }
    const match = await bcrypt.compare(password, user.password);
    if(!match) {
        throw Error('Incorrect password');
    }
    return user;
}
module.exports = mongoose.model('User',user);
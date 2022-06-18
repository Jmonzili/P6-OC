const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator")

// Contenu d'un Utilisateur
const userSchema = mongoose.Schema( {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator)

//Utilisateur
const User = mongoose.model("User", userSchema);

module.exports = { userSchema, User }
const mongoose = require("mongoose");

// Contenu d'un produit sauce
const sauceSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
});
const Sauce = mongoose.model("Sauce", sauceSchema)

module.exports = { Sauce }
const fs = require("fs")
const { Sauce } = require("../models/sauce.model")

// Affichage de toutes les sauces dans la data base
function getAllSauces(req, res) {
    Sauce.find({})
      .then((sauces) => res.json(sauces))
      .catch(error => res.status(404).send(error))
}

// Séléctionné une sauce
function getSauce(req, res) {
    const { id } = req.params
    return Sauce.findById(id)
}

// Affichage de la sauce Sélectionné
function getSauceById(req, res) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => res.status(200).json(sauce))
      .catch((error) => res.status(404).json({ error }));
}

// Supprimer produit
function deleteSauce(req, res) {
    Sauce.findById({ _id: req.params.id })
      .then((sauce) => {
            if (!sauce) {
                return res.status(404).send({ 
                    error: new Error("Object not found in database")
                })
            }
    // Autorisation De supprimer la sauce
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).send({ message: 'Requête non autorisée !' })
            }
            const fileToDelete = sauce.imageUrl.split("/").at(-1)
            fs.unlink("images/" + fileToDelete, () => {
                Sauce.deleteOne({ _id: req.params.id })
                  .then(() => res.status(200).json({ message: "Sauce supprimé!" }))
                  .catch((error) => res.status(400).json({ error }));
            })
        })
        .catch((err) => res.status(500).send({ err }))
}

// Modifier produit
function modifySauce(req, res) {
// Autorisation de modifier la sauce
    const { body } = req
    console.log("req.joky:", body)
    if (body.userId  == req.auth.userId || body.sauce.userId == req.auth.userId) {
        return res.status(401).send({ message: 'Requête non autorisée !' })
    }
    const sauceObject = req.file ? {
        ...JSON.parse(body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    }
      : { ...body };
    
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modifié!" }))
      .catch((error) => res.status(400).json({ error }));
}

// Vérifie si le produit est bien dans la database
function sendClientResponse(product, res) {
// Si le produit n'est pas trouver
    if (!product) {
        return res.status(404).send({ 
            error: new Error("Object not found in database")
        })
    }
    
// Renvoi le produit qui correspond depuis la database
    return Promise.resolve(res.status(200).send(product)).then(() => product)
}

// Création du produit sauce ajouté par le client
function createSauce(req, res) {
    const sauceObject = JSON.parse(req.body.sauce); // Analyse la chaine de caractère et intègre la valeur Javascript
    delete sauceObject._id; // Ont enleve l'ID du corps de la requête car il sera généré par mongoDB
  
    const sauce = new Sauce({
      // Création d'une nouvelle instance de mon modèle sauce
      ...sauceObject, // L'opérateur spread ... copie les champs du corps de la requête
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
      // Initialisation des données
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    });
    sauce
      .save() // On enregistre l'objet dans la BDD
      .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
      .catch((error) => res.status(400).json({ error }));
}

// Fonction des Likes
function likeSauce(req, res) {
    const { like, userId } = req.body
// Condition en cas d'erreur si la valeur du vote est invalide
    if (![1, 0, -1].includes(like)) return res.status(403),send({ message: "Invalid like value" })

    getSauce(req, res)
      .then((product) => updateVote(product, like, userId, res))
// Envois dans la database
      .then((prod) => prod.save())
// Récupere les données du produit à liké ou disliké dans la database
      .then((likesProduct) => sendClientResponse(likesProduct, res))
      .catch((err) => res.status(500).send(err))
}

// Fonction de mise à jour des votes
function updateVote(product, like, userId, res) {

    if (like === 1 || like === -1) return addVote(product, userId, like)
    return resetVote(product, userId, res)
}

// Fontion d'anulation du vote like = 0
function resetVote(product, userId, res) {
    const { usersLiked, usersDisliked } = product

// Erreur si le userId est dans les 2 array de users
    if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
    return Promise.reject("User seems to have voted both ways")

// Si le userId est dans aucun des array de users
    if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId))) 
    return Promise.reject("User seems to have not voted")

// Suppression de l'id dans l'array de usersLiked ou usersDisliked
    if (usersLiked.includes(userId)) {
        --product.likes
        product.usersLiked = product.usersLiked.filter((id) => id !== userId)
    } else {
        --product.dislikes
        product.usersDisliked = product.usersDisliked.filter((id) => id !== userId)
    }
    return product
}

// Fonction d'ajout du like ou Dislike
function addVote(product, userId, like) {
    const { usersLiked, usersDisliked } = product
// Vérification de l'array a updater
    const votersArray = like === 1 ? usersLiked : usersDisliked

// Condition si l'utilisateur a déjà liké
    if (votersArray.includes(userId)) return product
// Envoi de l'id du user dans usersLiked
    votersArray.push(userId)

// Ajout du like ou du dislike
    like === 1 ? ++product.likes : ++product.dislikes
    return product
}

// Envois des fonctions a exporté dans l'app
module.exports = { getAllSauces, createSauce, getSauceById, deleteSauce, modifySauce, likeSauce }
const { User } = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// Création d'un utilisateur
async function createUser(req, res) {
  try { 
    const { email, password } = req.body
    const hashedPassword = await hashPassword(password)
// Récupération de l'email et du password dans la requete
    const user = new User({ email, password: hashedPassword});
// Sauvegarde du user dans la database
    await user.save()
    res.status(201).send({ message: "Utilisateur enregistré !" })
  }
// En cas d'erreur renvoi d'un code 409
  catch(err) {
    res.status(409).send({ message: "User non enregistré:" + err })
  }
}

// Cryptage du MDP via bcrypt
function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds)
}

// Connection d'un utilisateur
async function logUser(req, res) {
  try { 
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne( {email: email})
  
// Vérification MDP
    const passwortCtrl = await bcrypt.compare(password, user.password)
// Condition en cas de mot de passe incorrect
    if (!passwortCtrl) {
      return res.status(403).send({ error: 'Mot de passe incorrect !' });
    }
// Création du token via la fonction 
    const token = createToken(email)
    res.status(200).send({ userId: user._id, token: token})
  }
// Renvoi de l'erreur et d'un code 500
  catch(err) {
    console.error(err)
    res.status(500).send({ message: "Erreur de connexion" })
  }
}

// Fonction de création TOKEN
function createToken(email) {
// Récupération du password token dans le fichier env
  const jwtPassword = process.env.JWT_PASSWORD
//
  return jwt.sign({email: email}, jwtPassword, { expiresIn: "24h" })
}

module.exports = {createUser, logUser}
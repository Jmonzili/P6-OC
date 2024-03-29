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
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              //`${process.env.JWT_PASSWORD}`,
              process.env.JWT_PASSWORD,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
  .catch(error => res.status(500).json({ error }));
}

module.exports = {createUser, logUser}
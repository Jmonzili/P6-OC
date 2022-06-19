const jwt = require("jsonwebtoken")

// Authentification par le TOKEN
function authenticateUser(req, res, next) {
    const header = req.header("Authorization")
// Condition en cas d'absence de l'header authorization
    if (header == null) return res.status(403).json({ message: "Invalid" })

// Récupérer le token dans le header authorization
    const token = header.split(" ")[1]
// Condition en cas des token non valide
    if (token == null) return res.status(403).json({ message: "Invalid" })

//  Décodage du token via la clef secret
    jwt.verify(token, process.env.JWT_PASSWORD,(err, decoded) => {
    //  Condition en cas d'erreur 
        if (err) return res.status(403).json({ message: "Token invalid" + err })
    //  Continue si token validé
        next()
    })
}

module.exports = { authenticateUser }

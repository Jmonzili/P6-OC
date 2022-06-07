const jwt = require("jsonwebtoken")

// Authentification par le TOKEN
function authenticateUser(req, res, next) {
    const header = req.header("Authorization")
// Vérification
    if (header == null) return res.status(403).json({ message: "Invalid" })
// Vérification
    const token = header.split(" ")[1]
    if (token == null) return res.status(403).json({ message: "Invalid" })
// Vérification
    jwt.verify(token, process.env.JWT_PASSWORD,(err, decoded) => {
        if (err) return res.status(403).json({ message: "Token invalid" + err })
        next()
    })
}

module.exports = { authenticateUser }

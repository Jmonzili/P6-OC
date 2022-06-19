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
    console.log({ decoded })
    next()
  })
}

module.exports = { authenticateUser }

/*
, authenticateUserAdmin

function authenticateUserAdmin(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token,`${process.env.JWT_PASSWORD}`);
        const userId = decodedToken.userId;
    
        // Vérification de la concordance entre les clés utilisateurs
        if (req.body.userId && req.body.userId !== userId) {
          throw 'User ID non valable !';
        } else {
          next();
        }
      } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
      }
}


  
*/
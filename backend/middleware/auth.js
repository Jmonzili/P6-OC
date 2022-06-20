const jwt = require("jsonwebtoken")

// Authentification par le TOKEN
function authenticateUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
  // Décodage du token via la clef secret
    const decodedToken = jwt.verify(token, `${process.env.JWT_PASSWORD}`);
    const userId = decodedToken.userId;
    req.auth = { userId };

// Vérification de la concordance entre le userId de la requete et du userId décodé
// Bloqué si ils sont différent
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable !';
    } else { 
// Poursuivre si ils sont identique
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée !'});
  }
}

module.exports = { authenticateUser }
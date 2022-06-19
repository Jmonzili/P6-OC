const jwt = require("jsonwebtoken")

// Authentification par le TOKEN
function authenticateUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${process.env.JWT_PASSWORD}`);
    const userIdDecodedToken = decodedToken.userId;

    // Vérification de la concordance entre les clés utilisateurs
    if (req.body.userId && req.body.userId !== userIdDecodedToken) {
      throw 'User ID non valable !';
    }
    next();
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée !' });
  }
}

module.exports = { authenticateUser }
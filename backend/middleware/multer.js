const multer = require("multer")

// Envoi de la photo charger par le client dans le serveur
const storage = multer.diskStorage({
    destination: "images/",
    filename: function (req, file, callback) {
      callback(null, makeFileName(req, file))
    }
})

// Création du nom de l'image ajouté
function makeFileName(req, file) {
    const fileName = `${Date.now()}-${file.originalname}`
    file.filename = fileName
    return fileName
}

const upload = multer({ storage })

module.exports = { upload }
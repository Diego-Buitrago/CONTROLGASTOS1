const jwt = require('jsonwebtoken');
const { cnn_mysql } = require('../database/database');

const verifyToken = async (req, res, next) => {
    try {
        const authorization = req.get("Authorization");
        let token = ''

        if (authorization && authorization.toLowerCase().startsWith('bearer')) {
            token = authorization.substring(7)
        }
    
        if (!token) return res.status(403).json({message: "Autorización invalida"})
    
        const decoded = jwt.verify(token, process.env.SECRET)
    
        const [rows] = await cnn_mysql.promise().execute(`SELECT usu_id FROM tbl_usuarios WHERE usu_id = ? AND usu_correo = ? AND est_id = 1`, [ decoded.id, decoded.correo ]);
      
        if (rows.length) {
            req.idusurio = decoded.id
            req.nombreusuario = decoded.nombreusuario
            req.perfil = decoded.perfil
            next()
        } else {
            res.status(401).json(false)
        }
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = verifyToken;
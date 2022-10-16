const express = require('express');
const router = express.Router();
const { cnn_mysql } = require('../database/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/authjwt');

router.post('/api/iniciarSesion', async(req, res) => {
  const { usuario, clave } = req.body;
  
  try {
    const [rows] = await cnn_mysql.promise().execute(`SELECT usu_clave, usu_id, usu_nombre, usu_apellido, usu_correo, prf_id FROM tbl_usuarios WHERE (usu_correo = ? OR usu_usuario = ?) AND est_id = 1`, [ usuario, usuario]);

    if (rows.length == 0) {
      return res.status(401).json({mensaje: 'Correo electronico o contraseña incorrectos'});
    } else {
        
      const matchPassword = await bcrypt.compare(clave, rows[0].usu_clave);

      if(matchPassword) {
        delete rows[0].usu_clave;
        const userToken = {
          id: rows[0].usu_id,
          correo: rows[0].usu_correo,
          nombreusuario: `${rows[0].usu_nombre} ${rows[0].usu_apellido}`.trim(),
          perfil: rows[0].prf_id,
        }

        const token = jwt.sign(userToken, process.env.SECRET, {expiresIn: 60*60*24});

        return res.json({
          usunombre: `${rows[0].usu_nombre} ${rows[0].usu_apellido}`.trim(),
          token
        });
      } else {
        return res.status(401).json({mensaje: "Correo electronico o contraseña incorrectos"});
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/api/verificarToken', async(req, res) => {

  const authorization = req.get("Authorization");
  let token = ''

  try {
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
      token = authorization.substring(7)
    }

    if (!token) return res.status(401).send(false)

    const decoded = jwt.verify(token, process.env.SECRET)

    const [rows] = await cnn_mysql.promise().execute(`SELECT usu_id FROM tbl_usuarios WHERE usu_id = ? AND usu_correo = ? AND est_id = 1`, [ decoded.id, decoded.correo ]);

    if (rows.length) {
      res.send(true)
    } else {
      res.status(401).send(false)
    }
    
  } catch (error) {
    console.log(error)
    res.status(401).send(false)
  } 
  
});

router.post('/api/listarUsuarios', verifyToken, async (req, res) => {
 
  const { data } = req.body
  try {
    let resultados = {
      info: {},
      results:{}
    }

    //limite paginacion
    const limite = data.results
    const offset = (data.page-1)*limite
  
    //Filtros de ordenamiento
    const dir = data.sortOrder === 'ascend'|| data.sortOrder === undefined ? 'ASC' : 'DESC';    
    const orden = data.sortField === undefined ? 'nombre' : data.sortField;    
    const ord = `ORDER BY ${orden} ${dir}`;

    //Filtros Buscar
    const nombre = data.nombre==undefined?'':data.nombre
    const apellido = data.apellido==undefined?'':data.apellido
    const correo = data.correo==undefined?'':data.correo
 
    //query
    const [ rows ] = await cnn_mysql.promise().execute(`SELECT u.usu_id id, u.usu_nombre nombre, u.usu_apellido apellido, u.usu_correo correo, e.est_nombre estado FROM tbl_usuarios u JOIN tbl_estados e ON u.est_id = e.est_id WHERE u.est_id != 3 AND (u.usu_nombre LIKE REPLACE ('%${nombre}%', ' ', '%') OR '${nombre}' IS NULL OR '${nombre}' = '') AND (u.usu_apellido LIKE REPLACE ('%${apellido}%', ' ', '%') OR '${apellido}' IS NULL OR '${apellido}' = '') AND (u.usu_correo LIKE REPLACE ('%${correo}%', ' ', '%') OR '${correo}' IS NULL OR '${correo}' = '') ${ord} limit ${limite} OFFSET ${offset}`);

    const [ rows2 ] = await cnn_mysql.promise().execute(`SELECT count(distinct usu_id) tot FROM tbl_usuarios u JOIN tbl_estados e ON u.est_id = e.est_id WHERE u.est_id != 3 AND (u.usu_nombre LIKE REPLACE ('%${nombre}%', ' ', '%') OR '${nombre}' IS NULL OR '${nombre}' = '') AND (u.usu_apellido LIKE REPLACE ('%${apellido}%', ' ', '%') OR '${apellido}' IS NULL OR '${apellido}' = '') AND (u.usu_correo LIKE REPLACE ('%${correo}%', ' ', '%') OR '${correo}' IS NULL OR '${correo}' = '')`);     
    
    resultados.info.page = data.page,
    resultados.info.results =  rows.length
    resultados.info.total = rows2[0].tot  
    resultados.results= rows
    return res.json(resultados); 
    
  } catch (error) {
    console.log(error);
  }
});

router.post('/api/guardarUsuario', verifyToken, async(req, res) => {

  const { nombre, apellido, correo, usuario, clave, estado, id } = req.body;
  const { idusurio, nombreusuario } = req;

  const wh = id > 0 ? `AND usu_id != ${id}` : ''

  try {
    const [rows] = await cnn_mysql.promise().execute(`SELECT usu_correo FROM tbl_usuarios WHERE usu_correo = '${correo}' AND est_id !=3 ${wh}`);

    if (rows.length) {
      res.status(500).json({mensaje: `Ya existe un usuario con el correo ${correo}. Verificar`})
    } else {

      if (id == 0) {

        const salt = await bcrypt.genSalt(10)
        const text = await bcrypt.hash(clave, salt)
        
        const [rows2] = await cnn_mysql.promise().execute('INSERT INTO tbl_usuarios(usu_nombre, usu_apellido, usu_correo, usu_usuario, usu_clave, est_id, usu_creacion, usu_fecha_registro, usu_usu_act, usu_fec_act) VALUES(?,?,?,?,?,?,?,CURRENT_TIMESTAMP(),?,CURRENT_TIMESTAMP())', [ nombre, apellido, correo, usuario, text, estado, idusurio, nombreusuario ]);
  
        if (rows2.affectedRows > 0) res.json({id: rows2.insertId, mensaje: `Usuario ${nombre} Creado Correctamente`})

      } else {
        const [rows2] = await cnn_mysql.promise().execute('UPDATE tbl_usuarios SET usu_nombre = ?, usu_apellido = ?, usu_correo = ?, usu_usuario = ?, est_id = ?,  usu_usu_act = ?, usu_fec_act = CURRENT_TIMESTAMP() WHERE usu_id = ?', [ nombre, apellido, correo, usuario, estado, nombreusuario, id]);

        if (clave !== undefined) {
          const salt = await bcrypt.genSalt(10)
          const text = await bcrypt.hash(clave, salt)

          const [rows3] = await cnn_mysql.promise().execute('UPDATE tbl_usuarios SET usu_clave = ? WHERE usu_id = ?', [ text, id ]);
        }
        
        if (rows2.affectedRows > 0) res.json({id: id, mensaje: `Usuario ${nombre} Modificado Correctamente`})
      }
    }

  } catch (e) {
    console.log(e)
    res.status(500).json({mensaje: "Error en el servidor"});
  }
});

router.get('/api/getUsuario', verifyToken, async(req, res) => {
  const { id } = req.query;

  try {
    const [rows] = await cnn_mysql.promise().execute(`SELECT usu_nombre nombre, usu_apellido apellido, usu_correo correo, usu_usuario usuario, est_id estado FROM tbl_usuarios WHERE usu_id = ?`, [ id ]);
    
    res.json(rows[0]);
    
  } catch (error) {
    res.status(500).json({mensaje: 'Error en el servidor contacta al administrador del sistema'})
    console.log(error);
  }   
});

router.put('/api/eliminarUsuario', verifyToken, async(req, res) => {
  const { id } = req.body;
  const { nombreusuario } = req;

  try {
    const [rows] = await cnn_mysql.promise().execute('UPDATE tbl_usuarios SET est_id = ?,  usu_usu_act = ?, usu_fec_act = CURRENT_TIMESTAMP() WHERE usu_id = ?', [ 3, nombreusuario, id ]);

    if (rows.affectedRows > 0) res.json({mensaje: 'Usuario Eliminado Correctamente'});
    
  } catch (error) {
    res.status(500).json({mensaje: 'Error en el servidor contacta al administrador del sistema'})
    console.log(error);
  }   
});

module.exports = router
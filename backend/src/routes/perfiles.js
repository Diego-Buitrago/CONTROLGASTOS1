const express = require('express')
const router = express.Router()
const {cnn_mysql} = require('../database/database');
const verifyToken = require('../middlewares/authjwt');

router.get('/api/cargarMenu', verifyToken, async(req, res) => {
  const { perfil } = req;
  
  try { 
    const [ rows ] = await cnn_mysql.promise().execute(`SELECT prf_ventanas FROM tbl_perfiles WHERE prf_id = ?`, [ perfil ]);
     
    const [ rows2 ] = await cnn_mysql.promise().execute(`SELECT v.ven_id id, v.ven_descripcion descripcion, v.ven_padre padre, v.ven_url url, v.ven_icono icono, v.ven_nombre nombre, v.ven_tipo tipo, (SELECT COUNT(ven_id) FROM tbl_ventanas WHERE ven_padre = v.ven_id) can FROM tbl_ventanas v WHERE v.ven_id IN (${rows[0].prf_ventanas}) ORDER BY v.ven_orden`);
            
    res.json(rows2);
      
  } catch (error) {
    console.log(error);
  }   
});

router.post('/api/listarPerfiles', async (req, res) => {

  try {
    const [rows] = await cnn_mysql.promise().execute('SELECT p.prf_id id, p.prf_nombre nombre, e.est_nombre estado, concatModulos(p.prf_ventanas) modulos FROM tbl_perfil p JOIN tbl_estados e ON p.est_id = e.est_id WHERE p.est_id != 3');
    
    return res.json(rows); 
    
  } catch (error) {
    console.log(error);
  }
});

router.get('/api/ventanas', async(req, res) => {

  try {
    const [rows] = await cnn_mysql.promise().execute(`SELECT ven_id id, ven_descripcion nombre FROM tbl_ventanas`);
    
    res.json(rows);
    
  } catch (error) {
    console.log(error);
  }     
});

router.post('/api/guardarPerfil', async(req, res) => {
  const { nombre, estado, modulos, usuarios, id } = req.body;

  const wh = id > 0 ? `AND prf_id != ${id}` : ``;

  try {

    const [rows] = await cnn_mysql.promise().execute(`SELECT prf_id FROM tbl_perfil WHERE prf_nombre = '${nombre}' AND est_id != 3 ${wh}`);

    if (rows.length) {
      res.status(500).json({mensaje: `Ya existe un perfil con el nombre ${nombre}. Verificar`});
    } else {

      if (id > 0) {
        const [rows2] = await cnn_mysql.promise().execute('UPDATE tbl_perfil SET prf_nombre = ?, est_id = ?, prf_ventanas = ?, prf_usu_act = ?, prf_fec_act = CURRENT_TIMESTAMP() WHERE prf_id = ?', [ nombre, estado, modulos, usuarios, id ]);
  
        if (rows2.affectedRows > 0) {        
          res.json({mensaje: `Perfil ${nombre} Modificado Correctamente`});
        }

      } else {

        const [rows2] = await cnn_mysql.promise().execute('INSERT INTO tbl_perfil (prf_nombre, est_id, prf_ventanas, prf_usu_act, prf_fec_act) VALUES(?,?,?,?,CURRENT_TIMESTAMP())', [ nombre, estado, modulos, usuarios ]);
  
        if (rows2.affectedRows > 0) {        
          res.json({mensaje: `Perfil ${nombre} Creado Correctamente`});
        }
      }
    }

  } catch (e) {
    console.log(e);
    res.status(500).json({mensaje : "Error en el servidor!"});
  }
});

router.get('/api/getPerfil', async(req, res) => {
  const { id } = req.query;

  try {
    const [rows] = await cnn_mysql.promise().execute(`SELECT prf_nombre nombre, est_id estado, prf_ventanas ventanas FROM tbl_perfil WHERE prf_id = ? LIMIT 1`, [ id ]);
    
    res.json(rows[0]);
    
  } catch (error) {
    console.log(error);
  } 
});

router.get('/api/perfiles', async(req, res) => {
  const { id } = req.query;

  try {
    const [rows] = await cnn_mysql.promise().execute(`SELECT prf_id, prf_nombre FROM tbl_perfil WHERE est_id = 1`, [ id ]);
    
    res.json(rows[0]);
    
  } catch (error) {
    console.log(error);
  } 
});

router.put('/api/eliminarPerfil', async(req, res) => {
  const {id} = req.body;

  try {
    const [rows] = await cnn_mysql.promise().execute(`UPDATE tbl_perfil SET est_id = 3 WHERE prf_id = ?`, [ id ]);

    if (rows.affectedRows > 0) {

      res.json({mensaje: 'Perfil Eliminado Correctamente'});
    }    
    
  } catch (error) {
    console.log(error);
  } 
});

module.exports = router;
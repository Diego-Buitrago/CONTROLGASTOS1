const express = require("express");
const router = express.Router();
const plantilla1 = require('../plantilla/plantilla')
const {cnn_mysql} = require('../database/database');
require('dotenv').config();

// importar libreria nodemailer
const nodemailer = require("nodemailer").mail

router.post('/api/enviar_mail', async (req, res) => {
	let { to, subject, fec} = req.body;
	
	const mensaje = 'Recientemente, ha solicitado restablecer su contraseña. Haga clic en el botón que se encuentra a continuación para iniciar el restablecimiento de la contraseña.'

	try {
        const [rows] = await cnn_mysql.promise().execute(`SELECT usu_id, usu_nombre nom FROM tbl_usuarios WHERE usu_correo = ?`, [to]);

        if (rows == 0) {
          return res.status(501).json({mensaje: 'Correo no Encontrado!'});
        } else {
            const usu_id = rows[0].usu_id;
			const random = Math.random();
			const nomusu = rows[0].nom;

			const [rowsv] = await cnn_mysql.promise().execute(`SELECT rec_id FROM tbl_recuperar WHERE usu_id = ?`, [usu_id]);
			///verificar si el usuario tiene un codigo de recuperacion activo
			// si si sacar mensaje de que cuenta con un codigo actvio si no envia
			
			if(rowsv.length > 0) {
				//update 
				const [rowsi] = await cnn_mysql.promise().execute(`UPDATE tbl_recuperar SET 
				rec_codigo = ?, rec_estado = 1, usu_correo = ?, rec_fecha = ?  WHERE usu_id = ?`, [random, to, fec, usu_id]);
				//mensaje de que tiene un codigo activo
			} else {
				//inserta como nuevo
				const [rowsi] = await cnn_mysql.promise().execute(
					'INSERT INTO tbl_recuperar(rec_codigo, rec_estado, usu_id, usu_correo, rec_fecha) VALUES(?,?,?,?,?)',
					[random, 1, usu_id, to, fec ]
				);
			}
			const html = plantilla1.replace("%nombre%", nomusu).replace('%mensaje%', mensaje).replace('%contenido%',`<a style="font-family:Arial;	display: inline-block;font-size: 1em;padding: 1em 2em; margin-top: 10px;margin-bottom: 10px;appearance: none;background-color: #007bff;color: #fff; border-radius: 15px;border: none;cursor: pointer;position: relative;transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;box-shadow: 0 2px 25px rgba(40, 167, 69, 0.5);" href="https://pavas.com.co/trazosurbanos/#/recuperar/${to}/${random}">Pulsa aca para restablecer</a>`).replace('%mensaje2%','Si el botón anterior no funciona, introduzca la dirección siguiente en su navegador').replace('%link%',`<a class="link-button" href="https://pavas.com.co/trazosurbanos/#/recuperar/${to}/${random}">https://pavas.com.co/trazosurbanos/#/recuperar/${to}/${random}</a>`);

			let email = nodemailer({
				from: "Sistema gestion de documentos <adminpavas@pavas.com.co>",
				to: `${nomusu} <${to}>`,
				subject: subject,
				html: html
			}) 
			return res.status(200).json({mensaje: 'Correo enviado!' });
 
        }
    } catch (error) {
		console.log(error);
    }
	
})
  
  module.exports = router;
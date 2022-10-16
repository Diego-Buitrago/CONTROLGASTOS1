const mysql = require('mysql2');
require('dotenv').config();

const conection_mysql = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE,
    port : process.env.DB_PORT,
    dateStrings : true
})

const validarPermiso_ventana = (per, permisos) => {
    for(let p in permisos) {
        //console.log(permisos[p].per_id)
        if((permisos[p].per_id==per)) {
            return true;
        }
    }
    return false;
}

module.exports = {
    cnn_mysql : conection_mysql,
    validarPermiso_ventana: validarPermiso_ventana
}
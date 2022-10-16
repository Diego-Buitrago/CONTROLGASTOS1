const morgan = require('morgan');
const express = require('express');
//require('dotenv').confi
const cors = require('cors');
//const cron = require('node-cron');
const path = require('path');
const app = express();
require('dotenv').config();

app.use('/', express.static(path.join(__dirname, '../frontend/build')));

app.set('port', process.env.PORT || 5001);

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

//Importar rutas
app.use('/', require('./src/routes/usuarios'));
app.use('/', require('./src/routes/perfiles'));
// Enviar correos
app.use('/', require('./src/send_mail/recuperarClave'));

app.listen(app.get('port'), () => {
   console.log(`Servidor conectado en el puerto ${app.get('port')}`);
})

module.exports = app
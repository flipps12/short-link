const express = require('express')
const path = require('path')
const { Pool } = require('pg')
require('dotenv').config()
// Crear una nueva aplicación Express
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
// Definir un puerto para nuestro servidor
const port = 3000 || process.env.PORT;


const pool = new Pool({
    connectionString: "postgres://default:HF9aO5Nkjiyz@ep-late-heart-a4xxfre5-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
})

// Definir una ruta de prueba
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/hora', async (req, res) => {
    fecha = await pool.query('SELECT NOW()')
    console.log('peticion:')
    console.log(fecha)
    res.send(fecha)
})
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
const express = require('express')
const bodyParser = require('body-parser');
const path = require('path')
const { Pool } = require('pg')
require('dotenv').config()
// Crear una nueva aplicación Express
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Definir un puerto para nuestro servidor
const port = 3000 || process.env.PORT;


const pool = new Pool({
    connectionString: process.env.KEY_DATABASE,
    ssl: true,
})

// Definir una ruta de prueba
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/is', async (req, res) => {
    fecha = await pool.query('SELECT * FROM usuarios')
    console.log(fecha.rows)
    res.sendFile(path.join(__dirname, 'public', 'sesion', 'create.html'));
})
app.post('/is', async (req, res) => {
    const user = req.body.user;
    const password = req.body.password;
    console.log(user, password);
    insert_user = await pool.query('INSERT INTO usuarios (nombre_usuario, contrasena) VALUES ($1, $2)', [user, password]);
    console.log(insert_user)
    //fecha = await pool.query('')
})

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
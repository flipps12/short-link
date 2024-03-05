const express = require('express')
const path = require('path')
const pg = require('pg')
// Crear una nueva aplicación Express
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
// Definir un puerto para nuestro servidor
const port = 3000 || process.env.PORT;


const pool = new pg.Pool({
    connectionString: process.env.POSTGRES_URL,
})

// Definir una ruta de prueba
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('hora', async (req, res) => {
    fecha = await pool.query('SELECT NOW()')
    res.send(fecha)
})
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
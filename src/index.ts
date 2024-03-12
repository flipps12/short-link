import express from 'express';
import { config } from 'dotenv';
import path from 'path';
import { createAccount, verifyPassword } from './postgres';
import bodyParser from 'body-parser';
config();

const app = express();
const port = process.env.PORT || 3000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/login', async (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'public', 'createAccount.html'));
})
app.post('/login', async (req, res) => {
    const { user, password } = req.body
    if (await verifyPassword(user, password)){
        res.send('true')
    } else res.send('false')
})
app.post('/singin', (req, res) => {
    const { user, password } = req.body
    createAccount(user, password)
    res.redirect('/')
})
app.listen(port, () => {
    console.log(`En escucha en ${port}`)
})
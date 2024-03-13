/// <reference path="../typings/custom.d.ts" />
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import path from 'path';
import { createAccount, verifyPassword } from './postgres';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
config();

const app = express();
const port = process.env.PORT || 3000
const AUTH_SECRET_KEY: string = process.env.AUTH_SECRET_KEY || '';

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwtToken
    console.log(token)
    if (!token) return res.status(403).send('Se requiere un token para la autenticación');
    jwt.verify(token, AUTH_SECRET_KEY, (err: any, decoded: any) => {
        if (err) return res.status(500).send('Falló la autenticación del token');
        //console.log(decoded)
        req.user = decoded;
        next();
    });
};

app.get('/login', async (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'public', 'sesion', 'createAccount.html'));
})
app.post('/login', async (req, res) => {
    const { user, password } = req.body
    const id = verifyPassword(user, password)
    if (await id !== false) {
        //console.log(await id)
        const token = jwt.sign({ id_usuario: await id }, AUTH_SECRET_KEY, { expiresIn: '1h' });
        res.cookie('jwtToken', token, { maxAge: 3600000, httpOnly: true });
        res.send({ auth: true, token });
    } else res.send('false')
})
app.post('/singup', async (req, res) => {
    const { user, password } = req.body
    console.log(await createAccount(user, password))
    res.redirect('/')
})
app.get('/api/protected', verificarToken, (req, res) => {
    //console.log(req.user)
    res.json({auth: true})
})
app.listen(port, () => {
    console.log(`En escucha en ${port}`)
})
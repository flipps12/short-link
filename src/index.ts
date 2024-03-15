/// <reference path="../typings/custom.d.ts" />
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import path from 'path';
import { createAccount, verifyPassword, createLink, searchUrl, viewLink } from './postgres';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
config();

const app = express();
const port: any = process.env.PORT || 3000
const AUTH_SECRET_KEY: string = process.env.AUTH_SECRET_KEY || '';

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwtToken
    //console.log(token)
    if (!token) return res.status(403).send('Se requiere un token para la autenticación');
    jwt.verify(token, AUTH_SECRET_KEY, (err: any, decoded: any) => {
        if (err) return res.status(500).send('Falló la autenticación del token');
        //console.log(decoded)
        req.user = decoded;
        //console.log(req.user)
        next();
    });
};

app.get('/login', async (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'public', 'sesion', 'createAccount.html'));
})

app.get('/dashboard', async (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'public', 'dashboard', 'dashboard.html'));
})

app.post('/login', async (req, res) => {
    const { user, password } = req.body
    if (user == '' || password == '') res.send('error')
    const resultVerify = verifyPassword(user, password)
    //console.log(await resultVerify)
    if (await resultVerify !== false) {
        //console.log(await resultVerify)
        const token = jwt.sign({ usuario: await resultVerify }, AUTH_SECRET_KEY, { expiresIn: '100d' });
        res.cookie('jwtToken', token, { maxAge: 99999999, httpOnly: true });
        res.send({ auth: true, token });
    } else res.json({auth: false})
})
app.post('/singup', async (req, res) => {
    const { user, password } = req.body
    if (user == '' || password == '') res.send('error')
    console.log(await createAccount(user, password))
    res.redirect('/')
})
app.get('/api/protected', verificarToken, (req, res) => {
    //console.log(req.user)
    res.json({auth: true, id: req.user})
})
app.post('/api/createurl', verificarToken, async (req, res) => {
    const id: any = req.user?.usuario.id;
    const { url_original, url_recortada} = req.body
    if ( url_original == '' || url_recortada == '') res.send('error')
    const result = createLink(id, url_recortada, url_original )
    if (await result === false){
        res.json({status: 'registered'})
    } else if (await result) {
        res.json({ status: true })
    }
})
app.get('/api/geturls', verificarToken, async (req, res) => {
    const id: any = req.user?.usuario.id;
    const result = await viewLink(id)
    res.json(result)
})
app.get(`/s/:link`, async (req, res) => {
    const link = req.params.link
    const newlink = await searchUrl(link)
    if (newlink[0] !== undefined){
        // console.log(await newlink[0])
        res.redirect('http://' + await newlink[0].url_original)
    } else res.redirect('/')
})
app.listen(port, () => {
    console.log(`En escucha en ${port}`)
})
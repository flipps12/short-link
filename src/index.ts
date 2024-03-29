/// <reference path="../typings/custom.d.ts" />
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import path from 'path';
import { createAccount, verifyPassword, createLink, searchUrl, viewLink, deleteurl } from './postgres';
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

app.post('/api/login', async (req, res) => {
    const { user, password } = req.body
    if (user == '' || password == '') res.send('error')
    const resultVerify = verifyPassword(user, password)
    //console.log(await resultVerify)
    if (await resultVerify !== false) {
        //console.log(await resultVerify)
        const token = jwt.sign({ usuario: await resultVerify }, AUTH_SECRET_KEY, { expiresIn: '100d' });
        res.cookie('jwtToken', token, { maxAge: 99999999, httpOnly: true });
        res.send({ auth: true });
    } else res.json({auth: false})
})

app.post('/api/singup', async (req, res) => {
    try {
        const { user, password } = req.body
        if (user == '' || password == '') return
        const result = await createAccount(user, password);
        res.json({ status: result})
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }
});

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
    } else res.json({ status: 'errors'})
})

app.get('/api/geturls', verificarToken, async (req, res) => {
    const id: any = req.user?.usuario.id;
    const result = await viewLink(id)
    res.json(result)
})

app.post('/api/deleteurls', verificarToken, async (req, res) => {
    const id: any = req.user?.usuario.id;
    const idUrl = req.body.id;
    if (idUrl == '' || id == '') res.json({status: 'error'})
    const result = await deleteurl(idUrl, id)
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

// listen
//,'192.168.0.89'
app.listen(port, () => {
    console.log(`En escucha en ${port}`)
})
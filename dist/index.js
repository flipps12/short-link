"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../typings/custom.d.ts" />
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const postgres_1 = require("./postgres");
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY || '';
app.use(express_1.default.static('public'));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
const verificarToken = (req, res, next) => {
    const token = req.cookies.jwtToken;
    //console.log(token)
    if (!token)
        return res.status(403).send('Se requiere un token para la autenticación');
    jsonwebtoken_1.default.verify(token, AUTH_SECRET_KEY, (err, decoded) => {
        if (err)
            return res.status(500).send('Falló la autenticación del token');
        //console.log(decoded)
        req.user = decoded;
        //console.log(req.user)
        next();
    });
};
app.get('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, '../', 'public', 'sesion', 'createAccount.html'));
}));
app.get('/dashboard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, '../', 'public', 'dashboard', 'dashboard.html'));
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, password } = req.body;
    if (user == '' || password == '')
        res.send('error');
    const resultVerify = (0, postgres_1.verifyPassword)(user, password);
    //console.log(await resultVerify)
    if ((yield resultVerify) !== false) {
        //console.log(await resultVerify)
        const token = jsonwebtoken_1.default.sign({ usuario: yield resultVerify }, AUTH_SECRET_KEY, { expiresIn: '100d' });
        res.cookie('jwtToken', token, { maxAge: 99999999, httpOnly: true });
        res.send({ auth: true, token });
    }
    else
        res.json({ auth: false });
}));
app.post('/singup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, password } = req.body;
    if (user == '' || password == '')
        res.send('error');
    const result = yield (0, postgres_1.createAccount)(user, password);
    res.json({ status: yield result });
}));
app.get('/api/protected', verificarToken, (req, res) => {
    //console.log(req.user)
    res.json({ auth: true, id: req.user });
});
app.post('/api/createurl', verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.usuario.id;
    const { url_original, url_recortada } = req.body;
    if (url_original == '' || url_recortada == '')
        res.send('error');
    const result = (0, postgres_1.createLink)(id, url_recortada, url_original);
    if ((yield result) === false) {
        res.json({ status: 'registered' });
    }
    else if (yield result) {
        res.json({ status: true });
    }
    else
        res.json({ status: 'errors' });
}));
app.get('/api/geturls', verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const id = (_b = req.user) === null || _b === void 0 ? void 0 : _b.usuario.id;
    const result = yield (0, postgres_1.viewLink)(id);
    res.json(result);
}));
app.post('/api/deleteurls', verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const id = (_c = req.user) === null || _c === void 0 ? void 0 : _c.usuario.id;
    const idUrl = req.body.id;
    if (idUrl == '' || id == '')
        res.json({ status: 'error' });
    const result = yield (0, postgres_1.deleteurl)(idUrl, id);
    res.json(result);
}));
app.get(`/s/:link`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = req.params.link;
    const newlink = yield (0, postgres_1.searchUrl)(link);
    if (newlink[0] !== undefined) {
        // console.log(await newlink[0])
        res.redirect('http://' + (yield newlink[0].url_original));
    }
    else
        res.redirect('/');
}));
// listen
app.listen(port, () => {
    console.log(`En escucha en ${port}`);
});

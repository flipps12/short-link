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
    console.log(token);
    if (!token)
        return res.status(403).send('Se requiere un token para la autenticación');
    jsonwebtoken_1.default.verify(token, AUTH_SECRET_KEY, (err, decoded) => {
        if (err)
            return res.status(500).send('Falló la autenticación del token');
        //console.log(decoded)
        req.user = decoded;
        next();
    });
};
app.get('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, '../', 'public', 'sesion', 'createAccount.html'));
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, password } = req.body;
    const id = (0, postgres_1.verifyPassword)(user, password);
    if ((yield id) !== false) {
        //console.log(await id)
        const token = jsonwebtoken_1.default.sign({ id_usuario: yield id }, AUTH_SECRET_KEY, { expiresIn: '1h' });
        res.cookie('jwtToken', token, { maxAge: 3600000, httpOnly: true });
        res.send({ auth: true, token });
    }
    else
        res.send('false');
}));
app.post('/singup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, password } = req.body;
    console.log(yield (0, postgres_1.createAccount)(user, password));
    res.redirect('/');
}));
app.get('/api/protected', verificarToken, (req, res) => {
    //console.log(req.user)
    res.json({ auth: true });
});
app.listen(port, () => {
    console.log(`En escucha en ${port}`);
});

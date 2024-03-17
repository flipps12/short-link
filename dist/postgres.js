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
exports.deleteurl = exports.viewLink = exports.searchUrl = exports.createLink = exports.verifyPasswordID = exports.verifyPassword = exports.createAccount = void 0;
const dotenv_1 = require("dotenv");
const postgres_1 = __importDefault(require("postgres"));
const crypto_1 = __importDefault(require("crypto"));
(0, dotenv_1.config)();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const SECRET_KEY = process.env.SECRET_KEY || '';
const encrypt = (password) => {
    const encryptedPassword = crypto_1.default.createHmac('sha256', SECRET_KEY)
        .update(password)
        .digest('hex');
    return [encryptedPassword];
};
const sql = (0, postgres_1.default)({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`,
    },
});
const createAccount = (user, password) => __awaiter(void 0, void 0, void 0, function* () {
    const [encryptedPassword] = encrypt(password);
    try {
        // Verificar si el usuario ya existe
        const checkName = yield sql `
            SELECT COUNT(*) as count FROM usuarios WHERE nombre_usuario = ${user};
        `;
        // Si el usuario ya existe, no hacemos nada
        if (checkName[0].count > 0) {
            return false; // El usuario ya existe
        }
        // Si el usuario no existe, lo insertamos
        const result = yield sql `
            INSERT INTO usuarios (nombre_usuario, contrasena)
            VALUES (${user}, ${encryptedPassword});
        `;
        return true; // El usuario se creó correctamente
    }
    catch (error) {
        console.log(error);
        return false; // Hubo un error al crear el usuario
    }
});
exports.createAccount = createAccount;
const verifyPassword = (user, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [encryptedPassword] = encrypt(password);
        const result = yield sql `SELECT * FROM usuarios WHERE nombre_usuario=${user};`;
        if (result[0] !== undefined) {
            if (result[0].contrasena === encryptedPassword) {
                const { id, nombre_usuario, contrasena } = result[0];
                return { id, nombre_usuario };
            }
            else
                return false;
        }
        else
            return false;
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
exports.verifyPassword = verifyPassword;
const verifyPasswordID = (id, password) => __awaiter(void 0, void 0, void 0, function* () {
    const [encryptedPassword] = encrypt(password);
    const result = yield sql `SELECT * FROM usuarios WHERE id=${id};`;
    if (result[0] !== undefined) {
        if (result[0].contrasena === encryptedPassword) {
            return result[0].nombre_usuario;
        }
        else
            return false;
    }
    else
        return false;
});
exports.verifyPasswordID = verifyPasswordID;
const createLink = (usuario_id, url_recortado, url_original) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkName = yield sql `SELECT * FROM urls WHERE url_recortada=${url_recortado};`;
        const checkurls = yield sql `SELECT cantidad_links FROM usuarios WHERE id=${usuario_id};`;
        console.log(yield checkurls[0].cantidad_links);
        if (checkName[0] == undefined && checkurls[0].cantidad_links <= 10) {
            const result1 = yield sql `UPDATE usuarios SET cantidad_links = cantidad_links + 1 WHERE id = ${usuario_id};`;
            const result = yield sql `INSERT INTO urls (usuario_id, url_recortada, url_original) VALUES (${usuario_id}, ${url_recortado}, ${url_original});`;
            return true;
        }
        else
            return false;
    }
    catch (error) {
        console.log('error ' + error);
        return 'error';
    }
});
exports.createLink = createLink;
const viewLink = (usuario_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkName = yield sql `SELECT * FROM urls WHERE usuario_id=${usuario_id};`;
        return checkName;
    }
    catch (error) {
        console.log(error);
        return 'error';
    }
});
exports.viewLink = viewLink;
const searchUrl = (url_recortado) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield sql `SELECT * FROM urls WHERE url_recortada=${url_recortado};`;
    return result;
});
exports.searchUrl = searchUrl;
const deleteurl = (id, usuario_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield sql `DELETE FROM urls WHERE id=${id} AND usuario_id=${usuario_id};`;
        return result;
    }
    catch (error) {
        console.log(error);
        return 'error';
    }
});
exports.deleteurl = deleteurl;

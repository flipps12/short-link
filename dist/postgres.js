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
exports.verifyPassword = exports.createAccount = void 0;
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
    const checkName = yield sql `SELECT * FROM usuarios WHERE nombre_usuario=${user};`;
    if (checkName[0] === undefined) {
        const result = yield sql `INSERT INTO usuarios (nombre_usuario, contrasena) VALUES (${user}, ${encryptedPassword});`;
        return true;
    }
    else
        return false;
});
exports.createAccount = createAccount;
const verifyPassword = (user, password) => __awaiter(void 0, void 0, void 0, function* () {
    const [encryptedPassword] = encrypt(password);
    const result = yield sql `SELECT * FROM usuarios WHERE nombre_usuario=${user};`;
    if (result[0] !== undefined) {
        if (result[0].contrasena === encryptedPassword) {
            return result[0].id;
        }
        else
            return false;
    }
    else
        return false;
});
exports.verifyPassword = verifyPassword;

import { config } from 'dotenv';
import postgres from 'postgres';
import crypto from 'crypto';

config()
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const SECRET_KEY: string = process.env.SECRET_KEY || '';

const encrypt = (password: string): [string] => {
    const encryptedPassword: string = crypto.createHmac('sha256', SECRET_KEY)
        .update(password)
        .digest('hex');
    return [encryptedPassword]
};

const sql = postgres({
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
  
const createAccount = async (user: string, password: string) => {
    const [encryptedPassword] = encrypt(password)
    const checkName = await sql`SELECT * FROM usuarios WHERE nombre_usuario=${user};`;
    if (checkName[0] === undefined){
        const result = await sql`INSERT INTO usuarios (nombre_usuario, contrasena) VALUES (${user}, ${encryptedPassword});`;
        return true
    } else return false
}

const verifyPassword = async (user: string, password: string) => {
    const [encryptedPassword] = encrypt(password)
    const result = await sql`SELECT * FROM usuarios WHERE nombre_usuario=${user};`;
    if (result[0] !== undefined) {
        if (result[0].contrasena === encryptedPassword) {
            const {id, nombre_usuario, contrasena} = result[0]
            return  { id, nombre_usuario }
        } else return false
    } else return false
}

const verifyPasswordID = async (id: number, password: string) => {
    const [encryptedPassword] = encrypt(password)
    const result = await sql`SELECT * FROM usuarios WHERE id=${id};`;
    if (result[0] !== undefined) {
        if (result[0].contrasena === encryptedPassword) {
            return  result[0].nombre_usuario
        } else return false
    } else return false
}

const createLink = async (usuario_id: number, url_recortado: string, url_original: string) => {
    const checkName = await sql`SELECT * FROM urls WHERE url_recortada=${url_recortado};`;
    const checkurls = await sql`SELECT cantidad_links FROM usuarios WHERE id=${usuario_id};`;
    console.log(await checkurls[0].cantidad_links)
    if (checkName[0] == undefined && checkurls[0].cantidad_links <= 10){
        const result1 = await sql`UPDATE usuarios SET cantidad_links = cantidad_links + 1 WHERE id = ${usuario_id};`
        const result = await sql`INSERT INTO urls (usuario_id, url_recortada, url_original) VALUES (${usuario_id}, ${url_recortado}, ${url_original});`;
        return true
    } else return false
}

const viewLink = async (usuario_id: number) => {
    const checkName = await sql`SELECT * FROM urls WHERE usuario_id=${usuario_id};`;
    return checkName
}

const searchUrl = async (url_recortado: string) => {
    const result = await sql`SELECT * FROM urls WHERE url_recortada=${url_recortado};`;
    return result
}

export { createAccount, verifyPassword, verifyPasswordID, createLink, searchUrl, viewLink };
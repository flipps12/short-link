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
    const result = await sql`INSERT INTO usuarios (nombre_usuario, contrasena) VALUES (${user}, ${encryptedPassword});`;
    console.log(result)
    return result
}

const verifyPassword = async (user: string, password: string) => {
    const [encryptedPassword] = encrypt(password)
    const result = await sql`SELECT * FROM usuarios WHERE nombre_usuario=${user};`;
    if (result[0] !== undefined) {
        if (result[0].contrasena === encryptedPassword) {
            return  true
        } else return false
    } else return false
}

export { createAccount, verifyPassword };
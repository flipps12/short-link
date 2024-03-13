
interface User {
    id_usuario: number;
    iat: number;
    exp: number;
    // Otras propiedades relevantes
}// custom.d.ts
declare namespace Express {
    export interface Request {
        user?: User; // Cambia 'any' por el tipo adecuado para tu usuario
    }
}

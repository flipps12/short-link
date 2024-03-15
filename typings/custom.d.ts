interface usuario2 {
    id: number;
    nombre_usuario: string
    // Otras propiedades relevantes
}
interface usuario {
    usuario: usuario2;
    // Otras propiedades relevantes
}
interface User {
    usuario: usuario2;
    iat: number;
    exp: number;
    // Otras propiedades relevantes
}
interface verifyData {
    id: number;
    nombre_usuario: string;
    contrasena: string;
    // Otras propiedades relevantes
}
declare namespace Express {
    export interface Request {
        resultVerify?: verifyData;
        user?: User; // Cambia 'any' por el tipo adecuado para tu usuario
    }
}


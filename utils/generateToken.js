import jwt from 'jsonwebtoken';

export const generateToken = (uid) => {
   try{
    jwt.sign(
        { uid }, // el primer argumento es el payload, que es un objeto que contiene los datos que se quieren incluir en el token, en este caso se incluye el id del usuario.
        process.env.JWT_SECRET, // el segundo argumento es la clave secreta para firmar el token, esta clave debe ser una cadena de caracteres larga y aleatoria, y se debe guardar en una variable de entorno para evitar que se exponga en el codigo fuente.
    );
   }catch(error){
    console.log(error);
   }
  }
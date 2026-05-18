import jwt from "jsonwebtoken";

export const generateToken = (uid) => {
  // este token validara cualquier peticion que se relice a la api.
  const expiresIn = 60 * 15; // tiempo de expiracion del token en segundos, en este caso se establece en 15 minutos (60 segundos * 15 minutos = 900 segundos).

  try {
    const token = jwt.sign(
      { uid }, // el primer argumento es el payload, que es un objeto que contiene los datos que se quieren incluir en el token, en este caso se incluye el id del usuario.
      process.env.JWT_SECRET,
      { expiresIn }); // el segundo argumento es la clave secreta para firmar el token, esta clave debe ser una cadena de caracteres larga y aleatoria, y se debe guardar en una variable de entorno para evitar que se exponga en el codigo fuente.
    return { token, expiresIn };
  } catch (error) {
    console.log(error);
  }
};

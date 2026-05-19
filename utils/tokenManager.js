import jwt from "jsonwebtoken";

export const generateToken = (uid) => {
  // este token validara cualquier peticion que se relice a la api.
  const expiresIn = 60 * 15; // tiempo de expiracion del token en segundos, en este caso se establece en 15 minutos (60 segundos * 15 minutos = 900 segundos).

  try {
    const token = jwt.sign(
      { uid }, // el primer argumento es el payload, que es un objeto que contiene los datos que se quieren incluir en el token, en este caso se incluye el id del usuario.
      process.env.JWT_SECRET,
      { expiresIn },
    ); // el segundo argumento es la clave secreta para firmar el token, esta clave debe ser una cadena de caracteres larga y aleatoria, y se debe guardar en una variable de entorno para evitar que se exponga en el codigo fuente.
    return { token, expiresIn };
  } catch (error) {
    console.log(error);
  }
};

export const generateRefreshToken = (uid, res) => {
  const expiresIn = 60 * 60 * 24 * 30; // tiempo de expiracion del token en segundos, en este caso se establece en 30 dias (60 segundos * 60 minutos * 24 horas * 30 dias = 2592000 segundos).
  try {
    const refreshToken = jwt.sign(
      { uid }, // el primer argumento es el payload, que es un objeto que contiene los datos que se quieren incluir en el token, en este caso se incluye el id del usuario.
      process.env.JWT_REFRESH,
      { expiresIn },
    ); // el segundo argumento es la clave secreta para firmar el token, esta clave debe ser una cadena de caracteres larga y aleatoria, y se debe guardar en una variable de entorno para evitar que se exponga en el codigo fuente.

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: !(process.env.MODO === "developer"), // aca se le dice a la cookie que solo se envie por HTTPS en produccion, para mayor seguridad, y en desarrollo se puede enviar por HTTP.
      expires : new Date(Date.now() + expiresIn * 1000), // aca se establece la fecha de expiracion de la cookie, que es la fecha actual mas el tiempo de expiracion del token, en milisegundos (expiresIn esta en segundos, por lo que se multiplica por 1000 para convertirlo a milisegundos).
    });
  } catch (error) {
    console.log(error);
  }
};

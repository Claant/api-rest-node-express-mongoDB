import { tokenVerificationErrors } from "../utils/tokenManager.js";
import jwt from "jsonwebtoken"; // con este import se va a poder usar el metodo verify de jsonwebtoken, que es una funcion que se utiliza para verificar un token JWT, y se le pasan el token que se quiere verificar, y la clave secreta para verificar el token, esta clave debe ser la misma que se utilizo para firmar el token, y se debe guardar en una variable de entorno para evitar que se exponga en el codigo fuente.

export const requireRefreshToken = (req, res, next) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken; // aca se obtiene el token de refresco de la cookie que se envio en la peticion, y se le asigna a la variable token, esta cookie se llama refreshToken, y se envio desde el login con la funcion generateRefreshToken que se definio en el archivo utils/generateToken.js, esta cookie se envio con las opciones httpOnly y secure, para mayor seguridad, y el tiempo de expiracion del token de refresco es de 30 dias.
    if (!refreshTokenCookie) throw new Error("No existe el token en la cookie"); // si token es undefined, es decir, si no se envio un token de refresco en la cookie de la peticion, se lanza un error indicando que no se proporciono un token de refresco en la cookie.

    const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH); // aca se verifica el token de refresco con la clave secreta de los tokens de refresco, si el token es valido, no se produce ningun error y se obtiene el id del usuario del payload del token, y se le asigna a la variable uid, y luego se puede generar un nuevo token de acceso con ese id de usuario, y responder con ese nuevo token de acceso, y si el token de refresco no es valido, se lanza un error indicando que el token de refresco no es valido.

    req.uid = uid; // aca se asigna el id del usuario obtenido del payload del token de refresco a la propiedad uid del objeto req, para que luego se pueda usar ese id en el controlador refreshToken que esta en controllers/auth.controller.js, para generar un nuevo token de acceso con ese id de usuario, y responder con ese nuevo token de acceso.

    next(); // aca se llama a la funcion next, que es una funcion que se utiliza para pasar al siguiente middleware o controlador, en este caso se va a pasar al controlador refreshToken que esta en controllers/auth.controller.js, si el token de refresco es valido.
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: tokenVerificationErrors[error.message] });
  }
};

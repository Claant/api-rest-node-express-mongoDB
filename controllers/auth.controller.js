import { User } from "../models/User.js"; // esto es una importacion nombrada, se importa el modelo de usuario que se exporto en el archivo User.js, y se le asigna el nombre de User, para poder usarlo en este archivo.
import jwt from "jsonwebtoken"; // con este import se va a poder usar el metodo sign de jsonwebtoken, que es una funcion que se utiliza para generar un token JWT, y se le pasan los datos que se quieren incluir en el token, y una clave secreta para firmar el token.
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";


//  Lo que se esta haciendo en esta ruta es recibir una peticion POST a la ruta /login.....,
//  ....y responder con un objeto JSON que tiene una propiedad ok con el valor true.
// Esto es solo un ejemplo de como se podria implementar una ruta de login.
export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    // alternativa buscando por email
    let user = await User.findOne({ email }); // aca se busca en la base de datos si ya existe un usuario con el email que se recibio en el cuerpo de la peticion (req.body), y se le asigna a la variable user, si no existe un usuario con ese email, user va a ser null.
    if (user) throw { code: 11000 }; // si user no es null, es decir, si ya existe un usuario con ese email, se lanza un error con el codigo 11000, que es el codigo de error que se produce cuando se intenta insertar un documento con un valor de un campo que tiene un indice unico, y ese valor ya existe en otro documento de la coleccion. En este caso, el campo email tiene un indice unico, por lo que si se intenta registrar un usuario con un email que ya existe en la base de datos, se va a producir este error.

    user = new User({ email, password }); // aca se crea una nueva instancia del modelo de usuario, y se le pasan los datos que se recibieron en el cuerpo de la peticion (req.body), que son el email y la contraseña.
    await user.save(); // aca con save se guarda el usuario en la base de datos, y como se definio en el modelo de usuario, antes de guardarlo se encripta la contraseña, gracias al pre que se definio en el modelo.

    //jwt token
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.log(error);
    // alternativa por defecto mongoose
    if (error.code === 11000) {
      // el error 11000 es un error de MongoDB que se produce cuando se intenta insertar un documento con un valor de un campo que tiene un indice unico, y ese valor ya existe en otro documento de la coleccion. En este caso, el campo email tiene un indice unico, por lo que si se intenta registrar un usuario con un email que ya existe en la base de datos, se va a producir este error.
      return res.status(400).json({ error: "El email ya esta registrado" });
    }
    return res.status(500).json({ error: "Error de servidor" });
  }
};





export const login = async (req, res) => {
  try {
const { email, password } = req.body; // aca se reciben los datos del cuerpo de la peticion (req.body), que son el email y la contraseña, y se asignan a las variables email y password respectivamente.    
  let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuario no existe" }); // si user es null, es decir, si no existe un usuario con ese email, se responde con un error 400 y un mensaje de error indicando que el usuario no existe.
    const respuestaPassword = await user.comparePassword(password); // aca se llama a la funcion comparePassword que se definio en el modelo de usuario, y se le pasa la contraseña que se recibio en el cuerpo de la peticion (req.body), y se le asigna a la variable respuestPassword, esta variable va a ser true si las contraseñas coinciden, o false si no coinciden.
    if (!respuestaPassword) return res.status(400).json({ error: "Contraseña incorrecta" }); // si respuestPassword es false, es decir, si las contraseñas no coinciden, se responde con un error 400 y un mensaje de error indicando que la contraseña es incorrecta.

// Generar el token JWT
const { token, expiresIn } = generateToken(user._id); // aca se llama a la funcion generateToken que se definio en el archivo utils/generateToken.js, y se le pasa el id del usuario que se obtuvo de la base de datos, y se le asigna a la variable token, esta variable va a ser un objeto que contiene el token generado y el tiempo de expiracion del token.
generateRefreshToken(user.id, res); // aca se llama a la funcion generateRefreshToken que se definio en el archivo utils/generateToken.js, y se le pasa el id del usuario que se obtuvo de la base de datos, y la respuesta (res), esta funcion va a generar un token de refresco y lo va a enviar en una cookie al cliente, esta cookie se va a llamar refreshToken, y va a tener el token de refresco como valor, esta cookie se va a enviar con las opciones httpOnly y secure, para mayor seguridad, y el tiempo de expiracion del token de refresco es de 30 dias.



return res.json({ token, expiresIn }); // se responde con un objeto JSON que contiene el token generado y el tiempo de expiracion del token.
  } catch (error) {
    console.log(error);
      return res.status(500).json({ error: "Error de servidor" });
  }
};





// se puede entrar a esta ruta solo si se envia un token valido en el header de la peticion, y se valida ese token con el middleware validateToken que se definio en el archivo middlewares/validateToken.js, si el token es valido, se ejecuta el controlador infoUser que esta en controllers/auth.controller.js, y si el token no es valido, se responde con un error 401 indicando que no se tiene autorizacion para acceder a esa ruta.
export const infoUser = async (req, res) => {
  try {
   const user = await User.findById(req.uid).lean(); // aca se busca en la base de datos el usuario con el id que se obtuvo del token, y se le asigna a la variable user
    return res.json({email: user.email, uid: user.id}) // se responde con un objeto JSON que contiene el usuario obtenido de la base de datos, este usuario se obtuvo gracias al token que se envio en el header de la peticion, y se valido ese token con el middleware validateToken que se definio en el archivo middlewares/validateToken.js, si el token es valido, se obtiene el id del usuario del payload del token, y se busca en la base de datos el usuario con ese id, y se le asigna a la variable user, y luego se responde con ese usuario.
  }catch (error) {
    return res.status(500).json({ error: "Error de servidor" });
  }

}  







export const refreshToken = (req, res) => {

try{
const refreshTokenCookie = req.cookies.refreshToken; // aca se obtiene el token de refresco de la cookie que se envio en la peticion, y se le asigna a la variable token, esta cookie se llama refreshToken, y se envio desde el login con la funcion generateRefreshToken que se definio en el archivo utils/generateToken.js, esta cookie se envio con las opciones httpOnly y secure, para mayor seguridad, y el tiempo de expiracion del token de refresco es de 30 dias.
if(!refreshTokenCookie) throw new Error("No existe el token en la cookie"); // si token es undefined, es decir, si no se envio un token de refresco en la cookie de la peticion, se lanza un error indicando que no se proporciono un token de refresco en la cookie.

const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH); // aca se verifica el token de refresco con la clave secreta de los tokens de refresco, si el token es valido, no se produce ningun error y se obtiene el id del usuario del payload del token, y se le asigna a la variable uid, y luego se puede generar un nuevo token de acceso con ese id de usuario, y responder con ese nuevo token de acceso, y si el token de refresco no es valido, se lanza un error indicando que el token de refresco no es valido.
const { token, expiresIn } = generateToken(uid); // aca se llama a la funcion generateToken que se definio en el archivo utils/generateToken.js, y se le pasa el id del usuario que se obtuvo del token de refresco, y se le asigna a la variable token, esta variable va a ser un objeto que contiene el token generado y el tiempo de expiracion del token.
return res.json({ token, expiresIn }); // se responde con un objeto JSON que contiene el nuevo token generado y el tiempo de expiracion del token.

}catch (error) {
  console.log(error);
  const TokenVerificationErrors = {
      ["invalid signature"]: "La firma del token no es valida",
      ["jwt expired"]: "El token ha expirado",
      ["invalid token"]: "Token no valido",
      ["No existe el token en el header  Bearer"]: "No se proporciono un token en el header de la peticion",
      ["jwt malformed"]: "Token mal formado",
    };
    return res
      .status(401)
      .send({ error: TokenVerificationErrors[error.message] });
 
}

}




export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};
  
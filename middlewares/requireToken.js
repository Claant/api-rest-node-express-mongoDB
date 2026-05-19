import jwt from "jsonwebtoken"; // con este import se va a poder usar el metodo verify de jsonwebtoken, que es una funcion que se utiliza para verificar un token JWT, y se le pasan el token que se quiere verificar, y la clave secreta para verificar el token, esta clave debe ser la misma que se utilizo para firmar el token, y se debe guardar en una variable de entorno para evitar que se exponga en el codigo fuente.

export const requireToken = (req, res, next) => {
  try {
    let token = req.headers?.authorization; // aca se obtiene el token del header de la peticion, y se le asigna a la variable token, el token se debe enviar en el header de la peticion con el nombre authorization, y el valor del token debe ser el token generado en el login.
    console.log(token);

    // aca el throw se utiliza para lanzar un error y si existe salta al catch y no al next().
    // en cambio se si existe la autorizacion salta al next() y se ejecuta el controlador infoUser que esta en controllers/auth.controller.js, y si no existe la autorizacion salta al catch y se responde con un error 401 indicando que no se tiene autorizacion para acceder a esa ruta.

    if (!token) throw new Error("No existe el token en el header usa Bearer"); // si token es undefined, es decir, si no se envio un token en el header de la peticion, se lanza un error indicando que no se proporciono un token.

    token = token.split(" ")[1]; // aca se divide el token en dos partes, la primera parte es el tipo de token (Bearer) y la segunda parte es el token en si, y se le asigna a la variable token solo la segunda parte, que es el token en si, esto se hace porque el token se debe enviar en el header de la peticion con el formato "Bearer <token>", por lo que se debe dividir el string para obtener solo el token.

    const { uid } = jwt.verify(token, process.env.JWT_SECRET); // aca se verifica el token con la clave secreta, si el token es valido, no se produce ningun error y se pasa al siguiente middleware o controlador, en este caso se va a pasar al controlador infoUser que esta en controllers/auth.controller.js, y si el token no es valido, se lanza un error indicando que el token no es valido.
    req.uid = uid; // aca se asigna el id del usuario obtenido del payload del token a la propiedad uid del objeto req, para que luego se pueda usar ese id en el controlador infoUser que esta en controllers/auth.controller.js, para buscar el usuario en la base de datos y obtener su informacion.

    next(); // aca se llama a la funcion next, que es una funcion que se utiliza para pasar al siguiente middleware o controlador, en este caso se va a pasar al controlador infoUser que esta en controllers/auth.controller.js, si el token es valido.
  } catch (error) {
    console.log(error.message);

    // aca se define un objeto con los posibles errores que se pueden producir al verificar el token, y se le asigna a la variable TokenVerificationErrors, este objeto tiene como clave el mensaje de error que se produce al verificar el token, y como valor el mensaje de error que se va a enviar al cliente, esto se hace para evitar enviar mensajes de error confusos o poco claros al cliente, y para enviar mensajes de error mas amigables y comprensibles.
    const TokenVerificationErrors = {
      ["invalid signature"]: "La firma del token no es valida",
      ["jwt expired"]: "El token ha expirado",
      ["invalid token"]: "Token no valido",
      ["No existe el token en el header  Bearer"]:
        "No se proporciono un token en el header de la peticion",
      ["jwt malformed"]: "Token mal formado",
    };
    return res
      .status(401)
      .send({ error: TokenVerificationErrors[error.message] });
  }
};

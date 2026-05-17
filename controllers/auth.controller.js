import { User } from "../models/User.js"; // esto es una importacion nombrada, se importa el modelo de usuario que se exporto en el archivo User.js, y se le asigna el nombre de User, para poder usarlo en este archivo.
import jwt from "jsonwebtoken"; // con este import se va a poder usar el metodo sign de jsonwebtoken, que es una funcion que se utiliza para generar un token JWT, y se le pasan los datos que se quieren incluir en el token, y una clave secreta para firmar el token.


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
const token = jwt.sign(
  { uid: user._id }, // el primer argumento es el payload, que es un objeto que contiene los datos que se quieren incluir en el token, en este caso se incluye el id del usuario.
  process.env.JWT_SECRET, // el segundo argumento es la clave secreta para firmar el token, esta clave debe ser una cadena de caracteres larga y aleatoria, y se debe guardar en una variable de entorno para evitar que se exponga en el codigo fuente.
  );





return res.json({token});
  } catch (error) {
    console.log(error);
      return res.status(500).json({ error: "Error de servidor" });
  }
};

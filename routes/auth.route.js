import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validationResultExpress } from "../middlewares/validationResultExpress.js";
// con este import se va a poder usar el metodo body de express-validator, que es una funcion que se utiliza para validar los datos que se reciben en el cuerpo de la peticion (req.body)....,
// ...y se puede usar para validar que el email tenga un formato correcto, que la contraseña tenga una longitud minima, etc.
import { body } from "express-validator";

const router = express.Router();


// aca solo se esta importando desde el auth.controller.js la funcion login y register....,
// ....que son las que se van a ejecutar cuando se reciba una peticion a la ruta /login o /register respectivamente.

router.post(
  "/register",
  [
    // las validaciones en el backend son obligatorias, para evitar que se reciban datos incorrectos o maliciosos, y para garantizar la integridad de los datos en la base de datos.
    // .ismail() esta funcion se utiliza para validar que el email tenga un formato correcto.
    // .normalizeEmail() esta funcion se utiliza para normalizar el email, es decir, convertirlo a minusculas, eliminar los puntos, etc. para evitar que haya emails duplicados por diferencias en el formato.
    // .trim() esta funcion se utiliza para eliminar los espacios en blanco al inicio y al final del string, para evitar que haya problemas con los espacios en blanco.
    body("email", "Formato de email no valido")
      .trim()
      .isEmail()
      .normalizeEmail(),

    // .isLength({ min: 6 }) esta funcion se utiliza para validar que la contraseña tenga una longitud minima de 6 caracteres.
    body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),

    // custom se usa para crear una validacion personalizada.
    // aca validamos que el campo password y repassword sean iguales, para evitar que el usuario se equivoque al escribir la contraseña y luego no pueda iniciar sesion porque no recuerda como la escribio.
    body("password", "formato de password no valido").custom(
      (value, { req }) => {
        if (value !== req.body.repassword) {
          throw new Error("Las contraseñas no coinciden");
        }
        return value;
      },
    ),
  ],
  // aca se llama a la funcion validationResultExpress, que es un middleware que se encarga de validar los datos que se reciben en el cuerpo de la peticion (req.body)....,
  // ...y si hay errores de validacion, se responde con un status 400 y un objeto JSON que tiene una propiedad errors con un array de los errores encontrados.
  validationResultExpress,
  register,  // controlador que esta en controlles/auth.controller.js, que se va a ejecutar si no hay errores de validacion.
);



router.post("/login",
    body("email", "Formato de email no valido")
      .trim()
      .isEmail()
      .normalizeEmail(),   
    body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),
    validationResultExpress,
    login // controlador que esta en controlles/auth.controller.js, que se va a ejecutar si no hay errores de validacion.
);

export default router;

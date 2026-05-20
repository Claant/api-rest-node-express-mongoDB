import { body, validationResult } from "express-validator";

export const validationResultExpress = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const bodyRegisterValidator = [
  // las validaciones en el backend son obligatorias, para evitar que se reciban datos incorrectos o maliciosos, y para garantizar la integridad de los datos en la base de datos.
  // .ismail() esta funcion se utiliza para validar que el email tenga un formato correcto.
  // .normalizeEmail() esta funcion se utiliza para normalizar el email, es decir, convertirlo a minusculas, eliminar los puntos, etc. para evitar que haya emails duplicados por diferencias en el formato.
  // .trim() esta funcion se utiliza para eliminar los espacios en blanco al inicio y al final del string, para evitar que haya problemas con los espacios en blanco.
  body("email", "Formato de email no valido").trim().isEmail().normalizeEmail(),

  body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }), // .isLength({ min: 6 }) esta funcion se utiliza para validar que la contraseña tenga una longitud minima de 6 caracteres.

  // custom se usa para crear una validacion personalizada.
  // aca validamos que el campo password y repassword sean iguales, para evitar que el usuario se equivoque al escribir la contraseña y luego no pueda iniciar sesion porque no recuerda como la escribio.
  body("password", "formato de password no valido").custom((value, { req }) => {
    if (value !== req.body.repassword) {
      throw new Error("Las contraseñas no coinciden");
    }
    return value;
  }),

  validationResultExpress,
];




export const bodyLoginValidator = [
  [
    body("email", "Formato de email no valido")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),
     validationResultExpress, 
  ],

];

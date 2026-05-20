import { validationResult } from "express-validator";


// esta funcion se va a utilizar como un middleware en las rutas, para validar los datos que se reciben en el cuerpo de la peticion (req.body)....,
// ...y si hay errores de validacion, se responde con un status 400 y un objeto JSON que tiene una propiedad errors con un array de los errores encontrados.

export const validationResultExpress = (req, res, next) => {

const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
}
// si no hay errores de validacion, se llama a next() para que se ejecute el siguiente middleware o la funcion del controlador.
next();
}



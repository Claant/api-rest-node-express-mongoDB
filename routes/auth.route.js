import express from "express";
import { infoUser, login, register, refreshToken, logout } from "../controllers/auth.controller.js";
import { validationResultExpress } from "../middlewares/validationResultExpress.js";
// con este import se va a poder usar el metodo body de express-validator, que es una funcion que se utiliza para validar los datos que se reciben en el cuerpo de la peticion (req.body)....,
// ...y se puede usar para validar que el email tenga un formato correcto, que la contraseña tenga una longitud minima, etc.
import { body } from "express-validator";
import { requireToken } from "../middlewares/requireToken.js";
import { requireRefreshToken } from "../middlewares/requirerefreshToken.js";
import { bodyLoginValidator, bodyRegisterValidator } from "../middlewares/validatorManager.js";



const router = express.Router();


router.post( "/register", bodyRegisterValidator, register,);
router.post("/login", bodyLoginValidator, login ); 
router.get('/protected', requireToken, infoUser) // esta ruta es un ejemplo de una ruta protegida, que solo se puede acceder si se envia un token valido en el header de la peticion, y se valida ese token con el middleware validateToken que se definio en el archivo middlewares/validateToken.js, si el token es valido, se ejecuta el controlador infoUser que esta en controllers/auth.controller.js, y si el token no es valido, se responde con un error 401 indicando que no se tiene autorizacion para acceder a esa ruta.
router.get("/refresh", requireRefreshToken, refreshToken);
router.get("/logout", logout);

export default router;

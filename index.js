import 'dotenv/config';
// aca importamos la conexion a la base de datos, para que se ejecute al iniciar el servidor
import "./database/connectdb.js";
import express from 'express';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

const app = express();
// para que el servidor pueda entender las peticiones con formato JSON, y poder acceder a los datos que se envian en el cuerpo de la peticion (req.body)
app.use(express.json()); 

app.use(cookieParser()); // aca se le dice a express que use el middleware cookieParser, para poder acceder a las cookies que se envian en el header de la peticion (req.cookies), y asi poder validar el token que se envia en la cookie, con el middleware validateToken que se definio en el archivo middlewares/validateToken.js, si el token es valido, se ejecuta el controlador infoUser que esta en controllers/auth.controller.js, y si el token no es valido, se responde con un error 401 indicando que no se tiene autorizacion para acceder a esa ruta.
// aca usamos la ruta de authRouter, para que todas las rutas que se definan en ese archivo, esten disponibles en el servidor.
app.use('/api/v1/auth', authRouter);

app.use(express.static('public')); // aca se le dice a express que use la carpeta public para servir archivos estaticos, como el index.html, y asi poder acceder a ese archivo desde el navegador, y probar la ruta protegida que se definio en el archivo routes/auth.route.js, que es la ruta /protected, esta ruta solo se puede acceder si se envia un token valido en el header de la peticion, y se valida ese token con el middleware validateToken que se definio en el archivo middlewares/validateToken.js, si el token es valido, se ejecuta el controlador infoUser que esta en controllers/auth.controller.js, y si el token no es valido, se responde con un error 401 indicando que no se tiene autorizacion para acceder a esa ruta.


// aca en caso que un servidor ya sea heroku o render, no usen un puerto por defecto, usarian el puerto 5000
const PORT = process.env.PORT || 5000;

// aca se levanta el servidor en el puerto 5000
app.listen(PORT, () => {
    console.log('👍👍👍 Esta corriendo el servidor en el puerto 5000 http://localhost:'+ PORT);
});


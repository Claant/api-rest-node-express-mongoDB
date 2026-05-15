import 'dotenv/config';
// aca importamos la conexion a la base de datos, para que se ejecute al iniciar el servidor
import "./database/connectdb.js";
import express from 'express';
import authRouter from './routes/auth.route.js';

const app = express();
// para que el servidor pueda entender las peticiones con formato JSON, y poder acceder a los datos que se envian en el cuerpo de la peticion (req.body)
app.use(express.json()); 
// aca usamos la ruta de authRouter, para que todas las rutas que se definan en ese archivo, esten disponibles en el servidor.
app.use('/api/v1/auth', authRouter);


// aca en caso que un servidor ya sea heroku o render, no usen un puerto por defecto, usarian el puerto 5000
const PORT = process.env.PORT || 5000;

// aca se levanta el servidor en el puerto 5000
app.listen(PORT, () => {
    console.log('👍👍👍 Esta corriendo el servidor en el puerto 5000 http://localhost:'+ PORT);
});


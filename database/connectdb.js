import mongoose from "mongoose";

// mongoose.connect(process.env.URI_MONGO) se conecta a la base de datos, utilizando...
// ...la cadena de conexion que esta en el archivo .env, como variable de entorno.
// como es una operacion asincrona, se utiliza await para esperar a que se conecte antes de continuar con el resto del codigo.
try{
    await mongoose.connect(process.env.URI_MONGO)
    console.log('Conectado a la base de datos de mongoDB Atlas OK');
}catch(error){
    console.log('Error al conectar a la base de datos de mongoDB Atlas', error);
}



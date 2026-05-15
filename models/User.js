import bcryptjs from "bcryptjs";
import mongoose from "mongoose";



// aca se define el esquema de la coleccion de usuarios.
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,      // el campo es obligatorio
        trim: true,          // limpia los espacios en blanco al inicio y al final del string
        unique: true,        // el valor del campo debe ser unico en la coleccion, no puede haber dos usuarios con el mismo email
        lowercase: true,     // convierte el valor del campo a minusculas antes de guardarlo en la base de datos
        index: {unique: true}, // crea un indice unico en el campo email, para mejorar el rendimiento de las consultas
    },
    password: {
        type: String,
        required: true
    },
    })

   
// antes de ejecutarse alguna accion se realiza una intercepcion
// En el pre se captura toda la informacion del usuario.
// con el this podemos acceder a los datos del usuario que se esta guardando.
// con esta funcion se encripta la contraseña del usuario antes de guardarla en la base de datos.
// hash() es una funcion de la libreria bcryptjs que se utiliza para encriptar la contraseña.
userSchema.pre('save', async function(next) {
   const user = this; 
   if(!user.isModified('password')) return next(); // si el campo password no ha sido modificado, se salta el proceso de encriptacion y se continua con la siguiente accion.

    try{
    const salt = await bcryptjs.genSalt(10)   // aca en esta linea con bcryptjs se genera un salt, que es una cadena de caracteres aleatoria que se utiliza para encriptar la contraseña, y se le pasa un numero que indica el numero de rondas de encriptacion, entre mas rondas, mas seguro es el hash generado, pero tambien tarda mas tiempo en generarlo.
    user.password = await bcryptjs.hash(user.password, salt)
    next();
   }catch(error){
    console.log(error);
    throw new Error('Error al encriptar la contraseña');
   }
});

 // aca se exporta el modelo de usuario, que es una clase que representa la coleccion de usuarios en la base de datos....,
    // y permite crear, leer, actualizar y eliminar documentos en esa coleccion.  
    // Model se usa para crear un modelo a partir del esquema definido, el primer argumento es el nombre del modelo (en singular)...,
    // y el segundo argumento es el esquema que se va a usar para ese modelo.

export const User = mongoose.model('User', userSchema);
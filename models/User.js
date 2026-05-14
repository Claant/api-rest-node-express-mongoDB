import {Schema, model} from "mongoose";


// aca se define el esquema de la coleccion de usuarios.
const userSchema = new Schema({
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

    // aca se exporta el modelo de usuario, que es una clase que representa la coleccion de usuarios en la base de datos....,
    // y permite crear, leer, actualizar y eliminar documentos en esa coleccion.  
    // Model se usa para crear un modelo a partir del esquema definido, el primer argumento es el nombre del modelo (en singular)...,
    // y el segundo argumento es el esquema que se va a usar para ese modelo.
export const User = model('User', userSchema);
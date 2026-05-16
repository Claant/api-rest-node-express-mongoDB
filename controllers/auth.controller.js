import {User} from "../models/User.js";   // esto es una importacion nombrada, se importa el modelo de usuario que se exporto en el archivo User.js, y se le asigna el nombre de User, para poder usarlo en este archivo.

//  Lo que se esta haciendo en esta ruta es recibir una peticion POST a la ruta /login.....,
//  ....y responder con un objeto JSON que tiene una propiedad ok con el valor true. 
// Esto es solo un ejemplo de como se podria implementar una ruta de login.
export const register = async (req, res) => {
    const {email, password} = req.body;
    try {
        // alternativa buscando por email
        let user = await User.findOne({email});  // aca se busca en la base de datos si ya existe un usuario con el email que se recibio en el cuerpo de la peticion (req.body), y se le asigna a la variable user, si no existe un usuario con ese email, user va a ser null.
        if(user) throw {code: 11000};           // si user no es null, es decir, si ya existe un usuario con ese email, se lanza un error con el codigo 11000, que es el codigo de error que se produce cuando se intenta insertar un documento con un valor de un campo que tiene un indice unico, y ese valor ya existe en otro documento de la coleccion. En este caso, el campo email tiene un indice unico, por lo que si se intenta registrar un usuario con un email que ya existe en la base de datos, se va a producir este error.
        
        user = new User({email, password});     // aca se crea una nueva instancia del modelo de usuario, y se le pasan los datos que se recibieron en el cuerpo de la peticion (req.body), que son el email y la contraseña.
        await user.save();                      // aca con save se guarda el usuario en la base de datos, y como se definio en el modelo de usuario, antes de guardarlo se encripta la contraseña, gracias al pre que se definio en el modelo.
                          
        //jwt token        
        return res.status(201).json({ok:true})
    } catch (error) {         
        console.log(error);
        // alternativa por defecto mongoose
        if(error.code === 11000){   // el error 11000 es un error de MongoDB que se produce cuando se intenta insertar un documento con un valor de un campo que tiene un indice unico, y ese valor ya existe en otro documento de la coleccion. En este caso, el campo email tiene un indice unico, por lo que si se intenta registrar un usuario con un email que ya existe en la base de datos, se va a producir este error.
            return res.status(400).json({error: "El email ya esta registrado"});
        }  
        return res.status(500).json({error: "Error dde servidor"});
    }
}   

export const login = async (req, res) => {
    res.json({ok: "Login"});
}

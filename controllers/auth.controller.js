import {User} from "../models/User.js";   // esto es una importacion nombrada, se importa el modelo de usuario que se exporto en el archivo User.js, y se le asigna el nombre de User, para poder usarlo en este archivo.

//  Lo que se esta haciendo en esta ruta es recibir una peticion POST a la ruta /login.....,
//  ....y responder con un objeto JSON que tiene una propiedad ok con el valor true. 
// Esto es solo un ejemplo de como se podria implementar una ruta de login.
export const register = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = new User({email, password});  // aca se crea una nueva instancia del modelo de usuario, y se le pasan los datos que se recibieron en el cuerpo de la peticion (req.body), que son el email y la contraseña.
        await user.save();        // aca con save se guarda el usuario en la base de datos, y como se definio en el modelo de usuario, antes de guardarlo se encripta la contraseña, gracias al pre que se definio en el modelo.
        //jwt token        
        return res.json({ok:true})
    } catch (error) {         
        console.log(error);  
    }
}   


export const login = async (req, res) => {
    res.json({ok: "Login"});
}

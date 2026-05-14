

//  Lo que se esta haciendo en esta ruta es recibir una peticion POST a la ruta /login.....,
//  ....y responder con un objeto JSON que tiene una propiedad ok con el valor true. 
// Esto es solo un ejemplo de como se podria implementar una ruta de login.
export const register = (req, res) => {
    console.log(req.body);
    res.json({ok: "Register"});
}   


export const login = (req, res) => {
    res.json({ok: "Login"});
}

var rutas = require("express").Router();
var { mostrarUsuarios, busXId, deleteUser, newUser, editUser, login } = require("../bd/usuarioBD");

rutas.post("/login", async(req,res)=>{
    const usuario = await login(req, req.body.usuario, req.body.password);   
    res.json(usuario);
});



// Obtener todos los usuarios
rutas.get("/", async (req, res) => {
    var usuariosValidos = await mostrarUsuarios();
    res.json(usuariosValidos);
});

// Buscar usuario por ID
rutas.get("/buscarPorId/:id", async (req, res) => {
    var usuarioValido = await busXId(req.params.id);
    res.json(usuarioValido);
});

// Borrar usuario por ID
rutas.delete("/borrarUsuario/:id", async (req, res) => {
    var usuarioBorrado = await deleteUser(req.params.id);
    res.json(usuarioBorrado);
});

// Crear un nuevo usuario
rutas.post("/nuevoUsuario", async (req, res) => {
    var usuarioValido = await newUser(req.body);
    res.json(usuarioValido);
});

// Editar un usuario existente por ID
rutas.put("/editarUsuario/:id", async (req, res) => {
    var usuarioEditado = await editUser(req.params.id, req.body);
    res.json(usuarioEditado);
});

module.exports = rutas;

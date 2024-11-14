const usuariosBD = require("./conexion").usuarios;
const Usuario = require("../modelos/UsuarioModelo");
const { usuarios } = require("./conexion");
const { encryptPass, validarPass } = require("../middlewares/funcionesPass");

function validarDatos(usuario) {
    return usuario.nombre !== undefined && usuario.usuario !== undefined && usuario.password !== undefined;
}

async function login(req, usuario, password) {
    const usuariosCorrectos = await usuariosBD.where("usuario", "==", usuario).get();
    let user = {
        usuario: "anonimo",
        tipoUsuario: "sin acceso"
    };

    usuariosCorrectos.forEach(usu => {
        const usuarioCorrecto = validarPass(password, usu.data().password, usu.data().salt);
        if (usuarioCorrecto) {
            user.usuario = usu.data().usuario;
            if (usu.data().tipoUsuario === "usuario") {
                req.session.usuario = req.session.usuario;
                user.tipoUsuario = "usuario";
            } else if (usu.data().tipoUsuario === "admin") {
                req.session.admin = "admin";
                user.tipoUsuario = req.session.admin;
            }
        }
    });
    return user;
}

async function mostrarUsuarios() {
    const usuarios = await usuariosBD.get();
    let usuariosValidos = [];
    usuarios.forEach(usuario => {
        const usuario1 = new Usuario({ id: usuario.id, ...usuario.data() });
        if (validarDatos(usuario1.getUsuario)) {
            usuariosValidos.push(usuario1.getUsuario);
        }
    });
    return usuariosValidos;
}

async function busXId(id) {
    const usuario = await usuariosBD.doc(id).get();
    const usuario1 = new Usuario({ id: usuario.id, ...usuario.data() });
    if (validarDatos(usuario1.getUsuario)) {
        return usuario1.getUsuario;
    }
    return null;
}

async function busXNombreUsuario(nombreUsuario) {
    const querySnapshot = await usuarios.where("nombre", "==", nombreUsuario).get();
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
    }
    throw new Error('Usuario no encontrado');
}

async function newUser(data) {
    const { salt, hash } = encryptPass(data.password);
    data.password = hash;
    data.salt = salt;
    data.tipoUsuario = "usuario";
    const usuario1 = new Usuario(data);
    if (validarDatos(usuario1.getUsuario)) {
        await usuariosBD.doc().set(usuario1.getUsuario);
        return true;
    }
    return false;
}

async function deleteUser(id) {
    const usuarioValido = await busXId(id);
    if (usuarioValido) {
        await usuariosBD.doc(id).delete();
        return true;
    }
    return false;
}

async function editUser(id, newData) {
    const usuarioExistente = await busXId(id);
    if (usuarioExistente) {
        const usuarioActualizado = {};
        if (newData.nombre !== undefined) {
            usuarioActualizado.nombre = newData.nombre;
        }
        if (newData.usuario !== undefined) {
            usuarioActualizado.usuario = newData.usuario;
        }
        if (newData.password !== undefined) {
            usuarioActualizado.password = newData.password;
        }

        if (Object.keys(usuarioActualizado).length > 0) {
            await usuariosBD.doc(id).update(usuarioActualizado);
            return true;
        }
    }
    return false;
}

module.exports = {
    mostrarUsuarios,
    busXId,
    deleteUser,
    newUser,
    editUser,
    login,
    busXNombreUsuario
};

const { productos } = require("./conexion");
const productosBD = require("./conexion").productos;
const Producto = require("../modelos/ProductoModelo");

// Función para validar datos del producto
function validarDatos(producto) {
    return producto.nombre !== undefined && producto.precio !== undefined && producto.cantidad !== undefined;
}

// Mostrar todos los productos
async function mostrarProductos() {
    const productos = await productosBD.get();
    let productosValidos = [];
    productos.forEach(producto => {
        const producto1 = new Producto({ id: producto.id, ...producto.data() });
        if (validarDatos(producto1.getProducto)) {
            productosValidos.push(producto1.getProducto);
        }
    });
    return productosValidos;
}

// Buscar producto por ID
async function busXId(id) {
    const producto = await productosBD.doc(id).get();
    const producto1 = new Producto({ id: producto.id, ...producto.data() });
    if (validarDatos(producto1.getProducto)) {
        return producto1.getProducto;
    }
    return null;
}

// Función para buscar producto por nombre
async function busXNombreProducto(nombreProducto) {
    if (!nombreProducto || nombreProducto.trim() === "") {
        throw new Error('El nombre del producto no puede ser vacío'); // Verificación para nombre vacío
    }
    const querySnapshot = await productos.where("nombre", "==", nombreProducto).get();
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data(); // Retorna el primer producto que coincide
    }
    return null;
}

// Crear un nuevo producto
async function newProd(data) {
    const producto1 = new Producto(data);
    if (validarDatos(producto1.getProducto)) {
        await productosBD.doc().set(producto1.getProducto);
        return true;
    }
    return false;
}

// Borrar producto por ID
async function deleteProd(id) {
    const productoValido = await busXId(id);
    if (productoValido) {
        await productosBD.doc(id).delete();
        return true;
    }
    return false;
}

// Editar producto por ID
async function editarProd(id, data) {
    const productoExistente = await busXId(id);
    if (productoExistente) {
        const productoNuevo = new Producto(data);
        if (validarDatos(productoNuevo.getProducto)) {
            await productosBD.doc(id).update(productoNuevo.getProducto);
            return true;
        }
    }
    return false;
}

module.exports = {
    mostrarProductos,
    busXId,
    deleteProd,
    newProd,
    editarProd,
    busXNombreProducto
};
const ventasBD = require("./conexion").ventas;
const usuarioBD = require("./conexion").usuarios;
const productoBD = require("./conexion").productos;
const admin = require('firebase-admin');
const Venta = require("../modelos/VentaModelo");

function validarDatos(venta) {
    return venta.idUsuario !== undefined && 
           venta.idProducto !== undefined && 
           venta.fec_hora !== undefined && 
           venta.cantidad !== undefined &&
           venta.estado !== undefined;
}

async function mostrarVentas() {
    const ventas = await ventasBD.get();
    let ventasValidas = [];
    
    for (const venta of ventas.docs) {
        const venta1 = new Venta({ id: venta.id, ...venta.data() });
        if (!venta1.idUsuario || !venta1.idProducto) {
            console.log("ID de usuario o producto no válido en la venta:", venta1);
            continue; 
        }
        const usuario1 = await usuarioBD.doc(venta1.idUsuario).get(); 
        const producto1 = await productoBD.doc(venta1.idProducto).get(); 
        
        if (!usuario1.exists || !producto1.exists) {
            console.log("Usuario o producto no encontrado");
            continue; 
        }
        const usuario = usuario1.data();
        const producto = producto1.data();

        if (validarDatos(venta1.getVenta)) {
            const ventaConNombres = {
                ...venta1.getVenta,
                usuarioNombre: usuario.nombre, 
                productoNombre: producto.nombre
            };
            ventasValidas.push(ventaConNombres);
        }
    }

    return ventasValidas;
}

async function busXId(id) {
    const venta = await ventasBD.doc(id).get();
    
    if (!venta.exists) return null;
    
    const venta1 = new Venta({ id: venta.id, ...venta.data() });

    const usuario = await usuarioBD.doc(venta1.idUsuario).get();
    const producto = await productoBD.doc(venta1.idProducto).get();

    if (!usuario.exists || !producto.exists) return null;

    if (validarDatos(venta1.getVenta)) {
        return {
            ...venta1.getVenta,
            usuarioNombre: usuario.data().nombre,
            productoNombre: producto.data().nombre
        };
    }
    
    return null;
}

async function newSale(data) {
    if (!data.idUsuario || !data.idProducto) {
        return {
            success: false,
            message: "El ID de usuario o el ID de producto no pueden estar vacíos."
        };
    }

    const venta1 = new Venta({
        ...data, 
        fec_hora: admin.firestore.Timestamp.now(), 
        estado: 'pendiente' 
    });

    const usuario = await usuarioBD.doc(data.idUsuario).get();
    const producto = await productoBD.doc(data.idProducto).get();
    if (!usuario.exists || !producto.exists) {
        return {
            success: false,
            message: "El usuario o el producto no existen."
        };
    }
    if (validarDatos(venta1.getVenta)) {
        await ventasBD.doc().set({
            ...venta1.getVenta,
            estado: 'vendido' 
        });
        return { success: true };
    }

    return {
        success: false,
        message: "Los datos de la venta no son válidos."
    };
}

async function cancelSale(id) {
    const ventaValida = await busXId(id);
    
    if (ventaValida) {
        await ventasBD.doc(id).update({
            estado: 'cancelado'
        });
        return true;
    }
    
    return false;
}

async function editarVenta(id, nuevaCantidad) {
    const ventaValida = await busXId(id); 

    if (!ventaValida) {
        return false; 
    }
    await ventasBD.doc(id).update({
        cantidad: nuevaCantidad 
    });

    return true;
}

module.exports = {
    mostrarVentas,
    busXId,
    cancelSale,
    newSale,
    editarVenta 
};
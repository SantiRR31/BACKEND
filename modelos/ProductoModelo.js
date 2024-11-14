class Producto {
    constructor(data) {
        this.id = data.id;             
        this.nombre = data.nombre;     
        this.precio = data.precio;     
        this.cantidad = data.cantidad; 
    }

    set id(id) {
        this._id = id; 
    }

    set nombre(nombre) {
        this._nombre = nombre; 
    }

    set precio(precio) {
        this._precio = precio; 
    }

    set cantidad(cantidad) {
        this._cantidad = cantidad; 
    }

    get id() {
        return this._id; 
    }

    get nombre() {
        return this._nombre; 
    }

    get precio() {
        return this._precio; 
    }

    get cantidad() {
        return this._cantidad;
    }

    get getProducto() {
        const conid = {
            id: this.id,
            nombre: this.nombre,
            precio: this.precio,
            cantidad: this.cantidad,
        };
        const sinid = {
            nombre: this.nombre,
            precio: this.precio,
            cantidad: this.cantidad,
        };
        if (this.id === undefined) {
            return sinid; 
        } else {
            return conid; 
        }
    }
}

module.exports = Producto;
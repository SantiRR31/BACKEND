class Venta {
    constructor(data) {
        this.id = data.id;              
        this.idUsuario = data.idUsuario;  
        this.idProducto = data.idProducto;
        this.fec_hora = data.fec_hora;    
        this.cantidad = data.cantidad;     
        this.estado = data.estado; 
    }

    set id(id) {
        this._id = id; 
    }

    set idUsuario(idUsuario) {
        this._idUsuario = idUsuario; 
    }

    set idProducto(idProducto) {
        this._idProducto = idProducto;
    }

    set fec_hora(fec_hora) {
        this._fec_hora = fec_hora; 
    }

    set cantidad(cantidad) {
        this._cantidad = cantidad; 
    }

    set estado(estado) {
        this._estado = estado; 
    }

    get id() {
        return this._id; 
    }

    get idUsuario() {
        return this._idUsuario;
    }

    get idProducto() {
        return this._idProducto; 
    }

    get fec_hora() {
        return this._fec_hora; 
    }

    get cantidad() {
        return this._cantidad; 
    }

    get estado() {
        return this._estado;
    }

    get getVenta() {
        const conid = {
            id: this.id,
            idUsuario: this.idUsuario,
            idProducto: this.idProducto,
            fec_hora: this.fec_hora,
            cantidad: this.cantidad,
            estado: this.estado 
        };
        const sinid = {
            idUsuario: this.idUsuario,
            idProducto: this.idProducto,
            fec_hora: this.fec_hora,
            cantidad: this.cantidad,
            estado: this.estado 
        };
        if (this.id === undefined) {
            return sinid; 
        } else {
            return conid; 
        }
    }
}
module.exports = Venta; 
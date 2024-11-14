const rutas = require("express").Router();
const { mostrarVentas, busXId, cancelSale, newSale, editarVenta } = require("../bd/ventasBD");

rutas.get("/", async (req, res) => {
    const ventasValidas = await mostrarVentas();
    res.json(ventasValidas); 
});

rutas.post("/nuevaVenta", async (req, res) => {
    const ventaValida = await newSale(req.body);
    res.json(ventaValida);
});
rutas.get("/buscarPorId/:id", async (req, res) => {
    const ventaValida = await busXId(req.params.id);
    res.json(ventaValida);
});

rutas.patch("/cancelarVenta/:id", async (req, res) => {
    const ventaCancelada = await cancelSale(req.params.id);
    res.json(ventaCancelada);
});

rutas.patch("/editarVenta/:id", async (req, res) => {
    const { cantidad } = req.body; 
    const ventaEditada = await editarVenta(req.params.id, cantidad);
    res.json(ventaEditada);
});

module.exports = rutas;
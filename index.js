const express = require("express");
const session = require("express-session");
const cors = require("cors");
const usuariosRutas = require("./routes/rutasUsuarios");
const productosRutas = require("./routes/rutasProductos");
const ventasRutas = require("./routes/rutasVentas");

const app = express();
app.use(session({
    secret:"lkjlkj656New",
    resave:true,
    saveUninitialized:true,
    cookie:{secure:true}
}));


// Middleware para procesar datos de formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
// Cargar rutas
app.use("/", usuariosRutas);
app.use("/productos", productosRutas); // Cargar rutas de productos
app.use("/ventas", ventasRutas);

// Configuración del puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});

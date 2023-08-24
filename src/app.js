const express = require("express");
const cors = require("cors");
const router = require("./router");

const app = express();

app.use(express.json());

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    app.use(cors());
    next();
});

app.use(router);

// Tratamento de URL não encontrada
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found!' });
});

module.exports = app;
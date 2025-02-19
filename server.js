const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("usuarios_db", "root", "my-secret-pw", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

const Usuario = sequelize.define("Usuario", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

sequelize.sync()
  .then(() => console.log("Base de datos sincronizada"))
  .catch((err) => console.error("Error al sincronizar la BD", err));

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ mensaje: "Bienvenido a la API de Usuarios" });
});

app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
});

app.post("/usuarios", async (req, res) => {
  const { nombre, email } = req.body;
  try {
    const usuario = await Usuario.create({ nombre, email });
    res.status(201).json(usuario);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(400).json({ error: "Error al crear usuario", details: error.message });
  }
});


app.get("/usuarios/:id", async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  res.json(usuario);
});

app.delete("/usuarios/:id", async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  await usuario.destroy();
  res.json({ mensaje: "Usuario eliminado" });
});

const PORT = 6969;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

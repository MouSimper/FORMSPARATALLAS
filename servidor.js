const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Archivos importantes
const respuestasPath = path.join(__dirname, 'respuestas.json');
const trabajadoresPath = path.join(__dirname, 'trabajadores.json');

// Leer respuestas existentes o inicializar
function leerRespuestas() {
  if (fs.existsSync(respuestasPath)) {
    const data = fs.readFileSync(respuestasPath);
    return JSON.parse(data);
  }
  return [];
}

// Leer trabajadores (por si quieres validar más adelante)
function leerTrabajadores() {
  if (fs.existsSync(trabajadoresPath)) {
    const data = fs.readFileSync(trabajadoresPath);
    return JSON.parse(data);
  }
  return [];
}

// Ruta para recibir respuestas
app.post('/enviar', (req, res) => {
  const { dni, nombre, opcion, comentario } = req.body;

  if (!dni || !opcion) {
    return res.status(400).json({ message: 'Faltan datos necesarios.' });
  }

  const respuestas = leerRespuestas();

  respuestas.push({
    timestamp: new Date().toISOString(),
    dni: dni,
    nombre: nombre || "-",  // Si no hay nombre, se pone "-"
    opcion: opcion,
    comentario: comentario || "-"
  });

  fs.writeFileSync(respuestasPath, JSON.stringify(respuestas, null, 2));
  res.json({ message: 'Respuesta guardada exitosamente.' });
});

// Ruta para ver respuestas
app.get('/respuestas', (req, res) => {
  const respuestas = leerRespuestas();
  res.json(respuestas);
});

// Servir archivos estáticos (index.html, respuestas.html, etc.)
app.use(express.static(__dirname));

// Servir trabajadores.json
app.get('/trabajadores.json', (req, res) => {
  res.sendFile(trabajadoresPath);
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

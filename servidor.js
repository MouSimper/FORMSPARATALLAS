const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const archivoRespuestas = path.join(__dirname, 'respuestas.json');

// Ruta para guardar respuestas
app.post('/enviar', (req, res) => {
  const { dni, desacuerdo, comentario } = req.body;

  let respuestas = [];

  // Leer respuestas existentes si ya hay
  if (fs.existsSync(archivoRespuestas)) {
    const data = fs.readFileSync(archivoRespuestas, 'utf-8');
    respuestas = JSON.parse(data);
  }

  // Nueva respuesta
  const nuevaRespuesta = {
    timestamp: new Date().toISOString(),
    dni,
    desacuerdo: desacuerdo ? "Sí" : "No",
    comentario
  };

  respuestas.push(nuevaRespuesta);

  // Guardar todas las respuestas actualizadas
  fs.writeFileSync(archivoRespuestas, JSON.stringify(respuestas, null, 2));

  res.json({ message: 'Respuesta guardada correctamente.' });
});

// Ruta para obtener las respuestas (protección muy simple para respuestas.html)
app.get('/respuestas', (req, res) => {
  if (fs.existsSync(archivoRespuestas)) {
    const data = fs.readFileSync(archivoRespuestas, 'utf-8');
    res.json(JSON.parse(data));
  } else {
    res.json([]);
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

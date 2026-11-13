import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import notaRoutes from './routes/nota.routes.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);
const mongoUri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api/notas', notaRoutes);

app.use((error, _req, res, _next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    const msg = Object.values(error.errors).map((item) => item.message).join(', ');
    return res.status(400).json({ ok: false, msg });
  }

  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ ok: false, msg: 'El cuerpo de la solicitud no es JSON válido.' });
  }

  console.error('Error en la API:', error);
  return res.status(500).json({ ok: false, msg: 'Ocurrió un error en el servidor.' });
});

if (!mongoUri) {
  console.error('Falta MONGODB_URI. Crea backend/.env a partir de backend/.env.example.');
  process.exitCode = 1;
} else if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT debe ser un número entero entre 1 y 65535.');
  process.exitCode = 1;
} else {
  try {
    await mongoose.connect(mongoUri);
    app.listen(port, () => {
      console.log(`API lista en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a MongoDB:', error.message);
    process.exitCode = 1;
  }
}

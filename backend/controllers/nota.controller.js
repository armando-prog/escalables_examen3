import mongoose from 'mongoose';
import { Nota } from '../models/nota.js';

export const obtenerNotas = async (_req, res, next) => {
  try {
    const notas = await Nota.find().sort({ _id: -1 });
    res.status(200).json(notas);
  } catch (error) {
    next(error);
  }
};

export const crearNota = async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ ok: false, msg: 'El cuerpo de la solicitud debe ser un objeto JSON.' });
    }

    const nota = await Nota.create({
      titulo: req.body.titulo,
      contenido: req.body.contenido
    });

    res.status(201).json(nota);
  } catch (error) {
    next(error);
  }
};

export const actualizarNota = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ ok: false, msg: 'El identificador de la nota no es válido.' });
  }

  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ ok: false, msg: 'El cuerpo de la solicitud debe ser un objeto JSON.' });
  }

  const { titulo, contenido } = req.body;

  if (typeof titulo !== 'string' || typeof contenido !== 'string' || !titulo.trim() || !contenido.trim()) {
    return res.status(400).json({ ok: false, msg: 'El título y el contenido son obligatorios.' });
  }

  try {
    const nota = await Nota.findByIdAndUpdate(
      id,
      { titulo, contenido },
      { new: true, runValidators: true }
    );

    if (!nota) {
      return res.status(404).json({ ok: false, msg: 'La nota no existe.' });
    }

    return res.status(200).json(nota);
  } catch (error) {
    next(error);
  }
};

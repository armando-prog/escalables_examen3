import { Router } from 'express';
import { actualizarNota, crearNota, obtenerNotas } from '../controllers/nota.controller.js';

const router = Router();

router.get('/', obtenerNotas);
router.post('/', crearNota);
router.patch('/:id', actualizarNota);

export default router;

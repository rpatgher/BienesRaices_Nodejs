import express from 'express';
import {    formularioLogin,
            auteticarUsuario,
            cerrarSesion,
            formularioRegistro, 
            registrar,
            confirmarCuenta,
            formularioOlvidePassword,
            resetPassword,
            comprobarToken,
            nuevoPassword
        } from '../controllers/UsuarioController.js';

const router = express.Router();

router.get('/login', formularioLogin);
router.post('/login', auteticarUsuario);

router.post('/cerrar-sesion', cerrarSesion);

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

router.get('/confirmar-cuenta/:token', confirmarCuenta);

router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', resetPassword);

router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

export default router;
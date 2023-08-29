import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import Usuario from '../models/Usuario.js';
import { generarId, generarJWT } from '../helpers/tokens.js';
import { emailRegistro, emailRecuperacion } from '../helpers/emails.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    });
}

const auteticarUsuario = async (req, res) => {
    await check('email').notEmpty().withMessage('El Email no puede ir vacío').run(req);
    await check('password').notEmpty().withMessage('El Password no puede ir vacío').run(req);

    let resultado = validationResult(req);

    //Verificar que no estén vacíos los campos
    if(!resultado.isEmpty()){
        // Errores
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                email: req.body.email
            }
        });
    }

    // Identifica al usuario
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email }});

    // Verificar que el usuario exista y esté confirmado
    if(!usuario || usuario.confirmado !== true){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [ {msg: 'El usuario no existe o no está confirmado'} ],
            usuario: {
                email: email
            }
        });
    }

    // Revisar password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [ {msg: 'El Password es incorrecto'} ],
            usuario: {
                email: email
            }
        });
    }

    // Autenticar al usuario
    const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });

    // Almacenar en un cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        // secure: true, 
        // sameSite: true
    }).redirect('/mis-propiedades');

    res.json({token});
}

const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login');
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    });
}

const registrar = async (req, res) => {
    // Validación 
    await check('nombre').notEmpty().withMessage('El Nombre no puede ir vacío').run(req);
    await check('email').isEmail().withMessage('Eso no parece un Email').run(req);
    await check('password').isLength({ min: 6}).withMessage('El Password debe ser de al menos 6 caracteres').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Los Passwords no coinciden').run(req);

    let resultado = validationResult(req);

    //Verificar que el resultado esté vacío
    if(!resultado.isEmpty()){
        // Errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    const { nombre, email, password } = req.body

    // Verificar que el usuario no esté verificado
    const existeUsuario = await Usuario.findOne({ where: { email } });
    if(existeUsuario){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [ {msg: 'El usuario ya está registrado'} ],
            usuario: {
                nombre: nombre,
                email: email
            }
        });
    }

    // Almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token : generarId()
    });

    // Enviar Email de confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });

    // Mostrar mensaje de confirmación
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos Enviado un Email de Confirmación a tu Correo'
    });

}

// Función para confirmar una cuenta
const confirmarCuenta = async (req, res) => {
    const { token } = req.params

    // Verificar si el token es válido
    const usuario = await Usuario.findOne({ where: { token } });
    
    if(!usuario){
        return res.render('auth/confirmar', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        });
    }

    // Confirmar cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar', {
        pagina: 'Confirma tu Cuenta',
        mensaje: 'Su cuenta fue confirmada correctamente'
    });
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide', {
        pagina: 'Recupera tu acceso a Bienes Raíces',
        csrfToken: req.csrfToken()
    });
}

const resetPassword = async (req, res) => {
    // Validar email
    await check('email').isEmail().withMessage('Eso no parece un Email').run(req);

    let resultado = validationResult(req);

    //Verificar que el resultado esté vacío
    if(!resultado.isEmpty()){
        // Errores
        return res.render('auth/olvide', {
            pagina: 'Recupera tu acceso a Bienes Raíces',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }

    // Verificar que el usuario no esté verificado
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if(!usuario){
        return res.render('auth/olvide', {
            pagina: 'Recupera tu acceso a Bienes Raíces',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El email no pertenece a nigún usuario'}],
        });
    }

    // Generar token
    usuario.token = generarId();
    await usuario.save();

    // Enviar Email de recuperación
    emailRecuperacion({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });

    // Mostrar mensaje de confirmación
    res.render('templates/mensaje', {
        pagina: 'Recuperar el Acceso a tu Cuenta',
        mensaje: 'Hemos Enviado un Email con las Intrucciones a tu Correo'
    });
    
}

const comprobarToken = async (req, res) => {
    const { token } = req.params

    // Verificar si el token es válido
    const usuario = await Usuario.findOne({ where: { token } });
    
    if(!usuario){
        return res.render('auth/confirmar', {
            pagina: 'Reestablece tu Password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        });
    }
    res.render('auth/reestablecer', {
        pagina: 'Reestablece tu Password',
        csrfToken: req.csrfToken()
    });
}

const nuevoPassword = async (req, res) => {
    // Validar password
    await check('password').isLength({ min: 6}).withMessage('El Password debe ser de al menos 6 caracteres').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Los Passwords no coinciden').run(req);

    let resultado = validationResult(req);

    //Verificar que el resultado esté vacío
    if(!resultado.isEmpty()){
        // Errores
        return res.render('auth/reestablecer', {
            pagina: 'Reestablece tu Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }

    // Identificar quien hace el cambio
    const { token } = req.params;
    const { password } = req.body
    const usuario = await Usuario.findOne({ where: { token }});

    // Hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    await usuario.save();

    // Mostrar mensaje de confirmación
    res.render('auth/confirmar', {
        pagina: 'Password Reestablecido Correctamente',
        mensaje: 'Tu Password se reestableció correctamente'
    });
}

export {
    formularioLogin,
    auteticarUsuario,
    cerrarSesion,
    formularioRegistro,
    registrar,
    confirmarCuenta,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}
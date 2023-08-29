import { unlink } from 'node:fs/promises';
import { validationResult } from 'express-validator';

import  { Precio, Categoria, Propiedad, Mensaje, Usuario} from '../models/index.js';
import { esVendedor, formatearFecha } from '../helpers/index.js';

// Vista que muestra las propiedades del usuario
const admin = async (req, res) => {
    // Leer query string
    const { page } = req.query;

    // Validar que sea número y que esté presente siempre
    const expresion = /^[1-9]$/;

    if(!expresion.test(page)){
        res.redirect('/mis-propiedades?page=1');
    }

    try {
        const {id} = req.usuario;

        // Límites y Offset para el paginador
        const limit = 5;
        const offset = ((page * limit) - limit);

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: { usuarioId: id },
                include: [
                    { model: Categoria, as: 'categoria' },
                    { model: Precio, as: 'precio' },
                    { model: Mensaje, as: 'mensajes' }
                ]
            }),
            Propiedad.count({
                where: {
                    usuarioId: id
                }
            })

        ]);
        
        res.render('propiedades/admin', {
            pagina: 'Mis Propiedades',
            propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            page: Number(page),
            total,
            offset,
            limit
        });
    } catch (error) {
        console.log(error);
    }
}

// Formulario para crear una nueva propiedad (Vista)
const crear = async (req, res) => {
    // Consultar modelos de precio y categorias
    const [precios, categorias] = await Promise.all([
        Precio.findAll(),
        Categoria.findAll()
    ]);

    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(),
        precios,
        categorias,
        datos: {}
    });
}

// Función que recibe el formulario de guardar propiedad
const guardar = async (req, res) => {
    // Validar campos vacíos
    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        // Consultar modelos de precio y categorias
        const [precios, categorias] = await Promise.all([
            Precio.findAll(),
            Categoria.findAll()
        ]);
        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            precios,
            categorias,
            datos: req.body
        });
    }

    // Crear Registro
    const { titulo, descripcion, categoria:categoriaId, precio:precioId, habitaciones, estacionamiento, wc, calle, lat, lng } = req.body;
    const { id:usuarioId } = req.usuario;
    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            categoriaId,
            precioId,
            usuarioId,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            imagen: ''
        });

        const {id} = propiedadGuardada;

        res.redirect(`/propiedades/agregar-imagen/${id}`);
        
    } catch (error) {
        console.log(error);
    }
}

// Formulario para agregar imagen (Vista) 
const agregarImagen = async (req, res) => {
    const { id } = req.params;

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad no esté publicada
    if(propiedad.publicado){
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad pertenece a quien visita esta página
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades');
    }

    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen a ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    });
}

// Función que guarda la imagen en el servidor
const almacenarImagen = async (req, res, next) => {
    const { id } = req.params;

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad no esté publicada
    if(propiedad.publicado){
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad pertenece a quien visita esta página
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades');
    }

    try {
        // console.log(req.file);
        // Almacenar la imagen y publicar la propiedad
        propiedad.imagen = req.file.filename;
        propiedad.publicado = 1;

        await propiedad.save();

        next();
    } catch (error) {
        console.log(error);
    }
}

// Formulario para editar una propiedad (Vista)
const editar = async (req, res) => {
    const { id } = req.params;

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad pertenece a quien visita esta página
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades');
    }

    // Consultar modelos de precio y categorias
    const [precios, categorias] = await Promise.all([
        Precio.findAll(),
        Categoria.findAll()
    ]);

    res.render('propiedades/editar', {
        pagina: `Editar Propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        precios,
        categorias,
        datos: propiedad
    });
}

// Función que recibe el formulario para actualizar propiedad
const guardarCambios = async (req,res) => {
    // Validar campos vacíos
    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        // Consultar modelos de precio y categorias
        const [precios, categorias] = await Promise.all([
            Precio.findAll(),
            Categoria.findAll()
        ]);
        return res.render('propiedades/editar', {
            pagina: "Editar Propiedad",
            csrfToken: req.csrfToken(),
            precios,
            categorias,
            errores: resultado.array(),
            datos: req.body
        });
    }

    const { id } = req.params;

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad pertenece a quien visita esta página
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades');
    }

    // Reescribir el objeto y actualizarlo
    try {
        const { titulo, descripcion, categoria:categoriaId, precio:precioId, habitaciones, estacionamiento, wc, calle, lat, lng } = req.body;
        propiedad.set({
            titulo,
            descripcion,
            categoriaId,
            precioId,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng
        });
        await propiedad.save();

        res.redirect('/mis-propiedades');

    } catch (error) {
        console.log(error);
    }
}

// Función que elimina una propieadad
const eliminar = async (req, res) => {
    const { id } = req.params;

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad pertenece a quien visita esta página
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades');
    }

    // Eliminar imágen asociada
    await unlink(`public/uploads/${propiedad.imagen}`);

    // Eliminar la propiedad
    await propiedad.destroy();
    res.redirect('/mis-propiedades');
}

// Modifica el estadp de la propiedad
const cambiarEstado = async (req, res) => {
    const { id } = req.params;

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad pertenece a quien visita esta página
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades');
    }

    // Actualizar
    propiedad.publicado = !propiedad.publicado;

    await propiedad.save();

    res.json({
        resultado: true
    });

}

// Muestra una propiedad (Vista)
const mostrarPropiedad = async (req, res) => {
    // Comprobar que la propiedad exista
    const { id } = req.params;

    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    });
    if(!propiedad || !propiedad.publicado){
        res.redirect('/404');
    }
    res.render('propiedades/mostrar', {
        pagina: propiedad.titulo,
        propiedad,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
    });
}

const enviarMensaje = async (req, res) => {
    // Comprobar que la propiedad exista
    const { id } = req.params;

    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    });

    if(!propiedad){
        res.redirect('/404');
    }

    // Renderizar los errores
    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        return res.render('propiedades/mostrar', {
            pagina: propiedad.titulo,
            propiedad,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
            errores: resultado.array()
        });
    }

    const { mensaje } = req.body;
    const { id: usuarioId } = req.usuario;

    // Almacenar el mensaje
    await Mensaje.create({
        mensaje,
        propiedadId: id,
        usuarioId
    });

    res.render('propiedades/mostrar', {
        pagina: propiedad.titulo,
        propiedad,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
        enviado: true
    });
}

// Leer mensaje recibidos
const verMensajes = async (req, res) => {
    const { id } = req.params;

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { 
                model: Mensaje, 
                as: 'mensajes', 
                include: [
                    { model: Usuario.scope('eliminarPassword'), as: 'usuario'}
                ] 
            }
        ]
    });

    if(!propiedad){
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad pertenece a quien visita esta página
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades');
    }

    res.render('propiedades/mensaje', {
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        formatearFecha
    });
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes,
    cambiarEstado
}
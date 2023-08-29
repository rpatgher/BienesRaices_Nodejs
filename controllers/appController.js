import { Sequelize } from 'sequelize';

import { Propiedad, Precio, Categoria } from '../models/index.js';

const inicio = async (req, res) => {

    const [categorias, precios, casas, departamentos] = await Promise.all([
        Categoria.findAll({ raw: true }),
        Precio.findAll({ raw: true }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include: [
                { model: Precio, as: 'precio' }
            ],
            order: [['createdAt', 'DESC']]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 2
            },
            include: [
                { model: Precio, as: 'precio' }
            ],
            order: [['createdAt', 'DESC']]
        })
    ]);

    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos,
        csrfToken: req.csrfToken()
    });
}

const categorias = async (req, res) => {
    const { id } = req.params;

    // Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id);
    if(!categoria){
        res.redirect('/404');
    }

    // Obtener las propiedades
    const propiedades = await Propiedad.findAll({ 
        where: { categoriaId: id },
        include: [ {model: Precio, as: 'precio'} ]
    });

    res.render('categoria', {
        pagina: `${categoria.nombre}s en venta`,
        propiedades,
        csrfToken: req.csrfToken()
    });
}

const noEncontrado = (req, res) => {
    res.render('404', {
        pagina: 'Página No Encontrada',
        csrfToken: req.csrfToken()
    });
}

const buscador = async (req, res) => {
    const {termino} = req.body;
    // Validar que termino no está vacío
    if(!termino.trim()){
        return res.redirect('back');
    }

    // Consultar las propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like] : '%' + termino + '%'
            },

        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    });

    res.render('busqueda', {
        pagina: 'Resultados de la Búsqueda',
        csrfToken: req.csrfToken(),
        propiedades
    });
}


export {
    inicio,
    categorias,
    noEncontrado,
    buscador
}
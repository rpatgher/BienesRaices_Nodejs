import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";
import Mensaje from "./Mensaje.js";

// Relación Propiedad-Precio-Categoria-Usuario
// Precio.hasOne(Propiedad);
Propiedad.belongsTo(Precio);
Propiedad.belongsTo(Categoria);
Propiedad.belongsTo(Usuario);
Propiedad.hasMany(Mensaje, {foreignKey: 'propiedadId'});

// Relaciones Mensaje-Usuario-Propiedad
Mensaje.belongsTo(Propiedad, { foreignKey: 'propiedadId'});
Mensaje.belongsTo(Usuario, { foreignKey: 'usuarioId'});

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje
}
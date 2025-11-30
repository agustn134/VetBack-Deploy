// const { pool } = require('../db/config');

// const LoteProductoModel = {
//     create: async ({
//         producto_id,
//         num_lote,
//         cantidad_inicial,
//         cantidad_disponible,
//         fecha_caducidad,
//         fecha_ingreso,
//         proveedor_id
//     }) => {
//         const query = `
//       INSERT INTO tlotes (
//         producto_id, 
//         num_lote, 
//         cantidad_inicial, 
//         cantidad_disponible, 
//         fecha_caducidad, 
//         fecha_ingreso, 
//         proveedor_id
//       )
//       VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE), $7)
//       RETURNING *;
//     `;

//         const values = [
//             producto_id,
//             num_lote,
//             cantidad_inicial,
//             cantidad_disponible ?? cantidad_inicial, 
//             fecha_caducidad,
//             fecha_ingreso,
//             proveedor_id
//         ];

//         try {
//             const result = await pool.query(query, values);
//             return result.rows[0];
//         } catch (error) {
//             console.error("Error al registrar el lote:", error);
//             if (error.code === '23503') {
//                 throw new Error("Violación de clave foránea: El producto_id no existe en la tabla tProductos.");
//             }
//             throw error;
//         }
//     },

//     findAll: async () => {
//         const query = 'SELECT * FROM tLotes ORDER BY fecha_caducidad ASC;';
//         try {
//             const result = await pool.query(query);
//             return result.rows;
//         } catch (error) {
//             console.error("Error al obtener todos los lotes:", error);
//             throw error;
//         }
//     },

//     findByProductoId: async (producto_id) => {
//         const query = 'SELECT * FROM tLotes WHERE producto_id = $1 AND cantidad_disponible > 0 ORDER BY fecha_caducidad ASC;';
//         try {
//             const result = await pool.query(query, [producto_id]);
//             return result.rows;
//         } catch (error) {
//             console.error(`Error al buscar lotes para el producto ID ${producto_id}:`, error);
//             throw error;
//         }
//     },

//     updateInventory: async (lote_id, cantidad_vendida) => {
//         const query = `
//             UPDATE tLotes SET
//             cantidad_disponible = cantidad_disponible - $1
//             WHERE id = $2 AND cantidad_disponible >= $1 
//             RETURNING id, cantidad_disponible;
//         `;
//         const values = [cantidad_vendida, lote_id];

//         try {
//             const result = await pool.query(query, values);
//             return result.rows[0]; 
//         } catch (error) {
//             console.error(`Error al actualizar inventario del lote ID ${lote_id}:`, error);
//             throw error;
//         }
//     },

//     remove: async (id) => {
//         const query = 'DELETE FROM tLotes WHERE id = $1 RETURNING *;';
//         try {
//             const result = await pool.query(query, [id]);
//             return result.rows[0]; 
//         } catch (error) {
//             console.error(`Error al eliminar lote con ID ${id}:`, error);
//             throw error;
//         }
//     },


//     getDetalleProductoYLote: async (producto_id) => {
//         const query = `
//         SELECT 
//             p.id AS producto_id,
//             p.nombre AS producto_nombre,
//             p.descripcion,
//             p.precio_venta,
//             p.unidad_medida,
//             c.nombre AS categoria_nombre,  
//             l.id AS lote_id,
//             l.num_lote,
//             l.cantidad_inicial,
//             l.cantidad_disponible,
//             l.fecha_caducidad,
//             l.fecha_ingreso,
//             pr.nombre AS proveedor_nombre
//         FROM tProductos p
//         JOIN tLotes l ON p.id = l.producto_id
//         LEFT JOIN tCategoriaProductos c ON p.categoria_id = c.id
//         LEFT JOIN tProveedores pr ON l.proveedor_id = pr.id
//         WHERE p.id = $1;
//         `;

//         try {
//         const result = await pool.query(query, [producto_id]);
//         return result.rows;
//         } catch (error) {
//         console.error('Error en getDetalleProductoYLote (modelo):', error);
//         throw error;
//         }
//     },

// };

// module.exports = LoteProductoModel;



const { pool } = require('../db/config');

const LoteProductoModel = {
    create: async ({
        producto_id,
        num_lote,
        cantidad_inicial,
        cantidad_disponible,
        fecha_caducidad,
        fecha_ingreso,
        proveedor_id
    }) => {
        const query = `
      INSERT INTO tlotes (
        producto_id, 
        num_lote, 
        cantidad_inicial, 
        cantidad_disponible, 
        fecha_caducidad, 
        fecha_ingreso, 
        proveedor_id
      )
      VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE), $7)
      RETURNING *;
    `;

        const values = [
            producto_id,
            num_lote,
            cantidad_inicial,
            cantidad_disponible ?? cantidad_inicial, 
            fecha_caducidad,
            fecha_ingreso,
            proveedor_id
        ];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("Error al registrar el lote:", error);
            if (error.code === '23503') {
                throw new Error("Violación de clave foránea: El producto_id no existe en la tabla tProductos.");
            }
            throw error;
        }
    },

    findAll: async () => {
        const query = 'SELECT * FROM tLotes ORDER BY fecha_caducidad ASC;';
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error al obtener todos los lotes:", error);
            throw error;
        }
    },

    findByProductoId: async (producto_id) => {
        const query = 'SELECT * FROM tLotes WHERE producto_id = $1 AND cantidad_disponible > 0 ORDER BY fecha_caducidad ASC;';
        try {
            const result = await pool.query(query, [producto_id]);
            return result.rows;
        } catch (error) {
            console.error(`Error al buscar lotes para el producto ID ${producto_id}:`, error);
            throw error;
        }
    },

    updateInventory: async (lote_id, cantidad_vendida) => {
        const query = `
            UPDATE tLotes SET
            cantidad_disponible = cantidad_disponible - $1
            WHERE id = $2 AND cantidad_disponible >= $1 
            RETURNING id, cantidad_disponible;
        `;
        const values = [cantidad_vendida, lote_id];

        try {
            const result = await pool.query(query, values);
            return result.rows[0]; 
        } catch (error) {
            console.error(`Error al actualizar inventario del lote ID ${lote_id}:`, error);
            throw error;
        }
    },

    remove: async (id) => {
        const query = 'DELETE FROM tLotes WHERE id = $1 RETURNING *;';
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0]; 
        } catch (error) {
            console.error(`Error al eliminar lote con ID ${id}:`, error);
            throw error;
        }
    },


    getDetalleProductoYLote: async (producto_id) => {
        const query = `
        SELECT 
            p.id AS producto_id,
            p.nombre AS producto_nombre,
            p.descripcion,
            p.precio_venta,
            p.unidad_medida,
            c.nombre AS categoria_nombre,  
            l.id AS lote_id,
            l.num_lote,
            l.cantidad_inicial,
            l.cantidad_disponible,
            l.fecha_caducidad,
            l.fecha_ingreso,
            pr.nombre AS proveedor_nombre
        FROM tProductos p
        JOIN tLotes l ON p.id = l.producto_id
        LEFT JOIN tCategoriaProductos c ON p.categoria_id = c.id
        LEFT JOIN tProveedores pr ON l.proveedor_id = pr.id
        WHERE p.id = $1;
        `;

        try {
        const result = await pool.query(query, [producto_id]);
        return result.rows;
        } catch (error) {
        console.error('Error en getDetalleProductoYLote (modelo):', error);
        throw error;
        }
    },

    // --- NUEVAS FUNCIONES PARA EL FACADE ---

    // Buscar el lote más viejo que tenga stock (FIFO)
    findOldestWithStock: async (productoId) => {
        const query = `
            SELECT * FROM tlotes 
            WHERE producto_id = $1 AND cantidad_disponible > 0 
            ORDER BY fecha_caducidad ASC 
            LIMIT 1;
        `;
        try {
            const { rows } = await pool.query(query, [productoId]);
            return rows[0]; // Retorna el lote más antiguo o undefined
        } catch (error) {
            console.error(`Error al buscar lote más antiguo para producto ID ${productoId}:`, error);
            throw error;
        }
    },

    // Restar cantidad al stock (específico para el facade)
    decreaseStock: async (loteId, cantidad) => {
        const query = `
            UPDATE tlotes 
            SET cantidad_disponible = cantidad_disponible - $1 
            WHERE id = $2
            RETURNING *;
        `;
        try {
            const { rows } = await pool.query(query, [cantidad, loteId]);
            return rows[0];
        } catch (error) {
            console.error(`Error al disminuir stock del lote ID ${loteId}:`, error);
            throw error;
        }
    }

};

module.exports = LoteProductoModel;
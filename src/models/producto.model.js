const { pool } = require('../db/config');

const ProductoModel = {
    create: async ({ nombre, descripcion, precio_venta, unidad_medida, categoria_id }) => {
        const query = `
            INSERT INTO tProductos (nombre, descripcion, precio_venta, unidad_medida, categoria_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [nombre, descripcion, precio_venta, unidad_medida, categoria_id ];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("Error al crear el producto:", error);
            throw error;
        }
    },

    findAll: async () => {
        const query = `
        SELECT 
            p.*, 
            c.nombre AS categoria
        FROM tProductos p
        LEFT JOIN tCategoriaProductos c ON p.categoria_id = c.id
        ORDER BY p.nombre ASC;
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    findById: async (id) => {
        const query = `
        SELECT 
            p.*, 
            c.nombre AS categoria
        FROM tProductos p
        LEFT JOIN tCategoriaProductos c ON p.categoria_id = c.id
        WHERE p.id = $1;
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    update: async (id, data) => {
        const fields = [];
        const values = [];
        let paramIndex = 1;

        for (const key in data) {
        fields.push(`${key} = $${paramIndex++}`);
        values.push(data[key]);
        }

        if (fields.length === 0) return null;

        values.push(id);
        const query = `
        UPDATE tProductos 
        SET ${fields.join(', ')} 
        WHERE id = $${paramIndex}
        RETURNING *;
        `;

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // D - DELETE
    remove: async (id) => {
        const query = 'DELETE FROM tProductos WHERE id = $1 RETURNING *;';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    obtenerProductosStockBajo: async (umbral = 10) => {
        const query = `
        SELECT
            p.id,
            p.nombre,
            -- CÁLCULO MÁS EFICIENTE: Suma de la cantidad disponible en la tabla tLotes
            COALESCE(
                (SELECT SUM(l.cantidad_disponible) 
                 FROM tLotes l 
                 WHERE l.producto_id = p.id), 0
            ) AS stock_actual,
            -- Usamos 10 como "stock mínimo"
            10 AS stock_minimo 
        FROM tProductos p
        GROUP BY p.id, p.nombre
        HAVING 
            -- FILTRO: Si el stock actual es igual o menor al umbral
            COALESCE(
                (SELECT SUM(l.cantidad_disponible) 
                 FROM tLotes l 
                 WHERE l.producto_id = p.id), 0
            ) <= $1 
        ORDER BY stock_actual ASC
        LIMIT 10;
        `;
        try {
            const result = await pool.query(query, [umbral]);
            return result.rows.map(row => ({
                ...row,
                stock_actual: parseInt(row.stock_actual, 10),
                stockMinimo: parseInt(row.stock_minimo, 10)
            }));
        } catch (error) {
            console.error("[MODELO PRODUCTO] Error al obtener productos con stock bajo:", error);
            throw error;
        }
    },


};

module.exports = ProductoModel;
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
    }
};

module.exports = ProductoModel;
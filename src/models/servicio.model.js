// const { pool } = require('../db/config');

// const getServices = async (solamenteActivos = false) => {
//     let query = 'SELECT * FROM tservicios_veterinaria';
//     if (solamenteActivos) {
//         query += ' WHERE activo = true';
//     }
//     query += ' ORDER BY id DESC';
//     const { rows } = await pool.query(query);
//     return rows;
// };

// const getServiceById = async (id) => {
//     const query = 'SELECT * FROM tservicios_veterinaria WHERE id = $1';
//     const { rows } = await pool.query(query, [id]);
//     return rows[0];
// };

// const createService = async (data) => {
//     const { titulo, descripcion, imagen_url, activo } = data;
//     // Asumimos precio como opcional o 0 por ahora si no lo envían
//     const precio = data.precio || 0; 
    
//     const query = `
//         INSERT INTO tservicios_veterinaria (titulo, descripcion, imagen_url, activo, precio)
//         VALUES ($1, $2, $3, $4, $5) RETURNING *`;
//     const values = [titulo, descripcion, imagen_url, activo, precio];
//     const { rows } = await pool.query(query, values);
//     return rows[0];
// };

// const updateService = async (id, data) => {
//     const { titulo, descripcion, activo, precio, imagen_url } = data;
//     const query = `
//         UPDATE tservicios_veterinaria 
//         SET titulo=$1, descripcion=$2, activo=$3, precio=$4, imagen_url=$5
//         WHERE id=$6 RETURNING *`;
//     const values = [titulo, descripcion, activo, precio || 0, imagen_url, id];
//     const { rows } = await pool.query(query, values);
//     return rows[0];
// };

// const deleteService = async (id) => {
//     const query = 'DELETE FROM tservicios_veterinaria WHERE id = $1 RETURNING *';
//     const { rows } = await pool.query(query, [id]);
//     return rows[0];
// };

// module.exports = { 
//     getServices, 
//     getServiceById, 
//     createService, 
//     updateService, 
//     deleteService 
// };

const { pool } = require('../db/config');

const getServices = async (solamenteActivos = false) => {
    let query = 'SELECT * FROM tservicios_veterinaria';
    
    // Si piden "solamenteActivos", filtramos. Si no (admin), mandamos todo.
    if (solamenteActivos) {
        query += ' WHERE activo = true';
    }
    
    // Ordenamos por ID descendente para ver los nuevos primero
    query += ' ORDER BY id DESC';
    
    const { rows } = await pool.query(query);
    return rows;
};

const getServiceById = async (id) => {
    const query = 'SELECT * FROM tservicios_veterinaria WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

const createService = async (data) => {
    const { titulo, descripcion, imagen_url, activo } = data;
    // Si no envían precio, guardamos 0 por defecto
    const precio = data.precio || 0; 
    
    const query = `
        INSERT INTO tservicios_veterinaria (titulo, descripcion, imagen_url, activo, precio)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [titulo, descripcion, imagen_url, activo, precio];
    
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const updateService = async (id, data) => {
    const { titulo, descripcion, activo, precio, imagen_url } = data;
    
    const query = `
        UPDATE tservicios_veterinaria 
        SET titulo=$1, descripcion=$2, activo=$3, precio=$4, imagen_url=$5
        WHERE id=$6 RETURNING *`;
        
    const values = [titulo, descripcion, activo, precio || 0, imagen_url, id];
    
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const deleteService = async (id) => {
    const query = 'DELETE FROM tservicios_veterinaria WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

module.exports = { 
    getServices, 
    getServiceById, 
    createService, 
    updateService, 
    deleteService 
};
// src/models/alerta.model.js
const { pool } = require('../db/config'); 

// Umbral de stock bajo (puedes ajustarlo o pasarlo como parámetro)
const STOCK_BAJO_UMBRAL = 10;
// Días antes de la caducidad para considerar como "a vencer"
const DIAS_A_VENCER_UMBRAL = 30;

// Consulta para productos con stock bajo
exports.getStockBajo = async () => {
    const query = `
        SELECT
            p.id AS producto_id,
            p.nombre AS nombre_producto,
            SUM(l.cantidad_disponible) AS stock_total
        FROM
            tproductos p
        JOIN
            tlotes l ON p.id = l.producto_id
        GROUP BY
            p.id, p.nombre
        HAVING
            SUM(l.cantidad_disponible) <= $1
            AND SUM(l.cantidad_disponible) > 0;
    `;
    const result = await pool.query(query, [STOCK_BAJO_UMBRAL]);
    return result.rows;
};

// Consulta para lotes con productos a vencer pronto
exports.getProductosAVencer = async () => {
    const query = `
        SELECT
            l.id AS lote_id,
            p.nombre AS nombre_producto,
            l.num_lote,
            l.cantidad_disponible,
            l.fecha_caducidad
        FROM
            tlotes l
        JOIN
            tproductos p ON l.producto_id = p.id
        WHERE
            l.fecha_caducidad <= NOW() + INTERVAL '${DIAS_A_VENCER_UMBRAL} days'
            AND l.fecha_caducidad >= NOW()
            AND l.cantidad_disponible > 0
        ORDER BY
            l.fecha_caducidad ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

// Nueva consulta para la gráfica: Productos más vendidos (basado en movimientos de "salida")
exports.getTopProductosVendidos = async (limit = 5) => {
    const query = `
        SELECT
            p.nombre AS producto,
            SUM(m.cantidad) AS total_vendido
        FROM
            tmovimientos m
        JOIN
            tproductos p ON m.producto_id = p.id
        WHERE
            m.tipo = 'salida'
        GROUP BY
            p.nombre
        ORDER BY
            total_vendido DESC
        LIMIT $1;
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
};

// Obtiene estadísticas de citas para el día actual
exports.getStatsCitasHoy = async () => {
    const query = `
        SELECT
            COUNT(*) AS total_citas_hoy,
            SUM(CASE WHEN estado = 'Confirmada' THEN 1 ELSE 0 END) AS citas_confirmadas
        FROM
            tcitas
        WHERE
            fecha_cita = CURRENT_DATE;
    `;
    // pool.query(...)[0] devuelve el primer objeto (la fila)
    const result = await pool.query(query);
    return result.rows[0]; 
};


/**
 * Obtiene el total de citas pendientes de confirmación (accionable)
 */
exports.getStatsCitasPorConfirmar = async () => {
    const query = `
        SELECT
            COUNT(*) AS total_por_confirmar
        FROM
            tcitas
        WHERE
            estado = 'Por Confirmar';
    `;
    const result = await pool.query(query);
    return result.rows[0];
};

/**
 * Obtiene el total de citas para los próximos 7 días (planificación)
 */
exports.getStatsCitasProximaSemana = async () => {
    const query = `
        SELECT
            COUNT(*) AS total_proxima_semana
        FROM
            tcitas
        WHERE
            fecha_cita BETWEEN (CURRENT_DATE + 1) AND (CURRENT_DATE + 7)
            AND estado IN ('Confirmada', 'Pendiente', 'Por Confirmar');
    `;
    const result = await pool.query(query);
    return result.rows[0];
};

/**
 * Obtiene el total de nuevos clientes registrados este mes (crecimiento)
 */
exports.getStatsNuevosClientesMes = async () => {
    const query = `
        SELECT
            COUNT(*) AS total_nuevos_clientes
        FROM
            tclientes
        WHERE
            created_at >= date_trunc('month', CURRENT_DATE);
    `;
    const result = await pool.query(query);
    return result.rows[0];
};



const { pool } = require('../db/config');
const responseHandler = require('../utils/responseHandler');

const LoteController = {
  createLote: async (req, res) => {
    const {
      producto_id,
      num_lote,
      cantidad_inicial,
      cantidad_disponible,
      fecha_caducidad,
      proveedor_id
    } = req.body;

    const usuario_id = req.user?.id; 

    if (!usuario_id) {
      return responseHandler.error(res, 'Usuario no autenticado.', 401);
    }

    if (!producto_id || !num_lote || !cantidad_inicial || !fecha_caducidad || !proveedor_id) {
      return responseHandler.error(res, 'Faltan campos obligatorios', 400);
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertLoteQuery = `
        INSERT INTO tLotes (producto_id, num_lote, cantidad_inicial, cantidad_disponible, fecha_caducidad, proveedor_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const values = [
        producto_id,
        num_lote,
        cantidad_inicial,
        cantidad_disponible || cantidad_inicial,
        fecha_caducidad,
        proveedor_id
      ];

      const loteResult = await client.query(insertLoteQuery, values);
      const nuevoLote = loteResult.rows[0];

      const insertMovimientoQuery = `
        INSERT INTO tMovimientos (tipo, producto_id, lote_id, cantidad, motivo, usuario_id)
        VALUES ('entrada', $1, $2, $3, 'Ingreso de nuevo lote', $4)
      `;
      await client.query(insertMovimientoQuery, [
        producto_id,
        nuevoLote.id,
        cantidad_inicial,
        usuario_id
      ]);

      await client.query('COMMIT');
      console.log(`movimiento creado por: ${req.user.correo} (${req.user.rol})`);

      return responseHandler.success(res, nuevoLote, 'Lote creado y movimiento registrado.', 201);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al crear lote:', error);
      return responseHandler.error(res, 'Error interno al registrar lote.');
    } finally {
      client.release();
    }
  },

  getAllLotes: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT l.*, p.nombre AS producto_nombre, pr.nombre AS proveedor_nombre
        FROM tLotes l
        JOIN tProductos p ON l.producto_id = p.id
        JOIN tProveedores pr ON l.proveedor_id = pr.id
        ORDER BY l.fecha_ingreso DESC;
      `);
      return responseHandler.success(res, result.rows, `Se encontraron ${result.rowCount} lotes.`);
    } catch (error) {
      console.error('Error al obtener lotes:', error);
      return responseHandler.error(res, 'Error interno al obtener lotes.');
    }
  },

  updateLote: async (req, res) => {
    const { id } = req.params;
    const {
      num_lote,
      cantidad_inicial,
      cantidad_disponible,
      fecha_caducidad,
      proveedor_id
    } = req.body;

    const usuario_id = req.user?.id;

    if (!usuario_id) {
      return responseHandler.error(res, 'Usuario no autenticado.', 401);
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const updateQuery = `
        UPDATE tLotes
        SET
          num_lote = COALESCE($1, num_lote),
          cantidad_inicial = COALESCE($2, cantidad_inicial),
          cantidad_disponible = COALESCE($3, cantidad_disponible),
          fecha_caducidad = COALESCE($4, fecha_caducidad),
          proveedor_id = COALESCE($5, proveedor_id)
        WHERE id = $6
        RETURNING *;
      `;

      const values = [
        num_lote,
        cantidad_inicial,
        cantidad_disponible,
        fecha_caducidad,
        proveedor_id,
        id
      ];

      const result = await client.query(updateQuery, values);
      const loteActualizado = result.rows[0];

      if (!loteActualizado) {
        await client.query('ROLLBACK');
        return responseHandler.error(res, 'Lote no encontrado.', 404);
      }

      const movimientoQuery = `
        INSERT INTO tMovimientos (tipo, producto_id, lote_id, cantidad, motivo, usuario_id)
        VALUES ('ajuste', $1, $2, $3, 'Actualización de lote', $4);
      `;
      await client.query(movimientoQuery, [
        loteActualizado.producto_id,
        loteActualizado.id,
        cantidad_disponible || 0,
        usuario_id
      ]);

      await client.query('COMMIT');

      console.log(`lote actualizado parcialmente por: ${req.user.correo} (${req.user.rol})`);

      return responseHandler.success(res, loteActualizado, 'Lote actualizado correctamente.');

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al actualizar lote:', error);
      return responseHandler.error(res, 'Error interno al actualizar lote.');
    } finally {
      client.release();
    }
  },

  deleteLote: async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user?.id;

    if (!usuario_id) {
      return responseHandler.error(res, 'Usuario no autenticado.', 401);
    }

    const client = await pool.connect();
    try {
      const loteResult = await client.query(
        'SELECT id, num_lote, cantidad_disponible FROM tLotes WHERE id = $1',
        [id]
      );

      if (loteResult.rowCount === 0) {
        return responseHandler.error(res, 'Lote no encontrado.', 404);
      }

      const lote = loteResult.rows[0];

      if (lote.cantidad_disponible > 0) {
        return responseHandler.error(
          res,
          `El lote "${lote.num_lote}" aún tiene ${lote.cantidad_disponible} unidades disponibles y no puede eliminarse.`,
          400
        );
      }

      const deleteResult = await client.query(
        'DELETE FROM tLotes WHERE id = $1 RETURNING *',
        [id]
      );

      return responseHandler.success(
        res,
        deleteResult.rows[0],
        `Lote "${lote.num_lote}" eliminado correctamente.`
      );
    } catch (error) {
      console.error('Error al eliminar lote:', error);
      return responseHandler.error(res, 'Error interno al eliminar lote.');
    } finally {
      client.release();
    }
  },


};

module.exports = LoteController;

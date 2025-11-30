const VacunaModel = require('../models/vacuna.model');
const TratamientoModel = require('../models/tratamiento.model');
const LoteModel = require('../models/loteProducto.model'); // Asegurate que coincida con tu nombre de archivo
const MovimientoModel = require('../models/movimiento.model');

class ConsultaFacade {

    // Método privado para manejar la lógica de inventario
    async _descontarDeInventario(productoId, cantidad, motivo, usuarioId) {
        if (!productoId) return; 

        // 1. Buscar lote disponible (FIFO)
        const lote = await LoteModel.findOldestWithStock(productoId);

        if (lote) {
            // 2. Registrar movimiento de salida
            await MovimientoModel.create({
                tipo: 'salida',
                producto_id: productoId,
                lote_id: lote.id,
                cantidad: cantidad,
                motivo: motivo,
                usuario_id: usuarioId || 1 
            });

            // 3. Actualizar stock real (Usando la función que agregamos a loteProducto.model.js)
            await LoteModel.decreaseStock(lote.id, cantidad);
            console.log(`[FACADE] Inventario descontado: Producto ${productoId}, Lote ${lote.num_lote}, Cantidad ${cantidad}`);
        } else {
            console.warn(`[FACADE] ALERTA: No hay stock disponible para el producto ID ${productoId}`);
        }
    }

    // --- MÉTODOS PÚBLICOS ---

    async registrarVacuna(data, usuarioId) {
        // 1. Guardar registro médico (Llama al modelo de Vacuna actualizado)
        const nuevaVacuna = await VacunaModel.create(data);

        // 2. Descontar del inventario (Automático)
        await this._descontarDeInventario(
            data.producto_id, 
            1, 
            `Aplicación de vacuna en Consulta #${data.consulta_id}`,
            usuarioId
        );

        return nuevaVacuna;
    }

    async registrarTratamiento(data, usuarioId) {
        // 1. Guardar registro médico (Llama al modelo de Tratamiento actualizado)
        const nuevoTratamiento = await TratamientoModel.create(data);

        // 2. Descontar del inventario (Automático)
        const cantidad = data.cantidad_inventario || 1; 

        await this._descontarDeInventario(
            data.producto_id, 
            cantidad, 
            `Aplicación de tratamiento en Consulta #${data.consulta_id}`,
            usuarioId
        );

        return nuevoTratamiento;
    }
}

module.exports = new ConsultaFacade();
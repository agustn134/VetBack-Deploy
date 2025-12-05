const generarCitasMensuales = (citasRaw) => {
    const dataMap = citasRaw.reduce((acc, cita) => {
        const date = new Date(cita.fecha_cita);
        const mesKey = date.toISOString().substring(0, 7); 
        const estado = cita.estado;
        
        let tipoConteo = null;
        if (estado === 'Completada') {
            tipoConteo = 'Atendidas';
        } else if (estado === 'Cancelada') {
            tipoConteo = 'Canceladas';
        }

        if (tipoConteo) {
            if (!acc[mesKey]) acc[mesKey] = { mes: mesKey, Atendidas: 0, Canceladas: 0 };
            acc[mesKey][tipoConteo]++;
        }
        return acc;
    }, {});

    return Object.values(dataMap).sort((a, b) => a.mes.localeCompare(b.mes));
};

const generarRankingClientes = (citasRaw) => {
    const citasCompletadas = citasRaw.filter(c => c.estado === 'Completada');

    const conteoClientes = citasCompletadas.reduce((acc, cita) => {
        const clienteId = cita.cliente_id;
        if (clienteId) {
            if (!acc[clienteId]) {
                acc[clienteId] = {
                    cliente_id: clienteId,
                    nombre: cita.cliente_nombre, 
                    citas: 0 
                };
            }
            acc[clienteId].citas++;
        }
        return acc;
    }, {});

    return Object.values(conteoClientes)
        .sort((a, b) => b.citas - a.citas)
        .slice(0, 10);
};

const generarTopVentas = (movimientosRaw) => {
    const ventas = movimientosRaw.filter(m => m.tipo === 'salida');

    const conteoProductos = ventas.reduce((acc, movimiento) => {
        const productoId = movimiento.producto_id;
        const cantidad = movimiento.cantidad;

        if (productoId) {
            if (!acc[productoId]) {
                acc[productoId] = {
                    producto_id: productoId,
                    nombre: movimiento.producto_nombre,
                    cantidad_total: 0
                };
            }
            acc[productoId].cantidad_total += cantidad;
        }
        return acc;
    }, {});

    return Object.values(conteoProductos)
        .sort((a, b) => b.cantidad_total - a.cantidad_total)
        .slice(0, 5);
};

const generarRankingVeterinarios = (citasRaw) => {
    const citasCompletadas = citasRaw.filter(c => c.estado === 'Completada');

    const conteoVets = citasCompletadas.reduce((acc, cita) => {
        const vetId = cita.veterinario_id;
        if (vetId) {
            if (!acc[vetId]) {
                acc[vetId] = {
                    veterinario_id: vetId,
                    nombre: cita.veterinario_nombre, 
                    citas: 0 
                };
            }
            acc[vetId].citas++;
        }
        return acc;
    }, {});

    return Object.values(conteoVets)
        .sort((a, b) => b.citas - a.citas)
        .slice(0, 4); 
};


const generarTopAnimales = (citasRaw) => {
    const conteoAnimales = citasRaw.reduce((acc, cita) => {
        const animalId = cita.animal_id;
        const animalNombre = cita.animal_nombre || `ID: ${animalId}`; 
        
        if (animalId) {
            if (!acc[animalId]) {
                acc[animalId] = {
                    animal_id: animalId,
                    nombre: animalNombre,
                    citas: 0 
                };
            }
            acc[animalId].citas++;
        }
        return acc;
    }, {});

    return Object.values(conteoAnimales)
        .sort((a, b) => b.citas - a.citas)
        .slice(0, 5); 
};

const generarAlertasStock = (stockBajoRaw) => {
    return stockBajoRaw.slice(0, 10).map(item => ({
        nombre: item.nombre,
        stock: item.stock_actual,
        stockMinimo: item.stock_minimo 
    }));
};


const generarTopServicios = (serviciosRaw) => {
    return serviciosRaw
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); 
};


module.exports = {
    generarCitasMensuales,
    generarRankingClientes,
    generarTopVentas,
    generarRankingVeterinarios,
    generarTopAnimales, 
    generarAlertasStock,
    generarTopServicios
};
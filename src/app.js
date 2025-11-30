const express = require('express');
const app = express();
const cors = require('cors'); 
const path = require('path');

const allowedOrigins = [
  'http://localhost:4200', // Para cuando pruebas en tu PC
  'https://elmorralitovet.web.app', // Tu frontend en Firebase
  'https://elmorralitovet.firebaseapp.com' // URL alternativa de Firebase
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por CORS'));
    }
  },
  credentials: true // Importante si usas cookies o headers de autorización
}));

// Middlewares
// app.use(express.json());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true })); 

app.use(cors({
  origin: '*'
}));

const productoRoutes = require('./routes/producto.routes');
const citaRoutes = require('./routes/cita.routes'); 
const clienteRoutes = require('./routes/cliente.routes');
const expedienteRoutes = require('./routes/expediente.routes');
const consultaRoutes = require('./routes/consulta.routes');
const reporteRoutes = require('./routes/pdf.routes');
const proveedorRoutes = require('./routes/proveedor.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const movimientoRoutes = require('./routes/movimiento.routes');
const lotesRoutes = require('./routes/lote.routes');
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const alertaRoutes = require('./routes/alerta.routes');
const pacienteRoutes = require('./routes/paciente.routes');
const diagnosticoRoutes = require('./routes/diagnostico.routes');
const vacunaRoutes = require('./routes/vacuna.routes');
const tratamientoRoutes = require('./routes/tratamiento.routes');
const procedimientoRoutes = require('./routes/procedimiento.routes');
const imagenRoutes = require('./routes/imagen.routes');
const cambiosRoutes = require('./routes/cambios.routes');

const servicioRoutes = require('./routes/servicio.routes');


// Conexión a las rutas
app.use('/api/productos', productoRoutes); 
app.use('/api/citas', citaRoutes); 
app.use('/api/clientes', clienteRoutes);
app.use('/api/expedientes', expedienteRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/reportes', express.static(path.join(__dirname, 'reportes')));
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/lotes', lotesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/diagnosticos', diagnosticoRoutes);
app.use('/api/vacunas', vacunaRoutes);
app.use('/api/tratamientos', tratamientoRoutes);
app.use('/api/procedimientos', procedimientoRoutes);
app.use('/api/imagenes', imagenRoutes);
app.use('/api/cambios', cambiosRoutes);

app.use('/api/servicios', servicioRoutes);

app.use('/api/expedientes-test', require('./routes/expediente.routes'));





module.exports = app;



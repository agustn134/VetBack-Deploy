-- ============================================
-- BASE DE DATOS VETERINARIA 
-- ============================================

-- Eliminar tablas si existen (en orden inverso por dependencias)
DROP TABLE IF EXISTS tCitas CASCADE;
DROP TABLE IF EXISTS tPacientes CASCADE;
DROP TABLE IF EXISTS tAnimales CASCADE;
DROP TABLE IF EXISTS tCategorias CASCADE;
DROP TABLE IF EXISTS tClientes CASCADE;
DROP TABLE IF EXISTS tUsuarios CASCADE;

-- ============================================
-- TABLA USUARIOS (Veterinarios, Recepcionistas, Admin)
-- ============================================
CREATE TABLE tUsuarios (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('Veterinario', 'Recepcionista', 'Admin')),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA CLIENTES
-- ============================================
CREATE TABLE tClientes (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA CATEGORIAS (Mamíferos, Aves, Reptiles, etc.)
-- ============================================
CREATE TABLE tCategorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- ============================================
-- TABLA ANIMALES (Tipos de animales)
-- ============================================
CREATE TABLE tAnimales (
    id_tipoanimal SERIAL PRIMARY KEY,
    categoria_id INTEGER NOT NULL REFERENCES tCategorias(id_categoria),
    nombre VARCHAR(100) NOT NULL
);

-- ============================================
-- TABLA PACIENTES (Mascotas de los clientes)
-- ============================================
CREATE TABLE tPacientes (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES tClientes(id),
    nombre VARCHAR(100) NOT NULL,
    animal_id INTEGER NOT NULL REFERENCES tAnimales(id_tipoanimal),
    raza VARCHAR(50),
    edad INTEGER,
    peso NUMERIC(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA CITAS
-- ============================================
CREATE TABLE tCitas (
    id_cita SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES tClientes(id),
    mascota_id INTEGER REFERENCES tPacientes(id), -- NULL si es mascota nueva
    veterinario_id INTEGER NOT NULL REFERENCES tUsuarios(id),
    animal_id INTEGER NOT NULL REFERENCES tAnimales(id_tipoanimal), -- Tipo de animal para la cita
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    motivo TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Confirmada', 'Cancelada', 'Completada', 'Reprogramada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_veterinario_fecha_hora UNIQUE (veterinario_id, fecha_cita, hora_cita)
);

-- ============================================
-- DATOS DE PRUEBA - CATEGORÍAS
-- ============================================
INSERT INTO tCategorias (nombre) VALUES
('Mamífero'),
('Ave'),
('Reptil'),
('Pez');

-- ============================================
-- DATOS DE PRUEBA - ANIMALES
-- ============================================
-- Mamíferos (categoria_id: 1)
INSERT INTO tAnimales (categoria_id, nombre) VALUES
(1, 'Perro'),
(1, 'Gato'),
(1, 'Conejo'),
(1, 'Hámster');

-- Aves (categoria_id: 2)
INSERT INTO tAnimales (categoria_id, nombre) VALUES
(2, 'Loro'),
(2, 'Pichón'),
(2, 'Canario'),
(2, 'Perico');

-- Reptiles (categoria_id: 3)
INSERT INTO tAnimales (categoria_id, nombre) VALUES
(3, 'Iguana'),
(3, 'Tortuga'),
(3, 'Gecko'),
(3, 'Serpiente');

-- Peces (categoria_id: 4)
INSERT INTO tAnimales (categoria_id, nombre) VALUES
(4, 'Pez dorado'),
(4, 'Betta'),
(4, 'Guppy'),
(4, 'Tetra');

-- ============================================
-- DATOS DE PRUEBA - USUARIOS
-- ============================================
INSERT INTO tUsuarios (nombre_completo, correo, telefono, rol, password_hash) VALUES
('Dr. Juan Pérez', 'juan.perez@vet.com', '555-1234', 'Veterinario', 'hash_seguro_123'),
('Dra. María García', 'maria.garcia@vet.com', '555-5678', 'Veterinario', 'hash_seguro_456'),
('Ana López', 'ana.lopez@vet.com', '555-9012', 'Recepcionista', 'hash_seguro_789'),
('Admin Principal', 'admin@vet.com', '555-0000', 'Admin', 'hash_seguro_admin');

-- ============================================
-- DATOS DE PRUEBA - CLIENTES
-- ============================================
INSERT INTO tClientes (nombre_completo, correo, telefono, direccion) VALUES
('Carlos Rodríguez', 'carlos@email.com', '555-1111', 'Av. Principal 123'),
('Laura Méndez', 'laura@email.com', '555-2222', 'Calle Secundaria 456'),
('Pedro Sánchez', 'pedro@email.com', '555-3333', 'Plaza Central 789');

-- ============================================
-- CONSULTA PARA VERIFICAR LA ESTRUCTURA
-- ============================================
SELECT 
    c.nombre AS Categoria,
    a.nombre AS Animal
FROM tAnimales a
JOIN tCategorias c ON a.categoria_id = c.id_categoria
ORDER BY c.nombre, a.nombre;

-- ============================================
-- RQF02: GESTIÓN DE EXPEDIENTES MÉDICOS
-- Schema completo para PostgreSQL
-- ============================================

-- ============================================
-- TABLA: tExpedientes
-- Un expediente único por mascota
-- ============================================
CREATE TABLE tExpedientes (
    id_expediente SERIAL PRIMARY KEY,
    mascota_id INTEGER NOT NULL REFERENCES tPacientes(id) ON DELETE CASCADE,
    numero_expediente VARCHAR(20) UNIQUE NOT NULL, -- Formato: EXP-2025-00001
    fecha_apertura DATE NOT NULL DEFAULT CURRENT_DATE,
    estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
    observaciones_generales TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- RQF02 VALIDACIÓN: Cada mascota tiene un expediente único
    CONSTRAINT unique_mascota_expediente UNIQUE (mascota_id)
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_expedientes_mascota ON tExpedientes(mascota_id);
CREATE INDEX idx_expedientes_numero ON tExpedientes(numero_expediente);

-- ============================================
-- TABLA: tConsultas
-- Registro de cada consulta médica realizada
-- ============================================
CREATE TABLE tConsultas (
    id_consulta SERIAL PRIMARY KEY,
    expediente_id INTEGER NOT NULL REFERENCES tExpedientes(id_expediente) ON DELETE CASCADE,
    cita_id INTEGER NOT NULL REFERENCES tCitas(id_cita) ON DELETE RESTRICT,
    veterinario_id INTEGER NOT NULL REFERENCES tUsuarios(id) ON DELETE RESTRICT,
    fecha_consulta DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Signos vitales
    peso_actual NUMERIC(5,2), -- en kg
    temperatura NUMERIC(4,2), -- en °C
    frecuencia_cardiaca INTEGER, -- latidos por minuto
    frecuencia_respiratoria INTEGER, -- respiraciones por minuto
    
    -- Observaciones generales de la consulta
    motivo_consulta TEXT NOT NULL,
    sintomas TEXT,
    observaciones TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- RQF02 VALIDACIÓN: Una cita solo puede tener una consulta
    CONSTRAINT unique_cita_consulta UNIQUE (cita_id)
);

-- Índices
CREATE INDEX idx_consultas_expediente ON tConsultas(expediente_id);
CREATE INDEX idx_consultas_cita ON tConsultas(cita_id);
CREATE INDEX idx_consultas_veterinario ON tConsultas(veterinario_id);
CREATE INDEX idx_consultas_fecha ON tConsultas(fecha_consulta);

-- ============================================
-- TABLA: tDiagnosticos
-- Diagnósticos realizados en cada consulta
-- ============================================
CREATE TABLE tDiagnosticos (
    id_diagnostico SERIAL PRIMARY KEY,
    consulta_id INTEGER NOT NULL REFERENCES tConsultas(id_consulta) ON DELETE CASCADE,
    descripcion TEXT NOT NULL,
    tipo VARCHAR(20) DEFAULT 'Primario' CHECK (tipo IN ('Primario', 'Secundario', 'Provisional', 'Definitivo')),
    codigo_cie VARCHAR(10), -- Código de clasificación internacional (opcional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_diagnosticos_consulta ON tDiagnosticos(consulta_id);
CREATE INDEX idx_diagnosticos_descripcion ON tDiagnosticos(descripcion);

-- ============================================
-- TABLA: tTratamientos
-- Tratamientos y medicamentos prescritos
-- ============================================
CREATE TABLE tTratamientos (
    id_tratamiento SERIAL PRIMARY KEY,
    consulta_id INTEGER NOT NULL REFERENCES tConsultas(id_consulta) ON DELETE CASCADE,
    medicamento VARCHAR(200) NOT NULL,
    principio_activo VARCHAR(200),
    dosis VARCHAR(100) NOT NULL, -- Ej: "10mg", "1 tableta"
    frecuencia VARCHAR(100) NOT NULL, -- Ej: "Cada 8 horas", "3 veces al día"
    duracion_dias INTEGER, -- Duración del tratamiento en días
    via_administracion VARCHAR(50), -- Oral, Intravenosa, Tópica, etc.
    indicaciones TEXT,
    fecha_inicio DATE DEFAULT CURRENT_DATE,
    fecha_fin DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tratamientos_consulta ON tTratamientos(consulta_id);
CREATE INDEX idx_tratamientos_medicamento ON tTratamientos(medicamento);

-- ============================================
-- TABLA: tVacunas
-- Registro de vacunación
-- ============================================
CREATE TABLE tVacunas (
    id_vacuna SERIAL PRIMARY KEY,
    consulta_id INTEGER NOT NULL REFERENCES tConsultas(id_consulta) ON DELETE CASCADE,
    nombre_vacuna VARCHAR(200) NOT NULL,
    laboratorio VARCHAR(100),
    lote VARCHAR(50),
    fecha_aplicacion DATE NOT NULL DEFAULT CURRENT_DATE,
    proxima_dosis DATE, -- Fecha de refuerzo (si aplica)
    veterinario_aplica INTEGER REFERENCES tUsuarios(id),
    via_administracion VARCHAR(50), -- Subcutánea, Intramuscular, etc.
    sitio_aplicacion VARCHAR(100), -- Parte del cuerpo donde se aplicó
    reacciones_adversas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vacunas_consulta ON tVacunas(consulta_id);
CREATE INDEX idx_vacunas_fecha ON tVacunas(fecha_aplicacion);
CREATE INDEX idx_vacunas_proxima ON tVacunas(proxima_dosis);

-- ============================================
-- TABLA: tProcedimientos
-- Procedimientos médicos y quirúrgicos
-- ============================================
CREATE TABLE tProcedimientos (
    id_procedimiento SERIAL PRIMARY KEY,
    consulta_id INTEGER NOT NULL REFERENCES tConsultas(id_consulta) ON DELETE CASCADE,
    tipo_procedimiento VARCHAR(100) NOT NULL, -- Cirugía, Esterilización, Limpieza Dental, etc.
    nombre_procedimiento VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_realizacion DATE NOT NULL DEFAULT CURRENT_DATE,
    hora_inicio TIME,
    duracion_minutos INTEGER,
    anestesia_utilizada VARCHAR(200),
    complicaciones TEXT,
    resultado VARCHAR(50), -- Exitoso, Complicaciones, etc.
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_procedimientos_consulta ON tProcedimientos(consulta_id);
CREATE INDEX idx_procedimientos_tipo ON tProcedimientos(tipo_procedimiento);
CREATE INDEX idx_procedimientos_fecha ON tProcedimientos(fecha_realizacion);

-- ============================================
-- TABLA: tImagenesExpediente
-- Almacenamiento de URLs de imágenes médicas
-- ============================================
CREATE TABLE tImagenesExpediente (
    id_imagen SERIAL PRIMARY KEY,
    consulta_id INTEGER NOT NULL REFERENCES tConsultas(id_consulta) ON DELETE CASCADE,
    url_imagen TEXT NOT NULL, -- URL o link a la imagen
    descripcion TEXT,
    tipo_imagen VARCHAR(50), -- Radiografía, Ecografía, Fotografía, Laboratorio, etc.
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subido_por INTEGER REFERENCES tUsuarios(id)
);

CREATE INDEX idx_imagenes_consulta ON tImagenesExpediente(consulta_id);
CREATE INDEX idx_imagenes_tipo ON tImagenesExpediente(tipo_imagen);

-- ============================================
-- TABLA: tHistorialCambios
-- RQF02: Auditoría de cambios en expedientes
-- ============================================
CREATE TABLE tHistorialCambios (
    id_cambio SERIAL PRIMARY KEY,
    expediente_id INTEGER NOT NULL REFERENCES tExpedientes(id_expediente) ON DELETE CASCADE,
    consulta_id INTEGER REFERENCES tConsultas(id_consulta) ON DELETE SET NULL,
    usuario_id INTEGER NOT NULL REFERENCES tUsuarios(id) ON DELETE RESTRICT,
    tipo_cambio VARCHAR(50) NOT NULL, -- Creación, Modificación, Consulta, Eliminación
    tabla_afectada VARCHAR(50), -- tConsultas, tDiagnosticos, tTratamientos, etc.
    descripcion_cambio TEXT NOT NULL,
    datos_anteriores JSONB, -- Datos antes del cambio (si aplica)
    datos_nuevos JSONB, -- Datos después del cambio
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) -- IPv4 o IPv6
);

CREATE INDEX idx_historial_expediente ON tHistorialCambios(expediente_id);
CREATE INDEX idx_historial_usuario ON tHistorialCambios(usuario_id);
CREATE INDEX idx_historial_fecha ON tHistorialCambios(fecha_cambio);

-- ============================================
-- FUNCIÓN: Generar número de expediente único
-- ============================================
CREATE OR REPLACE FUNCTION generar_numero_expediente()
RETURNS VARCHAR(20) AS $$
DECLARE
    anio VARCHAR(4);
    consecutivo INTEGER;
    numero_expediente VARCHAR(20);
BEGIN
    -- Obtener el año actual
    anio := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
    
    -- Obtener el último consecutivo del año actual
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(numero_expediente FROM 10) AS INTEGER)
    ), 0) + 1
    INTO consecutivo
    FROM tExpedientes
    WHERE numero_expediente LIKE 'EXP-' || anio || '-%';
    
    -- Formatear el número de expediente: EXP-2025-00001
    numero_expediente := 'EXP-' || anio || '-' || LPAD(consecutivo::VARCHAR, 5, '0');
    
    RETURN numero_expediente;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Auto-generar número de expediente
-- ============================================
CREATE OR REPLACE FUNCTION trigger_generar_numero_expediente()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_expediente IS NULL OR NEW.numero_expediente = '' THEN
        NEW.numero_expediente := generar_numero_expediente();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_numero_expediente
BEFORE INSERT ON tExpedientes
FOR EACH ROW
EXECUTE FUNCTION trigger_generar_numero_expediente();

-- ============================================
-- TRIGGER: Actualizar fecha de modificación
-- ============================================
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expedientes_updated_at
BEFORE UPDATE ON tExpedientes
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER consultas_updated_at
BEFORE UPDATE ON tConsultas
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

-- Insertar expedientes de prueba (para las mascotas existentes de los clientes de prueba)
-- Nota: Esto asume que ya tienes mascotas en tPacientes

-- Ejemplo: Expediente para una mascota existente
-- INSERT INTO tExpedientes (mascota_id, observaciones_generales)
-- VALUES (1, 'Paciente en buen estado general. Requiere seguimiento de vacunación.');

-- ============================================
-- VISTAS ÚTILES PARA CONSULTAS RÁPIDAS
-- ============================================

-- Vista: Expedientes con información completa de la mascota
CREATE VIEW vw_expedientes_completos AS
SELECT 
    e.id_expediente,
    e.numero_expediente,
    e.fecha_apertura,
    e.estado,
    p.id AS mascota_id,
    p.nombre AS mascota_nombre,
    a.nombre AS tipo_animal,
    p.raza,
    p.edad,
    p.peso AS peso_registrado,
    c.id AS cliente_id,
    c.nombre_completo AS propietario,
    c.correo AS propietario_correo,
    c.telefono AS propietario_telefono,
    (SELECT COUNT(*) FROM tConsultas WHERE expediente_id = e.id_expediente) AS total_consultas,
    (SELECT MAX(fecha_consulta) FROM tConsultas WHERE expediente_id = e.id_expediente) AS ultima_consulta
FROM tExpedientes e
JOIN tPacientes p ON e.mascota_id = p.id
JOIN tClientes c ON p.cliente_id = c.id
JOIN tAnimales a ON p.animal_id = a.id_tipoanimal;

-- Vista: Historial completo de consultas
CREATE VIEW vw_historial_consultas AS
SELECT 
    c.id_consulta,
    c.fecha_consulta,
    e.numero_expediente,
    p.nombre AS mascota_nombre,
    cl.nombre_completo AS propietario,
    u.nombre_completo AS veterinario,
    c.peso_actual,
    c.temperatura,
    c.motivo_consulta,
    ci.estado AS estado_cita,
    (SELECT STRING_AGG(descripcion, '; ') FROM tDiagnosticos WHERE consulta_id = c.id_consulta) AS diagnosticos,
    (SELECT COUNT(*) FROM tTratamientos WHERE consulta_id = c.id_consulta) AS cantidad_tratamientos,
    (SELECT COUNT(*) FROM tVacunas WHERE consulta_id = c.id_consulta) AS cantidad_vacunas
FROM tConsultas c
JOIN tExpedientes e ON c.expediente_id = e.id_expediente
JOIN tPacientes p ON e.mascota_id = p.id
JOIN tClientes cl ON p.cliente_id = cl.id
JOIN tUsuarios u ON c.veterinario_id = u.id
JOIN tCitas ci ON c.cita_id = ci.id_cita
ORDER BY c.fecha_consulta DESC;

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================
COMMENT ON TABLE tExpedientes IS 'RQF02: Expedientes médicos únicos por mascota';
COMMENT ON TABLE tConsultas IS 'RQF02: Registro de cada consulta médica realizada';
COMMENT ON TABLE tDiagnosticos IS 'RQF02: Diagnósticos médicos por consulta';
COMMENT ON TABLE tTratamientos IS 'RQF02: Tratamientos y medicamentos prescritos';
COMMENT ON TABLE tVacunas IS 'RQF02: Historial de vacunación';
COMMENT ON TABLE tProcedimientos IS 'RQF02: Procedimientos médicos y quirúrgicos';
COMMENT ON TABLE tImagenesExpediente IS 'RQF02: Imágenes médicas (URLs)';
COMMENT ON TABLE tHistorialCambios IS 'RQF02: Auditoría de cambios en expedientes';

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
-- Ejecuta esto para verificar que todas las tablas se crearon correctamente:
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) AS columnas
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN (
    'texpedientes', 'tconsultas', 'tdiagnosticos', 
    'ttratamientos', 'tvacunas', 'tprocedimientos', 
    'timagenesexpediente', 'thistorialcambios'
  )
ORDER BY table_name;
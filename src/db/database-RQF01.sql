



-- 5. TABLA CATEGORIAS (Catálogo - Para Animales)
CREATE TABLE tCategorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- 6. TABLA ANIMALES (Catálogo - Tipo de Animal)
CREATE TABLE tAnimales (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER NOT NULL REFERENCES tCategorias(id),
    nombre VARCHAR(100) NOT NULL
);

-- DDL FINAL de TCITAS (Con animal_id añadido)
CREATE TABLE tCitas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES tClientes(id),
    mascota_id INTEGER REFERENCES tPacientes(id), -- NULL si es mascota nueva
    veterinario_id INTEGER NOT NULL REFERENCES tUsuarios(id), 
    animal_id INTEGER NOT NULL REFERENCES tAnimales(id), -- Campo nuevo
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    motivo TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Confirmada', 'Cancelada', 'Completada', 'Reprogramada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_veterinario_fecha_hora UNIQUE (veterinario_id, fecha_cita, hora_cita)
);








CREATE TABLE tCitas (
    id SERIAL PRIMARY KEY,
    
    -- Claves foráneas (Entradas RQF01)
    cliente_id INTEGER NOT NULL REFERENCES tClientes(id), 
   SI VAA, PERO YO COMO RECEPCIONISTA PONGO ESTE COMO NULL Y YA LO REGISTRA EL DOC*(VANE)  mascota_id INTEGER NOT NULL REFERENCES tPacientes(id),  no se sabe 
    veterinario_id INTEGER NOT NULL REFERENCES tUsuarios(id), PUES EL QUE ESTE DISPONIBLE EN EL  DIA ASIGNADO POR EL CLIENTE
    
    -- Datos de la Cita
    fecha_cita DATE NOT NULL, EL QUE PIDIO ELCLIENTE,YO RECEPCIONISTA
    hora_cita TIME NOT NULL, EL QUE PIDIO ELCLIENTE,YO RECEPCIONISTA
    motivo TEXT NOT NULL, EL QUE PIDIO ELCLIENTE,YO RECEPCIONISTA
    -- Eliminamos telefono_contacto de aquí, se usará el de tClientes. CEL QUE PIDIO ELCLIENTE,YO RECEPCIONISTA

    -- Estado y Validación
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente',YO RECEPCIONISTA
        CHECK (estado IN ('Pendiente', 'Confirmada', 'Cancelada', 'Completada', 'Reprogramada')),
    
    -- VALIDACIÓN: No puede haber dos citas con el mismo veterinario, fecha y hora.
    CONSTRAINT unique_veterinario_fecha_hora UNIQUE (veterinario_id, fecha_cita, hora_cita)

 especie VARCHAR(50) NOT NULL, (BUENO EN LUGAR DE ESPECIE LLEAVARA UNA RELACION A ESTAS TABLAS:
 -- Tabla de Categorías
CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de Animales (Subcategorías)
CREATE TABLE animales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoria_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- ============================================
-- INSERTAR CATEGORÍAS
-- ============================================
INSERT INTO categorias (nombre) VALUES
('Mamífero'),
('Ave'),
('Reptil'),
('Pez');

-- ============================================
-- INSERTAR ANIMALES (SUBCATEGORÍAS)
-- ============================================

-- MAMÍFEROS (categoria_id: 1)
INSERT INTO animales (categoria_id, nombre) VALUES
(1, 'Perro'),
(1, 'Gato');

-- AVES (categoria_id: 2)
INSERT INTO animales (categoria_id, nombre) VALUES
(2, 'Loro'),
(2, 'Pichón');

-- REPTILES (categoria_id: 3)
INSERT INTO animales (categoria_id, nombre) VALUES
(3, 'Iguana'),
(3, 'Tortuga');

-- PECES (categoria_id: 4)
INSERT INTO animales (categoria_id, nombre) VALUES
(4, 'Pez dorado'),
(4, 'Betta');

-- ============================================
-- CONSULTA PARA VER TODO ORGANIZADO
-- ============================================
SELECT 
    c.nombre AS Categoria,
    a.nombre AS Animal
FROM animales a
JOIN categorias c ON a.categoria_id = c.id
ORDER BY c.nombre, a.nombre;
)

);


HACERLE UN ENdPOINT A VANE(PARA LOS VETERINARIOS) DE CITAS CONFIRMADAS Y YA QUE ELLA(OS) LO CONSUMA


QUE DESDE LA CITA INSERTE AL CLIENTE CON EL CORREO EL NUMERO Y LOS DATOPS  Y LO INSERTAS Y BUENO Y yaCUANDO UNO HACE SU SCITA CON REGISTROS ANTERIORES 
QUE SE SELECCIONE AL USUARIO YA PREVIO QUE SE REGISTRO ANTERIORES
Y SE LE VAN MOSTRAN SUS MASCOTASYA REGISTRADAS

PREGUNTARLE EN EL FRONT QUE YA HABIA VENIDO ANTERIORMENTE Y QUE DECIDA LLEVAR OTRA VEZ A FIRULAIS O SI VA A LLEVAR A OTRO posteriorPERRO 

AHORA 

VALIDAR EL CORREO, SI YA TENIA REGISTRADO A OTRAS MASCOTAS Y MENCIONARLE QUE YA TENIA MASCOTAS REGISTRADAS Y QUE 
MANE SE VA REGISTRAR EN UNA CITA 
VA A LA CITA DIRECTAMENTE
MANE ENTRA CON SUS DATOS PARA REGISTRAR A LA CITA
Y EN ESE MOMENTO SE VA REGISTRAR A MANE COMO CLIENTE 

SI MANE VUELVE A REGISTRAR UNA CITA 
YO VALIDO EN ESE MOMENTO SI YA HIZO UN REGISTRO ANTERIOR 
Y LE PREGUNTO SI TRAERA A UN PACIENTE NUEVO O VOLVERA A TRAER A MASCOTAS SUYAS A CONSULTA
COMO SI SE LE MOSTRARA UN CLIENTE
EL ID MASCOTA LO PUEDO MANDAR NULO
QUE NO ME CAMBIE EL ID DE 
SI ES NUEVA MASCOTA LO VA A GUARDAR NULO. DE LA MASCOTA

SI ES NUEVO CLIENTE POR PRIMERA VEZ, REVISAR EL CORREO SI YA EXISTE












-- 5. TABLA CATEGORIAS (Catálogo - Para Animales)
CREATE TABLE tCategorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- 6. TABLA ANIMALES (Catálogo - Tipo de Animal)
CREATE TABLE tAnimales (
    id_tipoanimal SERIAL PRIMARY KEY,
    categoria_id INTEGER NOT NULL REFERENCES tCategorias(id),
    nombre VARCHAR(100) NOT NULL
);

-- DDL FINAL de TCITAS (Con animal_id añadido)
CREATE TABLE tCitas (
    id_cita SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES tClientes(id),
    mascota_id INTEGER REFERENCES tPacientes(id), -- NULL si es mascota nueva
    veterinario_id INTEGER NOT NULL REFERENCES tUsuarios(id), 
    animal_id INTEGER NOT NULL REFERENCES tAnimales(id), 
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    motivo TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Confirmada', 'Cancelada', 'Completada', 'Reprogramada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_veterinario_fecha_hora UNIQUE (veterinario_id, fecha_cita, hora_cita)
);
















































-- 5. TABLA CATEGORIAS (Catálogo - Para Animales)
CREATE TABLE tCategorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- 6. TABLA ANIMALES (Catálogo - Tipo de Animal)
CREATE TABLE tAnimales (
    id_tipoanimal SERIAL PRIMARY KEY,
    -- CORREGIDO: Hace referencia a id_categoria
    categoria_id INTEGER NOT NULL REFERENCES tCategorias(id_categoria), 
    nombre VARCHAR(100) NOT NULL
);

-- DDL FINAL de TCITAS (Con animal_id añadido)
CREATE TABLE tCitas (
    id_cita SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES tClientes(id),
    mascota_id INTEGER REFERENCES tPacientes(id), 
    veterinario_id INTEGER NOT NULL REFERENCES tUsuarios(id), 
    -- CORREGIDO: Hace referencia a id_tipoanimal
    animal_id INTEGER NOT NULL REFERENCES tAnimales(id_tipoanimal), 
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    motivo TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Confirmada', 'Cancelada', 'Completada', 'Reprogramada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_veterinario_fecha_hora UNIQUE (veterinario_id, fecha_cita, hora_cita)
);








CREATE TABLE tCategorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE tAnimales (
    id_tipoanimal SERIAL PRIMARY KEY,
    categoria_id INTEGER NOT NULL REFERENCES tCategorias(id_categoria), 
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE tCitas (
    id_cita SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES tClientes(id),
    mascota_id INTEGER REFERENCES tPacientes(id), 
    veterinario_id INTEGER NOT NULL REFERENCES tUsuarios(id), 
    animal_id INTEGER NOT NULL REFERENCES tAnimales(id_tipoanimal), 
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    motivo TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Confirmada', 'Cancelada', 'Completada', 'Reprogramada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_veterinario_fecha_hora UNIQUE (veterinario_id, fecha_cita, hora_cita)
);
































<div class="container my-5">
  <div class="row justify-content-center">
    <div class="col-lg-8">

      <!-- Título principal del módulo (RQF01) -->
      <div class="card shadow-lg border-0 rounded-3">
        <div class="card-header bg-success text-white">
          <h2 class="h4 mb-0 text-center">Registro de Nueva Cita Médica</h2>
        </div>
        <div class="card-body">
          <p class="text-muted text-center mb-4">Módulo para Administrador/Recepcionista.</p>

          <!-- RQF01 - SALIDA ESPERADA: Mensaje de confirmación/error -->
          <div *ngIf="mensaje" class="alert d-flex align-items-center mb-4"
               [ngClass]="{'alert-info': mensajeClase === 'info',
                           'alert-success': mensajeClase === 'success',
                           'alert-danger': mensajeClase === 'error'}"
               role="alert">
            <i class="bi bi-info-circle-fill me-2" *ngIf="mensajeClase === 'info'"></i>
            <i class="bi bi-check-circle-fill me-2" *ngIf="mensajeClase === 'success'"></i>
            <i class="bi bi-exclamation-triangle-fill me-2" *ngIf="mensajeClase === 'error'"></i>
            <div class="text-center w-100">{{ mensaje }}</div>
          </div>

          <!-- RQF01 - ENTRADA DE DATOS: Formulario de Cita -->
          <form #citaForm="ngForm" (ngSubmit)="registrarCita()">

            <!-- GRUPO DE CAMPOS: TIEMPO -->
            <fieldset class="mb-4 p-3 border rounded-3">
              <legend class="float-none w-auto px-2 fs-6 text-success">Fecha y Hora</legend>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="fecha" class="form-label">Fecha de Cita (DD/MM/AAAA)</label>
                  <!-- CORREGIDO: nuevaCita.fecha -> nuevaCita.fecha_cita -->
                  <input type="date" id="fecha" name="fecha" class="form-control" [(ngModel)]="nuevaCita.fecha_cita" required>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="hora" class="form-label">Hora de Cita (HH:MM)</label>
                  <!-- CORREGIDO: nuevaCita.hora -> nuevaCita.hora_cita -->
                  <input type="time" id="hora" name="hora" class="form-control" [(ngModel)]="nuevaCita.hora_cita" required>
                </div>
              </div>
            </fieldset>

            <!-- GRUPO DE CAMPOS: PACIENTE Y VETERINARIO -->
            <fieldset class="mb-4 p-3 border rounded-3">
              <legend class="float-none w-auto px-2 fs-6 text-success">Paciente y Personal</legend>

              <!-- Campo 1: Cliente (Selección) -->
              <div class="mb-3">
                <label for="cliente" class="form-label">Cliente (Propietario)</label>
                <!-- CORREGIDO: nuevaCita.clienteId -> nuevaCita.cliente_id -->
                <select id="cliente" name="cliente" class="form-select" [(ngModel)]="nuevaCita.cliente_id" required>
                  <option [ngValue]="0" disabled>Seleccione un Cliente</option>
                  <option *ngFor="let cliente of clientes" [ngValue]="cliente.id">
                    {{ cliente.nombre }}
                  </option>
                </select>
              </div>

              <!-- Campo 2: Mascota (Selección) -->
              <div class="mb-3">
                <label for="mascota" class="form-label">Mascota (Paciente)</label>
                <!-- CORREGIDO: nuevaCita.mascotaId -> nuevaCita.mascota_id -->
                <select id="mascota" name="mascota" class="form-select" [(ngModel)]="nuevaCita.mascota_id" required>
                  <option [ngValue]="0" disabled>Seleccione una Mascota</option>
                  <!-- CORREGIDO: nuevaCita.clienteId -> nuevaCita.cliente_id en el Pipe -->
                  <option *ngFor="let mascota of mascotas | filtroporCliente: nuevaCita.cliente_id" [ngValue]="mascota.id">
                    {{ mascota.nombre }}
                  </option>
                </select>
                <!-- CORREGIDO: nuevaCita.clienteId -> nuevaCita.cliente_id en el *ngIf -->
                <div *ngIf="nuevaCita.cliente_id === 0" class="form-text text-danger">
                    Seleccione un cliente para ver sus mascotas asociadas.
                </div>
              </div>

              <!-- Campo 3: Veterinario (Selección - RQF01 VALIDACIÓN) -->
              <div class="mb-3">
                <label for="veterinario" class="form-label">Veterinario Asignado</label>
                <!-- CORREGIDO: nuevaCita.veterinarioId -> nuevaCita.veterinario_id -->
                <select id="veterinario" name="veterinario" class="form-select" [(ngModel)]="nuevaCita.veterinario_id" required>
                  <option [ngValue]="0" disabled>Seleccione un Veterinario</option>
                  <option *ngFor="let vet of veterinarios" [ngValue]="vet.id">
                    {{ vet.nombre }}
                  </option>
                </select>
              </div>
            </fieldset>

            <!-- GRUPO DE CAMPOS: DETALLES DE LA CITA -->
            <fieldset class="mb-4 p-3 border rounded-3">
              <legend class="float-none w-auto px-2 fs-6 text-success">Detalles</legend>
              <!-- NOTA: Se eliminó el campo 'Teléfono de Contacto' de la interfaz del usuario, ya que el Backend lo obtiene de la tabla tClientes. -->

              <!-- Campo 4: Motivo de Consulta (Cadena) -->
              <div class="mb-3">
                <label for="motivo" class="form-label">Motivo de Consulta (RQF01)</label>
                <textarea id="motivo" name="motivo" class="form-control" [(ngModel)]="nuevaCita.motivo" rows="3" required></textarea>
              </div>
            </fieldset>

            <!-- Botón de Registro -->
            <button type="submit" [disabled]="!citaForm.valid" class="btn btn-success btn-lg w-100">
              Registrar Cita y Validar Horario
            </button>
            <small class="d-block text-center mt-2 text-muted">La validación de disponibilidad se realiza en el Backend (Node.js).</small>
          </form>

        </div>
      </div>
    </div>
  </div>
</div>



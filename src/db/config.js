// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',              
//   host: 'localhost',             
//   database: 'vet_db',            
//   password: process.env.DB_PASSWORD, 
//   port: 5432,                    
// });

// async function connectDB() {
//     try {
//         console.log('conexion exitosa con la bd');
//     } catch (error) {
//         console.error('erro de conexion:', error.message);
//         process.exit(1); 
//     }
// }

// module.exports = {
//     pool,
//     connectDB
// };



const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   host: 'db.lfxynmzglazwgepfnerg.supabase.co', // Tu nuevo host en la nube
//   database: 'postgres', // En Supabase la base principal se llama 'postgres'
//   password: process.env.DB_PASSWORD, // Asegúrate de que tu variable de entorno tenga la contraseña 'morralitodev'
//   port: 5432,
//   ssl: { rejectUnauthorized: false } // Requisito obligatorio para Supabase
//   ,connectionTimeoutMillis: 10000 // Dale tiempo para conectar
// });

const pool = new Pool({
  // Usuario: postgres.[tu-proyecto]
  user: 'postgres.lfxynmzglazwgepfnerg', 
  
  // Host del Pooler (Reemplaza si Supabase te da uno distinto en Settings -> Database)
  host: 'aws-0-us-east-1.pooler.supabase.com', 
  
  database: 'postgres',
  password: process.env.DB_PASSWORD,
  
  // Puerto del Pooler (Importante: 6543)
  port: 6543, 
  
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000
});

async function connectDB() {
    try {
        await pool.query('SELECT NOW()'); // Pequeña prueba de conexión
        console.log('✅ Conexión exitosa con la BD en Supabase');
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        process.exit(1); 
    }
}

module.exports = {
    pool,
    connectDB
};
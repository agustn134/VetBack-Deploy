// 🥇 1. Cargar las variables de entorno de .env (¡DEBE IR PRIMERO!)
require('dotenv').config(); 

// 🥈 2. Luego, cargar e iniciar los módulos que dependen de process.env
const { initScheduledJobs } = require('./src/services/reminderService');
const app = require('./src/app');
const { connectDB } = require('./src/db/config'); // O donde esté connectDB

const port = process.env.PORT || 4000; 

// Llama a la función que inicia el cron job
initScheduledJobs(); 

// 🥉 3. Finalmente, iniciar el servidor
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`server en el puerto ${port}`);
    });
});
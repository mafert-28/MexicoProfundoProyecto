// Configuración de Conexión MongoDB Atlas - Plataforma México Profundo
const { MongoClient } = require('mongodb');

// Credenciales de conexión
const uri = "mongodb+srv://legmafer_db_user:ZQmLpt0YnguOlShf@cluster0.kp7b9yo.mongodb.net/?appName=Cluster0";
const dbName = "mexicoProfundo";

// Configuración del cliente
const clientOptions = {
  maxPoolSize: 10, // Máximo 10 conexiones en el pool
  serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
  socketTimeoutMS: 45000, // Timeout de socket de 45 segundos
  retryWrites: true,
  writeConcern: { w: 'majority' }
};

let client;
let db;

// Función para conectar a MongoDB Atlas
async function conectarMongoDB() {
  try {
    console.log('Conectando a MongoDB Atlas...');
    client = new MongoClient(uri, clientOptions);
    await client.connect();
    
    // Verificar conexión
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Conexión exitosa a MongoDB Atlas");
    
    // Seleccionar base de datos
    db = client.db(dbName);
    
    return db;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
}

// Función para cerrar conexión
async function cerrarConexion() {
  try {
    if (client) {
      await client.close();
      console.log('🔒 Conexión cerrada correctamente');
    }
  } catch (error) {
    console.error('Error cerrando conexión:', error);
  }
}

// Función para obtener la base de datos
function obtenerDB() {
  if (!db) {
    throw new Error('Base de datos no inicializada. Ejecuta conectarMongoDB() primero.');
  }
  return db;
}

// Función para verificar el estado de la conexión
async function verificarConexion() {
  try {
    if (!client) {
      throw new Error('Cliente no inicializado');
    }
    
    const result = await client.db("admin").command({ ping: 1 });
    console.log('🟢 Conexión activa:', result);
    return true;
  } catch (error) {
    console.error('🔴 Conexión inactiva:', error.message);
    return false;
  }
}

// Función para obtener estadísticas de la base de datos
async function obtenerEstadisticas() {
  try {
    const db = obtenerDB();
    const stats = await db.stats();
    
    return {
      nombre: stats.db,
      colecciones: stats.collections,
      documentos: stats.objects,
      tamaño: {
        datos: Math.round(stats.dataSize / 1024 / 1024 * 100) / 100 + ' MB',
        indices: Math.round(stats.indexSize / 1024 / 1024 * 100) / 100 + ' MB',
        total: Math.round(stats.storageSize / 1024 / 1024 * 100) / 100 + ' MB'
      },
      promedioTamañoDocumento: Math.round(stats.avgObjSize) + ' bytes'
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw error;
  }
}

// Exportar funciones
module.exports = {
  conectarMongoDB,
  cerrarConexion,
  obtenerDB,
  verificarConexion,
  obtenerEstadisticas,
  uri,
  dbName
};

// Si se ejecuta directamente, probar la conexión
if (require.main === module) {
  async function probarConexion() {
    try {
      await conectarMongoDB();
      await verificarConexion();
      
      const stats = await obtenerEstadisticas();
      console.log('\n📊 Estadísticas de la base de datos:');
      console.log(JSON.stringify(stats, null, 2));
      
      await cerrarConexion();
    } catch (error) {
      console.error('Error en la prueba:', error);
      process.exit(1);
    }
  }
  
  probarConexion();
}
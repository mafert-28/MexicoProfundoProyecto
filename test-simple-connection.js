// Prueba Simple de Conexión MongoDB Atlas
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://legmafer_db_user:ZQmLpt0YnguOlShf@cluster0.kp7b9yo.mongodb.net/?appName=Cluster0";

async function probarConexionSimple() {
  let client;
  
  try {
    console.log('🚀 Conectando a MongoDB Atlas...');
    
    // Crear cliente con configuración mínima
    client = new MongoClient(uri);
    
    // Conectar
    await client.connect();
    console.log('✅ Conexión exitosa!');
    
    // Probar ping
    const admin = client.db("admin");
    const result = await admin.command({ ping: 1 });
    console.log('🏓 Ping exitoso:', result);
    
    // Listar bases de datos
    const databases = await admin.admin().listDatabases();
    console.log('📊 Bases de datos disponibles:');
    databases.databases.forEach(db => {
      console.log(`  • ${db.name} (${Math.round(db.sizeOnDisk / 1024)} KB)`);
    });
    
    // Probar acceso a nuestra base de datos
    const db = client.db("mexicoProfundo");
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Colecciones en mexicoProfundo: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('Colecciones existentes:');
      collections.forEach(col => {
        console.log(`  • ${col.name}`);
      });
    } else {
      console.log('No hay colecciones aún (base de datos nueva)');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Diagnóstico adicional
    if (error.message.includes('authentication')) {
      console.log('\n🔍 Posible problema de autenticación:');
      console.log('  • Verifica usuario y contraseña');
      console.log('  • Verifica que el usuario tenga permisos');
    } else if (error.message.includes('network')) {
      console.log('\n🔍 Posible problema de red:');
      console.log('  • Verifica tu conexión a internet');
      console.log('  • Verifica que tu IP esté en la whitelist');
    }
    
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔒 Conexión cerrada');
    }
  }
}

// Ejecutar prueba
probarConexionSimple()
  .then(() => {
    console.log('\n🎉 ¡Prueba de conexión exitosa!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Prueba fallida');
    process.exit(1);
  });
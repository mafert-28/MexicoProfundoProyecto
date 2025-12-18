# Mejores Prácticas y Consideraciones de Seguridad - MongoDB México Profundo

## 1. Seguridad y Protección de Datos

### 1.1 Encriptación de Datos Sensibles

```javascript
// Ejemplo de encriptación para datos bancarios
const crypto = require('crypto');

// Función para encriptar datos sensibles
function encriptarDato(texto, clave) {
  const cipher = crypto.createCipher('aes-256-cbc', clave);
  let encrypted = cipher.update(texto, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Función para desencriptar datos sensibles
function desencriptarDato(textoEncriptado, clave) {
  const decipher = crypto.createDecipher('aes-256-cbc', clave);
  let decrypted = decipher.update(textoEncriptado, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Uso en la aplicación
const datosBancarios = {
  banco: "BBVA",
  numeroCuenta: encriptarDato("1234567890", process.env.ENCRYPTION_KEY),
  clabe: encriptarDato("012345678901234567", process.env.ENCRYPTION_KEY),
  titular: "María Elena Pérez Hernández"
};
```

### 1.2 Configuración de Autenticación MongoDB

```javascript
// Crear usuario administrador de base de datos
use admin
db.createUser({
  user: "adminMexicoProfundo",
  pwd: "contraseña_super_segura_123!",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
});

// Crear usuario específico para la aplicación
use mexicoProfundo
db.createUser({
  user: "appMexicoProfundo",
  pwd: "contraseña_app_segura_456!",
  roles: [
    { role: "readWrite", db: "mexicoProfundo" }
  ]
});

// Crear usuario de solo lectura para reportes
use mexicoProfundo
db.createUser({
  user: "reportesMexicoProfundo",
  pwd: "contraseña_reportes_789!",
  roles: [
    { role: "read", db: "mexicoProfundo" }
  ]
});
```

### 1.3 Configuración de Red y Firewall

```bash
# Configurar MongoDB para escuchar solo en interfaces específicas
# En /etc/mongod.conf
net:
  port: 27017
  bindIp: 127.0.0.1,10.0.0.100  # Solo localhost y IP interna

# Habilitar autenticación
security:
  authorization: enabled

# Configurar SSL/TLS
net:
  ssl:
    mode: requireSSL
    PEMKeyFile: /etc/ssl/mongodb.pem
    CAFile: /etc/ssl/ca.pem
```

## 2. Optimización de Rendimiento

### 2.1 Índices Estratégicos

```javascript
// Índices compuestos para consultas frecuentes
db.productos.createIndex({ 
  "categoria": 1, 
  "estado": 1, 
  "precio.monto": 1 
});

// Índice para búsquedas geográficas
db.oferentes.createIndex({ 
  "ubicacion.coordenadas": "2dsphere" 
});

// Índice TTL para logs (eliminar automáticamente después de 90 días)
db.logs.createIndex(
  { "fecha": 1 }, 
  { expireAfterSeconds: 7776000 } // 90 días
);

// Índice parcial para productos activos
db.productos.createIndex(
  { "nombre": 1, "categoria": 1 },
  { partialFilterExpression: { "estado": "activo" } }
);
```

### 2.2 Agregaciones Optimizadas

```javascript
// Pipeline optimizado para estadísticas de ventas
db.pedidos.aggregate([
  // Filtrar primero para reducir documentos
  { $match: { 
    "estado": { $in: ["entregado", "enviado"] },
    "fechaCreacion": { $gte: new Date("2024-01-01") }
  }},
  
  // Proyectar solo campos necesarios
  { $project: {
    "oferenteId": 1,
    "totales.total": 1,
    "fechaCreacion": 1
  }},
  
  // Agrupar por oferente
  { $group: {
    _id: "$oferenteId",
    totalVentas: { $sum: "$totales.total" },
    numeroPedidos: { $sum: 1 }
  }},
  
  // Lookup solo al final
  { $lookup: {
    from: "oferentes",
    localField: "_id",
    foreignField: "_id",
    as: "oferente",
    pipeline: [
      { $project: { "datosPersonales.nombreComercial": 1 } }
    ]
  }}
], { allowDiskUse: true });
```

## 3. Validación de Datos

### 3.1 Schema Validation

```javascript
// Validación para colección oferentes
db.createCollection("oferentes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["tipoOferente", "datosPersonales", "ubicacion", "estado"],
      properties: {
        tipoOferente: {
          enum: ["artesano", "comunidad", "cooperativa"]
        },
        datosPersonales: {
          bsonType: "object",
          required: ["nombreCompleto", "correo", "telefono"],
          properties: {
            correo: {
              bsonType: "string",
              pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            },
            telefono: {
              bsonType: "string",
              pattern: "^\\+52\\s?[0-9]{10}$"
            }
          }
        },
        estado: {
          enum: ["pendiente", "activo", "suspendido", "eliminado"]
        }
      }
    }
  }
});

// Validación para colección productos
db.createCollection("productos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["oferenteId", "nombre", "precio", "estado"],
      properties: {
        precio: {
          bsonType: "object",
          required: ["monto", "moneda"],
          properties: {
            monto: {
              bsonType: "number",
              minimum: 0
            },
            moneda: {
              enum: ["MXN", "USD"]
            }
          }
        },
        estado: {
          enum: ["borrador", "activo", "pausado", "agotado"]
        }
      }
    }
  }
});
```

## 4. Backup y Recuperación

### 4.1 Estrategia de Backup

```bash
#!/bin/bash
# Script de backup diario

FECHA=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
DB_NAME="mexicoProfundo"

# Crear directorio de backup
mkdir -p $BACKUP_DIR/$FECHA

# Backup completo
mongodump --host localhost:27017 \
          --db $DB_NAME \
          --username appMexicoProfundo \
          --password $MONGO_PASSWORD \
          --out $BACKUP_DIR/$FECHA

# Comprimir backup
tar -czf $BACKUP_DIR/backup_$FECHA.tar.gz -C $BACKUP_DIR $FECHA

# Eliminar directorio temporal
rm -rf $BACKUP_DIR/$FECHA

# Eliminar backups antiguos (más de 30 días)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete

echo "Backup completado: backup_$FECHA.tar.gz"
```

### 4.2 Restauración de Backup

```bash
#!/bin/bash
# Script de restauración

BACKUP_FILE=$1
RESTORE_DIR="/tmp/restore_$(date +%s)"

if [ -z "$BACKUP_FILE" ]; then
    echo "Uso: $0 <archivo_backup.tar.gz>"
    exit 1
fi

# Extraer backup
mkdir -p $RESTORE_DIR
tar -xzf $BACKUP_FILE -C $RESTORE_DIR

# Restaurar base de datos
mongorestore --host localhost:27017 \
             --db mexicoProfundo \
             --username appMexicoProfundo \
             --password $MONGO_PASSWORD \
             --drop \
             $RESTORE_DIR/mexicoProfundo

# Limpiar archivos temporales
rm -rf $RESTORE_DIR

echo "Restauración completada"
```

## 5. Monitoreo y Alertas

### 5.1 Consultas de Monitoreo

```javascript
// Función para monitorear el estado de la base de datos
function monitorearEstado() {
  var stats = db.stats();
  var serverStatus = db.serverStatus();
  
  return {
    tamaño: {
      datos: Math.round(stats.dataSize / 1024 / 1024) + " MB",
      indices: Math.round(stats.indexSize / 1024 / 1024) + " MB",
      total: Math.round(stats.storageSize / 1024 / 1024) + " MB"
    },
    conexiones: {
      actuales: serverStatus.connections.current,
      disponibles: serverStatus.connections.available,
      porcentajeUso: Math.round((serverStatus.connections.current / 
                                (serverStatus.connections.current + serverStatus.connections.available)) * 100)
    },
    operaciones: {
      lecturas: serverStatus.opcounters.query,
      escrituras: serverStatus.opcounters.insert + serverStatus.opcounters.update + serverStatus.opcounters.delete
    },
    memoria: {
      residente: Math.round(serverStatus.mem.resident) + " MB",
      virtual: Math.round(serverStatus.mem.virtual) + " MB"
    }
  };
}

// Función para detectar consultas lentas
function consultasLentas() {
  return db.system.profile.find({
    "ts": { $gte: new Date(Date.now() - 3600000) }, // Última hora
    "millis": { $gt: 1000 } // Más de 1 segundo
  }).sort({ "ts": -1 }).limit(10);
}
```

### 5.2 Alertas Automáticas

```javascript
// Script de alertas (ejecutar periódicamente)
function verificarAlertas() {
  var alertas = [];
  
  // Verificar espacio en disco
  var stats = db.stats();
  var tamaño = stats.storageSize / 1024 / 1024 / 1024; // GB
  if (tamaño > 50) { // Más de 50GB
    alertas.push({
      tipo: "espacio",
      mensaje: "Base de datos usando " + Math.round(tamaño) + "GB de espacio",
      nivel: "warning"
    });
  }
  
  // Verificar conexiones
  var serverStatus = db.serverStatus();
  var porcentajeConexiones = (serverStatus.connections.current / 
                             (serverStatus.connections.current + serverStatus.connections.available)) * 100;
  if (porcentajeConexiones > 80) {
    alertas.push({
      tipo: "conexiones",
      mensaje: "Usando " + Math.round(porcentajeConexiones) + "% de las conexiones disponibles",
      nivel: "critical"
    });
  }
  
  // Verificar errores recientes
  var erroresRecientes = db.logs.countDocuments({
    "nivel": { $in: ["error", "critical"] },
    "fecha": { $gte: new Date(Date.now() - 3600000) } // Última hora
  });
  
  if (erroresRecientes > 10) {
    alertas.push({
      tipo: "errores",
      mensaje: erroresRecientes + " errores en la última hora",
      nivel: "critical"
    });
  }
  
  return alertas;
}
```

## 6. Mantenimiento Regular

### 6.1 Tareas de Mantenimiento

```javascript
// Script de mantenimiento semanal
function mantenimientoSemanal() {
  print("Iniciando mantenimiento semanal...");
  
  // 1. Limpiar logs antiguos (más de 90 días)
  var fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - 90);
  
  var logsEliminados = db.logs.deleteMany({
    "fecha": { $lt: fechaLimite }
  });
  print("Logs eliminados: " + logsEliminados.deletedCount);
  
  // 2. Actualizar estadísticas de productos
  db.productos.find({ "estado": "activo" }).forEach(function(producto) {
    var ventas = db.pedidos.countDocuments({
      "items.productoId": producto._id,
      "estado": { $in: ["entregado", "enviado"] }
    });
    
    var reseñas = db.reseñas.aggregate([
      { $match: { "productoId": producto._id, "estado": "aprobada" } },
      { $group: {
        _id: null,
        promedio: { $avg: "$calificacion" },
        total: { $sum: 1 }
      }}
    ]).toArray();
    
    var estadisticas = {
      ventas: ventas,
      numeroReseñas: reseñas.length > 0 ? reseñas[0].total : 0,
      calificacionPromedio: reseñas.length > 0 ? reseñas[0].promedio : 0
    };
    
    db.productos.updateOne(
      { "_id": producto._id },
      { "$set": { "estadisticas": estadisticas } }
    );
  });
  
  // 3. Compactar colecciones
  db.runCommand({ "compact": "logs" });
  db.runCommand({ "compact": "productos" });
  
  // 4. Reconstruir índices
  db.productos.reIndex();
  db.pedidos.reIndex();
  
  print("Mantenimiento completado");
}

// Programar ejecución semanal (usar cron job)
// 0 2 * * 0 mongo mexicoProfundo --eval "mantenimientoSemanal()"
```

## 7. Consideraciones de Escalabilidad

### 7.1 Sharding Strategy

```javascript
// Configuración de sharding para escalabilidad futura
// Shard key para oferentes (por estado geográfico)
sh.shardCollection("mexicoProfundo.oferentes", { "ubicacion.estado": 1, "_id": 1 });

// Shard key para productos (por oferente)
sh.shardCollection("mexicoProfundo.productos", { "oferenteId": 1, "_id": 1 });

// Shard key para pedidos (por fecha)
sh.shardCollection("mexicoProfundo.pedidos", { "fechaCreacion": 1, "_id": 1 });

// Shard key para logs (por fecha)
sh.shardCollection("mexicoProfundo.logs", { "fecha": 1, "_id": 1 });
```

### 7.2 Read Preferences

```javascript
// Configurar preferencias de lectura para diferentes tipos de consultas
const MongoClient = require('mongodb').MongoClient;

// Para consultas de reportes (pueden usar secundarios)
const clientReportes = new MongoClient(uri, {
  readPreference: 'secondary',
  readConcern: { level: 'majority' }
});

// Para transacciones críticas (solo primario)
const clientTransacciones = new MongoClient(uri, {
  readPreference: 'primary',
  writeConcern: { w: 'majority', j: true }
});
```

## 8. Cumplimiento Legal (LFPDPPP)

### 8.1 Anonización de Datos

```javascript
// Función para anonizar datos personales
function anonizarDatosPersonales(usuarioId) {
  var fechaAnonimizacion = new Date();
  
  // Anonizar datos del usuario
  db.usuarios.updateOne(
    { "_id": usuarioId },
    {
      "$set": {
        "datosPersonales.nombre": "Usuario Anonimizado",
        "datosPersonales.apellidos": "Datos Eliminados",
        "datosPersonales.correo": "anonimo_" + fechaAnonimizacion.getTime() + "@eliminado.com",
        "datosPersonales.telefono": "+52 000 000 0000",
        "estado": "anonimizado",
        "fechaAnonimizacion": fechaAnonimizacion
      },
      "$unset": {
        "direcciones": "",
        "historialCompras": "",
        "wishlist": ""
      }
    }
  );
  
  // Anonizar datos en logs
  db.logs.updateMany(
    { "usuarioId": usuarioId },
    {
      "$set": {
        "usuarioId": null,
        "ip": "0.0.0.0",
        "userAgent": "Anonimizado"
      }
    }
  );
  
  // Anonizar reseñas
  db.reseñas.updateMany(
    { "usuarioId": usuarioId },
    {
      "$set": {
        "usuarioId": null,
        "comentario": "Comentario eliminado por solicitud del usuario"
      }
    }
  );
  
  print("Datos anonimizados para usuario: " + usuarioId);
}
```

### 8.2 Auditoría de Acceso a Datos

```javascript
// Función para registrar acceso a datos sensibles
function registrarAccesoDatos(usuarioId, tipoAcceso, datosAccedidos) {
  db.auditoria.insertOne({
    usuarioId: usuarioId,
    tipoAcceso: tipoAcceso,
    datosAccedidos: datosAccedidos,
    fecha: new Date(),
    ip: session.getClient().host,
    userAgent: session.getClient().applicationName
  });
}

// Ejemplo de uso
registrarAccesoDatos(
  ObjectId("..."),
  "consulta_datos_bancarios",
  ["numeroCuenta", "clabe"]
);
```

## 9. Testing y Validación

### 9.1 Tests de Integridad de Datos

```javascript
// Función para validar integridad de datos
function validarIntegridadDatos() {
  var errores = [];
  
  // Verificar que todos los productos tienen oferente válido
  var productosHuerfanos = db.productos.aggregate([
    {
      $lookup: {
        from: "oferentes",
        localField: "oferenteId",
        foreignField: "_id",
        as: "oferente"
      }
    },
    {
      $match: { "oferente": { $size: 0 } }
    }
  ]).toArray();
  
  if (productosHuerfanos.length > 0) {
    errores.push("Productos sin oferente válido: " + productosHuerfanos.length);
  }
  
  // Verificar que todos los pedidos tienen productos válidos
  var pedidosInvalidos = db.pedidos.find({}).toArray().filter(function(pedido) {
    return pedido.items.some(function(item) {
      return !db.productos.findOne({ "_id": item.productoId });
    });
  });
  
  if (pedidosInvalidos.length > 0) {
    errores.push("Pedidos con productos inválidos: " + pedidosInvalidos.length);
  }
  
  return errores;
}
```

Esta estructura de base de datos MongoDB está diseñada específicamente para los requerimientos de la Plataforma México Profundo, considerando todos los aspectos mencionados en el documento: seguridad, escalabilidad, cumplimiento legal y funcionalidad completa para micrositios de comercialización.
// Script de Inicialización para MongoDB Atlas - Plataforma México Profundo
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://legmafer_db_user:ZQmLpt0YnguOlShf@cluster0.kp7b9yo.mongodb.net/?appName=Cluster0";
const dbName = "mexicoProfundo";

async function inicializarBaseDatos() {
  let client;
  
  try {
    console.log('🚀 Iniciando configuración de MongoDB Atlas...');
    
    // Conectar a MongoDB Atlas
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true
    });
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');
    
    const db = client.db(dbName);
    
    // 1. Crear índices
    console.log('\n📋 Creando índices...');
    
    // Índices para oferentes
    await db.collection('oferentes').createIndex({ "datosPersonales.correo": 1 }, { unique: true });
    await db.collection('oferentes').createIndex({ "datosPersonales.rfc": 1 }, { unique: true });
    await db.collection('oferentes').createIndex({ "micrositio.subdominio": 1 }, { unique: true });
    await db.collection('oferentes').createIndex({ "estado": 1 });
    await db.collection('oferentes').createIndex({ "ubicacion.estado": 1, "ubicacion.municipio": 1 });
    await db.collection('oferentes').createIndex({ "tipoOferente": 1 });
    await db.collection('oferentes').createIndex({ "ubicacion.coordenadas": "2dsphere" });
    console.log('  ✓ Índices de oferentes creados');
    
    // Índices para productos
    await db.collection('productos').createIndex({ "oferenteId": 1 });
    await db.collection('productos').createIndex({ "categoria": 1, "subcategoria": 1 });
    await db.collection('productos').createIndex({ "estado": 1 });
    await db.collection('productos').createIndex({ "etiquetas": 1 });
    await db.collection('productos').createIndex({ "precio.monto": 1 });
    await db.collection('productos').createIndex({ "seo.slug": 1 }, { unique: true });
    await db.collection('productos').createIndex({ 
      "nombre": "text", 
      "descripcion": "text", 
      "etiquetas": "text" 
    }, { 
      default_language: 'spanish',
      language_override: 'idioma'
    });
    console.log('  ✓ Índices de productos creados');
    
    // Índices para usuarios
    await db.collection('usuarios').createIndex({ "datosPersonales.correo": 1 }, { unique: true });
    await db.collection('usuarios').createIndex({ "tipo": 1 });
    await db.collection('usuarios').createIndex({ "estado": 1 });
    console.log('  ✓ Índices de usuarios creados');
    
    // Índices para pedidos
    await db.collection('pedidos').createIndex({ "compradorId": 1 });
    await db.collection('pedidos').createIndex({ "oferenteId": 1 });
    await db.collection('pedidos').createIndex({ "numeroPedido": 1 }, { unique: true });
    await db.collection('pedidos').createIndex({ "estado": 1 });
    await db.collection('pedidos').createIndex({ "fechaCreacion": -1 });
    console.log('  ✓ Índices de pedidos creados');
    
    // Índices para transacciones
    await db.collection('transacciones').createIndex({ "oferenteId": 1 });
    await db.collection('transacciones').createIndex({ "pedidoId": 1 });
    await db.collection('transacciones').createIndex({ "estado": 1 });
    await db.collection('transacciones').createIndex({ "fechaTransaccion": -1 });
    console.log('  ✓ Índices de transacciones creados');
    
    // Índices para micrositios
    await db.collection('micrositios').createIndex({ "oferenteId": 1 }, { unique: true });
    await db.collection('micrositios').createIndex({ "configuracion.subdominio": 1 }, { unique: true });
    console.log('  ✓ Índices de micrositios creados');
    
    // Índices para reseñas
    await db.collection('reseñas').createIndex({ "productoId": 1 });
    await db.collection('reseñas').createIndex({ "oferenteId": 1 });
    await db.collection('reseñas').createIndex({ "usuarioId": 1 });
    await db.collection('reseñas').createIndex({ "estado": 1 });
    console.log('  ✓ Índices de reseñas creados');
    
    // Índices para logs (con TTL de 90 días)
    await db.collection('logs').createIndex({ "fecha": -1 });
    await db.collection('logs').createIndex({ "usuarioId": 1 });
    await db.collection('logs').createIndex({ "tipo": 1 });
    await db.collection('logs').createIndex(
      { "fecha": 1 }, 
      { expireAfterSeconds: 7776000 } // 90 días
    );
    console.log('  ✓ Índices de logs creados (con TTL de 90 días)');
    
    // 2. Insertar configuración inicial
    console.log('\n⚙️ Insertando configuración inicial...');
    
    const configuracionInicial = [
      {
        clave: "comision_plataforma",
        valor: { porcentaje: 5, minimo: 10 },
        tipo: "sistema",
        descripcion: "Comisión que cobra la plataforma por venta",
        fechaUltimaModificacion: new Date()
      },
      {
        clave: "pasarelas_pago",
        valor: {
          stripe: { activa: true, comision: 3.6 },
          mercadopago: { activa: true, comision: 4.2 },
          conekta: { activa: false, comision: 3.8 }
        },
        tipo: "pago",
        descripcion: "Configuración de pasarelas de pago",
        fechaUltimaModificacion: new Date()
      },
      {
        clave: "idiomas_soportados",
        valor: ["es", "en", "maya", "fr", "zh"],
        tipo: "sistema",
        descripcion: "Idiomas soportados por la plataforma",
        fechaUltimaModificacion: new Date()
      },
      {
        clave: "email_configuracion",
        valor: {
          smtp: {
            host: "smtp.gmail.com",
            port: 587,
            secure: false
          },
          plantillas: {
            bienvenida: "template_bienvenida",
            confirmacion_pedido: "template_pedido",
            envio_producto: "template_envio"
          }
        },
        tipo: "email",
        descripcion: "Configuración de correo electrónico",
        fechaUltimaModificacion: new Date()
      },
      {
        clave: "limites_sistema",
        valor: {
          max_productos_por_oferente: 100,
          max_imagenes_por_producto: 10,
          tamaño_max_imagen_mb: 5,
          max_reseñas_por_usuario_producto: 1
        },
        tipo: "sistema",
        descripcion: "Límites del sistema",
        fechaUltimaModificacion: new Date()
      }
    ];
    
    await db.collection('configuracion').insertMany(configuracionInicial);
    console.log('  ✓ Configuración inicial insertada');
    
    // 3. Insertar categorías iniciales
    console.log('\n📂 Insertando categorías iniciales...');
    
    const categoriasIniciales = [
      {
        nombre: "Artesanías",
        slug: "artesanias",
        descripcion: "Productos artesanales tradicionales",
        icono: "craft",
        imagen: "/images/categorias/artesanias.jpg",
        padre: null,
        nivel: 0,
        orden: 1,
        multiidioma: {
          es: { nombre: "Artesanías", descripcion: "Productos artesanales tradicionales" },
          en: { nombre: "Handicrafts", descripcion: "Traditional handmade products" },
          maya: { nombre: "U meyajil k'ab", descripcion: "U meyajil k'ab ti' u yóok'ol kaaj" }
        },
        activa: true,
        fechaCreacion: new Date()
      },
      {
        nombre: "Textiles",
        slug: "textiles",
        descripcion: "Tejidos y bordados tradicionales",
        icono: "textile",
        imagen: "/images/categorias/textiles.jpg",
        padre: null, // Se actualizará después
        nivel: 1,
        orden: 1,
        multiidioma: {
          es: { nombre: "Textiles", descripcion: "Tejidos y bordados tradicionales" },
          en: { nombre: "Textiles", descripcion: "Traditional weaving and embroidery" },
          maya: { nombre: "Nok'", descripcion: "Nok' yéetel ch'uy" }
        },
        activa: true,
        fechaCreacion: new Date()
      },
      {
        nombre: "Cerámica",
        slug: "ceramica",
        descripcion: "Alfarería y cerámica artesanal",
        icono: "pottery",
        imagen: "/images/categorias/ceramica.jpg",
        padre: null, // Se actualizará después
        nivel: 1,
        orden: 2,
        multiidioma: {
          es: { nombre: "Cerámica", descripcion: "Alfarería y cerámica artesanal" },
          en: { nombre: "Ceramics", descripcion: "Handmade pottery and ceramics" },
          maya: { nombre: "Luum", descripcion: "U meyajil luum" }
        },
        activa: true,
        fechaCreacion: new Date()
      },
      {
        nombre: "Turismo",
        slug: "turismo",
        descripcion: "Experiencias y servicios turísticos",
        icono: "tourism",
        imagen: "/images/categorias/turismo.jpg",
        padre: null,
        nivel: 0,
        orden: 2,
        multiidioma: {
          es: { nombre: "Turismo", descripcion: "Experiencias y servicios turísticos" },
          en: { nombre: "Tourism", descripcion: "Tourism experiences and services" },
          maya: { nombre: "Xiimbal", descripcion: "U xiimbal yéetel u meyajil" }
        },
        activa: true,
        fechaCreacion: new Date()
      },
      {
        nombre: "Gastronomía",
        slug: "gastronomia",
        descripcion: "Productos alimentarios tradicionales",
        icono: "food",
        imagen: "/images/categorias/gastronomia.jpg",
        padre: null,
        nivel: 0,
        orden: 3,
        multiidioma: {
          es: { nombre: "Gastronomía", descripcion: "Productos alimentarios tradicionales" },
          en: { nombre: "Gastronomy", descripcion: "Traditional food products" },
          maya: { nombre: "Janal", descripcion: "Janal ti' u yóok'ol kaaj" }
        },
        activa: true,
        fechaCreacion: new Date()
      }
    ];
    
    const resultCategorias = await db.collection('categorias').insertMany(categoriasIniciales);
    
    // Actualizar referencias padre para subcategorías
    const artesaniasId = resultCategorias.insertedIds[0];
    await db.collection('categorias').updateMany(
      { slug: { $in: ["textiles", "ceramica"] } },
      { $set: { padre: artesaniasId } }
    );
    
    console.log('  ✓ Categorías iniciales insertadas');
    
    // 4. Crear usuario administrador
    console.log('\n👤 Creando usuario administrador...');
    
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('admin123!', saltRounds);
    
    const adminUser = {
      tipo: "administrador",
      datosPersonales: {
        nombre: "Administrador",
        apellidos: "Sistema",
        correo: "admin@mexicoprofundo.mx",
        telefono: "+52 999 000 0000"
      },
      autenticacion: {
        passwordHash: passwordHash,
        salt: "sistema_salt",
        ultimoAcceso: new Date(),
        intentosFallidos: 0,
        bloqueado: false
      },
      preferencias: {
        idioma: "es",
        moneda: "MXN",
        notificaciones: {
          email: true,
          sms: false,
          push: true
        }
      },
      fechaRegistro: new Date(),
      estado: "activo"
    };
    
    await db.collection('usuarios').insertOne(adminUser);
    console.log('  ✓ Usuario administrador creado (admin@mexicoprofundo.mx / admin123!)');
    
    // 5. Crear validaciones de esquema
    console.log('\n🛡️ Configurando validaciones de esquema...');
    
    // Validación para oferentes
    await db.command({
      collMod: "oferentes",
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
    
    // Validación para productos
    await db.command({
      collMod: "productos",
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
    
    console.log('  ✓ Validaciones de esquema configuradas');
    
    // 6. Insertar log de inicialización
    await db.collection('logs').insertOne({
      tipo: "sistema",
      usuarioId: null,
      accion: "inicializacion_base_datos",
      detalles: {
        version: "1.0.0",
        fecha_inicializacion: new Date(),
        indices_creados: true,
        configuracion_inicial: true,
        categorias_iniciales: true,
        usuario_admin_creado: true
      },
      ip: "127.0.0.1",
      userAgent: "Sistema de Inicialización",
      fecha: new Date(),
      nivel: "info"
    });
    
    // 7. Mostrar estadísticas finales
    console.log('\n📊 Estadísticas de la base de datos:');
    const stats = await db.stats();
    console.log(`  • Colecciones: ${stats.collections}`);
    console.log(`  • Documentos: ${stats.objects}`);
    console.log(`  • Tamaño de datos: ${Math.round(stats.dataSize / 1024)} KB`);
    console.log(`  • Tamaño de índices: ${Math.round(stats.indexSize / 1024)} KB`);
    
    console.log('\n🎉 ¡Base de datos inicializada correctamente!');
    console.log('\n📝 Credenciales de acceso:');
    console.log('  • Email: admin@mexicoprofundo.mx');
    console.log('  • Password: admin123!');
    console.log('\n🔗 URI de conexión:');
    console.log(`  • ${uri}`);
    console.log(`  • Base de datos: ${dbName}`);
    
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔒 Conexión cerrada');
    }
  }
}

// Ejecutar inicialización
if (require.main === module) {
  inicializarBaseDatos()
    .then(() => {
      console.log('\n✅ Proceso completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en el proceso:', error);
      process.exit(1);
    });
}

module.exports = { inicializarBaseDatos };
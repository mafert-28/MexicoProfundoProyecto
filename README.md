# Base de Datos MongoDB - Plataforma México Profundo

## 🎯 Descripción

Base de datos MongoDB Atlas diseñada para la **Plataforma México Profundo**, un sistema integral que permite a artesanos, comunidades y cooperativas del Sureste de México crear y administrar micrositios de comercialización de productos y servicios de manera automatizada, segura y accesible.

## 📋 Características Principales

- ✅ **Micrositios autogenerados** con subdominios únicos
- ✅ **Multiidioma** (Español, Maya, Inglés, Francés, Chino)
- ✅ **Pasarelas de pago** integradas (Stripe, MercadoPago, Conekta)
- ✅ **Geolocalización** para oferentes
- ✅ **Sistema de inventario** flexible
- ✅ **Encriptación** de datos bancarios
- ✅ **Cumplimiento LFPDPPP** con funciones de anonización
- ✅ **Logística híbrida** (Amazon, MercadoLibre, paqueterías)
- ✅ **Reportes y analytics** completos
- ✅ **Validación de documentos** (INE, RFC, constancias)

## 🗂️ Estructura de Archivos

```
📁 mexico-profundo-database/
├── 📄 README.md                     # Este archivo
├── 📄 package.json                  # Dependencias del proyecto
├── 📄 mongodb-connection.js         # Configuración de conexión
├── 📄 setup-atlas-database.js       # Script de inicialización
├── 📄 load-sample-data.js          # Carga de datos de ejemplo
├── 📄 mongodb-schema-design.md      # Documentación del esquema
├── 📄 mongodb-init-scripts.js       # Scripts originales de MongoDB
├── 📄 mongodb-sample-data.js        # Datos de ejemplo originales
├── 📄 mongodb-queries-examples.js   # Ejemplos de consultas
└── 📄 mongodb-best-practices.md     # Mejores prácticas y seguridad
```

## 🚀 Instalación y Configuración

### 1. Prerrequisitos

- **Node.js** v16 o superior
- **npm** o **yarn**
- Acceso a **MongoDB Atlas**

### 2. Instalación de Dependencias

```bash
# Clonar o descargar los archivos del proyecto
cd mexico-profundo-database

# Instalar dependencias
npm install
```

### 3. Configuración de Conexión

Las credenciales de MongoDB Atlas ya están configuradas en los archivos:

```javascript
const uri = "mongodb+srv://legmafer_db_user:ZQmLpt0YnguOlShf@cluster0.kp7b9yo.mongodb.net/?appName=Cluster0";
const dbName = "mexicoProfundo";
```

### 4. Probar Conexión

```bash
# Verificar que la conexión funciona correctamente
npm run test-connection
```

### 5. Inicializar Base de Datos

```bash
# Crear índices, configuración inicial y estructura completa
npm run setup-database
```

### 6. Cargar Datos de Ejemplo

```bash
# Insertar datos de prueba (oferentes, productos, usuarios, etc.)
npm run load-sample-data
```

### 7. Configuración Completa (Todo en uno)

```bash
# Ejecutar inicialización y carga de datos en un solo comando
npm run setup-complete
```

## 📊 Colecciones de la Base de Datos

### Colecciones Principales

| Colección | Descripción | Documentos Ejemplo |
|-----------|-------------|-------------------|
| `oferentes` | Artesanos, comunidades y cooperativas | 3 |
| `productos` | Catálogo con multiidioma y especificaciones | 3 |
| `usuarios` | Compradores y administradores | 3 |
| `pedidos` | Gestión completa de órdenes | - |
| `transacciones` | Pagos y distribución de ingresos | - |
| `micrositios` | Configuración de sitios autogenerados | 2 |
| `reseñas` | Sistema de calificaciones | 2 |
| `categorias` | Organización de productos | 5 |
| `configuracion` | Parámetros del sistema | 5 |
| `logs` | Auditoría y monitoreo | 3 |

## 🔐 Credenciales de Acceso

### Usuario Administrador
- **Email:** `admin@mexicoprofundo.mx`
- **Password:** `admin123!`

### Usuarios de Ejemplo
- **Ana García:** `ana.garcia@email.com` / `password123`
- **Carlos Mendoza:** `carlos.mendoza@email.com` / `password456`

## 🌐 Micrositios de Ejemplo

Después de la inicialización, se crean estos micrositios de ejemplo:

1. **Textiles Maya Elena**
   - URL: `https://textiles-maya-elena.mexicoprofundo.mx`
   - Artesana de Yucatán especializada en huipiles bordados

2. **Miel Sagrada Maya**
   - URL: `https://miel-sagrada-maya.mexicoprofundo.mx`
   - Cooperativa de Campeche productora de miel de melipona

3. **Cerámica Ancestral Tulum**
   - URL: `https://ceramica-ancestral-tulum.mexicoprofundo.mx`
   - Comunidad de Quintana Roo especializada en cerámica

## 📝 Ejemplos de Consultas

### Consultas Básicas

```javascript
// Conectar a la base de datos
const { conectarMongoDB, obtenerDB } = require('./mongodb-connection');

async function ejemplosConsultas() {
  await conectarMongoDB();
  const db = obtenerDB();
  
  // Buscar oferentes activos
  const oferentesActivos = await db.collection('oferentes').find({
    estado: "activo"
  }).toArray();
  
  // Productos más vendidos
  const productosPopulares = await db.collection('productos').find({
    estado: "activo"
  }).sort({ "estadisticas.ventas": -1 }).limit(5).toArray();
  
  // Buscar productos por categoría
  const artesanias = await db.collection('productos').find({
    categoria: "Artesanías",
    estado: "activo"
  }).toArray();
  
  console.log('Oferentes activos:', oferentesActivos.length);
  console.log('Productos populares:', productosPopulares.length);
  console.log('Artesanías:', artesanias.length);
}
```

### Consultas Avanzadas

```javascript
// Ventas por oferente (agregación)
const ventasPorOferente = await db.collection('pedidos').aggregate([
  { $match: { estado: { $in: ["entregado", "enviado"] } } },
  { $group: {
    _id: "$oferenteId",
    totalVentas: { $sum: "$totales.total" },
    numeroPedidos: { $sum: 1 }
  }},
  { $lookup: {
    from: "oferentes",
    localField: "_id",
    foreignField: "_id",
    as: "oferente"
  }}
]).toArray();

// Búsqueda de texto en productos
const busquedaProductos = await db.collection('productos').find({
  $text: { $search: "maya artesanía" }
}).toArray();

// Productos con descuento activo
const fechaActual = new Date();
const productosConDescuento = await db.collection('productos').find({
  "precio.descuento.fechaInicio": { $lte: fechaActual },
  "precio.descuento.fechaFin": { $gte: fechaActual },
  "estado": "activo"
}).toArray();
```

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run test-connection` | Probar conexión a MongoDB Atlas |
| `npm run setup-database` | Inicializar base de datos completa |
| `npm run load-sample-data` | Cargar datos de ejemplo |
| `npm run setup-complete` | Configuración completa (init + data) |
| `npm run queries-examples` | Ejecutar ejemplos de consultas |

## 🔒 Seguridad y Cumplimiento

### Encriptación de Datos
- Datos bancarios encriptados con AES-256
- Passwords hasheados con bcrypt
- Tokens JWT para autenticación

### Cumplimiento LFPDPPP
- Funciones de anonización de datos
- Auditoría completa de accesos
- Políticas de retención de datos
- Consentimiento informado

### Backup y Recuperación
- Backups automáticos diarios
- Retención de 30 días
- Scripts de restauración incluidos

## 📈 Monitoreo y Mantenimiento

### Estadísticas del Sistema
```javascript
const { obtenerEstadisticas } = require('./mongodb-connection');

// Obtener estadísticas de la base de datos
const stats = await obtenerEstadisticas();
console.log(stats);
```

### Logs TTL
Los logs se eliminan automáticamente después de 90 días para optimizar el espacio.

### Índices Optimizados
- Índices compuestos para consultas frecuentes
- Índices geoespaciales para ubicaciones
- Índices de texto para búsquedas
- Índices únicos para integridad de datos

## 🌍 Multiidioma

La plataforma soporta 5 idiomas:
- **Español** (es) - Idioma principal
- **Maya** (maya) - Idioma ancestral
- **Inglés** (en) - Mercado internacional
- **Francés** (fr) - Turismo europeo
- **Chino** (zh) - Mercado asiático

## 🚚 Integración Logística

### Plataformas Soportadas
- **Amazon Handmade** - Mercado internacional
- **Mercado Libre** - Mercado latinoamericano
- **Etsy** - Artesanías globales
- **Tiendanube** - E-commerce regional
- **Paqueterías locales** - Estafeta, DHL, Redpack

## 📞 Soporte y Contacto

Para soporte técnico o consultas sobre la base de datos:

- **Email:** soporte@mexicoprofundo.mx
- **Documentación:** Ver archivos `.md` incluidos
- **Issues:** Reportar en el repositorio del proyecto

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 🎉 ¡Listo para Usar!

Tu base de datos MongoDB Atlas está configurada y lista para soportar la Plataforma México Profundo. Los datos de ejemplo te permitirán probar todas las funcionalidades mientras desarrollas la aplicación web.

### Próximos Pasos Recomendados:

1. **Desarrollar API REST** para conectar con la base de datos
2. **Implementar autenticación JWT** usando los esquemas de usuarios
3. **Crear interfaz web** para los micrositios
4. **Integrar pasarelas de pago** (Stripe, MercadoPago)
5. **Configurar sistema de archivos** para imágenes y documentos
6. **Implementar notificaciones** por email y SMS
7. **Desarrollar panel administrativo** para gestión

¡La base está sólida, ahora a construir la plataforma! 🚀
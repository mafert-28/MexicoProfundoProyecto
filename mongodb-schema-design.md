# Diseño de Base de Datos MongoDB - Plataforma México Profundo

## Análisis de Requerimientos

Basado en el documento de alcances, la plataforma necesita gestionar:

1. **Oferentes** (artesanos, comunidades, cooperativas)
2. **Micrositios** autogenerados
3. **Productos y servicios**
4. **Transacciones y pagos**
5. **Usuarios compradores**
6. **Logística y envíos**
7. **Administración y reportes**

## Colecciones Principales

### 1. Colección: `oferentes`
```javascript
{
  _id: ObjectId,
  tipoOferente: "artesano" | "comunidad" | "cooperativa",
  datosPersonales: {
    nombreCompleto: String,
    nombreComercial: String,
    correo: String,
    telefono: String,
    rfc: String,
    curp: String
  },
  ubicacion: {
    estado: String,
    municipio: String,
    localidad: String,
    direccion: String,
    coordenadas: {
      lat: Number,
      lng: Number
    }
  },
  datosBancarios: {
    banco: String,
    numeroCuenta: String, // Encriptado
    clabe: String, // Encriptado
    titular: String
  },
  documentos: {
    ine: {
      url: String,
      verificado: Boolean,
      fechaVerificacion: Date
    },
    constanciaFiscal: {
      url: String,
      verificado: Boolean,
      fechaVerificacion: Date
    },
    constanciaComunitaria: {
      url: String,
      verificado: Boolean,
      fechaVerificacion: Date
    }
  },
  micrositio: {
    subdominio: String, // ej: "nahuatzen"
    url: String, // ej: "nahuatzen.plataforma.mx"
    activo: Boolean,
    fechaCreacion: Date
  },
  configuracion: {
    idiomaPrincipal: String,
    idiomasSecundarios: [String],
    coloresTema: {
      primario: String,
      secundario: String,
      acento: String
    },
    logo: String,
    imagenPortada: String
  },
  estado: "pendiente" | "activo" | "suspendido" | "eliminado",
  fechaRegistro: Date,
  fechaUltimaActualizacion: Date,
  metadatos: {
    creadoPor: ObjectId,
    modificadoPor: ObjectId,
    version: Number
  }
}
```

### 2. Colección: `productos`
```javascript
{
  _id: ObjectId,
  oferenteId: ObjectId,
  tipo: "producto" | "servicio" | "experiencia",
  nombre: String,
  descripcion: String,
  descripcionCorta: String,
  categoria: String,
  subcategoria: String,
  etiquetas: [String],
  precio: {
    monto: Number,
    moneda: "MXN",
    descuento: {
      porcentaje: Number,
      fechaInicio: Date,
      fechaFin: Date
    }
  },
  inventario: {
    cantidad: Number,
    disponible: Boolean,
    tipoInventario: "limitado" | "ilimitado" | "bajo_pedido"
  },
  imagenes: [{
    url: String,
    alt: String,
    orden: Number,
    principal: Boolean
  }],
  especificaciones: {
    dimensiones: {
      largo: Number,
      ancho: Number,
      alto: Number,
      peso: Number
    },
    materiales: [String],
    colores: [String],
    tecnicaElaboracion: String,
    tiempoElaboracion: String
  },
  seo: {
    titulo: String,
    descripcionMeta: String,
    palabrasClave: [String],
    slug: String
  },
  multiidioma: {
    es: {
      nombre: String,
      descripcion: String
    },
    en: {
      nombre: String,
      descripcion: String
    },
    maya: {
      nombre: String,
      descripcion: String
    }
  },
  estado: "borrador" | "activo" | "pausado" | "agotado",
  fechaCreacion: Date,
  fechaUltimaActualizacion: Date,
  estadisticas: {
    vistas: Number,
    ventas: Number,
    calificacionPromedio: Number,
    numeroReseñas: Number
  }
}
```

### 3. Colección: `usuarios`
```javascript
{
  _id: ObjectId,
  tipo: "comprador" | "administrador" | "moderador",
  datosPersonales: {
    nombre: String,
    apellidos: String,
    correo: String,
    telefono: String
  },
  autenticacion: {
    passwordHash: String,
    salt: String,
    ultimoAcceso: Date,
    intentosFallidos: Number,
    bloqueado: Boolean
  },
  direcciones: [{
    nombre: String,
    direccion: String,
    ciudad: String,
    estado: String,
    codigoPostal: String,
    pais: String,
    predeterminada: Boolean
  }],
  preferencias: {
    idioma: String,
    moneda: String,
    notificaciones: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    }
  },
  historialCompras: [{
    pedidoId: ObjectId,
    fecha: Date,
    total: Number
  }],
  wishlist: [ObjectId], // IDs de productos
  fechaRegistro: Date,
  estado: "activo" | "inactivo" | "suspendido"
}
```

### 4. Colección: `pedidos`
```javascript
{
  _id: ObjectId,
  numeroPedido: String, // Generado automáticamente
  compradorId: ObjectId,
  oferenteId: ObjectId,
  items: [{
    productoId: ObjectId,
    nombre: String,
    precio: Number,
    cantidad: Number,
    subtotal: Number,
    especificaciones: Object // Variaciones seleccionadas
  }],
  totales: {
    subtotal: Number,
    envio: Number,
    impuestos: Number,
    descuentos: Number,
    total: Number
  },
  direccionEnvio: {
    nombre: String,
    direccion: String,
    ciudad: String,
    estado: String,
    codigoPostal: String,
    telefono: String
  },
  pago: {
    metodo: "stripe" | "mercadopago" | "conekta",
    transaccionId: String,
    estado: "pendiente" | "completado" | "fallido" | "reembolsado",
    fechaPago: Date,
    comision: {
      plataforma: Number,
      pasarela: Number
    }
  },
  envio: {
    metodo: "autogestión" | "paqueteria" | "amazon" | "mercadolibre",
    paqueteria: String,
    numeroGuia: String,
    fechaEnvio: Date,
    fechaEntregaEstimada: Date,
    fechaEntregaReal: Date,
    estado: "preparando" | "enviado" | "en_transito" | "entregado" | "devuelto"
  },
  estado: "pendiente" | "confirmado" | "preparando" | "enviado" | "entregado" | "cancelado",
  fechaCreacion: Date,
  fechaUltimaActualizacion: Date,
  notas: String,
  historialEstados: [{
    estado: String,
    fecha: Date,
    comentario: String
  }]
}
```

### 5. Colección: `transacciones`
```javascript
{
  _id: ObjectId,
  pedidoId: ObjectId,
  oferenteId: ObjectId,
  tipo: "venta" | "comision" | "reembolso",
  monto: Number,
  moneda: String,
  pasarelaPago: {
    proveedor: String,
    transaccionId: String,
    comision: Number
  },
  distribucion: {
    oferente: Number,
    plataforma: Number,
    impuestos: Number
  },
  estado: "pendiente" | "procesado" | "completado" | "fallido",
  fechaTransaccion: Date,
  fechaLiberacion: Date, // Cuando se libera el pago al oferente
  metadatos: Object
}
```

### 6. Colección: `micrositios`
```javascript
{
  _id: ObjectId,
  oferenteId: ObjectId,
  configuracion: {
    subdominio: String,
    titulo: String,
    descripcion: String,
    logo: String,
    imagenPortada: String,
    colores: {
      primario: String,
      secundario: String,
      acento: String
    },
    fuentes: {
      principal: String,
      secundaria: String
    }
  },
  contenido: {
    sobreNosotros: String,
    historia: String,
    mision: String,
    vision: String,
    valores: [String],
    galeria: [{
      url: String,
      descripcion: String,
      orden: Number
    }]
  },
  secciones: {
    productos: Boolean,
    servicios: Boolean,
    galeria: Boolean,
    contacto: Boolean,
    testimonios: Boolean,
    blog: Boolean
  },
  seo: {
    titulo: String,
    descripcion: String,
    palabrasClave: [String],
    imagenCompartir: String
  },
  estadisticas: {
    visitas: Number,
    visitasUnicas: Number,
    tiempoPromedio: Number,
    tasaRebote: Number
  },
  estado: "activo" | "inactivo" | "mantenimiento",
  fechaCreacion: Date,
  fechaUltimaActualizacion: Date
}
```

### 7. Colección: `reseñas`
```javascript
{
  _id: ObjectId,
  productoId: ObjectId,
  oferenteId: ObjectId,
  usuarioId: ObjectId,
  pedidoId: ObjectId,
  calificacion: Number, // 1-5
  titulo: String,
  comentario: String,
  imagenes: [String],
  respuestaOferente: {
    comentario: String,
    fecha: Date
  },
  util: {
    likes: Number,
    dislikes: Number
  },
  verificada: Boolean, // Si es de una compra verificada
  estado: "pendiente" | "aprobada" | "rechazada",
  fechaCreacion: Date,
  fechaModeracion: Date
}
```

### 8. Colección: `categorias`
```javascript
{
  _id: ObjectId,
  nombre: String,
  slug: String,
  descripcion: String,
  icono: String,
  imagen: String,
  padre: ObjectId, // Para subcategorías
  nivel: Number,
  orden: Number,
  multiidioma: {
    es: { nombre: String, descripcion: String },
    en: { nombre: String, descripcion: String },
    maya: { nombre: String, descripcion: String }
  },
  activa: Boolean,
  fechaCreacion: Date
}
```

### 9. Colección: `configuracion`
```javascript
{
  _id: ObjectId,
  clave: String, // Identificador único de la configuración
  valor: Object, // Valor de la configuración
  tipo: "sistema" | "pago" | "envio" | "seo" | "email",
  descripcion: String,
  fechaUltimaModificacion: Date,
  modificadoPor: ObjectId
}
```

### 10. Colección: `logs`
```javascript
{
  _id: ObjectId,
  tipo: "acceso" | "transaccion" | "error" | "admin",
  usuarioId: ObjectId,
  accion: String,
  detalles: Object,
  ip: String,
  userAgent: String,
  fecha: Date,
  nivel: "info" | "warning" | "error" | "critical"
}
```

## Índices Recomendados

```javascript
// Oferentes
db.oferentes.createIndex({ "correo": 1 }, { unique: true })
db.oferentes.createIndex({ "rfc": 1 }, { unique: true })
db.oferentes.createIndex({ "micrositio.subdominio": 1 }, { unique: true })
db.oferentes.createIndex({ "estado": 1 })
db.oferentes.createIndex({ "ubicacion.estado": 1, "ubicacion.municipio": 1 })

// Productos
db.productos.createIndex({ "oferenteId": 1 })
db.productos.createIndex({ "categoria": 1, "subcategoria": 1 })
db.productos.createIndex({ "estado": 1 })
db.productos.createIndex({ "etiquetas": 1 })
db.productos.createIndex({ "precio.monto": 1 })
db.productos.createIndex({ "seo.slug": 1 }, { unique: true })

// Usuarios
db.usuarios.createIndex({ "datosPersonales.correo": 1 }, { unique: true })
db.usuarios.createIndex({ "tipo": 1 })

// Pedidos
db.pedidos.createIndex({ "compradorId": 1 })
db.pedidos.createIndex({ "oferenteId": 1 })
db.pedidos.createIndex({ "numeroPedido": 1 }, { unique: true })
db.pedidos.createIndex({ "estado": 1 })
db.pedidos.createIndex({ "fechaCreacion": -1 })

// Transacciones
db.transacciones.createIndex({ "oferenteId": 1 })
db.transacciones.createIndex({ "pedidoId": 1 })
db.transacciones.createIndex({ "estado": 1 })
db.transacciones.createIndex({ "fechaTransaccion": -1 })

// Micrositios
db.micrositios.createIndex({ "oferenteId": 1 }, { unique: true })
db.micrositios.createIndex({ "configuracion.subdominio": 1 }, { unique: true })

// Reseñas
db.reseñas.createIndex({ "productoId": 1 })
db.reseñas.createIndex({ "oferenteId": 1 })
db.reseñas.createIndex({ "usuarioId": 1 })
db.reseñas.createIndex({ "estado": 1 })

// Logs
db.logs.createIndex({ "fecha": -1 })
db.logs.createIndex({ "usuarioId": 1 })
db.logs.createIndex({ "tipo": 1 })
```
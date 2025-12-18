// Script para Cargar Datos de Ejemplo - MongoDB Atlas
const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://legmafer_db_user:ZQmLpt0YnguOlShf@cluster0.kp7b9yo.mongodb.net/?appName=Cluster0";
const dbName = "mexicoProfundo";

async function cargarDatosEjemplo() {
  let client;
  
  try {
    console.log('🚀 Conectando a MongoDB Atlas...');
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true
    });
    await client.connect();
    console.log('✅ Conectado exitosamente');
    
    const db = client.db(dbName);
    
    console.log('\n📦 Cargando datos de ejemplo...');
    
    // 1. Oferentes de ejemplo
    console.log('👥 Insertando oferentes...');
    
    const oferentes = [
      {
        tipoOferente: "artesano",
        datosPersonales: {
          nombreCompleto: "María Elena Pérez Hernández",
          nombreComercial: "Textiles Maya Elena",
          correo: "maria.textiles@email.com",
          telefono: "+52 999 123 4567",
          rfc: "PEHM850315ABC",
          curp: "PEHM850315MYCRRL01"
        },
        ubicacion: {
          estado: "Yucatán",
          municipio: "Valladolid",
          localidad: "Pisté",
          direccion: "Calle 15 #234, Centro",
          coordenadas: {
            type: "Point",
            coordinates: [-88.3034, 20.6843]
          }
        },
        datosBancarios: {
          banco: "BBVA",
          numeroCuenta: "encrypted_account_123",
          clabe: "encrypted_clabe_456",
          titular: "María Elena Pérez Hernández"
        },
        documentos: {
          ine: {
            url: "/uploads/docs/ine_maria.pdf",
            verificado: true,
            fechaVerificacion: new Date("2024-01-15")
          },
          constanciaFiscal: {
            url: "/uploads/docs/fiscal_maria.pdf",
            verificado: true,
            fechaVerificacion: new Date("2024-01-15")
          }
        },
        micrositio: {
          subdominio: "textiles-maya-elena",
          url: "textiles-maya-elena.mexicoprofundo.mx",
          activo: true,
          fechaCreacion: new Date("2024-01-15")
        },
        configuracion: {
          idiomaPrincipal: "es",
          idiomasSecundarios: ["maya", "en"],
          coloresTema: {
            primario: "#8B4513",
            secundario: "#D2691E",
            acento: "#FF6347"
          },
          logo: "/uploads/logos/textiles_elena_logo.png",
          imagenPortada: "/uploads/portadas/textiles_elena_portada.jpg"
        },
        estado: "activo",
        fechaRegistro: new Date("2024-01-15"),
        fechaUltimaActualizacion: new Date("2024-01-15")
      },
      {
        tipoOferente: "cooperativa",
        datosPersonales: {
          nombreCompleto: "Cooperativa Miel de Abeja Melipona",
          nombreComercial: "Miel Sagrada Maya",
          correo: "cooperativa.miel@email.com",
          telefono: "+52 997 234 5678",
          rfc: "CMM240101XYZ",
          curp: "CMM240101HDFXYZ01"
        },
        ubicacion: {
          estado: "Campeche",
          municipio: "Hopelchén",
          localidad: "Hopelchén",
          direccion: "Av. Principal s/n, Barrio San Antonio",
          coordenadas: {
            type: "Point",
            coordinates: [-89.8431, 19.7487]
          }
        },
        datosBancarios: {
          banco: "Banorte",
          numeroCuenta: "encrypted_account_789",
          clabe: "encrypted_clabe_012",
          titular: "Cooperativa Miel de Abeja Melipona S.C."
        },
        documentos: {
          ine: {
            url: "/uploads/docs/ine_cooperativa.pdf",
            verificado: true,
            fechaVerificacion: new Date("2024-02-01")
          },
          constanciaFiscal: {
            url: "/uploads/docs/fiscal_cooperativa.pdf",
            verificado: true,
            fechaVerificacion: new Date("2024-02-01")
          },
          constanciaComunitaria: {
            url: "/uploads/docs/comunitaria_cooperativa.pdf",
            verificado: true,
            fechaVerificacion: new Date("2024-02-01")
          }
        },
        micrositio: {
          subdominio: "miel-sagrada-maya",
          url: "miel-sagrada-maya.mexicoprofundo.mx",
          activo: true,
          fechaCreacion: new Date("2024-02-01")
        },
        configuracion: {
          idiomaPrincipal: "es",
          idiomasSecundarios: ["maya"],
          coloresTema: {
            primario: "#FFD700",
            secundario: "#FFA500",
            acento: "#FF8C00"
          },
          logo: "/uploads/logos/miel_maya_logo.png",
          imagenPortada: "/uploads/portadas/miel_maya_portada.jpg"
        },
        estado: "activo",
        fechaRegistro: new Date("2024-02-01"),
        fechaUltimaActualizacion: new Date("2024-02-01")
      },
      {
        tipoOferente: "comunidad",
        datosPersonales: {
          nombreCompleto: "Comunidad Artesanal Tulum",
          nombreComercial: "Cerámica Ancestral Tulum",
          correo: "ceramica.tulum@email.com",
          telefono: "+52 984 567 8901",
          rfc: "CAT240201DEF",
          curp: "CAT240201QROXYZ02"
        },
        ubicacion: {
          estado: "Quintana Roo",
          municipio: "Tulum",
          localidad: "Tulum Pueblo",
          direccion: "Calle Centauro Sur #45",
          coordenadas: {
            type: "Point",
            coordinates: [-87.4653, 20.2114]
          }
        },
        datosBancarios: {
          banco: "Santander",
          numeroCuenta: "encrypted_account_345",
          clabe: "encrypted_clabe_678",
          titular: "Comunidad Artesanal Tulum A.C."
        },
        documentos: {
          ine: {
            url: "/uploads/docs/ine_tulum.pdf",
            verificado: true,
            fechaVerificacion: new Date("2024-03-01")
          },
          constanciaFiscal: {
            url: "/uploads/docs/fiscal_tulum.pdf",
            verificado: true,
            fechaVerificacion: new Date("2024-03-01")
          },
          constanciaComunitaria: {
            url: "/uploads/docs/comunitaria_tulum.pdf",
            verificado: true,
            fechaVerificacion: new Date("2024-03-01")
          }
        },
        micrositio: {
          subdominio: "ceramica-ancestral-tulum",
          url: "ceramica-ancestral-tulum.mexicoprofundo.mx",
          activo: true,
          fechaCreacion: new Date("2024-03-01")
        },
        configuracion: {
          idiomaPrincipal: "es",
          idiomasSecundarios: ["maya", "en"],
          coloresTema: {
            primario: "#8B4513",
            secundario: "#CD853F",
            acento: "#D2691E"
          },
          logo: "/uploads/logos/ceramica_tulum_logo.png",
          imagenPortada: "/uploads/portadas/ceramica_tulum_portada.jpg"
        },
        estado: "activo",
        fechaRegistro: new Date("2024-03-01"),
        fechaUltimaActualizacion: new Date("2024-03-01")
      }
    ];
    
    const oferentesResult = await db.collection('oferentes').insertMany(oferentes);
    const oferentesIds = Object.values(oferentesResult.insertedIds);
    console.log(`  ✓ ${oferentesIds.length} oferentes insertados`);
    
    // 2. Productos de ejemplo
    console.log('🛍️ Insertando productos...');
    
    const productos = [
      {
        oferenteId: oferentesIds[0], // María Elena
        tipo: "producto",
        nombre: "Huipil Bordado a Mano Tradicional",
        descripcion: "Hermoso huipil tradicional maya bordado completamente a mano con hilos de colores vibrantes. Cada pieza es única y representa la tradición textil de Yucatán. El bordado incluye motivos florales y geométricos tradicionales que han sido transmitidos de generación en generación.",
        descripcionCorta: "Huipil maya bordado a mano con motivos tradicionales",
        categoria: "Artesanías",
        subcategoria: "Textiles",
        etiquetas: ["huipil", "maya", "bordado", "tradicional", "yucatan", "textil"],
        precio: {
          monto: 1200,
          moneda: "MXN",
          descuento: {
            porcentaje: 10,
            fechaInicio: new Date("2024-12-01"),
            fechaFin: new Date("2024-12-31")
          }
        },
        inventario: {
          cantidad: 5,
          disponible: true,
          tipoInventario: "limitado"
        },
        imagenes: [
          {
            url: "/uploads/productos/huipil_1_principal.jpg",
            alt: "Huipil bordado vista frontal",
            orden: 1,
            principal: true
          },
          {
            url: "/uploads/productos/huipil_1_detalle.jpg",
            alt: "Detalle del bordado",
            orden: 2,
            principal: false
          }
        ],
        especificaciones: {
          dimensiones: {
            largo: 90,
            ancho: 120,
            alto: 0,
            peso: 300
          },
          materiales: ["Algodón", "Hilo de algodón", "Hilo de seda"],
          colores: ["Blanco", "Rojo", "Azul", "Verde", "Amarillo"],
          tecnicaElaboracion: "Bordado a mano con punto de cruz y punto lleno",
          tiempoElaboracion: "3 semanas"
        },
        seo: {
          titulo: "Huipil Maya Bordado a Mano - Textiles Tradicionales Yucatecos",
          descripcionMeta: "Auténtico huipil maya bordado a mano con motivos tradicionales. Pieza única de la cultura textil yucateca.",
          palabrasClave: ["huipil maya", "bordado yucateco", "textil tradicional", "artesanía maya"],
          slug: "huipil-bordado-mano-tradicional"
        },
        multiidioma: {
          es: {
            nombre: "Huipil Bordado a Mano Tradicional",
            descripcion: "Hermoso huipil tradicional maya bordado completamente a mano con hilos de colores vibrantes."
          },
          en: {
            nombre: "Traditional Hand-Embroidered Huipil",
            descripcion: "Beautiful traditional Mayan huipil completely hand-embroidered with vibrant colored threads."
          },
          maya: {
            nombre: "Hipil ch'uy k'ab",
            descripcion: "Ki'imak hipil maya ch'uy k'ab yéetel bo'ol sak."
          }
        },
        estado: "activo",
        fechaCreacion: new Date("2024-01-20"),
        fechaUltimaActualizacion: new Date("2024-12-15"),
        estadisticas: {
          vistas: 156,
          ventas: 3,
          calificacionPromedio: 4.8,
          numeroReseñas: 3
        }
      },
      {
        oferenteId: oferentesIds[1], // Cooperativa Miel
        tipo: "producto",
        nombre: "Miel de Abeja Melipona Pura 250g",
        descripcion: "Miel pura de abeja melipona (Melipona beecheii), conocida como la abeja sagrada de los mayas. Esta miel tiene propiedades medicinales únicas y un sabor distintivo. Producida de manera sustentable por nuestra cooperativa en Campeche, siguiendo técnicas ancestrales de manejo de meliponarios.",
        descripcionCorta: "Miel pura de abeja melipona, la abeja sagrada maya",
        categoria: "Gastronomía",
        subcategoria: "Miel y Endulzantes",
        etiquetas: ["miel", "melipona", "maya", "natural", "medicinal", "campeche"],
        precio: {
          monto: 350,
          moneda: "MXN"
        },
        inventario: {
          cantidad: 50,
          disponible: true,
          tipoInventario: "limitado"
        },
        imagenes: [
          {
            url: "/uploads/productos/miel_melipona_frasco.jpg",
            alt: "Frasco de miel de melipona 250g",
            orden: 1,
            principal: true
          }
        ],
        especificaciones: {
          dimensiones: {
            largo: 8,
            ancho: 8,
            alto: 12,
            peso: 250
          },
          materiales: ["Miel 100% pura", "Frasco de vidrio"],
          colores: ["Ámbar claro"],
          tecnicaElaboracion: "Extracción tradicional sin calentamiento",
          tiempoElaboracion: "Proceso natural de 6 meses"
        },
        seo: {
          titulo: "Miel de Abeja Melipona Pura - Miel Sagrada Maya de Campeche",
          descripcionMeta: "Miel pura de abeja melipona, la abeja sagrada de los mayas. Propiedades medicinales únicas y sabor distintivo.",
          palabrasClave: ["miel melipona", "abeja sagrada maya", "miel medicinal", "campeche"],
          slug: "miel-abeja-melipona-pura-250g"
        },
        multiidioma: {
          es: {
            nombre: "Miel de Abeja Melipona Pura 250g",
            descripcion: "Miel pura de abeja melipona (Melipona beecheii), conocida como la abeja sagrada de los mayas."
          },
          en: {
            nombre: "Pure Melipona Bee Honey 250g",
            descripcion: "Pure melipona bee honey (Melipona beecheii), known as the sacred bee of the Mayans."
          },
          maya: {
            nombre: "Kaab melipona sak 250g",
            descripcion: "Kaab sak melipona (Melipona beecheii), u k'áat u yóok'ol maya."
          }
        },
        estado: "activo",
        fechaCreacion: new Date("2024-02-05"),
        fechaUltimaActualizacion: new Date("2024-12-15"),
        estadisticas: {
          vistas: 89,
          ventas: 12,
          calificacionPromedio: 4.9,
          numeroReseñas: 8
        }
      },
      {
        oferenteId: oferentesIds[2], // Comunidad Tulum
        tipo: "producto",
        nombre: "Vasija de Cerámica Maya Tradicional",
        descripcion: "Vasija de cerámica elaborada con técnicas ancestrales mayas. Cada pieza es moldeada a mano y decorada con motivos geométricos tradicionales. Cocida en horno de leña siguiendo los métodos de nuestros antepasados. Perfecta para decoración o uso ceremonial.",
        descripcionCorta: "Vasija de cerámica maya hecha a mano con técnicas ancestrales",
        categoria: "Artesanías",
        subcategoria: "Cerámica",
        etiquetas: ["cerámica", "maya", "vasija", "tradicional", "tulum", "ancestral"],
        precio: {
          monto: 450,
          moneda: "MXN"
        },
        inventario: {
          cantidad: 15,
          disponible: true,
          tipoInventario: "limitado"
        },
        imagenes: [
          {
            url: "/uploads/productos/vasija_ceramica_principal.jpg",
            alt: "Vasija de cerámica maya tradicional",
            orden: 1,
            principal: true
          }
        ],
        especificaciones: {
          dimensiones: {
            largo: 20,
            ancho: 20,
            alto: 25,
            peso: 800
          },
          materiales: ["Arcilla local", "Pigmentos naturales"],
          colores: ["Terracota", "Ocre", "Negro"],
          tecnicaElaboracion: "Moldeado a mano y cocción en horno de leña",
          tiempoElaboracion: "2 semanas"
        },
        seo: {
          titulo: "Vasija de Cerámica Maya Tradicional - Artesanía de Tulum",
          descripcionMeta: "Vasija de cerámica maya elaborada con técnicas ancestrales. Pieza única de la tradición alfarera de Tulum.",
          palabrasClave: ["cerámica maya", "vasija tradicional", "artesanía tulum", "alfarería ancestral"],
          slug: "vasija-ceramica-maya-tradicional"
        },
        multiidioma: {
          es: {
            nombre: "Vasija de Cerámica Maya Tradicional",
            descripcion: "Vasija de cerámica elaborada con técnicas ancestrales mayas."
          },
          en: {
            nombre: "Traditional Mayan Ceramic Vessel",
            descripcion: "Ceramic vessel crafted using ancestral Mayan techniques."
          },
          maya: {
            nombre: "Luum uch maya",
            descripcion: "Luum uch meyaj yéetel u yóok'ol maya."
          }
        },
        estado: "activo",
        fechaCreacion: new Date("2024-03-10"),
        fechaUltimaActualizacion: new Date("2024-12-15"),
        estadisticas: {
          vistas: 67,
          ventas: 5,
          calificacionPromedio: 4.6,
          numeroReseñas: 4
        }
      }
    ];
    
    const productosResult = await db.collection('productos').insertMany(productos);
    const productosIds = Object.values(productosResult.insertedIds);
    console.log(`  ✓ ${productosIds.length} productos insertados`);
    
    // 3. Usuarios compradores
    console.log('👤 Insertando usuarios compradores...');
    
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    
    const usuarios = [
      {
        tipo: "comprador",
        datosPersonales: {
          nombre: "Ana",
          apellidos: "García López",
          correo: "ana.garcia@email.com",
          telefono: "+52 55 1234 5678"
        },
        autenticacion: {
          passwordHash: await bcrypt.hash('password123', saltRounds),
          salt: "salt_ana",
          ultimoAcceso: new Date("2024-12-15"),
          intentosFallidos: 0,
          bloqueado: false
        },
        direcciones: [{
          nombre: "Casa",
          direccion: "Av. Insurgentes Sur 1234, Col. Del Valle",
          ciudad: "Ciudad de México",
          estado: "CDMX",
          codigoPostal: "03100",
          pais: "México",
          predeterminada: true
        }],
        preferencias: {
          idioma: "es",
          moneda: "MXN",
          notificaciones: {
            email: true,
            sms: false,
            push: true
          }
        },
        historialCompras: [],
        wishlist: [productosIds[0], productosIds[1]],
        fechaRegistro: new Date("2024-11-01"),
        estado: "activo"
      },
      {
        tipo: "comprador",
        datosPersonales: {
          nombre: "Carlos",
          apellidos: "Mendoza Rivera",
          correo: "carlos.mendoza@email.com",
          telefono: "+52 998 765 4321"
        },
        autenticacion: {
          passwordHash: await bcrypt.hash('password456', saltRounds),
          salt: "salt_carlos",
          ultimoAcceso: new Date("2024-12-14"),
          intentosFallidos: 0,
          bloqueado: false
        },
        direcciones: [{
          nombre: "Casa",
          direccion: "Calle 60 #123, Centro Histórico",
          ciudad: "Mérida",
          estado: "Yucatán",
          codigoPostal: "97000",
          pais: "México",
          predeterminada: true
        }],
        preferencias: {
          idioma: "es",
          moneda: "MXN",
          notificaciones: {
            email: true,
            sms: true,
            push: true
          }
        },
        historialCompras: [],
        wishlist: [productosIds[2]],
        fechaRegistro: new Date("2024-10-15"),
        estado: "activo"
      }
    ];
    
    const usuariosResult = await db.collection('usuarios').insertMany(usuarios);
    const usuariosIds = Object.values(usuariosResult.insertedIds);
    console.log(`  ✓ ${usuariosIds.length} usuarios compradores insertados`);
    
    // 4. Micrositios
    console.log('🌐 Insertando micrositios...');
    
    const micrositios = [
      {
        oferenteId: oferentesIds[0], // María Elena
        configuracion: {
          subdominio: "textiles-maya-elena",
          titulo: "Textiles Maya Elena - Bordados Tradicionales",
          descripcion: "Artesanías textiles mayas auténticas, bordadas a mano con técnicas ancestrales transmitidas de generación en generación.",
          logo: "/uploads/logos/textiles_elena_logo.png",
          imagenPortada: "/uploads/portadas/textiles_elena_portada.jpg",
          colores: {
            primario: "#8B4513",
            secundario: "#D2691E",
            acento: "#FF6347"
          },
          fuentes: {
            principal: "Montserrat",
            secundaria: "Open Sans"
          }
        },
        contenido: {
          sobreNosotros: "Soy María Elena, artesana maya de Pisté, Yucatán. Desde niña aprendí el arte del bordado de mi abuela y mi madre. Cada huipil que creo lleva consigo la historia y tradición de mi pueblo.",
          historia: "Nuestra familia ha preservado las técnicas de bordado maya por más de cuatro generaciones. Cada diseño tiene un significado especial y representa elementos de la naturaleza y la cosmovisión maya.",
          mision: "Preservar y compartir la belleza del arte textil maya, creando piezas únicas que honren nuestras tradiciones ancestrales.",
          vision: "Ser reconocida como una embajadora de la cultura textil maya, llevando nuestro arte a todo el mundo.",
          valores: ["Autenticidad", "Tradición", "Calidad", "Respeto cultural", "Sustentabilidad"]
        },
        secciones: {
          productos: true,
          servicios: false,
          galeria: true,
          contacto: true,
          testimonios: true,
          blog: false
        },
        seo: {
          titulo: "Textiles Maya Elena - Huipiles y Bordados Tradicionales Yucatecos",
          descripcion: "Artesanías textiles mayas auténticas de Yucatán. Huipiles bordados a mano con técnicas ancestrales.",
          palabrasClave: ["textiles maya", "huipiles yucatecos", "bordado tradicional", "artesanía maya"],
          imagenCompartir: "/uploads/seo/textiles_elena_share.jpg"
        },
        estadisticas: {
          visitas: 1250,
          visitasUnicas: 890,
          tiempoPromedio: 180,
          tasaRebote: 35
        },
        estado: "activo",
        fechaCreacion: new Date("2024-01-15"),
        fechaUltimaActualizacion: new Date("2024-12-15")
      },
      {
        oferenteId: oferentesIds[1], // Cooperativa Miel
        configuracion: {
          subdominio: "miel-sagrada-maya",
          titulo: "Miel Sagrada Maya - Cooperativa de Meliponicultores",
          descripcion: "Cooperativa dedicada a la producción sustentable de miel de abeja melipona, preservando las tradiciones mayas de meliponicultura.",
          logo: "/uploads/logos/miel_maya_logo.png",
          imagenPortada: "/uploads/portadas/miel_maya_portada.jpg",
          colores: {
            primario: "#FFD700",
            secundario: "#FFA500",
            acento: "#FF8C00"
          },
          fuentes: {
            principal: "Roboto",
            secundaria: "Lato"
          }
        },
        contenido: {
          sobreNosotros: "Somos una cooperativa de 25 familias mayas de Hopelchén, Campeche, dedicadas a la meliponicultura tradicional. Trabajamos con la abeja melipona, considerada sagrada por nuestros ancestros.",
          historia: "Nuestra cooperativa se formó en 2020 con el objetivo de rescatar y preservar la tradición maya de la meliponicultura, que estaba en riesgo de desaparecer.",
          mision: "Producir miel de melipona de la más alta calidad, preservando las técnicas ancestrales y promoviendo el desarrollo sustentable de nuestras comunidades.",
          vision: "Ser la cooperativa líder en producción de miel de melipona en la península de Yucatán, reconocida por su calidad y compromiso con la tradición maya.",
          valores: ["Tradición", "Sustentabilidad", "Cooperación", "Calidad", "Respeto por la naturaleza"]
        },
        secciones: {
          productos: true,
          servicios: true,
          galeria: true,
          contacto: true,
          testimonios: true,
          blog: true
        },
        seo: {
          titulo: "Miel Sagrada Maya - Cooperativa de Miel de Melipona Campeche",
          descripcion: "Cooperativa maya productora de miel de abeja melipona. Miel sagrada con propiedades medicinales únicas.",
          palabrasClave: ["miel melipona", "cooperativa maya", "miel sagrada", "campeche"],
          imagenCompartir: "/uploads/seo/miel_maya_share.jpg"
        },
        estadisticas: {
          visitas: 780,
          visitasUnicas: 620,
          tiempoPromedio: 210,
          tasaRebote: 28
        },
        estado: "activo",
        fechaCreacion: new Date("2024-02-01"),
        fechaUltimaActualizacion: new Date("2024-12-15")
      }
    ];
    
    const micrositiosResult = await db.collection('micrositios').insertMany(micrositios);
    console.log(`  ✓ ${micrositiosResult.insertedCount} micrositios insertados`);
    
    // 5. Reseñas de ejemplo
    console.log('⭐ Insertando reseñas...');
    
    const reseñas = [
      {
        productoId: productosIds[0], // Huipil
        oferenteId: oferentesIds[0],
        usuarioId: usuariosIds[1], // Carlos
        pedidoId: null,
        calificacion: 5,
        titulo: "Hermoso trabajo artesanal",
        comentario: "El huipil es absolutamente hermoso. La calidad del bordado es excepcional y se nota el cuidado y amor puesto en cada puntada. Definitivamente una pieza de arte que atesoraré.",
        imagenes: [],
        respuestaOferente: {
          comentario: "¡Muchas gracias por sus palabras! Me da mucha alegría saber que aprecia el trabajo artesanal. Cada huipil lleva parte de nuestra cultura maya.",
          fecha: new Date("2024-11-20")
        },
        util: {
          likes: 8,
          dislikes: 0
        },
        verificada: false,
        estado: "aprobada",
        fechaCreacion: new Date("2024-11-18"),
        fechaModeracion: new Date("2024-11-19")
      },
      {
        productoId: productosIds[1], // Miel
        oferenteId: oferentesIds[1],
        usuarioId: usuariosIds[0], // Ana
        pedidoId: null,
        calificacion: 5,
        titulo: "Miel deliciosa y auténtica",
        comentario: "La miel de melipona tiene un sabor único, muy diferente a la miel común. Se nota que es un producto artesanal de alta calidad. Excelente para uso medicinal también.",
        imagenes: [],
        respuestaOferente: {
          comentario: "Nos alegra mucho que haya disfrutado nuestra miel sagrada. Es el resultado del trabajo conjunto de toda nuestra cooperativa y el respeto por las tradiciones ancestrales.",
          fecha: new Date("2024-12-01")
        },
        util: {
          likes: 12,
          dislikes: 0
        },
        verificada: false,
        estado: "aprobada",
        fechaCreacion: new Date("2024-11-28"),
        fechaModeracion: new Date("2024-11-29")
      }
    ];
    
    const reseñasResult = await db.collection('reseñas').insertMany(reseñas);
    console.log(`  ✓ ${reseñasResult.insertedCount} reseñas insertadas`);
    
    // 6. Logs de actividad
    console.log('📝 Insertando logs de actividad...');
    
    const logs = [
      {
        tipo: "acceso",
        usuarioId: usuariosIds[0],
        accion: "login",
        detalles: {
          metodo: "email_password",
          exitoso: true
        },
        ip: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        fecha: new Date("2024-12-15T10:20:00Z"),
        nivel: "info"
      },
      {
        tipo: "admin",
        usuarioId: null,
        accion: "oferente_aprobado",
        detalles: {
          oferenteId: oferentesIds[0],
          nombreComercial: "Textiles Maya Elena"
        },
        ip: "10.0.0.1",
        userAgent: "Sistema Administrativo",
        fecha: new Date("2024-01-15T14:30:00Z"),
        nivel: "info"
      },
      {
        tipo: "sistema",
        usuarioId: null,
        accion: "datos_ejemplo_cargados",
        detalles: {
          oferentes: oferentesIds.length,
          productos: productosIds.length,
          usuarios: usuariosIds.length,
          fecha_carga: new Date()
        },
        ip: "127.0.0.1",
        userAgent: "Script de Carga de Datos",
        fecha: new Date(),
        nivel: "info"
      }
    ];
    
    const logsResult = await db.collection('logs').insertMany(logs);
    console.log(`  ✓ ${logsResult.insertedCount} logs insertados`);
    
    // 7. Mostrar resumen final
    console.log('\n📊 Resumen de datos cargados:');
    console.log(`  • Oferentes: ${oferentesIds.length}`);
    console.log(`  • Productos: ${productosIds.length}`);
    console.log(`  • Usuarios: ${usuariosIds.length}`);
    console.log(`  • Micrositios: ${micrositiosResult.insertedCount}`);
    console.log(`  • Reseñas: ${reseñasResult.insertedCount}`);
    console.log(`  • Logs: ${logsResult.insertedCount}`);
    
    console.log('\n🎉 ¡Datos de ejemplo cargados exitosamente!');
    
    // Mostrar algunos ejemplos de URLs de micrositios
    console.log('\n🌐 URLs de micrositios creados:');
    console.log('  • https://textiles-maya-elena.mexicoprofundo.mx');
    console.log('  • https://miel-sagrada-maya.mexicoprofundo.mx');
    console.log('  • https://ceramica-ancestral-tulum.mexicoprofundo.mx');
    
  } catch (error) {
    console.error('❌ Error cargando datos:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔒 Conexión cerrada');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  cargarDatosEjemplo()
    .then(() => {
      console.log('\n✅ Proceso completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en el proceso:', error);
      process.exit(1);
    });
}

module.exports = { cargarDatosEjemplo };
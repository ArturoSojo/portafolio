// GENERADO por /Users/macbook/.portafolio-research/gen.py — no editar a mano.
// Catálogo de proyectos del portafolio. Los tipos viven en data-projects.d.ts

export const projects = [
  {
    "slug": "refill-store",
    "name": "Refill Store",
    "tagline": "Recargas de juegos con Pago Móvil verificado contra el banco y entrega automática en segundos",
    "category": "Plataforma web de comercio y pagos",
    "year": "2026",
    "role": "Desarrollador full-stack (arquitectura, frontend, API, integraciones y despliegue)",
    "status": "En producción",
    "summary": [
      "Tienda web de recargas para Free Fire, Blood Strike, Mobile Legends, Honor of Kings y Marvel Rivals, pensada mobile-first para el mercado venezolano.",
      "El cliente elige el paquete, paga por Pago Móvil BDV o transferencia y pega la referencia: el backend la verifica contra el banco mediante la API de Pabilo y, si es válida, despacha la recarga con la API de Inefable sin intervención humana.",
      "Monorepo con dos mitades: una SPA en React 18 + Vite + TypeScript + Tailwind desplegada en Netlify, y una API Express sobre Cloud Functions v2 que guarda los secretos y escribe en Firestore con el Admin SDK.",
      "Incluye un panel de administración completo —órdenes, catálogo, usuarios, cupones, niveles de fidelidad, soporte, avisos y bitácora— además de cartera de saldo, referidos y códigos de creador.",
      "Alrededor de 30.800 líneas de TypeScript repartidas entre 32 pantallas enrutadas, 94 endpoints y 4 Cloud Functions."
    ],
    "problem": "Las recargas de juegos en Venezuela se venden por WhatsApp: el cliente manda una captura del Pago Móvil, alguien la revisa a ojo y hace la recarga a mano. Eso limita las ventas al horario del vendedor, deja la puerta abierta a comprobantes falsos o referencias reutilizadas y convierte cada pedido en una conversación. Además el monto en bolívares se mueve con la tasa: entre que el cliente ve el precio y transfiere, la cifra ya no coincide y la verificación falla.",
    "solution": "Automatizar el ciclo completo en una sola pantalla. Al crear la orden se congela el monto en bolívares y la tasa; el cliente pega la referencia y la API consulta el movimiento real en el banco a través de Pabilo (el campo is_new descarta referencias ya consumidas). Confirmado el pago, un servicio de despacho encadena las llamadas al proveedor con un external_order_id estable que evita cobros dobles, y para los productos manuales genera un enlace de WhatsApp con el mensaje precargado. Las claves de los proveedores nunca llegan al navegador: viven en Secret Manager y sólo las lee la Cloud Function.",
    "highlights": [
      {
        "title": "Verificación bancaria real, no capturas",
        "description": "La referencia se consulta contra el movimiento del banco vía Pabilo. Como su filtro de monto es exacto, si la consulta con importe no encuentra nada se repite sin él y es la tienda quien compara los montos redondeados a céntimos: pagar de menos se rechaza siempre, pagar de más se acepta y se abona al saldo.",
        "icon": "ShieldCheck"
      },
      {
        "title": "Despacho automático con idempotencia",
        "description": "Cada llamada al proveedor lleva un external_order_id de la forma {código de orden}-{n.º de llamada}: estable entre reintentos y distinto por cada parte de un combo. Un timeout no compra dos veces, y el reintento del panel sólo repite las llamadas que quedaron en error.",
        "icon": "Zap"
      },
      {
        "title": "Candado por referencia bancaria",
        "description": "Antes de llamar a Pabilo se toma un candado en paymentRefs/{referencia}. Sin él, dos peticiones simultáneas con la misma referencia verían ambas is_new: true y las dos órdenes se darían por pagadas. Si la verificación falla, el candado se libera.",
        "icon": "Lock"
      },
      {
        "title": "Panel de administración completo",
        "description": "17 pantallas de gestión: resumen con gráficos de ingresos y utilidad, órdenes con reintento y reembolso, CRUD de catálogo con recálculo de precios por margen, usuarios con cartera y libro de movimientos, cupones, niveles editables en caliente, soporte y bitácora de auditoría.",
        "icon": "LayoutDashboard"
      },
      {
        "title": "Paginación por cursor en todas las listas",
        "description": "Firestore cobra por documento leído y offset(n) cobra los n que se salta. Todas las listas del panel usan startAfter con el ID del documento como último criterio de desempate, para que dos registros del mismo segundo no se repitan ni desaparezcan entre páginas.",
        "icon": "Database"
      },
      {
        "title": "Saldo, referidos y niveles de fidelidad",
        "description": "Reembolsos y recompensas van a la cartera del cliente y se pueden gastar: el saldo se descuenta del total dentro de una transacción al crear la orden. Ocho niveles calculados por total gastado aplican un descuento creciente en cada recarga.",
        "icon": "Wallet2"
      }
    ],
    "features": [
      "Compra en una sola pantalla: juego, datos del jugador, paquete y barra fija de resumen",
      "Pago Móvil BDV y transferencia, ambos verificados por referencia",
      "Monto en bolívares y tasa congelados al crear la orden, con reloj de caducidad de 30 minutos",
      "Despacho automático de combos como secuencia de llamadas encadenadas",
      "Productos manuales entregados por WhatsApp con mensaje precargado",
      "Campos por juego configurables (ID de jugador, Zone ID, campos sensibles)",
      "Bandera validatesPlayerId por juego con confirmación obligatoria cuando el proveedor no valida el ID",
      "Cupones por porcentaje o monto fijo, con límite por usuario contado también por ID de jugador",
      "Cartera de saldo a favor con libro de movimientos y pago total o parcial con saldo",
      "Programa de referidos y códigos de creador con comisiones y pagos",
      "Ocho niveles de fidelidad con descuento por total gastado, editables desde el panel",
      "Cinta de actividad con las últimas recargas completadas y el nombre enmascarado",
      "Correos al cliente en tres momentos: pago verificado, recarga entregada y entrega fallida",
      "Avisos al equipo por tres canales independientes: bandeja del panel, Telegram y webhook",
      "Tasa Bs/USD manual o automática con refresco horario e historial",
      "Modo mantenimiento y interruptor de despacho automático",
      "Soporte con tickets y conversación, tanto del lado del cliente como del panel",
      "Bitácora de auditoría con autor, fecha e IP de cada acción sensible",
      "Exportación de órdenes a CSV",
      "Subida de imágenes de catálogo con reescalado a 256 px y conversión a WebP en el navegador",
      "PWA instalable con manifiesto, iconos maskable y tema oscuro"
    ],
    "stack": [
      {
        "group": "Frontend",
        "items": [
          "React 18",
          "TypeScript",
          "Vite 6",
          "Tailwind CSS 3",
          "React Router 6",
          "TanStack Query 5",
          "Framer Motion 11",
          "Recharts 2",
          "lucide-react",
          "react-hot-toast",
          "clsx",
          "tailwind-merge"
        ]
      },
      {
        "group": "Backend",
        "items": [
          "Cloud Functions v2",
          "Express 4",
          "TypeScript",
          "firebase-admin 13",
          "firebase-functions 6",
          "Zod",
          "Nodemailer",
          "cors"
        ]
      },
      {
        "group": "Firebase",
        "items": [
          "Firestore",
          "Firebase Authentication",
          "Cloud Storage",
          "Secret Manager",
          "Cloud Scheduler",
          "Firebase Hosting"
        ]
      },
      {
        "group": "Integraciones",
        "items": [
          "API Pabilo (verificación de Pago Móvil BDV)",
          "API Inefable (despacho de recargas)",
          "SMTP de Gmail",
          "Telegram Bot API",
          "Webhook saliente en JSON"
        ]
      },
      {
        "group": "Infraestructura y tooling",
        "items": [
          "Netlify (auto-deploy desde main con proxy /api/*)",
          "Firebase CLI y emuladores",
          "ESLint",
          "sharp (generación de la marca)",
          "Node 20"
        ]
      }
    ],
    "architecture": "Monorepo de dos mitades desplegadas por separado. El navegador carga la SPA de React desde Netlify y le habla siempre a rutas relativas /api/**; netlify.toml las reescribe con status 200 hacia la Cloud Function api, de modo que el navegador nunca ve la URL de Cloud Functions ni hace preflight de CORS (aunque la función sí valida el Origin, con patrones para los subdominios de vista previa). La función api es una única app Express que monta seis routers —public, orders, me, admin, setup y webhooks— sobre 94 endpoints, con middleware de autenticación por ID token de Firebase (con checkRevoked), rate limit respaldado en Firestore y un manejador central de errores. Debajo hay veinte servicios de dominio: orders, dispatch, pabilo, inefable, whatsapp, catalog, coupons, users, creators, rate, stats, audit, settings, notifications, email y compañía. Tres funciones programadas completan el sistema: expireOrders cada 5 minutos caduca órdenes impagas y limpia contadores, resolveDispatches cada 2 minutos es la red de seguridad para las recargas que el webhook del proveedor dejó sin cerrar, y refreshRate refresca la tasa Bs/USD cada hora. Los datos viven en 23 colecciones de Firestore (16 raíz y 7 subcolecciones) con reglas de cierre por defecto: el cliente lee sus propias órdenes en tiempo real y edita cuatro campos cosméticos de su perfil, pero precios, estados de pago, saldos y roles sólo los toca el backend. El rol viaja en los custom claims del token, no en el documento del usuario, para que no se pueda escalar privilegios escribiendo en Firestore. Las credenciales de Pabilo e Inefable están en Secret Manager y se montan por función.",
    "challenges": [
      {
        "problem": "El filtro de monto de Pabilo dejaba inservible la tolerancia: la API sólo devuelve el movimiento si el importe coincide exacto, así que un cliente que transfería 3.708,70 en vez de 3.708,60 recibía «no encontramos ese pago» antes de que la tienda pudiera comparar nada.",
        "solution": "Si la consulta con monto no encuentra el movimiento, se repite sin monto y es la tienda quien decide. Como sin ese filtro Pabilo devuelve el movimiento sea cual sea su importe, leer el monto real pasó a ser obligatorio en ese camino: si no se puede leer, se rechaza. La regla quedó de una sola dirección —pagar de menos se rechaza siempre, pagar de más se acepta sin límite y el excedente se registra— con los dos importes redondeados a céntimos para que 3708.5999999999995 no tumbe un pago exacto."
      },
      {
        "problem": "La documentación del proyecto describía mal la API de despacho: equivocaba la ruta y, sobre todo, el significado de product_id. Pedir un paquete sin él devolvía «Please insert Zone ID into input2», porque los package_id se repiten entre juegos y el proveedor emparejaba el paquete con otro juego.",
        "solution": "Se verificó contra la documentación oficial del proveedor: product_id es el game_id y package_id el paquete, sobre /api/v1/recharge. El éxito se decide por el booleano ok y nunca por la presencia de order_id, porque una recarga fallida también lo devuelve. La ruta quedó configurable por variable de entorno por si el proveedor la mueve."
      },
      {
        "problem": "Volver atrás con el botón del teléfono creaba órdenes duplicadas. location.state queda pegado a la entrada del historial, así que al regresar el checkout se montaba de nuevo, veía ahí los datos del jugador y creaba otra orden que se quedaba esperando pago hasta caducar. Llegaron a acumularse seis, de cinco clientes distintos.",
        "solution": "En cuanto se crea la orden, el checkout reemplaza su entrada del historial por la URL /comprar/{producto}?orden={id} y borra el state. Volver atrás retoma esa misma orden —mismo monto, misma tasa, mismos datos y el reloj original corriendo— o lleva a su detalle si ya se pagó, en lugar de crear nada."
      },
      {
        "problem": "«Un uso por usuario» en los cupones no protegía de nada: crear correos nuevos es gratis, así que quien estuviera dispuesto a registrarse varias veces podía recargar siempre el mismo personaje con el mismo cupón.",
        "solution": "El límite se aplica por dos caminos a la vez, la cuenta y el ID de jugador, con el conteo por ID acotado a su juego. Gastan uso las órdenes pagadas y las que todavía se pueden pagar; las canceladas y las caducadas no, porque antes abandonar un pago quemaba el cupón sin que nadie cobrara nada."
      },
      {
        "problem": "Cambiar Free Fire a la ruta del proveedor que sale entre un 3 % y un 5 % más barata tenía un coste oculto: ese juego es de tipo dynamic y deja de validar el ID del jugador —acepta cualquier número, responde «completada» y cobra igual—, y una recarga a un ID equivocado no se recupera.",
        "solution": "Cada juego lleva la bandera validatesPlayerId. Cuando está en false, la tienda muestra un aviso junto al formulario y exige confirmar los datos antes de crear la orden. Además hubo que renombrar el producto: el paquete de la ruta nueva entrega 2.160 diamantes donde el anterior daba 2.180, y prometer de más no es un detalle cosmético."
      },
      {
        "problem": "Tres cambios desplegados a Firebase Hosting y verificados «en producción» seguían sin verse: el cliente miraba Netlify, que es donde vive el frontend de verdad, y refill-e254f.web.app era un sitio sobrante del setup inicial que no usa nadie.",
        "solution": "Se documentó el reparto en el README y se fijó el flujo: cualquier cambio de web/ termina con git push origin main y se confirma el deploy con la API de Netlify; firebase deploy queda reservado para la API y las reglas. La verificación se hace siempre contra refill-store-ve.netlify.app."
      },
      {
        "problem": "Sin Java instalado no arranca el emulador de Firestore, y el puerto 5001 estaba ocupado por otro servidor de la máquina.",
        "solution": "Se separó el arranque en dos scripts: dev:api levanta sólo el emulador de Functions —que no necesita Java— y deja al Admin SDK escribir en el Firestore real con las credenciales del CLI, y dev:api:full levanta también Firestore y Auth para quien tenga un JDK. Los emuladores usan puertos poco comunes (5051, 8380, 9399, 5080, 4300) para no chocar con otros proyectos."
      }
    ],
    "metrics": [
      {
        "value": "32",
        "label": "pantallas enrutadas (15 tienda + 17 panel)"
      },
      {
        "value": "94",
        "label": "endpoints de la API Express"
      },
      {
        "value": "4",
        "label": "Cloud Functions desplegadas"
      },
      {
        "value": "23",
        "label": "colecciones de Firestore"
      },
      {
        "value": "20",
        "label": "servicios de dominio en el backend"
      },
      {
        "value": "5",
        "label": "juegos en el catálogo sembrado"
      },
      {
        "value": "53",
        "label": "productos en la siembra inicial"
      },
      {
        "value": "11",
        "label": "estados posibles de una orden"
      },
      {
        "value": "8",
        "label": "niveles de fidelidad"
      },
      {
        "value": "~30.800",
        "label": "líneas de TypeScript"
      }
    ],
    "brand": {
      "primary": "#F03030",
      "secondary": "#3018F0",
      "accent": "#5B8CFF",
      "bg": "#07070C",
      "surface": "#101019",
      "text": "#E2E8F0",
      "gradient": "linear-gradient(135deg, #F03030 0%, #FF6A5F 100%)",
      "mood": "Gamer nocturno: negro casi absoluto con rejilla HUD, rojo neón dominante muestreado del logotipo y azul eléctrico como acento secundario. Tipografía Space Grotesk para titulares y Outfit para el cuerpo, con cifras tabulares en los montos. Halos, destellos diagonales y líneas de escaneo sobre tarjetas con borde degradado.",
      "source": "/Users/macbook/refill-store/web/tailwind.config.js (bloques colors.neon, colors.base y backgroundImage.brand-gradient) y /Users/macbook/refill-store/web/src/styles/index.css; documentado en la sección «Paleta» del README"
    },
    "links": {
      "github": "https://github.com/ArturoSojo/refill-store",
      "web": "https://refill-store-ve.netlify.app"
    },
    "uiScreens": [
      {
        "name": "Portada — hero y selector de juegos",
        "describe": "Fondo #07070C con dos resplandores radiales fijos (rojo al 16 % arriba al centro, azul al 10 % arriba a la derecha). Arriba del todo, una cinta de actividad de 2 px de alto con borde superior e inferior gris azulado sobre #0A0A11: iconos de rayo verde esmeralda y líneas del tipo «Ana R. recargó 520 + 52 Diamantes · hace 3 min» desplazándose en marquesina infinita con máscara de desvanecido en los bordes. Debajo, el hero de 620 px con el banner de marca detrás y una rejilla HUD roja al 5,5 %: una píldora con borde rojo translúcido y punto verde parpadeante que dice «Entrega automática 24/7», y un titular enorme en Space Grotesk negra a dos líneas, «Recarga tus juegos» en blanco y «en segundos» en degradado rojo #F03030 → #FF6A5F con brillo de texto. Bajo el subtítulo, un botón alto de 56 px con ese mismo degradado y sombra de halo rojo («Recargar ahora» + flecha) junto a un chip oscuro con icono de cartera verde que muestra «Tasa del día» y la cifra en bolívares animada con contador ascendente. Más abajo, tres tarjetas oscuras con icono rojo en cuadrado redondeado: «Menos de 1 minuto», «Pago verificado», «Sube de nivel». Cierra una rejilla de dos columnas de tarjetas de juego de 176 px de alto con portada, barrido de luz vertical que la recorre, gradiente al negro hacia abajo, píldora «Instantáneo» arriba a la derecha, el nombre del juego en negrita y «12 paquetes · desde Bs 340,00», con un cuadro de chevron teñido del color propio del juego."
      },
      {
        "name": "Juego — ID, código y paquetes",
        "describe": "Cabecera fija de 56 px translúcida con blur: emblema de 36 px, «Refill» en blanco y «Store» en degradado rojo, chip «Tasa Bs 285,40» con punto verde, campana con globo rojo de no leídas y avatar circular. El cuerpo, centrado a 768 px, va en tres bloques numerados. Primero la portada del juego y sus datos; luego una tarjeta oscura de borde gris con los campos que pide el juego (ID de Jugador y, en Mobile Legends, también Zone ID), con los IDs guardados como chips seleccionables y papelera para borrarlos; si el juego lleva validatesPlayerId en false aparece un recuadro ámbar de advertencia y un interruptor obligatorio de confirmación. Después una tarjeta de código de cupón o creador, siempre abierta. Al final, «Elige tu paquete» con selector de vista y una rejilla de dos a cuatro columnas de tarjetas .neon-card: cada una muestra el icono de la moneda, la cantidad en cifra grande y negra, «+52 extra» en verde esmeralda debajo, el precio en bolívares con cifras tabulares y el precio en dólares en gris pequeño; las destacadas llevan cintas en la esquina superior derecha («POPULAR» en el color del juego, «Destacado» en ámbar) y la seleccionada gana borde y halo del color de acento, un check circular arriba a la izquierda y un destello diagonal que la recorre. En cuanto hay selección, sube desde abajo con muelle una barra fija de resumen sobre fondo #0A0A11 al 95 % con blur: nombre del paquete, total en bolívares en cifra grande, total en dólares y descuento en verde, selector de cantidad con − y +, y el botón degradado «Continuar»."
      },
      {
        "name": "Checkout — pantalla de pago",
        "describe": "Sobre la cabecera, un stepper de tres pasos: círculos de 28 px, «Tu ID» ya hecho en verde con check, «Pago» activo con el degradado rojo y halo, «Listo» apagado con borde gris; entre ellos, filas de 1 px que se tiñen de verde a medida que se avanza. Debajo, cuatro tarjetas apiladas en el orden en que el cliente actúa. La primera lleva borde degradado rojo→azul y está centrada: «Monto exacto a transferir» en versalitas grises, la cifra en bolívares enorme y tabular en blanco, y bajo ella el equivalente en dólares y la tasa; una píldora ámbar con reloj marca «Tiempo para pagar: 27:14» en cuenta regresiva, o una roja de «Orden expirada» al vencer. Si hubo pago parcial o saldo aplicado aparecen recuadros ámbar o verde explicándolo. La segunda ofrece dos botones grandes lado a lado, «Pago Móvil / Al teléfono» y «Transferencia / A la cuenta», el activo con borde rojo y fondo rojo al 10 %. La tercera, encabezada por un icono de banco en cuadrado rojo translúcido, lista los datos como filas copiables al tocarlas: Banco, Cédula, Teléfono o número de cuenta, y el Monto resaltado. La cuarta, con icono de recibo en verde, pide pegar la referencia en un campo numérico con pista bajo él, avisa de los intentos restantes en ámbar y remata con el botón ancho de degradado rojo «Ya pagué, verificar», que pasa a «Verificando con el banco…» con spinner. Al pie, un enlace fantasma para cancelar la orden."
      },
      {
        "name": "Resultado — recarga entregada",
        "describe": "Tarjeta central que entra con animación de muelle desde el 96 % de escala. Cuando la entrega fue correcta, en lugar de un icono genérico aparece el emblema de la marca a 88 px, que se agranda con rebote; el titular dice «¡Recarga entregada!» en blanco y debajo va la descripción del estado en gris. Una fila con dos píldoras: la insignia de estado en verde esmeralda y el código de la orden en cifras tabulares sobre fondo #0A0A11 con borde gris. Separada por una línea, una lista de definición con Producto, la etiqueta del identificador que pide ese juego con el ID en tabular, y lo pagado en bolívares. Las otras dos caras de la misma pantalla cambian el bloque superior: si el producto es manual y hay chat, un cuadrado verde con icono de mensaje y un botón grande de WhatsApp con el texto ya escrito; si la orden sigue en curso, un spinner rojo carmesí girando sobre cuadrado verde translúcido y el texto «Procesando tu recarga…», con acceso directo a soporte. Debajo, un campo opcional para etiquetar y guardar el ID de jugador recién usado."
      },
      {
        "name": "Panel — resumen del administrador",
        "describe": "Layout de panel con barra lateral y contenido sobre el mismo fondo casi negro. En la cabecera, «Resumen» en negrita y bajo él «Tasa actual: Bs 285,40 · automática»; a la derecha, un grupo de tres botones segmentados en una cápsula con borde gris —7 días, 30 días, 90 días— con el activo pintado del degradado rojo, y un botón cuadrado de refresco cuyo icono gira mientras carga. Si hay problemas, tiras de alerta enlazadas: rojas con borde al 30 % para «3 orden(es) pagadas con fallo de entrega» o credenciales de proveedor sin configurar, ámbar para productos manuales por gestionar y modo mantenimiento. Sigue una fila de cuatro StatCards en rejilla: Ingresos con icono de dólar en verde, Utilidad con flecha de tendencia en rojo de marca, Órdenes con recibo en azul y Usuarios con icono de personas en ámbar; cada una lleva el valor grande, una pista debajo (el equivalente en bolívares, el costo, «41 completadas · 78 %», «+12 nuevos») y una flecha de variación. Debajo, una tarjeta de 256 px con un área apilada de ingresos y utilidad —degradado vertical rojo desvaneciéndose y serie azul hielo #5B8CFF, elegida porque el azul del logotipo desaparece sobre el fondo— con rejilla cartesiana tenue y tooltip oscuro propio, ya que el de la librería viene en claro. Cierran un donut de reparto por juego con la paleta #F03030, #5B8CFF, #F59E0B, #22C55E, #A855F7 y un barras horizontal con el top de productos."
      }
    ],
    "visualConcept": "«Terminal de recarga»: la landing se presenta como una consola CRT encendida en un cíber a oscuras, con glitch RGB y líneas de barrido, pero teñida con la identidad real del proyecto —rojo neón #F03030 y azul eléctrico #3018F0 sobre negro #07070C— para que no se confunda con ninguna otra ficha del portafolio.\n\nFondo y textura: negro #07070C con una rejilla HUD de líneas rojas al 5 % cada 46 px, dos resplandores radiales fijos (rojo arriba al centro, azul arriba a la derecha) y, encima de todo, una capa de scanlines —repeating-linear-gradient de 3 px, negro al 22 % alternando con transparente— que se desplaza 3 px hacia abajo en bucle de 8 s. Sobre esa capa, un halo elíptico muy suave simula el abombamiento del tubo, con las esquinas ligeramente oscurecidas por una viñeta radial. Un parpadeo casi imperceptible de opacidad (0.97 → 1) cada 6 s da el zumbido del monitor.\n\nGlitch RGB: los titulares se pintan tres veces mediante ::before y ::after desplazados ±2 px con text-shadow rojo #F03030 y azul #5B8CFF. Cada 5 s se dispara una animación de 400 ms que desplaza esas capas hasta 6 px en horizontal y recorta franjas con clip-path, produciendo la aberración cromática típica de una señal mal sintonizada. El mismo tratamiento se aplica al emblema en el hero, con un desplazamiento menor. Todo el bloque de glitch y las scanlines se desactivan bajo prefers-reduced-motion, igual que ya hace el proyecto real.\n\nEstructura de secciones, cada una como un bloque de sesión de terminal con su prompt en JetBrains Mono verde apagado:\n1. «Boot» — el hero. Una línea de arranque se teclea sola con cursor de bloque parpadeante: `$ refill --recargar free-fire`, y bajo ella el nombre del proyecto en Space Grotesk enorme con glitch RGB y el tagline. A la derecha, una ventana de consola con barra de tres puntos que imprime línea a línea el flujo real: orden creada, monto congelado, referencia recibida, `pabilo.is_new = true`, `inefable → completada`. Cada línea entra con un teclado de 40 ms por carácter y su estado en color: ámbar mientras verifica, verde al confirmar.\n2. «Stack» — chips monoespaciados en rejilla, cada uno con borde 1 px rojo translúcido; al pasar el ratón, el chip hace un micro-glitch de 150 ms y su borde salta al azul.\n3. «Arquitectura» — diagrama ASCII/SVG del recorrido navegador → Netlify → Cloud Function → Pabilo / Inefable / Firestore, con las flechas dibujándose por stroke-dashoffset al entrar en pantalla y un pulso rojo que viaja por la ruta cada 4 s.\n4. «Métricas» — contadores tipo display de siete segmentos: los números suben desde cero al aparecer y, al llegar, tiemblan un frame con separación RGB.\n5. «Pantallas» — los mockups en marcos de teléfono cuyo cristal lleva las mismas scanlines y un reflejo diagonal; al enfocar uno, el resto baja a escala de grises al 40 %.\n6. «Retos» — pares problema/solución como bloques de log: la línea del problema en rojo #FF5A52 con prefijo `ERR`, la de la solución en verde con prefijo `FIX`, separadas por una regla punteada.\n7. Pie — un prompt final con cursor parpadeando y los enlaces a repositorio y sitio como comandos ejecutables.\n\nDetalles de movimiento: los enlaces y botones usan un degradado rojo #F03030 → #FF6A5F con sombra de halo, y al pulsarlos se hunden un 2 %. Las transiciones entre secciones no son fundidos sino un barrido de una línea horizontal blanca de 1 px que cruza el bloque de arriba abajo en 350 ms, como el refresco de una pantalla vieja.",
    "statusShort": "En producción",
    "categoryShort": "Fintech",
    "media": [
      {
        "src": "/proyectos/refill-store/emblem-512.png",
        "kind": "logo",
        "caption": "Emblema de Refill Store con transparencia: cara con audífonos y lentes de gamepad en rojo neón"
      },
      {
        "src": "/proyectos/refill-store/wordmark-640.png",
        "kind": "logo",
        "caption": "Emblema y rótulo «REFILL STORE», la versión que se usa en el login y el pie de página"
      },
      {
        "src": "/proyectos/refill-store/app-icon-512.png",
        "kind": "icon",
        "caption": "Icono de aplicación 512 px del manifiesto PWA"
      },
      {
        "src": "/proyectos/refill-store/hero-1920.webp",
        "kind": "image",
        "caption": "Banner del hero: rojo neón sobre circuito oscuro, servido en WebP de 1920 px"
      },
      {
        "src": "/proyectos/refill-store/hero-1600.jpg",
        "kind": "image",
        "caption": "Respaldo JPEG del banner del hero para navegadores sin WebP"
      },
      {
        "src": "/proyectos/refill-store/diamante-freefire.svg",
        "kind": "icon",
        "caption": "Icono SVG del diamante de Free Fire, la moneda que pinta cada tarjeta de paquete"
      },
      {
        "src": "/proyectos/refill-store/gold-bloodstrike.svg",
        "kind": "icon",
        "caption": "Icono SVG del Gold de Blood Strike"
      },
      {
        "src": "/proyectos/refill-store/pase-elite.svg",
        "kind": "icon",
        "caption": "Icono SVG de uno de los productos manuales (pase élite) del catálogo de categoría B"
      },
      {
        "src": "/proyectos/refill-store/refill-store-logo.png",
        "kind": "source",
        "caption": "Arte original del logotipo en alta resolución, fuente de la que se generan todas las versiones optimizadas"
      },
      {
        "src": "/proyectos/refill-store/hero-2.png",
        "kind": "source",
        "caption": "Arte original del banner (PNG de 2632 × 1606) del que salen las tres anchuras del hero"
      }
    ]
  },
  {
    "slug": "nebula",
    "name": "Nébula",
    "tagline": "Tu biblioteca personal inmersiva: importa tus EPUB y viaja.",
    "category": "App móvil de lectura · Flutter + Firebase",
    "year": "2026",
    "role": "Diseño de producto, arquitectura y desarrollo completo (app Flutter, Cloud Functions, panel web y panel Android)",
    "status": "v1.0.0 completa y probada en dispositivo; pendiente de publicación en tiendas",
    "summary": [
      "Nébula es un lector de ebooks offline-first para Android e iOS que no trae catálogo: el lector importa sus propios EPUB y la app los convierte en una biblioteca viva, con progreso, citas, resaltados y estadísticas que viven en el teléfono.",
      "Sobre ese lector se monta una capa de hábito completamente individual —estrellas, misiones, contratos de lectura, pase de temporada, constelaciones, cartas y diario— construida bajo una regla dura de producto: nada que requiera otros usuarios, chat ni comparación social.",
      "El ecosistema son tres superficies sobre un mismo proyecto Firebase: la app Flutter (158 archivos Dart, ~99.000 líneas), 26 Cloud Functions en Node 22 y dos paneles de administración, uno web en React y otro Android en Flutter.",
      "Está traducida a 39 idiomas con 1.929 claves por idioma y sostenida por 618 pruebas automatizadas repartidas en 68 archivos, varias de ellas escritas expresamente para fijar agujeros de economía encontrados en revisiones adversariales."
    ],
    "problem": "Las apps de lectura serias son tiendas: viven de venderte su catálogo, atan tus libros a su cuenta y necesitan conexión para casi todo. Quien ya tiene sus EPUB —comprados sin DRM o de dominio público— se queda con lectores austeros que ni recuerdan el progreso decentemente, ni funcionan bien sin internet, ni ayudan a sostener el hábito. Y las que sí gamifican lo hacen empujando a competir con desconocidos, que es exactamente lo contrario de lo que busca alguien que lee para desconectar.",
    "solution": "Nébula invierte el modelo: el contenido lo pone el lector y la app pone todo lo demás. Un EPUB importado se convierte en texto plano que alimenta cuatro modos de consumo —lector paginado, lectura rápida RSVP, escucha por TTS y conversación con la IA Nova— y en la materia prima de la gamificación, porque de las palabras extraídas dependen el progreso, las estrellas y la rareza de las recompensas. Todo lo irremplazable se guarda en Hive dentro del teléfono; la red solo hace falta para lo que de verdad la necesita (la IA, la voz en la nube, la copia de seguridad y los avisos), y cada una de esas puertas degrada con elegancia cuando no hay internet.",
    "highlights": [
      {
        "title": "Offline-first de verdad",
        "description": "La biblioteca, el progreso, las citas, los resaltados, las estadísticas y toda la gamificación viven en 9 cajas de Hive dentro del teléfono. El modo de lectura rápida es offline duro: sus 8 ambientes visuales y sonoros van dentro del binario y no tiene un solo import de red.",
        "icon": "WifiOff"
      },
      {
        "title": "Cuatro formas de leer el mismo libro",
        "description": "Lector paginado con 8 temas, 10 tipografías —Atkinson Hyperlegible incluida para dislexia— y anclaje de resaltados por coordenadas del documento; lectura rápida RSVP palabra a palabra con letra pivote; escucha por TTS con sesión de medios; y Nova, la IA que resume, explica y responde sobre el libro abierto.",
        "icon": "BookOpen"
      },
      {
        "title": "Gamificación sin nadie más",
        "description": "76 cosméticos, 32 logros, misiones diarias y semanales, contratos de lectura con apuesta, pase de 50 niveles por temporada, un cielo de constelaciones donde cada libro terminado enciende una estrella y un diario. Ninguna función necesita otro usuario: compartir es exportar una imagen, nunca socializar dentro de la app.",
        "icon": "Sparkles"
      },
      {
        "title": "La clave nunca viaja en el APK",
        "description": "Nova empezó llamando a Gemini desde el móvil con la clave embebida. Se movió entera a la Cloud Function novaGenerate, que guarda la clave, elige el modelo y aplica techos por usuario y globales. Firestore está cerrado a cal y canto: las reglas deniegan todo a los clientes y solo entra el Admin SDK.",
        "icon": "ShieldCheck"
      },
      {
        "title": "39 idiomas con paridad verificada",
        "description": "1.929 claves por idioma, cargadas desde JSON sueltos para que añadir una lengua sea dejar caer un archivo. Una prueba recorre los catálogos reales y exige que cada clave derivada en código exista en todos los idiomas: es la que cazó cinco claves de Nova que se construían en tiempo de ejecución y se pintaban en crudo.",
        "icon": "Languages"
      },
      {
        "title": "Copia de seguridad que no se rinde",
        "description": "Auto Backup de Android estaba roto sin saberlo: sin reglas declaradas respaldaba 109 MB, superaba el límite de 25 MB y dejaba de respaldar en silencio. Ahora respalda los 28 KB que importan, y un archivo .nebula exportable —ZIP versionado con manifiesto— cubre el cambio de plataforma y los EPUB que la nube no puede llevarse.",
        "icon": "DatabaseBackup"
      }
    ],
    "features": [
      "Importación de EPUB desde el explorador de archivos o compartiendo desde otra app, con re-enlace de libros restaurados sin archivo que conserva progreso, citas y reseña",
      "Lector paginado con capítulos, marcadores, búsqueda con salto a página, justificado, márgenes, velo de atenuado propio y menú de selección pegado al texto",
      "Resaltados en 5 colores anclados a coordenadas del documento (párrafo + desplazamiento), inmunes al recálculo de paginación al cambiar letra o márgenes",
      "Lectura rápida RSVP a pantalla completa con letra pivote, fondo Ken Burns temático, partículas y audio ambiental en bucle con fundido entre capítulos",
      "Escucha por TTS del dispositivo con resaltado del párrafo actual, control de velocidad, temporizador de sueño y controles en la pantalla de bloqueo; voz en la nube opcional por minutos",
      "Nova, la IA lectora: chat sobre el libro, resumen, fichas de personajes, cuestionario y explicación de un fragmento seleccionado",
      "Biblioteca con búsqueda, orden, filtros por estado de lectura, favoritos y estanterías personalizadas con 24 temas ilustrados por Canvas",
      "Bóveda secreta con PIN: los libros ocultos no aparecen en ninguna superficie de la app fuera de la bóveda, ni siquiera en citas, resúmenes o contratos",
      "Economía de estrellas con multiplicador de racha, tope diario medido en minutos y una única puerta de concesión y gasto para evitar el farmeo",
      "Misiones diarias y semanales derivadas de sesiones reales, ruleta ponderada y cofres",
      "Contratos de lectura con apuesta de estrellas, escudo de racha, y modo enfoque cuyo cronómetro solo corre con la app en primer plano",
      "Pase de temporada de 50 niveles por bimestre con eventos temáticos por calendario",
      "Constelaciones: cada libro terminado se convierte en una estrella con posición estable por hash FNV-1a, agrupada en 8 constelaciones por género",
      "Nova como compañera offline de 20 niveles con observatorio, auras, nido y guardarropa por capas dibujado con Canvas",
      "Álbum de cartas por libro con rareza, jardín de 7 fases, insignias secretas, diario de lectura y resúmenes mensual y anual",
      "Tarjetas compartibles de 1080×1920 para citas, logros, progreso, pulso del libro y resumen del año",
      "Recordatorios locales de 5 tipos, sin FCM y sin internet, apagados de fábrica y con alarmas inexactas a propósito",
      "Widget de pantalla de inicio en Android que se repinta al volver a primer plano y compara el día guardado con el del sistema",
      "Copia de seguridad en la nube por lector, exportación manual a archivo .nebula y reglas de Auto Backup y exclusión de iCloud afinadas",
      "Membresía con doble vía: suscripción de tienda y pago manual revisable desde el panel, con detección de doble cobro",
      "Panel web de administración de seis pantallas y panel Android gemelo, ambos hablando solo con las Cloud Functions"
    ],
    "stack": [
      {
        "group": "App móvil",
        "items": [
          "Flutter",
          "Dart 3.7",
          "GetX",
          "flutter_screenutil",
          "Hive",
          "shared_preferences",
          "path_provider"
        ]
      },
      {
        "group": "Lectura y contenido",
        "items": [
          "epub_pro",
          "html",
          "html_unescape",
          "file_picker",
          "archive",
          "flutter_tts",
          "just_audio",
          "audio_service",
          "audio_session",
          "wakelock_plus"
        ]
      },
      {
        "group": "Interfaz",
        "items": [
          "Material 3",
          "google_fonts (Sora, Space Mono)",
          "flutter_animate",
          "lottie",
          "percent_indicator",
          "fl_chart",
          "cached_network_image",
          "screenshot",
          "share_plus"
        ]
      },
      {
        "group": "Firebase y backend",
        "items": [
          "firebase_core",
          "firebase_auth",
          "firebase_analytics",
          "firebase_crashlytics",
          "firebase_messaging",
          "firebase_storage",
          "cloud_functions",
          "Cloud Functions Node 22",
          "firebase-admin",
          "google-auth-library",
          "Firestore"
        ]
      },
      {
        "group": "Identidad y monetización",
        "items": [
          "google_sign_in",
          "sign_in_with_apple",
          "google_mobile_ads",
          "in_app_purchase",
          "in_app_purchase_android",
          "crypto"
        ]
      },
      {
        "group": "Sistema y utilidades",
        "items": [
          "flutter_local_notifications",
          "timezone",
          "flutter_timezone",
          "home_widget",
          "connectivity_plus",
          "url_launcher",
          "package_info_plus",
          "intl",
          "uuid"
        ]
      },
      {
        "group": "Panel web (nebula-web)",
        "items": [
          "React 19",
          "TypeScript",
          "Vite",
          "Tailwind CSS",
          "TanStack React Query",
          "React Router",
          "Recharts",
          "three.js",
          "lucide-react",
          "date-fns",
          "oxlint",
          "Firebase Hosting"
        ]
      },
      {
        "group": "Panel Android (nebula-admin)",
        "items": [
          "Flutter",
          "Dart",
          "Cloud Functions callable"
        ]
      }
    ],
    "architecture": "Tres superficies sobre un único proyecto Firebase propio (nebula-e30fc). La app Flutter organiza sus 158 archivos Dart en core (tema, rutas, i18n, analítica, widgets), data (modelos Hive con adaptadores escritos a mano), features (una carpeta por módulo, 31 rutas nombradas registradas en main.dart) y services (unos 45 servicios de dominio inyectados con GetX). La persistencia es local por diseño: 9 cajas de Hive guardan libros, sesiones, citas, estanterías, resaltados, marcadores, contratos, diario y una caja meta cuyas claves llevan prefijo obligatorio por módulo (gm_, ct_, sp_, ev_, nv_, cl_, dy_, rn_). El servidor son 26 Cloud Functions en Node 22 repartidas en cuatro módulos —índice (Nova, voz en la nube, pagos manuales y membresías), panel, notificaciones push y correos— sobre 11 colecciones de Firestore. La decisión estructural del backend es que Firestore está cerrado a los clientes: las reglas deniegan todo y el único camino a los datos son las callables, que autorizan con Admin SDK; el panel web y el panel Android son, literalmente, pantallas sin privilegios propios. Nova y la voz en la nube pasan siempre por el servidor para que ninguna clave viaje en el binario, con cuota local en el móvil como pista de interfaz y el techo real aplicado en la función.",
    "challenges": [
      {
        "problem": "La clave de Gemini viajaba embebida en el APK. Un APK publicado lo descarga cualquiera, y esa clave estaba atada a una cuenta de facturación real: quien la extrajera podía gastar sin límite con cargo al dueño, y ninguna cuota en el móvil lo impide porque el atacante no pasa por el móvil.",
        "solution": "Nova se partió en dos: el servicio del móvil solo compone la petición y la Cloud Function novaGenerate guarda la clave, elige el modelo y aplica un techo por usuario y otro global diario. La API pública del servicio (chat, resumen, personajes, cuestionario, explicar) se mantuvo idéntica, así que ninguna pantalla se enteró del cambio."
      },
      {
        "problem": "Nova dejó de responder de golpe sin haber tocado nada: el modelo gemini-2.5-flash empezó a devolver 404 por ser un proyecto nuevo, y el campo thinkingConfig que se usaba para vaciar el razonamiento pasó a devolver 400. El modelo seguía apareciendo listado en la API pese a rechazar las peticiones.",
        "solution": "Se dejó de fijar un modelo por versión. Ahora hay una cascada de modelos encabezada por un alias que Google mantiene al día, y cada 404 o 400 lanza el reintento con el siguiente, probando cada modelo con y sin ajuste de razonamiento; el que funciona se cachea en memoria. La regla quedó escrita: nunca fijar una versión concreta de modelo en una app publicada."
      },
      {
        "problem": "Resaltar la palabra \"que\" teñía todas sus apariciones del libro. El primer intento —guardar los 40 caracteres previos como contexto— solo desambiguaba dentro de un párrafo, y como el pintado se aplica bloque a bloque, seguía marcando una aparición en cada párrafo que contuviera la palabra.",
        "solution": "Identificar un resaltado por su texto es ambiguo por definición. Se ancló a coordenadas del documento: índice de párrafo dentro del capítulo más desplazamiento en el párrafo, que no cambian nunca, mientras que la paginación sí se recalcula al tocar letra o márgenes. El controlador de paginación pasó a exponer bloques con esas coordenadas y los párrafos se normalizan siempre, no solo al partirlos."
      },
      {
        "problem": "Android Auto Backup venía activado y estaba roto en silencio: sin reglas declaradas respaldaba el directorio entero, 109 MB de los que unos 106 MB eran assets que ya viajan dentro del APK, se pasaba del límite duro de 25 MB y dejaba de respaldar absolutamente todo sin avisar.",
        "solution": "Se declararon reglas para las dos épocas de Android incluyendo solo lo irremplazable —28 KB de cajas Hive, portadas y preferencias— y excluyendo assets, EPUB y archivos de bloqueo. Verificado en dispositivo: la copia pasó de fallar a completar. Como Auto Backup no puede llevarse los EPUB ni cruzar de plataforma, se añadió además un archivo .nebula exportable y la re-vinculación de libros restaurados sin archivo conservando su identificador."
      },
      {
        "problem": "La capa de gamificación abría agujeros de economía difíciles de ver leyendo el código: firmar y cancelar un contrato inflaba el total histórico de estrellas y el rango, varios contratos idénticos resueltos por la misma sesión funcionaban como impresora, un doble toque en la tienda cobraba dos veces y el modo enfoque seguía pagando con el móvil bloqueado porque medía reloj de pared.",
        "solution": "Revisión adversarial por dimensiones —economía, persistencia, ciclo de vida, integración, interfaz e idiomas— lanzada en tandas pequeñas. De ahí salieron una devolución que repone saldo sin tocar el histórico, el rechazo de contratos equivalentes con tope de activos, un cerrojo de compra y un cronómetro que solo corre en primer plano. Cada agujero quedó fijado por una prueba propia dentro de las 618 del repositorio."
      },
      {
        "problem": "Un panel de administración protegido solo por el correo del dueño no cerraba nada: la clave web del proyecto viaja dentro del APK de los lectores por diseño de Firebase, así que cualquiera podía registrar una cuenta con ese correo mientras no existiera y pedir la verificación, que llega al buzón legítimo del dueño.",
        "solution": "La autorización exige tres condiciones a la vez en el servidor —correo del dueño, correo verificado y UID coincidente con el fijado en configuración— y falla cerrado si no hay administrador fijado. El UID es el que de verdad cierra la puerta. Ninguna contraseña vive en el binario, y hay una prueba en el repositorio que falla si alguna vez aparece un secreto."
      }
    ],
    "metrics": [
      {
        "value": "158",
        "label": "archivos Dart en la app"
      },
      {
        "value": "~99.200",
        "label": "líneas de Dart"
      },
      {
        "value": "31",
        "label": "rutas de pantalla registradas"
      },
      {
        "value": "26",
        "label": "Cloud Functions en Node 22"
      },
      {
        "value": "39",
        "label": "idiomas soportados"
      },
      {
        "value": "1.929",
        "label": "claves de traducción por idioma"
      },
      {
        "value": "618",
        "label": "pruebas automatizadas"
      },
      {
        "value": "11",
        "label": "colecciones de Firestore"
      },
      {
        "value": "76",
        "label": "cosméticos en la tienda"
      },
      {
        "value": "32",
        "label": "logros"
      },
      {
        "value": "24",
        "label": "temas de estantería dibujados con Canvas"
      },
      {
        "value": "3",
        "label": "superficies: app, panel web y panel Android"
      }
    ],
    "brand": {
      "primary": "#6C4DF4",
      "secondary": "#4D9FF4",
      "accent": "#22D3EE",
      "bg": "#0B0E1D",
      "surface": "#141A33",
      "text": "#F2F4FF",
      "gradient": "linear-gradient(135deg, #6C4DF4 0%, #4D9FF4 100%)",
      "mood": "Cósmico nocturno y editorial: azul de medianoche profundo, violeta de nebulosa y un cian eléctrico que solo se usa para lo que brilla de verdad. Tipografía Sora para leer y Space Mono para las cifras. Es oscuro siempre, a propósito, porque la app se usa de noche y con la cara pegada a la pantalla.",
      "source": "/Users/macbook/nebula/lib/core/theme/nebula_theme.dart (clase NebulaColors, paleta pineada) y /Users/macbook/nebula-web/tailwind.config.js (los mismos hex replicados en el panel web)"
    },
    "links": {},
    "uiScreens": [
      {
        "name": "Biblioteca (Home)",
        "describe": "Fondo #0B0E1D con un cielo estrellado sutil. Barra superior transparente sin sombra: a la izquierda el logotipo animado del búho (halo pulsante de 2,6 s, respiración de escala de 2,2 s y un destello periódico de 1,6 s, tres ritmos distintos para que parezca orgánico) junto al título «Nébula» en Sora 20 px peso 700 color #F2F4FF; a la derecha una lupa, un chip de racha con llama Lottie y un menú de tres puntos con Estanterías, Atlas, Diario, Bóveda, Tu viaje, Citas, Estadísticas y Ajustes. Debajo, una fila de chips de filtro con bordes redondeados: «Todos», «Leyendo», «Por leer», «Terminados»; el activo se rellena con el degradado violeta→azul y el resto queda en superficie #141A33 con borde blanco al 8%. Sigue la tarjeta «Tu semana lectora» sobre #141A33 con radio 20: a la izquierda un anillo de progreso de meta diaria en cian #22D3EE con los minutos en Space Mono en el centro, a la derecha dos chips con animación Lottie —llama para la racha en días y libro para los libros terminados. Luego la tira horizontal «Favoritos» con miniaturas de portada de 96×144 y un corazón en la esquina, y las secciones de estanterías, cada una con su cabecera pintada sobre un tema ilustrado a Canvas con el texto protegido por doble sombra. El cuerpo es la rejilla «Mis libros» de dos columnas: portada con esquinas redondeadas o, si no hay, un degradado determinista de dos tonos derivado del título, con el título en Sora 13 px a dos líneas y el autor en #9AA3C7 debajo, y una barra de progreso fina violeta al pie. Botón flotante extendido «Importar libro» con el degradado hero e icono de más. Si la biblioteca está vacía: el búho grande a 140 px, «Tu nebulosa está vacía» en Sora 20 px y debajo «Importa tu primer libro EPUB para empezar a viajar.» en #9AA3C7."
      },
      {
        "name": "Lectura Rápida (RSVP)",
        "describe": "Pantalla inmersiva a sangre completa, sin barras. Al fondo, una fotografía ambiental del género del libro con desplazamiento lento tipo Ken Burns, oscurecida por un velo negro degradado, y encima una capa de partículas flotantes (estrellas, polvo, luciérnagas o brasas, según el cosmético equipado). En el centro geométrico, una sola palabra en Space Mono peso 700 a un tamaño grande, blanca, con la letra pivote ORP tintada en el acento del tema —cian, ámbar o magenta según el ambiente— para que el ojo caiga siempre en el mismo punto: por ejemplo «des**c**ubrir». Una línea horizontal muy fina cruza la palabra por detrás como guía de fijación. Los controles aparecen y desaparecen con un deslizamiento vertical del 25% y un fundido de 300 ms: arriba a la izquierda una X para salir, arriba a la derecha píldoras de vidrio esmerilado con el silenciador de ambiente, la velocidad en palabras por minuto y la lista de capítulos. Abajo, dentro del área segura, dos barras de progreso de 3 px superpuestas —la del capítulo en el acento con halo, la del libro en blanco al 75%—, y bajo ellas una fila en Space Mono 10 px color blanco al 54% con «Capítulo 4 de 21» a la izquierda y «38% · Restante: 1 h 12 min» a la derecha. Cerrando el bloque, el título del libro centrado en Sora 13 px peso 800 blanco y el título del capítulo justo debajo en Sora 10,5 px blanco al 38%. Al terminar, un panel de vidrio se superpone con «¡Constelación completada!», la velocidad media y los minutos, y un botón de compartir."
      },
      {
        "name": "Lector",
        "describe": "Página de texto a pantalla casi completa sobre el tema elegido —ocho disponibles: oscuro, sepia, negro y cinco de socio como medianoche, bosque, pergamino, carbón y vino—, con el cuerpo en una de diez tipografías editoriales (Literata, Lora, Merriweather, Bitter, Spectral, Vollkorn, Garamond, Nunito, Sora y Atkinson Hyperlegible para dislexia), justificado opcional y márgenes regulables. La barra superior es mínima y translúcida: flecha de volver, título del capítulo truncado, icono de marcador que se rellena al pulsarlo, y un menú desplegable con capítulos, herramientas, modo enfoque y ajustes —se reorganizó así porque un icono más no cabía en 390 dp de ancho. Al seleccionar texto no aparece el menú del sistema sino un menú propio anclado a la selección: una tarjeta de vidrio oscuro con una primera fila de cinco círculos de color para resaltar y, debajo, «Guardar cita», «Preguntar a Nova» y «Copiar». Los resaltados se pintan como bloques de color translúcido detrás de las palabras exactas, recortados a la intersección con el bloque visible porque uno puede quedar partido entre dos páginas. Al pie, una barra fina con el porcentaje del libro y el tiempo restante estimado. Si está activo el modo enfoque, una píldora en la barra superior —nunca sobre el texto— muestra el cronómetro y las estrellas acumuladas."
      },
      {
        "name": "Constelaciones",
        "describe": "Un cielo personal a pantalla completa sobre #0B0E1D, navegable con arrastre y pellizco. El fondo es una lluvia de estrellas diminutas generadas con semilla fija, así que el cielo es idéntico en cada arranque. Encima, los libros terminados aparecen como estrellas de brillo variable —el radio depende de las palabras del libro— agrupadas en ocho constelaciones por género, cada una con nombre propio en Sora versalitas y color acento distinto: El Dragón para fantasía, La Lupa para misterio, La Brújula para aventura, La Pluma para clásicos. Las estrellas de un mismo grupo se unen con trazos finos violeta al 40%, y cada una lleva su etiqueta con el título en 10 px maquetada de antemano. Arriba flota una píldora de vidrio con «5 de 8 constelaciones» y un icono de ayuda; abajo, la pista «Toca una estrella para revivir su libro.» en #9AA3C7. Al tocar una estrella se abre una hoja inferior con la portada, el título, «Terminado el 14 de marzo», los minutos dedicados y la nota. Si no hay ningún libro terminado, el cielo queda oscuro con el mensaje «Tu cielo todavía está oscuro. Termina un libro y encenderás la primera estrella.» y un botón «Volver a leer»."
      },
      {
        "name": "Tu viaje (hub de gamificación)",
        "describe": "Pantalla de índice que agrupa los trece destinos de la capa de hábito, creada porque un menú de diecisiete líneas era inusable. Cabecera con el saldo de estrellas en Space Mono junto a un icono de estrella cian, y debajo una rejilla de tarjetas sobre #141A33 con radio 20 y borde blanco al 8%. Cada tarjeta lleva un icono propio dibujado a Canvas, un título en Sora 15 px peso 700 y un subtítulo dinámico con la cifra real —«Nivel 12» en el Observatorio, «3 en curso» en Compromiso, «18 de 40 cartas» en Colección, «14 conseguidos» en Insignias, «Quedan 23 días» en la Temporada. Las tarjetas todavía no desbloqueadas se pintan atenuadas con un candado y explican exactamente qué falta: «Termina tu primer libro», «Racha 4/7 días», «12 días más de historia». Los destinos son Tienda, Misiones, Constelaciones, Logros, Compromiso, Temporada, Observatorio, Colección, Jardín, Diario, Estadísticas, Resumen mensual y Tu año en Nébula. El degradado hero violeta→azul se reserva para la tarjeta destacada del día."
      },
      {
        "name": "Nova (la IA lectora)",
        "describe": "Conversación sobre el libro abierto. Arriba, el avatar del búho dibujado por capas con Canvas —cuerpo, vestuario, accesorio y aura, todo sobre un lienzo normalizado de 100×100— parpadeando en dos tiempos irregulares para que no se note el patrón, con su aura equipada girando detrás. Junto a él, el nivel de Nova y la cuota restante del día. El cuerpo es una lista de burbujas: las del lector alineadas a la derecha con el degradado violeta→azul y texto blanco; las de Nova a la izquierda sobre #141A33 con borde sutil y el texto en #F2F4FF con interlineado 1,5. Sobre el campo de entrada, una fila de chips de acción rápida: «Resumen», «Personajes», «Cuestionario», «Explicar esto». El campo de texto es una cápsula sobre superficie con el botón de enviar en cian. Cuando se agota la cuota diaria no aparece un error sino una hoja con las tres salidas reales: ver un vídeo, gastar estrellas o hacerse socio. Sin conexión, Nova lo dice con su propia voz en lugar de fallar."
      }
    ],
    "visualConcept": "«El libro nocturno». La landing se comporta como un ebook abierto de noche sobre un cielo profundo: el visitante no hace scroll por una web, pasa páginas. Fondo fijo #0B0E1D con un cielo de estrellas diminutas en canvas de baja opacidad y dos halos de nebulosa muy difusos —violeta #6C4DF4 arriba a la izquierda, azul #4D9FF4 abajo a la derecha— que se desplazan lentísimo con el ratón, nunca más de 20 px. Sobre él flota una hoja de papel oscuro (#141A33 con borde blanco al 8% y radio 24) que ocupa la columna central y hace de página. La estructura es una secuencia de secciones-página y cada transición es un giro real: la hoja actual rota en el eje Y con perspective 1400px y transform-origin en el lomo izquierdo, se oscurece hacia la mitad del giro como un papel que se pone de canto, y detrás aparece la siguiente ya asentada; el efecto se dispara por scroll con IntersectionObserver y también con las flechas del teclado, y en pantallas estrechas o con prefers-reduced-motion degrada a un fundido con desplazamiento de 24 px, sin rotación. La tipografía es la de la app y es la mitad del concepto: Sora para títulos y Space Mono para toda cifra, con un tratamiento deliberadamente editorial —capitulares de tres líneas en violeta al abrir cada sección, versalitas con letter-spacing amplio en los rótulos, columnas de medida cómoda de unos 62 caracteres, y un folio en la esquina inferior externa de cada página con el número en Space Mono y el nombre del capítulo, exactamente como el pie de un libro. Las páginas: (1) Portadilla —el logotipo del búho con su halo pulsante heredado de la app, el título «Nébula» a gran tamaño y el subtítulo «Tu biblioteca personal inmersiva»; una línea fina cian cruza bajo el título y se dibuja de izquierda a derecha al cargar. (2) El problema, maquetada como una cita de libro: párrafo grande con comillas volcadas al margen y la frase clave subrayada con un resaltado translúcido violeta que se pinta de izquierda a derecha al entrar en vista, guiño directo a los resaltados del lector. (3) Cuatro formas de leer —cuatro medias páginas que se pasan en horizontal dentro de la misma hoja, una por modo: lector, RSVP, escucha y Nova; la del RSVP muestra la palabra centrada en Space Mono con la letra pivote en cian animándose palabra a palabra sobre una miniatura de fondo ambiental real. (4) Sin internet —fondo que pierde saturación durante dos segundos mientras un icono de wifi se tacha, y la lista de lo que sigue funcionando aparece intacta; es la demostración del argumento en vez de su enunciado. (5) Constelación de cifras: las métricas no van en tarjetas sino como estrellas colocadas sobre el papel y unidas por trazos violeta que se dibujan con stroke-dashoffset; cada estrella brilla y revela su número en Space Mono con un contador que sube. (6) La arquitectura, un diagrama de tres superficies —app, funciones, paneles— con el candado de Firestore en el centro y las flechas animándose en bucle corto. (7) Los desafíos, como notas al pie del libro: bloques numerados con volada, problema en gris #9AA3C7 y solución en #F2F4FF, separados por filetes finos. (8) Colofón con la paleta expuesta en seis muestras y los créditos. El acento cian #22D3EE se reserva con disciplina para tres cosas y nada más: la letra pivote, los enlaces activos y el brillo de las estrellas de métricas; el degradado hero violeta→azul solo aparece en el botón principal de cada página. La diferencia con las demás landings del portafolio es estructural, no decorativa: aquí no hay rejilla de tarjetas ni scroll continuo, hay paginado con perspectiva, folios, capitulares y medida tipográfica de libro.",
    "statusShort": "Google Play",
    "categoryShort": "App móvil",
    "media": [
      {
        "src": "/proyectos/nebula/logo.png",
        "kind": "logo",
        "caption": "Logotipo de Nébula: la mascota, un búho galáctico leyendo sobre una luna creciente, recortado con fondo transparente. Se usa animado en la barra superior y en el estado vacío de la biblioteca."
      },
      {
        "src": "/proyectos/nebula/icon.png",
        "kind": "icon",
        "caption": "Icono maestro de la aplicación: un libro que se abre en nebulosa, origen de los iconos de lanzador de Android e iOS."
      },
      {
        "src": "/proyectos/nebula/ic_launcher.png",
        "kind": "icon",
        "caption": "Icono de lanzador de Android generado a máxima densidad."
      },
      {
        "src": "/proyectos/nebula/onboarding_1.png",
        "kind": "ilustracion",
        "caption": "Primera lámina del onboarding: una biblioteca que se deshace en nebulosa. Ilustración generada para el proyecto."
      },
      {
        "src": "/proyectos/nebula/onboarding_2.png",
        "kind": "ilustracion",
        "caption": "Segunda lámina del onboarding: un libro emitiendo ondas con una estrella fugaz cruzando; representa los modos de lectura rápida y escucha."
      },
      {
        "src": "/proyectos/nebula/onboarding_3.png",
        "kind": "ilustracion",
        "caption": "Tercera lámina del onboarding: una llama de racha junto a libros y el búho; representa el hábito y la gamificación."
      },
      {
        "src": "/proyectos/nebula/fantasy_1.jpg",
        "kind": "captura",
        "caption": "Fondo ambiental del modo Lectura Rápida, tema fantasía. Va dentro del binario: el modo RSVP no toca la red."
      },
      {
        "src": "/proyectos/nebula/scifi_1.jpg",
        "kind": "captura",
        "caption": "Fondo ambiental del modo Lectura Rápida, tema ciencia ficción. Uno de los 16 fondos comprables con estrellas."
      },
      {
        "src": "/proyectos/nebula/mystery_1.jpg",
        "kind": "captura",
        "caption": "Fondo ambiental del modo Lectura Rápida, tema misterio, con su pareja de audio ambiental en bucle."
      },
      {
        "src": "/proyectos/nebula/og.jpg",
        "kind": "captura",
        "caption": "Imagen social Open Graph de la web de Nébula: la identidad cósmica en formato apaisado."
      },
      {
        "src": "/proyectos/nebula/favicon.svg",
        "kind": "icon",
        "caption": "Favicon vectorial de la web y el panel, en la paleta cósmica."
      },
      {
        "src": "/proyectos/nebula/apple-touch-icon.png",
        "kind": "icon",
        "caption": "Icono de la web para pantalla de inicio en iOS."
      },
      {
        "src": "/proyectos/nebula/email-header.png",
        "kind": "ilustracion",
        "caption": "Cabecera gráfica de los correos transaccionales que envían las Cloud Functions (aprobación de pago, membresía, aviso de administrador)."
      }
    ]
  },
  {
    "slug": "eduletter",
    "name": "EduLetter",
    "tagline": "Biblioteca digital con lector EPUB propio, lectura rápida RSVP y un asistente de IA para leer más y mejor",
    "category": "App móvil de lectura + backend serverless + web",
    "year": "2025–2026",
    "role": "Desarrollo integral: producto, app Flutter, backend Firebase/Python, web Next.js, panel de administración y monetización",
    "status": "En producción — publicada en Google Play (com.artlex.eduletter_app, v2.1.13+5), web en Netlify y panel admin operativo; iteración activa",
    "summary": [
      "EduLetter es una app de lectura construida en Flutter (240 archivos Dart, ~72.000 líneas en lib/) sobre Firebase, con catálogo de libros, lector EPUB propio, narración por voz, modo de lectura rápida y un módulo de IA llamado EduGenius.",
      "El backend son 64 Cloud Functions en Python 3.11 (firebase-functions) que cubren catálogo público, búsqueda, descargas firmadas, suscripciones, créditos de narración, afiliados e IA, más 55 rutas de colección definidas en las reglas de Firestore.",
      "Alrededor del producto móvil hay un ecosistema completo: una web PWA en Next.js 14 (33 páginas, 79 componentes) que replica la lectura en navegador, un programa de influencers con atribución por Install Referrer y un panel de administración en Flutter con Riverpod para pagos y afiliados.",
      "Todo está bilingüe (español e inglés, 1.053 claves de traducción) y con ocho temas de aplicación más veinte ambientes visuales dedicados al modo de lectura rápida."
    ],
    "problem": "Las apps de lectura suelen resolver solo una pieza: o son un lector EPUB, o son un catálogo, o son un reproductor de audiolibros. El lector que quiere avanzar de verdad acaba repartido entre varias apps, pierde el progreso al cambiar de dispositivo, no tiene forma de leer sin conexión con control de derechos y no encuentra ningún apoyo real cuando un libro se le atraganta. A eso se suma el lado del negocio: sostener un catálogo con costes de almacenamiento, síntesis de voz e IA exige una monetización que funcione en mercados donde la tarjeta de crédito no es la norma.",
    "solution": "EduLetter unifica en una sola app las cuatro formas de consumir un libro —leer, escuchar con narración sintética, leer rápido en RSVP y estudiarlo con IA— sobre un mismo estado de progreso sincronizado en Firestore, de modo que la posición, la racha y los apuntes viajan entre móvil y web. El lector EPUB es propio (parseo con epub_pro, paginación HTML y animación de pase de página), las descargas offline pasan por concesiones firmadas con cuota por usuario, y EduGenius encapsula Gemini detrás de Cloud Functions con límites de uso para que la clave nunca viaje en el binario. La monetización combina anuncios de AdMob para el tramo gratuito con suscripción de Google Play, Stripe, Braintree/PayPal, criptomonedas vía NOWPayments y un flujo de pago manual revisado desde el panel de administración, lo que permite cobrar también donde no hay pasarela convencional.",
    "highlights": [
      {
        "title": "Lector EPUB construido desde cero",
        "description": "Parseo de EPUB con epub_pro, paginación del HTML con flutter_widget_from_html_core, índice de capítulos, buscador dentro del libro, resaltados y anotaciones, animación de pase de página con page_flip_builder y sonido propio. El progreso se guarda por libro y se reanuda desde la sección 'Continuar leyendo'.",
        "icon": "BookOpen"
      },
      {
        "title": "Lectura rápida RSVP con motor propio",
        "description": "Motor RSVP puro y testeable (sin dependencias de widgets) que tokeniza el capítulo y calcula la duración de cada palabra según longitud, puntuación y fin de párrafo, entre 100 y 800 palabras por minuto. Resalta la letra pivote (ORP) con el color del ambiente y mantiene la pantalla encendida durante la sesión.",
        "icon": "Zap"
      },
      {
        "title": "EduGenius: IA de lectura tras Cloud Functions",
        "description": "Nueve funciones callable en Python (chat, resumen, explicación, temas, personajes, predicciones, quiz, rutas de lectura, marcadores inteligentes) que llaman a Gemini con alias '-latest' y control de coste sobre el presupuesto de razonamiento, más límites de uso y contadores por usuario en Firestore.",
        "icon": "Sparkles"
      },
      {
        "title": "Narración por voz con créditos medidos",
        "description": "Síntesis con Google Cloud Text-to-Speech por fragmentos, cacheada en Cloud Storage y facturada contra un saldo de créditos en Firestore, con recarga mensual programada, tienda de créditos dentro de la app y reproducción en segundo plano con audio_service.",
        "icon": "Headphones"
      },
      {
        "title": "Monetización multicanal y programa de afiliados",
        "description": "AdMob (banner, intersticial, nativo, bonificado y App Open) con consentimiento UMP para el tramo gratuito; suscripción por Google Play Billing con verificación en servidor y RTDN; Stripe, Braintree/PayPal, criptomonedas con NOWPayments y pagos manuales aprobados desde el panel. Los influencers se atribuyen leyendo el Install Referrer de Play.",
        "icon": "CreditCard"
      },
      {
        "title": "Un ecosistema, no solo una app",
        "description": "La misma cuenta y el mismo progreso funcionan en la app Flutter, en una PWA Next.js 14 con next-intl y Tailwind, y en un panel de administración Flutter con Riverpod y fl_chart para revisar pagos manuales, afiliados y liquidaciones.",
        "icon": "LayoutDashboard"
      }
    ],
    "features": [
      "Catálogo de libros con portadas, autores, categorías, secciones configurables desde el backoffice y carrusel destacado en la portada",
      "Lector EPUB con capítulos, ajustes de tipografía, búsqueda interna, resaltados, anotaciones y citas compartibles",
      "Modo de lectura rápida (RSVP) de 100 a 800 ppm con letra pivote, veinte ambientes visuales y sonido ambiental",
      "Narración con voz sintética por fragmentos, control de velocidad y reproducción en segundo plano",
      "EduGenius: chat sobre el libro, resúmenes, explicaciones, análisis de personajes, quizzes, flashcards y rutas de lectura",
      "Descargas offline con concesiones firmadas, cuota por usuario y biblioteca local de EPUB y audio",
      "Racha de lectura diaria con recuperación, puntos, niveles y estadísticas de progreso",
      "Módulo social: chats, grupos, amistades, descubrimiento, eventos y retos de lectura entre usuarios",
      "Metas de lectura configurables y analíticas personales de páginas, tiempo y velocidad",
      "Suscripción premium con prueba de 7 días, muro gratuito de 70 páginas y 30.000 palabras en lectura rápida",
      "Panel interno dentro de la app para gestionar categorías, autores, libros, slider y notificaciones push",
      "Interfaz bilingüe español/inglés con ocho temas (claro, oscuro, rosado, azul pastel, naranja, púrpura, azul y vino oscuros)",
      "Notificaciones push segmentadas y campañas programadas (rachas, libros sin terminar, lectores dormidos)",
      "Panel de administración externo para pagos manuales, configuración de tasas, afiliados y liquidaciones",
      "PWA en Next.js con lectura EPUB en navegador, favoritos, citas, estadísticas y checkout de suscripción"
    ],
    "stack": [
      {
        "group": "App móvil",
        "items": [
          "Flutter (Dart SDK ^3.7)",
          "GetX",
          "flutter_screenutil",
          "flex_color_scheme",
          "google_fonts",
          "flutter_animate",
          "flutter_staggered_animations",
          "shimmer",
          "lottie",
          "smooth_page_indicator"
        ]
      },
      {
        "group": "Lectura y audio",
        "items": [
          "epub_pro",
          "page_flip_builder",
          "flutter_widget_from_html_core",
          "syncfusion_flutter_pdf",
          "pdfx",
          "flutter_pdfview",
          "flutter_tts",
          "just_audio",
          "audio_service",
          "audioplayers",
          "wakelock_plus"
        ]
      },
      {
        "group": "Firebase y datos",
        "items": [
          "firebase_core",
          "cloud_firestore",
          "firebase_auth",
          "firebase_storage",
          "cloud_functions",
          "firebase_messaging",
          "firebase_analytics",
          "firebase_crashlytics",
          "firebase_performance",
          "firebase_app_check",
          "hive",
          "sqflite",
          "get_storage",
          "shared_preferences"
        ]
      },
      {
        "group": "Backend serverless",
        "items": [
          "Python 3.11",
          "firebase-functions",
          "firebase-admin",
          "google-genai (Gemini)",
          "google-cloud-texttospeech",
          "google-cloud-storage",
          "google-api-python-client",
          "braintree",
          "requests"
        ]
      },
      {
        "group": "Monetización",
        "items": [
          "google_mobile_ads",
          "in_app_purchase",
          "in_app_purchase_android",
          "Google Play Billing",
          "Stripe",
          "Braintree / PayPal",
          "NOWPayments",
          "android_play_install_referrer",
          "facebook_app_events",
          "app_tracking_transparency"
        ]
      },
      {
        "group": "Web",
        "items": [
          "Next.js 14",
          "React 18",
          "TypeScript",
          "Tailwind CSS",
          "next-intl",
          "zustand",
          "lucide-react",
          "firebase-js",
          "firebase-admin",
          "idb",
          "jszip",
          "html2canvas",
          "Netlify"
        ]
      },
      {
        "group": "Panel de administración",
        "items": [
          "Flutter",
          "flutter_riverpod",
          "fl_chart",
          "cloud_functions",
          "firebase_auth",
          "firebase_messaging",
          "flutter_local_notifications"
        ]
      }
    ],
    "architecture": "Tres clientes contra un único backend Firebase (proyecto eduletter-10974). La app Flutter organiza lib/ por capas funcionales —view/ con 71 pantallas repartidas en 24 módulos, controller/ con 12 controladores GetX, services/ con 20 servicios, models/ con 22 modelos y ads/ aislando toda la lógica de AdMob—, y usa Hive y SharedPreferences como caché local con TTL para que el catálogo y el progreso funcionen sin conexión. El backend son 64 Cloud Functions en Python (34 callable, 20 HTTP para webhooks de Stripe, Braintree, NOWPayments y las notificaciones en tiempo real de Google Play, y 12 tareas programadas para barridos de suscripciones, recarga de créditos y campañas de reenganche), organizadas en módulos por dominio: catálogo público, búsqueda con tokens precalculados, descargas, suscripciones, pagos manuales, afiliados, TTS y EduGenius. Firestore define 55 rutas de colección en reglas, con la regla de negocio en el servidor: la app nunca escribe derechos de acceso ni saldos, solo los lee. Las claves sensibles (Gemini, pasarelas, credenciales de Play) viven como variables de entorno de Functions, y las llamadas callable pueden exigir App Check. La web Next.js consume las mismas funciones públicas y comparte los ficheros de idioma con la app mediante un script de sincronización; el panel de administración es un cliente Flutter que solo habla por Cloud Functions callable protegidas con un custom claim de administrador, sin acceso directo a Firestore.",
    "challenges": [
      {
        "problem": "Cargar el catálogo completo en memoria para pintar la sección de recientes provocaba cierres por falta de memoria: se traían miles de documentos de Firestore solo para localizar unos pocos libros.",
        "solution": "Se invirtió la consulta: primero se leen los identificadores recientes guardados en local, se recortan a los últimos 30 y se piden solo esos documentos por lote. La portada dejó de depender del tamaño del catálogo."
      },
      {
        "problem": "El texto blanco sobre el naranja de marca daba 2,91:1 de contraste, por debajo del mínimo legible, y al sol se perdía; cambiar el naranja habría roto la identidad ya presente en la app, la web y la ficha de Play.",
        "solution": "Se definió un color 'onBrand' casi negro (#1A0E0A) que sube el contraste a 6,50:1 sin tocar el naranja, y se propagó como token único a la app, a la web (variable CSS de marca) y al panel de administración."
      },
      {
        "problem": "El modo RSVP necesita cambiar de palabra a intervalos distintos —una palabra larga o el final de un párrafo deben durar más— y a 800 ppm cualquier animación por palabra tiraba los fotogramas.",
        "solution": "El motor usa un temporizador de un solo disparo que se rearma con la duración calculada de cada token en lugar de un temporizador periódico, y las transiciones de fundido y escala solo se aplican por debajo de 450 ppm; el resto del tiempo únicamente se notifica al widget de la palabra."
      },
      {
        "problem": "La síntesis de voz y las llamadas a Gemini se pagan por uso, así que un usuario podía disparar el coste del proyecto en una tarde.",
        "solution": "Todo pasa por el servidor: los fragmentos de audio se cachean en Cloud Storage por hash y se descuentan de un saldo de créditos en Firestore con recarga mensual programada, y EduGenius aplica límites de frecuencia por usuario, modelos 'lite' para las operaciones baratas y presupuesto de razonamiento apagado."
      },
      {
        "problem": "El identificador de la suscripción mensual estaba escrito a mano en cuatro archivos distintos y no coincidía con el configurado en Play Console, de modo que el plan mensual simplemente no cargaba en el paywall.",
        "solution": "Se auditaron y unificaron los identificadores de producto y de oferta en los cuatro puntos (servicio de facturación, pantalla de oferta, detalle de suscripción y 'mi suscripción'), y el texto del paywall pasó a leer el precio de introducción real que devuelve la tienda en lugar de estar escrito en la interfaz."
      },
      {
        "problem": "Buena parte del público objetivo no puede pagar con tarjeta ni tiene cuenta en una pasarela internacional.",
        "solution": "Se añadió un flujo de pago manual con referencia, bloqueos anti-duplicado, tasas de cambio actualizadas por tarea programada y aprobación desde el panel de administración, que concede el derecho premium por Cloud Function y lo revoca automáticamente al vencer."
      }
    ],
    "metrics": [
      {
        "value": "71",
        "label": "pantallas en la app Flutter"
      },
      {
        "value": "64",
        "label": "Cloud Functions en Python"
      },
      {
        "value": "55",
        "label": "rutas de colección en reglas de Firestore"
      },
      {
        "value": "33",
        "label": "páginas en la web Next.js"
      },
      {
        "value": "20",
        "label": "ambientes visuales de lectura rápida"
      },
      {
        "value": "8",
        "label": "temas de interfaz"
      },
      {
        "value": "2",
        "label": "idiomas (español e inglés)"
      },
      {
        "value": "1.053",
        "label": "claves de traducción"
      },
      {
        "value": "~72k",
        "label": "líneas de Dart en lib/"
      }
    ],
    "brand": {
      "primary": "#F46F4C",
      "secondary": "#B388FF",
      "accent": "#6C5CE7",
      "bg": "#0D0B14",
      "surface": "#17141F",
      "text": "#F6F4FA",
      "gradient": "linear-gradient(135deg, #F46F4C 0%, #B388FF 58%, #6C5CE7 100%)",
      "mood": "Biblioteca de noche. Fondo casi negro con matiz violeta, lomos de libro en naranja cálido que actúan como la única fuente de luz, y destellos morados y cian que aparecen cuando entra la lectura rápida o la IA. Cálido y ligeramente cinematográfico, nunca corporativo.",
      "source": "/Users/macbook/eduletter/lib/utils/color_category.dart (maximumOrange #F46F4C y onBrand #1A0E0A), /Users/macbook/eduletter/web/eduletterWeb/tailwind.config.ts + styles/globals.css (escala brand 50–900 y tokens CSS), /Users/macbook/eduletter-admin/lib/theme.dart (AppColors: brand #F46F4C, accent #B388FF, bg #0D0B14, surface #17141F, text #F6F4FA, muted #9C93B0), /Users/macbook/eduletter/lib/view/speed_read/speed_read_theme.dart (acentos de ambiente) y /Users/macbook/eduletter/lib/view/edugenius/edugenius_hub_screen.dart (#6C5CE7 → #00B8D4)"
    },
    "links": {
      "github": "https://github.com/ArturoSojo/eduletterweb",
      "web": "https://eduletterweb.netlify.app",
      "play": "https://play.google.com/store/apps/details?id=com.artlex.eduletter_app"
    },
    "uiScreens": [
      {
        "name": "Inicio (portada de la biblioteca)",
        "describe": "Pantalla con barra superior propia (saludo al usuario, buscador y acceso al perfil) y contenido en scroll con animación escalonada: cada bloque entra deslizándose desde abajo con fundido. De arriba abajo: carrusel de banners con indicadores circulares —el activo en naranja #F46F4C, los inactivos en gris #D6D8D8—; tarjeta de racha con degradado suave y borde de 1,5 px, emoji de llama, número grande de días y el rótulo 'Racha de Lectura', esquinas de 16 px; luego cuatro carriles horizontales de continuidad: 'Continuar Leyendo', lectura rápida, narración y escucha. Cada tarjeta de continuidad mide unos 150x210 px, esquinas de 22 px, portada del libro al fondo con velo oscuro, insignia superior redondeada ('Leyendo' o 'Terminado') y, abajo, título a dos líneas, autor en gris y una barra de progreso fina de 6 px con relleno naranja. Después vienen 'Destacados' y 'Populares' como rejillas de portadas con sombra suave, un anuncio nativo intercalado solo para cuentas no premium, secciones configurables desde el backoffice y un mosaico de categorías. En el fondo, barra de navegación flotante con seis destinos: Reciente, Categoría, Inicio, Social, Guardado y Cuenta; el icono activo se tinta de naranja. En claro el fondo es #F9F9F9 con tarjetas blancas; en oscuro, fondo #25303E con tarjetas #1A1A2E."
      },
      {
        "name": "Lector EPUB",
        "describe": "Lectura a pantalla casi completa. Barra superior fija de fondo blanco (o #1A1A2E en oscuro) con sombra de 6 px: botón de retroceso en un cuadrado redondeado de 40x40 px con fondo al 4 % de negro, título del libro en 15 sp seminegrita truncado con puntos suspensivos, y un menú de tres puntos que despliega capítulos, ajustes de lectura, buscar en el libro, narrador y descargar. Bajo la barra, una barra de progreso de solo 3 px de alto con relleno naranja #F46F4C sobre pista al 5 %. El cuerpo es el HTML del capítulo paginado, con tipografía ajustable y animación de pase de página al deslizar, acompañada de un efecto de sonido. Al tocar el centro aparece la barra inferior de controles: deslizador de posición con pista fina y pulgar de 7 px de radio, porcentaje leído, tiempo restante y accesos a resaltados y anotaciones. Para cuentas gratuitas, al pasar de 70 páginas acumuladas se superpone el diálogo premium. Abajo del todo, en no premium, se ancla un banner de AdMob."
      },
      {
        "name": "Lectura rápida (RSVP)",
        "describe": "Pantalla inmersiva sin barra de sistema. El fondo es un degradado vertical de tres paradas oscuras elegido por género —fantasía #150B2E → #2C1A5E → #0F2E3F, ciencia ficción #020B1C → #0A1F3C → #021826, romance #1A0714 → #3A1030 → #200A1C, y así hasta veinte ambientes— con partículas ambientales animadas (luciérnagas, estrellas, motas) flotando muy despacio. En el centro geométrico, una sola palabra en monoespaciada de 44 sp, peso 700 y espaciado de 1,5, blanca salvo la letra pivote (ORP), que se tinta con el acento del ambiente: violeta #B388FF en fantasía, cian #4FE3E3 en ciencia ficción, ámbar #FFD54F en aventura. Al pausar, la palabra anterior y la siguiente aparecen encima y debajo al 25 % de opacidad en 14 sp. Arriba, una fila con un chip translúcido que marca '320 ppm' y una equis para salir; al tocar el chip se despliega un panel con el rótulo 'Velocidad · 320 ppm' y un deslizador de 100 a 800. Abajo, controles de pausa, capítulo, sonido ambiental con deslizador de volumen desplegable y 'min restantes'. Al terminar el libro aparece la tarjeta de resumen: '¡Terminaste el libro! 🎉' sobre 'Una lectura espectacular. Estos son tus números:' y tres cifras —palabras leídas, tiempo de lectura y velocidad media— con botones 'Volver', 'Releer libro' y 'Reiniciar capítulo'."
      },
      {
        "name": "EduGenius Hub",
        "describe": "Fondo #F5F6FA en claro y #0D0D2B en oscuro. Cabecera colapsable con degradado diagonal de #6C5CE7 a #00B8D4, icono circular blanco translúcido, título 'EduGenius' y subtítulo 'Tu asistente de lectura inteligente ✨' en blanco; el botón de retroceso es blanco. Justo debajo, una tarjeta blanca (o #1A1A3E) elevada y con esquinas de 16 px que muestra tres estadísticas en fila, cada una con emoji, cifra grande y rótulo: '📚 12 Libros Leídos', '📄 340 Páginas', '🔥 7 Racha'. Sigue el título 'Funciones' y una lista de seis tarjetas de 72 px de alto; cada una lleva a la izquierda un cuadrado redondeado de 44 px relleno con su propio degradado y un icono blanco de 22 sp, y a la derecha título en seminegrita y subtítulo en gris: 'Habla con el librarian IA' (#6C5CE7 → #8E7CF7), 'Rutas de Lectura / Caminos curados por IA' (#00B894 → #55EFC4), 'Recomendaciones / Libros personalizados' (#F39C12 → #FDCB6E), 'Modo Estudio / Flashcards y quizzes' (#00B8D4 → #74D7EC), 'Analíticas de Lectura / Tu progreso' (#E17055 → #FAB1A0) y 'Marcadores Inteligentes / Marcadores con IA' (#A29BFE → #6C5CE7). Cierra un bloque 'Consejo del Día' con fondo del degradado morado-cian al 8 % de opacidad, borde al 15 %, icono en cápsula degradada y un texto rotatorio."
      },
      {
        "name": "Oferta Premium (paywall)",
        "describe": "Cabecera con el título 'Mejorar plan' y, bajo ella, un titular a gran tamaño relleno con un degradado de marca: 'Todo Eduletter Premium, en un solo plan'. Debajo, en gris, 'EduGenius sin límites, sin anuncios y lectura premium. El precio final lo confirma Google Play al pagar.'. El bloque protagonista es una tarjeta grande con degradado naranja de #FF6B35 a #E04000, esquinas muy redondeadas y sombra proyectada, que anuncia 'Prueba Premium 7 días por solo $1' con la línea de apoyo 'Acceso total: sin anuncios, lectura y narración ilimitadas. Cancela cuando quieras.' y una insignia de prueba; el texto va en un tono casi negro (#1A0E0A) en lugar de blanco para mantener el contraste legible sobre el naranja. Sigue una lista de cuatro beneficios con marca de verificación: 'Sin anuncios', 'Lectura ilimitada', 'Narración' y 'Lectura rápida ilimitada'. Al final, una nota legal pequeña en gris y un botón de ancho completo en naranja de marca que abre el checkout de Google Play."
      }
    ],
    "visualConcept": "«La estantería que se enciende». La landing se construye como una biblioteca viva vista de noche: fondo #0D0B14 con un matiz violeta muy leve y grano sutil, como una sala sin luz encendida. El elemento estructural de toda la página es una hilera de lomos de libro verticales —rectángulos altos de 34 a 56 px de ancho, esquinas de 3 px, separados por 4 px, con una fina línea de nervadura horizontal cerca de los extremos superior e inferior— que recorre la web y va cambiando de papel sección a sección. Los lomos parten apagados (#17141F sobre #0D0B14, casi invisibles) y se «encienden» al naranja de marca #F46F4C con un halo cálido (box-shadow de 0 0 28px rgba(244,111,76,.45)) según el usuario avanza.\n\nHéroe: la estantería ocupa el ancho completo detrás del titular. Al cargar, los lomos se encienden en cascada de izquierda a derecha con 40 ms de retraso entre uno y otro y una transición de 420 ms; los tres del centro quedan encendidos en permanencia y sostienen el icono de la app en su base. El titular se compone en Poppins (la tipografía real de la web) sobre esa cortina de lomos, y el subtítulo aparece con la animación 'fade-in' del propio proyecto (opacidad 0→1 y 8 px de subida). El cursor actúa como linterna: los lomos bajo el puntero suben su brillo con una máscara radial que sigue el ratón.\n\nMétricas: cada cifra (71 pantallas, 64 funciones, 55 colecciones, 33 páginas, 20 ambientes, 2 idiomas) se dibuja como un lomo más alto de la fila, con la cifra rotada 90 grados sobre el lomo como si fuera el título impreso; al entrar en viewport el lomo se ilumina y el número cuenta hasta su valor en 900 ms.\n\nFunciones: la estantería se abre. Un libro sale del estante —transform de traslación en X más rotateY, 500 ms con curva de salida— y se convierte en la tarjeta de la función, que hereda el degradado real del módulo correspondiente: morado→cian (#6C5CE7 → #00B8D4) para EduGenius, verde (#00B894 → #55EFC4) para rutas de lectura, ámbar (#F39C12 → #FDCB6E) para recomendaciones, coral (#E17055 → #FAB1A0) para analíticas. Al cerrar la tarjeta, el libro vuelve a su hueco.\n\nAmbientes de lectura rápida: banda a sangre con veinte lomos, uno por ambiente, cada uno pintado con el degradado y el acento reales de su tema (fantasía violeta #B388FF, ciencia ficción cian #4FE3E3, romance rosa #FF7BAC, aventura ámbar #FFB74D…). Al pasar el ratón, ese lomo se expande a una tarjeta vertical con su fondo degradado, sus partículas flotando y una palabra de muestra con la letra pivote tintada del acento — una demostración del RSVP en miniatura, con la palabra cambiando cada 200 ms.\n\nArquitectura: la estantería se voltea a horizontal y pasa a ser el diagrama. Los lomos se convierten en estantes-carril que representan las capas (clientes, Cloud Functions, Firestore, servicios externos), y pulsos de luz naranja viajan por ellos indicando el flujo de una petición; cada carril tiene su etiqueta a la izquierda en #9C93B0.\n\nRetos técnicos: presentados como pares de lomos enfrentados, el del problema apagado y gris (#2C2739) y el de la solución encendido en naranja, unidos por un filete luminoso que se dibuja al entrar en pantalla.\n\nCierre: la estantería completa se enciende de golpe con un fundido de 600 ms y el botón hacia Google Play queda como el único elemento sólido, en naranja #F46F4C con texto #1A0E0A —el mismo par de contraste que se usa en la app real—. Detalles transversales: tipografía Poppins, esquinas de 16 a 24 px, sombras suaves (0 8px 24px -8px rgba(0,0,0,.12)) y una regla firme, ningún blanco puro de fondo, la luz siempre viene de los lomos. Con la preferencia de movimiento reducido, todas las cascadas se sustituyen por un fundido simple y los lomos aparecen ya encendidos.",
    "statusShort": "Google Play",
    "categoryShort": "App móvil",
    "media": [
      {
        "src": "/proyectos/eduletter/icon.png",
        "kind": "icon",
        "caption": "Icono de la app: fondo azul pizarra, palabra 'eduletter' en blanco redondeado y un libro abierto de páginas naranjas debajo del texto"
      },
      {
        "src": "/proyectos/eduletter/splash_logo.png",
        "kind": "logo",
        "caption": "Logotipo de la pantalla de arranque, versión para tema claro"
      },
      {
        "src": "/proyectos/eduletter/dark_theme_splash_logo.png",
        "kind": "logo",
        "caption": "Logotipo de la pantalla de arranque, versión para tema oscuro"
      },
      {
        "src": "/proyectos/eduletter/logo_ebook.svg",
        "kind": "logo",
        "caption": "Marca gráfica del libro abierto en SVG, la usa también la web de influencers"
      },
      {
        "src": "/proyectos/eduletter/intro1st.png",
        "kind": "illustration",
        "caption": "Ilustración del onboarding: retrato recortado sobre un libro abierto naranja dentro de una cápsula rosa con cruces decorativas"
      },
      {
        "src": "/proyectos/eduletter/intro2nd.png",
        "kind": "illustration",
        "caption": "Segunda ilustración del onboarding, misma familia visual de cápsula y libro abierto"
      },
      {
        "src": "/proyectos/eduletter/intro3rd.png",
        "kind": "illustration",
        "caption": "Tercera ilustración del onboarding"
      },
      {
        "src": "/proyectos/eduletter/upgrade_plans_banner.png",
        "kind": "image",
        "caption": "Banner de la tarjeta de mejora a Premium dentro de la app"
      },
      {
        "src": "/proyectos/eduletter/bg_fantasy.jpg",
        "kind": "image",
        "caption": "Fondo vertical del ambiente 'fantasía' del modo de lectura rápida, usado en la landing de influencers"
      },
      {
        "src": "/proyectos/eduletter/bg_scifi.jpg",
        "kind": "image",
        "caption": "Fondo vertical del ambiente 'ciencia ficción' del modo de lectura rápida"
      },
      {
        "src": "/proyectos/eduletter/bg_classic.jpg",
        "kind": "image",
        "caption": "Fondo vertical del ambiente 'clásico' del modo de lectura rápida"
      },
      {
        "src": "/proyectos/eduletter/edugenius_alpha.webm",
        "kind": "video",
        "caption": "Animación con canal alfa del avatar de EduGenius (formato WebM para la web)"
      },
      {
        "src": "/proyectos/eduletter/Edugenius_Lottie_Animation_Generated.mp4",
        "kind": "video",
        "caption": "Animación de EduGenius en MP4 usada dentro de la app"
      },
      {
        "src": "/proyectos/eduletter/eduletter_tiktok_final.mp4",
        "kind": "video",
        "caption": "Anuncio vertical 1080x1920 montado para TikTok con voz en off, subtítulos y música"
      },
      {
        "src": "/proyectos/eduletter/EduLetter_TikTok_EN.mp4",
        "kind": "video",
        "caption": "Versión en inglés del anuncio vertical"
      }
    ]
  },
  {
    "slug": "vasvoy",
    "name": "VasVoy",
    "tagline": "Viajes y delivery para Higuerote, en una sola super-app",
    "category": "Movilidad y delivery · Super-app multi-rol",
    "year": "2026",
    "role": "Diseño de producto, arquitectura y desarrollo full-stack (Flutter + Firebase)",
    "status": "Fase 1 completa y backend desplegado; delivery y app de comercios implementados, pendiente prueba en dispositivo end-to-end",
    "summary": [
      "VasVoy (antes Brío) es una super-app de mototaxi, taxi y delivery pensada para Higuerote, en el municipio Brión del estado Miranda: un pueblo costero donde la movilidad se resuelve por WhatsApp y llamadas sueltas.",
      "Es un monorepo Flutter con cuatro aplicaciones que comparten dos paquetes internos: la app del cliente, la del conductor, el panel del comercio y el back-office administrativo, todas sobre el mismo proyecto Firebase.",
      "El modelo de negocio no toca el dinero del pasajero: VasVoy cobra comisiones prepagas descontadas de un saldo de créditos (12% al conductor sobre el viaje, 10% al comercio sobre los productos), lo que evita la intermediación de pagos y la cobranza posterior.",
      "Todo el sistema está localizado a la realidad venezolana: precios canónicos en dólares mostrados siempre en bolívares a la tasa BCV que se actualiza sola cada mañana, y recargas por Pago Móvil verificadas manualmente desde el panel de administración."
    ],
    "problem": "En Higuerote no existe una plataforma formal de transporte ni de delivery. Los mototaxis se coordinan por WhatsApp y llamadas, sin tarifa transparente, sin saber dónde viene el conductor, sin historial ni calificaciones, y con los datos personales de todos circulando en chats privados. Del otro lado, los comercios locales no tienen una forma de recibir pedidos ni un repartidor confiable, y cualquier solución tipo pasarela de pagos choca con la realidad venezolana: precios que se mueven a diario con la tasa del dólar, pagos por Pago Móvil que hay que verificar a mano y ninguna infraestructura de intermediación financiera disponible para un proyecto pequeño.",
    "solution": "Una super-app con cuatro roles bien separados sobre un mismo backend Firebase. El cliente fija origen y destino tocando el mapa, ve la tarifa calculada por kilómetros reales de la ruta, sigue a la moto en vivo y coordina por un chat efímero que se autodestruye al terminar el viaje. El conductor se registra con un flujo KYC con fotos, es aprobado por un administrador, recibe solo las carreras dentro de un radio de 8 km ordenadas por cercanía y opera con un saldo de créditos prepago. El comercio administra su carta, horarios y pedidos desde un panel propio. Y el administrador acredita recargas, aprueba conductores y comercios, y despacha deliveries desde una consola web. Las reglas de Firestore y Realtime Database, más diez Cloud Functions, sostienen las transiciones críticas: asignación atómica de carreras, cobro idempotente de comisiones y borrado automático de los chats.",
    "highlights": [
      {
        "title": "Seguimiento en vivo sobre Realtime Database",
        "description": "La posición del conductor se publica en `posiciones/higuerote/{uid}` con `onDisconnect`, y el cliente ve la moto avanzar con un pulso animado sobre el mapa mientras la ruta se traza con OSRM (con respaldo offline si el servicio no responde).",
        "icon": "Radar"
      },
      {
        "title": "Comisión prepaga que nunca falla dos veces",
        "description": "Las Cloud Functions `onCarreraCompletada` y `onDeliveryEntregado` descuentan la comisión dentro de una transacción que marca el pedido como cobrado. Como Cloud Functions entrega al menos una vez, sin esa marca una reentrega cobraba doble.",
        "icon": "Coins"
      },
      {
        "title": "Chat efímero conductor↔cliente",
        "description": "Mensajería sobre Realtime Database con tres capas de borrado (al entregar, al cancelar y una limpieza diaria a las 3 AM). Los mensajes son inmutables por reglas y el número de teléfono viaja solo en la metadata temporal que escribe el servidor.",
        "icon": "MessageCircle"
      },
      {
        "title": "Dólar canónico, bolívar visible",
        "description": "Todos los montos se guardan en USD y se muestran en Bs con la tasa oficial que una función programada trae cada día a las 8:00 de Caracas desde una API pública, con override manual desde el panel de administración.",
        "icon": "Banknote"
      },
      {
        "title": "KYC blindado por reglas",
        "description": "Los documentos de identidad viven en Storage bajo `kyc/{uid}` y la colección `usuarios` dejó de ser listable: los datos del conductor que ve el pasajero se congelan en el propio pedido desde el perfil real, escritos por una Cloud Function para impedir suplantación de Pago Móvil.",
        "icon": "ShieldCheck"
      },
      {
        "title": "Panel de comercios con máquina de estados propia",
        "description": "El delivery recorre pendiente → aceptado → en preparación → asignado → recogido → entregado, y el comercio marca «listo para recoger» como bandera independiente, para que el repartidor pueda ir en camino mientras la comida todavía se prepara.",
        "icon": "Store"
      }
    ],
    "features": [
      "Carreras con origen y destino libres: el cliente toca el mapa y la tarifa se calcula por kilómetros reales de la ruta (banderazo más costo por km, distinto para moto y carro)",
      "Geocodificación inversa con Nominatim para mostrar direcciones reales en vez de nombres de zona genéricos",
      "Motos cercanas en vivo en el mapa del cliente y filtro por radio de 8 km en el panel del conductor, ordenado por cercanía al punto de recogida",
      "Onboarding del conductor en wizard de cuatro pasos con KYC, vehículo, Pago Móvil y carga de documentos desde cámara o galería",
      "Cartera de créditos del conductor: saldo destacado, reporte de recarga por Pago Móvil e historial de movimientos",
      "Calificación por estrellas al terminar el viaje, promediada por una Cloud Function en el documento del conductor",
      "Catálogo de delivery con búsqueda, categorías, notas por producto, productos agotados y comercios cerrados atenuados con su motivo",
      "Selección de dirección de entrega con pin fijo sobre mapa móvil, referencia escrita y hasta seis direcciones guardadas por usuario",
      "Seguimiento del delivery con línea de cinco pasos, repartidor en vivo y detalle de compra con totales separados entre comercio y repartidor",
      "Pago de productos directo al comercio: efectivo o Pago Móvil con referencia reportada por el cliente y confirmada por el negocio",
      "Panel del comercio con cola de pedidos agrupada, alerta sonora al entrar uno nuevo, CRUD de carta con fotos, horarios por día y pestaña de créditos",
      "Back-office web con dashboard de indicadores, acreditación de recargas en transacción idempotente, aprobación de conductores y comercios, y despacho manual de deliveries",
      "Notificaciones push segmentadas: topic para conductores en carreras, token directo al comercio en deliveries y push por mensaje de chat con badge de no leídos",
      "Tema claro y oscuro conmutables desde ajustes en las cuatro apps, persistidos con SharedPreferences"
    ],
    "stack": [
      {
        "group": "Aplicaciones",
        "items": [
          "Flutter 3.35+",
          "Dart 3.10",
          "Material 3",
          "flutter_riverpod 2.6",
          "flutter_animate 4.5",
          "google_fonts (Nunito Sans)",
          "flutter_map 8.2",
          "latlong2",
          "geolocator 14",
          "image_picker 1.1",
          "url_launcher",
          "shared_preferences",
          "flutter_launcher_icons"
        ]
      },
      {
        "group": "Backend Firebase",
        "items": [
          "Cloud Firestore",
          "Firebase Realtime Database",
          "Firebase Auth (teléfono OTP y correo/contraseña)",
          "Cloud Functions v2 (TypeScript, Node 20)",
          "Firebase Cloud Messaging",
          "Firebase Storage",
          "Cloud Scheduler",
          "firebase-admin 13",
          "firebase-functions 6"
        ]
      },
      {
        "group": "Servicios externos",
        "items": [
          "OSRM (router.project-osrm.org) para rutas y ETA",
          "Nominatim / OpenStreetMap para geocodificación inversa",
          "OpenStreetMap tiles",
          "ve.dolarapi.com para la tasa oficial"
        ]
      },
      {
        "group": "Arquitectura del repositorio",
        "items": [
          "Monorepo Flutter con paquetes por path",
          "brio_core (modelos, repositorios y estado)",
          "brio_ui (tema, paleta, logo y widgets compartidos)",
          "Reglas de seguridad Firestore, Realtime Database y Storage versionadas"
        ]
      }
    ],
    "architecture": "Monorepo Flutter con dos paquetes internos y cuatro aplicaciones que dependen de ellos por path, sin ciclos: apps → brio_ui → brio_core. `brio_core` concentra siete modelos de dominio (Pedido, Comercio, Conductor, Producto, Usuario, Zona, MensajeChat), doce repositorios que exponen streams de Firestore y Realtime Database como providers de Riverpod, y las constantes de negocio; `brio_ui` define la paleta, los dos temas y los widgets compartidos, incluida la pantalla de chat. El estado es reactivo de punta a punta: las pantallas observan providers de Riverpod que envuelven snapshots en vivo, y no hay capa de caché intermedia. El backend son diez Cloud Functions v2 en TypeScript desplegadas en us-east1 (una en us-central1, porque los disparadores de Realtime Database deben correr en la región de la base): disparadores sobre documentos de pedido para notificar, congelar la base de la comisión y cobrarla, disparador de creación de mensaje para el push del chat, y tres tareas programadas que expiran pedidos cada cinco minutos, traen la tasa cada mañana y limpian los chats viejos cada madrugada. La autorización vive en las reglas: Firestore separa lo que puede escribir cada rol campo por campo con `hasOnly`, exige que el conductor esté aprobado y con saldo para tomar un pedido, y las reglas de Realtime Database validan cada hoja de mensaje para impedir suplantación. La asignación de una carrera es una transacción atómica que escribe solo estado, conductor y marca de tiempo, para que dos conductores no puedan tomar el mismo viaje.",
    "challenges": [
      {
        "problem": "La app tenía que soportar tema claro y oscuro, pero unas trescientas llamadas a colores neutros estaban repartidas por las pantallas como constantes.",
        "solution": "Los neutros de la paleta pasaron de constantes a getters que leen un modo global derivado de la preferencia del usuario y del brillo de la plataforma, de modo que todas las llamadas voltean sin editar una sola pantalla. El costo fue perder la constancia en tiempo de compilación: hubo que retirar unos ciento cincuenta `const` con un script consciente de paréntesis, y aprender la regla dura de no guardar nunca esos colores en `final`, porque Dart los evalúa una vez y el tema deja de reaccionar."
      },
      {
        "problem": "Cloud Functions garantiza entrega al menos una vez, así que una reentrega del disparador de entrega cobraba la comisión dos veces al mismo conductor.",
        "solution": "El cobro se movió dentro de una transacción que lee el pedido y el saldo juntos, marca el pedido como comisión cobrada y sale si ya lo estaba. La acreditación de recargas del administrador recibió el mismo tratamiento, más una regla que solo permite pasar una recarga de no verificada a verificada, nunca al revés."
      },
      {
        "problem": "El monto sobre el que se cobra la comisión al comercio venía calculado desde el cliente, así que el propio comercio podía reportar un total menor y pagar menos.",
        "solution": "Una función congela la base de la comisión releyendo los precios del catálogo real en Firestore, valida las cantidades y marca el pedido para revisión manual si algún producto no se pudo verificar. El cobro usa únicamente ese valor congelado y nunca recalcula desde lo que envió el cliente; el panel de administración muestra un indicador con los pedidos que quedaron marcados."
      },
      {
        "problem": "Los números escritos a mano en Venezuela usan punto como separador de miles y coma como decimal, y el parser ingenuo convertía «1.500» en 1,5 o «10.50» en 1050, con errores de cien veces en montos de recarga.",
        "solution": "Un único parser compartido decide por forma: un punto solo cuenta como separador de miles si lo siguen exactamente tres dígitos. Se cableó como fuente única en las cinco pantallas donde se escriben montos a mano, en lugar de dejar cada una con su propia interpretación."
      },
      {
        "problem": "El chat rompía la interfaz con un error de permisos cuando la metadata todavía no existía en Realtime Database, porque el stream entraba en error y el widget lo relanzaba al construirse.",
        "solution": "Se cambió la lectura del valor asíncrono por la variante tolerante a error y los streams del repositorio se reescribieron como generadores que se resuscriben a los tres segundos si la base deniega, emitiendo vacío mientras tanto. Así el chat se recupera solo en cuanto la función escribe la metadata, en vez de dejar la pantalla rota."
      },
      {
        "problem": "El bucket de Storage no tenía CORS, así que las fotos de KYC no cargaban en el panel web, que descarga los bytes por fetch.",
        "solution": "Se configuró CORS de solo lectura para GET en el bucket, seguro porque las URLs ya viajan con token, y se dejó el archivo de configuración versionado en el repositorio para poder reaplicarlo. Como red de seguridad, las imágenes del panel caen a un elemento HTML nativo si el fetch de bytes falla."
      }
    ],
    "metrics": [
      {
        "value": "4",
        "label": "Aplicaciones Flutter (cliente, conductor, comercio, admin)"
      },
      {
        "value": "42",
        "label": "Pantallas implementadas"
      },
      {
        "value": "10",
        "label": "Cloud Functions desplegadas"
      },
      {
        "value": "7",
        "label": "Colecciones Firestore"
      },
      {
        "value": "12",
        "label": "Repositorios en el paquete core"
      },
      {
        "value": "2",
        "label": "Paquetes compartidos del monorepo"
      },
      {
        "value": "27.7k",
        "label": "Líneas de Dart"
      }
    ],
    "brand": {
      "primary": "#2BB3A6",
      "secondary": "#2A8256",
      "accent": "#F6BB46",
      "bg": "#F6F8F9",
      "surface": "#FFFFFF",
      "text": "#4A5568",
      "gradient": "linear-gradient(135deg, #2BB3A6 0%, #187A98 100%)",
      "mood": "Caribe costero y luminoso: turquesa de agua clara, verde de palmera y dorado de arena al atardecer sobre neutros gris pizarra. Cercano y de pueblo, pero con acabado de app seria — tipografía Nunito Sans redondeada, tarjetas blancas de esquinas suaves y un único botón dorado de acción principal por pantalla.",
      "source": "/Users/macbook/brio/packages/brio_ui/lib/src/colors.dart (paleta oficial derivada del logo) y /Users/macbook/brio/packages/brio_ui/lib/src/theme.dart (temas claro/oscuro)"
    },
    "links": {},
    "uiScreens": [
      {
        "name": "Home del cliente — «¿A dónde vamos?»",
        "describe": "Fondo gris muy claro (#F6F8F9). Arriba, una cabecera de esquinas inferiores redondeadas (26 px) con degradado diagonal de turquesa #2BB3A6 a azul océano #187A98; en la esquina superior derecha el isotipo de la palmera al 16% de opacidad, sobresaliendo del borde. Dentro: un avatar cuadrado de 48 px con esquinas de 16 px en dorado #F6BB46 con las iniciales en gris pizarra, y al lado dos líneas — «¡Hola, buenas! 👋» en crema #CFE3E3 a 13 px, y el nombre del usuario en blanco, 19 px, peso 900. Debajo, una tarjeta blanca grande de 20 px de radio y padding 22, con sombra turquesa suave, que es el llamado principal «¿A dónde vamos?» y abre el mapa; entra con un fade y un ligero rebote de escala. Si hay un viaje en curso aparece bajo ella una tarjeta de estado. Luego, dos accesos cuadrados lado a lado con emoji grande: 🧭 «Mis viajes» y 🛍️ «Delivery». Más abajo, un rótulo «ÚLTIMO VIAJE» en gris azulado #718096, 13 px, peso 800 con leve letter-spacing, y la tarjeta del viaje anterior. Si hay carrito activo, una barra inferior fija muestra el emoji y nombre del comercio, número de artículos y subtotal en bolívares, con atajos «ver carta» y «vaciar»."
      },
      {
        "name": "Mapa del cliente — buscando conductor",
        "describe": "Pantalla ocupada casi por completo por un mapa de OpenStreetMap centrado en Higuerote, con un marcador turquesa para el origen y uno dorado para el destino, la polilínea de la ruta OSRM entre ambos y las motos cercanas dibujadas en vivo. Sobre el mapa, arriba, una pastilla blanca flotante con los minutos en turquesa a 15 px peso 800 y los kilómetros debajo en gris #718096 a 12 px. Abajo, una hoja inferior con degradado turquesa a océano, esquinas superiores muy redondeadas y un agarrador blanco al 40%: a la izquierda un radar animado de círculos concéntricos que se expanden, a la derecha el título «Buscando tu VasVoy…» en blanco 20 px peso 900 y el subtítulo «Conectando con motos cercanas en Higuerote» en blanco al 70%. Bajo eso, tres puntos blancos de 10 px que parpadean con 0, 200 y 400 ms de desfase, y a la derecha un botón de texto «Cancelar» en blanco al 70%. La hoja tiene tope de altura al 66% de la pantalla y hace scroll interno para que el mapa nunca se pierda."
      },
      {
        "name": "Panel del conductor — carreras cercanas",
        "describe": "Tema oscuro: fondo #0E1621, tarjetas #18222E, bordes #283544, texto #E8EDF2 y secundario #93A1B3. En la cabecera, un avatar circular de 46 px con degradado turquesa claro a turquesa y las iniciales en blanco; al lado «Hola, [nombre]» en 16 px peso 900 y debajo «Higuerote» en 12 px gris azulado; a la derecha, un chip de saldo con degradado dorado y el monto en bolívares junto a un ícono de billetera, que lleva a la cartera. Debajo, un interruptor grande de disponibilidad: cuando está activo se pinta con degradado verde bosque y proyecta un halo del mismo color; la perilla blanca se desliza con animación. Luego el rótulo «Carreras cercanas (N)» en turquesa claro, y la lista de tarjetas de pedido: cada una con acento turquesa para carrera o dorado para delivery, una insignia «DELIVERY» sobre fondo dorado al 18% cuando aplica, origen y destino, «A X km de ti» con ícono, y el enlace «Ver punto ›». El botón «Aceptar carrera» es un bloque dorado sólido con el texto en gris pizarra. Abajo, una barra de pestañas propia separada por una línea, con los íconos activos en turquesa claro y los inactivos en gris azulado."
      },
      {
        "name": "Seguimiento del delivery — cliente",
        "describe": "Mapa a pantalla completa con el comercio, la dirección de entrega y el repartidor moviéndose en vivo. Encima, una hoja arrastrable que el usuario puede subir y bajar, con agarrador centrado. Dentro, si el comercio ya marcó el pedido, un chip verde «Pedido listo» con ícono. El corazón de la hoja es una línea vertical de cinco pasos con conectores: «Confirmando» (recibo), «Preparando tu pedido» (cubiertos), «Buscando repartidor» (persona con lupa), «En camino» (moto) y «Entregado» (casa); los pasos cumplidos muestran un check sobre círculo turquesa relleno, el actual va resaltado y los futuros quedan en gris con el borde tenue. Debajo, una tarjeta con el repartidor y una fila de contacto con dos botones — Chat (con un punto rojo #E0574B superpuesto si hay mensajes sin leer) y Llamar. Sigue la tarjeta de pago: si eligió Pago Móvil, muestra banco, cédula y teléfono del comercio con botón de copiar en cada línea, el rótulo «MONTO A PAGAR» y el total en bolívares, más una nota que aclara que los productos se le pagan al comercio y el envío al repartidor. Cierra con el detalle de compra línea por línea («2× Hamburguesa») y los totales."
      },
      {
        "name": "Panel del comercio — cola de pedidos",
        "describe": "Aplicación web y Android con la misma paleta clara. Barra superior con el nombre del negocio, un chip de estado abierto/cerrado que se puede togglear al tacto y un chip de saldo que se pinta dorado cuando el crédito está bajo y rojo #E0574B cuando llega a cero, y que lleva a la pestaña de créditos. Al pie, una barra de navegación de cinco destinos: Pedidos (con insignia numérica de nuevos), Carta, Historial, Créditos y Ajustes. El cuerpo de Pedidos agrupa las tarjetas en tres bloques — Nuevos, En preparación y En reparto. Cada tarjeta abre con cabecera de hora y número, lista los artículos con cantidad, nombre y nota escrita por el cliente, muestra la dirección de entrega con su referencia, la nota de entrega, y los totales separados entre productos y envío. Si el cliente reportó un pago móvil, aparece una caja con la referencia y el botón «Confirmar que me llegó». Las acciones cambian según el estado: aceptar o rechazar cuando está pendiente, pasar a preparación, y marcar listo para recoger. Si el saldo de créditos no alcanza para la comisión estimada, el botón de aceptar se deshabilita y se muestra un aviso explicando que hay que recargar."
      }
    ],
    "visualConcept": "Un mapa costero vivo como hilo conductor de toda la landing. El héroe es un plano estilizado de Higuerote dibujado en SVG sobre un degradado diagonal de turquesa #2BB3A6 a azul océano #187A98: calles finas en blanco al 12%, la línea de costa marcada con dos olas superpuestas — una turquesa y una dorada, calcadas del logo — y manchas de verde bosque #2A8256 insinuando la vegetación. Sobre ese plano, una ruta discontinua blanca se dibuja sola al cargar (stroke-dasharray animando stroke-dashoffset, unos 2,2 s con easing suave) desde un pin turquesa de origen hasta un pin dorado #F6BB46 de destino; ambos pines laten con un halo concéntrico que se expande y se desvanece en bucle de 2 s, desfasados 400 ms entre sí, exactamente como el radar de «Buscando tu VasVoy…» dentro de la app. Un pequeño isotipo de moto recorre esa ruta con offset-path, se detiene un instante en el pin dorado, y entonces el pin cambia a un check verde: el viaje se completó y la ruta se reinicia. Cuando el usuario hace scroll, la sección de héroe no se va — se queda fija y el mapa se convierte en fondo permanente mientras las tarjetas de contenido pasan por encima, y la ruta va extendiéndose paso a paso: cada sección enciende un tramo nuevo y su pin correspondiente, de modo que el recorrido de la página es literalmente el recorrido de un viaje.\n\nLa estructura sigue esa metáfora. (1) Héroe: el mapa animado, el lockup de la palmera, el nombre VasVoy y la bajada «Viajes y Delivery — Higuerote», con el problema en una sola frase. (2) «El pueblo se mueve por WhatsApp»: el problema contado con tres tarjetas blancas de esquinas suaves que aparecen deslizándose desde abajo, escalonadas 120 ms. (3) «Cuatro apps, un mismo mapa»: los cuatro roles como cuatro pines sobre el plano — cliente, conductor, comercio y administración — que al pasar el cursor levantan una tarjeta con su captura y su cuenta de pantallas; el pin activo late más fuerte y los demás bajan a 40% de opacidad. (4) «Cómo viaja un pedido»: la máquina de estados real (pendiente → aceptado → en preparación → asignado → recogido → entregado) dibujada como paradas de la misma ruta, con la moto avanzando de una a otra al hacer scroll y cada parada explicando qué Cloud Function o qué regla la custodia. (5) «El dinero no pasa por aquí»: el modelo de comisión prepaga con tres columnas — 12% al conductor sobre el viaje, 10% al comercio sobre los productos, 0% de intermediación — sobre una banda de azul océano sólido que corta el mapa y da respiro visual. (6) Retos técnicos en acordeón, cada uno abriéndose con la altura animada y una línea dorada a la izquierda. (7) Stack en chips redondeados turquesa sobre blanco. (8) Cierre con la ola del logo a todo el ancho y el isotipo centrado.\n\nLo que la distingue del resto del portafolio: aquí el fondo nunca es plano — siempre hay un mapa detrás, con movimiento lento y continuo. La paleta es agua y palmera, no la típica de app de movilidad (negro y verde ácido). Y las animaciones son todas de recorrido, no de aparición: cosas que avanzan, laten y trazan camino. En modo oscuro el mapa vira al fondo #0E1621 con las calles en turquesa al 15% y los pines encendidos como luces, replicando el tema oscuro del panel del conductor.",
    "statusShort": "En desarrollo",
    "categoryShort": "Super-app",
    "media": [
      {
        "src": "/proyectos/vasvoy/logo_vasvoy.png",
        "kind": "logo",
        "caption": "Lockup completo de VasVoy: palmera con flecha en forma de V, ola y brújula sobre degradado turquesa-verde, con la bajada «Viajes y Delivery - Higuerote»"
      },
      {
        "src": "/proyectos/vasvoy/icon_vasvoy.png",
        "kind": "icon",
        "caption": "Marca sin letras — palmera, flecha V y ola; es el isotipo que se usa dentro de las apps"
      },
      {
        "src": "/proyectos/vasvoy/icon_master_1024.png",
        "kind": "icon",
        "caption": "Ícono maestro 1024 px con fondo arena opaco, fuente para los íconos de iOS y Android"
      },
      {
        "src": "/proyectos/vasvoy/icon_foreground.png",
        "kind": "icon",
        "caption": "Capa frontal transparente para el ícono adaptativo de Android"
      },
      {
        "src": "/proyectos/vasvoy/vasvoy_mark.png",
        "kind": "logo",
        "caption": "Isotipo empaquetado en brio_ui, renderizado por el widget BrioLogo en splash y cabeceras"
      },
      {
        "src": "/proyectos/vasvoy/vasvoy_lockup.png",
        "kind": "logo",
        "caption": "Lockup empaquetado en brio_ui, usado por el widget BrioLockup"
      }
    ]
  },
  {
    "slug": "kairos",
    "name": "Kairos · Trading Institucional",
    "tagline": "El mercado, a 60 fotogramas por segundo.",
    "category": "Terminal de trading · Web (Next.js + Firebase)",
    "year": "2026",
    "role": "Arquitecto y desarrollador único (front-end, motor de gráficos, dominio y despliegue)",
    "status": "Nivel 1 operativo y publicado; Niveles 2 y 3 con contratos de datos declarados",
    "summary": [
      "Kairos es un puesto de operación bursátil completo que corre entero en el navegador: acción del precio, libro de órdenes, cartera en papel y calendario macroeconómico sobre un mismo reloj.",
      "Implementa una especificación técnica por niveles: el Nivel 1 (acción del precio y entorno) está operativo de extremo a extremo, mientras que los Niveles 2 (microestructura) y 3 (flujo institucional y motor 3D) tienen ya cerrados y tipados sus contratos de datos.",
      "El reto real no era dibujar velas, sino sostener 60 FPS mientras la cinta imprime miles de operaciones por segundo: el mercado nunca pasa por React, escribe directamente en búferes columnares Float64Array y marca el lienzo como sucio.",
      "Los pares de criptomoneda cotizan en vivo contra el espejo público de datos de Binance; futuros, acciones, divisa e índice los sirve un simulador determinista, y un feed compuesto enruta cada instrumento sin que la interfaz note la diferencia.",
      "El proyecto documenta con el mismo rigor lo que NO implementa: la verificación en dos pasos, el módulo de fondos y 30 de los 32 indicadores del catálogo aparecen como estado real, no como interruptores decorativos."
    ],
    "problem": "Las plataformas de trading al uso o son gráficos con indicadores encima, o son terminales profesionales cerrados y carísimos. Reproducir un puesto institucional en la web choca con tres muros: el navegador no está pensado para redibujar a 60 FPS mientras recibe cientos de mensajes por segundo, React se convierte en un cuello de botella si cada tick provoca un render, y el cómputo de indicadores sobre series largas bloquea el hilo de interfaz. A eso se suma un problema de honestidad: una plataforma que muestra un mercado simulado y encima cobra depósitos reales no es un bróker, es un mercado ficticio con dinero real dentro.",
    "solution": "Un terminal construido en Clean Architecture donde la dependencia apunta siempre hacia dentro y el dominio no conoce ni React, ni el canvas, ni el transporte. El mercado se almacena en un búfer circular columnar sobre un único ArrayBuffer con seis columnas y un Int32Array de control apto para Atomics: se comparte con los Web Workers sin serializar nada. El motor de gráficos es un renderizador Canvas 2D por capas, agnóstico de React, con un requestAnimationFrame por panel y bandera de suciedad. La autenticación pasó al SDK de Firebase en el navegador, lo que permite publicar el sitio como export estático; lo que protege de verdad los datos son las reglas de Firestore evaluadas en el servidor contra el uid, no ninguna comprobación del cliente. Y el alcance financiero se corta donde debe: cartera en papel, cero depósitos, y una lista explícita de requisitos previos a cualquier módulo de fondos.",
    "highlights": [
      {
        "title": "El mercado no pasa por React",
        "description": "Un tick escribe en un Float64Array y marca el lienzo como sucio. Desplazar o hacer zoom no produce un solo render del árbol de componentes; la cabecera se refresca a 4 Hz como máximo. Coste medido: 1,25 ms por fotograma con tres indicadores, panel de oscilador, marcadores macro y 140 velas — un 7,5 % del presupuesto de 16,6 ms.",
        "icon": "Zap"
      },
      {
        "title": "Memoria compartida con los workers",
        "description": "OhlcvSeries es un búfer circular columnar sobre un único ArrayBuffer con un Int32Array de control apto para Atomics. Con aislamiento de origen cruzado activo (COOP + COEP, acotado a /terminal para no romper la ventana emergente de Google), el TA-Engine lee exactamente la misma memoria que el renderizador: coste de transferencia cero.",
        "icon": "Cpu"
      },
      {
        "title": "Motor de gráficos por capas",
        "description": "Un renderizador Canvas 2D con diez capas independientes — rejilla, serie, volumen, superposición de indicadores, panel de oscilador, marcadores macro, posiciones, línea de precio, barra de precios y cruceta — sobre un registro que declara las 21 tipologías de gráfico de la especificación.",
        "icon": "CandlestickChart"
      },
      {
        "title": "Feed compuesto: real donde lo hay, simulado donde no",
        "description": "CompositeMarketDataFeed enruta cada instrumento al adaptador que sabe servirlo: BTCUSDT y ETHUSDT en vivo desde el espejo público de datos de Binance, y el resto del catálogo desde un simulador determinista. La interfaz sigue viendo un único puerto MarketDataFeed.",
        "icon": "Split"
      },
      {
        "title": "Aritmética verificada a mano, no contra sí misma",
        "description": "Un verificador de 52 comprobaciones contrasta ROI, curva de capital, ratios, comisiones y swap contra valores calculados a mano en el propio caso de prueba. Reimplementar la fórmula al lado sólo demostraría que dos copias del mismo error coinciden.",
        "icon": "ClipboardCheck"
      },
      {
        "title": "Semáforo de impacto macroeconómico",
        "description": "Carpetas roja, naranja y amarilla con cuenta regresiva y avisos a 5 y 1 minuto, medidor de volatilidad por desviación y alerta de Volatilidad Extrema Inminente por encima del 20 %. Los eventos se marcan verticalmente sobre la vela exacta de publicación.",
        "icon": "Siren"
      },
      {
        "title": "Lo que no está, se dice",
        "description": "La verificación en dos pasos no se implementa porque el proyecto tiene MFA deshabilitado y una cuenta anónima no puede inscribir un segundo factor: el panel de perfil muestra ese estado real. Creerse protegido sin estarlo es peor que saberse desprotegido.",
        "icon": "ShieldAlert"
      }
    ],
    "features": [
      "Rejilla multiactivo de 1 a 4 paneles en paralelo, cada uno con instrumento, granularidad y tipo de serie propios; en móvil se apila sin perder la barra de precios",
      "Granularidad temporal continua de 1 segundo a 1 año (22 marcos), con alineación real a fronteras UTC y opción de enlazar el marco entre todos los paneles",
      "Barra de precios vertical integrada en el borde derecho, con etiqueta de último precio y escalado por arrastre",
      "TA-Engine en Web Worker con registro modular de 32 indicadores: SMA por suma deslizante O(n) y RSI con suavizado de Wilder ya implementados",
      "Cartera en papel con órdenes a mercado, límite y stop; Stop Loss y Take Profit arrastrables sobre el propio gráfico, elevación a break even y cierres rápidos globales",
      "Bitácora de operaciones con comisión de vuelta completa, swap por noche cruzada, resultado neto y exportación a CSV",
      "Estado de cuenta en vivo: saldo, equity, P&L flotante, margen usado y libre, y nivel de margen con semáforo",
      "Panel de rendimiento: ROI multitemporal, curva de capital, mapa de calor diario y ratios, todo derivado del historial cerrado sin almacenar ningún agregado",
      "Módulo macroeconómico con semáforo de impacto, calendario con cuenta regresiva, Fed Watch y curva de rendimiento del Tesoro",
      "Avisos locales del navegador al ejecutarse un Stop Loss o Take Profit, al entrar una orden pendiente y al caer el margen en zona crítica",
      "Acceso con Google mediante ventana emergente o cuenta de invitado anónima pero real, con uid propio y cartera persistida igual que cualquier otra",
      "Sincronización bidireccional con Firestore de cartera, disposición de paneles y preferencias, agrupando escrituras a 1,5 s",
      "Barra de estado con diagnóstico del entorno: disponibilidad de SharedArrayBuffer, proyecto de Firebase conectado y ayudas de interacción",
      "Landing pública prerenderizada, sin una sola petición a terceros, que explica los tres niveles de datos y las cifras reales del motor"
    ],
    "stack": [
      {
        "group": "Aplicación",
        "items": [
          "Next.js 16.3",
          "React 19.2",
          "TypeScript 5",
          "App Router",
          "output: 'export' (sitio estático)"
        ]
      },
      {
        "group": "Interfaz",
        "items": [
          "Tailwind CSS 4",
          "@tailwindcss/postcss",
          "Tokens Material Design 3 (esquema oscuro)",
          "Tipografía del sistema (sin recursos de terceros)"
        ]
      },
      {
        "group": "Motor de gráficos",
        "items": [
          "Canvas 2D API",
          "Renderizador propio por capas",
          "Escalas y controlador de viewport propios",
          "WebGL reservado para el motor 3D de Nivel 3"
        ]
      },
      {
        "group": "Cómputo y concurrencia",
        "items": [
          "Web Workers",
          "SharedArrayBuffer",
          "Float64Array / Int32Array",
          "Atomics",
          "COOP + COEP acotados a /terminal"
        ]
      },
      {
        "group": "Datos de mercado",
        "items": [
          "WebSocket (data-stream.binance.vision)",
          "REST klines (data-api.binance.vision)",
          "Simulador determinista mulberry32",
          "Feed compuesto con reconexión de retroceso exponencial"
        ]
      },
      {
        "group": "Backend gestionado",
        "items": [
          "Firebase 12",
          "Firebase Authentication (Google + anónimo)",
          "Cloud Firestore",
          "Firebase Hosting"
        ]
      },
      {
        "group": "Calidad y herramientas",
        "items": [
          "ESLint 9 + eslint-config-next",
          "tsx",
          "Verificador de analítica propio (52 comprobaciones)"
        ]
      }
    ],
    "architecture": "Clean Architecture estricta con la dependencia siempre hacia dentro: presentation → application → domain. El núcleo (src/core) es puro TypeScript sin framework: entidades (Candle, Instrument, TopOfBook, Order, Position, TradingAccount, MacroEvent, MarketDepth de Fase 2, QuantAnalytics de Fase 3), value-objects (Timeframe con alineación UTC real), puertos (MarketDataFeed, CandleRepository, IndicatorEngine, MacroCalendarRepository) y servicios de aplicación (agregador de velas, motor de cartera en papel, analítica de rendimiento, desviación de volatilidad). src/infrastructure implementa esos puertos: adaptadores de Binance, simulador, feed compuesto y factoría, capa anticorrupción snake_case → dominio en los mapeadores del protocolo WebSocket, y la integración con Firebase. src/charting es el motor de gráficos, agnóstico de React: interfaz ChartRenderer, escalas, viewport, registro de las 21 tipologías y un renderizador Canvas 2D con diez capas. src/presentation contiene React con ocho contextos apilados en el orden de las dependencias (transporte → instantánea de mercado → analítica → macro → cartera → preferencias → espacio de trabajo). src/workers es un directorio aislado con el deserializador de WebSocket y el TA-Engine, comunicados por contratos de mensajería tipados. No hay rutas de servidor ni Cloud Functions: el sitio se compila como export estático y la seguridad recae íntegramente en las reglas de Firestore, que niegan por defecto y sólo abren users/{uid} a su propietario. Unas 14.200 líneas de TypeScript y TSX.",
    "challenges": [
      {
        "problem": "Un terminal que redibuja a cada tick y recalcula indicadores en el hilo principal se entrecorta en cuanto el mercado se acelera; con React en medio, cada impresión de la cinta provocaría un render del árbol completo.",
        "solution": "Se sacó el mercado de React por completo: cada tick escribe en un búfer circular columnar de Float64Array y sólo marca el lienzo como sucio, con un requestAnimationFrame por panel. El transporte agrupa mensajes y emite un postMessage por fotograma en vez de uno por tick, y las peticiones al TA-Engine se fusionan a ~8 Hz porque recalcular a los 20 Hz del feed sería tirar trabajo. Resultado medido: 1,25 ms por fotograma."
      },
      {
        "problem": "El aislamiento de origen cruzado (COOP: same-origin) es requisito del navegador para exponer SharedArrayBuffer, pero impide que un documento hable con la ventana emergente que abre — y el acceso con Google de Firebase usa exactamente eso.",
        "solution": "El aislamiento se acotó a /terminal, dejando /acceso fuera. Además se eligió ventana emergente en lugar de redirección, porque signInWithRedirect deposita estado en el almacenamiento del authDomain, que es un tercero respecto al sitio, y falla de forma intermitente con el bloqueo de cookies de terceros. Como output: 'export' deja inactiva la función headers() de Next en producción, las cabeceras están duplicadas a propósito en firebase.json."
      },
      {
        "problem": "El dominio principal de Binance devuelve HTTP 451 (ubicación restringida) desde buena parte de Latinoamérica, y como la petición sale del navegador de cada usuario, la restricción se aplicaría a cada uno por separado dejando el terminal sin precios.",
        "solution": "Se usa el espejo público de datos de mercado (data-api.binance.vision y data-stream.binance.vision), que sirve lo mismo sin esa puerta y devuelve access-control-allow-origin: *, así que además atraviesa el COEP de /terminal. Se abren tres streams por instrumento en una única conexión combinada: @trade para el OHLC, @bookTicker para el spread en tiempo real y @ticker por la apertura de 24 h."
      },
      {
        "problem": "Binance no ofrece marcos de 5 s, 15 s, 30 s ni los multi-mes, y componerlos agrupando de N en N desde el índice 0 del array producía velas desfasadas — 13 s de desvío medidos en un marco de 15 s — que no casaban con las que forma el agregador en vivo, dejando una costura visible entre el histórico y el tiempo real.",
        "solution": "Se agrupa por frontera temporal alineada en lugar de por posición en el array. La corrección resuelve además los huecos de segundos sin negociación. Verificado en producción: el bid del panel coincide exactamente con el de la API, y la apertura de sesión también."
      },
      {
        "problem": "Al pasar a export estático se cayó el modelo anterior de seguridad, que verificaba una cookie firmada con HMAC en un proxy antes de servir el terminal. El HTML y el JavaScript son ahora descargables por cualquiera y ninguna comprobación del navegador puede impedirlo.",
        "solution": "Se separó experiencia de protección: AuthGuard sólo evita mostrar un terminal sin sesión, y quien protege de verdad son las reglas de Firestore, que Google evalúa en el servidor contra el uid del token, con denegación por defecto y una única ruta abierta a su propietario. Para una aplicación cuyo mercado es un simulador en el propio navegador es el reparto correcto: lo valioso son los datos del operador, no el código de la página. Verificado en producción: una lectura sin credenciales devuelve 403."
      },
      {
        "problem": "La reconciliación entre la cartera local y la de la nube sólo sincronizaba los cambios posteriores al inicio de sesión, de modo que una cartera ya existente en el navegador no llegaba nunca al servidor. Y arrastrar un Stop Loss sobre el gráfico disparaba una escritura por cada movimiento del ratón.",
        "solution": "Reconciliación en dos direcciones: al entrar, lo remoto manda si trae operaciones; si la nube está vacía y hay cartera local, se sube. Las escrituras se agrupan a 1,5 s. Nada que dependa de localStorage o del reloj se inicializa con useState — eso abortaría la hidratación del árbol entero —, sino con useSyncExternalStore y su getServerSnapshot."
      },
      {
        "problem": "next build con Turbopack emite los Web Workers como TypeScript en crudo dentro de _next/static/media/, y su arranque generado usa importScripts(), así que el entrypoint falla antes de ejecutar una sola línea propia. El TA-Engine llevaba roto sin que nada lo delatara.",
        "solution": "La causa está diagnosticada y documentada como incumplimiento abierto, con las tres vías descartadas anotadas (ruta relativa en vez de alias, quitar type: 'module', desactivar el export estático). De ahí salió una regla dura: todo worker DEBE tener onerror, porque sin él fallan en silencio. El feed de Binance se dejó en el hilo principal tras medir que sus ~720 msg/s cuestan 0,007 ms por fotograma."
      },
      {
        "problem": "ctx.font no resuelve custom properties de CSS: una cadena de fuente con var(--…) es inválida y el canvas revierte en silencio a 10px sans-serif, sin error, dejando toda la tipografía del gráfico rota.",
        "solution": "charting/theme.ts declara pilas de fuentes literales, espejadas explícitamente en globals.css junto al resto de la paleta, de modo que la interfaz en DOM y el dibujo en canvas nunca divergen de color ni de tipografía."
      }
    ],
    "metrics": [
      {
        "value": "3",
        "label": "rutas: landing, acceso y terminal"
      },
      {
        "value": "21",
        "label": "tipologías de gráfico declaradas (6 renderizando)"
      },
      {
        "value": "32",
        "label": "indicadores en el catálogo del TA-Engine"
      },
      {
        "value": "22",
        "label": "marcos temporales, de 1 segundo a 1 año"
      },
      {
        "value": "8",
        "label": "instrumentos en catálogo (futuros, cripto, acciones, FX, índice)"
      },
      {
        "value": "10",
        "label": "capas independientes del renderizador Canvas 2D"
      },
      {
        "value": "2",
        "label": "Web Workers: deserializador y TA-Engine"
      },
      {
        "value": "52",
        "label": "comprobaciones del verificador de analítica"
      },
      {
        "value": "1,25 ms",
        "label": "coste medido de un fotograma (7,5 % del presupuesto)"
      },
      {
        "value": "~14.200",
        "label": "líneas de TypeScript y TSX"
      }
    ],
    "brand": {
      "primary": "#22d3ee",
      "secondary": "#16c784",
      "accent": "#ea3943",
      "bg": "#0b0f14",
      "surface": "#131922",
      "text": "#e3e8ef",
      "gradient": "linear-gradient(135deg, #22d3ee 0%, #16c784 55%, #0b0f14 100%)",
      "mood": "Terminal profesional nocturno. Fondo casi negro azulado, superficies escalonadas en gris pizarra y un cian eléctrico como único color de acción; el verde y el rojo están reservados a la semántica de mercado (alcista y bajista) y nunca decoran. El monograma es una K construida con trazos que se cruzan como mechas de vela, en cian, con un segmento verde ascendente y otro rojo descendente; el logotipo KAIROS va en gris muy claro, ancho y sin serifas. Densidad de información alta, tipografía monoespaciada con cifras tabulares para todo lo numérico, y cero adornos: la jerarquía la marcan el color y la alineación, no las sombras.",
      "source": "/Users/macbook/trading-platform/src/app/globals.css (tokens Material Design 3 y semántica de mercado) espejados literalmente en /Users/macbook/trading-platform/src/charting/theme.ts (DARK_THEME); marca en /Users/macbook/trading-platform/public/brand/kairos-lockup.png"
    },
    "links": {
      "web": "https://kairos-74b99.web.app"
    },
    "uiScreens": [
      {
        "name": "Landing pública",
        "describe": "Fondo #0b0f14 con dos halos radiales superpuestos: uno cian rgba(34,211,238,0.18) a 1100 px anclado arriba a la izquierda, otro verde rgba(22,199,132,0.10) a 900 px arriba a la derecha. Cabecera adherente con borde inferior #2a3441 al 60 % y desenfoque de fondo: a la izquierda el lockup KAIROS a 30 px de alto, en el centro tres enlaces de 13 px en gris #93a1b5 (Capacidades · Niveles de datos · Ingeniería) y a la derecha una píldora cian sólida #22d3ee con texto #04222a que dice «Acceder». El héroe es una rejilla de dos columnas con 80–112 px de aire vertical: en la izquierda una etiqueta-píldora con borde y punto verde («Nivel 1 operativo · Niveles 2 y 3 con contratos declarados»), un titular de 60 px muy apretado —«El mercado, a 60 fotogramas por segundo.» con «60 fotogramas» en cian—, un párrafo de 16 px en gris, dos botones redondeados (uno cian sólido «Entrar con Google», otro con borde «Ver qué incluye») y, bajo una línea divisoria, tres cifras monoespaciadas: 21 tipologías de gráfico, 1 s → 1 año granularidad continua, 1–4 activos en paralelo. La columna derecha es una tarjeta de esquinas de 16 px con borde #2a3441 sobre #10151c y sombra profunda, que contiene un gráfico de velas de muestra con barra de precios a la derecha y un pie de 11 px. Más abajo, tres secciones idénticas en estructura: antetítulo cian en versalitas con seguimiento amplio, titular de 36 px, párrafo y contenido. La sección «Niveles» son tres tarjetas verticales con una línea de degradado de un píxel en el borde superior —verde #16c784, ámbar #f59e0b y magenta #ff2d55 respectivamente—, la etiqueta NIVEL 1/2/3 en monoespaciada con ese mismo color, una píldora de estado («Operativo», «Contratos listos») y cinco viñetas; al pasar el ratón la tarjeta se eleva un píxel y su borde vira a cian. La sección «Ingeniería» muestra tres tarjetas de métrica con cifras enormes (1,25 ms · 0 · O(n)). Cierra un bloque CTA de esquinas de 24 px con halo cian y un pie con el monograma a 18 px."
      },
      {
        "name": "Acceso de operador",
        "describe": "Pantalla centrada sobre #0b0f14 con un único halo radial cian al 16 % de opacidad, de 1000 px, anclado arriba en el centro. Encima, un enlace discreto de 12 px «← Volver a la página principal». La tarjeta mide 448 px de ancho, esquinas de 16 px, fondo #131922, borde #2a3441 y sombra muy marcada; dentro, 32 px de relleno. Arriba el lockup KAIROS a 34 px de alto y debajo, en 11 px, versalitas y seguimiento de 0,14 em, la línea «ACCESO DE OPERADOR». Sigue un párrafo de 13 px en gris #93a1b5 explicando que no se almacenan contraseñas y que la identidad la verifica Google mediante Firebase Authentication. Los dos botones ocupan el ancho completo y se apilan: el primario «Continuar con Google» (que muestra «Conectando con Google…» mientras trabaja) y el secundario, con borde, «Entrar como invitado» (que pasa a «Abriendo terminal…»). Al pie, una nota de 10 px: la sesión la gestiona Firebase y persiste en este navegador, y los datos quedan protegidos por reglas evaluadas en el servidor. Los mensajes de error son concretos y no genéricos: ventana emergente bloqueada, dominio no autorizado o Firebase sin configurar."
      },
      {
        "name": "Terminal · rejilla multiactivo",
        "describe": "Ocupa el alto completo de la ventana sin scroll, en cinco franjas horizontales sobre #0b0f14. (1) Barra superior de fondo #131922 con borde inferior: monograma a 26 px, el título «Kairos» en 13 px negrita y bajo él «FASE 1 · DATA NIVEL 1» en 9 px versalitas; después la etiqueta «Layout» y un grupo de botones segmentados de 1 a 4 paneles, un conmutador redondeado que enlaza la granularidad entre paneles, un indicador de estado del feed con punto de color, el reloj UTC en monoespaciada con cifras tabulares y el menú de usuario. (2) Franja delgada de estado de cuenta sobre #10151c con seis métricas en fila —Saldo, Equity, P&L flotante, Margen usado, Margen libre y Nivel—, cada una con rótulo de 9 px en versalitas y cifra monoespaciada de 13 px; el P&L se pinta verde #16c784 o rojo #ea3943 según signo y el Nivel vira a ámbar #f59e0b cuando el margen aprieta. (3) Cuerpo: a la izquierda la rejilla de uno a cuatro lienzos de velas, cada panel con su cabecera de instrumento, granularidad y tipo de serie, la barra de precios vertical al borde derecho con la etiqueta de último precio, rejilla tenue rgba(148,163,184,0.07), volumen en la base al 35 % de opacidad, línea de posición y de Stop/Take arrastrables, marcadores verticales de eventos macro y un panel inferior de oscilador para el RSI con guías en 30, 50 y 70. A la derecha, un carril de 340 px sobre #131922 con un solo panel visible a la vez (Lista de seguimiento, Panel de ejecución, Rendimiento, Perfil o Macro), encabezado por un título de 11 px en versalitas negrita. (4) Bitácora opcional de 190 px de alto. (5) Barra inferior de 10 px con las teclas de interacción en recuadros —Arrastrar, Rueda, Arrastrar barra de precios, Doble clic— y, alineados a la derecha, «SharedArrayBuffer: disponible» y «Firebase: kairos-74b99» en verde, más «Nivel 2 · Nivel 3: contratos declarados» atenuado."
      },
      {
        "name": "Panel de ejecución (ticket de orden)",
        "describe": "Columna de 340 px con 12 px de separación entre bloques. Cabecera con el símbolo del panel activo en 12 px negrita, el nombre largo del instrumento debajo en 10 px gris, y a la derecha el último precio en monoespaciada negrita con cifras tabulares. Debajo, un selector segmentado dentro de una píldora con borde #2a3441 y tres opciones: Mercado, Límite y Stop; la activa se rellena en cian con texto oscuro. Sigue una rejilla de dos columnas con el campo numérico «Cantidad» y, según el tipo, o bien el valor nocional calculado o bien un campo «Precio de disparo» en monoespaciada. Una casilla de verificación de 10 px activa «Adjuntar Stop Loss y Take Profit»; al marcarla aparecen dos campos numéricos —«Stop (ticks)» y objetivo— y, bajo ellos, una caja de previsualización sobre #10151c con borde tenue y texto monoespaciado de 10 px que desglosa riesgo, recompensa y relación. Cierran dos botones de 40 px de alto en rejilla de dos columnas: «COMPRAR» sobre verde #16c784 con texto casi negro #04220f y el ask en monoespaciada pequeña a su derecha, y «VENDER» sobre rojo #ea3943 con texto #2a0508 y el bid; ambos escalan un 2 % al pasar el ratón. Al pie, una advertencia de 9 px: cartera en papel, las órdenes se ejecutan contra el simulador local y no salen a ningún mercado."
      },
      {
        "name": "Módulo macroeconómico",
        "describe": "Panel del carril lateral encabezado por «Entorno macroeconómico» en 11 px versalitas negrita junto a un botón que activa las alertas sonoras. Bajo el título, el semáforo de impacto: tres lámparas circulares en columna o fila —roja #ea3943 (carpeta roja: CPI, NFP, FOMC), naranja #f59e0b (PPI, PMI, ventas minoristas) y amarilla #facc15 (subastas menores)— apagadas al 20 % de opacidad y encendidas con halo cuando hay una publicación de ese nivel dentro de la hora siguiente. Si la desviación supera el 20 %, se despliega una caja de alerta con borde e interior rojo tenue y el rótulo «⚠ VOLATILIDAD EXTREMA INMINENTE» en versalitas rojas, seguido del evento y su porcentaje. Después, la lista de eventos: cada fila lleva un punto del color de su carpeta, la hora en monoespaciada de 10 px, el nombre del evento en 11 px seminegrita truncado, y a la derecha la cuenta regresiva —que pasa a cian y negrita en el aviso de 5 minutos, y a rojo en el de 1 minuto, hasta mostrar «Publicado»—. Bajo el nombre, la descripción en 10 px gris y una rejilla de tres columnas monoespaciadas con Previo, Consenso y Actual, más una línea final con el rótulo «DESVIACIÓN ESPERADA» o «DESVIACIÓN REALIZADA» y su porcentaje coloreado por severidad. Cierra el bloque Fed Watch con las probabilidades implícitas de la próxima decisión de tasas y la curva de rendimiento del Tesoro."
      }
    ],
    "visualConcept": "«Panel de mercado: sparklines, velas y contadores que laten», llevado hasta el final: la landing no habla de un terminal, se comporta como uno. El lienzo es el propio fondo del producto (#0b0f14) con una rejilla de terminal apenas visible —líneas rgba(148,163,184,0.07) cada 32 px— y dos halos radiales, cian arriba a la izquierda y verde arriba a la derecha, que respiran muy despacio (18 s, escala 1 → 1,06). Toda la página está gobernada por un único reloj: un requestAnimationFrame maestro a ~8 Hz que alimenta cada elemento vivo, de modo que las cifras de secciones distintas parpadean en fase, como si leyeran la misma cinta. ESTRUCTURA. (1) Cintillo superior: una barra de cotizaciones que se desliza en bucle continuo con los ocho instrumentos reales del catálogo —NQ, ES, BTCUSDT, ETHUSDT, AAPL, NVDA, EURUSD, VIX—, cada uno con su último precio en monoespaciada tabular y una variación que se pinta verde #16c784 o roja #ea3943; al cambiar un precio, la celda destella 180 ms con un fondo del color del signo al 12 % y vuelve a apagarse. (2) Héroe partido: a la izquierda el titular «El mercado, a 60 fotogramas por segundo.» con «60» animado por un contador que sube de 0 a 60 en 900 ms y luego oscila entre 58 y 60 como un medidor real; a la derecha, un panel de velas dibujado en canvas que se alimenta de una caminata aleatoria determinista, con la barra de precios vertical al borde derecho y la etiqueta de último precio deslizándose por ella. La vela en curso late: su cuerpo se estira y encoge y su mecha parpadea, mientras las cerradas quedan fijas. Una cruceta fantasma recorre el gráfico sola, de derecha a izquierda, cada 12 s. (3) Tira de sparklines: seis miniaturas de 120 × 32 px bajo el héroe, una por capacidad, dibujadas como trazo cian de 1,5 px con relleno degradado a transparente; se redibujan desplazando un punto por tick, y la que está bajo el cursor engorda el trazo y revela su último valor. (4) Sección de capacidades como escalera DOM: las seis tarjetas se apilan como niveles de un libro de órdenes, cada una con una barra horizontal de profundidad a su izquierda cuyo ancho se anima al entrar en pantalla, verde para las tarjetas de precio y roja para las de ejecución. (5) Los tres niveles de datos son tres columnas con un hilo de degradado de un píxel arriba —verde, ámbar #f59e0b, magenta #ff2d55— que se desplaza lateralmente en bucle de 3 s; la de Nivel 3 lleva de fondo un mapa de calor térmico muy tenue con la paleta real del proyecto (#ff2d55 → #ff9f0a → #ffd60a → #22d3ee → #0a2540) cuyas celdas cambian de intensidad al azar, una cada 400 ms. (6) Bloque de ingeniería: tres contadores grandes en monoespaciada —1,25 ms, 0, O(n)— sobre un histograma de tiempos de fotograma que se rellena de izquierda a derecha en verde salvo las barras que rebasarían los 16,6 ms, que se pintan rojas; una línea de presupuesto punteada cruza el gráfico con la etiqueta «16,6 ms». (7) Pie que imita la barra de estado del terminal: teclas en recuadro, «SharedArrayBuffer: disponible» en verde y un latido cian de dos píxeles que pulsa una vez por segundo. MOVIMIENTO: nada dura más de 400 ms salvo lo que respira; las transiciones usan cubic-bezier(0.2, 0.8, 0.2, 1); ningún elemento se desliza más de 12 px. Todo lo animado se detiene con prefers-reduced-motion, quedando el gráfico en un fotograma fijo y los contadores en su valor final. La diferencia con cualquier otra landing es que aquí el color no decora: el verde y el rojo sólo significan alcista y bajista, el cian es la única acción posible, y el resto es gris de terminal.",
    "statusShort": "Nivel 1 operativo",
    "categoryShort": "Fintech",
    "media": [
      {
        "src": "/proyectos/kairos/kairos-lockup.png",
        "kind": "logo",
        "caption": "Lockup horizontal usado en la interfaz: monograma K en cian con acentos verde y rojo, y logotipo KAIROS en gris claro; fondo recortado por diferencia para asentar sobre cualquier superficie del tema."
      },
      {
        "src": "/proyectos/kairos/kairos-mark.png",
        "kind": "icon",
        "caption": "Monograma suelto, el que aparece en la barra superior del terminal y en el pie de la landing."
      },
      {
        "src": "/proyectos/kairos/kairos-logo.png",
        "kind": "logo",
        "caption": "Logo original a resolución completa, con el fondo oscuro incrustado; se conserva como referencia y es el origen de la tarjeta social."
      },
      {
        "src": "/proyectos/kairos/kairos-banner.png",
        "kind": "banner",
        "caption": "Banner original de marca, origen del lockup recortado que se usa en la interfaz."
      },
      {
        "src": "/proyectos/kairos/kairos-icon.png",
        "kind": "icon",
        "caption": "Icono original de marca, origen del monograma recortado."
      },
      {
        "src": "/proyectos/kairos/opengraph-image.png",
        "kind": "social",
        "caption": "Tarjeta social 1200×630 derivada del logo, servida por el App Router."
      },
      {
        "src": "/proyectos/kairos/icon.png",
        "kind": "icon",
        "caption": "Icono de aplicación a 512 px."
      },
      {
        "src": "/proyectos/kairos/apple-icon.png",
        "kind": "icon",
        "caption": "Icono de 180 px para la pantalla de inicio en iOS."
      }
    ]
  },
  {
    "slug": "zocialy",
    "name": "Zocialy",
    "tagline": "Panel SMM con precio calculado en servidor, saldo atómico y aviso de riesgo imposible de saltar",
    "category": "Plataforma web · Marketing en redes sociales (SMM)",
    "year": "2026",
    "role": "Diseño de producto, arquitectura y desarrollo full-stack: landing, panel de cliente, panel de administración, API de reventa y app móvil de administración",
    "status": "En producción en https://zocialy-47c9c.web.app · compila limpio (typecheck + build) · pendiente saldo en Peakerr y pasarela automática",
    "summary": [
      "Zocialy es un panel de servicios de marketing en redes sociales (seguidores, me gusta, visualizaciones) construido sobre Next.js 15 y Firebase, con el catálogo del proveedor mayorista Peakerr como fuente de servicios.",
      "Son tres productos en un mismo repositorio: una landing pública animada sin librerías de motion, un panel de cliente con 9 secciones y un área de administración con 12, más una app Flutter aparte para aprobar recargas desde el teléfono.",
      "La frontera de seguridad no está en el navegador: el precio se recalcula siempre en el servidor a partir de servicio y cantidad, el saldo se descuenta dentro de una transacción de Firestore y los roles viven en custom claims, no en un campo del documento que el usuario pueda escribir.",
      "El requisito más delicado del cliente —advertir de la caída natural de métricas tras la entrega— está implementado como una barrera real: un único texto constante, un componente que siempre se renderiza antes del botón de pago y un rechazo 400 en la API si el pedido llega sin la aceptación firmada.",
      "El proyecto está escrito íntegramente en español, incluidos rutas, nombres de estado en Firestore y comentarios de código, y toda la interfaz se sirve en tema claro forzado."
    ],
    "problem": "Los paneles SMM del mercado comparten tres vicios: prometen crecimiento perpetuo escondiendo que las plataformas depuran cuentas y las métricas caen; confían el precio y el estado del pedido al navegador, que es exactamente donde no debe decidirse el dinero; y arrastran catálogos de miles de servicios que obligan a descargar la colección entera solo para rellenar un desplegable, con una factura de Firestore que crece sin que nadie la mire. A eso se sumaban dos exigencias del contexto venezolano: cobrar en bolívares con la tasa oficial del BCV, que no publica API y sirve la cifra dentro del HTML con una cadena de certificados incompleta, y verificar cada pago a mano sin que un doble clic acredite el saldo dos veces.",
    "solution": "Se construyó un panel donde el navegador nunca escribe dinero ni estado. `/api/orders` ignora el importe que envía el cliente y lo recalcula desde `serviceId` + `quantity` con la misma función pura (`calculateCharge`) que usa la tarjeta de producto, el formulario y la API de reventa, así que lo que se muestra y lo que se cobra no pueden divergir. El cobro ocurre dentro de una transacción de Firestore y, si Peakerr rechaza el pedido, el importe vuelve al saldo con su movimiento trazado. La transparencia de riesgos se resolvió con una sola constante de texto (`RISK_NOTICE_TEXT`) que alimenta a la vez el formulario de compra, la página de política de refill y el resumen de la landing, con tres cerrojos encadenados: el hook no habilita el botón, el submit corta y la API devuelve 400. El coste se atacó sustituyendo listeners en vivo por páginas con cursor `startAfter`, agregaciones `count`/`sum` en servidor y un documento agregado `catalog/index` de 8 KB que reduce el formulario de pedido de más de 3.000 lecturas a una más la categoría elegida. Las recargas siguen un flujo manual verificado por un humano, con la tasa congelada en cada solicitud, aprobación idempotente y aviso a Telegram que jamás puede tumbar una solicitud ya guardada.",
    "highlights": [
      {
        "title": "El aviso de riesgo es una barrera, no un párrafo",
        "description": "Un único texto constante alimenta compra, política y landing; el hook no habilita el botón sin aceptación, el submit corta y la API rechaza con 400. Cada pedido guarda `riskAcknowledgedAt` y `riskNoticeVersion` para dejar constancia de qué texto aceptó cada cliente.",
        "icon": "ShieldAlert"
      },
      {
        "title": "El dinero se decide en el servidor",
        "description": "El importe que envía el navegador se ignora y se recalcula desde servicio y cantidad; el saldo se descuenta en una transacción de Firestore, así que dos pestañas no gastan el mismo saldo dos veces, y un rechazo del proveedor dispara el reembolso automático con su movimiento trazado.",
        "icon": "Wallet"
      },
      {
        "title": "Firestore paginado con cursores y agregaciones",
        "description": "Nada de `onSnapshot` sobre listas ni de `offset`: páginas con `startAfter`, `limit(pageSize + 1)` para saber si hay siguiente sin una segunda consulta, y `getCountFromServer` / `getAggregateFromServer` para los resúmenes. El formulario de pedido bajó de más de 3.000 lecturas a una más la categoría elegida.",
        "icon": "Gauge"
      },
      {
        "title": "Claves de reventa con hash y consentimiento firmado",
        "description": "La API pública `/api/v2` imita el estándar de facto de los paneles SMM (POST form-urlencoded, siempre HTTP 200 con `error`). La clave solo vive como SHA-256 y se enseña una vez; como una API no tiene pantalla donde mostrar el aviso, el consentimiento se firma al generarla y cada pedido lo hereda.",
        "icon": "KeyRound"
      },
      {
        "title": "El grupo de Telegram se conecta escribiendo `/id`",
        "description": "El enlace de invitación de un grupo privado no da `chat_id` y el modo privacidad oculta los mensajes normales al bot, pero los comandos siempre llegan. El webhook guarda el chat en `settings/site` con doble cerrojo: el secreto de cabecera de Telegram y el ID del administrador.",
        "icon": "Bot"
      },
      {
        "title": "Tasa del BCV raspada con salvaguarda de rango",
        "description": "El BCV no tiene API y su cadena de certificados está incompleta, así que se usa el módulo `https` con la verificación relajada solo en esa petición. El parser lee `<div id=\"dolar\">` en formato venezolano y rechaza cualquier cifra fuera de rango antes que cobrar mal; el refresco es perezoso y la tasa se congela en cada solicitud.",
        "icon": "TrendingUp"
      }
    ],
    "features": [
      "Landing pública con hero animado, marquesina de plataformas, tabla de precios y resumen del aviso de riesgo",
      "Dos puertas de acceso separadas: clientes solo con Google, administración solo con email + contraseña y custom claim `role: admin`",
      "Formulario de pedido en cascada red → categoría → servicio, con validación de forma del enlace y guía por métrica",
      "Puerta de pago (`PaymentGate`) como único componente autorizado a renderizar un botón de compra",
      "Catálogo sincronizado desde Peakerr con normalización de texto (emojis, Unicode matemático, İ turca) y clasificación automática",
      "Doble verdad del refill: lo que el proveedor anuncia (`refill`) y lo que la API puede ejecutar (`refillViaApi`), con cola manual cuando no hay automatismo",
      "Recargas de saldo con seis métodos (Pago Móvil, Nequi, Binance Pay, Zinli, PayPal, Wally), importe convertido a moneda local y tasa congelada",
      "Aprobación idempotente de recargas en `/admin/recargas` con acreditación, movimiento y auditoría en una sola transacción",
      "Programa de afiliados con niveles de trinquete, comisiones en enteros de diezmilésima de dólar y correos de referidos enmascarados por el servidor",
      "Retiros de ganancias con identidad de cobro e histórico propio",
      "Productos destacados curados, con escalones de cantidad y compra rápida en hoja modal",
      "Analítica propia: recolección de eventos, agregación diaria y pantalla de métricas con comparativas contra ayer y contra la media de 7 días",
      "Auditoría inmutable: toda acción de administración queda en `auditLog`, que ni un admin puede escribir desde el cliente",
      "API pública `/api/v2` para revendedores con clave hasheada y limitación de peticiones",
      "Sistema de tickets de soporte con hilo de mensajes",
      "Avisos a Telegram para recargas y retiros, con registro del chat por comando",
      "Rutas de cron para sincronizar catálogo y estados de pedido",
      "App Flutter de administración con notificaciones push para aprobar recargas desde el teléfono",
      "Política de limpieza de Artifact Registry documentada para no pagar imágenes de despliegues viejos"
    ],
    "stack": [
      {
        "group": "Web",
        "items": [
          "Next.js 15 (App Router)",
          "React 19",
          "TypeScript 5.6",
          "Tailwind CSS 3.4",
          "PostCSS",
          "Autoprefixer"
        ]
      },
      {
        "group": "Backend y datos",
        "items": [
          "Firebase 12 (Auth + Firestore)",
          "firebase-admin 13",
          "server-only",
          "Firebase Hosting con frameworksBackend (Cloud Run, us-central1)",
          "Reglas e índices de Firestore versionados"
        ]
      },
      {
        "group": "App de administración",
        "items": [
          "Flutter (Dart SDK ^3.10)",
          "firebase_core",
          "firebase_auth",
          "cloud_firestore",
          "firebase_messaging",
          "flutter_riverpod",
          "go_router",
          "google_fonts",
          "flutter_animate",
          "shimmer",
          "fl_chart",
          "intl",
          "http",
          "url_launcher",
          "flutter_local_notifications",
          "flutter_launcher_icons"
        ]
      },
      {
        "group": "Integraciones",
        "items": [
          "API de Peakerr (catálogo y despacho de pedidos)",
          "Telegram Bot API (webhook)",
          "Banco Central de Venezuela (raspado de la tasa oficial)"
        ]
      },
      {
        "group": "Calidad y operación",
        "items": [
          "node:test con --experimental-strip-types",
          "tsc --noEmit",
          "Firebase CLI",
          "gcloud Artifact Registry (política de limpieza)"
        ]
      }
    ],
    "architecture": "Monorepo web en `/Users/macbook/zocialy` con el App Router de Next.js como única aplicación: `src/app/page.tsx` es la landing, `src/app/panel/*` el área de cliente (guarda de sesión), `src/app/admin/*` la de gestión (guarda `role=admin`) y `src/app/api/*` las 36 rutas de servidor. La lógica de negocio vive en `src/lib` en módulos puros que no importan el SDK a propósito —`pricing.ts`, `commissions.ts`, `referrals.ts`, `classify.ts`— para poder ejecutarse tal cual con `node --test`; los adaptadores con estado (`lib/firebase/admin.ts`, `lib/peakerr/client.ts`, `lib/bcv.ts`, `lib/trm.ts`) llevan `server-only`, de modo que el build falla si alguien intenta importar la clave del proveedor desde el navegador. Los datos se modelan en `lib/firebase/schema.ts` sobre 16 colecciones de Firestore, y las reglas declaran la frontera real: el cliente lee lo suyo y no escribe ni saldo ni estado de pedido. La lectura se hace siempre con `usePagedCollection` (cursores `startAfter` y `limit(pageSize + 1)`), y los resúmenes con agregaciones de servidor. Todo el despliegue va a Firebase Hosting con `frameworksBackend`, es decir, la app entera corre en Cloud Run sin una carpeta `functions/`. Aparte, `/Users/macbook/zocialy_admin` es una app Flutter independiente (Riverpod + go_router, ~7.300 líneas de Dart) que ataca las mismas colecciones y las mismas rutas de API con el token del administrador, reproduciendo píxel a píxel la paleta de la web para que se sientan un mismo producto.",
    "challenges": [
      {
        "problem": "El formulario de pedido necesitaba los más de 3.000 servicios del catálogo solo para rellenar tres desplegables, y cada visita se facturaba entera.",
        "solution": "La sincronización escribe un documento agregado `catalog/index` de 8 KB con las redes y categorías, y los servicios se piden solo de la categoría que el usuario elige. La pantalla pasó de más de 3.000 lecturas a una más un lote de unos cientos, y solo cuando hace falta."
      },
      {
        "problem": "El flag `refill` de Peakerr no es fiable: cientos de servicios lo traen en `false` mientras anuncian «Refill 30d» en el nombre, y otros lo traen en `true` sin mencionarlo.",
        "solution": "Se guardan las dos verdades en lugar de elegir una: `refill` es lo que el proveedor anuncia y es lo que ve el cliente; `refillViaApi` es si la acción automática funcionará. Cuando no hay automatismo la solicitud se registra igual y queda en cola manual, porque ocultar una garantía anunciada perjudica al cliente y prometer un botón que va a fallar, también."
      },
      {
        "problem": "El texto que devuelve el proveedor está escrito por humanos: emojis decorativos, caracteres matemáticos Unicode, banderas, la İ turca que NFKC no descompone y tres grafías distintas de «TikTok».",
        "solution": "`lib/peakerr/classify.ts` normaliza con `cleanText` antes de reconocer nada, con casos explícitos para los caracteres que la normalización estándar no resuelve, y el resultado se verifica contra el catálogo real con scripts de comprobación en `scripts/`."
      },
      {
        "problem": "El BCV no publica API, sirve la tasa dentro del HTML en formato venezolano y su cadena de certificados está incompleta, con lo que Node falla con `UNABLE_TO_VERIFY_LEAF_SIGNATURE`.",
        "solution": "Se usa el módulo `https` con la verificación desactivada únicamente en esa petición, en lugar de tocar `NODE_TLS_REJECT_UNAUTHORIZED`, que la relajaría también para Firebase y Peakerr. El parser lee la cifra de `<div id=\"dolar\">`, la convierte desde el formato local y aplica una salvaguarda de rango: si un cambio de maquetación hiciera leer un año o un teléfono, se rechaza antes que cobrar mal."
      },
      {
        "problem": "Aprobar una recarga dos veces —un doble clic, dos pestañas— acreditaría el saldo dos veces, que es el error clásico de este tipo de cola.",
        "solution": "La aprobación es una transacción idempotente: vuelve a leer el estado antes de acreditar, y acredita saldo, registra el movimiento y escribe la auditoría en el mismo bloque atómico. Se suman dos límites antifraude: máximo tres solicitudes pendientes por usuario y referencias de pago no reutilizables."
      },
      {
        "problem": "El aviso al canal de Telegram estaba en el camino del dinero: si Telegram fallaba, la solicitud de recarga se caía con él.",
        "solution": "El módulo de avisos no lanza nunca. La solicitud se guarda primero y el aviso se intenta después; si Telegram no responde, el administrador la ve igual en el panel. El dinero del cliente no puede depender de la disponibilidad de un bot."
      },
      {
        "problem": "El menú del panel de cliente tiene nueve destinos y la barra inferior de móvil solo admite cuatro sin aplastar los textos, así que Historial, Afiliados, API, Garantía y Soporte quedaban inalcanzables desde el teléfono, que es por donde entra la mayoría.",
        "solution": "Los cuatro destinos fijos se seleccionan por `href` y no por posición (antes un `slice(0, 4)` expulsaba «Saldo» al insertar una entrada nueva), y un quinto botón abre el resto en una hoja, el patrón que usan las apps nativas. El botón «Más» se marca activo cuando la ruta actual está dentro de la hoja."
      },
      {
        "problem": "`firebase-admin` es CommonJS y al empaquetarlo Next rompía la interoperabilidad: `AggregateField` llegaba como `undefined` y cualquier consulta con `sum()` reventaba solo en producción.",
        "solution": "Se declaró en `serverExternalPackages` para que se cargue en tiempo de ejecución tal cual lo publica el paquete. El fallo era invisible en local, que es la peor forma de encontrarlo."
      },
      {
        "problem": "Cada despliegue dejaba una imagen de contenedor nueva en Artifact Registry; en dos días de trabajo se acumularon 5,5 GB en 22 imágenes, el único coste real del proyecto.",
        "solution": "Una política de limpieza documentada en `infra/artifact-cleanup.json`: nunca borrar una imagen etiquetada (Cloud Run sirve por etiqueta), conservar las tres más recientes y borrar las huérfanas. La imagen viva queda protegida dos veces."
      }
    ],
    "metrics": [
      {
        "value": "28",
        "label": "Pantallas (page.tsx)"
      },
      {
        "value": "36",
        "label": "Rutas de API en el servidor"
      },
      {
        "value": "16",
        "label": "Colecciones de Firestore"
      },
      {
        "value": "54",
        "label": "Componentes React"
      },
      {
        "value": "22",
        "label": "Ficheros de test con node:test"
      },
      {
        "value": "~40.000",
        "label": "Líneas de TypeScript en la web"
      },
      {
        "value": "11",
        "label": "Pantallas en la app Flutter de admin"
      },
      {
        "value": "6",
        "label": "Métodos de recarga configurados"
      }
    ],
    "brand": {
      "primary": "#7a3fc4",
      "secondary": "#421f6e",
      "accent": "#f0547e",
      "bg": "#faf9fd",
      "surface": "#ffffff",
      "text": "#211a2e",
      "gradient": "linear-gradient(135deg, #421f6e 0%, #7a3fc4 42%, #f0547e 78%, #fc8484 100%)",
      "mood": "Optimista y de producto: violeta profundo que abre a magenta y coral, como una flecha que despega. Neutros entintados de violeta para que ningún gris se vea sucio al lado de la marca, superficies blancas con sombras muy difusas de tinte morado, esquinas muy redondeadas (hasta 2rem) y un punto cian (#6bc5dc) usado con cuentagotas. Los semánticos (ámbar aviso, esmeralda correcto, rosa error) se dejan fuera de la marca a propósito: un aviso de riesgo no debe teñirse de violeta. Tema claro forzado con `color-scheme: light`.",
      "source": "/Users/macbook/zocialy/tailwind.config.ts (paleta muestreada píxel a píxel de /Users/macbook/zocialy/public/icon-zocialy.png; replicada en /Users/macbook/zocialy_admin/lib/core/theme/zocialy_theme.dart y en /Users/macbook/zocialy/src/app/globals.css)"
    },
    "links": {
      "web": "https://zocialy-47c9c.web.app"
    },
    "uiScreens": [
      {
        "name": "Landing — hero «Haz que tus redes despeguen»",
        "describe": "Fondo blanco roto (#faf9fd) con una aurora de manchas violeta y coral muy desenfocadas que derivan lentamente, más una cuadrícula tenue de líneas violeta al 7 % cada 56 px. Rejilla de dos columnas (1.05fr / 1fr). Izquierda: píldora blanca translúcida con borde violeta claro y texto «Más de 5.000 servicios en 6 plataformas» precedido de una chispa coral; debajo un titular extrabold de hasta 60 px en gris violáceo casi negro (#211a2e) donde la palabra «despeguen» va rellena con el degradado de marca y subrayada por un trazo SVG curvo de violeta a coral que imita la flecha del logo; párrafo gris a 18 px; dos botones en cápsula —uno relleno con el degradado #7a3fc4 → #f0547e, texto blanco y sombra difusa, y otro de borde gris sobre blanco translúcido con «Ver precios»—; y una fila de tres garantías con visto verde esmeralda: «Sin suscripción», «Sin pedir tu contraseña», «Soporte en español». Derecha: una tarjeta blanca al 80 % con desenfoque de fondo, esquinas de 2rem y sombra elevada, que se inclina 3D al pasar el ratón; dentro, la etiqueta «Seguidores · últimas 12 semanas», un contador grande que sube hasta 48.920 con easing exponencial, una insignia verde «▲ 312 %», y una curva SVG que se dibuja sola y termina con una caída deliberada, explicada al pie en 11 px: «Incluida la corrección natural del final: así se comporta una cuenta real». Sobre la tarjeta flotan dos pastillas blancas pequeñas con icono en cuadrado coral («Entrega iniciada · hace 2 segundos») que suben y bajan con retardos distintos para no ir sincronizadas."
      },
      {
        "name": "Panel del cliente — dashboard",
        "describe": "Barra lateral fija de 240 px, blanca con borde derecho gris, con el lockup arriba y nueve enlaces en cápsula (Dashboard, Los más pedidos, Nueva orden, Historial, Saldo, Afiliados, API, Garantía (refill), Soporte); el activo se rellena con el degradado de marca y texto blanco. Al pie de la barra, una nota sobre fondo coral muy claro: «Las métricas pueden fluctuar tras la entrega. Consulta la política de refill antes de comprar». Contenido sobre #faf9fd: cabecera de página, luego una tarjeta ancha de saldo con el importe en dólares en cifras grandes tabulares y un botón «Recargar» en degradado; debajo una rejilla de cuatro tarjetas blancas de métrica con icono en círculo violeta claro, cifra extrabold y etiqueta gris —«Pedidos activos», «Completados», «Tasa de entrega» en porcentaje con coma decimal, «Refills aprobados»—, todas calculadas con agregaciones de servidor. Después, una tira horizontal de productos destacados con tarjetas que muestran red, nombre del servicio, escalones de cantidad seleccionables en pastillas y precio ya con descuento. Al final, la tabla de últimos pedidos con columnas Pedido (id monoespaciado de 8 caracteres), Servicio, Cantidad, Importe alineado a la derecha y Estado como insignia de color (ámbar pendiente, violeta en progreso, esmeralda completado, rosa cancelado). En móvil la lateral desaparece y queda una barra inferior de cinco botones, el quinto abre el resto del menú en una hoja."
      },
      {
        "name": "Nueva orden — cascada y puerta de pago",
        "describe": "Dos columnas sobre fondo claro. Izquierda, una tarjeta blanca de esquinas grandes con la cascada: selector de red social (fila de pastillas con el icono de cada plataforma en su propio degradado: Instagram amarillo→rosa→violeta, TikTok cian→negro→rojo, YouTube rojos, Facebook azules, X grises a negro, Telegram azul cielo), luego categoría, luego un combobox de servicio con buscador; después el campo de enlace con guía por métrica bajo la etiqueta («el enlace debe apuntar a un Reel, no al perfil») y el error de forma mostrado al perder el foco, no al enviar; y el campo de cantidad con mínimo y máximo del servicio. Derecha, la columna de pago: resumen con tarifa por mil, cantidad, descuento aplicado e importe final en grande; inmediatamente debajo, y nunca plegable, el bloque de aviso de riesgo sobre fondo ámbar muy claro con borde ámbar e icono de triángulo, con el texto legal literal en negrita inicial —«Aviso importante:»— y un enlace a la política de refill, más tres viñetas sobre tiempos de entrega, fluctuación de 72 h y ventana de garantía; y a continuación una casilla de aceptación que es la única llave del botón «Confirmar pedido», que aparece en gris deshabilitado hasta que se marca y pasa entonces al degradado violeta-coral. Bajo el botón, el saldo disponible y lo que quedará después."
      },
      {
        "name": "Administración — resumen",
        "describe": "Barra lateral oscura (#211a2e) de 240 px con el lockup en blanco y doce enlaces (Resumen, Métricas, Recargas, Pedidos, Retiros, Usuarios, Servicios, Destacados, Transacciones, Tickets, Auditoría, Ajustes); el activo se marca con un fondo blanco al 10 %. Cabecera «Resumen» con el subtítulo «Cifras calculadas en servidor sobre todo el histórico» y un botón «Sincronizar catálogo» en cápsula degradada. Debajo, una rejilla de ocho tarjetas de estadística blancas con borde gris muy claro y sombra suave: «Facturación total» en dólares, «Pedidos activos» con tono ámbar, «Tasa de entrega» en verde con porcentaje de un decimal y coma, «Refills en revisión» en rosa cuando hay alguno, más «Pedidos totales», «Usuarios registrados», «Cuentas suspendidas» y «Saldo en circulación» con la nota «Deuda pendiente con clientes». Cada tarjeta muestra un guion largo mientras carga, nunca un cero. Al pie, un panel blanco «Últimos pedidos» con enlace «Ver todos» en violeta y una tabla de seis columnas —id monoespaciado, cliente truncado, servicio truncado, importe a la derecha en cifras tabulares, insignia de estado y fecha— con las filas resaltadas en gris al pasar el ratón."
      },
      {
        "name": "Administración — métricas del sitio",
        "describe": "Cabecera «Métricas» con el subtítulo «Tráfico, embudo de conversión e ingresos. Los días se cortan en UTC» y, a la derecha, un grupo de segmentos en cápsula blanca donde el rango elegido (7, 14, 30 días) se rellena con el degradado de marca, más un botón «Actualizar» con icono de recarga que gira mientras carga. Primera sección, «Hoy, comparado»: tres tarjetas blancas —Vistas de página, Sesiones, Visitantes nuevos— donde ninguna cifra aparece sola: bajo el número grande van la de ayer y la media de los siete días previos con su variación en verde o rosa. Debajo, una nota gris: «El día va por las 14 h de 24 (UTC)». Después, dos sparklines SVG dibujados a mano sin librería, de 300×72, con la línea en violeta y un relleno degradado que se desvanece hacia abajo, cada uno acompañado de su resumen en texto (máximo, media, total) y una tabla plegada con los valores día a día. Al final, listas ordenadas con barra de proporción: páginas más vistas, países y fuentes de tráfico, cada fila con su nombre, su valor, su porcentaje y una barra violeta escalada contra el mayor valor de la lista, marcada como decorativa porque el texto ya lo dice todo. Cuando aún no hay eventos, en lugar de ceros aparece un panel que explica que la analítica cuenta desde su instalación y qué comprobar si sigue vacía."
      }
    ],
    "visualConcept": "Semilla: un panel de métricas social con contadores y barras que crecen; aquí se lleva al extremo hasta que la landing entera se comporta como un dashboard vivo que se rellena delante de quien lo mira. Fondo #faf9fd con una cuadrícula de líneas violeta al 7 % cada 56 px y dos manchas de aurora —violeta #7a3fc4 y coral #fc8484— muy desenfocadas que derivan en un bucle de 22 s usando solo `transform`, sin repintar nada. Sección 1, HERO PARTIDO: a la izquierda el titular con la palabra clave rellena de degradado #421f6e → #7a3fc4 → #f0547e → #fc8484 y subrayada por un trazo SVG que se dibuja con `pathLength=\"1\"` en 900 ms; a la derecha, la pieza firma del proyecto: una tarjeta de cristal (blanco al 80 %, `backdrop-blur`, esquinas de 2rem) que se inclina hasta 6° siguiendo el puntero mediante variables CSS, con un contador que sube de 0 a su cifra con easeOutExpo en 1,6 s y una curva de crecimiento que termina en una caída deliberada, rotulada como «la corrección natural» —el proyecto vende honestidad, no una recta perfecta—. Sección 2, MURO DE BARRAS: ocho columnas verticales en degradado violeta→coral que crecen desde cero hasta su altura real al entrar en pantalla, cada una con 60 ms de retardo escalonado, coronadas por su cifra que cuenta a la vez; las barras nacen redondeadas arriba y con una sombra difusa morada. Sección 3, MARQUESINA DE PLATAFORMAS: dos filas que se desplazan en direcciones opuestas a 38 s por vuelta, con las pastillas de Instagram, TikTok, YouTube, Facebook, X y Telegram, cada una en su propio degradado, con los bordes del contenedor desvanecidos por máscara y pausa al pasar el ratón. Sección 4, LA BARRERA: sobre fondo ámbar muy claro, una recreación del bloque de aviso de riesgo con su casilla y un botón que permanece gris y solo se enciende al degradado cuando se marca, para que el visitante sienta la regla en lugar de leerla. Sección 5, ARQUITECTURA: un diagrama en tres columnas —navegador, Cloud Run, Firestore— con una flecha animada que muestra cómo el importe enviado por el cliente se descarta y se recalcula en el servidor; sobre la flecha, un anillo que pulsa (escala 0,85 → 1,6 con desvanecido, 2,4 s) marcando la transacción atómica. Sección 6, TIRA DE MÉTRICAS del repositorio (28 pantallas, 36 rutas de API, 16 colecciones, 22 tests) como contadores que arrancan al entrar en viewport. Reglas transversales: todo el movimiento es `transform` y `opacity`, cero librerías de animación, revelado por `IntersectionObserver` que se desconecta tras disparar, y `prefers-reduced-motion` fuerza el estado final para que nada del contenido dependa de la animación. Frente a otras landings del portafolio, esta se distingue por ser clara, no oscura; por su violeta que abre a coral en lugar de acentos fríos; y porque el elemento dominante no es una captura ni un mockup de teléfono, sino números que crecen y barras que se levantan.",
    "statusShort": "En producción",
    "categoryShort": "Plataforma web",
    "media": [
      {
        "src": "/proyectos/zocialy/logo-zocialy.png",
        "kind": "logo",
        "caption": "Lockup completo de Zocialy: isotipo en degradado violeta a coral junto al wordmark."
      },
      {
        "src": "/proyectos/zocialy/icon-zocialy.png",
        "kind": "icon",
        "caption": "Isotipo original a alta resolución; de esta imagen se muestreó píxel a píxel toda la paleta del producto."
      },
      {
        "src": "/proyectos/zocialy/zocialy-isotipo.png",
        "kind": "icon",
        "caption": "Isotipo suelto, separado del wordmark para poder componer el lockup horizontal de la navegación sin deformar nada."
      },
      {
        "src": "/proyectos/zocialy/zocialy-wordmark.png",
        "kind": "logo",
        "caption": "Wordmark suelto en imagen, no en texto, para conservar la tipografía original de la marca."
      },
      {
        "src": "/proyectos/zocialy/icon-512.png",
        "kind": "icon",
        "caption": "Icono de aplicación 512×512 declarado en el manifest de la PWA."
      },
      {
        "src": "/proyectos/zocialy/icon-192.png",
        "kind": "icon",
        "caption": "Icono de aplicación 192×192 del manifest."
      },
      {
        "src": "/proyectos/zocialy/favicon-32.png",
        "kind": "icon",
        "caption": "Favicon de 32 píxeles."
      },
      {
        "src": "/proyectos/zocialy/logo.png",
        "kind": "logo",
        "caption": "El mismo lockup empaquetado como asset de la app Flutter de administración."
      }
    ]
  },
  {
    "slug": "epale",
    "name": "Épale",
    "tagline": "Mensajería cifrada y pagos en el mismo chat",
    "category": "App móvil de mensajería y pagos",
    "year": "2025 — 2026",
    "role": "Desarrollo móvil Flutter: arquitectura por features, módulo de pagos/KYC y sincronización offline",
    "status": "En desarrollo activo (versión 0.10.7+109, rama de trabajo AS-fix/-improvements)",
    "summary": [
      "Épale es una app móvil Flutter que une, en una sola conversación, mensajería estilo WhatsApp y pagos reales en bolívares: la misma burbuja donde escribes es la que envía dinero, solicita un cobro o muestra el recibo de la transacción.",
      "El proyecto está construido con Clean Architecture estricta (domain → infrastructure → presentation) sobre 7 módulos de features, 710 archivos Dart y unas 142.000 líneas, con Riverpod para estado, go_router para 58 rutas con redirecciones según sesión, y get_it + injectable para inyección de dependencias generada por código.",
      "La base local es una SQLite cifrada con SQLCipher (9 tablas, migración 30) cuya clave se genera por dispositivo con Random.secure() y vive en el llavero seguro: la app funciona sin conexión y el socket, la cola de emisiones pendientes y el sincronizador en segundo plano reconcilian todo al reconectar.",
      "El módulo de pagos suma verificación de identidad (KYC con escaneo de documento y prueba de vida facial), PIN y biometría, QR de cobro cifrado con AES-256-GCM, pagos agendados, pago a usuario, recargas de servicios y conversión Bs/USD con tasa BCV del día.",
      "Todo el producto está localizado en español, inglés y portugués (1.562 claves de traducción) y cuenta con 18 pruebas E2E Patrol que automatizan el recorrido real en un teléfono físico, incluidos los diálogos nativos de permisos."
    ],
    "problem": "En Venezuela, pagar a otra persona significa salir del chat, abrir el banco, copiar datos, hacer la transferencia y volver a la conversación a mandar una captura como comprobante. Ese ida y vuelta rompe la conversación, genera errores de tipeo en cédulas y cuentas, y deja el 'recibo' como una imagen que nadie puede verificar. A eso se suma que un mensajero con dinero adentro necesita algo que las apps de chat comunes no piden: identidad verificada, PIN, biometría, cifrado del historial y funcionamiento con conectividad intermitente.",
    "solution": "Épale convierte el pago en un tipo de mensaje más. Desde el menú '+' del chat se elige 'Pago' o 'Solicitar pago', se abre una hoja con monto en doble moneda (Bs y USD a tasa BCV), subtotal, comisión bancaria y total, se confirma con PIN, biometría u OTP, y el resultado queda como una burbuja de pago dentro de la conversación, con su estado (pendiente, en proceso, exitoso, rechazado, fallido) y su detalle consultable. Alrededor de eso se construyó lo que hace viable ese flujo: KYC obligatorio antes del primer pago, QR de cobro cifrados con AES-256-GCM y prefijo propio EPQ1, pagos agendados con recordatorio, historial de transacciones y ajustes de seguridad, todo sobre una base de datos local cifrada y un motor de mensajes que tolera la pérdida de conexión.",
    "highlights": [
      {
        "title": "El pago vive dentro del chat",
        "description": "Los tipos de mensaje receipt_payment y receive_payment son ciudadanos de primera clase del pipeline: se emiten por Socket.IO, se guardan en la tabla payments de la base local y se pintan como una burbuja con monto, concepto, comisión y equivalente en dólares.",
        "icon": "MessagesSquare"
      },
      {
        "title": "Billetera con KYC, PIN y biometría",
        "description": "La sección Pagos exige identidad verificada: escaneo del documento con reconocimiento de texto ML Kit, prueba de vida facial con retos (sonreír, parpadear, girar la cabeza, acercarse) y confirmación de cada operación con PIN o local_auth.",
        "icon": "Wallet"
      },
      {
        "title": "QR de cobro cifrado extremo a extremo",
        "description": "Cada QR de cobro se serializa y cifra con AES-256-GCM (IV aleatorio de 12 bytes, prefijo EPQ1) antes de convertirse en imagen, así un lector genérico no puede interpretar ni alterar el payload de pago.",
        "icon": "QrCode"
      },
      {
        "title": "Historial local cifrado con SQLCipher",
        "description": "Nueve tablas (chats, mensajes, contactos, reacciones, pagos, mensajes de IA, perfil, metadata, contactos no registrados) viven en una SQLite cifrada cuya clave de 32 bytes se genera por dispositivo con Random.secure() y se guarda en el almacenamiento seguro del sistema.",
        "icon": "ShieldCheck"
      },
      {
        "title": "Diseñado para conexión intermitente",
        "description": "El socket mantiene una cola de emisiones pendientes que se drena al reconectar, workmanager sincroniza mensajes en segundo plano y la base local es la fuente de verdad de la UI, de modo que la app se usa igual sin señal.",
        "icon": "WifiOff"
      },
      {
        "title": "Mensajes de una sola vista",
        "description": "El modo 'Una vista' abre imágenes, videos y audios en un visor que bloquea capturas de pantalla con screen_protector y se apoya en el sensor de proximidad, marcando el mensaje como visto al cerrarlo.",
        "icon": "EyeOff"
      },
      {
        "title": "Asistente Épale integrado",
        "description": "Un módulo de chat con IA, con su propia instancia de Dio y su tabla de mensajes, resuelve dudas sobre el uso de la app y consultas generales desde una pestaña de conversaciones aparte.",
        "icon": "Sparkles"
      },
      {
        "title": "Tres idiomas y seis temas",
        "description": "1.562 claves traducidas a español, inglés y portugués, más cuatro paletas (turquesa, verde, azul, morado) en variante clara y oscura que el usuario elige desde ajustes de tema.",
        "icon": "Languages"
      }
    ],
    "features": [
      "Chats 1:1 y grupales con respuestas, reacciones, menciones, reenvío, mensajes destacados y fijado de hasta 3 chats",
      "Mensajes de texto, imagen, video, audio, archivo, ubicación, contacto, sistema y de 'una sola vista'",
      "Notas de voz con forma de onda, reproductor global flotante y reproducción al oído por sensor de proximidad",
      "Cámara integrada, escáner de documentos, edición de imágenes con dibujo y texto superpuesto, y compresión antes de subir",
      "Registro por teléfono con SMS: envío de código, autocompletado del OTP y creación de perfil",
      "Sincronización de contactos del teléfono, invitaciones por SMS, contactos privados por PIN Épale y por QR",
      "Envío de pagos y solicitudes de cobro desde el propio chat, con concepto y comisión desglosada",
      "Verificación KYC en 5 pasos con escaneo de cédula y prueba de vida facial",
      "Generación de QR de cobro con vencimiento, detalle, edición y compartido por chat",
      "Pago o cobro escaneando el QR de otro usuario",
      "Pagos agendados a contactos, con recordatorio push y ejecución confirmada",
      "Pago de servicios y recargas (Movistar, Digitel, Movilnet, Cantv, SimpleTV) con límites por operador",
      "Cuentas bancarias vinculadas, cuenta favorita, historial de transacciones y ajustes de PIN/biometría",
      "Tasas del día BCV en bolívares y euros, con campos de monto en doble moneda",
      "Chat con el Asistente Épale y lista de conversaciones de IA",
      "Búsqueda global de chats, mensajes y contactos, con filtros Todos / Borradores / No leídos / Grupos",
      "Fondos de chat personalizables, temas de color, dispositivos vinculados, usuarios bloqueados y ajustes de datos y almacenamiento",
      "Notificaciones push con canales separados para mensajes y pagos, badge en el ícono y aviso de actualización de la app"
    ],
    "stack": [
      {
        "group": "Núcleo",
        "items": [
          "Flutter (SDK >=3.8.0)",
          "Dart",
          "Material 3",
          "flex_color_scheme",
          "flutter_svg",
          "intl"
        ]
      },
      {
        "group": "Arquitectura y estado",
        "items": [
          "flutter_riverpod",
          "go_router",
          "get_it",
          "injectable",
          "equatable",
          "fpdart",
          "formz",
          "logger"
        ]
      },
      {
        "group": "Datos y tiempo real",
        "items": [
          "dio",
          "socket_io_client",
          "sqflite_sqlcipher",
          "flutter_secure_storage",
          "connectivity_plus",
          "workmanager",
          "flutter_cache_manager"
        ]
      },
      {
        "group": "Pagos, identidad y seguridad",
        "items": [
          "encrypt (AES-256-GCM)",
          "crypto",
          "local_auth",
          "smart_auth",
          "mobile_scanner",
          "qr_code_scanner_plus",
          "qr_flutter",
          "google_mlkit_face_detection",
          "google_mlkit_text_recognition",
          "cunning_document_scanner",
          "screen_protector",
          "proximity_sensor"
        ]
      },
      {
        "group": "Multimedia",
        "items": [
          "camera",
          "just_audio",
          "record",
          "audio_waveforms (fork local en packages/)",
          "waveform_flutter",
          "video_player",
          "wechat_assets_picker",
          "image_cropper",
          "flutter_image_compress",
          "blurhash_dart",
          "pdfx",
          "emoji_picker_flutter",
          "gal"
        ]
      },
      {
        "group": "Firebase y notificaciones",
        "items": [
          "firebase_core",
          "firebase_messaging",
          "firebase_analytics",
          "flutter_local_notifications",
          "app_badge_plus"
        ]
      },
      {
        "group": "Contactos y telefonía",
        "items": [
          "flutter_contacts",
          "phone_numbers_parser",
          "flutter_libphonenumber",
          "country_code_picker",
          "sim_reader",
          "receive_sharing_intent",
          "share_plus"
        ]
      },
      {
        "group": "Calidad y entrega",
        "items": [
          "patrol (E2E)",
          "mocktail",
          "flutter_lints",
          "build_runner",
          "injectable_generator",
          "flutter_launcher_icons",
          "flutter_native_splash",
          "Jenkins"
        ]
      }
    ],
    "architecture": "Clean Architecture por features. Cada módulo (auth, chat, payments, ai_chat, camera, home, shared) se divide en domain (entidades, contratos de repositorio y casos de uso, sin imports de framework), infrastructure (implementaciones, datasources remotos y locales, mappers y errores propios) y presentation (pantallas, widgets y providers de Riverpod). La navegación es un go_router único con 58 rutas y redirecciones que fuerzan la secuencia registro → OTP → perfil → home. La capa de red usa tres instancias de Dio (API, almacenamiento con timeouts largos y servicio de IA) con refresco automático de token ante un 401 y verificación de conectividad previa. El tiempo real corre sobre Socket.IO autenticado con Bearer, con 15 tipos de evento y una cola de emisiones pendientes que se drena al reconectar. La persistencia es SQLite cifrada con SQLCipher (9 tablas, versión de esquema 30) con streams por chatId para actualizar la UI, y las credenciales y claves viven en flutter_secure_storage. Las dependencias se registran con get_it + injectable generados por build_runner, y la configuración de entorno (API, socket, almacenamiento, servicio de IA y KYC) llega por flutter_dotenv.",
    "challenges": [
      {
        "problem": "Los mensajes enviados mientras el teléfono estaba sin señal se perdían o llegaban desordenados al volver la conexión.",
        "solution": "La base local cifrada pasó a ser la fuente de verdad: el mensaje se persiste como 'enviando' y se pinta de inmediato, mientras el socket acumula las emisiones en una cola pendiente que se drena al reconectar y workmanager corre una sincronización en segundo plano que reconcilia el historial contra el último id conocido."
      },
      {
        "problem": "En la sincronización de mensajes creados por el servidor mientras el usuario estaba offline, el backend omitía el receiverId en los chats 1:1, así que el remitente no podía resolver con quién era la conversación y el mensaje se descartaba sólo de su lado.",
        "solution": "El parseo de la respuesta de sincronización ahora deriva el receiverId a partir de los miembros del chat (el miembro distinto al emisor) en chats privados de dos personas, evitando la llamada de creación de chat con id vacío que devolvía 400."
      },
      {
        "problem": "Un QR de cobro es un objeto público: cualquiera puede fotografiarlo y un lector genérico podría leer o alterar monto y destinatario.",
        "solution": "El payload se cifra con AES-256-GCM usando un IV aleatorio de 12 bytes y se codifica en base64url con el prefijo propio EPQ1, de modo que sólo la app reconoce y descifra el código; un escáner cualquiera sólo ve una cadena opaca."
      },
      {
        "problem": "El historial de chat y de pagos queda en el teléfono, un dispositivo que puede perderse o clonarse.",
        "solution": "Toda la base SQLite se cifra con SQLCipher y la clave de 32 bytes se genera una sola vez por dispositivo con Random.secure() y se guarda en el almacenamiento seguro del sistema, nunca en el código ni en el servidor."
      },
      {
        "problem": "Las solicitudes de pago programadas debían dispararse a una hora exacta aunque la app estuviera cerrada y sin conexión, algo que el cliente no puede garantizar.",
        "solution": "Se implementó un motor local de mejor esfuerzo (sondeo cada 30 segundos mientras la app vive, más disparo al volver al primer plano) apoyado en la cola de mensajes pendientes para la durabilidad, y se documentó explícitamente que la ejecución garantizada corresponde al backend, que envía un recordatorio push al vencimiento."
      },
      {
        "problem": "Los mensajes de 'una sola vista' pierden todo el sentido si el receptor puede hacer una captura de pantalla.",
        "solution": "El visor seguro bloquea capturas con screen_protector mientras está abierto, se apoya en el sensor de proximidad para la reproducción al oído y marca el contenido como visto al cerrarse, dejando la burbuja en estado 'Visto'."
      },
      {
        "problem": "Probar de verdad un flujo que mezcla SMS, permisos nativos de contactos y envío de mensajes reales es imposible con tests de widget.",
        "solution": "Se montó una suite E2E con Patrol (18 archivos, page objects por pantalla) que corre en un teléfono físico, atraviesa los diálogos nativos del sistema, usa un datasource de autenticación falso para saltarse el SMS real y muestra un HUD en pantalla con el estado de cada paso."
      }
    ],
    "metrics": [
      {
        "value": "710",
        "label": "archivos Dart"
      },
      {
        "value": "~142k",
        "label": "líneas de código"
      },
      {
        "value": "7",
        "label": "módulos de features"
      },
      {
        "value": "58",
        "label": "rutas en go_router"
      },
      {
        "value": "45",
        "label": "pantallas"
      },
      {
        "value": "143",
        "label": "providers de Riverpod"
      },
      {
        "value": "9",
        "label": "tablas SQLCipher (esquema v30)"
      },
      {
        "value": "15",
        "label": "tipos de evento Socket.IO"
      },
      {
        "value": "12",
        "label": "tipos de mensaje soportados"
      },
      {
        "value": "3",
        "label": "idiomas (es, en, pt)"
      },
      {
        "value": "1.562",
        "label": "claves de traducción"
      },
      {
        "value": "18",
        "label": "pruebas E2E con Patrol"
      }
    ],
    "brand": {
      "primary": "#02AFAA",
      "secondary": "#345A66",
      "accent": "#47EBAF",
      "bg": "#FDFDFD",
      "surface": "#FFFFFF",
      "text": "#181D27",
      "gradient": "linear-gradient(135deg, #345A66 0%, #02AFAA 60%, #47EBAF 100%)",
      "mood": "Turquesa confiable: el verde azulado de una app financiera seria, suavizado por aguamarinas luminosos (#A9FFF0, #47EBAF) y grises muy claros. Superficies blancas, esquinas redondeadas de 12 px, tipografía sans de sistema y el wordmark 'épale' en minúsculas y trazo redondo sobre el degradado teal.",
      "source": "/Users/macbook/epale-mobile/lib/config/theme/app_theme.dart (clase AppColors: primary #02AFAA, darkGreen #345A66, green_600 #47EBAF, lightGreen #A9FFF0, gray_25 #FDFDFD, gray_900 #181D27; ThemeExtension GradientColors linearOne #345A66 → linearTwo #02AFAA) y /Users/macbook/epale-mobile/flutter_native_splash.yaml (color de splash #1D8387)"
    },
    "links": {},
    "uiScreens": [
      {
        "name": "Mensajes (lista de chats)",
        "describe": "Fondo casi blanco (#FDFDFD). Arriba, el título 'Mensajes' en gris muy oscuro (#252B37, 24 px, semibold) y a su derecha un botón circular con el ícono de chat nuevo sobre relleno turquesa (#02AFAA). Debajo, una barra de búsqueda redondeada con borde gris de 0,6 px y placeholder 'Buscar...'. Luego una fila horizontal de chips de filtro: 'Todos', 'Borradores', 'No leídos (3)', 'Grupos (2)'; el chip activo va en turquesa relleno con texto blanco y los demás en blanco con borde gris claro. El cuerpo es la lista de conversaciones: cada fila tiene avatar circular de 48 px, nombre en semibold 15 px, y debajo una línea de vista previa en gris (#717680) que cambia según el estado —'Escribiendo...' en turquesa, 'Borrador: ' en rojo suave, o etiquetas de tipo como 'Foto', 'Nota de voz', 'Pago #1042'—; a la derecha, la hora en 12 px gris y, si hay mensajes sin leer, un círculo turquesa con el número en blanco. Los chats fijados muestran un pequeño ícono de chincheta y un fondo apenas gris. Al deslizar una fila aparecen acciones ('Fijar chat', 'Eliminar chat', 'Opciones'). Abajo, una barra de navegación blanca con tres destinos: Chats (ícono de burbuja, activo en turquesa), Pagos (ícono de tarjeta) y Perfil (ícono de persona), cada uno con su etiqueta en 11 px."
      },
      {
        "name": "Conversación con burbuja de pago",
        "describe": "Pantalla de chat con imagen de fondo suave (uno de los doce fondos, patrón claro con tinte turquesa). Barra superior con flecha de retroceso, avatar circular, nombre del contacto en semibold y, debajo, 'Escribiendo...' o 'En línea' en 12 px turquesa; a la derecha, íconos de búsqueda y menú. Las burbujas enviadas se alinean a la derecha, en turquesa sólido (#02AFAA) con texto blanco, esquinas de 16 px con la punta inferior derecha recortada, ancho máximo del 75 % de la pantalla, hora en blanco al 70 % y doble check. Las recibidas van a la izquierda en blanco puro (en tema oscuro, #252B37), texto casi negro y hora gris. Intercalada, una burbuja de pago: mismo turquesa, encabezado 'Pago' con ícono de recibo, monto grande 'Bs. 1.250,00' en blanco bold 22 px, debajo en 12 px 'Subtotal: Bs. 1.225,00', 'Comisión Bancaria (2%): Bs. 25,00' separados por una línea blanca al 30 % de opacidad, el equivalente '≈ 6,94 $' y el concepto 'Almuerzo del viernes'; al pie, un botón de ancho completo con fondo blanco al 20 % y texto blanco 'Ver detalle'. También aparece una burbuja verde de solicitud de cobro con el rótulo 'Solicitud de pago' y el botón 'Pagar'. Abajo, la barra de entrada: campo redondeado blanco con placeholder 'Escribe un mensaje...', a la izquierda un botón '+' que despliega el menú Cámara / Galería / Documento / Contacto / Pago / Solicitar pago, y a la derecha el ícono de emoji, la cámara y un botón circular turquesa con el ícono de micrófono que se convierte en avión de papel al escribir."
      },
      {
        "name": "Pagos (centro de la billetera)",
        "describe": "Encabezado con el título 'Pagos' en 24 px sobre fondo #FDFDFD. Primero, una tarjeta turquesa sólida de esquinas de 12 px y padding de 16 px: a la izquierda un ícono grande de QR en blanco con un badge circular verde (#00C853) arriba a la derecha mostrando '2'; al centro, en blanco bold, 'QR de Mesa 4' y debajo, al 80 % de opacidad, '2 códigos QR'; a la derecha, alineado a la derecha, 'Bs.1.250,00' en blanco bold y debajo 'QR Finaliza en 1h 20min'. Después, una tarjeta gris muy clara con el rótulo 'Tasas del día 07/09/2026 valor BCV' en 12 px gris y dos cifras grandes en fila: 'USD 36,45' y 'EUR 39,80'. A continuación, una lista de accesos, cada uno como fila con ícono circular gris claro a la izquierda, título en semibold 15 px, subtítulo en gris 13 px y chevron a la derecha: 'Generar QR de cobro / Crea un código QR para recibir un pago.', 'Pago o cobro por QR / Escanea un QR para pagar o cobrar.', 'Pagos agendados / Programa pagos a tus contactos de épale.' con un badge rojo numérico si hay vencidos, 'Pago a usuario / Realiza pagos a tus contactos de épale.', 'Pago de servicios / Realiza pagos de tus servicios.', 'Cuentas vinculadas / Administre sus cuentas bancarias.', 'Historial / Transacciones enviadas y recibidas.' y 'Ajustes / Gestione su PIN y autenticación biométrica.'. Si el usuario no está verificado, al entrar aparece un diálogo 'Verificación requerida' con el texto sobre KYC y los botones 'Cancelar' y 'Verificar ahora' en turquesa."
      },
      {
        "name": "Hoja de pago y confirmación",
        "describe": "Hoja modal que sube desde abajo, esquinas superiores redondeadas de 20 px, fondo blanco y un pequeño tirador gris centrado. Título 'Pago' en 18 px semibold. Campo 'Monto' con doble moneda: dos entradas enlazadas en una fila, la de la izquierda con prefijo 'Bs.' y la de la derecha con prefijo '$', que se recalculan entre sí con la tasa BCV. Debajo, un bloque de resumen en gris 13 px: 'Subtotal: Bs. 1.225,00', 'Comisión Bancaria (2%): Bs. 25,00' y, tras una línea divisoria, 'Total:' en negro bold con 'Bs. 1.250,00' en turquesa a la derecha. Sigue el campo 'Concepto (Opcional)' con borde redondeado de 8 px y un selector de cuenta bancaria con el ícono de banco, el alias de la cuenta favorita preseleccionada y chevron. Al pie, un botón de ancho completo, alto 52 px, esquinas de 12 px, con degradado de #345A66 a #02AFAA y texto blanco 'Confirmar pago'. Al pulsarlo aparece la capa de autenticación: un diálogo de PIN con cuatro casillas cuadradas de 56 px y borde turquesa al enfocar, o la hoja de OTP con seis casillas y autocompletado, y luego la hoja de éxito con un círculo verde con check, 'Pago exitoso', el monto y un ticket con borde perforado (recorte tipo boleto) que muestra referencia, fecha, destinatario y botón 'Compartir comprobante'."
      },
      {
        "name": "Verificación de identidad (KYC + prueba de vida)",
        "describe": "Flujo de cinco pasos en un PageView sin desplazamiento manual. El paso introductorio muestra una ilustración vectorial, el título 'Verificación requerida' y un texto explicando que para pagar hace falta verificar la identidad, con un botón turquesa de ancho completo 'Continuar'. El paso de escaneo del documento abre la cámara con un marco rectangular blanco de esquinas marcadas sobre fondo oscurecido y la instrucción 'Coloca tu cédula dentro del recuadro'; al capturar, el reconocimiento de texto extrae los datos. El paso de prueba de vida muestra el video frontal recortado en un óvalo con un anillo turquesa de 3 px que se completa como barra de progreso alrededor, fondo oscuro al 60 % fuera del óvalo, y una instrucción grande y centrada que va cambiando por reto —'Sonríe', 'Parpadea', 'Gira la cabeza a la izquierda', 'Acércate un poco'— con un check verde que se marca al superar cada uno. El paso final confirma la identidad con un ícono de escudo con check en turquesa y un resumen de los datos leídos del documento, más el botón 'Finalizar'. En error, un mensaje rojo suave (#F97066) y la opción de reintentar desde el escaneo."
      }
    ],
    "visualConcept": "Semilla: burbujas de chat que aparecen en secuencia y una billetera que se abre. Desarrollo para Épale: la landing es una conversación que, al bajar, se convierte en dinero.\n\nPaleta y textura: fondo #FDFDFD con un halo radial turquesa muy tenue arriba a la izquierda; el degradado de marca (135°, #345A66 → #02AFAA → #47EBAF) sólo aparece en el hero, en los botones primarios y en el borde animado de la sección de seguridad. Superficies blancas con sombra suave (0 8px 24px rgba(52,90,102,.08)), radios de 16 px y una tipografía sans geométrica con el wordmark 'épale' en minúsculas.\n\n1) Hero — la secuencia de burbujas. Mitad izquierda: titular 'Chatea. Paga. Sin salir de la conversación.' Mitad derecha: un teléfono en perspectiva ligera (rotateY -8°) cuya pantalla es un chat vacío. Al cargar, cinco burbujas entran en cascada con 220 ms de separación: cada una hace translateY(14px)→0, scale(.94)→1 y opacity 0→1 con cubic-bezier(.22,1,.36,1), y el contenedor empuja las anteriores hacia arriba. Las recibidas (blancas) entran desde la izquierda, las enviadas (turquesa) desde la derecha. Entre burbuja y burbuja parpadea 600 ms el indicador de 'escribiendo' —tres puntos grises que suben y bajan en bucle desfasado 0,15 s—. La quinta burbuja es distinta: es un pago. En vez de sólo aparecer, crece un 6 % extra, emite un pulso de anillo turquesa que se expande y se desvanece (600 ms), y su texto se compone dígito a dígito hasta formar 'Bs. 1.250,00'.\n\n2) Transición a la billetera. Al hacer scroll, esa burbuja de pago se despega del chat, gira 12° y aterriza en el centro del viewport convertida en una tarjeta-ticket con borde perforado (los mismos semicírculos del ticket clipper de la app). Entonces la billetera se abre: dos paneles con el degradado de marca se separan como una cartera de cuero (rotateX de 0° a -55° el superior, +55° el inferior, transform-origin en el pliegue central, 700 ms), y de dentro emergen escalonadas tres piezas —un QR que se dibuja celda por celda en 40 pasos, una tarjeta de cuenta vinculada y el ticket del pago— cada una con su propio retardo de 120 ms. Con prefers-reduced-motion, la apertura se resuelve como un simple fundido y las burbujas aparecen ya colocadas.\n\n3) Cifras. Franja oscura (#0A0D12) con las métricas contables en cifras grandes turquesa que suben con un contador al entrar en viewport: 710 archivos Dart, 58 rutas, 9 tablas cifradas, 15 eventos de socket, 3 idiomas, 18 pruebas E2E.\n\n4) Seguridad — el candado del historial. Tarjeta ancha con el fondo cubierto por una malla de caracteres monoespaciados que, al entrar en pantalla, se 'cifran': cada carácter cicla entre glifos aleatorios durante 500 ms y se congela en un bloque base64 ilegible, mientras un borde con el degradado de marca recorre el perímetro. Encabezado: SQLCipher, clave por dispositivo, AES-256-GCM en los QR, PIN y biometría.\n\n5) Arquitectura. Diagrama por capas dibujado con SVG: tres bandas horizontales (domain / infrastructure / presentation) y, encima, siete cápsulas de módulo (auth, chat, payments, ai_chat, camera, home, shared). Al pasar el cursor por una cápsula, se iluminan en turquesa las líneas que la atraviesan y las demás bajan al 25 % de opacidad. Una línea punteada que representa el socket viaja en bucle de infrastructure a presentation con un punto luminoso.\n\n6) Pantallas. Carrusel horizontal de mockups (lista de chats, conversación con pago, centro de pagos, hoja de pago, prueba de vida) montados en marcos de teléfono; el mockup central está al 100 % y los laterales al 88 % con desenfoque de 2 px, y la transición usa un desplazamiento con inercia.\n\n7) Cierre. Sobre el degradado de marca, una última burbuja turquesa escribe letra a letra el tagline y, al terminar, aparece el doble check blanco. Distintivo frente a las demás landings del portafolio: aquí la narrativa no son secciones apiladas sino una sola conversación que avanza, y el único elemento tridimensional de toda la página es el pliegue de la billetera al abrirse.",
    "statusShort": "En desarrollo",
    "categoryShort": "Fintech",
    "media": [
      {
        "src": "/proyectos/epale/epale_logo.png",
        "kind": "logo",
        "caption": "Wordmark 'épale' en minúsculas, versión clara usada en la pantalla de splash sobre el degradado turquesa"
      },
      {
        "src": "/proyectos/epale/epale_logo.webp",
        "kind": "logo",
        "caption": "Logotipo de Épale en formato webp, el que usan las pantallas internas"
      },
      {
        "src": "/proyectos/epale/app_icon.png",
        "kind": "icon",
        "caption": "Ícono de la aplicación para Android e iOS (fuente de flutter_launcher_icons)"
      },
      {
        "src": "/proyectos/epale/app_icon_12_support_white.webp",
        "kind": "icon",
        "caption": "Variante monocroma blanca del ícono para el splash de Android 12+"
      },
      {
        "src": "/proyectos/epale/light_gradient_background.png",
        "kind": "background",
        "caption": "Fondo degradado turquesa del splash, base cromática de toda la marca"
      },
      {
        "src": "/proyectos/epale/gradient_background.webp",
        "kind": "background",
        "caption": "Degradado oscuro usado como fondo de las pantallas de autenticación"
      },
      {
        "src": "/proyectos/epale/light_gradient_background.webp",
        "kind": "background",
        "caption": "Degradado claro para las pantallas de autenticación en tema claro"
      },
      {
        "src": "/proyectos/epale/fondo-1.png",
        "kind": "background",
        "caption": "Uno de los doce fondos de conversación que el usuario puede elegir para sus chats"
      },
      {
        "src": "/proyectos/epale/epale_coin.svg",
        "kind": "icon",
        "caption": "Ícono de la moneda Épale, usado en el módulo de pagos"
      },
      {
        "src": "/proyectos/epale/fondo-ai.svg",
        "kind": "background",
        "caption": "Fondo vectorial de la sección del Asistente Épale (chat con IA)"
      },
      {
        "src": "/proyectos/epale/devices.svg",
        "kind": "illustration",
        "caption": "Ilustración de dispositivos vinculados"
      },
      {
        "src": "/proyectos/epale/message_loading.gif",
        "kind": "animation",
        "caption": "Animación de carga mientras se envía o sincroniza un mensaje"
      }
    ]
  },
  {
    "slug": "cliff-pickleball",
    "name": "Cliff Pickleball",
    "tagline": "Red social y mensajería cifrada para la comunidad del pickleball",
    "category": "App móvil social y de mensajería",
    "year": "2024 – 2025",
    "role": "Desarrollador móvil Flutter (arquitectura, integración Firebase, cifrado y capa offline)",
    "status": "Prototipo funcional en rama dev, probado en Android",
    "summary": [
      "Cliff Pickleball es una aplicación Flutter que reúne en un solo binario dos mundos que normalmente viven separados: un mensajero privado uno a uno con cifrado local y un muro social con publicaciones, historias, seguidores y notificaciones.",
      "El objetivo es dar a un club de pickleball su propio espacio: los jugadores se descubren, se conectan mediante solicitudes, publican actividades efímeras (texto, foto, vídeo, audio o encuesta) y conversan sin depender de una red social de terceros.",
      "El proyecto vive en la rama dev del repositorio; la rama main conserva el esqueleto anterior del proyecto. Todo lo descrito aquí corresponde al código real de dev, que declara 78 dependencias en pubspec.yaml y apoya toda la persistencia remota en un proyecto Firebase propio llamado cliff-pickleball.",
      "La app arranca con un splash azul y el isotipo naranja de la marca, y a partir de ahí ofrece tema claro, oscuro o del sistema, wallpapers de chat, respaldo de historial y un panel de almacenamiento donde el usuario revisa qué media ocupa espacio."
    ],
    "problem": "Una comunidad deportiva que quiere coordinarse termina repartida entre grupos de WhatsApp, publicaciones de Instagram y hojas de cálculo: no hay un lugar único donde un jugador descubra a otros del club, les envíe una solicitud de conexión, publique lo que está haciendo hoy y converse en privado. Además, un chat de club maneja fotos, vídeos, notas de voz, ubicaciones y contactos que sus miembros no quieren dejar en manos de una plataforma publicitaria, y buena parte de esas conversaciones deben poder leerse aunque el teléfono esté sin señal en la cancha.",
    "solution": "Se construyó una app Flutter única con dos módulos que comparten sesión de Firebase Auth y navegación: un mensajero privado (pantalla de inicio con buscador, actividades y lista de chats; gestión de conexiones en pestañas Available / Incoming / Sent; conversación con siete tipos de mensaje) y un módulo social con feed, historias, búsqueda, notificaciones y perfil. Cada mensaje y cada actividad se guarda cifrado con AES-CBC en una base sqflite local, de modo que el historial se lee sin conexión, y Firestore actúa solo como canal de sincronización. Las actividades caducan solas: dos tareas periódicas de Workmanager barren cada 15 minutos las que superaron su tiempo de vida y borran a la vez el registro local, el documento en Firestore y el archivo en Firebase Storage.",
    "highlights": [
      {
        "title": "Mensajería con contenido cifrado en el dispositivo",
        "description": "Todo lo que se persiste localmente (mensajes, conexiones, actividades y datos del usuario) pasa por la clase Secure, que aplica AES en modo CBC con relleno PKCS7 antes de escribir en sqflite. La pantalla About lo comunica de forma explícita al usuario.",
        "icon": "ShieldCheck"
      },
      {
        "title": "Chat multiformato con siete tipos de mensaje",
        "description": "Texto, audio grabado en la app, imagen, vídeo con miniatura, documento, ubicación mostrada en Google Maps y contacto de la agenda. Cada opción del panel de adjuntos tiene su propio color de burbuja: cámara morada, galería azul, vídeo celeste, documento rosa, audio ámbar, ubicación verde y contacto naranja.",
        "icon": "MessagesSquare"
      },
      {
        "title": "Actividades efímeras que se limpian solas",
        "description": "Las actividades admiten texto, imagen, vídeo, audio y encuestas de dos o más opciones. Dos tareas periódicas registradas en Workmanager revisan cada 15 minutos las actividades propias y las de las conexiones, y eliminan las expiradas en local, en Firestore y en Storage.",
        "icon": "Timer"
      },
      {
        "title": "Gestión de conexiones en tres pestañas",
        "description": "Un TabController con las vistas Available, Incoming y Sent, cada una alimentada por su propio provider, permite descubrir usuarios disponibles, aceptar solicitudes recibidas y seguir el estado de las enviadas, con buscador y estado vacío 'Not Found'.",
        "icon": "UserPlus"
      },
      {
        "title": "Muro social sobre la misma sesión",
        "description": "Un segundo módulo añade feed de publicaciones, historias con visor y confirmación, búsqueda de usuarios, notificaciones, comentarios, likes y perfil editable, apoyado en colecciones Firestore propias como posts, comments, likes, followers y following.",
        "icon": "Newspaper"
      },
      {
        "title": "Tres modos de tema y personalización del chat",
        "description": "ThemeProvider guarda la preferencia en almacenamiento local y resuelve entre modo sistema, oscuro y claro; el usuario elige además wallpaper de chat entre categorías bright, dark, color sólido o sus propias fotos.",
        "icon": "Palette"
      }
    ],
    "features": [
      "Registro e inicio de sesión con correo y contraseña (con verificación por email obligatoria) o con Google Sign-In",
      "Pantalla de introducción, toma de información de perfil y splash animado con el isotipo de la marca",
      "Inicio con buscador, carrusel de actividades y lista de conversaciones recientes",
      "Gestión de conexiones con pestañas de usuarios disponibles, solicitudes recibidas y solicitudes enviadas",
      "Conversación uno a uno con texto, notas de voz, imágenes, vídeos, documentos, ubicación y contactos",
      "Grabación de audio con visualizador de onda y reproducción integrada",
      "Envío de ubicación actual y visualización a pantalla completa sobre Google Maps",
      "Reenvío de mensajes, selección múltiple y borrado remoto mediante operación especial",
      "Creación de actividades efímeras con texto, foto, vídeo, audio o encuesta de opciones múltiples",
      "Visor de actividades con controlador de progreso y resultados de encuesta",
      "Feed social con publicaciones, comentarios, likes, historias y notificaciones",
      "Búsqueda de usuarios y perfiles públicos con seguidores y seguidos",
      "Perfil editable con foto (recorte incluido), nombre, biografía y correo",
      "Ajustes con tema del sistema/oscuro/claro, wallpaper de chat, historial, almacenamiento, soporte, acerca de e invitar a un amigo",
      "Panel de almacenamiento que separa imágenes y vídeos de audios y documentos",
      "Respaldo y restauración del historial de chat",
      "Notificaciones push con Firebase Cloud Messaging y notificaciones locales, con interruptor para activarlas o desactivarlas",
      "Indicador de estado en línea y última conexión sincronizado con el ciclo de vida de la app",
      "Detección de conectividad con aviso cuando no hay red",
      "Menú lateral de navegación entre Messages, Connect, Settings y Videos",
      "Aviso de nueva versión disponible mediante new_version_plus"
    ],
    "stack": [
      {
        "group": "Framework y lenguaje",
        "items": [
          "Flutter (SDK Dart ^3.5.2)",
          "Material Design",
          "Google Fonts",
          "fuente Poppins empaquetada"
        ]
      },
      {
        "group": "Estado y navegación",
        "items": [
          "provider",
          "flutter_riverpod",
          "flutter_bloc",
          "go_router",
          "routemaster",
          "page_transition",
          "animations",
          "sizer",
          "velocity_x"
        ]
      },
      {
        "group": "Backend y servicios Firebase",
        "items": [
          "firebase_core",
          "firebase_auth",
          "cloud_firestore",
          "firebase_storage",
          "firebase_messaging",
          "firebase_app_check",
          "google_sign_in"
        ]
      },
      {
        "group": "Persistencia local y seguridad",
        "items": [
          "sqflite",
          "shared_preferences",
          "encrypt (AES-CBC/PKCS7)",
          "path_provider",
          "flutter_dotenv"
        ]
      },
      {
        "group": "Multimedia y contenido",
        "items": [
          "image_picker",
          "image_cropper",
          "photo_view",
          "video_player",
          "just_audio",
          "record",
          "file_picker",
          "cached_network_image",
          "lottie",
          "story",
          "any_link_preview",
          "flutter_linkify"
        ]
      },
      {
        "group": "Mapas, dispositivo y sistema",
        "items": [
          "google_maps_flutter",
          "geolocator",
          "geocoding",
          "location",
          "permission_handler",
          "device_info_plus",
          "connectivity_plus",
          "contacts_service",
          "workmanager",
          "flutter_local_notifications",
          "share_plus",
          "url_launcher",
          "new_version_plus"
        ]
      },
      {
        "group": "UI y utilidades",
        "items": [
          "chat_bubbles",
          "flutter_chat_bubble",
          "swipe_to",
          "like_button",
          "percent_indicator",
          "smooth_page_indicator",
          "pull_to_refresh",
          "dotted_border",
          "flutter_colorpicker",
          "awesome_dialog",
          "loading_overlay",
          "flutter_spinkit",
          "fluttertoast",
          "font_awesome_flutter",
          "ionicons",
          "flutter_font_icons",
          "timeago",
          "intl",
          "uuid",
          "fpdart",
          "equatable",
          "logger"
        ]
      }
    ],
    "architecture": "Aplicación Flutter monolítica organizada por capas dentro de lib/: config (paleta, textos, estilos, enums y rutas de imágenes), auth (Google y correo), db_operations (acceso a Firestore y Storage con rutas tipadas en DBPath y StorageHelper), providers (31 ChangeNotifier registrados en un MultiProvider raíz), services (cifrado, base de datos local, permisos, descargas, notificaciones, mapas, archivos y navegación) y screens (120 archivos de interfaz). El árbol de pantallas se divide en tres bloques: entry_screens para splash, intro, registro y toma de datos; los módulos de chat, actividades, conexiones y ajustes; y screens/social_media, un módulo con su propia estructura MVVM (models, services, view_models, widgets) para el feed social. MainScreen actúa como shell: mantiene un Drawer con cuatro destinos y un índice en MainScreenNavigationProvider que conmuta entre HomeScreen, ConnectionManagementScreen, SettingsScreen y el módulo social. La persistencia es doble: sqflite guarda cifradas cuatro tablas locales (usuario actual, conexiones, chats por conexión y actividades) para lectura sin conexión, mientras Firestore y Firebase Storage sincronizan el contenido remoto; Workmanager corre tareas en segundo plano para caducar actividades y Firebase Messaging entrega las notificaciones tanto en primer plano como con la app cerrada.",
    "challenges": [
      {
        "problem": "Fusionar en una sola app dos bases de código con paradigmas distintos: un mensajero construido sobre ChangeNotifier y providers globales, y un módulo social escrito con view models y referencias directas a Firestore.",
        "solution": "Se mantuvo cada módulo con su propio estilo pero se unificó el punto de entrada: un único MultiProvider raíz registra los 31 providers de ambos mundos y MainScreen resuelve por índice qué módulo se muestra, de modo que la sesión de Firebase Auth y el tema se comparten sin reescribir el módulo social."
      },
      {
        "problem": "Las actividades son efímeras y deben desaparecer aunque el usuario no vuelva a abrir la app, y su borrado afecta a tres lugares distintos: sqflite, Firestore y Firebase Storage.",
        "solution": "Dos tareas periódicas de Workmanager (una para las actividades propias y otra para las de las conexiones) se ejecutan cada 15 minutos, comparan la fecha almacenada con el tiempo de vida configurado y encadenan el borrado: primero el archivo remoto en Storage y la miniatura si es vídeo, después el documento en Firestore y por último el registro local."
      },
      {
        "problem": "Permitir leer el historial completo sin conexión sin dejar los mensajes en claro dentro del teléfono.",
        "solution": "Todos los campos que se escriben en sqflite pasan por la clase Secure, que cifra con AES en modo CBC y relleno PKCS7 antes de guardar y descifra al leer; las tablas se crean con nombres internos y las conversaciones se separan en una tabla por conexión, con la clave y el vector de inicialización resueltos en el arranque."
      },
      {
        "problem": "El chat maneja archivos pesados (vídeo, audio, documentos) que hay que subir, cachear y volver a mostrar sin bloquear la interfaz.",
        "solution": "Firebase Storage se organiza con rutas deterministas por par de usuarios (chat/{miId}-{suId}/audio, /images, /videos, /documents, /thumbnails), los vídeos generan miniatura propia, las imágenes remotas se sirven con cached_network_image y las descargas se gestionan en un servicio aparte con overlay de carga."
      },
      {
        "problem": "Soportar tema claro, oscuro y del sistema en una interfaz que decide colores en decenas de widgets distintos.",
        "solution": "En lugar de dos ThemeData, la app centraliza la decisión en AppColors con funciones auxiliares (getBgColor, getChatBgColor, getMsgColor, getIconColor, popUpBgColor, entre otras) que reciben un booleano isDarkMode; ThemeProvider guarda la preferencia y, en modo sistema, la resuelve leyendo el brillo de la plataforma."
      }
    ],
    "metrics": [
      {
        "value": "82",
        "label": "archivos con widgets de pantalla en lib/screens"
      },
      {
        "value": "31",
        "label": "providers registrados en el MultiProvider raíz"
      },
      {
        "value": "15",
        "label": "colecciones Firestore referenciadas"
      },
      {
        "value": "78",
        "label": "dependencias declaradas en pubspec.yaml"
      },
      {
        "value": "7",
        "label": "tipos de mensaje soportados en el chat"
      },
      {
        "value": "5",
        "label": "tipos de contenido en las actividades"
      },
      {
        "value": "4",
        "label": "tablas cifradas en la base local sqflite"
      },
      {
        "value": "3",
        "label": "modos de tema: sistema, oscuro y claro"
      }
    ],
    "brand": {
      "primary": "#0152CD",
      "secondary": "#01BD47",
      "accent": "#F26109",
      "bg": "#15162D",
      "surface": "#2E2D42",
      "text": "#FEFEFF",
      "gradient": "linear-gradient(135deg, #0152CD 0%, #0186FE 45%, #01BD47 100%)",
      "mood": "Deportivo y nocturno: azul cancha profundo como base, verde de acción para todo lo interactivo y un naranja de pelota que aparece solo en los acentos. Superficies casi negras con tinte violáceo, tipografía Poppins redondeada y bordes muy generosos que suavizan el contraste.",
      "source": "lib/config/colors_collection.dart (clase AppColors, rama dev): splashScreenColor 0xff0152cd, lightBorderGreenColor 0xff01bd47, backgroundDarkMode 0xff15162d, searchBarBgDarkMode 0xff2e2d42, backgroundLightMode 0xfffefeff, lightModeBlueColor 0xff0186fe y personIconBgColor 0xffF26109, este último coincidente con el naranja del isotipo en assets/images/channels4_profile.jpg"
    },
    "links": {
      "github": "https://github.com/ArturoSojo/cliff_pickleball",
      "web": "https://www.youtube.com/shorts/NitooJQCq6I"
    },
    "uiScreens": [
      {
        "name": "Splash de arranque",
        "describe": "Fondo completo azul sólido #0152CD, sin barra superior. Centrado verticalmente, un cuadrado blanco de unos 300 px con esquinas rectas que contiene el isotipo de la marca: dos triángulos naranjas #F26109 que forman una figura angular tipo flecha doble, con un pequeño 'TM' azul claro en la esquina inferior derecha. Debajo, a unos 60 px, el texto 'CliffPickleball' en Poppins regular, blanco puro, alrededor de 42 px, sin negrita. Nada más en pantalla; el conjunto queda flotando en el azul."
      },
      {
        "name": "Inicio: actividades y mensajes",
        "describe": "Modo oscuro con fondo #15162D. AppBar plano sin elevación con icono de menú hamburguesa blanco a la izquierda y el título 'CliffPickleball' en Poppins 20 px blanco, ligeramente desplazado hacia el centro-izquierda. Debajo, con márgenes laterales de 20 px, una barra de búsqueda de 50 px de alto, radio de borde 40 px, fondo #2E2D42, icono de lupa blanco a la izquierda y placeholder 'Search' en gris claro. A 25 px, el encabezado 'Activities' en blanco semibold 18 px, y bajo él una fila horizontal de burbujas: avatar circular de unos 80 px con anillo verde #02BA4B de 3 px y, superpuesto en la esquina inferior derecha, un botón circular verde con un '+' blanco para crear actividad; bajo el avatar el nombre truncado ('Arturo so...') en blanco 13 px. Más abajo el encabezado 'Messages' y la lista de conversaciones: avatar circular de 60 px con anillo verde, nombre en blanco semibold 20 px a la derecha, y espacio para el último mensaje y la hora en gris #9FA0A1. El resto de la pantalla queda en vacío oscuro."
      },
      {
        "name": "Gestión de conexiones",
        "describe": "Mismo AppBar oscuro con hamburguesa y título. Centrado bajo él, el título de sección 'Connection Management' en blanco 16 px. Debajo, un TabBar de tres pestañas repartidas a lo ancho: 'Available' activa en azul #0186FE con subrayado azul de 3 px, 'Incoming' y 'Sent' inactivas en blanco; una línea divisoria blanca de 1 px recorre todo el ancho bajo las pestañas. Sigue la misma barra de búsqueda redondeada #2E2D42 con lupa y placeholder 'Search'. El cuerpo, cuando no hay resultados, muestra el texto 'Not Found' en blanco semibold 22 px centrado vertical y horizontalmente sobre el fondo #15162D. Cuando sí hay resultados, se llena con tarjetas de contacto: avatar con anillo verde, nombre y botón de acción para enviar, aceptar o cancelar la solicitud."
      },
      {
        "name": "Ajustes con selector de tema",
        "describe": "En modo claro: fondo #FEFEFF, AppBar gris azulado muy claro #DDE5E6 con hamburguesa y título 'CliffPickleball' en gris #6D6E75. Título 'Settings' en gris 20 px a la izquierda. Lista de filas de unos 70 px de alto, cada una con icono verde #01BD47 a la izquierda (48 px de zona táctil), etiqueta en gris oscuro 20 px y chevron '>' verde a la derecha: App theme (con caret desplegable en vez de chevron), Profile, Settings, Chat WallPaper, Chat History, Storage, Support, About e Invite a Friend. Al desplegar 'App theme' aparecen tres radio buttons circulares verdes indentados: System Theme, Dark Theme y Light Theme, con el seleccionado relleno de verde sólido. Al pie, centrado, 'Created By' en gris con el nombre del autor en verde. La versión oscura de la misma pantalla usa fondo #15162D, iconos y textos en blanco y los mismos radios verdes."
      },
      {
        "name": "Perfil del usuario",
        "describe": "Fondo #15162D. Cabecera con flecha de retroceso blanca y el título 'Profile' en blanco 28 px. Centrado, un avatar circular de unos 250 px con borde verde #02BA4B de 5 px y, superpuesto abajo a la derecha, un botón circular verde de 80 px con icono de cámara blanco. Debajo, tres filas de información separadas por unos 40 px, cada una con un icono contorneado verde a la izquierda (persona, información, sobre), la etiqueta en gris #B5B4B7 de 18 px y el valor en blanco semibold de 22 px: 'Name / Arturo sojo vivas', 'About / Hello, I am Using CliffPickleball.' y 'Email / arturosojovivas@gmail.com'. Las dos primeras filas llevan un lápiz de edición blanco al extremo derecho; la del correo no es editable."
      },
      {
        "name": "Conversación con panel de adjuntos",
        "describe": "Fondo de chat #14172D en oscuro (o wallpaper elegido por el usuario). Burbujas propias en violeta #6145D2 alineadas a la derecha y burbujas del interlocutor en #303250 a la izquierda, ambas con texto blanco, esquinas muy redondeadas y hora en pequeño bajo el texto; en modo claro las propias pasan a verde #01BD47 y las ajenas a blanco con texto negro. La barra inferior de composición usa #484850, con campo de texto redondeado, icono de clip, icono de cámara y botón circular verde de envío. Al pulsar el clip se despliega una hoja inferior con una cuadrícula de círculos de 60 px con icono blanco y etiqueta debajo: Camera en morado #B45BE7, Gallery en azul #3160F5, Video en celeste #35C2EE, Document en rosa #EF458D, Audio en ámbar #EFBF40, Location en verde #3FBC6C y Contact en naranja #F26109. Los mensajes no textuales se resumen en la lista con emoji y etiqueta: '📽️ Video', '🗺️ Location', '🎵 Audio', '📃 Document', '💁 Contact'."
      }
    ],
    "visualConcept": "Semilla: una cancha de pickleball con la trayectoria de la pelota animada como path SVG. Desarrollo concreto para esta landing.\n\nESCENA PRINCIPAL (hero, 100vh). Fondo #15162D. Ocupando todo el hero, una cancha de pickleball dibujada en SVG en perspectiva isométrica suave (rotación de unos 18 grados y ligera inclinación), no en planta plana: rectángulo de superficie con relleno #0152CD al 22 % de opacidad, líneas de cancha en blanco al 35 % con grosor de 2 px, la 'kitchen' (zona de no volea) marcada con un relleno un punto más claro, y la red como una malla de líneas verticales finas blancas al 20 % que cruza el centro. La cancha está anclada abajo, sangrando fuera del viewport por los lados, de modo que el título flota sobre ella.\n\nTRAYECTORIA DE LA PELOTA. Sobre la cancha corre un único path SVG continuo que describe un peloteo completo: sube desde el fondo izquierdo en arco, cruza la red, rebota en el lado derecho (el rebote se dibuja como un vértice con curva corta), vuelve, y termina en un tercer golpe hacia el fondo. El path se traza con stroke naranja #F26109 de 3 px, linecap redondo y un degradado a lo largo del recorrido que va de #F26109 a #01BD47. Animación: stroke-dasharray/stroke-dashoffset animados en 3,2 s con ease-in-out y bucle infinito, de forma que la línea se dibuja como si la pelota la fuera dejando; detrás de la punta, un rastro que se desvanece (segundo path idéntico con opacidad 0.25 y blur de 6 px). Sobre el path viaja un círculo de 12 px relleno #F26109 con halo naranja al 30 %, animado con offset-path: path(...) y offset-distance de 0 % a 100 % sincronizado con el trazo; en cada punto de rebote el círculo se aplasta verticalmente durante 120 ms (scaleY 0.6) y se dispara una onda expansiva: un círculo con stroke naranja que crece de r=4 a r=40 y se desvanece. Al llegar al 100 % todo se reinicia con un fundido de 400 ms. Con prefers-reduced-motion, la trayectoria se muestra completa y estática y la pelota se queda en el último rebote.\n\nTITULAR. Centrado sobre la cancha, 'Cliff Pickleball' en Poppins de 72 px, blanco, con la palabra 'Pickleball' en degradado linear-gradient(135deg,#0152CD,#0186FE,#01BD47). Debajo, el tagline en #B5B4B7 y dos botones: uno sólido verde #01BD47 y otro fantasma con borde naranja.\n\nESTRUCTURA DE SECCIONES. (1) Hero cancha + trayectoria. (2) 'El partido' — problema y solución en dos columnas separadas por una línea vertical que imita la red, con puntos de saque animados. (3) 'Marcador' — la fila de métricas presentada como un marcador de cancha: tarjetas #2E2D42 con radio 24 px, el número en naranja Poppins 56 px y la etiqueta en gris; al entrar en viewport los números cuentan desde cero. (4) 'Golpes' — los highlights como tarjetas dispuestas en zigzag siguiendo una mini trayectoria SVG que las conecta: la línea naranja punteada se dibuja al hacer scroll (stroke-dashoffset ligado al progreso de scroll) y cada tarjeta aparece cuando la línea la alcanza. (5) 'Capturas' — carrusel de mockups de teléfono con las ocho pantallas reales, con la pantalla activa levantada y las vecinas rotadas y atenuadas; al fondo, la silueta de la cancha muy tenue. (6) 'Cómo está armado' — arquitectura como diagrama de tres carriles (UI, providers, persistencia local + Firebase) donde una pelota naranja recorre el flujo de un mensaje: se escribe, se cifra, se guarda en sqflite y se sincroniza en Firestore, con paradas resaltadas. (7) 'Bola muerta' — retos y soluciones en acordeón, cada uno abriéndose con un rebote corto. (8) Pie con enlaces a GitHub y al vídeo.\n\nDIFERENCIACIÓN. Ninguna otra landing usa geometría deportiva: aquí toda la retícula visual deriva de las líneas de la cancha (bordes de tarjeta a 2 px blanco al 12 %, separadores que replican la línea central) y toda transición horizontal se hace con un ligero arco, no en línea recta, para leerse como el vuelo de la pelota. Paleta estrictamente limitada a azul cancha, verde acción y naranja pelota sobre el fondo #15162D.",
    "statusShort": "Prototipo",
    "categoryShort": "App móvil",
    "media": [
      {
        "src": "/proyectos/cliff_pickleball/Screenshot_20250105-102613.png",
        "kind": "screenshot",
        "caption": "Splash azul #0152CD con el isotipo naranja sobre placa blanca y el nombre CliffPickleball en blanco"
      },
      {
        "src": "/proyectos/cliff_pickleball/Screenshot_20250105-102621.png",
        "kind": "screenshot",
        "caption": "Pantalla de inicio en modo oscuro con buscador, sección Activities y lista de Messages"
      },
      {
        "src": "/proyectos/cliff_pickleball/Screenshot_20250105-102630.png",
        "kind": "screenshot",
        "caption": "Connection Management con las pestañas Available, Incoming y Sent y estado vacío Not Found"
      },
      {
        "src": "/proyectos/cliff_pickleball/Screenshot_20250105-102635.png",
        "kind": "screenshot",
        "caption": "Ajustes en modo oscuro: App theme, Profile, Settings, Chat WallPaper, Chat History, Storage, Support, About e Invite a Friend"
      },
      {
        "src": "/proyectos/cliff_pickleball/Screenshot_20250105-102641.png",
        "kind": "screenshot",
        "caption": "Los mismos ajustes en modo claro con el selector de tema desplegado: System, Dark y Light Theme"
      },
      {
        "src": "/proyectos/cliff_pickleball/Screenshot_20250105-102647.png",
        "kind": "screenshot",
        "caption": "Perfil con avatar circular de borde verde, botón de cámara y campos Name, About y Email editables"
      },
      {
        "src": "/proyectos/cliff_pickleball/Screenshot_20250105-102654.png",
        "kind": "screenshot",
        "caption": "Ajustes internos con el interruptor de notificaciones en primer plano y en segundo plano"
      },
      {
        "src": "/proyectos/cliff_pickleball/Screenshot_20250105-102817.png",
        "kind": "screenshot",
        "caption": "Pantalla About explicando el cifrado de mensajes y actividades, con títulos en verde sobre fondo #15162D"
      }
    ]
  },
  {
    "slug": "robust-pickleball",
    "name": "ROBUST PICKLEBALL",
    "tagline": "El entrenador dicta 90 segundos al bajar de la cancha; el alumno recibe un historial de desarrollo que dura años.",
    "category": "App móvil deportiva · Plataforma de desarrollo de jugadores",
    "year": "2026",
    "role": "Desarrollo integral: arquitectura Flutter, backend serverless en Firebase, canalización de IA con Gemini, reglas de seguridad, sistema de diseño y localización",
    "status": "En desarrollo activo con cliente real (Cliff, primer coach de la plataforma). Firebase en plan Blaze y funciones desplegadas; todavía sin publicar en tiendas.",
    "summary": [
      "ROBUST PICKLEBALL es una plataforma de desarrollo de jugadores construida alrededor de una idea que el propio repositorio repite como norma: el producto no es el reporte de una clase, es el historial del jugador. Una clase dura una hora; el historial debe durar años.",
      "El ciclo completo cabe en cuatro pasos. El coach termina la clase y dicta un resumen de 30 a 90 segundos (o conversa por turnos con un asistente que va llenando un cuaderno). Gemini 2.5 Flash lo estructura en ejercicios, series contadas, tareas y claves de entrenamiento. El coach revisa y publica con un toque. El alumno recibe un reporte que se acumula en su propio espacio, con su Player DNA, su línea de progreso y sus tareas.",
      "La app es una sola aplicación Flutter con dos productos dentro: el área del entrenador (panel, alumnos, clases, estudio de dictado, evaluaciones Court ID) y el área del alumno (panel, progreso, historial, tareas). Cada lado lee colecciones de Firestore distintas y el puente entre ambos lo cruzan únicamente las Cloud Functions.",
      "Es multi-tenant desde el primer día: ROBUST es la plataforma y el primer entrenador es solo la primera organización. Se traduce a 87 idiomas, funciona sin cobertura en la cancha y genera el PDF del reporte en el propio teléfono."
    ],
    "problem": "Un entrenador de pickleball trabaja con decenas de alumnos y, al llegar a la cancha, no puede responder en diez segundos a la pregunta que importa: ¿qué dijimos que trabajaríamos hoy? Los apuntes viven en notas de voz sueltas, en papel o en la memoria; el alumno se va con la sensación de la clase pero sin ninguna prueba de que esté mejorando; y los porcentajes que el coach dicta de viva voz («sacó 80, 90, 75») no se convierten nunca en una serie de datos comparable. Escribir un reporte formal por alumno y por clase es un trabajo que nadie hace de forma sostenida, así que el historial —que es lo único que demuestra progreso— sencillamente no existe.",
    "solution": "Convertir el dictado en el único trabajo que el coach tiene que hacer, y poner toda la disciplina en el servidor. La app graba el audio, lo persiste en disco antes de nada y lo encola: si no hay señal en la cancha, se sube solo al recuperarla. Una Cloud Function se lo pasa a Gemini 2.5 Flash como URI de Storage y devuelve un borrador estructurado que el coach revisa y publica. Al publicar, el servidor construye con lista blanca una proyección para el alumno, recalcula su Player DNA a partir de conteos reales y programa el recordatorio de tareas. Todo lo que el modelo no pueda contrastar contra la transcripción literal se retira con aviso en lugar de guardarse: un hueco visible se arregla en diez segundos, un número inventado ya no se distingue de una medición.",
    "highlights": [
      {
        "title": "Dictado que sobrevive a la cancha sin señal",
        "description": "El audio se escribe en disco y se encola en SharedPreferences antes de tocar la red, así que sobrevive a que se cierre la app y se vacía solo al recuperar conexión. Firebase se resuelve de forma perezosa: grabar y encolar no dependen de que su arranque haya funcionado.",
        "icon": "Mic"
      },
      {
        "title": "Asistente conversacional con cuaderno acumulado",
        "description": "Cuatro callables (openAiSession, appendCoachTurn, finalizeAiSession, abandonAiSession) mantienen un cuaderno en JSON que viaja en cada turno junto al audio nuevo. No se reenvía el historial de audios: Gemini cuenta el audio a unos 32 tokens por segundo y reenviarlo crecería de forma cuadrática.",
        "icon": "MessagesSquare"
      },
      {
        "title": "La omisión nunca borra",
        "description": "El modelo devuelve el cuaderno entero y una función pura lo reconcilia: solo puede añadir, corregir con justificación o eliminar con justificación. La justificación se contrasta con la transcripción del mismo turno y, ante la duda, se revierte y se anota en countDrift.",
        "icon": "GitMerge"
      },
      {
        "title": "Player DNA sobre conteos, no sobre opiniones",
        "description": "Cuatro categorías y 28 habilidades. Una habilidad que ningún ejercicio mide se marca como no medida en vez de rellenarse con un cero, cada categoría declara su cobertura («1 de 5 medidas») y con menos de tres mediciones no se declara tendencia.",
        "icon": "Fingerprint"
      },
      {
        "title": "El alumno y el coach leen colecciones distintas",
        "description": "El jugador nunca toca /orgs/**: lee su propio player_space, una proyección construida con lista blanca que solo escriben las Cloud Functions. Las notas privadas del coach viven en una subcolección a la que ninguna regla puede evaluarse a favor del alumno, y hay pruebas de reglas contra el emulador que lo verifican.",
        "icon": "ShieldCheck"
      },
      {
        "title": "87 idiomas, incluidos los avisos por push y correo",
        "description": "Las cadenas se generan desde los catálogos ARB hacia un JSON que consumen las funciones, con los plurales resueltos por Intl.PluralRules. El glosario de pickleball (dink, third shot drop, reset) no se traduce nunca, y las fuentes van empaquetadas para que la app no aparezca en Roboto al abrirla sin cobertura.",
        "icon": "Languages"
      }
    ],
    "features": [
      "Dictado de voz de 30-90 segundos con cola durable en disco y subida automática al recuperar señal",
      "Asistente de IA conversacional por turnos con cuaderno acumulado, tope duro de tamaño y reapertura sobre conversaciones cerradas",
      "Estructuración automática del reporte con Gemini 2.5 Flash: ejercicios, series, tareas, claves y hallazgos",
      "Transcripción literal mostrada al coach para que un error de transcripción no se vuelva un dato falso",
      "Publicación manual del reporte: la IA nunca cambia el estado de la clase",
      "Panel del entrenador con avisos, cola de trabajo, quién entra hoy, marcador en vivo y seis gráficas servidas desde un único documento agregado",
      "Briefing pre-clase que responde en diez segundos a qué se trabajó la vez anterior, servido desde caché y sin consultas nuevas",
      "Court ID: batería de evaluación versionada de diez ejercicios fijos, con compuesto objetivo y bandas marcadas como provisionales en pantalla",
      "Player DNA con cuatro arcos de categoría, cobertura declarada y línea de progreso sobre bolas contadas",
      "Dos unidades de medida que nunca se convierten entre sí: bolas contadas (made/attempted) y puntuación 0-100 por serie",
      "Criterio de dominio por consistencia y no por promedio",
      "Área del alumno con panel, progreso, historial de clases y tareas con id estable",
      "Feedback del alumno espejado al lado del coach por Cloud Function, sin darle acceso a la organización",
      "Reporte en PDF generado en el cliente, compartible, con fuentes Noto para árabe y hebreo incrustadas",
      "Notificaciones push y correo de respaldo en el idioma del destinatario, sin que el contenido del reporte viaje nunca en el aviso",
      "Recordatorio programado de tareas pendientes a las 48 horas, con índice de un solo campo que solo existe mientras hay aviso pendiente",
      "Acceso sin contraseña: código de seis dígitos por correo, Google, Apple y código de invitación",
      "Vinculación y desvinculación de fichas de alumno con plan puro y probado, más borrado de cuenta irreversible con traspaso o cierre de organización",
      "Modo activo (entrenador / alumno) que decide la navegación y admite que una misma persona sea las dos cosas",
      "Modo sin conexión con persistencia de Firestore sin límite, banner no bloqueante y escrituras que se reintentan solas",
      "Tema claro y oscuro con contraste verificado por pruebas automáticas",
      "Control de gasto: cuota diaria por organización contada en servidor, cuota de tokens, idempotencia, maxInstances e interruptor de apagado de la IA"
    ],
    "stack": [
      {
        "group": "Cliente",
        "items": [
          "Flutter 3.35+",
          "Dart SDK 3.10",
          "Material 3",
          "flutter_localizations",
          "intl"
        ]
      },
      {
        "group": "Estado y navegación",
        "items": [
          "flutter_riverpod",
          "go_router (StatefulShellRoute)",
          "collection",
          "uuid"
        ]
      },
      {
        "group": "Firebase",
        "items": [
          "firebase_core",
          "firebase_auth",
          "cloud_firestore",
          "firebase_storage",
          "firebase_messaging",
          "cloud_functions",
          "firebase_app_check",
          "firebase_analytics",
          "firebase_crashlytics",
          "firebase_remote_config"
        ]
      },
      {
        "group": "Backend serverless",
        "items": [
          "Cloud Functions gen2 sobre Node 22",
          "TypeScript 5.9",
          "firebase-admin",
          "firebase-functions",
          "google-auth-library",
          "Firestore (nam5)",
          "Cloud Storage con reglas de ciclo de vida"
        ]
      },
      {
        "group": "IA",
        "items": [
          "Vertex AI",
          "Gemini 2.5 Flash (endpoint global)",
          "Salida con esquema JSON",
          "Contabilidad de thoughtsTokenCount"
        ]
      },
      {
        "group": "Autenticación",
        "items": [
          "google_sign_in",
          "sign_in_with_apple",
          "Código de seis dígitos por correo con custom tokens"
        ]
      },
      {
        "group": "Medios y dispositivo",
        "items": [
          "record",
          "just_audio",
          "image_picker",
          "flutter_image_compress",
          "permission_handler",
          "connectivity_plus",
          "path_provider",
          "shared_preferences",
          "package_info_plus"
        ]
      },
      {
        "group": "UI, marca y datos",
        "items": [
          "flutter_svg",
          "flutter_animate",
          "cached_network_image",
          "fl_chart",
          "Fuentes variables Saira e Inter empaquetadas"
        ]
      },
      {
        "group": "Reportes",
        "items": [
          "pdf",
          "printing",
          "share_plus",
          "Noto Sans Arabic y Noto Sans Hebrew incrustadas en el PDF"
        ]
      },
      {
        "group": "Calidad y herramientas",
        "items": [
          "flutter_test",
          "flutter_lints",
          "node:test",
          "Firebase Emulator Suite (Auth, Firestore, Storage, Functions)",
          "Pruebas de firestore.rules contra el emulador",
          "flutter_launcher_icons",
          "flutter_native_splash",
          "Scripts Python para catálogos, marca y traducciones"
        ]
      }
    ],
    "architecture": "Clean Architecture por feature: cada uno de los 11 módulos de lib/features/ se abre en domain (entidades y contratos de repositorio), infrastructure (implementaciones sobre Firebase) y presentation (providers, controllers, screens y widgets). Los imports son siempre por paquete y no hay barrel files; tampoco freezed ni json_serializable, porque copyWith y fromJson se escriben a mano para que el modelo de datos se pueda leer entero sin generación. La configuración transversal vive en lib/config (tema y router) y lib/core (i18n, catálogo de habilidades, preferencias, analítica, errores). El router es un go_router con dos StatefulShellRoute —una por cada área, entrenador y alumno— más las rutas neutras de acceso, y su redirect se decide por el modo activo y no por el rol, esperando a que los vínculos del alumno estén resueltos antes de mandar a nadie a ninguna parte. En el servidor, 23 funciones organizadas por dominio (auth, orgs, sessions, ai, dna, feedback, notifications, stats, account) mezclan callables, triggers de Firestore, un trigger de Storage y dos tareas programadas; el catálogo de habilidades, ejercicios y batería vive en shared/ como fuente única y se copia hacia las funciones en el prebuild. Las decisiones delicadas —el plan de borrado de cuenta, el de desvinculación, la reconciliación del cuaderno de la IA, el plegado de estadísticas y la regla del recordatorio— están extraídas a funciones puras y probadas aparte de la función que ejecuta.",
    "challenges": [
      {
        "problem": "El modelo inventaba denominadores. Como el coach dicta porcentajes con naturalidad («sacó 80, 90, 75, 48 y 90»), la suposición de series de diez bolas era imposible con un 80, así que la IA elegía el denominador que cuadraba —100— y guardaba quinientas bolas que nadie golpeó, con la marca de descarte vacía. El dato era coherente; el problema no era la coherencia.",
        "solution": "Dos unidades separadas y un contraste obligatorio. La suposición de las diez bolas solo vale si todos los números de la serie caben en diez, y el servidor coteja cada denominador contra la transcripción literal: o lo dijo el coach en ese mismo turno, o es el tamaño de serie del catálogo. Lo demás se retira y se anota en countDrift. En la conversación el modelo pregunta por el tamaño de serie en vez de adivinarlo; en el dictado, que es una sola pasada, el ejercicio se nombra sin conteos. El caso real y sus regresiones viven en functions/test/invented_counts.test.ts."
      },
      {
        "problem": "En el asistente conversacional, que el modelo dejara fuera del cuaderno algo que había apuntado en un turno anterior equivalía a borrarlo. Con cuarenta turnos, además, un modelo desbocado producía 6,3 MB y la evaluación entera dejaba de poder escribirse en un documento de 1 MiB.",
        "solution": "La reconciliación se sacó a una función pura (ai/merge.ts): el servidor recibe el cuaderno completo y solo acepta añadir, corregir con justificación o eliminar con justificación, restituyendo lo omitido y anotándolo donde el coach lo ve. Se añadieron topes duros por campo, y al recortar se descarta siempre lo nuevo: si el tope pudiera tirar lo anterior, sería una vía por la que la omisión sí borra."
      },
      {
        "problem": "El destino de navegación se decidía por el rol, y eso expulsaba a un entrenador de su propia área de alumno. Peor: los vínculos del alumno llegan por un stream de Firestore, así que entre resolver la sesión y recibir el espacio había un hueco en el que un alumno de dos años parecía no tener área, y se le mandaba a la pantalla de conectar con su entrenador con su panel al otro lado y ningún botón que llevara.",
        "solution": "Un modo activo explícito, porque una misma persona puede entrenar a unos y ser alumna de otro. Y una bandera de resolución en el estado del guard: sin modo y sin resolver todavía, el splash se queda un momento más en vez de decidir. Al entrenador no le afecta, porque su rol viaja en los custom claims."
      },
      {
        "problem": "Las fichas de alumno se volvían invisibles para la búsqueda de invitaciones pendientes y el alumno entraba a una app vacía sin ningún error que lo explicara.",
        "solution": "Firestore no distingue campo ausente de campo null a favor de quien consulta: una consulta por igualdad a null solo encuentra documentos donde el campo existe. Se convirtió en regla del proyecto escribir siempre los campos que se consultan así, aunque valgan null, con una prueba que hace la consulta de verdad contra el emulador. La regla inversa se aplica al recordatorio de tareas, donde la consulta es por rango y el campo se borra en lugar de anularse."
      },
      {
        "problem": "Vincular una ficha a una cuenta era un viaje de ida: un correo mal escrito o un alumno que entró con otra cuenta de Google dejaban la ficha atada para siempre, y la única salida era que el alumno borrara su cuenta entera. Quien se vinculaba por error a la ficha de otro se quedaba además con el historial de un tercero.",
        "solution": "Una operación de desvinculación con su decisión en una función pura y probada aparte. Retira del espacio del alumno los reportes ya entregados de ese vínculo —retirar no destruye, porque el reporte del alumno es una copia y se repone al volver a vincular—, borra los códigos de invitación vivos, retira el correo solo si era el de esa cuenta, y no toca nada del historial del entrenador. Todo idempotente y con registro de quién, cuándo y sobre qué ficha."
      },
      {
        "problem": "En tema oscuro, la elevación clásica —aclarar la tarjeta— hundía el rojo de marca por debajo del mínimo de contraste de WCAG AA, y el color de error se pintaba como texto en seis pantallas justo en el rojo menos legible del tema. Ninguna prueba lo veía porque ese token no se miraba.",
        "solution": "La elevación se consigue hundiendo el lienzo por debajo de la tarjeta en lugar de aclararla, lo que además mejora todos los pares de contraste a la vez. La paleta se partió en cuatro rojos con papeles distintos —marca para relleno, uno oscurecido para texto sobre claro, uno encendido para texto sobre oscuro y uno hundido para estados presionados— y un test de contraste vigila cada par."
      },
      {
        "problem": "El proyecto está en plan Blaze, que no tiene techo de gasto, y cada turno del asistente puede llevar nueve minutos de audio. Contar llamadas no es contar gasto.",
        "solution": "El guardián real es la cuota de tokens por organización y día, contada en servidor e incluyendo los tokens de razonamiento que Gemini reporta aparte de la salida. Encima: cuota diaria de dictados, idempotencia por turno y por generación, maxInstances por función, borrado de audios a los siete días por ciclo de vida de Storage, interruptores de apagado que cortan la IA al instante sin desplegar nada, y alerta de presupuesto con avisos escalonados."
      }
    ],
    "metrics": [
      {
        "value": "24",
        "label": "pantallas"
      },
      {
        "value": "11",
        "label": "módulos de features"
      },
      {
        "value": "23",
        "label": "Cloud Functions"
      },
      {
        "value": "87",
        "label": "idiomas"
      },
      {
        "value": "17",
        "label": "colecciones Firestore"
      },
      {
        "value": "28",
        "label": "habilidades en 4 categorías"
      },
      {
        "value": "16",
        "label": "ejercicios en el catálogo"
      },
      {
        "value": "10",
        "label": "pruebas de la batería Court ID"
      },
      {
        "value": "93",
        "label": "archivos de prueba"
      },
      {
        "value": "~40k",
        "label": "líneas de Dart"
      }
    ],
    "brand": {
      "primary": "#F5361B",
      "secondary": "#B31F0C",
      "accent": "#FF7A1A",
      "bg": "#0D0D0F",
      "surface": "#1E1E1E",
      "text": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #B31F0C 0%, #F5361B 62%, #FF7A1A 100%)",
      "mood": "Atlético y contundente. Negro casi absoluto, un rojo-naranja de alta energía y tipografía display condensada (Saira) sobre cuerpo neutro (Inter). El símbolo son dos arcos en movimiento, como la trayectoria de una bola y su rebote. El gradiente empieza en el rojo hundido —la esquina donde va el titular blanco— y termina en el ámbar, que nunca lleva texto encima. La identidad es nativa de fondo oscuro, pero el producto prioriza el tema claro, así que el rojo tiene variantes medidas para cada fondo.",
      "source": "/Users/macbook/robust-pickleball/lib/config/theme/robust_colors.dart y /Users/macbook/robust-pickleball/lib/config/theme/robust_surfaces.dart (gradiente heroFill: brandDeep 0 → brand 0.62 → brandEmber 1); símbolo en /Users/macbook/robust-pickleball/assets/brand/mark.svg"
    },
    "links": {},
    "uiScreens": [
      {
        "name": "Panel del entrenador",
        "describe": "Pantalla de entrada del área de coach, sobre lienzo claro #F7F7F8 con tarjetas blancas de radio 18 y doble sombra muy suave. Arriba, una cabecera sliver con un eyebrow en gris #6B6B72 con el nombre de la organización y, debajo, el título en Saira peso 800 (\"Panel\"), con un avatar circular de cuenta a la derecha. El orden vertical es de urgencia y no de estética: (1) una banda de aviso roja de bajo tinte —gradiente rojo al 5% de alfa— del tipo \"un dictado se quedó atascado\"; (2) la cola de trabajo, hasta tres filas con el nombre del alumno, \"Clase 7 · borrador\" y un chevron, cada una con un punto rojo #F5361B a la izquierda, y un enlace de texto \"Ver las 6\" en rojo #D62A12 a la derecha del encabezado de sección; (3) \"Hoy en la cancha\", tarjetas plegables con borde #E4E4E7 que muestran el nombre del alumno, la hora en rojo, y al abrirse el briefing de la clase anterior más dos botones —un OutlinedButton \"Ver alumno\" y un FilledButton rojo con icono de play \"Empezar clase\" que ocupa el doble de ancho; (4) un marcador en vivo de cuatro cifras grandes en Saira con etiqueta pequeña debajo (alumnos, clases este mes, por publicar, tareas pendientes); (5) seis gráficas fl_chart en tarjetas: barras de clases por semana a 26 semanas, línea de porcentaje de bolas contadas, cobertura por categoría, top de ejercicios, división de tendencias y Court ID. Abajo a la derecha un FAB extendido rojo \"Añadir alumno\" con icono de persona, y una barra de navegación inferior de cuatro destinos: Panel (insights), Alumnos (groups), Clases (con badge numérico rojo) y Estudio (auto_awesome)."
      },
      {
        "name": "Estudio · asistente de IA conversacional",
        "describe": "Pantalla a pantalla completa organizada alrededor del cuaderno, no del chat. AppBar con título en dos líneas: \"Asistente\" y, en labelSmall gris, \"Clase 12 · Lillian\"; a la derecha un TextButton \"Terminar\" (deshabilitado hasta que hay turnos) y un icono de papelera. Justo bajo la barra, una franja informativa permanente de fondo rojo al 5% con texto en tinta: \"Esto no publica nada. Al cerrar, los apuntes pasan al borrador\". El cuerpo se parte en dos: arriba, el panel del cuaderno desplegado por defecto, una tarjeta blanca con secciones —Resumen, Ejercicios con sus series (chips grises tipo 8/10, 9/10, 7/10 y una barra de progreso fina), Tareas, Claves— y, cuando el servidor ha restituido algo, una fila de aviso ámbar #A16207 con el texto de countDrift; abajo, el hilo de turnos con burbujas alineadas a la derecha para el coach (superficie tintada) que muestran la transcripción literal en cursiva y su duración. Al pie, el compositor: un botón circular grande rojo de micrófono con un anillo que pulsa en bucle lento de 1600 ms mientras graba, el tiempo en cifras grandes de Saira al lado, y un enlace secundario \"Dictar en su lugar\". Sin señal aparece una banda gris no bloqueante en la parte superior."
      },
      {
        "name": "Player DNA del alumno",
        "describe": "Sobre lienzo claro. AppBar simple con el título \"Tu ADN de juego\". Un párrafo de introducción en gris #6B6B72 y, debajo, una tarjeta blanca con cuatro arcos —no un radar— dispuestos en fila: Técnica, Táctica, Movimiento y Mental. Cada arco es un semicírculo de trazo grueso con fondo #E4E4E7 y relleno en el color semántico correspondiente (verde #15803D fuerte, ámbar #A16207 en desarrollo, rojo #D62A12 prioridad), con el porcentaje en el centro en Saira y la etiqueta debajo; el arco de la categoría sin mediciones queda vacío y rotulado. Tocar un arco despliega, con una animación de tamaño de 180 ms, una segunda tarjeta con las habilidades de esa categoría: cada fila lleva el nombre de la habilidad, una píldora de estado (fuerte / en desarrollo / prioridad), una minigráfica sparkline de escala fija 0-100% y el texto \"empezaste en 60%, vas por 77%\"; las no medidas dicen literalmente \"todavía no lo hemos medido\" en gris, sin número. En la esquina del encabezado de la categoría, la cobertura: \"1 de 5 medidas\"."
      },
      {
        "name": "Court ID · ejecución de la evaluación",
        "describe": "Pantalla de trabajo pensada para usarse con la pala en la mano y sol de frente. Barra superior con el nombre del alumno y una barra de progreso fina que marca cuántos de los diez ejercicios llevan datos. El cuerpo es una lista de tarjetas de ejercicio, fijas y en orden, que no se pueden añadir ni quitar. Cada tarjeta lleva: nombre del ejercicio en titleMedium, un selector de unidad discreto (bolas contadas / puntuación), y una fila de cinco casillas de serie grandes y cuadradas con el número en Saira; tocar una abre una rejilla de números enormes —de cinco en cinco cuando la unidad es puntuación, veintiuna casillas en lugar de ciento una— sin teclado ni campos de texto. Las series que cumplen el criterio de dominio se tiñen de verde; una serie hundida deja la tarjeta en ámbar aunque el promedio sea alto, porque el criterio es de consistencia. Al pie, una tarjeta de resumen con el compuesto 0-100 en cifras grandes y, debajo y a la vista, la advertencia de que la traducción a nivel (3.5, 4.0) es provisional. Autoguardado a los tres segundos del último conteo y también al mandar la app a segundo plano."
      },
      {
        "name": "Reporte del alumno",
        "describe": "La pantalla a la que apunta la notificación push. AppBar con el número de clase y, debajo en labelSmall, el nombre del alumno y el del entrenador; a la derecha, un botón de PDF que arma el documento en el propio teléfono. El cuerpo es un informe con jerarquía de tarjetas: primero un bloque de mensaje del entrenador sobre fondo rojo tintado con el texto en tinta #121212; después \"Lo que salió bien\" y \"En qué seguimos\", cada una con píldoras de habilidad en su color semántico; después la lista de ejercicios con sus series contadas y la tasa resultante; después las tareas, cada una con una casilla marcable de id estable; y al final un bloque de respuesta donde el alumno escribe cómo le fue —lo único que escribe en todo el producto—, que una Cloud Function espeja al lado del coach. Estados diferenciados de carga (esqueletos con la forma del contenido, nunca una ruleta), error con botón de reintento, y vacío. En tema oscuro el lienzo baja a #0D0D0F y las tarjetas se quedan en #1E1E1E, con el rojo de texto en #FF4326."
      }
    ],
    "visualConcept": "BLUEPRINT DE CANCHA QUE SE DIBUJA SOLO. La landing se lee como un plano técnico de una pista de pickleball trazado en vivo: fondo negro carbón #0D0D0F con una retícula de 40 px en rojo al 4% de opacidad, y encima las líneas blancas de la cancha (kitchen, línea de servicio, línea central) dibujadas con SVG mediante stroke-dasharray + stroke-dashoffset animado, de manera que cada línea se traza en 900 ms con easing easeOutCubic cuando su sección entra en el viewport. Los tramos aparecen primero como línea de guía punteada rojo #F5361B al 30% y solo después se rellenan en blanco sólido: el gesto del plano que se convierte en cancha real es la metáfora del producto entero, que convierte un dictado suelto en un historial medido.\n\nPaleta: negro #0D0D0F de fondo, planchas #1E1E1E para las tarjetas, rojo de marca #F5361B como único acento, rojo hundido #B31F0C para bordes de énfasis y ámbar #FF7A1A reservado exclusivamente al extremo lejano de gradientes (nunca como texto). Blanco #FFFFFF para titulares en Saira condensada muy pesada y gris #AAAAAA para cuerpo en Inter. El gradiente de héroe es el real de la app: linear-gradient(135deg, #B31F0C 0%, #F5361B 62%, #FF7A1A 100%), con el titular blanco siempre en la esquina superior izquierda, sobre el extremo oscuro.\n\nEstructura de secciones:\n1. HÉROE — cancha en planta ocupando el ancho, dibujándose línea a línea al cargar. Sobre ella, un titular enorme en dos pesos (\"El historial\" en blanco / \"dura años\" en rojo) y, como único elemento en movimiento continuo, el símbolo de los dos arcos con un trazado que se repite cada 6 segundos. Debajo, una fila de cuatro cifras contables (24 pantallas · 23 Cloud Functions · 87 idiomas · 28 habilidades) que suben con easing easeOutExpo en 900 ms, lo bastante lento para leerse mientras suben.\n2. EL CICLO — cuatro estaciones (Dicta / Estructura / Revisa y publica / El alumno recibe) unidas por una polilínea roja que se dibuja de izquierda a derecha al hacer scroll, con el avance atado a la posición del scroll y no a un temporizador; cada estación es un nodo circular que se enciende de rojo cuando la línea lo alcanza.\n3. DOS LADOS DE LA RED — la sección se parte verticalmente por una línea blanca que representa la red: a la izquierda, en tarjetas oscuras, lo que ve el entrenador; a la derecha, lo que ve el alumno. Nada cruza la línea salvo una única flecha roja rotulada \"Cloud Functions\", que es literalmente la arquitectura de permisos del proyecto.\n4. LO QUE NO SE INVENTA — bloque de fondo casi negro con cuatro reglas del producto en tipografía grande y numeradas como cotas de plano (con líneas de acotación rojas y sus flechas en los extremos): la IA nunca publica, la omisión nunca borra, dos unidades que no se convierten, el dominio es consistencia y no promedio.\n5. MOCKUPS — tres pantallas de teléfono en perspectiva isométrica ligera, cada una con líneas de guía discontinuas que salen hacia los márgenes y etiquetan un componente (el pulso del micrófono, los arcos del Player DNA, la rejilla de conteo), como en una ficha técnica.\n6. STACK Y CIERRE — la retícula se hace visible del todo, las líneas de la cancha se desdibujan hacia el pie, y el stack aparece agrupado en bloques con borde de 1 px rojo al 20%.\n\nMovimiento: todo entra desde abajo con 300 ms y easeOutCubic, escalonado 55 ms por elemento y con tope en el octavo para que ninguna lista se sienta rota; los estados hover de tarjeta suben 4 px en 90 ms. Nada rebota salvo escala y posición. Con prefers-reduced-motion, las líneas aparecen ya trazadas y los contadores muestran su valor final. La landing debe distinguirse del resto por su austeridad técnica: es un plano, no un póster, y el único color saturado es el rojo.",
    "statusShort": "Google Play",
    "categoryShort": "App móvil",
    "media": [
      {
        "src": "/proyectos/robust-pickleball/icon.png",
        "kind": "icon",
        "caption": "Icono de la app: los dos arcos rojos de marca sobre negro #121212."
      },
      {
        "src": "/proyectos/robust-pickleball/icon_light.png",
        "kind": "icon",
        "caption": "Variante clara del icono, para fondos blancos."
      },
      {
        "src": "/proyectos/robust-pickleball/mark.svg",
        "kind": "logo",
        "caption": "Símbolo vectorial de ROBUST: dos arcos en movimiento, con currentColor para teñirlo desde la app."
      },
      {
        "src": "/proyectos/robust-pickleball/mark_red.png",
        "kind": "logo",
        "caption": "Símbolo en rojo de marca sobre fondo transparente."
      },
      {
        "src": "/proyectos/robust-pickleball/icon_monochrome.png",
        "kind": "icon",
        "caption": "Capa monocroma del icono para los iconos tematizados de Android 13+."
      },
      {
        "src": "/proyectos/robust-pickleball/icon_foreground.png",
        "kind": "icon",
        "caption": "Capa de primer plano del icono adaptativo de Android."
      },
      {
        "src": "/proyectos/robust-pickleball/icon_ios_dark.png",
        "kind": "icon",
        "caption": "Variante oscura del icono para iOS 18."
      },
      {
        "src": "/proyectos/robust-pickleball/icon_ios_tinted.png",
        "kind": "icon",
        "caption": "Variante teñida en escala de grises del icono para iOS 18."
      }
    ]
  },
  {
    "slug": "vileads-events",
    "name": "Vileads Events",
    "tagline": "La infraestructura completa para operar eventos: catálogo, landing por evento, ticketing, pagos y check-in.",
    "category": "Plataforma web SaaS multi-tenant para eventos",
    "year": "2026",
    "role": "Arquitectura frontend y desarrollo (React + TypeScript), en equipo",
    "status": "En desarrollo activo, integrado contra el backend real de producción",
    "summary": [
      "Vileads Events es el frontend de una plataforma de eventos donde conviven tres audiencias en una sola aplicación React: el asistente que descubre y compra entradas, el organizador que administra su evento desde un panel privado, y el super-admin que gobierna toda la plataforma.",
      "La aplicación resuelve el ciclo completo de un evento: asesoría inicial, creación del evento, construcción de su landing con un editor de plantillas, venta de entradas con checkout y confirmación asíncrona por webhook, postulaciones de ponentes, patrocinadores, expositores, voluntarios y participantes, control de acceso con QR en puerta, y liquidación de fondos al organizador.",
      "Cada evento puede publicarse en su propio subdominio (`<evento>.vileadsevents.com`): cuando la app detecta ese host, toda la aplicación se convierte en la landing de ese evento, sin el chrome del catálogo Vileads.",
      "El proyecto está construido sobre una guía de arquitectura frontend propia (`FRONTEND_ARCHITECTURE_SKILL.md`, 58 KB) que fija estructura feature-first, cliente HTTP único, manejo unificado de errores, i18n por slice y un límite duro de 1.000 líneas por archivo."
    ],
    "problem": "Un operador de eventos serio termina cosiendo a mano media docena de herramientas: una hoja de cálculo para el aforo, un ticketera de terceros que se queda con la marca y con el dinero, un constructor de sitios aparte para la landing, otra app para escanear entradas en la puerta y correos sueltos para gestionar ponentes y patrocinadores. El resultado son datos partidos, cobros que nadie concilia y una experiencia pública que no parece del organizador sino del proveedor.",
    "solution": "Una sola aplicación React donde el evento vive de punta a punta. El organizador recibe un panel con diez secciones (resumen, eventos, entradas, órdenes, fondos, ponentes, patrocinadores, analítica, asesoría y ajustes) más el check-in con QR; publica la landing pública del evento desde un editor de plantillas gobernadas que renderiza exactamente igual en el editor y en producción; cobra por checkout con confirmación asíncrona y descarga del ticket en PDF; y valida entradas en la puerta con la cámara del teléfono, incluso sin conexión. Encima de todo, un panel de super-admin con quince secciones controla organizaciones, pagos manuales, liquidaciones, servidor de anuncios, auditoría y términos legales.",
    "highlights": [
      {
        "title": "Landing propia por evento en subdominio",
        "description": "Un utilitario resuelve el host: si el navegador está en `<evento>.vileadsevents.com` la app entera se convierte en la landing de ese evento (con excepciones para el retorno de checkout y el pago de postulaciones). En el dominio principal el mismo evento se ve con el chrome del catálogo. Dos vistas públicas, un solo código.",
        "icon": "Globe"
      },
      {
        "title": "Site Builder con seis plantillas gobernadas",
        "description": "Cada plantilla no es un recoloreado: define tokens de color, secciones activas y una 'persona' visual propia (tipo de eyebrow, radio de esquinas, alineación del hero, patrón decorativo, navegación monoespaciada). El editor y la página pública construyen su aspecto desde el mismo módulo de tema, así que lo que se previsualiza es literalmente lo que se publica.",
        "icon": "LayoutTemplate"
      },
      {
        "title": "Check-in QR que funciona sin señal",
        "description": "Escaneo en vivo con la cámara trasera vía BarcodeDetector del navegador, más ingreso manual como respaldo. Si el dispositivo pierde la conexión, cada escaneo se guarda en una cola local por evento y se sincroniza en lote al volver online, con indicadores de estado y contador de pendientes.",
        "icon": "WifiOff"
      },
      {
        "title": "Dinero trazable de punta a punta",
        "description": "El checkout confirma de forma asíncrona: como el pago se cierra por webhook, la pantalla de éxito hace polling con fases (procesando, recibido, lento) antes de declarar la compra. Del otro lado, el organizador ve ganancia neta, disponible a liberar, pendiente, pagado, bruto, comisiones y reembolsos, con el historial de liquidaciones.",
        "icon": "Wallet"
      },
      {
        "title": "Trilingüe, con tema claro y oscuro",
        "description": "Español, inglés y portugués con unas 1.909 claves por idioma, idioma y tema persistidos en el store y enviados al backend como cabecera `Accept-Language`. Cada componente trae sus variantes `dark:`; no hay pantalla que se quede a medias al cambiar de tema.",
        "icon": "Languages"
      }
    ],
    "features": [
      "Catálogo público de eventos con filtros, buscador y paginación",
      "Ficha de evento con hero, agenda, ponentes, patrocinadores y compra de entradas",
      "Landing standalone del evento con la marca del organizador y badge opcional 'Powered by Vileads'",
      "Publicación del evento en subdominio propio",
      "Site Builder: galería de plantillas, edición de contenido, orden y visibilidad de secciones, subida de portada y logo, previsualización desktop/móvil",
      "Checkout de entradas por enlace directo o desde la landing, con códigos de descuento",
      "Confirmación de pago con polling, descarga del ticket en PDF y autoredirección al evento",
      "Pago de postulaciones con costo desde el enlace del correo",
      "Postulaciones de ponente, patrocinador, expositor, voluntario y participante con formularios por tipo",
      "Check-in en puerta por QR o por lista de postulaciones, con cola offline y sincronización",
      "Panel del organizador: resumen, eventos, entradas, órdenes, fondos, ponentes, patrocinadores, analítica, asesoría y ajustes",
      "Panel de super-admin: organizaciones, eventos, asesorías, pagos manuales, liquidaciones, analítica, servidor de anuncios, contacto, leads de patrocinio, auditoría, términos, registro de correos, sesiones de visitantes y ajustes",
      "Suscripción anual de la organización con gate de acceso y banner de cargos pendientes",
      "Carrusel de anuncios por slot (bajo cabecera, medio de catálogo, lateral de evento, pie) con registro de clic vía redirección del backend",
      "Autenticación completa: login, registro, verificación de correo, recuperación y restablecimiento de contraseña, aceptación de invitación",
      "Rutas protegidas por rol (organizador y super-admin) con guardas de sesión",
      "Términos y privacidad servidos desde el backend, con aceptación registrada"
    ],
    "stack": [
      {
        "group": "Núcleo",
        "items": [
          "React 18.3",
          "TypeScript 5.5",
          "Vite 6.3",
          "React Router 7.1",
          "@vitejs/plugin-react-swc"
        ]
      },
      {
        "group": "Estado y datos",
        "items": [
          "Redux Toolkit 2.2",
          "React Redux 9",
          "redux-persist 6",
          "axios 1.13",
          "React Hook Form 7.71",
          "Zod 3.23",
          "@hookform/resolvers"
        ]
      },
      {
        "group": "Interfaz",
        "items": [
          "Tailwind CSS 3.4",
          "Radix UI (15 primitivos)",
          "lucide-react",
          "class-variance-authority",
          "clsx",
          "tailwind-merge",
          "tailwindcss-animate",
          "sonner",
          "Recharts 2.13"
        ]
      },
      {
        "group": "Calidad y tooling",
        "items": [
          "Vitest 2.1",
          "Testing Library (react, jest-dom, user-event)",
          "jsdom",
          "@vitest/coverage-v8",
          "ESLint 9",
          "Prettier 3",
          "PostCSS",
          "Autoprefixer"
        ]
      }
    ],
    "architecture": "Arquitectura feature-first: `src/app` (bootstrap, providers y rutas con carga perezosa), `src/shared` (cliente HTTP, primitivos de UI, layouts, hooks, i18n, store y utilidades) y `src/features` con quince módulos independientes (account, admin, advisory, applications, auth, checkin, checkout, events, home, legal, marketing, organization, site-builder, sponsors, tenant), cada uno con sus `api/`, `components/` y `pages/`. Todo el tráfico HTTP pasa por un único `apiAxios` sobre axios que inyecta el token del store, traduce el idioma activo a `Accept-Language`, desenvuelve el sobre del backend (`{ data, message, status, pagination }`) preservando la paginación, y centraliza el refresco de token y el logout ante 401. El estado global es Redux Toolkit con redux-persist para sesión, tema e idioma; nada de `localStorage` suelto salvo la cola de check-in offline. El enrutado combina tres layouts —catálogo con chrome y anuncios, standalone sin chrome, y panel con sidebar— más guardas por rol, y se bifurca antes de todo eso según el subdominio del host. Reglas duras verificadas por lint: ningún archivo supera 1.000 líneas y no se permiten importaciones cruzadas profundas entre features.",
    "challenges": [
      {
        "problem": "El mismo evento debe verse de dos maneras públicas incompatibles: dentro del catálogo Vileads (con cabecera, pie y anuncios) y como landing independiente del organizador, sin rastro de la plataforma salvo si él lo autoriza.",
        "solution": "Se separaron dos páginas sobre el mismo modelo de datos y dos layouts (`AppLayout` y `StandaloneLayout`). La vista standalone no monta el chrome ni los anuncios globales, y lee `branding_mode` de la organización para decidir si muestra el sello 'Powered by Vileads'. La resolución del subdominio ocurre antes del árbol de rutas, así que el host decide qué aplicación es esta antes de renderizar nada."
      },
      {
        "problem": "El pago no termina cuando el usuario vuelve del proveedor: la orden la confirma un webhook del backend, así que declarar 'compra exitosa' al aterrizar sería mentir la mitad de las veces.",
        "solution": "La pantalla de éxito modela el estado en fases (procesando, recibido, lento) y consulta la orden cada dos segundos hasta cinco intentos antes de dar un veredicto, distinguiendo además los casos que ya llegan pagados —órdenes gratuitas— de los que dependen del webhook. Confirmada la compra, ofrece la descarga del ticket en PDF y autoredirige al evento con cuenta regresiva."
      },
      {
        "problem": "El check-in ocurre en la puerta de un recinto, donde el wifi es exactamente donde falla. Un escaneo perdido es un asistente que no entra.",
        "solution": "Cada escaneo se intenta contra la API y, si falla o el navegador está offline, cae en una cola local por evento con marca de tiempo y sin duplicados. La interfaz muestra el estado de conexión, cuántos escaneos hay pendientes y un botón de sincronización en lote que reporta cuántos de cuántos se subieron. La detección del QR usa la API nativa del navegador, con ingreso manual siempre disponible como respaldo."
      },
      {
        "problem": "Un editor visual suele mentir: lo que se previsualiza no es lo que se publica, y cada plantilla nueva multiplica el código de render.",
        "solution": "Se extrajo un módulo de tema compartido que resuelve paleta, tipografía y rasgos de layout a partir de la definición de la plantilla más el acento elegido. El lienzo del editor y la landing pública construyen su aspecto desde esa misma función; lo único que cambia entre uno y otro son los datos —contenido de ejemplo frente al evento real—."
      },
      {
        "problem": "El panel de super-admin creció hasta quince secciones y el del organizador hasta diez; en un archivo monolítico eso se vuelve intocable.",
        "solution": "Cada pestaña es un archivo propio bajo `components/tabs/`, y la definición de navegación vive en un módulo aparte compartido por el dashboard y la página de check-in, para que el menú lateral sea idéntico en ambos. La regla de lint de 1.000 líneas por archivo obliga a partir cualquier pestaña que se desborde."
      }
    ],
    "metrics": [
      {
        "value": "36",
        "label": "páginas React"
      },
      {
        "value": "15",
        "label": "módulos de feature"
      },
      {
        "value": "83",
        "label": "endpoints REST consumidos"
      },
      {
        "value": "15",
        "label": "secciones del panel super-admin"
      },
      {
        "value": "10",
        "label": "secciones del panel del organizador"
      },
      {
        "value": "6",
        "label": "plantillas de landing"
      },
      {
        "value": "3",
        "label": "idiomas (es · en · pt)"
      },
      {
        "value": "1.909",
        "label": "claves de traducción por idioma"
      },
      {
        "value": "5",
        "label": "tipos de postulación"
      }
    ],
    "brand": {
      "primary": "#1A2B6B",
      "secondary": "#D33A2C",
      "accent": "#6D28D9",
      "bg": "#0A0E1A",
      "surface": "#121621",
      "text": "#FCFCFB",
      "gradient": "linear-gradient(135deg, #1A2B6B 0%, #6D28D9 55%, #D33A2C 100%)",
      "mood": "Editorial corporativo: papel y tinta. Azul institucional con un rojo de acento que viene del logotipo (el infinito azul-rojo de 'Visionary Leaders App'), titulares en DM Serif Display sobre cuerpo Inter, superficies claras color crema con líneas finísimas, y un violeta reservado para los degradados de énfasis. Serio, denso en datos, nada festivo.",
      "source": "/Users/macbook/eventsvileads_frontend/tailwind.config.ts (paleta `vl.*`: paper #F7F7F5, ink #0A0E1A, snow #FCFCFB, blue #1A2B6B, red #D33A2C, purple #6D28D9) + /Users/macbook/eventsvileads_frontend/src/index.css (variables HSL de tema claro/oscuro; el `--card` oscuro 224 30% 10% da #121621) + /Users/macbook/eventsvileads_frontend/assets/logo-full.png"
    },
    "links": {},
    "uiScreens": [
      {
        "name": "Home — hero con maqueta del panel",
        "describe": "Fondo color papel #F7F7F5 con una rejilla sutilísima (líneas de rgba(10,14,26,0.04) cada 48px). A la izquierda, un eyebrow con icono de chispa y el texto 'Infraestructura de eventos' en mayúsculas de 12px, tracking amplio, color gris #6B7280. Debajo, el titular en DM Serif Display a 48-60px: 'El sistema operativo para' en tinta #0A0E1A seguido de 'eventos ambiciosos.' con degradado violeta→fucsia (#7C3AED → #D946EF) recortado sobre el texto. Subtítulo en gris grafito #3B4252 a 16px: 'Vileads le da a los operadores modernos la plataforma para lanzar, vender y operar eventos de punta a punta — con tu marca arriba, nuestra ingeniería abajo.' Un botón sólido negro tinta con texto 'Crear cuenta' y flecha. A la derecha, una maqueta de dashboard dentro de una tarjeta blanca #FCFCFB con esquinas de 24px y sombra grande: barra lateral estrecha color crema #EFEEE9 con el rótulo 'ACME' y siete ítems de menú (Resumen resaltado en negro con texto blanco; Eventos, Constructor, Entradas, Ponentes, Patrocinadores, Ajustes en gris), y a la derecha una cuadrícula 2×2 de tarjetas de métrica con icono, etiqueta y cifra: Asistentes 8,432 (+12%), Ingresos $278,600 (+18%), Entradas 1,204 (+9%), Eventos 14 (+2). Detrás de la maqueta, dos manchas circulares desenfocadas (violeta arriba a la derecha, azul abajo a la izquierda)."
      },
      {
        "name": "Ficha de evento (vista catálogo)",
        "describe": "Arranca con un hero de imagen a sangre en proporción 21:9 (3:1 en escritorio), con un degradado vertical de transparente a tinta #0A0E1A al 90% en la base. El contenido flota sobre la imagen, desplazado 128px hacia arriba: fila de píldoras —una roja sólida #D33A2C con la categoría, dos translúcidas blancas al 15% con el formato ('Presencial') y el estado ('Publicado')—, luego el nombre del evento en DM Serif Display a 60px color nieve #FCFCFB, un subtítulo a 18px al 85% de opacidad, y una línea de metadatos con iconos de calendario y pin: fecha larga con hora, y recinto · ciudad, país. Debajo, tres botones: 'Comprar entrada' sólido en nieve con texto tinta, 'Postularme como ponente' en contorno blanco translúcido, y 'Compartir' fantasma con icono. El cuerpo es una rejilla de dos columnas 2fr/1fr sobre fondo papel: a la izquierda tarjetas blancas con borde #E5E2DA y esquinas de 16px —'Sobre el evento' con título serif de 24px y párrafo, agenda, ponentes, formulario de postulación y panel de patrocinadores—; a la derecha, la tarjeta de entradas con cada nivel en una caja bordeada (nombre en negrita, descripción, precio, selector de cantidad y botón), y debajo la tarjeta del organizador con su nombre, ciudad y el sello de marca."
      },
      {
        "name": "Panel del organizador — Resumen",
        "describe": "Layout de panel con barra lateral fija: eyebrow en mayúsculas espaciadas y once ítems con icono de lucide —Resumen (cuadrícula), Eventos (calendario), Entradas (ticket), Órdenes (recibo), Fondos (billetera), Ponentes (usuarios), Patrocinadores (apretón de manos), Analítica (barras), Asesoría (salvavidas), Ajustes (engranaje) y, separado, Check-in QR—; el activo se marca con fondo tinta y texto nieve. En el área principal, si la organización aún no está aprobada aparece una franja ámbar (#FEF3C7 con borde #FCD34D y texto ámbar oscuro) con el aviso de revisión, y encima puede haber un banner de cargo pendiente. Luego una cuadrícula de tarjetas de métrica: Ventas totales (importe formateado en moneda), Entradas emitidas, Asistentes activos, cada una con su delta en verde. Debajo, un gráfico de barras de Recharts con rejilla punteada y tooltip, una tarjeta de estado de la suscripción anual (al día / pendiente / vencida, con fecha de vencimiento) y una lista de los cinco eventos más recientes con su estado."
      },
      {
        "name": "Check-in QR en puerta",
        "describe": "Cabecera de página con eyebrow 'En sitio', título 'Check-in con QR' en serif y subtítulo 'Escanea el QR del ticket o pega el código. Funciona offline.' Debajo, un selector de evento y un conmutador de modo entre 'Entradas' y 'Postulaciones'. A la izquierda, el bloque de escáner: un recuadro negro con el vídeo de la cámara trasera y, cuando está apagada, el mensaje 'Cámara apagada. Usa ingreso manual o enciende la cámara.'; botones 'Iniciar cámara' / 'Detener cámara' con icono de cámara. Bajo el vídeo, el campo de ingreso manual con su botón 'Validar'. A la derecha, la pila de resultados recientes: hasta seis tarjetas con el código y una insignia de estado —'Válido' en verde, 'Ya registrado' en contorno, 'Encolado offline' en gris apagado, 'Ticket no encontrado' e 'Inválido' en rojo—. Arriba a la derecha, un indicador Online/Offline con icono de wifi tachado cuando no hay red, y si hay escaneos pendientes una franja 'Pendientes de sincronizar' con el conteo y el botón 'Sincronizar N'. Al pie, la lista de invitados registrados con el total."
      },
      {
        "name": "Site Builder — galería de plantillas y editor",
        "describe": "Primero la galería: rejilla de tarjetas de 24px de radio, borde #E5E2DA, que al pasar el cursor se elevan un píxel y ganan una sombra grande. Cada tarjeta muestra una miniatura de degradado propio de la plantilla —tech-conference en cian sobre casi negro (#020617 → #0F172A → #06B6D4), music-festival en granate→violeta→naranja, executive-summit en azul marino con dorado #C9A84C, y las de creative-workshop, industry-expo y community-event—, un símbolo de vista previa (◆, ♪), el nombre, el subtítulo y la categoría. La seleccionada pierde el borde y gana un anillo de dos píxeles del color de acento de la plantilla, con separación del fondo. Al entrar al editor, la pantalla se parte: a la izquierda paneles plegables de contenido (título, subtítulo, descripción, color de acento, portada, logotipo, orden y visibilidad de secciones, agenda, ponentes, textos del CTA); a la derecha el lienzo de previsualización con un conmutador escritorio/móvil de dos iconos, que renderiza la landing real de la plantilla con el mismo motor de tema que usará la página publicada."
      }
    ],
    "visualConcept": "TARJETA-ENTRADA CON PERFORACIÓN Y SELLOS. Toda la landing del portafolio se compone de 'stubs' de entrada de evento: cada bloque de contenido es una tarjeta apaisada partida en dos por una línea de perforación vertical —círculos calados de 14px, del color del fondo, repetidos con `radial-gradient` cada 22px, con dos muescas mayores mordiendo los bordes superior e inferior—. El talón corto (28% del ancho) queda a la derecha, girado 90 grados, con el número de sección en mono ('SEC 01'), un código de barras dibujado con `repeating-linear-gradient` y el sello. El cuerpo largo lleva el contenido.\n\nESTRUCTURA DE SECCIONES. (1) Hero: una entrada gigante inclinada -2 grados sobre fondo tinta #0A0E1A con rejilla de 48px al 4% de blanco; el talón muestra 'ADMIT ONE' y el nombre del proyecto en DM Serif Display; sobre el cuerpo, dos sellos redondos superpuestos con tinta desgastada. (2) El problema y la solución como dos entradas enfrentadas: la del problema con el sello rojo 'VENCIDA' y un filtro de saturación baja; la de la solución con el sello verde 'VÁLIDA'. (3) Highlights: cinco stubs apilados en abanico que se despliegan al hacer scroll. (4) Stack: un 'talonario' — las tarjetas se muestran como un fajo con las esquinas visibles, y cada grupo se arranca del fajo al pasar el cursor. (5) Métricas: hilera de talones cortos, sólo el trozo derecho de la entrada, cada uno con su cifra en mono grande y la etiqueta rotada en el margen. (6) Pantallas: entradas de tamaño póster con la captura ocupando el cuerpo y los metadatos en el talón. (7) Retos: entradas 'perforadas de verdad', partidas por la mitad, con las dos mitades separadas y el texto del problema arriba y el de la solución abajo.\n\nCOLOR. Fondo tinta #0A0E1A con papel envejecido #F7F7F5 para las entradas; el borde perforado en crema #EFEEE9; azul institucional #1A2B6B para los códigos y la tipografía de talón; rojo #D33A2C para sellos, muescas de rasgado y la barra de acento vertical; violeta #6D28D9 sólo en el degradado del titular (linear-gradient 135°, #1A2B6B → #6D28D9 → #D33A2C). Tipografía: DM Serif Display en titulares, Inter en cuerpo, JetBrains Mono en códigos, folios y sellos.\n\nANIMACIONES CONCRETAS. (a) 'Rasgado': al entrar en viewport, cada entrada se separa por la perforación —el talón se desplaza 8px a la derecha y rota 1.5 grados con `cubic-bezier(.2,.9,.3,1)` en 480ms— y luego vuelve a encajar. (b) 'Sellado': los sellos aparecen con `scale(2.4) rotate(-18deg)` y opacidad 0, y caen a `scale(1) rotate(-8deg)` en 180ms con un rebote mínimo y un temblor de 2px, dejando una sombra rojiza que se disipa. (c) 'Troquel animado': los círculos de la perforación se dibujan de arriba abajo con `clip-path: inset()` a lo largo de 600ms al entrar la tarjeta. (d) 'Validación': al pasar el cursor sobre una tarjeta de highlight, una línea de escáner cian recorre el código de barras en 700ms y el borde de la tarjeta pasa de gris a verde por 300ms. (e) 'Talonario': en la sección de stack, el fajo se abanica 6 grados al hacer scroll con transformaciones escalonadas de 40ms entre tarjetas. (f) El fondo lleva un patrón de confeti de perforaciones diminutas que se desplaza a la mitad de la velocidad del scroll. Todas las animaciones se anulan bajo `prefers-reduced-motion`, dejando las entradas ya rasgadas y los sellos ya puestos.",
    "statusShort": "En producción",
    "categoryShort": "Software empresarial",
    "media": [
      {
        "src": "/proyectos/vileads-events/logo-full.png",
        "kind": "logo",
        "caption": "Logotipo completo de Vileads: infinito degradado azul-rojo con burbuja de diálogo y el descriptor 'Visionary Leaders App'. Sobre fondo claro."
      },
      {
        "src": "/proyectos/vileads-events/logo-white.png",
        "kind": "logo",
        "caption": "Versión del logotipo para fondos oscuros."
      },
      {
        "src": "/proyectos/vileads-events/favicon.svg",
        "kind": "icon",
        "caption": "Favicon: cuatro barras verticales sobre cuadrado redondeado color tinta (#0A0E1A), la última en rojo #D33A2C."
      },
      {
        "src": "/proyectos/vileads-events/logo-full-1.png",
        "kind": "logo",
        "caption": "Copia del logotipo servida como asset público de la aplicación."
      },
      {
        "src": "/proyectos/vileads-events/logo-white-1.png",
        "kind": "logo",
        "caption": "Copia del logotipo en versión clara servida como asset público."
      }
    ]
  },
  {
    "slug": "boutique-conny",
    "name": "Boutique Conny",
    "tagline": "Sistema de control de tienda: inventario vivo, ventas, fiados con semáforo y cierre de caja que se va por WhatsApp",
    "category": "Web app de retail / punto de venta",
    "year": "2026",
    "role": "Desarrollo completo (producto, frontend React, modelo de datos y reglas de Firestore, aprovisionamiento del proyecto Firebase)",
    "status": "En producción interna — desplegable en Firebase Hosting; el único paso manual pendiente es activar el proveedor Email/Contraseña en la consola de Firebase",
    "summary": [
      "Aplicación web para una boutique multimarca real que se llevaba en cuaderno: registrar lo que entra, lo que se vende, lo que se fía y cuánto quedó en caja al final del día.",
      "Dos roles con vistas distintas sobre los mismos datos: la vendedora (Marisabel) ve inventario, ventas, fiados y cierre; la administradora (Conny) ve además el resumen financiero con gráficos y el módulo contable para el SENIAT.",
      "Todo corre sobre Cloud Firestore en tiempo real con caché persistente: si se cae el internet en la tienda, la app sigue registrando y sincroniza sola al volver la señal.",
      "El cierre de caja diario genera un PDF con jsPDF y abre WhatsApp con el informe ya redactado hacia el teléfono de la dueña, que es como realmente circula la información en el negocio."
    ],
    "problem": "Una boutique de ropa multimarca operaba con cuaderno y memoria: nadie sabía con certeza cuántas unidades quedaban de cada categoría, los fiados a clientas y familiares se olvidaban hasta que alguien preguntaba, el cierre del día se cuadraba de cabeza y el contador recibía las ventas del mes en mensajes sueltos. Además la vendedora no debía ver márgenes ni información financiera, pero sí necesitaba operar el día completo sin depender de la dueña.",
    "solution": "Una sola app web instalable desde el navegador del teléfono, con navegación por pestañas distinta según el rol. El inventario se maneja por grupo y categoría de producto con stepper de +/- para ajustar existencias en segundos, y viene con un catálogo base de 54 productos precargables desde la lista de precios real de la tienda. Cada venta y cada fiado descuentan del stock dentro de una transacción de Firestore, y guardan un snapshot del producto (grupo, nombre, precio) para que el histórico no cambie aunque después se edite el catálogo. Los fiados llevan un semáforo por fecha promesa (rojo vencido, ámbar por vencer, verde al día, gris liquidado) que reordena la lista sola y hace latir la alerta roja. Al final del día, el cierre calcula totales por método de pago, arma el PDF con la tabla de prendas vendidas y abre WhatsApp con el texto listo para la dueña; el módulo SENIAT hace lo mismo por rango de fechas o mes completo, con exportación a PDF y CSV/Excel.",
    "highlights": [
      {
        "title": "Inventario por categorías con stepper",
        "description": "Cada producto vive como grupo + nombre + precio + cantidad. Un stepper de − / + ajusta existencias sin abrir formularios, con badge de estado (Agotado, Quedan N, N en stock) y catálogo base de 54 ítems cargable de una vez.",
        "icon": "Shirt"
      },
      {
        "title": "Fiados con semáforo de vencimiento",
        "description": "Cada fiado guarda monto total, abono inicial e historial de abonos, y se pinta según su fecha promesa: rojo vencido (con pulso animado), ámbar a tres días o menos, verde al día, gris liquidado. La lista se ordena por urgencia automáticamente.",
        "icon": "CalendarClock"
      },
      {
        "title": "Cierre de caja a PDF + WhatsApp",
        "description": "Un botón calcula los totales del día por método de pago, descarga un PDF con encabezado de marca y tabla de prendas, y abre WhatsApp con el informe ya escrito hacia el número de la dueña.",
        "icon": "MessageCircle"
      },
      {
        "title": "Módulo contable SENIAT",
        "description": "Reporte por rango de fechas o mes completo, con detalle de cada venta (ID, fecha, hora, grupo, producto, cantidad, monto, método) exportable a PDF o a CSV con BOM para que Excel abra bien los acentos.",
        "icon": "Receipt"
      },
      {
        "title": "Funciona sin internet",
        "description": "Firestore se inicializa con caché persistente y gestor multipestaña, y la sesión se guarda en el dispositivo. La tienda sigue vendiendo con la señal caída y todo se sincroniza al volver.",
        "icon": "WifiOff"
      },
      {
        "title": "Dos roles, una base de datos",
        "description": "El rol vive en users/{uid} y define tanto las pestañas visibles como las reglas de Firestore: solo la administradora puede anular ventas o fiados y escribir perfiles.",
        "icon": "ShieldCheck"
      },
      {
        "title": "Contabilidad anclada a Caracas",
        "description": "Todas las fechas contables se formatean con Intl en la zona America/Caracas, para que una venta cerca de medianoche no caiga en otro mes fiscal según el reloj del teléfono.",
        "icon": "Globe"
      }
    ],
    "features": [
      "Login con selector visual de rol (Conny administradora / Marisabel vendedora) que precarga el correo correspondiente",
      "Sesión persistente en el dispositivo: no hay que escribir la clave en cada visita",
      "Inventario buscable por producto o grupo, con filtro por los 6 grupos del negocio",
      "Alta de producto con autocompletado de precio desde el catálogo de la lista de precios",
      "Edición de producto en modal (grupo, nombre, precio, cantidad) y borrado con confirmación",
      "Carga masiva del catálogo base de 54 productos con cantidad cero, en un batch de Firestore",
      "Venta rápida con combobox buscador tipo select2, cantidad, monto autocalculado y método de pago",
      "Descuento atómico de stock en la venta: si no hay existencia suficiente, la transacción falla y no se registra nada",
      "Historial de ventas filtrable por rango de fechas y grupo, con total del filtro",
      "Anulación de venta por la administradora, que devuelve las unidades al stock",
      "Fiados: cliente, producto entregado, cantidad, total calculado, abono inicial y fecha promesa obligatoria no pasada",
      "Registro de abonos con atajos de Mitad y Saldar todo, y validación contra el saldo leído del servidor",
      "Marcado automático como Liquidado cuando el saldo llega a cero",
      "Detalle de fiado con historial de pagos y anulación (solo administradora), que devuelve el producto al stock",
      "Dashboard con KPIs animados (ingresos del mes, vendido hoy, unidades en stock, valor de inventario)",
      "Gráfico de dona de ingresos por método de pago y gráfico de barras de ventas por día del mes",
      "Tarjeta de cuentas por cobrar con deuda total y contador de fiados vencidos, con salto directo a la pestaña de Fiados",
      "Cierre de caja por fecha con totales de Efectivo, Pago Móvil y Zelle",
      "Vista previa del mensaje de WhatsApp en un bloque estilo chat, con botón de copiar al portapapeles",
      "Reporte por período con filtro multiselección de grupos, exportado a PDF paginado",
      "Exportación CSV/Excel del período con BOM UTF-8 y fila de total",
      "Códigos secuenciales seguros PROD-0001 / V-0001 / F-0001 generados por transacción sobre meta/counters",
      "Toasts, modales tipo bottom-sheet y estados vacíos ilustrados en toda la app",
      "Respeto de prefers-reduced-motion: todas las animaciones se anulan para quien lo pide"
    ],
    "stack": [
      {
        "group": "Frontend",
        "items": [
          "React 19",
          "Vite 8",
          "JavaScript (ESM)",
          "CSS custom properties (theme.css propio, sin framework)"
        ]
      },
      {
        "group": "Datos y backend",
        "items": [
          "Firebase 12",
          "Firebase Authentication (Email/Contraseña)",
          "Cloud Firestore en tiempo real (onSnapshot)",
          "persistentLocalCache + persistentMultipleTabManager (offline)",
          "runTransaction y writeBatch",
          "Reglas de seguridad de Firestore basadas en rol",
          "Firebase Hosting (SPA rewrite a index.html)"
        ]
      },
      {
        "group": "Gráficos y documentos",
        "items": [
          "Recharts 3 (PieChart, BarChart)",
          "jsPDF 4",
          "jspdf-autotable 5"
        ]
      },
      {
        "group": "Tipografía y marca",
        "items": [
          "Fraunces (titulares y cifras)",
          "Poppins (interfaz)",
          "Google Fonts con preconnect"
        ]
      },
      {
        "group": "Tooling y aprovisionamiento",
        "items": [
          "ESLint 10 con eslint-plugin-react-hooks y eslint-plugin-react-refresh",
          "Script Node de aprovisionamiento (scripts/setup-auth.mjs) contra Identity Toolkit Admin API y Firestore REST",
          "Firebase CLI y gcloud para crear la base y desplegar reglas"
        ]
      }
    ],
    "architecture": "SPA de React 19 montada por Vite, sin router: App decide entre Login y AppShell según el estado de autenticación, y AppShell conmuta pantallas por estado local con dos juegos de pestañas (cinco para vendedora, cinco para administradora). Dos contextos sostienen todo: AuthContext escucha onAuthStateChanged, lee el perfil de users/{uid} y expone isAdmin; DataContext abre tres listeners onSnapshot (inventory, sales, credits) ordenados por createdAt y expone las acciones de dominio. Toda escritura que toque stock pasa por runTransaction: las ventas, los fiados, los abonos, las anulaciones y el ajuste rápido de cantidad leen el documento del servidor dentro de la transacción antes de decidir, y los códigos secuenciales se sacan de meta/counters también transaccionalmente, de modo que dos teléfonos vendiendo a la vez no pisan el mismo número ni sobrevenden. Ventas y fiados guardan un snap del producto (grupo, nombre, precio) para congelar el histórico. La lógica pura vive en src/lib: format.js concentra formato de dinero, fechas ancladas a America/Caracas con Intl, el catálogo base, las reglas de emoji por producto y el cálculo de saldo y semáforo de fiados; cashclose.js concentra los cómputos de cierre y rango, el texto de WhatsApp y la construcción de los PDF. La seguridad se apoya en firestore.rules, que resuelve el rol leyendo el documento del usuario y reserva a admin las eliminaciones de ventas y fiados y la escritura de perfiles. No hay Cloud Functions: el proyecto vive en el plan Spark y toda la lógica es cliente + reglas.",
    "challenges": [
      {
        "problem": "Dos personas registrando ventas desde teléfonos distintos podían sobrevender la última unidad o repetir el mismo código de venta.",
        "solution": "Cada venta, fiado, abono, anulación y ajuste de stock se ejecuta dentro de runTransaction: se relee el documento de inventario en el servidor, se valida la existencia y recién ahí se escribe la venta y se descuenta. Los códigos PROD-/V-/F- salen de una transacción propia sobre meta/counters."
      },
      {
        "problem": "El internet de la tienda se cae y las ventas no pueden esperar.",
        "solution": "Firestore se inicializa con persistentLocalCache y persistentMultipleTabManager, y la autenticación con browserLocalPersistence. La app sigue registrando contra la caché local y sincroniza al recuperar señal, sin que la vendedora tenga que hacer nada."
      },
      {
        "problem": "Con serverTimestamp pendiente, las ventas recién registradas tenían createdAt en null y desaparecían de las listas y los totales del día durante unos instantes.",
        "solution": "Cada documento guarda además createdAtLocal con el ISO del cliente, y los helpers whenDate/whenKey/whenMonth caen a ese campo cuando el timestamp del servidor todavía no llegó."
      },
      {
        "problem": "Una venta a las once de la noche podía contarse en otro día (u otro mes fiscal) si el teléfono estaba configurado en otra zona horaria.",
        "solution": "Todas las claves contables se derivan con Intl.DateTimeFormat fijado a America/Caracas, de modo que el día y el mes del reporte no dependen del reloj del dispositivo."
      },
      {
        "problem": "El plan Spark no permite activar el proveedor Email/Contraseña por API gratuita, y había que crear los dos usuarios con sus roles sin trabajo manual repetido.",
        "solution": "scripts/setup-auth.mjs automatiza todo lo automatizable: intenta habilitar el proveedor vía Identity Toolkit Admin API con el token de gcloud, crea (o reconoce si ya existen) las dos cuentas y escribe sus documentos de rol y el contador inicial vía Firestore REST. Es idempotente y se puede reejecutar. Solo queda un clic en consola documentado en el README."
      },
      {
        "problem": "El desplegable nativo con 54 productos era inusable en un teléfono para registrar una venta rápida.",
        "solution": "Se construyó un SearchSelect propio: un combobox con buscador integrado, cierre por click fuera y touchstart, lista de 240px con scroll táctil y opción resaltada, que filtra por nombre y por grupo mientras se escribe."
      },
      {
        "problem": "La vendedora necesitaba operar todo el día pero no debía ver ganancias ni el resumen financiero.",
        "solution": "El rol de users/{uid} define dos juegos de pestañas y dos vistas distintas del mismo dato: la vendedora entra directo a Inventario y no tiene acceso a Resumen ni SENIAT, y las reglas de Firestore reservan las eliminaciones a admin. El README documenta explícitamente el límite de este enfoque y la alternativa de mover los costos a una colección solo-admin."
      }
    ],
    "metrics": [
      {
        "value": "8",
        "label": "pantallas reales (login + 7 vistas)"
      },
      {
        "value": "2",
        "label": "roles con navegación propia"
      },
      {
        "value": "5",
        "label": "colecciones de Firestore"
      },
      {
        "value": "7",
        "label": "operaciones atómicas con runTransaction"
      },
      {
        "value": "3",
        "label": "listeners en tiempo real"
      },
      {
        "value": "54",
        "label": "productos en el catálogo base"
      },
      {
        "value": "6",
        "label": "grupos de inventario"
      },
      {
        "value": "3",
        "label": "métodos de pago soportados"
      },
      {
        "value": "0",
        "label": "Cloud Functions (todo cliente + reglas)"
      }
    ],
    "brand": {
      "primary": "#d4567a",
      "secondary": "#14142b",
      "accent": "#c9a35a",
      "bg": "#fbf2f4",
      "surface": "#ffffff",
      "text": "#1c1830",
      "gradient": "linear-gradient(125deg, #d4567a 0%, #b8385f 100%)",
      "mood": "Boutique cálida y femenina en modo diurno: fondo rosa empolvado, tarjetas blancas de esquinas muy redondeadas, rosa fucsia como color de acción, azul marino profundo reservado para el panel de marca y detalles dorados de vitrina. Titulares en Fraunces serif, interfaz en Poppins. Semántica de color viva para el semáforo de fiados: verde al día, ámbar por vencer, rojo vencido.",
      "source": "/Users/macbook/boutique-conny-app/src/theme.css (bloque :root — --rose #d4567a, --rose-d #b8385f, --navy #14142b, --gold #c9a35a, --bg #fbf2f4, --card #ffffff, --ink #1c1830, --pink #ec7f9b, --cream #f4ead2)"
    },
    "links": {},
    "uiScreens": [
      {
        "name": "Login con selector de rol",
        "describe": "Pantalla centrada sobre un fondo radial: un halo blanco arriba que se degrada a rosa pálido (#fbe2ea) y luego al rosa empolvado del fondo (#fbf2f4). En lo alto flota un panel navy de esquinas de 28px con gradiente radial (#1d1d3e → #14142b → #0f0f2a), borde rosa claro de 2px y sombra profunda; dentro late el wordmark 'cuteofertas' en Fraunces serif, con 'cute' en crema (#f4ead2) y 'ofertas' en rosa claro (#ec7f9b), un corazón diminuto suspendido sobre la 'o' que titila, siete destellos dorados con forma de estrella de cuatro puntas dispersos por el panel y cuatro corazones que suben y se desvanecen desde el borde inferior. Bajo el wordmark, la línea 'MULTIMARCA · MODA · OFERTAS' en dorado, 10.5px, tracking de 4px. Fuera del panel, en gris malva: 'Boutique Conny · Sistema de Control'. Debajo, una tarjeta blanca de 380px máximo, radio 22px y sombra rosada, con dos botones grandes lado a lado para elegir quién entra: '👗 Marisabel / Vendedora' y '👑 Conny / Administradora'; el elegido cambia su borde a rosa (#d4567a) y su fondo a #fff5f8. Siguen los campos Correo (precargado según el rol) y Contraseña con placeholder de puntos, inputs de borde #f0e1e7 y radio 12px que se tiñen de rosa al enfocarse, una línea de error reservada en rojo y el botón 'Entrar' a todo el ancho, con gradiente rosa de 125°, radio 13px y un barrido de brillo blanco diagonal al pasar el cursor. Pie: 'Cada quien usa su propio correo y contraseña.'"
      },
      {
        "name": "Inventario (vendedora)",
        "describe": "Barra superior blanca translúcida con desenfoque, sticky, con un chip navy redondeado que lleva el wordmark 'cuteofertas' en pequeño a la izquierda, y a la derecha '👗 Marisabel' más un botón 'Salir'. Debajo, título 'Inventario' en Fraunces rosa oscuro (#b8385f) 22px con el contador '18 productos' a la derecha en gris. Una fila de tres KPIs: dos tarjetas blancas ('Productos 18', 'Unidades en stock 96') y la tercera en gradiente rosa con texto blanco ('Valor en tienda $1,842.00'), todas con cifras en Fraunces 25px que suben contando al entrar. Botón rosa a todo el ancho '➕ Agregar producto'. Luego una tarjeta con un buscador '🔎 Buscar producto o grupo...' y un select 'Todos los grupos' con los seis grupos. La lista son tarjetas de producto: cuadrado rosa pálido de 42px con el emoji deducido del nombre (👗 vestidos, 👖 pantalones, 🧢 gorras), a su lado el nombre en negrita con un píldora de estado al costado —verde '12 en stock', ámbar 'Quedan 3', gris 'Agotado'—, debajo en gris 'Damas · PROD-0007', y a la derecha el precio en Fraunces 18px rosa oscuro ('$23.00'). En la fila inferior de cada tarjeta, un stepper en píldora con botones rosa pálido '−' y '+' y la cantidad centrada en negrita, y al extremo derecho los botones fantasma 'Editar' (rosa) y 'Borrar' (rojo). Las tarjetas entran escalonadas con un fadeInUp y se levantan 2px al pasar el cursor. Pegada abajo, la barra de cinco pestañas blanca con iconos emoji: 👗 Inventario (activa, rosa, icono ligeramente elevado y agrandado), ➕ Nueva, 💵 Vender, 📒 Fiados, 📲 Cierre."
      },
      {
        "name": "Venta rápida",
        "describe": "Título 'Venta rápida' con el contador '18 con stock'. Una tarjeta blanca contiene el formulario: etiqueta 'Producto vendido *' y un combobox propio que se ve como un input pero al tocarlo despliega un panel flotante de borde rosa claro y radio 14px, con un buscador '🔍 Buscar producto o grupo…' arriba y una lista con scroll donde cada opción se lee 'Vestidos Playeros Largos · Damas — $23.00 (12 disp.)' y la seleccionada queda con fondo rosa pálido y texto rosa oscuro. Debajo, dos campos en rejilla: 'Cantidad *' (numérico, con tope en la existencia) y 'Monto cobrado ($) *' que se recalcula solo al cambiar la cantidad. Una nota ámbar informa 'Existencia disponible: 12'. Para el método de pago, un segmentado sobre fondo rosa grisáceo (#f3e8ed) con tres botones —Efectivo, Pago Móvil, Zelle— donde el activo queda blanco con sombra y texto rosa oscuro. Cierra el botón rosa '💵 Registrar venta' y una nota azul: 'Al registrar, se descuenta la cantidad vendida del stock automáticamente.' Más abajo, la sección 'Ventas registradas' con su contador y monto, una tarjeta de filtros Desde / Hasta / Grupo con un enlace subrayado '↺ Volver a hoy', y la lista de ventas como filas con cuadrado de emoji, nombre del producto ('2× Blusas Manga Larga'), línea gris 'Damas · 2026-06-15 14:32' y a la derecha el monto en rosa oscuro con una píldora de método debajo (verde Efectivo, azul Pago Móvil, violeta Zelle). Al registrar una venta sube desde abajo un bottom-sheet blanco de esquinas superiores redondeadas, con barrita gris de arrastre, título '✅ Venta registrada', el código 'V-0042', la fila del producto y el botón 'Nueva venta'."
      },
      {
        "name": "Fiados con semáforo",
        "describe": "Título 'Control de Fiados' con '4 pendientes'. En vista de administradora, dos KPIs arriba: uno en gradiente rosa con 'Deuda total $312.00' y otro blanco '🔴 Vencidos 2' que si hay vencidos se tiñe de rojo pálido con borde rojo. Sigue un segmentado de tres estados —'Todos (9)', 'En curso (4)', 'Pagados (5)'—, el botón rosa '➕ Nuevo fiado' y un buscador de cliente. La lista son tarjetas blancas con una barra de color de 5px en el borde izquierdo según el semáforo: roja para vencido (con un lavado rojo pálido que se degrada a blanco en el 16% del ancho), ámbar para por vencer, verde para al día y gris atenuado al 75% de opacidad para liquidado. Cada tarjeta abre con el nombre del cliente en negrita 15.5px ('Tía Rosa'), debajo el producto con su emoji ('👗 Vestidos Casuales Largos · Damas') y una insignia de estado: '🔴 ALERTA ROJA · VENCIDO' en rojo sólido sobre blanco que late con un halo pulsante, '🟡 Por vencer' en ámbar suave, '🟢 Al día' en verde suave o '✓ Liquidado' en gris. A la derecha, el saldo en 19px negrita rosa oscuro ('$45.00'), y debajo en gris pequeño 'de $75.00' y '📅 22 jun 2026'. Si hubo abonos, una sección separada por una línea punteada lista 'Abono inicial $30.00' y cada abono con su fecha, en dos columnas. Abajo, el botón pequeño rosa '💰 Registrar abono' y, para la administradora, un 'Detalle' fantasma. Al abonar sube un bottom-sheet con el KPI 'Saldo pendiente actual', el campo de monto y dos atajos secundarios: 'Mitad' y 'Saldar todo ($45.00)'. La lista siempre viene ordenada rojo → ámbar → verde → liquidado."
      },
      {
        "name": "Resumen / Dashboard (administradora)",
        "describe": "Título 'Resumen' con el mes en curso a la derecha ('Junio 2026'). Rejilla de cuatro KPIs en dos columnas: la primera en gradiente rosa con texto blanco 'Ingresos del mes $2,480.00', y tres blancas 'Vendido hoy $145.00', 'Unidades en stock 96' y 'Valor inventario $1,842.00'; las cifras están en Fraunces 25px y hacen un conteo animado con easing al montar. Debajo, dos tarjetas de gráfico lado a lado en pantallas anchas y apiladas en teléfono: la primera, 'Ingresos por método' con el subtítulo '37 ventas este mes', muestra una dona de radio interno 50 y externo 85 con separación de 2° entre segmentos, coloreada verde #2e9e6b para Efectivo, azul #3a6ea5 para Pago Móvil y violeta #7b5cd6 para Zelle, y bajo ella una leyenda horizontal con cuadraditos de color y el monto de cada método en negrita; la segunda, 'Ventas por día', dibuja barras rosas (#d4567a) de esquinas superiores redondeadas sobre una grilla punteada rosa muy tenue, con los días del mes en el eje X en 11px y el tooltip formateado como 'Día 15 · $145.00'. Cierra una tarjeta 'Cuentas por cobrar / Dinero en la calle' con dos KPIs ('Deuda total pendiente $312.00' con borde rojo si hay vencidos, y '🔴 Vencidos (alerta) 2') y, cuando hay vencidos, un botón secundario blanco de borde rosa 'Ver fiados vencidos →' que salta a la pestaña de Fiados. Si un gráfico no tiene datos, aparece un estado vacío centrado con un emoji grande al 70% de opacidad ('📊 Aún no hay ventas este mes.'). Barra inferior de administradora: 📊 Resumen, 🧾 SENIAT, 📒 Fiados, 👗 Inventario, 📲 Cierre."
      },
      {
        "name": "Cierre de caja + informe a la dueña",
        "describe": "Título 'Cierre de Caja' con '7 ventas'. Primero una tarjeta con un único campo de fecha (tope hoy). Luego cuatro KPIs: 'Total facturado' en gradiente rosa y tres blancos con Efectivo, Pago Móvil y Zelle. Para la administradora aparece la tarjeta 'Ventas del día' con el subtítulo 'Puedes anular una venta equivocada (se devuelve al stock)' y filas de venta con hora, píldora de método y un botón rojo diminuto 'Anular'. El corazón de la pantalla es la tarjeta 'Informe para la dueña / Se envía a Conny · +1 (407) 770-7272': dentro, un bloque estilo chat de WhatsApp con fondo casi negro (#0b141a), texto claro monoespaciado y esquinas de 14px que muestra el mensaje literal —'🛍️ CIERRE DE CAJA DIARIO - BOUTIQUE CONNY 🛍️', la fecha larga en español, el total facturado, los tres desgloses por método y la lista '👕 Prendas Vendidas hoy:' con viñetas—. Debajo, el botón verde a todo el ancho '📲 Enviar informe (PDF + WhatsApp)' y, en fila, '📄 Solo PDF' (secundario rosa) y '📋 Copiar texto' (fantasma). Sigue la tarjeta '📄 Reporte por período' con dos campos de fecha, una fila de chips redondeados para los seis grupos que se encienden en rosa pálido al seleccionarlos, una nota azul con el conteo del período y el botón 'Generar reporte PDF'. Cierran dos notas: una ámbar explicando que se descarga el PDF y se abre WhatsApp con el mensaje listo para adjuntarlo, y otra recordando que el cierre suma solo ventas, no fiados."
      }
    ],
    "visualConcept": "VITRINA DE BOUTIQUE CON LUZ QUE BARRE LA PRENDA. La landing se comporta como el escaparate de la tienda de noche: un plano navy profundo (#0f0f2a → #14142b, gradiente radial desplazado al 30%/20%) que hace de vidrio y calle oscura, y sobre él tarjetas de contenido en blanco y rosa empolvado (#fbf2f4) que son las prendas iluminadas. Es el reverso exacto de la app —que es clara y diurna porque se usa con luz de tienda— y esa inversión es la idea: la landing enseña de noche lo que la app opera de día. El barrido de luz no es un adorno inventado: es el mismo @keyframes shine que ya vive en el theme.css del proyecto (una banda blanca al 45% de ancho, inclinada -18°, que cruza de -120% a 320%), llevado de un botón a toda la página.\n\nHÉROE — la vitrina. Pantalla completa navy con un halo rosa (#ec7f9b al 8%) hundido en el interior, como luz de neón reflejada en el vidrio. Al centro, el panel de marca recreado tal cual del login: esquinas de 28px, borde rosa claro de 2px, sombra de 50px, el wordmark 'cuteofertas' en Fraunces con el corazón que titila sobre la 'o', destellos dorados de cuatro puntas dispersos y corazones que suben y se desvanecen. Cada 6 segundos, una banda de luz cálida atraviesa el panel en diagonal de izquierda a derecha en 900ms con easing de salida, y a su paso los destellos dorados suben a opacidad plena durante 200ms antes de volver a su titileo: la luz literalmente barre la prenda. Debajo, el titular en Fraunces blanco crema (#f4ead2) y el subtítulo en rosa claro. En reposo, un hilo dorado de 1px recorre el borde inferior del héroe de izquierda a derecha cada 8 segundos, como el riel de una vitrina.\n\nPERCHERO DE MÓDULOS. Las siete capacidades no se listan: cuelgan. Una fila horizontal con scroll (rejilla de 3 columnas en escritorio) donde cada tarjeta pende de un riel dorado dibujado en SVG de 2px que cruza la sección; cada tarjeta lleva un pequeño gancho circular dorado que la une al riel, y al entrar en el viewport se balancea una vez (rotación ±1.5° amortiguada en 700ms). Las tarjetas son blancas de radio 18px con sombra rosada (0 12px 34px rgba(120,40,70,.14)), icono en cuadrado rosa pálido, titular en Fraunces rosa oscuro y cuerpo en Poppins gris malva. Al pasar el cursor, la tarjeta sube 3px y recibe su propio shine sweep de 700ms —la luz individual del foco de vitrina—. En orden: inventario, ventas atómicas, fiados, cierre, SENIAT, offline, roles.\n\nSEMÁFORO EN VIVO. Sección de fiados sobre navy, con tres tarjetas apiladas que replican las fcard reales de la app con su barra lateral de 5px: roja, ámbar, verde. La roja late con el mismo pulseAlert del proyecto (halo rojo que se expande 7px y se apaga cada 1.7s). Al hacer scroll, las tres se reordenan visualmente de rojo a verde con una transición FLIP de 400ms, mostrando en un gesto lo que hace semaforoSort.\n\nEL CIERRE QUE SE VA. Sección partida en dos: a la izquierda, la maqueta del bloque de chat oscuro (#0b141a) con el texto del informe escribiéndose línea por línea con un cursor de bloque rosa; a la derecha, la primera página del PDF con su franja rosa oscuro (#b8385f) de 90pt y las cuatro tarjetas de totales. Cuando el mensaje termina de escribirse, un barrido de luz cruza el PDF y la maqueta se desliza 12px hacia la derecha con una estela rosa, como si el informe saliera hacia el teléfono de la dueña.\n\nCONTADORES. Las métricas se muestran en cifras Fraunces de 48px que cuentan hacia arriba con el mismo easeOutCubic del componente KPI real, sobre tarjetas navy de borde rosa translúcido.\n\nPALETA Y REGLAS. Navy #14142b y #0f0f2a como lienzo, rosa #d4567a y #b8385f para acción y cifras, rosa claro #ec7f9b para el wordmark y las estelas, dorado #c9a35a exclusivamente para rieles, destellos y hilos de luz (nunca para texto de párrafo), crema #f4ead2 para titulares sobre navy, blanco y #fbf2f4 para las superficies de contenido. Fraunces para todo titular y toda cifra, Poppins para todo lo demás. Ningún elemento se anima por debajo de 400ms salvo los micro-hover, y toda la coreografía —barridos, balanceos, pulsos, conteos, tipeo— se anula bajo prefers-reduced-motion, igual que hace la app.\n\nQUÉ LA DISTINGUE. Es la única landing del portafolio construida sobre la metáfora de un escaparate: rieles dorados visibles, tarjetas que cuelgan y se balancean, y una luz que recorre la página de extremo a extremo en vez de gradientes animados de fondo. Donde otras landings usan glow o partículas, esta usa una sola banda de luz dura y direccional, siempre en la misma diagonal de -18°, repetida a distintas escalas: en el panel de marca, en cada tarjeta al hover y en el PDF del cierre.",
    "statusShort": "En producción",
    "categoryShort": "Fintech",
    "media": []
  },
  {
    "slug": "sistema-cavas",
    "name": "Sistema de Cavas",
    "tagline": "Cadena de frío, procesos y nómina para una procesadora de alimentos venezolana, offline-first y sin servidor propio.",
    "category": "Software empresarial · ERP de cadena de frío (Android + web)",
    "year": "2026",
    "role": "Análisis del negocio, especificación técnica, arquitectura, sistema de diseño y desarrollo Flutter + Firebase",
    "status": "En desarrollo activo — Fase 0 y 0.5 (cimientos, identidad de marca, acceso y roles) construidas sobre un plan de 11 fases ya especificado",
    "summary": [
      "Sistema de gestión de cavas de congelación, procesos de planta y nómina para Inversiones MarSaLe 0216, C.A. (RIF J-40776405-5), una procesadora de alimentos que recibe pescado y mariscos, los almacena en cámaras frigoríficas, los procesa y los factura por kilo y por día de estadía.",
      "Sustituye a una aplicación hecha en AppSheet que nunca llegó a emitir el PDF de la nota de recepción ni la nota de entrega con la dirección completa del cliente: las dos cosas por las que el dueño pagó y que el desarrollador anterior no logró resolver.",
      "El proyecto arranca con nueve documentos de especificación ejecutable —más de catorce mil líneas— que cubren seguridad y roles, modelo de datos Firestore, núcleo operativo, comercial y cobranza, RRHH y nómina venezolana, documentos y exportación, sistema de diseño, arquitectura offline-first y módulos adicionales. Cada uno fue revisado de forma adversarial contra su propio borrador y las correcciones están anotadas con su motivo.",
      "La restricción que define toda la arquitectura es el plan Spark de Firebase: sin Cloud Functions, sin Admin SDK en servidor, sin custom claims en tiempo de ejecución, sin cron y sin FCM enviado desde servidor. Todo lo que en otro proyecto sería un trigger aquí se resuelve con reglas de seguridad, transacciones, cómputo en el cliente o scripts de Node que corren a mano en el portátil.",
      "Lo que hoy está construido y compila es la Fase 0: paleta muestreada del logo real, tema claro y oscuro verificado contra WCAG, logo dibujado y animado con CustomPainter, splash, login, guard de sesión sin bucles, cascarón de navegación adaptativo por rol y panel con indicadores todavía vacíos, más las reglas de Firestore y Storage en modo denegar-por-defecto."
    ],
    "problem": "La planta trabajaba con una aplicación de AppSheet que se quedó a medias. Tres fallas concretas la hacían inservible: la nota de recepción nunca salía en PDF con la dirección completa del cliente, no había forma de emitir la nota de entrega sin IVA que exige el negocio, y el estado real de cada trabajo vivía en la cabeza de alguien en vez de en el sistema. A eso se suma el contexto: cavas con señal de móvil pobre y cortes eléctricos, operarios manipulando el teléfono con guantes de nitrilo mojados a −20 °C o bajo sol directo, doble moneda con tasa BCV e IGTF, kilos que hay que cuadrar al gramo entre lo que entra, lo que se procesa, la merma y lo que sale, y una nómina venezolana con feriados, descuento del día de descanso, prestaciones y utilidades. El dueño necesitaba saber, al kilo, qué tiene cada cliente en cada cava y desde cuándo, y poder cobrar por ello.",
    "solution": "Una aplicación Flutter única para Android (planta) y web (administración) sobre Firebase en plan gratuito, diseñada desde el primer día como offline-first: la caché de Firestore siempre encendida y sin límite de tamaño, identificadores generados en el cliente, correlativos por bloques reservados para poder emitir documentos sin red, y fechas de negocio escritas como literales porque el sello de servidor vale nulo mientras no sincroniza. La seguridad no depende de la interfaz: las reglas de Firestore deniegan todo por defecto y se abren colección por colección, el rol vive en el documento del usuario y se lee con un único get() por evaluación, la auditoría y el kardex son estrictamente append-only, y ningún usuario puede tocar los campos de control de su propio perfil. El dinero se guarda en centavos enteros y el peso en gramos enteros, con la tasa a ocho decimales y aritmética en BigInt, porque un double en Firestore descuadra cuentas por cobrar con hiperinflación. Y toda la identidad visual sale del logo real de la empresa: el azul petróleo de las ondas del mar significa frío y bajo control, el naranja del sol significa que algo se salió de rango.",
    "highlights": [
      {
        "title": "Backend sin backend: todo el diseño cabe en el plan gratuito",
        "description": "Sin Cloud Functions no hay triggers, ni cron, ni custom claims, ni numeración en servidor, ni render de PDF remoto. Cada uno de esos huecos tiene su compensación explícita: reglas de seguridad que validan lo que un trigger validaría, transacciones para los correlativos, cómputo al abrir la pantalla, PDF generado en el propio dispositivo y scripts de Node con firebase-admin que el desarrollador ejecuta a mano. La documentación incluye una tabla de qué cambia el día que se active Blaze, y la recomendación de no activarlo hasta la Fase 5.",
        "icon": "CloudOff"
      },
      {
        "title": "Reglas que deniegan por defecto, sin comodines",
        "description": "firestore.rules no tiene ningún match /{document=**} permisivo: una subcolección futura no puede quedar expuesta por olvido. Hoy solo están abiertas usuarios, config y auditoria. El perfil propio se lee siempre porque el guard de sesión lo necesita, pero listar la colección es solo del administrador; nadie se auto-eleva el rol porque la actualización propia bloquea los campos rol, activo, clienteId y estacionesPermitidas; y los usuarios no se borran, se desactivan, para no perder la trazabilidad de quién hizo qué.",
        "icon": "ShieldCheck"
      },
      {
        "title": "Offline-first porque el camión llega de madrugada a una cava sin señal",
        "description": "La persistencia de Firestore arranca con caché ilimitada en main.dart. El identificador de cada documento es generado en el cliente y el número legible va en un campo aparte, porque los correlativos exigen transacción y una transacción no funciona sin red: un documento creado offline queda como «S/N (pendiente de numerar)» con chip ámbar y tiene prohibido pasar a estado cerrado hasta que se numere. Las fechas de negocio se derivan en el cliente a hora de Caracas y se escriben como literales, porque serverTimestamp vale nulo en la caché local hasta que sincroniza.",
        "icon": "WifiOff"
      },
      {
        "title": "Enteros escalados: ni un céntimo ni un gramo en coma flotante",
        "description": "Peso en gramos enteros, dinero en centavos enteros, tasa BCV a ocho decimales, porcentajes en centésimas y temperatura en décimas de grado. Todo producto de tasa por monto se calcula en BigInt y se convierte al final, porque en Flutter web los enteros de Dart son doubles de 53 bits y el error aparece justo al conciliar contra el extracto bancario. El motivo está escrito en la especificación: FieldValue.increment sobre double acumula error de coma flotante en el saldo y en los kilos en cava; con enteros el incremento es exacto y conmutativo.",
        "icon": "Binary"
      },
      {
        "title": "Paleta muestreada del logo, con cada contraste verificado",
        "description": "Los hexadecimales no son inventados: se muestrearon píxel a píxel del logo real de la empresa y cada par de colores está calculado con la fórmula WCAG 2.1. De ahí salen dos reglas duras que el código repite en comentarios: sobre el naranja del sol el texto es #2B1400 y nunca blanco, porque el blanco da 2,37:1; y el teal medio y el oliva de la colina son decorativos, jamás fondo de texto. Hay además un anti-objetivo escrito: ningún tono entre 260° y 330° en toda la aplicación, porque el lila es el color por defecto de AppSheet y es exactamente lo que el dueño rechaza.",
        "icon": "Palette"
      },
      {
        "title": "Diseñado para guantes mojados, sol directo y penumbra de cava",
        "description": "El sistema de diseño define un modo campo con paleta de alto contraste, tipografía dos puntos mayor, botones de 64 dp, bordes de 2 dp y gradientes sustituidos por color plano porque los degradados pierden legibilidad con reflejo. Los objetivos táctiles nunca bajan de 48 dp y el teclado de pesos usa teclas de 72 a 88 dp separadas 12 mm, porque con guante de nitrilo el dedo tiene unos 14 mm de área efectiva. Toda la animación pasa por un único helper que la anula de golpe cuando el sistema pide reducir movimiento.",
        "icon": "Hand"
      }
    ],
    "features": [
      "Acceso con correo y contraseña contra Firebase Auth, con mensajes de error traducidos a lenguaje que un operario entiende: «Correo o contraseña incorrectos», «Sin conexión, verifica el internet», «Esta cuenta está desactivada, habla con el administrador».",
      "Estado de sesión resuelto en un único valor síncrono con cinco casos —cargando, sin sesión, sin acceso, debe cambiar clave y activa— para que el guard del router decida sin esperar a Firestore.",
      "Cambio de contraseña obligatorio en el primer ingreso: el administrador entrega una clave temporal y la bandera debeCambiarClave no baja hasta que el usuario elige la suya.",
      "Pantalla explícita de «sin acceso» para la cuenta que existe en Auth pero no tiene perfil, no tiene rol reconocido o fue desactivada, con el correo en pantalla para que el administrador sepa a quién habilitar.",
      "Ocho roles con permisos distintos: administrador, gerente de planta, administración, operador, control de calidad, recursos humanos, cliente y auditor.",
      "Navegación construida desde el catálogo de roles, de modo que nadie ve una pestaña que las reglas de seguridad le negarían; el operador entra directo a sus tareas y el cliente a su mercancía.",
      "Cascarón adaptativo por ancho de pantalla: barra inferior en el teléfono de planta, rail lateral en tablet y rail extendido con etiquetas en la PC de oficina.",
      "Panel de indicadores con kilos en cava, recepciones del día, órdenes en proceso y cuentas por cobrar, hoy con guion en vez de cifra y con un aviso honesto de que se llenan a partir de la Fase 1.",
      "Marcador de sección en construcción que dice en qué fase concreta llega cada módulo, en vez de un «próximamente» sin fecha.",
      "Logo de la empresa dibujado con CustomPainter en vez de mostrar el JPG: escala sin pixelarse, el sol sale por detrás del horizonte y las seis ondas del mar ondulan con dos senos superpuestos para que el oleaje no se vea mecánico.",
      "Tema claro y oscuro completos, con Material 3, colores semánticos propios expuestos como ThemeExtension y tres estados térmicos de negocio: congelado, refrigerado y fuera de rango.",
      "Tipografía Sora para títulos e Inter para texto y cifras, con cifras tabulares obligatorias en toda columna de kilos, montos y temperaturas.",
      "Localización es-VE en toda la aplicación, con formato de miles con punto y decimales con coma.",
      "Reglas de Firestore y de Cloud Storage en modo denegar-por-defecto, con auditoría append-only que ni el administrador puede modificar.",
      "Índices compuestos declarados para las consultas que ya existen: usuarios activos ordenados por nombre y auditoría por usuario y fecha.",
      "Scripts de administración en Node ESM con firebase-admin, fuera de la aplicación, para crear el administrador y dar de alta usuarios cuando la app todavía no puede.",
      "Especificado — Hoja de recepción fiel a la plantilla en papel, con servicios como selección múltiple, condición de la mercancía, temperatura y tabla de bruto, jaula, cesta, neto, unidades y lote; y PDF en dos copias, original para el cliente y copia para archivo.",
      "Especificado — Inventario por lote con kardex append-only, cavas y ubicaciones, etiquetas QR de lote imprimibles y escaneables, alertas de estadía prolongada y tablero de ocupación.",
      "Especificado — Órdenes de proceso con los tres estados reales de la planta, aplicación del operador con tarjetas grandes, modo guantes y háptica, captura de mermas por tipo y balance de masa con glaseo y tolerancia por producto.",
      "Especificado — Tarifario con vigencias, devengo de almacenaje por kilo-día por tramos, nota de entrega sin IVA con doble moneda y tasa BCV congelada, IGTF configurable y apagado por defecto, abonos, estado de cuenta y antigüedad de saldos.",
      "Especificado — Exportación de cualquier tabla a PDF con membrete y a Excel con celdas numéricas reales, más reportes de kilos por cliente, ingresos por servicio, mermas y rendimiento, ocupación de cavas y productividad por operario.",
      "Especificado — Módulo de recursos humanos con expediente del empleado, asistencia con origen controlado, feriados, parámetros legales versionados, motor de nómina en Dart puro y recibo en PDF."
    ],
    "stack": [
      {
        "group": "Aplicación",
        "items": [
          "Flutter",
          "Dart ^3.10.8",
          "Material 3",
          "cupertino_icons ^1.0.8"
        ]
      },
      {
        "group": "Estado y navegación",
        "items": [
          "flutter_riverpod ^3.3.2",
          "go_router ^17.5.0"
        ]
      },
      {
        "group": "Firebase (plan Spark)",
        "items": [
          "firebase_core 4.13.0 (fijada)",
          "firebase_core_web >=3.9.0 <3.11.0",
          "firebase_auth >=6.3.0 <6.7.0",
          "cloud_firestore >=6.6.0 <6.9.0 con persistencia offline",
          "Firestore Security Rules",
          "Cloud Storage Rules",
          "Firebase Hosting",
          "Emuladores de Auth, Firestore, Storage y UI"
        ]
      },
      {
        "group": "Interfaz, tipografía y formato",
        "items": [
          "google_fonts ^8.2.1 (Sora + Inter)",
          "flutter_animate ^4.5.2",
          "intl 0.20.2",
          "flutter_localizations",
          "shared_preferences ^2.5.5"
        ]
      },
      {
        "group": "Herramientas y administración",
        "items": [
          "firebase-admin ^13.6.0 en scripts Node ESM",
          "flutter_lints ^6.0.0",
          "flutter_test"
        ]
      }
    ],
    "architecture": "Paquete Flutter único llamado sistema_cavas, con Clean Architecture por feature en tres capas —domain, infrastructure, presentation— bajo lib/features, y un núcleo compartido en lib/core. El sistema de diseño vive entero en lib/core/design_system y no depende de ninguna feature: tokens de marca muestreados del logo, colores semánticos como ThemeExtension, escala tipográfica, escala de espaciado en múltiplos de cuatro, radios, duraciones y curvas, puntos de corte y el pintor animado del logo; ninguna pantalla declara un Color literal. El estado es Riverpod sin generación de código, con providers escritos a mano. La navegación es go_router con un ShellRoute que envuelve el cascarón adaptativo y un redirect que lee un estado de sesión síncrono y devuelve null cuando el usuario debe quedarse donde está, precisamente para no entrar en bucle. La autenticación combina el flujo de Firebase Auth con el perfil en usuarios/{uid} escuchado como stream, y el rol se persiste como cadena en mayúsculas, nunca como índice de enum, para que reordenar el enum no cambie los permisos de nadie. Firebase corre en el proyecto sistemas-de-cava en plan Spark: Auth con correo y contraseña, Firestore en modo nativo con persistencia y caché ilimitada, reglas que deniegan todo por defecto, hosting apuntando a build/web y emuladores configurados en 9099, 8080, 9199 y 4000. Lo que exige privilegios de servidor vive fuera de la aplicación, en scripts de Node ESM con firebase-admin que se ejecutan a mano desde el portátil del desarrollador: no son Cloud Functions y el propio package.json lo aclara.",
    "challenges": [
      {
        "problem": "Sin Cloud Functions no se pueden escribir custom claims, así que el rol no puede vivir en el token y las reglas se quedan sin la vía normal de autorización.",
        "solution": "El rol se guarda en usuarios/{uid} y las reglas lo leen con get(). Como cada get() de una regla es una lectura facturable, las funciones se diseñaron para invocarse una sola vez por operación, con la cadena habilitado → perfil → rol encapsulada; y un rol desconocido se trata como «sin permisos», nunca como un valor por defecto permisivo."
      },
      {
        "problem": "createUserWithEmailAndPassword desloguea al administrador que está creando la cuenta, y en Spark no hay Admin SDK en servidor para evitarlo.",
        "solution": "Alta desde una instancia secundaria de FirebaseApp: se crea el usuario contra esa instancia, se escribe su documento de perfil y se cierra sesión solo en la secundaria, sin tocar nunca la app principal. Como respaldo y para los casos que la app no cubre quedan los scripts crear_admin.mjs y crear_usuario.mjs con firebase-admin, que corren en el portátil."
      },
      {
        "problem": "El guard de navegación de un proyecto anterior entraba en bucle porque consultaba la base de datos dentro del redirect.",
        "solution": "Se introdujo un enum EstadoSesion con cinco casos que se resuelve de forma síncrona a partir de dos streams ya escuchados, y un puente ChangeNotifier entre Riverpod y refreshListenable. El redirect devuelve null cuando el usuario debe quedarse donde está: devolver siempre una ruta es exactamente lo que produce el bucle, y así quedó anotado en el código."
      },
      {
        "problem": "serverTimestamp vale nulo en la caché local mientras no hay red, de modo que ordenar o agrupar por fecha rompe la aplicación justo en la planta, que es donde no hay señal.",
        "solution": "Las fechas de negocio se derivan en el cliente a hora de Caracas (UTC−4 fijo, sin horario de verano) y se escriben además como cadenas literales de día, mes, año y semana; se ordena por esa cadena más un identificador ULID, las reglas validan coherencia con el reloj del servidor con tolerancia de dos días, y si el desfase de reloj del dispositivo supera cinco minutos la app bloquea la captura y pide corregir la hora."
      },
      {
        "problem": "El borrador del kardex marcaba el movimiento original como revertido y además lo filtraba al reconstruir saldos, con lo que el reverso se contaba dos veces y el saldo quedaba mal.",
        "solution": "Se eliminó el campo revertido del modelo. La reconstrucción suma todos los movimientos sin filtro y el par original-reverso se anula solo; la interfaz pinta tachado el original consultando si existe un movimiento que lo apunte. El kardex y la auditoría quedaron append-only por reglas, sin excepción para ningún rol."
      },
      {
        "problem": "El naranja del sol del logo, que es el color más reconocible de la marca, no alcanza contraste con texto blanco: da 2,37:1.",
        "solution": "Se muestreó el logo píxel a píxel, se calculó cada par con la fórmula WCAG 2.1 y se construyeron dos esquemas de color completos donde el naranja solo aparece como color terciario con texto #2B1400 encima. Los colores decorativos —el teal medio de las ondas y el oliva de la colina— quedaron marcados en el código como prohibidos para fondo de texto, y el azul puro del wordmark se ajustó a #1740B3 para el rol de información."
      },
      {
        "problem": "La versión más reciente de firebase_core rompía la compilación web con el SDK de Dart en uso, y la última de intl no resolvía contra flutter_localizations.",
        "solution": "Se fijaron versiones exactas con el motivo escrito junto a cada una en pubspec.yaml: firebase_core en 4.13.0 y un límite directo sobre firebase_core_web porque la 3.11.0 llama a un método de interoperabilidad que no existe en ese Dart, e intl en 0.20.2 porque es la versión exacta que exige el SDK. Sin esa nota, el siguiente que actualice dependencias repite el fallo."
      }
    ],
    "metrics": [
      {
        "value": "9",
        "label": "documentos de especificación técnica"
      },
      {
        "value": "14.126",
        "label": "líneas de especificación escritas"
      },
      {
        "value": "11",
        "label": "fases en el plan de ejecución"
      },
      {
        "value": "8",
        "label": "roles con permisos diferenciados"
      },
      {
        "value": "10",
        "label": "secciones de navegación por rol"
      },
      {
        "value": "14",
        "label": "rutas registradas en go_router"
      },
      {
        "value": "6",
        "label": "pantallas construidas en la Fase 0"
      },
      {
        "value": "35",
        "label": "colecciones y subcolecciones modeladas"
      },
      {
        "value": "3",
        "label": "colecciones abiertas hoy en las reglas"
      },
      {
        "value": "0",
        "label": "Cloud Functions: todo corre en plan gratuito"
      }
    ],
    "brand": {
      "primary": "#0E4C5A",
      "secondary": "#14707A",
      "accent": "#F49021",
      "bg": "#081113",
      "surface": "#16242A",
      "text": "#E2F0F3",
      "gradient": "linear-gradient(180deg, #2A5A68 0%, #1B3F4A 55%, #0A2029 100%)",
      "mood": "Frío industrial y mar profundo: azules petróleo sacados de las ondas del logo para decir «bajo control», con el naranja del sol reservado para cuando algo se sale de rango. Sobrio, legible bajo sol directo, sin un solo tono lila porque ese es el color de AppSheet y es justo lo que el cliente rechaza.",
      "source": "/Users/macbook/Sistema-de-cavas/lib/core/design_system/tokens/ms_brand.dart y /Users/macbook/Sistema-de-cavas/lib/core/design_system/ms_tema.dart (hexadecimales muestreados del logo real de Inversiones MarSaLe; el gradiente es el de PantallaSplash y PantallaLogin)"
    },
    "links": {},
    "uiScreens": [
      {
        "name": "Splash — el sol sale detrás de las ondas",
        "describe": "Pantalla completa cubierta por un degradado vertical de tres paradas: #2A5A68 arriba, #1B3F4A al medio y #0A2029 abajo. Centrada, la marca dibujada en vivo con CustomPainter dentro de una caja de 240 × 173 px: un disco solar de radio equivalente al 24 % del ancho, relleno con degradado radial de #FFC15E a #F49021 y rodeado de un halo naranja al 28 % de opacidad, que asciende desde el 72 % de la altura hasta el 30 % en 1.800 ms con curva easeOutCubic y queda recortado por el horizonte para que parezca salir del agua. Delante del sol, seis trazos de onda apilados con extremos redondeados, de #5EC1BC a #1B3F4A de arriba abajo, cada uno más fino y más tenue que el anterior, ondulando en bucle de 6 s con dos senos superpuestos y medio radián de desfase entre trazos. Bajo la marca, 24 px de aire y el texto «Inversiones MarSaLe» en Sora 22 px seminegrita blanca, que entra con fundido de 600 ms tras 400 ms de espera. Abajo, 32 px más, una barra de progreso lineal de 120 px de ancho y 3 px de alto, pista blanca al 18 % y relleno naranja #F49021, que aparece a los 700 ms. Si el sistema pide reducir movimiento, todo se muestra ya en su estado final, sin animación."
      },
      {
        "name": "Login — tarjeta blanca sobre el mar",
        "describe": "El mismo degradado marino de tres paradas ocupa toda la pantalla, con el contenido centrado y limitado a 440 px de ancho. Arriba, el logo animado a 240 px (200 px en móvil) con fundido de 600 ms; debajo «Inversiones MarSaLe» en Sora 24 px negrita blanca, que entra a los 350 ms con desplazamiento vertical, y en 14 px blanco al 72 % con espaciado de letra de 1,2 px la línea «Sistema de cavas y procesos». Tras 32 px de aire, una tarjeta blanca de esquinas de 16 px con borde gris azulado de 1 px y sin sombra, que entra a los 600 ms subiendo un 12 %: dentro, el título «Iniciar sesión» en 22 px, un campo «Correo» con icono de arroba y un campo «Contraseña» con candado y ojo para mostrarla, ambos rellenos en blanco, borde de 1 px que pasa a 2 px en #0E4C5A al enfocar y esquinas de 12 px; luego un botón sólido de ancho completo y 48 px de alto en teal profundo #0E4C5A con la palabra «Entrar», que al pulsar cambia por un indicador circular de 20 px, y bajo él un botón de texto «Olvidé mi contraseña». Cuando falla el acceso aparece entre los campos y el botón un bloque de fondo #F9DEDC con icono de alerta y el mensaje traducido —por ejemplo «Correo o contraseña incorrectos.»— que entra con fundido de 200 ms y una sacudida horizontal de 3 Hz. Cierra la pantalla, a 24 px del borde inferior de la tarjeta, la línea «RIF J-40776405-5 · Empresa Procesadora de Alimentos» en 12 px blanco al 55 %, con fundido a los 900 ms."
      },
      {
        "name": "Panel — saludo, cuatro indicadores y una advertencia honesta",
        "describe": "Fondo #F2F8F9 en claro (#081113 en oscuro) con 24 px de margen. Arriba a la izquierda, en 14 px gris azulado, el saludo que cambia según la hora —«Buenos días,», «Buenas tardes,» o «Buenas noches,»— y justo debajo el nombre del usuario en Sora 28 px, que entra con fundido de 400 ms y sube un 20 %. Tras 24 px, una rejilla de tarjetas de proporción 3:2 que pasa de dos columnas por debajo de 700 px a tres hasta 1.100 px y a cuatro por encima, con 16 px de separación y entrada escalonada de 80 ms entre tarjetas. Cada tarjeta es blanca con borde gris azulado de 1 px y esquinas de 16 px: arriba a la izquierda un cuadrado de 8 px de radio relleno con el color del indicador al 12 % y su icono a 20 px dentro; abajo, la cifra en Sora 28 px con cifras tabulares y, bajo ella, el rótulo en 12 px gris. Los cuatro indicadores son «Kilos en cava» con copo de nieve en azul congelado #0E4C5A, «Recepciones hoy» con camión en teal #14707A, «Órdenes en proceso» con brazo robótico en ámbar #8A4A00 y «Por cobrar» con recibo en el teal primario; los cuatro muestran hoy un guion en vez de número. Cierra la pantalla, a 32 px, una tarjeta ancha con icono de obra y el texto en gris «Los indicadores se llenan a partir de la Fase 1, cuando entren las primeras recepciones.», con fundido a los 400 ms."
      },
      {
        "name": "Cascarón adaptativo — la misma app en el teléfono de planta y en la PC de oficina",
        "describe": "Una barra superior sin elevación, del mismo color que el fondo, con el título «Inversiones MarSaLe» alineado a la izquierda en 22 px y, a la derecha, un avatar circular de 32 px relleno en #C3EAEF con las iniciales del usuario en 12 px sobre #00313B; al pulsarlo baja 48 px un menú con el nombre completo, el rótulo del rol —«Gerente de planta», «Control de calidad», «Auditor»— un separador y la opción «Cerrar sesión» con icono. La navegación cambia con el ancho: por debajo de 600 px una barra inferior de 68 px de alto con fondo #F1F7F8, indicador relleno en #C3EAEF tras el icono activo y etiquetas de 12 px; entre 600 y 1.200 px un rail lateral con los mismos iconos y etiqueta bajo cada uno; por encima de 1.200 px el mismo rail extendido a 208 px con las etiquetas al lado del icono, seguido de un divisor vertical de 1 px. Los destinos se calculan a partir del rol, así que la barra del operador solo trae «Mis tareas», la del cliente solo «Mi mercancía» y la del administrador llega a las diez secciones: Panel, Recepción, Inventario, Procesos, Clientes, Documentos, Personal y Usuarios entre ellas. Al entrar en una sección todavía no construida el área de contenido muestra, centrado en 380 px, un reloj de arena de 56 px en gris, el nombre de la sección en 22 px y la línea «Esta sección se construye en la Fase 2.» en gris."
      },
      {
        "name": "Crea tu contraseña — el primer ingreso obligatorio",
        "describe": "Pantalla sobria sobre el fondo claro del tema, con barra superior sin elevación y el título «Crea tu contraseña» alineado a la izquierda. El contenido va centrado, limitado a 420 px y con 24 px de margen. Primero un párrafo en 14 px gris azulado: «Entraste con una contraseña temporal. Elige una propia para continuar.». Tras 24 px, un campo «Contraseña nueva» con icono de candado, texto oculto y ayuda «Mínimo 8 caracteres» bajo la línea, y a 16 px otro campo «Repite la contraseña» con icono de candado con flecha; ambos rellenos en blanco, esquinas de 12 px y borde que engorda a 2 px en teal al enfocar. Si la validación falla, el mensaje aparece bajo el campo en rojo #B3261E: «Usa al menos 8 caracteres» o «Las contraseñas no coinciden». Abajo, un botón sólido de ancho completo y 48 px de alto con «Guardar y continuar», que se sustituye por un indicador circular de 20 px mientras guarda, y bajo él un discreto botón de texto «Cerrar sesión» por si el usuario prefiere salir. Al guardar, la contraseña se actualiza en Auth y la bandera de clave temporal baja en el mismo paso, con lo que el guard del router lo lleva solo a la pantalla de inicio que le corresponde a su rol."
      }
    ],
    "visualConcept": "«Cámara frigorífica»: la landing se comporta como la cava de la planta. Empieza cerrada, se abre, la escarcha va cediendo a medida que uno baja y un termómetro en el margen marca en qué zona térmica está el visitante. La identidad es la del proyecto real —azul petróleo #0E4C5A y #14707A sobre casi negro #081113, con el naranja del sol #F49021 como única alarma— y jamás aparece un tono entre 260° y 330°, porque el proyecto prohíbe el lila por escrito.\n\nApertura. El primer viewport es una puerta de cava a pantalla completa: dos hojas de #16242A con junta perimetral de goma más oscura, remaches, un bisel de 2 px en #2B3F46 y una manija de acero cepillado horizontal. Sobre ellas, escarcha real dibujada en SVG —ramas dendríticas blancas al 6 %— y una placa de identificación con «CAVA-1 · −18,0 °C» en cifras tabulares. Al cargar, las hojas se separan hacia los lados con transform translateX de ±52 % en 900 ms y curva cubic-bezier(.16,1,.3,1), soltando una nube de vapor frío (dos capas con blur de 18 px y opacidad 0 → 0,5 → 0 en 1,4 s) que se disipa hacia abajo y descubre el hero. Detrás aparece el logo animado tal como lo pinta la app: seis ondas de mar en degradado de #5EC1BC a #1B3F4A desplazándose en bucle de 6 s y un sol que sube del 72 % al 30 % de la caja con halo naranja. Titular en Sora negra: «Cadena de frío que sí emite el PDF». Subtítulo en Inter y dos chips de estado con punto luminoso: «Offline-first» y «Plan gratuito, sin Cloud Functions».\n\nTermómetro-guía. Fijo en el margen izquierdo, un tubo vertical de 6 px con bulbo abajo y escala de marcas cada 40 px. La columna se rellena con un degradado que va de #6FD3E0 a #F49021 en proporción al scroll, y una etiqueta flotante muestra la temperatura de la sección en la que está el lector. Las secciones se nombran con las cavas reales de la semilla del proyecto: TUNEL-1 (−35 °C) para la arquitectura más dura, CAVA-1 (−18 °C) para el núcleo operativo, CAVA-2 (0–4 °C) para las pantallas, ANTESALA (8–12 °C) para métricas y plan, y el cierre ya a temperatura ambiente. Al cruzar cada umbral, la etiqueta hace un micro-parpadeo y la escarcha del fondo pierde un 20 % de opacidad: la página literalmente se descongela mientras se lee.\n\nSuperficies. Cada tarjeta es una superficie fría: fondo #16242A, borde 1 px #2B3F46, y en las dos esquinas superiores un gradiente radial blanco al 8 % que simula el hielo acumulado. Al pasar el cursor, ese hielo se funde en 320 ms —la opacidad del radial baja a 0— el borde vira a #6FD3E0 y aparece una gota de condensación que resbala 12 px. Los números de las métricas usan font-feature-settings 'tnum' y suben con un contador; junto a los que son cero (las Cloud Functions) se pinta una insignia naranja de «fuera de lo esperado, y a propósito».\n\nSecciones. 1) Puerta y hero. 2) «Lo que no salía»: tres tarjetas de fallo del sistema anterior con el borde izquierdo naranja, escritas como partes de avería. 3) «Sin servidor»: diagrama en SVG de las compensaciones —reglas, transacciones, cómputo en cliente, scripts locales— con las flechas dibujándose por stroke-dashoffset al entrar en pantalla. 4) «Pantallas reales»: los mockups de splash, login, panel y cascarón dentro de marcos de teléfono con el degradado marino auténtico, y un conmutador claro/oscuro que cambia los cuatro a la vez. 5) «Decisiones a −18 °C»: los retos como fichas de lectura de termómetro, con el problema en la parte fría y la solución en la parte templada de cada ficha. 6) «Once fases»: línea de tiempo vertical dibujada como tubería de refrigeración con codos, escarcha en los tramos ya hechos y tubo desnudo en los pendientes. 7) Cierre: las dos hojas de la puerta vuelven a juntarse al llegar al pie, dejando entre ellas una rendija de luz con el CTA.\n\nMovimiento y accesibilidad. Toda la animación pasa por un único conjunto de variables de duración, y bajo prefers-reduced-motion la puerta arranca ya abierta, el vapor no existe, las ondas quedan quietas en su fotograma final y el termómetro deja de interpolar: se limita a saltar de sección en sección. Tipografía Sora para títulos e Inter para texto y cifras, exactamente las dos familias que usa la aplicación.",
    "statusShort": "En desarrollo",
    "categoryShort": "App móvil",
    "media": [
      {
        "src": "/proyectos/sistema-cavas/WhatsApp-Image-2026-09-06-at-20.37.14.jpeg",
        "kind": "logo",
        "caption": "Logo original de Inversiones MarSaLe 0216, C.A. sobre fondo transparente: sol naranja saliendo tras seis ondas de mar en degradado teal, colina verde con la escena del campesino y el buey, y el wordmark «Inversiones MarSaLe 0216 C.A» con el RIF J-40776405-5. Es la imagen de la que se muestrearon píxel a píxel todos los hexadecimales del sistema de diseño."
      }
    ]
  },
  {
    "slug": "telemedicina",
    "name": "Backoffice Telemedicina",
    "tagline": "Panel administrativo del módulo de telemedicina de Seguros Constitución: usuarios, doctores y teleconsultas en una sola consola.",
    "category": "Panel administrativo web · Salud digital / Seguros",
    "year": "2026",
    "role": "Desarrollo frontend completo: arquitectura feature-first, sistema de diseño, integración con la API REST del cliente y despliegue en subcarpeta con proxy propio.",
    "status": "Prototipo funcional entregado. Login real contra la API, cinco endpoints admin integrados y build de producción publicado en la subcarpeta /constitucion/ con proxy PHP para evitar CORS.",
    "summary": [
      "Backoffice web para el módulo de telemedicina de Seguros Constitución. Reúne en una sola consola la operación diaria del servicio: quiénes son los usuarios y pacientes registrados, qué doctores están conectados en este momento, qué teleconsultas están activas, en espera, finalizadas o rechazadas, y qué reseñas dejan unos sobre otros.",
      "El proyecto es 100% frontend: consume la API REST del cliente (dconstiapi.segurosconstitucion.com, documentada en su propio swagger) y no tiene backend propio. Toda la capa de datos está tipada en TypeScript a partir de los schemas del swagger, con un envoltorio `ApiResult<T>` que obliga a tratar el error como un valor y no como una excepción suelta.",
      "La arquitectura sigue un patrón feature-first: cada módulo (auth, dashboard, users, doctors, consult) encapsula sus páginas, componentes, hooks, tipos y llamadas al API, mientras `shared/` concentra el cliente axios con interceptores, el store de Redux Toolkit persistido, los componentes de interfaz reutilizables y el diccionario de textos.",
      "La estética es deliberadamente tipo macOS/iOS: superficies de vidrio con `backdrop-blur`, esquinas de 22–30 px, tres niveles de elevación por sombra, azul de sistema como color de acción, tipografía SF con ajuste óptico de tracking, y modo claro y oscuro completos definidos como tokens HSL."
    ],
    "problem": "La operación de telemedicina de una aseguradora vive repartida entre endpoints: un listado de usuarios, otro de doctores, otro de doctores conectados, otro de consultas con media docena de filtros y otro de reseñas. Sin una consola, el equipo administrativo depende de consultar el swagger o pedirle datos al equipo de backend cada vez que quiere saber cuántas consultas están en espera o qué médicos están disponibles. Encima, la API vive en un dominio distinto y sin cabeceras CORS abiertas, y el sitio debía publicarse en una subcarpeta de un hosting compartido donde no se puede usar mod_proxy.",
    "solution": "Un panel React + TypeScript de siete rutas que traduce esos endpoints en pantallas operativas: un dashboard que compone cuatro KPIs y un donut de estados a partir de conteos, listados paginados con filtros y búsqueda con debounce, un grid de doctores en línea con indicador verde, y un diálogo de detalle que abre la ficha completa de una teleconsulta (paciente, doctor, póliza, sala virtual y tiempos). La capa de red está centralizada en un cliente axios con interceptores que inyectan el token Bearer, la clave de aplicación y el idioma, cierran sesión ante un 401 y levantan un modal global ante un 5xx. Para el despliegue se escribió un proxy PHP propio más reglas .htaccess, de modo que el navegador solo habla con el dominio donde está publicada la app y el problema de CORS desaparece sin depender del backend.",
    "highlights": [
      {
        "title": "Dashboard compuesto sin endpoint de métricas",
        "description": "La API no expone un endpoint de estadísticas, así que el dashboard se arma con ocho peticiones en paralelo: totales de usuarios y doctores pidiendo page_size=1 y leyendo el campo total, doctores conectados, las cinco consultas más recientes y un conteo por cada uno de los cuatro estados.",
        "icon": "LayoutDashboard"
      },
      {
        "title": "Capa de API tipada con ApiResult",
        "description": "Cada servicio devuelve `ApiResult<T>` — un `{ok:true,data}` o un `{ok:false,status,title,detail,fieldErrors}` — con guardas `isOk`/`isErr`. Los errores de FastAPI (422 con array loc/msg) se traducen a errores por campo listos para react-hook-form.",
        "icon": "Layers"
      },
      {
        "title": "Interceptores que resuelven la sesión",
        "description": "Un único interceptor añade `Authorization: Bearer`, la cabecera de aplicación y `Accept-Language` a toda petición leyendo el store fuera de React; en respuesta, un 401 hace logout y redirige al login respetando la subcarpeta del build, y un 5xx dispara un modal global.",
        "icon": "KeyRound"
      },
      {
        "title": "Filtros de consultas fieles al swagger",
        "description": "La barra de consultas expone todos los parámetros del endpoint: búsqueda por nombre, ámbito paciente/doctor, estado, rango de fechas, criterio de orden (fecha, cédula del doctor, cédula del usuario) y dirección, con desactivación cruzada de campos incompatibles.",
        "icon": "Filter"
      },
      {
        "title": "Despliegue en subcarpeta con proxy propio",
        "description": "Build con `base=/constitucion/`, un `api-proxy.php` que reenvía `/dev/*` al API real vía cURL preservando cabeceras, y un `.htaccess` con `RewriteBase` que además resuelve el fallback de la SPA. Sin CORS y sin mod_proxy.",
        "icon": "Server"
      }
    ],
    "features": [
      "Login con react-hook-form + Zod contra POST /api/auth/login/, con lectura del token anidado y toast de error con el título y el detalle que devuelve la API",
      "Rutas protegidas por guard: sin sesión, cualquier ruta privada redirige a /login",
      "Dashboard con cuatro tarjetas KPI (usuarios totales, doctores registrados, doctores en línea, consultas activas)",
      "Donut de estados de consulta con Recharts, total al centro y leyenda con porcentaje por estado",
      "Bloque de consultas recientes y widget de equipo conectado, ambos con enlace a su listado completo",
      "Listado de usuarios paginado, con búsqueda con debounce de 400 ms y filtro por identificación, nombre o correo",
      "Reseñas por usuario vía UUID, más un modo «ver todas» que agrega las reseñas de todos los usuarios y las ordena por fecha",
      "Listado de doctores con especialidad, número de colegiado, años de experiencia, calificación en estrellas y estado de conexión",
      "Grid de doctores en línea con avatar de iniciales, punto verde de presencia y valoración",
      "Tabla de consultas con paciente, doctor, motivo, estado, póliza y tiempos de inicio y fin",
      "Diálogo de detalle de consulta con fichas de paciente, doctor y titular de póliza, datos de la póliza, sala virtual y token de sesión",
      "Paginación con ventana de páginas y elipsis, que respeta los links next/previous que devuelve la API",
      "Modo claro y oscuro conmutable desde la barra superior y persistido entre sesiones",
      "Estados de carga con skeletons por tabla y por tarjeta, y estados vacíos ilustrados con icono",
      "Animaciones de entrada por CSS puro: fade-up escalonado por hijo y curva de easing tipo iOS, anuladas bajo prefers-reduced-motion",
      "Navegación lateral fija en escritorio y menú deslizante en móvil"
    ],
    "stack": [
      {
        "group": "Núcleo",
        "items": [
          "React 18",
          "TypeScript 5 (strict)",
          "Vite 6",
          "@vitejs/plugin-react-swc",
          "react-router-dom 7"
        ]
      },
      {
        "group": "Estado y datos",
        "items": [
          "Redux Toolkit",
          "react-redux",
          "redux-persist",
          "Axios"
        ]
      },
      {
        "group": "Formularios y validación",
        "items": [
          "react-hook-form",
          "Zod",
          "@hookform/resolvers"
        ]
      },
      {
        "group": "UI y estilos",
        "items": [
          "Tailwind CSS 3",
          "tailwindcss-animate",
          "Radix UI (Dialog, Dropdown Menu, Slot)",
          "class-variance-authority",
          "clsx",
          "tailwind-merge",
          "lucide-react",
          "sonner",
          "Recharts"
        ]
      },
      {
        "group": "Build y despliegue",
        "items": [
          "PostCSS",
          "autoprefixer",
          "ESLint",
          "proxy PHP con cURL",
          "Apache .htaccess",
          "Hosting compartido Hostinger"
        ]
      }
    ],
    "architecture": "Feature-first sobre Vite. `src/features/` agrupa cinco módulos —auth, dashboard, users, doctors, consult— y cada uno contiene sus propias carpetas `pages/`, `components/`, `hooks/`, `api/`, `schemas/` y `types/`, de modo que una funcionalidad se lee y se borra completa desde una sola carpeta. `src/shared/` concentra lo transversal: el cliente axios con interceptores de petición y respuesta, un envoltorio `apiAxios` que decide entre JSON, multipart y x-www-form-urlencoded según el payload, los manejadores que normalizan errores de FastAPI a `ApiResult`, el store de Redux Toolkit con cuatro slices (auth, theme, lang, ui) persistidos selectivamente en localStorage, nueve primitivas de interfaz al estilo shadcn construidas con CVA, siete hooks genéricos (paginación, debounce, tema, traducción, media query, auth, api) y el diccionario de textos. `src/app/` monta providers y rutas: todas las páginas se cargan con `React.lazy`, y las privadas cuelgan de un guard `RequireAuth` que envuelve al layout. El hook `usePagination` es el corazón de los listados: recibe cualquier fetcher que devuelva `ApiResult<Paginated<T>>`, gestiona página, tamaño y parámetros, descarta respuestas obsoletas con un contador de petición y vuelve a la página 1 cuando cambian los filtros. En producción el build sale a `build/` con `base=/constitucion/` y se sirve junto a `.htaccess` y `api-proxy.php`, que actúa como pasarela server-side hacia la API real.",
    "challenges": [
      {
        "problem": "La API del cliente vive en otro dominio y no devuelve cabeceras CORS para el origen del panel; en local el navegador bloqueaba el preflight del login y en el hosting compartido no existe mod_proxy para reenviar las peticiones.",
        "solution": "Dos pasarelas simétricas. En desarrollo, un proxy en vite.config.ts que redirige `/dev/*` a la API con changeOrigin y traza cada petición y respuesta en consola. En producción, un `api-proxy.php` propio que reconstruye la URL destino, reenvía las cabeceras relevantes (autorización, clave de aplicación, tipo de contenido, idioma) y llama a la API vía cURL, enrutado desde `.htaccess`. El navegador solo habla con el dominio del panel, así que el problema desaparece sin tocar el backend."
      },
      {
        "problem": "El primer build de producción salía en blanco y con llamadas rotas: Vite incrusta rutas absolutas en el bundle, y la app debía publicarse en la subcarpeta /constitucion/ y no en la raíz del dominio.",
        "solution": "Se fijó `base: '/constitucion/'` solo en modo producción, se movió la URL del API a un `.env.production` apuntando a la propia subcarpeta, el router se monta con `basename={import.meta.env.BASE_URL}` y el redirect del interceptor 401 se reescribió sobre `BASE_URL`. Se documentó además una lista de verificación previa a subir el build y los tres sitios que hay que tocar si la subcarpeta cambia."
      },
      {
        "problem": "El dashboard necesita totales por estado de consulta, pero la API no expone ningún endpoint de métricas ni agregados.",
        "solution": "Se derivan del propio listado: cada conteo pide una página de un solo elemento filtrando por estado y se queda con el campo `total` de la respuesta paginada. Las ocho llamadas (totales, conectados, recientes y los cuatro estados) salen en un único `Promise.all`, y cada fallo se reporta por separado sin tumbar el resto del tablero."
      },
      {
        "problem": "La pantalla de reseñas solo permitía consultarlas usuario por usuario pegando un UUID, porque el endpoint exige `user_id`; hacía falta una vista global para revisar la calidad del servicio.",
        "solution": "Se añadió un modo «ver todas» que pide el listado completo de usuarios, dispara las peticiones de reseñas en paralelo, fusiona los resultados descartando los que fallaron y los ordena en cliente por fecha. Queda aislado tras un flag para poder sustituirlo por un endpoint agregado el día que exista."
      },
      {
        "problem": "Al teclear en la búsqueda o cambiar filtros con la red lenta, respuestas viejas llegaban después de las nuevas y repintaban la tabla con datos caducos.",
        "solution": "`usePagination` lleva un contador de petición en una ref: cada carga incrementa el contador y, al resolver, compara su identificador con el actual y se descarta si ya no es la última. La búsqueda además pasa por un debounce de 400 ms y cualquier cambio de parámetros devuelve la paginación a la página 1."
      }
    ],
    "metrics": [
      {
        "value": "7",
        "label": "rutas de la aplicación"
      },
      {
        "value": "5",
        "label": "módulos de negocio"
      },
      {
        "value": "6",
        "label": "endpoints REST integrados"
      },
      {
        "value": "4",
        "label": "slices de Redux"
      },
      {
        "value": "167",
        "label": "claves de texto en el diccionario"
      },
      {
        "value": "82",
        "label": "archivos TypeScript / TSX"
      }
    ],
    "brand": {
      "primary": "#0071e3",
      "secondary": "#38bdf8",
      "accent": "#0a84ff",
      "bg": "#f5f5f7",
      "surface": "#ffffff",
      "text": "#1a1a1c",
      "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)",
      "mood": "Clínico y sereno con acabado tipo macOS: fondo gris perla, tarjetas blancas de vidrio esmerilado, azul de sistema como único color de acción y una paleta semántica de estado (verde #34c759 activa, ámbar #ff9f0a en espera, gris #8e8e93 finalizada, rojo #ff3b30 rechazada). Tipografía SF con tracking ajustado y sombras muy suaves en tres niveles. Modo oscuro de grafito casi negro (#0f0f10 de fondo, #1c1c1e en tarjetas) con el azul subido a #2a91ff.",
      "source": "/Users/macbook/telemedicina/src/index.css (tokens HSL en :root y .dark, con los hex anotados en comentarios), /Users/macbook/telemedicina/tailwind.config.ts (radios, sombras elev-1/2/3 y easing), /Users/macbook/telemedicina/public/favicon.svg (degradado #38bdf8 → #2563eb) y /Users/macbook/telemedicina/src/features/dashboard/components/ConsultStatusChart.tsx (colores de estado)"
    },
    "links": {},
    "uiScreens": [
      {
        "name": "Login",
        "describe": "Pantalla centrada sobre fondo gris perla (#f5f5f7) con dos halos difusos de fondo: uno azul arriba a la izquierda y otro violeta abajo a la derecha, ambos con blur muy alto y opacidad baja, sin bordes duros. Encima, una tarjeta de vidrio de 400 px de ancho máximo, esquinas de 30 px, fondo blanco al 88% con backdrop-blur y sombra profunda; entra con un fade + zoom sutil de medio segundo. Dentro, centrado: un cuadrado de 56 px con esquinas de 17 px y degradado azul (#38bdf8 → #2563eb) con un icono de escudo blanco; debajo el título «Backoffice Telemedicina» en semibold 22 px y el subtítulo «Accede al panel de telemedicina» en gris 13 px. Luego el formulario: etiqueta «Correo electrónico» y campo con fondo gris muy claro, etiqueta «Contraseña» y campo de tipo password, y un botón azul sólido de ancho completo con el texto «Entrar» y una flecha a la derecha; al enviar el botón muestra un spinner. Al pie, en gris tenue de 11 px, la línea «dconstiapi.segurosconstitucion.com · entorno DEV». Los errores de validación aparecen en rojo bajo cada campo."
      },
      {
        "name": "Dashboard — Resumen general",
        "describe": "Layout de dos columnas. A la izquierda, barra lateral fija de 256 px: una tarjeta de vidrio de altura completa con esquinas de 30 px que contiene, arriba, el cuadrado de logo azul con escudo, el nombre «Backoffice Telemedicina» en 13 px semibold y debajo «Seguros Constitución» en 11 px gris; una línea divisoria; y la navegación con seis entradas de 13 px con icono a la izquierda (Dashboard, Usuarios, Reseñas, Doctores, Doctores en línea, Consultas). La activa lleva fondo azul al 10%, texto azul y un anillo interior azul tenue. Al fondo de la barra, una cajita gris redondeada con un punto verde y el texto «Entorno DEV» sobre el host del API. A la derecha, barra superior pegajosa de 56 px, también de vidrio y esquinas de 16 px, con «Seguros Constitución» a la izquierda y, a la derecha, botón de luna/sol para el tema, el nombre y rol del usuario, un avatar circular con iniciales y un botón de salir. El contenido empieza con el título «Resumen general» y el subtítulo «Vista consolidada del módulo de telemedicina», con un botón secundario «Actualizar» con icono de refresco a la derecha. Debajo, una fila de cuatro tarjetas KPI blancas de esquinas 22 px y sombra suave: cada una muestra la etiqueta en mayúsculas de 11 px con tracking amplio, el número en 34 px semibold con cifras tabulares, y a la derecha un cuadrado de 44 px con degradado y un icono blanco: «USUARIOS TOTALES» 1.248 en azul, «DOCTORES REGISTRADOS» 86 en violeta, «DOCTORES EN LÍNEA» 12 en verde, «CONSULTAS ACTIVAS» 7 en ámbar. Luego una rejilla de tres columnas: a la izquierda, ocupando dos, la tarjeta «Consultas recientes» con un enlace «Ver ↗» en la cabecera y cinco filas, cada una con avatar de iniciales, nombre y correo del paciente, el motivo truncado, una píldora de estado de color y la fecha y hora en gris; a la derecha, la tarjeta «Consultas» con un donut de 120 px (radio interior 42, exterior 58, separación de 3 grados entre segmentos) en verde #34c759, ámbar #ff9f0a, gris #8e8e93 y rojo #ff3b30, con el total en 24 px al centro y la palabra «total» debajo, más una leyenda vertical de cuatro filas con cuadradito de color, nombre del estado, valor y porcentaje. Cierra la sección «Equipo conectado», una tarjeta con tres columnas de mini-fichas grises redondeadas: avatar con punto verde de presencia, nombre, especialidad y una píldora con los años de experiencia. Todo entra escalonado de abajo hacia arriba."
      },
      {
        "name": "Consultas",
        "describe": "Cabecera con el título «Consultas», el subtítulo «Historial y monitoreo de teleconsultas» y, a la derecha, una píldora gris con el conteo, por ejemplo «312 consultas». Debajo, una tarjeta blanca de filtros de esquinas 16 px con una rejilla de cuatro columnas: un campo de búsqueda de dos columnas con lupa a la izquierda y placeholder «Buscar por nombre» sobre fondo gris translúcido, un desplegable «Todos los usuarios / Paciente / Doctor», un desplegable de estado («Todas», «Activa», «En espera», «Finalizada», «Rechazada»), dos campos de fecha para el rango, un desplegable de criterio de orden («Fecha de consulta», «Identificación del doctor», «Identificación del usuario») y otro de dirección («Descendente / Ascendente»); abajo a la derecha, un botón fantasma «Limpiar filtros» con icono de deshacer. Cuando el criterio es fecha de consulta, la búsqueda y el ámbito se ven atenuados y desactivados. Después, la tabla dentro de una tarjeta con cabecera de columnas en 11 px gris: Paciente, Doctor, Motivo, Estado, Póliza, Inicio, Fin y una columna estrecha final. Cada fila tiene, en paciente y doctor, avatar de iniciales con nombre en 13 px y correo en 11 px gris; el motivo truncado a una línea; una píldora de estado —verde para «Activa», ámbar para «En espera», gris para «Finalizada», roja para «Rechazada»—; en póliza, el número en cifras tabulares y debajo una píldora de contorno con el tipo; en inicio y fin, la fecha arriba y la hora abajo en gris; y un chevron tenue a la derecha que indica que la fila es clicable. Mientras carga, ocho filas de skeletons grises animados. Al pie, la paginación: a la izquierda «312 registros · Página 2 de 32» en 11 px gris; a la derecha, flechas de anterior y siguiente y botones numerados de 32 px, con la página activa en azul sólido con texto blanco y elipsis «···» entre saltos."
      },
      {
        "name": "Doctores en línea",
        "describe": "Título «Doctores en línea», subtítulo «Equipo médico actualmente conectado» y botón «Actualizar» a la derecha. El cuerpo es una rejilla de tres columnas de tarjetas blancas de 22 px de radio con sombra sutil que se elevan al pasar el cursor. Cada tarjeta mide unos 104 px de alto y ordena en horizontal: un avatar circular grande con iniciales sobre fondo azul suave y, pegado a su esquina inferior derecha, un punto verde de 14 px con anillo del color de la tarjeta que marca la presencia; a su lado, el nombre completo en 14 px semibold, el correo en 11 px gris, una fila con una píldora azul clara con la especialidad («Medicina general», «Pediatría», «Cardiología») y, al lado, el texto «12 años» en gris; y debajo, cinco estrellas de 13 px en ámbar con la nota numérica al lado, por ejemplo 4.6. Las tarjetas entran escalonadas con un desplazamiento de 12 px hacia arriba. Si no hay nadie conectado, el sitio lo ocupa una tarjeta con estado vacío centrado: icono de wifi de trazo fino, el título «Aún no hay doctores conectados» y el subtítulo del apartado. Mientras carga, seis rectángulos redondeados grises pulsando."
      },
      {
        "name": "Detalle de consulta (diálogo)",
        "describe": "Modal centrado de hasta 672 px de ancho y 88% de alto de pantalla, con fondo oscurecido detrás y desplazamiento interno. Cabecera alineada a la izquierda: la píldora de estado de la consulta y, al lado, en 11 px monoespaciado gris, «ID de consulta: 4f2a9c1e…». El cuerpo se divide en secciones-tarjeta de fondo gris muy claro, borde tenue y esquinas de 22 px; cada una abre con un cuadradito de 24 px con fondo azul al 10% e icono azul y un título de 13 px semibold: «Paciente» con icono de persona, «Doctor» con estetoscopio, «Póliza de seguro» con escudo y «Datos de la consulta» con documento. Dentro de cada bloque de persona: avatar con iniciales, nombre completo en 14 px semibold y una píldora gris con el rol; debajo, una rejilla de dos columnas de campos donde la etiqueta va en mayúsculas de 11 px con tracking y el valor en 13 px — correo, identificación en formato V-27815456-0, género, fecha de nacimiento, calificación en estrellas y el recuento de valoraciones y reseñas; el bloque del doctor añade, tras una línea divisoria, especialidad, número de colegiado, años de experiencia y una píldora verde «En línea» o gris «Desconectado». La sección de póliza repite el patrón con número, tipo, estado y fechas de emisión y vigencia, más la ficha del titular. La última sección muestra motivo de consulta, sala virtual, token de sesión en monoespaciado y las marcas de creación, inicio y fin de la teleconsulta."
      }
    ],
    "visualConcept": "«Expediente clínico vivo»: la landing se comporta como una carpeta de historia médica que alguien va abriendo, con un pulso cardíaco que la recorre de arriba abajo como hilo conductor. Fondo gris perla #f5f5f7 en claro y grafito #0f0f10 en oscuro, con dos halos difusos de 460 px —azul #0071e3 al 7% y violeta al 6%, blur de 130 px— fijos detrás de todo el scroll, exactamente como el layout real de la app. Toda la superficie está regida por dos materiales: vidrio esmerilado (blanco al 72% con backdrop-blur y borde de un píxel casi invisible) y papel de ficha (blanco puro con sombra en tres capas). Nada de neón: el único color saturado es el azul de sistema, y el resto de la energía cromática la aportan los cuatro colores semánticos de estado.\n\nHÉROE — la pila de fichas. A la izquierda, el titular «Backoffice Telemedicina» en semibold con tracking negativo de -0.022em, la bajada «Usuarios, doctores y teleconsultas en una sola consola», y una línea de metadatos en 11 px mayúsculas: React 18 · TypeScript · Redux Toolkit. A la derecha, tres fichas clínicas apiladas en perspectiva, rotadas 3, 1.5 y 0 grados y desplazadas 18 px en X e Y, cada una con su pestaña superior de color (verde, ámbar, azul) como las lengüetas de un archivador. Al cargar, las fichas caen una tras otra con 90 ms de diferencia y la curva de la propia app, cubic-bezier(0.22,1,0.36,1): entran desde 24 px abajo con opacidad 0 y escala 0.97. Con el cursor encima, la pila se abanica —la de arriba sube 10 px, las de atrás se separan 6 px— y al salir vuelve a cerrarse. Cruzando el héroe de lado a lado, un trazo de electrocardiograma de 2 px en azul #0071e3 dibujado con SVG: `stroke-dasharray` animado en bucle de 3.2 s que hace correr el pulso de izquierda a derecha, con un punto brillante que viaja sobre la línea dejando un rastro de opacidad decreciente. El complejo QRS del trazo cae justo bajo el titular, no decorando el fondo sino subrayando la frase.\n\nMÉTRICAS — signos vitales. Franja de cuatro tarjetas idénticas a los KPI reales (etiqueta en mayúsculas de 11 px, número en 34 px con cifras tabulares, cuadrado degradado con icono a la derecha). Los números cuentan desde cero en 900 ms cuando la franja entra en viewport, y bajo cada uno late una micro-línea de pulso de 40 px sincronizada con el ritmo global, cada una en el color de su tarjeta: azul, violeta, verde, ámbar.\n\nRECORRIDO — el expediente que se abre. Las cinco pantallas documentadas se presentan como fichas del expediente, cada una con su pestaña de color y su número de folio en monoespaciado (01/05 … 05/05). Al hacer scroll, la ficha activa se levanta del apilado hacia el centro con un giro de 3 grados que se endereza, mientras la anterior se recuesta hacia atrás y pierde saturación. La navegación lateral es una columna de pestañas verticales tipo archivador que se resalta con el mismo fondo azul al 10% y anillo interior de la barra lateral real.\n\nARQUITECTURA — el gráfico de derivaciones. Diagrama sobre fondo de rejilla milimetrada muy tenue, como papel de ECG: cinco cajas de módulo (auth, dashboard, users, doctors, consult) conectadas a un carril compartido que baja hacia el cliente axios y de ahí, a través de la pasarela, al API. Las conexiones no son flechas estáticas sino pulsos: pequeños destellos azules que recorren cada trazo cada pocos segundos, más rápido en el carril del cliente axios, insinuando tráfico. Los interceptores se dibujan como dos anillos que el pulso atraviesa.\n\nRETOS — historial de incidencias. Cada reto es una entrada de historia clínica: fecha en el margen, un punto de color en una línea de tiempo vertical, el problema en texto plano y la solución dentro de una caja de vidrio. El punto activo late suavemente (escala 1 → 1.15 → 1 en 1.8 s).\n\nCIERRE. El trazo del ECG reaparece y se aplana en una línea recta que atraviesa el pie de página, con el icono del escudo médico del favicon al final del recorrido. Todo el sistema de movimiento —fade-up escalonado por hijo, easing de iOS, elevación al hover de 3 px— respeta prefers-reduced-motion: con la preferencia activa, el pulso queda dibujado y estático, las fichas aparecen ya apiladas y los contadores muestran su valor final.",
    "statusShort": "En producción",
    "categoryShort": "Panel administrativo",
    "media": [
      {
        "src": "/proyectos/telemedicina/favicon.svg",
        "kind": "icon",
        "caption": "Icono de la app: cuadrado redondeado de 12 px de radio con degradado azul #38bdf8 → #2563eb y, en trazo blanco, un escudo con una cruz médica dentro."
      }
    ]
  },
  {
    "slug": "vigtrack",
    "name": "Vigtrack",
    "tagline": "Control de asistencia y novedades para empresas de vigilancia privada",
    "category": "Web app empresarial · Operaciones y control de personal",
    "year": "2026",
    "role": "Desarrollador frontend y arquitecto de la aplicación",
    "status": "En desarrollo activo — maqueta completa y migración progresiva del mock a la API real",
    "summary": [
      "Vigtrack es el panel web con el que una empresa de seguridad privada deja de llevar la asistencia de sus oficiales en hojas de Excel. Cada día, cada región y cada puesto quedan registrados en una misma aplicación, con un flujo de aprobación que se puede auditar.",
      "La aplicación no es un único tablero: son cinco aplicaciones distintas bajo el mismo dominio. Administrador, supervisor regional, analista de operaciones, coordinador y centro de coordinación entran con el mismo login y reciben su propio menú lateral, su propio dashboard y su propio conjunto de rutas protegidas.",
      "El núcleo del sistema es el ciclo de una novedad: el supervisor la registra en campo, el analista revisa el justificativo, el coordinador decide, y el resultado escala a RRHH o muere en auditoría. Ese recorrido se muestra como una línea de pasos con fechas dentro del detalle de cada evento.",
      "Está construido feature-first sobre React 18, TypeScript en modo estricto y Vite: quince módulos independientes, veinticinco rutas registradas con carga diferida, Redux Toolkit con persistencia, formularios validados con Zod y una capa HTTP tipada que devuelve siempre un ApiResult.",
      "Los datos de la maqueta no son inventados: provienen de la exportación real del Excel operativo (parte CECOM y personal activo), lo que permitió diseñar cada pantalla contra volúmenes y casos reales antes de conectar el backend."
    ],
    "problem": "Una empresa de vigilancia privada con oficiales repartidos en decenas de sedes y varias regiones controlaba la asistencia con hojas de cálculo: un parte numérico mensual de categorías por día, listados de ausencias, egresos, ingresos, reasignaciones y vacaciones en pestañas separadas. Nadie podía saber en el momento cuántos puestos estaban descubiertos, quién tenía justificativo pendiente ni en qué manos estaba la decisión sobre una incidencia. Cada rol —supervisor en campo, analista, coordinador, administración— necesitaba una vista distinta de la misma realidad, y el Excel obligaba a todos a mirar la misma cuadrícula.",
    "solution": "Vigtrack traduce esa operación a una aplicación web con control de acceso por rol. El supervisor abre la jornada del día sobre un roster regional que asume presencia por defecto y solo pide marcar la novedad; el analista revisa justificativos y valida inconsistencias; el coordinador aprueba o rechaza y la decisión queda registrada con observación y fecha; el administrador mantiene los catálogos (clientes, sucursales, regiones, tipos de servicio, estatus de oficial, tipos de novedad) y consulta el histórico nacional. El parte numérico deja de ser una hoja y se convierte en un mapa de calor navegable por mes con exportación a CSV. Todo ello con tema claro/oscuro, interfaz bilingüe español/inglés y navegación inferior propia en móvil.",
    "highlights": [
      {
        "title": "Cinco roles, cinco aplicaciones",
        "description": "admin, supervisor, analyst, coordinator y coordination_center comparten login y layout, pero cada uno recibe su menú lateral, su barra inferior móvil y su dashboard. Los guards RequireAuth y RequireRole cierran cada ruta a la lista de roles que la pueden ver.",
        "icon": "UserCog"
      },
      {
        "title": "Jornada con estado explícito",
        "description": "La asistencia diaria no es una tabla editable suelta: la jornada pasa por sin abrir, abierta y cerrada. Cerrar dispara una confirmación y envía el reporte al coordinador; reabrir exige otra confirmación. El estado es visible como pastilla en la cabecera.",
        "icon": "CalendarCheck"
      },
      {
        "title": "Incidencias con tres firmas",
        "description": "Cada novedad recorre pendiente de análisis → analizada → aprobada (escala a RRHH) o rechazada (queda en auditoría). El modal de detalle dibuja el recorrido paso a paso con el rol responsable y la fecha de cada decisión.",
        "icon": "AlertOctagon"
      },
      {
        "title": "El parte numérico como mapa de calor",
        "description": "Veinte categorías por treinta días en una cuadrícula con columna fija, leyenda de rangos (0, 1–5, 6–15, 16+) y navegador de mes. Sustituye la hoja de cálculo original sin perder la lectura de un vistazo.",
        "icon": "LayoutGrid"
      },
      {
        "title": "Bilingüe, con tema y sesión persistidos",
        "description": "191 claves de traducción en español e inglés, tema claro/oscuro/sistema conmutado desde la barra superior y redux-persist guardando auth, tema e idioma en el navegador para que la sesión sobreviva a la recarga.",
        "icon": "Languages"
      }
    ],
    "features": [
      "Login con email y contraseña contra la API real, token Bearer inyectado por interceptor y expulsión automática al recibir un 401",
      "Dashboards diferenciados por rol con tarjetas KPI (oficiales activos, presentes, con novedad, cubiertos por backup, puestos sin cubrir, vacaciones, reasignaciones)",
      "Asistencia diaria por región con filtros Todos / Sin novedad / Con novedad, navegador de fecha y apertura y cierre de jornada",
      "Plantilla mensual de 30 días por oficial con celdas de estado (24h, L de libre, A de ausencia, V de vacaciones) y columna de nombre fija al hacer scroll horizontal",
      "Módulo de novedades y eventos con nueve tipos (ingreso, egreso, reasignación, vacación, ausencia, reposo médico, cobertura, incidencia y asignación de supervisor)",
      "Flujo de incidencias con vistas separadas para coordinador, analista y centro de coordinación, modales de decisión y de detalle, y filtros por cliente, motivo y estado",
      "Justificativos, reasignaciones y validación cruzada de inconsistencias para el analista de operaciones",
      "Asignación de supervisores a sedes con selección múltiple, buscador de sede y aplicación inmediata o programada a una fecha",
      "CRUD de personal con búsqueda con debounce, filtros por estatus, cliente y sede, cambio de estatus mediante modal y paginación servidor",
      "Catálogos en pestañas: tipos de novedad e incidencia, estatus de oficiales, tipos de servicio y regiones",
      "Parte numérica, resumen por región y reporte por cliente, todos exportables a CSV con BOM UTF-8 para que Excel respete los acentos",
      "Tablero de alertas con severidad alta, media y baja, marcado individual y marcar todo como leído",
      "Centro de notificaciones con feed, cajón lateral y contador de no leídas",
      "Tema claro, oscuro o del sistema y conmutador de idioma es/en desde la barra superior",
      "Layout responsive: barra lateral fija en escritorio, cajón deslizante y navegación inferior por rol en móvil"
    ],
    "stack": [
      {
        "group": "Interfaz",
        "items": [
          "React 18.3",
          "TypeScript 5.5 (strict)",
          "Tailwind CSS 3.4",
          "clsx",
          "tailwind-merge",
          "class-variance-authority",
          "lucide-react"
        ]
      },
      {
        "group": "Estado y datos",
        "items": [
          "Redux Toolkit 2",
          "react-redux 9",
          "redux-persist 6",
          "Axios 1.13 con interceptores"
        ]
      },
      {
        "group": "Rutas y formularios",
        "items": [
          "React Router 7 con lazy loading",
          "React Hook Form 7",
          "Zod 3",
          "@hookform/resolvers"
        ]
      },
      {
        "group": "Herramientas",
        "items": [
          "Vite 7",
          "@vitejs/plugin-react-swc",
          "PostCSS",
          "Autoprefixer",
          "ESLint 10",
          "typescript-eslint",
          "Prettier"
        ]
      },
      {
        "group": "Retroalimentación al usuario",
        "items": [
          "Sonner (toasts)",
          "Modales de confirmación e información propios sobre Redux"
        ]
      }
    ],
    "architecture": "Arquitectura feature-first sobre Vite + SWC. En src/app viven el bootstrap (App, routes y providers); en src/shared, todo lo transversal: la capa api (cliente Axios con interceptores de request y response, handlers y el tipo ApiResult<T> que devuelve {ok:true,data} o {ok:false,status,detail,fieldErrors}), los componentes reutilizables agrupados en ui, data, form, feedback, pagination y layout, los hooks (usePagination, useApi, useDebounce, useT, useAuth, useTheme, useMediaQuery), el store de Redux Toolkit con seis slices (auth, theme, lang, ui, notifications e incidencias), la i18n con dos ficheros de locales y las utilidades (notify, exportCsv, applyServerErrors, cn). En src/features hay quince módulos autónomos —auth, dashboard, personal, attendance, events, incidencias, justifications, reports, assignments, catalogs, users, admin, operator, notifications y profile— cada uno con sus carpetas pages, components, api, schemas, types, hooks y store según necesite. Las veinticinco rutas se declaran en un único routes.tsx con carga diferida por página y se envuelven en guards RequireAuth y RequireRole. El cliente HTTP compone la baseURL con las variables VITE_PUBLIC_URL_API y VITE_PUBLIC_URL_VERSION, añade el token del store y la cabecera Accept-Language según el idioma activo, fuerza logout ante un 401 fuera del login y levanta un modal de error ante cualquier 5xx. Once módulos de API cubren cuarenta y dos operaciones tipadas sobre once recursos REST (auth, users, clients, sites, regions, officers, positions, incident-types, officer-statuses, service-types y events); los módulos aún no migrados leen del mock DB de src/shared/mock/db.ts, poblado con la exportación real del Excel operativo, de modo que el cambio de mock a red no toca los componentes.",
    "challenges": [
      {
        "problem": "El mismo dominio tenía que comportarse como cinco productos distintos sin duplicar el layout ni dejar rutas abiertas por descuido.",
        "solution": "Un único AppLayout con Sidebar y Topbar, y un mapa navByRole que define la navegación de cada rol. Las rutas se envuelven en RequireRole con la lista explícita de roles permitidos, y páginas como Incidencias delegan en un componente distinto según el rol leído del store, de modo que una sola ruta sirve tres experiencias."
      },
      {
        "problem": "Diseñar contra datos ficticios habría producido pantallas que se rompen con la operación real: nombres largos, decenas de sedes, meses completos de parte numérico.",
        "solution": "Se exportó el Excel operativo a un mock tipado con ochenta y siete oficiales, setenta y un ausencias, cincuenta vacaciones, veintiocho ingresos, veintitrés egresos, veintidós reasignaciones y veinte categorías de parte numérico. Cada tabla, mapa de calor y modal se ajustó contra ese volumen antes de existir el backend."
      },
      {
        "problem": "Había que empezar a consumir la API real sin bloquear el desarrollo de los módulos que todavía no tenían endpoint.",
        "solution": "Todos los servicios devuelven el mismo contrato ApiResult<T> y las páginas consumen datos a través de hooks (useApi, usePagination), no de Axios directamente. Eso permitió migrar auth, usuarios, clientes, sucursales, oficiales, catálogos y eventos uno a uno mientras asistencia, plantilla, reportes y alertas seguían leyendo del mock, sin reescribir componentes."
      },
      {
        "problem": "Una cuadrícula de treinta días por oficial o por categoría se vuelve ilegible en cuanto se hace scroll horizontal: se pierde de vista a quién pertenece la fila.",
        "solution": "Las tablas de plantilla y parte numérica fijan la primera columna con position sticky y fondo propio en claro y oscuro, usan celdas de ancho fijo y color por estado, y añaden una leyenda de rangos para que el color se pueda interpretar sin leer los números."
      },
      {
        "problem": "Exportar a CSV en un entorno donde todo se abre con Excel en español rompía los acentos de nombres y motivos.",
        "solution": "El utilitario exportCsv escribe un BOM UTF-8 al inicio del blob, escapa comillas dobles y usa saltos CRLF, de forma que Excel interpreta correctamente ñ, tildes y comas dentro de los campos."
      }
    ],
    "metrics": [
      {
        "value": "25",
        "label": "rutas registradas"
      },
      {
        "value": "15",
        "label": "módulos feature-first"
      },
      {
        "value": "24",
        "label": "páginas con carga diferida"
      },
      {
        "value": "5",
        "label": "roles con navegación propia"
      },
      {
        "value": "6",
        "label": "dashboards por rol"
      },
      {
        "value": "42",
        "label": "funciones de API tipadas"
      },
      {
        "value": "11",
        "label": "recursos REST consumidos"
      },
      {
        "value": "2",
        "label": "idiomas (es / en)"
      },
      {
        "value": "191",
        "label": "claves de traducción"
      },
      {
        "value": "9",
        "label": "tipos de evento operativo"
      }
    ],
    "brand": {
      "primary": "#2563eb",
      "secondary": "#0f172a",
      "accent": "#16a34a",
      "bg": "#eef2f7",
      "surface": "#ffffff",
      "text": "#0f172a",
      "gradient": "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #2563eb 100%)",
      "mood": "Sobrio, institucional y operativo — azul corporativo sobre gris azulado frío, con una barra lateral casi negra (#0f172a) como ancla visual. El color nunca decora: solo informa. La escala semántica completa es ok #16a34a sobre #dcfce7, warn #d97706 sobre #fef3c7, crit #dc2626 sobre #fee2e2 e info #0891b2 sobre #cffafe. Bordes #e2e8f0, texto secundario #64748b, terciario #94a3b8, radio de 10px y sombras muy suaves.",
      "source": "/Users/macbook/sereno_block/tailwind.config.js (tokens primary, ok, warn, crit, info y sidebar) junto con el bloque :root de /Users/macbook/sereno_block/prototipo-fase1.html, que define --bg #eef2f7, --border #e2e8f0, --text-2 #64748b y el radio --r 10px"
    },
    "links": {},
    "uiScreens": [
      {
        "name": "Login",
        "describe": "Pantalla a página completa sobre fondo slate-900 (#0f172a), todo centrado vertical y horizontalmente. Arriba, el wordmark «Vigtrack» en blanco, 4xl, extrabold, tracking ajustado, y debajo en slate-400 el subtítulo «Sistema de Gestión de Seguridad». Bajo él, una tarjeta de 384 px de ancho máximo en slate-800 con esquinas de 16 px y sombra amplia, con 32 px de padding. Dentro, dos campos apilados con 20 px de separación: etiqueta en slate-300 de 14 px, input de fondo slate-700, borde slate-600, radio 8 px, texto blanco y placeholder «usuario@vigtrack.app»; el segundo campo es la contraseña, con un icono de ojo/ojo tachado en slate-400 pegado al borde derecho que alterna la visibilidad. Si el servidor rechaza las credenciales aparece encima del botón una franja roja translúcida (fondo rojo al 10 %, borde rojo al 30 %) con un icono de alerta circular y el mensaje. El botón de envío ocupa todo el ancho, azul #2563eb, texto blanco semibold, radio 12 px; mientras envía muestra un spinner girando y el texto «Iniciando sesión…». Sin ilustraciones ni fondo decorativo: puro contraste oscuro y un único acento azul."
      },
      {
        "name": "Asistencia diaria del supervisor",
        "describe": "Vista sobre fondo claro con la barra lateral #0f172a de 240 px a la izquierda (wordmark «Vigtrack» arriba, rol debajo en gris, ítems de menú con icono y el activo resaltado con fondo azul translúcido y una línea blanca de 2 px en el borde izquierdo; abajo, avatar circular azul con la inicial, nombre y correo). En el contenido: título «Asistencia diaria» en 20 px bold y subtítulo gris «Región Miranda · presente-por-defecto: todos laboran salvo novedad». Debajo, una fila de controles: un grupo segmentado de tres botones (Todos / Sin novedad / Con novedad) donde el activo va en azul sólido con texto blanco; un navegador de fecha con flechas ‹ › y un input date; y, alineada a la derecha, la pastilla de estado de jornada —ámbar «Sin abrir», verde «Jornada abierta» o gris «Jornada cerrada»— junto al botón de acción correspondiente (azul «Abrir jornada» con icono de play, verde «Cerrar reporte» con icono de check, o botón contorneado «Reabrir» con icono de flecha circular). Si la jornada no está abierta, una franja gris clara con icono de candado avisa «Jornada no iniciada — abre la jornada para registrar el estado del día». El roster es una tarjeta blanca de esquinas 12 px con cabecera «34 oficiales · miércoles, 1 de abril» y, a la derecha, «31 presentes» en verde y «3 con novedad» en ámbar. Cada fila lleva avatar circular azul con la inicial, nombre en negrita, cédula en fuente monoespaciada gris, y a la derecha una pastilla redondeada: verde «Presente» o ámbar con el motivo, por ejemplo «Cita médica · cubierta»."
      },
      {
        "name": "Parte numérica (mapa de calor)",
        "describe": "Cabecera con el título «Parte Numérica» y el subtítulo «20 categorías · 30 días»; a la derecha, flechas ‹ › alrededor del nombre del mes («Abril») en un ancho fijo centrado. Justo debajo, la leyenda: cuatro cuadraditos de 12 px con su etiqueta —gris «0», azul claro «1–5», amarillo «6–15», rojo «16+»—. El cuerpo es una tarjeta blanca con scroll horizontal que contiene una tabla de 12 px: cabecera con fondo gris muy claro, primera columna «Categoría» fija con position sticky y ancho mínimo de 180 px, y treinta columnas numeradas del 1 al 30. Cada celda de dato es un rectángulo de 28×24 px con radio 4 px, número en monoespaciada semibold centrado, coloreado según el rango; las celdas con valor cero quedan grises y vacías. Las filas se resaltan levemente al pasar el ratón. En modo oscuro la tarjeta pasa a slate-800 y los colores se sustituyen por sus versiones translúcidas al 40 %."
      },
      {
        "name": "Incidencias — decisión del coordinador",
        "describe": "Título «Decisión de incidencias» seguido en la misma línea por una pastilla ámbar redondeada con el contador «7 por decidir», y bajo él una línea gris explicando el ámbito: «Región Miranda · decisión final tras el análisis. El Analista analiza primero; aquí apruebas (escala a RRHH) o rechazas (muere en auditoría)». Debajo, una barra de filtros envolvente: buscador con lupa a la izquierda del input («Buscar oficial / motivo…»), y tres selects —todos los clientes, todos los motivos, todos los estados— con radio 8 px y anillo azul al enfocar; cuando hay algún filtro activo aparece un botón para limpiarlos. La tabla ordena primero las incidencias en estado «analizada», y cada fila muestra el nombre del oficial, la sede, el cliente deducido del nombre del centro, el motivo, la fecha y una pastilla de estado con su propio color: gris «Pendiente análisis», ámbar «Analizada — por decidir», verde esmeralda «Aprobada · escalada a RRHH», rojo «Rechazada · auditoría». A la derecha de cada fila, un icono de ojo abre el modal de detalle y un botón abre el modal de decisión. La paginación de diez en diez cierra la tarjeta."
      },
      {
        "name": "Detalle de novedad con línea de aprobación",
        "describe": "Modal centrado sobre un velo negro al 40 % con desenfoque de fondo. La tarjeta es blanca (slate-900 en oscuro), radio 16 px, sombra fuerte, ancho máximo medio y altura limitada al 90 % de la ventana con scroll interno. Cabecera con icono, título de la novedad y una X a la derecha. El cuerpo muestra los datos del evento —oficial, cédula, sede, región, tipo de novedad, tipo de incidencia y fecha— en pares etiqueta gris de 12 px sobre valor, y a continuación el bloque más característico: una línea vertical de pasos donde cada nodo es un rol («Supervisor Regional — Registró la novedad», «Analista de Operaciones — Analizó el justificativo», «Coordinador — Decisión final»), con círculo relleno y check verde para los pasos completados, círculo hueco gris para los pendientes y círculo rojo con aspa cuando la incidencia fue rechazada, mostrando la fecha a la derecha de cada paso. Al pie, los botones de aprobar (verde) y rechazar (rojo contorneado) junto a un campo de observación obligatorio."
      },
      {
        "name": "Plantilla mensual",
        "describe": "Cuadrícula de 30 días por oficial dentro de una tarjeta con scroll horizontal. La primera columna, fija, muestra el nombre del oficial truncado a 170 px en semibold y debajo su grupo en monoespaciada gris; las cabeceras de día son números del 1 al 30 en gris claro, centrados, de 28 px de ancho mínimo. Cada celda es un cuadro de 28×24 px con radio 4 px y una letra en semibold: verde «24h» para día laborado, azul «L» de libre, rojo «A» de ausencia y gris «V» de vacaciones. El patrón alterna según el grupo del oficial, lo que produce el damero azul y verde característico de un rol de guardias de 24 horas. Al pasar el ratón la fila se tiñe de gris muy claro. La página añade encima el navegador de mes y un botón de exportación a CSV."
      }
    ],
    "visualConcept": "Semilla: un reloj de fichaje con marcas de entrada y salida sobre una línea de tiempo. La landing de Vigtrack convierte esa idea en su columna vertebral: toda la página es una única jornada de 24 horas que el visitante recorre al hacer scroll.\n\nFondo y atmósfera. El sitio arranca en modo turno de noche: fondo #0f172a con un degradado radial azul (#2563eb al 12 %) detrás del héroe y una retícula muy tenue de líneas verticales cada 60 px, como el papel milimetrado de un reloj checador. A medida que el usuario baja, el fondo se aclara progresivamente hacia #eef2f7 usando una variable CSS interpolada con scroll-timeline (con fallback a un listener de scroll): la página literalmente amanece. Las tarjetas siempre son blancas o slate-800 según la fase, con radio 10 px y las sombras suaves del sistema real.\n\nHéroe. A la izquierda, el wordmark «Vigtrack» en extrabold seguido del claim y un párrafo corto. A la derecha, la pieza protagonista: un riel de fichaje vertical de 24 horas. Es una línea de 2 px en #334155 con marcas de hora, y sobre ella se van clavando pastillas de marcaje que entran una a una, escalonadas cada 220 ms, con una animación de «sello»: aparecen a scale(0.6) y opacidad 0, rebotan a scale(1.06) y asientan en scale(1) con cubic-bezier(.34,1.56,.64,1), mientras un anillo del color de la marca se expande desde el punto y se desvanece (box-shadow de 0 a 14 px). Cada pastilla lleva hora en monoespaciada, nombre de oficial y una etiqueta: verde #16a34a «entrada», azul #2563eb «relevo», ámbar #d97706 «novedad», rojo #dc2626 «puesto sin cubrir». El punto de la línea late suavemente (pulse de 2 s) solo en las marcas rojas. Bajo el riel, un contador de jornada en monoespaciada tipo 06:00 → 18:00 que avanza al hacer scroll.\n\nSección de roles. Cinco columnas que nacen del mismo riel: la línea del héroe se bifurca en cinco carriles horizontales, uno por rol (Administrador, Supervisor regional, Analista, Coordinador, Centro de coordinación). Cada carril es una tarjeta oscura con el icono lucide del menú real, la lista de sus rutas y un mini-riel propio con dos o tres marcas. Al pasar el ratón sobre un carril, los otros cuatro bajan a opacidad 0.35 y el activo desplaza su marca 6 px a la derecha con transición de 200 ms.\n\nSección del flujo de una incidencia. Aquí la línea de tiempo se pone en horizontal y se convierte en tres estaciones —Supervisor registra → Analista revisa → Coordinador decide— unidas por un trazo que se dibuja con stroke-dashoffset animado al entrar en viewport. La estación final se abre en dos ramas: una verde hacia «Escala a RRHH» y otra roja hacia «Queda en auditoría»; ambas se dibujan a la vez y la rama no elegida se atenúa. Bajo cada estación, la pastilla de estado exacta de la app («Pendiente análisis», «Analizada — por decidir», «Aprobada · escalada a RRHH», «Rechazada · auditoría»).\n\nSección de datos. Ya con el fondo claro, dos piezas lado a lado: el mapa de calor del parte numérico —una cuadrícula real de 20×30 celdas de 28×24 px cuyos cuadros se colorean en cascada diagonal al entrar en viewport, 8 ms de retardo por celda— y, a su derecha, la plantilla mensual con su damero de letras 24h/L/A/V. La leyenda de rangos se anima como último elemento.\n\nMétricas. Una banda de cifras (25 rutas, 15 módulos, 5 roles, 42 funciones de API, 2 idiomas) presentada como marcas de fichaje: cada número se muestra en monoespaciada y cuenta desde cero en 900 ms mientras un pequeño trazo vertical se clava debajo, igual que en el riel del héroe.\n\nDetalles transversales. Tipografía de sistema (la misma pila Segoe UI / system-ui del proyecto) para que la landing hable el idioma visual de la app. Todo movimiento se anula bajo prefers-reduced-motion: las marcas aparecen ya asentadas y el fondo se fija en el estado claro. El resultado se distingue de las otras landings por su verticalidad cronológica: no hay grid de tarjetas flotando, hay una jornada que empieza de noche, se puebla de marcas y termina de día.",
    "statusShort": "En desarrollo",
    "categoryShort": "Software empresarial",
    "media": [
      {
        "src": "/proyectos/vigtrack/favicon.svg",
        "kind": "favicon",
        "caption": "Favicon SVG que index.html sirve actualmente: un rayo morado (#863bff) con degradados difuminados heredado de la plantilla de arranque. No es una marca propia de Vigtrack — el proyecto todavía no tiene logotipo definitivo."
      }
    ]
  },
  {
    "slug": "servicepay-pos",
    "name": "ServicePay POS",
    "tagline": "Terminal de pago de servicios para dispositivos Sunmi: cobra, factura e imprime el recibo en el acto.",
    "category": "App móvil fintech / punto de venta",
    "year": "2025",
    "role": "Desarrollo móvil Flutter e integración nativa Android (impresora térmica Sunmi)",
    "status": "Entregado al cliente — versión 1.0.7 (build 63), con builds separados para demo, QA y producción",
    "summary": [
      "ServicePay POS (paquete `com.paguetodo.servicepay.pos`, etiqueta en Android \"PAGO DE SERVICIOS\") es la aplicación que un comercio aliado instala en su terminal Sunmi para vender pagos de servicios: recargas de telefonía prepago y cobro de facturas pospago.",
      "El comercio compra inventario dentro de la app (pago móvil, C2P, tarjeta de débito o transferencia), y ese saldo se va consumiendo con cada operación; la pantalla de inventario y el reporte de movimientos paginado permiten cuadrar la caja sin salir del terminal.",
      "Cada operación termina en un recibo: la app dibuja el voucher en pantalla y un canal nativo (`MethodChannel`) lo entrega línea por línea a la impresora térmica del dispositivo Sunmi, con el logo del operador como bitmap.",
      "Es una app multimarca: `themes.json` define dos identidades (pt-theme y sunmi-theme) con paleta, logos, términos y filtro por RIF, y hay seis puntos de entrada (`lib/mains/pt/*` y `lib/mains/sunmi/*`) que combinan marca y ambiente."
    ],
    "problem": "Los comercios aliados que venden pagos de servicios en Venezuela trabajaban con procesos dispersos: consultar la deuda de CANTV o CORPOELEC, cobrar en efectivo o pago móvil, anotar la operación y entregar un comprobante escrito a mano. No había forma de saber cuánto inventario quedaba, ni de emitir un recibo con número de aprobación, ni de operar el mismo software bajo dos marcas distintas sin mantener dos aplicaciones separadas.",
    "solution": "Una aplicación Flutter para terminales Android/Sunmi que concentra todo el ciclo: autenticación por RIF/cédula o correo con verificación del dispositivo por código OTP y desbloqueo biométrico opcional; catálogo de servicios que llega del backend; formularios de consulta y pago por operador; compra de inventario con cuatro medios de pago; reporte de movimientos filtrable por fechas; y un recibo que se imprime en la térmica del equipo. La marca y la paleta se resuelven en tiempo de arranque desde un archivo de temas, de modo que el mismo código compila como PagueTodo o como marca Sunmi.",
    "highlights": [
      {
        "title": "Impresión térmica nativa línea por línea",
        "description": "Un MethodChannel (`samples.flutter.dev/print`) envía quince campos del voucher a `MainActivity.java`, que usa `com.sunmi:printerlibrary` para imprimir el bitmap del operador, la cabecera, el cuerpo campo a campo y el pie, con alineaciones y avance de papel.",
        "icon": "Printer"
      },
      {
        "title": "Multimarca desde un archivo de temas",
        "description": "`themes.json` declara pt-theme (azul #0C7CEC / amarillo #ECCC04) y sunmi-theme (naranja #FF6000 / #FCA069) con sus logos, políticas y filtro por documento de identidad; `ThemeProvider` construye el `ThemeData` completo a partir del proveedor de color activo.",
        "icon": "Palette"
      },
      {
        "title": "Sesión endurecida en el terminal",
        "description": "Contraseñas y datos de pago se cifran con RSA PKCS#1 (pointycastle + basic_utils) usando llaves públicas por ambiente; el dispositivo se autoriza con un código de seis dígitos, se identifica con un fingerprint UUID persistido, y un interceptor HTTP inyecta el bearer token y el contexto de negocio en cada petición.",
        "icon": "ShieldCheck"
      },
      {
        "title": "Inventario y cuadre de caja en el propio equipo",
        "description": "La pantalla de inventario muestra saldo disponible, inventario en consignación y límite mínimo de unidades; el detalle lista cada movimiento con entrada/salida y saldo posterior, filtrado por período y paginado.",
        "icon": "Boxes"
      },
      {
        "title": "Compra de inventario con cuatro canales de cobro",
        "description": "Pago móvil, C2P Bancaribe, Credicard Pagos débito y transferencia inmediata, con validación de tarjeta, token bancario, clave de operaciones especiales y catálogo de 27 bancos venezolanos codificados en la app.",
        "icon": "CreditCard"
      }
    ],
    "features": [
      "Inicio de sesión con RIF/cédula o correo electrónico, alternable con un toggle animado",
      "Autorización del dispositivo por código OTP de 6 campos enviado al correo del usuario",
      "Desbloqueo biométrico opcional (local_auth) cuando el usuario eligió mantener la sesión",
      "Auto-registro del aliado con preguntas de seguridad, recuperación de contraseña y flujo de contraseña expirada",
      "Catálogo de servicios disponibles en cuadrícula, con logos servidos desde el CDN estático del backend",
      "Pago pospago con consulta previa de deuda: CANTV, CORPOELEC (contratos múltiples con selección por radio), MOVISTAR, SIMPLETV, INTER",
      "Recarga prepago de MOVISTAR, MOVILNET y DIGITEL con validación del prefijo por operadora y confirmación del número",
      "Aviso explícito cuando el servicio no es anulable antes de cobrar",
      "Recibo de compra en pantalla con número, fecha, operador, empresa, servicio, cuenta, monto, número de aprobación y estatus",
      "Impresión del recibo en la impresora térmica del terminal Sunmi",
      "Compra de inventario por pago móvil, C2P, tarjeta de débito o transferencia",
      "Reporte de movimientos de inventario con filtro por período y paginador numérico",
      "Sección de ayuda con 11 preguntas frecuentes buscables y 4 tutoriales en video",
      "Detección de conectividad y aviso de nueva versión disponible (new_version_plus)",
      "Cierre de sesión con renovación de token y reinicio limpio de la app"
    ],
    "stack": [
      {
        "group": "App",
        "items": [
          "Flutter",
          "Dart SDK >=2.19.6 <3.0.0",
          "Material 3 (ThemeData propio)"
        ]
      },
      {
        "group": "Arquitectura y estado",
        "items": [
          "flutter_bloc",
          "rxdart",
          "provider",
          "equatable",
          "get_it",
          "injectable",
          "freezed",
          "json_serializable",
          "build_runner"
        ]
      },
      {
        "group": "Navegación",
        "items": [
          "go_router (ShellRoute con barra inferior)"
        ]
      },
      {
        "group": "Red y sesión",
        "items": [
          "http_interceptor",
          "connectivity_plus",
          "shared_preferences",
          "ffcache",
          "flutter_dotenv",
          "optional"
        ]
      },
      {
        "group": "Seguridad",
        "items": [
          "pointycastle",
          "basic_utils",
          "encrypt",
          "local_auth",
          "device_info_plus",
          "unique_identifier",
          "uuid"
        ]
      },
      {
        "group": "UI y formularios",
        "items": [
          "google_fonts",
          "lottie",
          "flutter_svg",
          "cached_network_image",
          "flutter_otp_text_field",
          "animated_toggle_switch",
          "drop_down_list",
          "number_paginator",
          "flutter_multi_formatter",
          "mask_text_input_formatter",
          "flutter_masked_text2",
          "currency_text_input_formatter",
          "intl",
          "flutter_localization"
        ]
      },
      {
        "group": "Nativo Android",
        "items": [
          "Java",
          "MethodChannel",
          "com.sunmi:printerlibrary 1.0.18",
          "ZXing core 3.3.0",
          "androidx.appcompat",
          "Material Components",
          "ConstraintLayout"
        ]
      },
      {
        "group": "Utilidades",
        "items": [
          "package_info_plus",
          "new_version_plus",
          "url_launcher",
          "timezone",
          "flutter_launcher_icons",
          "logger",
          "flutter_lints"
        ]
      }
    ],
    "architecture": "Monorepo Flutter de una sola app con seis puntos de entrada: `lib/mains/pt/{main_dev,main_demo,main_prod}.dart` y `lib/mains/sunmi/{...}`, que llaman a `mainCommon(env, theme)` con el ambiente (`env.demo`, `env.qa`, `env.prod` cargados como assets con flutter_dotenv) y el nombre del tema. `configureInjection` arma el grafo de dependencias con get_it + injectable (31 registros en `injection.config.dart`) y `ThemeProvider` lee `themes.json` para elegir marca, colores y assets antes de `runApp`. La UI vive en `lib/pages` con 12 módulos, cada uno con su BLoC, eventos, estados y servicio; go_router define las rutas planas de autenticación y un `ShellRoute` con las tres pestañas persistentes (Inicio, Inventario, Ayuda). La capa de datos es `ApiServices` sobre `http` con dos interceptores: `AuthInterceptor` (inyecta bearer token y realm/business_id/user_id en cada request) y `LoggingInterceptor`; los modelos se generan con json_serializable y freezed. La impresión es el único puente nativo: `Voucher` declara el `MethodChannel` y `MainActivity.java` traduce esos campos a llamadas de `SunmiPrintHelper`.",
    "challenges": [
      {
        "problem": "El recibo no es un PDF ni una imagen: la impresora térmica del Sunmi recibe instrucciones secuenciales (alinear, imprimir texto, imprimir bitmap, avanzar papel) y no existe un plugin de Flutter que cubra el SDK del fabricante.",
        "solution": "Se definió un contrato de quince campos que Flutter envía por MethodChannel y se escribió la capa Java que los reproduce en orden: bitmap del operador según la empresa, cabecera centrada, cuerpo etiqueta por etiqueta en negrita y valor normal, pie y avance de papel; los logos de CANTV, MOVISTAR, DIGITEL, SIMPLETV y MOVILNET viven como drawables nativos para poder imprimirse como bitmap."
      },
      {
        "problem": "La misma app debía distribuirse bajo dos marcas distintas, con colores, logo, ícono y documentos legales propios, sin duplicar el proyecto.",
        "solution": "La marca se externalizó a `themes.json` (paleta, URI de assets, políticas, términos y filtro por RIF) y toda la UI consume colores a través de `ColorProvider`; el ícono de lanzamiento se genera con flutter_launcher_icons apuntando al asset de la marca y cada marca tiene su propio `main_*.dart`, de modo que cambiar de identidad es cambiar de entry point."
      },
      {
        "problem": "Los terminales POS tienen pantallas muy variadas: algunos equipos Sunmi son alargados y otros apenas superan los 400 puntos de alto, lo que rompía los formularios de pago.",
        "solution": "Las pantallas críticas (login, prepago, detalles) ramifican su layout según `MediaQuery.of(context).size.height > 432`: en equipos bajos se colapsan los filtros a una sola fila, se reduce el logo con un `AnimatedSwitcher` y se sustituyen columnas expandidas por listas desplazables."
      },
      {
        "problem": "Se manejan contraseñas, PIN, claves de operaciones especiales y números de tarjeta sobre redes de comercios que no controlamos.",
        "solution": "Los datos sensibles se cifran en el cliente con RSA PKCS#1 usando llaves públicas distintas por ambiente (`PASSWORD_PUBLIC_KEY` y `PAYMENT_PUBLIC_KEY` en los archivos env), el dispositivo se registra con un fingerprint UUID persistido y debe autorizarse con un código enviado al correo, y el token se renueva o la sesión se destruye desde `SessionTimer`."
      }
    ],
    "metrics": [
      {
        "value": "19",
        "label": "pantallas"
      },
      {
        "value": "12",
        "label": "módulos con BLoC propio"
      },
      {
        "value": "32",
        "label": "endpoints REST consumidos"
      },
      {
        "value": "2",
        "label": "marcas desde un mismo código"
      },
      {
        "value": "6",
        "label": "puntos de entrada (marca × ambiente)"
      },
      {
        "value": "4",
        "label": "métodos de compra de inventario"
      },
      {
        "value": "27",
        "label": "bancos codificados"
      },
      {
        "value": "~22 300",
        "label": "líneas Dart escritas a mano"
      }
    ],
    "brand": {
      "primary": "#0C7CEC",
      "secondary": "#FF6000",
      "accent": "#ECCC04",
      "bg": "#F2F3F5",
      "surface": "#FFFFFF",
      "text": "#353535",
      "gradient": "linear-gradient(135deg, #0C7CEC 0%, #1F8BF0 52%, #ECCC04 100%)",
      "mood": "Utilitario y contrastado, como una terminal de caja: azul corporativo de barra superior, amarillo de acento para el saldo y los llamados a la acción, fondo gris papel y tarjetas blancas con sombra corta. Tipografía de etiqueta compacta, mayúsculas para los títulos de sección.",
      "source": "/Users/macbook/.portafolio-research/clones/servicepay-pos/themes.json (colors.primary 0xFF0c7cec y primary_light 0xFFeccc04 del pt-theme; 0xFFFF6000 del sunmi-theme) + /Users/macbook/.portafolio-research/clones/servicepay-pos/lib/styles/bg.dart (ColorUtil.grayLight 242,243,245) + /Users/macbook/.portafolio-research/clones/servicepay-pos/lib/styles/text.dart (dfltTextColor 53,53,53)"
    },
    "links": {
      "github": "https://github.com/ArturoSojo/servicepay-pos",
      "web": "https://www.youtube.com/shorts/sAOwu_-WLBc",
      "demo": "https://www.youtube.com/shorts/sAOwu_-WLBc"
    },
    "uiScreens": [
      {
        "name": "Inicio de sesión",
        "describe": "Pantalla centrada sobre fondo blanco, todo dentro de un scroll vertical con 20 px de margen lateral. Arriba, el logotipo de la marca a 280×120 px (se reduce con un AnimatedSwitcher si la pantalla mide menos de 432 px de alto). Debajo, el texto \"Pago de servicios\" en 20 px, peso 300, y a continuación el número de versión en azul #0C7CEC negrita junto a un ícono de refrescar que consulta si hay actualización. Sigue una fila con un toggle dual animado de 60×35 px (indicador azul cuando está activo, gris cuando no) y la etiqueta que alterna entre \"Iniciar con RIF/Cédula\" e \"Iniciar sesión con correo\". Luego dos campos con borde outline: \"RIF/CI\" (o \"Correo electrónico\") y \"Contraseña\" con ojo de mostrar/ocultar. El botón \"INICIAR SESIÓN\" ocupa casi todo el ancho, fondo azul #0C7CEC, esquinas de 10 px, texto blanco 15 px; a su derecha aparece un cuadrado azul con ícono de huella cuando el equipo soporta biometría y el usuario eligió mantener la sesión. Al pie, enlaces a política de seguridad y términos y condiciones. Al intentar salir se muestra un diálogo blanco de esquinas redondeadas: \"¿Seguro que deseas salir de la aplicación?\" con acciones SÍ / NO."
      },
      {
        "name": "Servicios disponibles",
        "describe": "AppBar azul #0C7CEC sin elevación, título centrado \"SERVICIOS DISPONIBLES\" en blanco 20 px, y a la derecha un ícono grande de salida (36 px). Bajo la barra, una tarjeta gris #F2F3F5 de baja elevación con los datos del comercio a la izquierda —razón social en negrita 16 px, correo 14 px, RIF en gris oscuro— y el logo de la marca a la derecha en 120×120 px. Después, una fila con el rótulo \"SERVICIOS DISPONIBLES\" en 16 px normal y un ícono de refrescar. El cuerpo es una cuadrícula (máximo 325 px por celda, relación 12/11, separación de 10 px) de tarjetas blancas con elevación 3: cada una muestra el logo del operador a 100×60 px descargado del CDN y, debajo, el nombre en gris oscuro 14 px negrita, con guiones bajos sustituidos por espacios y PREPAY/POSPAY traducidos a PREPAGO/POSPAGO. Si no hay productos aparece una animación Lottie de advertencia y el texto \"NO HAY SERVICIOS DISPONIBLE\". Barra de navegación inferior azul de 50 px con tres destinos —Inicio (ícono de caja registradora), Inventario (tienda), Ayuda (interrogación)— e indicador amarillo redondeado sobre el ítem activo."
      },
      {
        "name": "Cobro pospago",
        "describe": "AppBar azul con el nombre del operador centrado. En la cabecera, el logo del servicio a 180×80 px y, si el producto no es anulable, un aviso en rojo #E4342E: \"El servicio no es anulable, por favor verifique el número de cuenta a pagar ya que el pago no puede ser reversado\", seguido de un Divider. El formulario combina un desplegable estrecho de tipo de documento (V/E/J/G) con el campo \"RIF/CI\" de 9 dígitos y, debajo, el campo de cuenta cuya etiqueta cambia por empresa: \"Número de contrato\" (CANTV), \"Número de cuenta contrato\" (MOVISTAR), \"Número de tarjeta de acceso\" (SIMPLETV) o \"Número de cuenta\"; ambos llevan borde outline y una lupa que dispara la consulta y se convierte en spinner mientras carga. Al consultar aparece el resultado: para CANTV/CORPOELEC, una lista de ListTile con radio button a la izquierda y el monto en negrita —\"Deuda vencida: 1.234,56 Bs\", \"Deuda actual: 987,00 Bs\", o un contrato por línea con su código y \"Bs. 450,00\"—. Al pie, dos botones anchos de 20 px de padding: \"LIMPIAR\" en gris con ícono de papelera y \"PAGAR\" en azul #0C7CEC con ícono de tarjeta, que muestra un indicador circular blanco mientras procesa."
      },
      {
        "name": "Recibo de compra",
        "describe": "Al confirmarse el pago, el título de la barra cambia a \"RECIBO DE COMPRA\" y el cuerpo se sustituye por una tarjeta blanca con 20 px de margen que imita un ticket. Arriba, centrado, el logo del operador a 150×80 px; debajo, en negrita 16 px: \"SERVICIOS PAGUETODO, C.A\" y \"RIF: J-40339964-6\". Sigue el rótulo centrado \"RECIBO DE COMPRA\" en 14 px negrita. El cuerpo es una columna alineada a la izquierda con pares etiqueta-valor en texto enriquecido (etiqueta en negrita, valor normal): \"Nro:\", \"Fecha:\", \"Operador:\" (correo de quien cobró), \"Empresa:\", \"Servicio:\", un bloque separado con \"Cuenta:\" —o \"Número de tarjeta de acceso:\" en SimpleTV, más \"Fecha de desconexión:\"—, \"Monto: 1.234,56 bs\" y \"Nro. aprobación:\", y por último \"Total a pagar:\" y \"Estatus:\". En recargas MOVISTAR se añade un pie centrado en 12 px: \"Tu número ha sido recargado\", \"Consulta el saldo marcando *88 o *144#\" y un enlace a www.movistar.com.ve. Debajo de la tarjeta, un botón gris ancho \"CERRAR\" en blanco. Esa misma información sale por la impresora térmica del terminal."
      },
      {
        "name": "Inventario",
        "describe": "AppBar azul con título \"INVENTARIO\" y el botón de salida. Arriba a la derecha, un enlace \"Actualizar\" en azul negrita 16 px con ícono de refrescar. El centro es una columna con espaciado amplio: \"INVENTARIO DISPONIBLE\" en negro 20 px negrita, debajo \"(Prepago)\" en gris 12 px, y el saldo en azul #0C7CEC a 30 px, por ejemplo \"1.250 unid.\"; luego un botón de texto \"Ver detalles\" con flecha. Si existe inventario en consignación se repite el bloque como \"INVENTARIO EN CONSIGNACIÓN / (Pospago)\" con \"Cantidad límite unidades\" y \"Cantidad de unidades disponibles\" en 25 px. Al pie, un botón ancho azul \"COMPRA\" con ícono de pago (y, cuando está habilitado, uno amarillo \"RETIRO\" con ícono de teléfono). Tocar COMPRA lleva a la cuadrícula de métodos —Pago Móvil, C2P Bancaribe, Credicard Pagos Débito, Transferencia Inmediata— y \"Ver detalles\" abre el reporte: dos campos de fecha con ícono de calendario (\"Período (inicio)\" y \"Período (fin)\"), una lista de tarjetas blancas con filas Fecha / Tipo / Descripción / Entrada o Salida (verde si entra, rojo si sale) / Saldo, y un paginador numérico al pie."
      }
    ],
    "visualConcept": "La landing es un recibo térmico que se imprime mientras el visitante baja. Fondo gris papel #F2F3F5 con un grano sutil; sobre él, una columna central de ancho fijo (unos 420 px, como un rollo de 80 mm ampliado) en blanco #FFFFFF, con el borde inferior recortado en zig-zag por una máscara CSS y una sombra corta y dura hacia la derecha, como papel que cuelga de la ranura. Todo el texto de esa columna va en monoespaciado, mientras que los títulos fuera del ticket usan la sans corporativa. \\n\\nHERO: barra superior azul #0C7CEC a lo ancho, del alto de un AppBar, con el nombre ServicePay POS centrado en versalitas blancas —cita literal del `AppBar` de la app—. Debajo asoma el ticket: la cabecera se imprime sola, línea por línea, con una animación `typewriter` por caracteres (cursor de bloque amarillo #ECCC04 que parpadea) en este orden: el isotipo P amarillo dibujado con `stroke-dashoffset`, luego \\\"SERVICIOS DISPONIBLES\\\", luego la línea de guiones, luego el tagline. Cada línea entra con un desplazamiento vertical de 6 px y un `filter: blur(0.4px)` que se resuelve, imitando el arrastre del papel; entre línea y línea, 90 ms. Un pseudo-elemento de 2 px de alto y azul recorre el ancho del ticket a cada línea nueva: es el cabezal térmico.\\n\\nSECCIONES: cada bloque de la landing es un recibo independiente que se imprime al entrar en viewport (IntersectionObserver + `animation-play-state`), separado del siguiente por una línea de corte punteada con un ícono de tijera a la izquierda. Los pares etiqueta/valor del proyecto se maquetan exactamente como el voucher real: etiqueta en negrita a la izquierda, valor a la derecha, puntos suspensivos rellenando el hueco. Así se presentan las métricas (\\\"Pantallas ....... 19\\\", \\\"Endpoints ....... 32\\\", \\\"Marcas .......... 2\\\") y el stack (\\\"Framework ....... Flutter\\\", \\\"Estado .......... flutter_bloc\\\").\\n\\nDESTAQUES: cuatro tarjetas blancas con elevación mínima, alineadas fuera del ticket sobre el gris de fondo, cada una con una franja superior de 3 px que alterna azul #0C7CEC y amarillo #ECCC04. Al pasar el cursor, la franja se desliza de izquierda a derecha en 220 ms como si la línea se estuviera imprimiendo.\\n\\nMULTIMARCA: un interruptor idéntico al `AnimatedToggleSwitch` del login, con las etiquetas PagueTodo / Sunmi. Al accionarlo, todas las variables CSS de acento pasan de azul+amarillo a naranja #FF6000 + #FCA069 con una transición de 400 ms, y el logo del ticket hace un cross-fade. Es la demostración literal de `themes.json` en la propia página.\\n\\nGALERÍA: las capturas o mockups de pantalla se muestran dentro del marco de un terminal POS dibujado en CSS —cuerpo oscuro, pantalla en 3:5, ranura de papel arriba— y del que sale, colgando, un mini-recibo con el resumen de esa pantalla.\\n\\nCIERRE: el pie repite el patrón del voucher impreso: \\\"Total a pagar\\\", \\\"Estatus: APROBADO\\\" en verde #52FF8F sobre negro, un código de barras dibujado con `repeating-linear-gradient` y, debajo, los enlaces a GitHub y al video. Al terminar, el papel se corta: la última línea del ticket se recorta en zig-zag y desciende 12 px con un rebote corto. Todas las animaciones se desactivan bajo `prefers-reduced-motion`, dejando el recibo completo y estático.",
    "statusShort": "En producción",
    "categoryShort": "Fintech",
    "media": [
      {
        "src": "/proyectos/servicepay-pos/icon.png",
        "kind": "icon",
        "caption": "Ícono de la aplicación: la P monolínea en amarillo #ECCC04 sobre fondo transparente"
      },
      {
        "src": "/proyectos/servicepay-pos/paguetodo.png",
        "kind": "logo",
        "caption": "Logotipo horizontal del pt-theme: símbolo azul #0C7CEC con punto amarillo y wordmark PAGUETODO"
      },
      {
        "src": "/proyectos/servicepay-pos/paguetodo_icon.png",
        "kind": "logo",
        "caption": "Isotipo del pt-theme usado en la cabecera de perfil de la pantalla de servicios"
      },
      {
        "src": "/proyectos/servicepay-pos/sunmi.png",
        "kind": "logo",
        "caption": "Logotipo de la segunda marca (sunmi-theme), naranja #FF6000"
      },
      {
        "src": "/proyectos/servicepay-pos/sunmi_orange.png",
        "kind": "icon",
        "caption": "Ícono naranja del sunmi-theme, fuente de flutter_launcher_icons en el build actual"
      },
      {
        "src": "/proyectos/servicepay-pos/pm.png",
        "kind": "image",
        "caption": "Tarjeta del método de compra Pago Móvil"
      },
      {
        "src": "/proyectos/servicepay-pos/c2p.png",
        "kind": "image",
        "caption": "Tarjeta del método de compra C2P Bancaribe"
      },
      {
        "src": "/proyectos/servicepay-pos/tdd.png",
        "kind": "image",
        "caption": "Tarjeta del método de compra Credicard Pagos débito"
      },
      {
        "src": "/proyectos/servicepay-pos/transfer.png",
        "kind": "image",
        "caption": "Tarjeta del método de compra Transferencia inmediata"
      },
      {
        "src": "/proyectos/servicepay-pos/tutorials.png",
        "kind": "image",
        "caption": "Ilustración de la tarjeta Tutoriales en la sección de ayuda"
      },
      {
        "src": "/proyectos/servicepay-pos/questions.png",
        "kind": "image",
        "caption": "Ilustración de la tarjeta Preguntas frecuentes en la sección de ayuda"
      },
      {
        "src": "/proyectos/servicepay-pos/ic_launcher.png",
        "kind": "icon",
        "caption": "Ícono de lanzador compilado en el APK Android"
      }
    ]
  },
  {
    "slug": "paguetodo",
    "name": "Paguetodo Website",
    "tagline": "El sitio corporativo de una fintech venezolana: 16 rutas, un mega menú de tres columnas y un formulario que abre tickets reales en el back-office.",
    "category": "Sitio corporativo / Fintech",
    "year": "2024 — 2025",
    "role": "Desarrollo front-end y empaquetado (autor declarado en package.json)",
    "status": "En producción en paguetodo.com",
    "summary": [
      "Sitio institucional y comercial de Paguetodo, empresa venezolana de soluciones financieras: puntos de venta, recargas, cobranza, botón de pago, gestión de caja e inventario.",
      "Es una SPA de Angular escrita íntegramente con la API ES5 (`ng.core.Component(...).Class(...)`): sin TypeScript, sin Angular CLI y sin `node_modules` en el navegador — los bundles del framework se cargan por `<script>` desde una CDN propia, `staticd.paguetodo.com`.",
      "19 componentes y 22 vistas HTML cubren 16 rutas de producto, agrupadas en cuatro audiencias comerciales: Comercios, Cadenas comerciales, Empresas y Bancos.",
      "El único formulario del sitio no es decorativo: arma un `FormData` validado (RIF, teléfono venezolano, correo) y lo publica contra `/issue_open` de la API de Paguetodo, creando una solicitud tipificada en el sistema interno.",
      "La compilación es un pipeline de Grunt que sube versión, minifica todo a un solo `compress_vX.Y.Z.js`, reescribe los atributos del `index.html` y comenta los `<script>` de desarrollo."
    ],
    "problem": "Paguetodo vende ocho productos financieros distintos a cuatro audiencias que apenas se solapan: un comercio de barrio que quiere un MiniPOS de 75 $, una cadena comercial que necesita un merchant centralizado, una empresa que busca botón de pago y red de recaudación, y un banco que quiere ampliar su cartera. Un sitio plano de tres páginas obligaba a cada visitante a filtrar contenido que no le corresponde, y el canal de contacto era un correo genérico: las solicitudes llegaban sin área, sin tipo y sin datos fiscales, y había que perseguirlas por teléfono. Además, el equipo ya tenía una CDN interna y un back-office propio de tickets, así que la web no podía ser un sitio aislado ni depender de un stack de build ajeno al resto de la casa.",
    "solution": "Se construyó una SPA de rutas por producto —una por cada solución vendible— y se organizó la navegación por audiencia en vez de por catálogo: el mega menú abre tres columnas de tarjetas donde cada enlace lleva su propia frase explicativa, de modo que el visitante identifica su caso antes de hacer clic. La portada refuerza esa lectura con dos carruseles Swiper (audiencias primero, productos después) y una cinta de aliados y bancos. El contacto se resolvió tipificando: `list.config.js` define la taxonomía área × tipo de solicitud → identificador de plantilla, así que el formulario ya no manda texto libre sino un ticket clasificado, con RIF validado por expresión regular y teléfono enmascarado, que entra directo al back-office. Y para no arrastrar un toolchain moderno, todo el framework llega minificado desde la CDN propia y Grunt se encarga de versionar, concatenar y reescribir el HTML de producción.",
    "highlights": [
      {
        "title": "Mega menú de tres columnas",
        "description": "Comercios, Empresas y Bancos despliegan un panel de tarjetas donde cada destino lleva chevron amarillo, título azul y una línea que explica el producto. En móvil la misma lista se convierte en un sidebar acordeón con `dropdown-trade`, `dropdown-company` y `dropdown-bank`.",
        "icon": "Menu"
      },
      {
        "title": "16 rutas sin un solo paso de build",
        "description": "`app.router.js` registra 16 componentes con `RouterModule.forRoot(..., {useHash: true})`. Todo el framework se declara con la API ES5 de Angular, así que el proyecto corre abriendo `index.html` — sin compilar, sin `node_modules` en runtime.",
        "icon": "Route"
      },
      {
        "title": "Catálogo de POS con precio y ficha técnica",
        "description": "MiniPOS a 75 $, AISINO A80 a 230 $ y AISINO A90 a 300 $, cada uno con su imagen, sus tres virtudes y un desplegable «Ver detalle» que abre la especificación real (banda magnética, NFC, ARM 32-bit 192 MHz, batería 250 mAh, dimensiones).",
        "icon": "CreditCard"
      },
      {
        "title": "Formulario que abre un ticket real",
        "description": "Valida RIF con `/^([VEJPG]{1})([0-9]{4,9}$)/`, teléfono de 10 dígitos con máscara de jQuery y correo, cruza área y tipo de solicitud contra la taxonomía de `list.config.js` y envía `multipart/form-data` a `/issue_open` con cabeceras `X-Paguetodo-ID` y `app-id`.",
        "icon": "Send"
      },
      {
        "title": "Empaquetado Grunt con versión automática",
        "description": "`grunt production` sube la versión en package.json, minifica 26 ficheros JS a un único `compress_v<version>.js`, comprime el CSS, copia `assets/` y `views/`, reescribe `#principal_js` / `#principal_css` en `dist/index.html` y comenta los `<script>` de desarrollo.",
        "icon": "Package"
      }
    ],
    "features": [
      "Portada con banner MiniPos, CTA «Regístrate» hacia el registro de la app y dos carruseles Swiper: audiencias (Canales, Comercio, Bancos, Empresa, Cadenas Comerciales) y productos (Punto de Venta, Sistema de caja, Botón de pago, Inventario, Cobranza, Vuelto, Merchant).",
      "Cintas horizontales de «Aliados comerciales» (Sunmi, Meru, Apolo, Servipunto), «Bancos aleados» y «Servicios disponibles», con autoplay cada 3,5 s y breakpoints de 2 a 5 tarjetas.",
      "Páginas dedicadas para punto de venta, punto de venta banca, soluciones de pago, botón de pago, recarga, cobranza, red de recaudación, gestión de inventario, gestión de caja, sistema de vuelto (comercio y banca), merchant y canales.",
      "Acordeón de preguntas frecuentes por producto, con icono chevron amarillo que alterna arriba/abajo y respuestas paso a paso (cómo cobrar, qué tarjetas se aceptan).",
      "Página «¿Quiénes somos?» con misión, visión y tres contadores animados —años de experiencia, clientes conectados, aliados comerciales— que se disparan una sola vez al pasar el ratón por la sección.",
      "Formulario de contacto con selección en cascada: área del servicio (POS, Recarga, Soluciones de pago, Cobranza, Desarrollo a la medida) → tipo (Sugerencia, Reclamo, Queja, Solicitud) → asunto concreto, y modales Bootstrap de éxito, fallo y «no hay plantilla para esta combinación».",
      "Ruta de suscripción de equipos financieros que lee el `identifier` del query string, consulta el serial contra el parque de equipos y permite suscribir el dispositivo a un plan.",
      "Cabecera azul fija con logo SVG, botón «Iniciar sesión» hacia `app.paguetodo.com` y hamburguesa que abre un panel de todos los productos.",
      "Pie negro con dirección de Altamira, teléfonos, WhatsApp, dos correos operativos, enlaces de interés y cinco redes sociales.",
      "Capa de mensajes en español centralizada (`messages.es.js` + helper `_()`), con más de 300 cadenas de error del ecosistema Paguetodo."
    ],
    "stack": [
      {
        "group": "Framework",
        "items": [
          "Angular (API ES5: ng.core.NgModule / Component / Injectable)",
          "@angular/router con RouterModule.forRoot y useHash",
          "@angular/forms (FormsModule, ngModel)",
          "@angular/http (Http, timeout, map)",
          "platformBrowserDynamic + enableProdMode"
        ]
      },
      {
        "group": "UI y estilos",
        "items": [
          "CSS propio (4.382 líneas, variables en :root)",
          "Bootstrap 5.0.0-beta3",
          "Font Awesome 6.1.1",
          "Swiper (swiper-bundle)",
          "Roboto y fuente Kalinga"
        ]
      },
      {
        "group": "Utilidades de navegador",
        "items": [
          "jQuery 3.5.1",
          "jQuery Mask Plugin",
          "axios"
        ]
      },
      {
        "group": "Build y tooling",
        "items": [
          "Grunt 1.4",
          "grunt-contrib-uglify",
          "grunt-contrib-cssmin",
          "grunt-contrib-concat",
          "grunt-contrib-copy",
          "grunt-contrib-compress",
          "grunt-replace-attribute",
          "grunt-comment-toggler",
          "grunt-bump",
          "grunt-menu",
          "grunt-zip",
          "grunt-contrib-jshint",
          "grunt-contrib-qunit",
          "matchdep"
        ]
      },
      {
        "group": "Integración",
        "items": [
          "API REST apid.paguetodo.com",
          "CDN propia staticd.paguetodo.com",
          "Endpoint /issue_open (tickets)",
          "Endpoint wallet_management/find/identifier/commerce",
          "Endpoint /open_subscription/subscription"
        ]
      }
    ],
    "architecture": "Arquitectura de SPA clásica montada sin transpilación. `index.html` carga en orden: los bundles de Angular desde la CDN interna (`shim.min.js` y `all-node-modules.js`), la configuración de entorno (`index_v4.js`, con dominio, realm, business_id y URLs de API), la taxonomía comercial (`list.config.js`), las utilidades (`i18n.js`, `messages.es.js`, `utils.js`, `msg.js`, `loading.js`, `custom-table.js`), la capa de servicios (`app.callservices.js`) y por último los 19 controladores, el componente raíz, el router y el módulo. Cada controlador es un IIFE que registra un componente en `window.app` con `ng.core.Component({selector, templateUrl}).Class({...})` y apunta a su plantilla en `views/`. El módulo declara 24 entradas —19 pantallas más `LoadingServiceComponent`, `MsgComponent`, `CustomTableComponent`, `AppComponent`— y provee `AppCallService`. Ese servicio es la única puerta a la red: normaliza cabeceras, resuelve tres casos (`website-request`, `device-get`, `device-suscribe`) contra dos bases de enlace, aplica `timeout` de 120 s, muestra y oculta el spinner, y en las respuestas 401/403 o con mensaje de sesión inválida limpia storage y redirige al login. Header, footer y sidebar son componentes globales embebidos en cada vista, y el footer concentra la inicialización de los cuatro carruseles Swiper. Para producción, Grunt colapsa los 26 ficheros en un bundle versionado, minifica el CSS, copia `assets/` y `views/` a `dist/` y reescribe el `index.html` con `replace_attribute` + `toggleComments`.",
    "challenges": [
      {
        "problem": "Mantener un sitio Angular sin adoptar TypeScript ni Angular CLI, y sin que el equipo dependiera de un toolchain distinto al del resto de la casa.",
        "solution": "Se usó la API ES5 del framework: cada componente es `ng.core.Component({...}).Class({constructor: [...deps, function(){}]})` con inyección por arreglo, y los bundles del framework se sirven ya minificados desde `staticd.paguetodo.com`. El resultado corre abriendo el HTML, sin paso de compilación en desarrollo."
      },
      {
        "problem": "26 archivos JS sueltos, 4.382 líneas de CSS y 177 imágenes: en desarrollo eso son decenas de peticiones por carga.",
        "solution": "Un pipeline de Grunt (`bump` → `uglify` → `cssmin` → `copy` → `replace_attribute` → `toggleComments`) genera `compress_v<version>.js` y `compress_v<version>.css`, reescribe los atributos `src`/`href` de los tags `#principal_js` y `#principal_css`, y comenta el bloque de `<script>` de desarrollo del `index.html` de `dist/`. La versión del bundle sale de package.json, así que el nombre de archivo rompe caché en cada publicación."
      },
      {
        "problem": "Las solicitudes de la web llegaban sin clasificar al equipo comercial, imposibles de enrutar.",
        "solution": "Se modeló la taxonomía completa en `list.config.js`: cinco áreas (POS, Recarga, Soluciones de pago, Cobranza, Desarrollo a la medida) por cuatro tipos (sugerencia, reclamo, queja, solicitud), cada combinación mapeada al UUID de plantilla del back-office. El formulario encadena los selects, y cuando una combinación no tiene plantilla abre un modal que deriva al correo de operaciones en vez de fallar en silencio."
      },
      {
        "problem": "Quince destinos de producto no caben en una barra de navegación, y menos en móvil.",
        "solution": "En escritorio, tres ítems (Comercios, Empresas, Bancos) abren mega paneles de tres columnas con descripción por enlace; en móvil, un sidebar oscuro con acordeones que cierran a los demás al abrir uno y se colapsan al hacer clic fuera. La hamburguesa adicional tiñe su icono de amarillo mientras el panel está abierto."
      },
      {
        "problem": "Los contadores de «Comprometidos con tu éxito financiero» se reiniciaban cada vez que el usuario volvía a la sección.",
        "solution": "Un flag `hasAnimated` en el componente y un listener `mouseover` sobre el contenedor: el `setInterval` que incrementa años, clientes y aliados arranca una única vez por visita y se limpia al alcanzar el objetivo."
      }
    ],
    "metrics": [
      {
        "value": "16",
        "label": "rutas SPA registradas"
      },
      {
        "value": "22",
        "label": "vistas HTML"
      },
      {
        "value": "19",
        "label": "componentes Angular"
      },
      {
        "value": "5",
        "label": "instancias Swiper"
      },
      {
        "value": "3",
        "label": "endpoints REST consumidos"
      },
      {
        "value": "4.382",
        "label": "líneas de CSS propio"
      },
      {
        "value": "177",
        "label": "imágenes y SVG en assets"
      },
      {
        "value": "334",
        "label": "cadenas en el diccionario es"
      }
    ],
    "brand": {
      "primary": "#0F79EE",
      "secondary": "#EBCA00",
      "accent": "#FF7B00",
      "bg": "#FFFFFF",
      "surface": "#EFEFEF",
      "text": "#0B0B0B",
      "gradient": "linear-gradient(135deg, #0F79EE 0%, #0F58EE 52%, #EBCA00 100%)",
      "mood": "Corporativo fintech venezolano: azul señal como color de marca sobre blanco limpio, amarillo de alto contraste reservado para llamadas a la acción e iconos, y negro casi puro (#0B0B0B) para anclar el pie de página.",
      "source": "styles.css líneas 11-15 (:root { --blue:#0f79ee; --yellow:#ebca00; --white:#ffff; --roboto:Roboto,sans-serif; --gray:#efefeffc }); acento #ff7b00 en styles.css líneas 653 y 661; fondo del pie #0b0b0b en styles.css línea 1884"
    },
    "links": {
      "github": "https://github.com/ArturoSojo/website_paguetodo",
      "web": "https://paguetodo.com/"
    },
    "uiScreens": [
      {
        "name": "Portada (/init)",
        "describe": "Cabecera azul #0F79EE de borde a borde: a la izquierda un icono hamburguesa y el logo SVG blanco «PAGUETODO»; al centro los enlaces Comercios ▾, Cadenas comerciales, Empresas ▾, Bancos ▾, Canales y ¿Quiénes somos?, en blanco sobre azul; a la derecha una píldora «Iniciar sesión». Debajo, el banner sobre la imagen `bg.png`: a la izquierda el kicker «MiniPos» en amarillo, el titular «El control de tu negocio en tus manos» en tipografía Roboto de gran cuerpo, y un botón píldora amarillo #EBCA00 de 18×38 px de padding con el texto «REGÍSTRATE» que al pasar el ratón se invierte a azul con texto blanco; a la derecha el render del terminal MiniPOS. A continuación un carrusel de tres tarjetas blancas de 468 px con borde gris tenue: cada una es foto arriba, título («Canales», «Comercio», «Bancos», «Empresa», «Cadenas Comerciales»), una línea descriptiva y un botón «Conoce más»; avanza solo cada 3,5 s con paginación de puntos. Sigue una banda «Gestiona tu Negocio / SIN ESPERAS» con ilustración a la izquierda, párrafo de misión a la derecha y botón «CONÓCENOS». Después el bloque «PRODUCTOS» con siete tarjetas de 600 px de alto (Punto de Venta, Sistema de caja, Botón de pago, INVENTARIO, Cobranza, Vuelto, Merchant) y botones «INFORMACIÓN». Cierra con tres cintas de logotipos en fondo blanco: «ALIADOS COMERCIALES» (Sunmi, Meru, Apolo, Servipunto), «BANCOS ALEADOS» y «SERVICIOS DISPONIBLES», de dos a cinco por fila según el ancho."
      },
      {
        "name": "Mega menú de cabecera",
        "describe": "Al pulsar «Comercios» el chevron gira de abajo a arriba y cae un panel gris muy claro (#EFEFEF) redondeado, de ancho completo bajo la barra azul, dividido en tres columnas iguales. Cada columna contiene tres o cuatro bloques con la misma anatomía: un icono `fa-circle-right` amarillo, el nombre del producto en azul #0F79EE seminegrita, y debajo un párrafo gris de dos líneas. Columna 1: Punto de venta («El POS es un sistema esencial para la gestión eficaz de ventas y operaciones…»), Gestión de Inventario, Gestión de caja. Columna 2: Sistema de vuelto, Recargas, Soluciones de pago. El enlace activo del navbar se marca con la clase `activea`. En móvil el mismo contenido se sirve como sidebar oscuro deslizante con logo pequeño arriba, una X sobre cuadro amarillo, y filas «Comercio ▾», «Cadenas comerciales», «Empresa ▾», «Banco ▾», «Canales», «¿Quiénes somos?» e «Iniciar Sesión»; al abrir un acordeón los demás se cierran."
      },
      {
        "name": "Punto de venta (/point-sales)",
        "describe": "Hero con el titular «La Solución que NECESITAS» sobre imagen de comercio. Bajo el encabezado «Puntos de venta», tres tarjetas de producto en fila, cada una partida en dos mitades: arriba, fondo blanco con la foto del terminal a 120 px; abajo, panel con el modelo en mayúsculas («MINIPOS», «AISINO A80», «AISINO A90»), el precio en cuerpo grande («$75», «$230», «$300»), tres atributos en líneas sueltas (Inalámbrico / Bluetooth / Fácil de usar) y un botón «Adquirir» que navega a la sección de contacto. Al pie de cada tarjeta un disparador «＋ Ver detalle» que al pulsarse cambia el icono a «−» y despliega la ficha técnica en filas con check amarillo: banda magnética, tarjeta NFC, compatible con Android, procesador ARM 32-bit de 192 MHz, batería de litio 250 mAh 3,7 V y dimensiones 99 × 59,03 × 16,1 mm. Más abajo, «Beneficios» en cuatro columnas con icono (Gestión rápida, Diversidad de cobro, Atención personalizada, Sencillez), el bloque «Impulsa tu negocio sin límites financieros» con tres promociones cruzadas, y un acordeón «Preguntas frecuentes» a dos columnas: a la izquierda el título y un párrafo introductorio, a la derecha las preguntas con chevron amarillo que se despliegan en respuesta justificada y listas numeradas."
      },
      {
        "name": "¿Quiénes somos? (/us)",
        "describe": "Primera banda: foto de equipo con esquinas redondeadas de 20 px a la izquierda y, a la derecha, el titular «¿Quiénes Somos?» seguido de dos columnas con los rótulos «MISIÓN» y «VISIÓN» a 18 px. Segunda banda, con id `Comprometidos`: título centrado «Comprometidos con tu éxito financiero», imagen a media altura y una columna de tres contadores gigantes que arrancan en cero y suben al pasar el ratón hasta «+10 Años de experiencia en el mercado», «+5000 Clientes conectados» y «+10 Aliados comerciales». Tercera banda «ESCRÍBENOS», dividida por la mitad: a la izquierda, ilustración y una lista con iconos amarillos de WhatsApp, correo y ubicación; a la derecha, el formulario en tarjeta blanca con selector V/E/G/J más «Número de RIF/CI», «Nombre y Apellido», «Correo electrónico», prefijo telefónico (414/424/412/416/426) más número enmascarado, y tres selects encadenados —área del servicio, tipo de solicitud y asunto—, un textarea de cuatro filas y un botón «Enviar». Los campos inválidos se marcan con la clase `is-invalid` de Bootstrap; al enviar aparece un modal con spinner y luego un check verde de 80 px con «¡Gracias por enviar su solicitud!»."
      },
      {
        "name": "Suscripción de equipo financiero (/suscription-finantial-app)",
        "describe": "Pantalla utilitaria que se abre desde un enlace con `?identifier=<serial>`: el componente lee el parámetro, consulta el parque de equipos y, si no encuentra el serial, muestra el mensaje «No se encontró el serial en nuestro parque de equipos financieros». Si lo encuentra, presenta el bloque «SUSCRÍBETE» con datos del titular (tipo y número de RIF, nombre, correo, prefijo y teléfono) y selects encadenados de tipo de dispositivo, marca y modelo alimentados desde catálogos locales, más una casilla de aceptación enlazada al contrato en PDF. El envío publica un `FormData` contra el endpoint de suscripción con el realm, el business_id y el plan_id de la configuración."
      }
    ],
    "visualConcept": "MOSAICO CORPORATIVO CON HOVER MAGNÉTICO Y CINTA DE SERVICIOS — la landing se lee como el tablero de operaciones de una fintech, no como una ficha de proyecto.\n\nESTRUCTURA. (1) Hero partido en diagonal: mitad izquierda blanca con el nombre «Paguetodo Website» en Roboto muy apretado y el subtítulo «16 rutas, 4 audiencias, 0 pasos de build»; mitad derecha ocupada por un mosaico vivo. (2) El mosaico: una rejilla CSS de 4×3 celdas desiguales (algunas 1×1, dos 2×1, una 1×2) donde cada celda es un producto real del sitio —Punto de venta, Soluciones de pago, Recargas, Inventario, Gestión de caja, Cobranza, Vuelto, Botón de pago, Merchant, Red de recaudación, Canales, Cadenas comerciales—. (3) Franja de métricas contra fondo azul #0F79EE con los números del repo. (4) Bloque «Cómo está armado» con el diagrama de carga: CDN → configuración → utilidades → servicios → 19 controladores. (5) Sección de retos en tarjetas apiladas. (6) Cierre con la cinta de servicios.\n\nHOVER MAGNÉTICO. Cada celda del mosaico responde al puntero antes de tocarla: dentro de un radio de 120 px la tarjeta se inclina con `transform: perspective(900px) rotateX(calc(var(--dy)*-6deg)) rotateY(calc(var(--dx)*6deg)) translate3d(calc(var(--dx)*8px), calc(var(--dy)*8px), 0)`, calculado en un `pointermove` que escribe `--dx`/`--dy` normalizados. La transición es `transform 220ms cubic-bezier(.2,.9,.25,1)`. Al entrar de verdad, un halo amarillo #EBCA00 de 2 px recorre el borde con un `conic-gradient` animado por `@property --ang` de 0 a 360 grados en 1,2 s, y el fondo pasa de blanco a un lavado azul del 6 %. Las celdas vecinas se retraen un 2 % (`scale(.98)`) y bajan a 55 % de opacidad, de modo que el cursor parece atraer una sola pieza del tablero. Con `prefers-reduced-motion` todo esto degrada a un simple cambio de borde a amarillo.\n\nCINTA DE SERVICIOS. Bajo el mosaico corre una banda horizontal continua, negra #0B0B0B, de 72 px de alto, con los nombres de los servicios que el ecosistema procesa (CANTV, Corpoelec, Movistar, Digitel, Inter, SimpleTV, Bancaribe, Banco de Venezuela, Bancamiga, BDT) separados por puntos amarillos. Se desplaza en bucle con dos copias del contenido y `translateX(-50%)` en 28 s lineales; al hacer hover la animación baja a `animation-play-state: paused` y cada nombre gana subrayado amarillo. Una segunda cinta, más fina y en sentido contrario, lleva los tres terminales con su precio real: «MINIPOS · $75 · AISINO A80 · $230 · AISINO A90 · $300».\n\nCOLOR Y RITMO. Base blanca #FFFFFF con superficies #EFEFEF; el azul #0F79EE manda en cabeceras, franja de métricas y títulos de tarjeta; el amarillo #EBCA00 se reserva —igual que en el sitio real— para bordes activos, chevrones, subrayados y el único botón principal; el naranja #FF7B00 aparece solo como marcador de los nodos del diagrama de arquitectura. Los degradados usan `linear-gradient(135deg, #0F79EE 0%, #0F58EE 52%, #EBCA00 100%)` y nunca cubren más de un cuarto de pantalla. En modo oscuro se invierte el lienzo a #0B0B0B, las celdas pasan a #131313 y el halo amarillo gana 20 % de luminosidad.\n\nQUÉ LA HACE DISTINTA. Las demás landings del portafolio son narrativas verticales; esta es un tablero. El scroll no revela párrafos sino celdas que se reorganizan: al llegar la sección de arquitectura, las doce celdas del mosaico se recolocan con FLIP en cinco filas que representan el orden real de carga de los scripts, y cada fila se etiqueta con su archivo (`index_v4.js`, `list.config.js`, `app.callservices.js`, `paguetodo-controllers/*`, `app.module.js`). Es la única página del portafolio donde la misma pieza gráfica sirve primero de catálogo y luego de diagrama.",
    "statusShort": "En producción",
    "categoryShort": "Fintech",
    "media": [
      {
        "src": "/proyectos/paguetodo/2.png",
        "kind": "screenshot",
        "caption": "Login de la app Paguetodo: logo con la P azul y el punto amarillo, botón amarillo «Nuevo usuario» y acceso biométrico"
      },
      {
        "src": "/proyectos/paguetodo/3.png",
        "kind": "screenshot",
        "caption": "Diálogo de actualización de versión sobre la pantalla de servicios"
      },
      {
        "src": "/proyectos/paguetodo/4.png",
        "kind": "screenshot",
        "caption": "Servicios disponibles: rejilla de tarjetas con CANTV, Corpoelec, Digitel e Inter"
      },
      {
        "src": "/proyectos/paguetodo/5.png",
        "kind": "screenshot",
        "caption": "Más servicios de recarga: Movistar pospago, prepago, Inter y SimpleTV"
      },
      {
        "src": "/proyectos/paguetodo/6.png",
        "kind": "screenshot",
        "caption": "Inventario disponible en prepago, con botón azul de compra"
      },
      {
        "src": "/proyectos/paguetodo/7.png",
        "kind": "screenshot",
        "caption": "Métodos de compra: Credicard débito, pago móvil, C2P Bancaribe y transferencia inmediata"
      },
      {
        "src": "/proyectos/paguetodo/8.png",
        "kind": "screenshot",
        "caption": "Formulario de pago con tarjeta de débito y cinta de bancos aliados"
      },
      {
        "src": "/proyectos/paguetodo/9.png",
        "kind": "screenshot",
        "caption": "Instrucciones de pago móvil con datos copiables y nota operativa"
      },
      {
        "src": "/proyectos/paguetodo/10.png",
        "kind": "screenshot",
        "caption": "Pago C2P Bancaribe: campos con borde amarillo y contador de caracteres"
      },
      {
        "src": "/proyectos/paguetodo/11.png",
        "kind": "screenshot",
        "caption": "Transferencia inmediata con selección de banco y validación de referencia"
      },
      {
        "src": "/proyectos/paguetodo/12.png",
        "kind": "screenshot",
        "caption": "Servicio de ayuda: preguntas frecuentes, tutoriales y botón flotante de WhatsApp"
      },
      {
        "src": "/proyectos/paguetodo/13.png",
        "kind": "screenshot",
        "caption": "Tutoriales en vídeo: registro, compra de inventario, proceso de recarga y demo"
      },
      {
        "src": "/proyectos/paguetodo/14.png",
        "kind": "screenshot",
        "caption": "Consulta CANTV por número de contrato con advertencia de pago no reversable"
      },
      {
        "src": "/proyectos/paguetodo/15.png",
        "kind": "screenshot",
        "caption": "Selección de deuda vencida, actual o total antes de pagar"
      },
      {
        "src": "/proyectos/paguetodo/16.png",
        "kind": "screenshot",
        "caption": "Recibo de compra CANTV emitido por Servicios Paguetodo, C.A."
      },
      {
        "src": "/proyectos/paguetodo/17.png",
        "kind": "screenshot",
        "caption": "Segundo recibo con número de aprobación y estatus exitoso"
      }
    ]
  },
  {
    "slug": "artlex",
    "name": "Artlex",
    "tagline": "El control de tu negocio en la palma de tu mano",
    "category": "App móvil de gestión comercial (Flutter)",
    "year": "2024",
    "role": "Desarrollo móvil y diseño de interfaz (proyecto individual)",
    "status": "Prototipo navegable con datos estáticos",
    "summary": [
      "Artlex es una aplicación Flutter para que un comercio pequeño lleve en el teléfono lo que normalmente vive en un cuaderno: qué productos se venden, cuáles rinden y qué gastos los acompañan.",
      "La app arranca en una pantalla de bienvenida sobre fondo azul noche con el logotipo circular de Artlex, y entra al producto por modales deslizantes de registro e inicio de sesión.",
      "Dentro, un conmutador de cinco pestañas (Inicio, Analítica, Ventas, Gastos y Menú) reparte el catálogo de productos, la exploración por categorías y la ficha de detalle con pestañas de ingredientes, tutoriales y reseñas.",
      "Todo el copy de la aplicación está escrito en español y la interfaz se apoya en un sistema propio de 16 widgets reutilizables (tarjetas, tiles, barra inferior flotante, modales) sobre una paleta declarada en un único archivo AppColor.",
      "Los datos provienen de un helper estático en Dart, de modo que la capa visual está completa y aislada de cualquier backend: sustituir la fuente de datos no obliga a tocar las pantallas."
    ],
    "problem": "Un comercio pequeño suele registrar ventas, costos y existencias en papel o en hojas sueltas. No hay una vista rápida de qué producto se mueve, cuál deja margen ni cuánto se gastó, y toda la información vive fuera del teléfono que el dueño lleva encima todo el día.",
    "solution": "Artlex traduce esa libreta a una app móvil: una portada de catálogo con los productos más vendidos y los de alto rendimiento, una barra inferior flotante que separa Analítica, Ventas, Gastos y Menú, buscador con filtros por antigüedad y popularidad, y una ficha de producto a pantalla completa con imagen, métricas y pestañas de composición y reseñas. Está resuelto como prototipo de interfaz sobre datos locales, lo que permite validar el recorrido completo antes de conectar un backend.",
    "highlights": [
      {
        "title": "Cinco pestañas para todo el negocio",
        "description": "PageSwitcher mantiene un índice y conmuta entre Inicio, Analítica, Ventas, Gastos y Menú sobre una barra inferior flotante con esquinas redondeadas de 20 px e iconos SVG que cambian de estado al seleccionarse.",
        "icon": "LayoutDashboard"
      },
      {
        "title": "Catálogo real de bodega venezolana",
        "description": "Las tarjetas destacadas se ilustran con productos reales fotografiados (Harina P.A.N., Arroz Mary, azúcar, mayonesa, snacks), no con imágenes de banco genéricas.",
        "icon": "Store"
      },
      {
        "title": "Ficha de producto con encabezado que reacciona al scroll",
        "description": "La pantalla de detalle nace con AppBar transparente sobre la foto y, pasados 2 píxeles de desplazamiento, un AnimatedContainer de 200 ms la vuelve azul sólido; debajo, tres pestañas en un IndexedStack.",
        "icon": "Layers"
      },
      {
        "title": "Sistema visual centralizado",
        "description": "Un único AppColor concentra color primario, secundario crema y tres gradientes lineales reutilizados en portadas, sombras inferiores y superposiciones de imagen; las tipografías Inter y Open Sans se empaquetan con diez pesos.",
        "icon": "Palette"
      },
      {
        "title": "Un solo código, seis plataformas",
        "description": "El proyecto Flutter conserva los targets de Android, iOS, web, macOS, Linux y Windows, con manifiesto web e iconos maskable ya generados.",
        "icon": "Smartphone"
      }
    ],
    "features": [
      "Pantalla de bienvenida a sangre completa con degradado negro inferior y aceptación de términos",
      "Registro e inicio de sesión como modales inferiores desplegables a 85 % de la altura de pantalla",
      "Portada con carrusel horizontal de 'Productos más vendidos' en tarjetas con desenfoque de fondo",
      "Fila de 'Productos de alto rendimiento' y lista vertical de 'Vendidos recientemente'",
      "Buscador dedicado con campo de texto, icono que desaparece al escribir y modal de filtros",
      "Filtros por Más nuevos, Más viejos y Popular, con acciones de resetear y cancelar",
      "Exploración por seis categorías en mosaico: Saludable, Bebida, Mariscos, Postre, Picante y Carne",
      "Ficha de producto con imagen a 280 px, métricas, y pestañas de Ingredientes, Tutoriales y Reseñas",
      "Botón flotante contextual que abre un diálogo para postear una reseña, visible solo en esa pestaña",
      "Visor de imagen a pantalla completa al tocar la foto del producto",
      "Perfil con foto editable, correo, nombre, tipo de suscripción y vigencia",
      "Barra de navegación inferior flotante con degradado de desvanecido detrás del contenido",
      "Pantallas de listado ampliado 'Delicias de Hoy' y 'Posteados Reciente'",
      "Iconografía SVG teñida por código, sin duplicar archivos para los estados activo e inactivo"
    ],
    "stack": [
      {
        "group": "Framework",
        "items": [
          "Flutter",
          "Dart SDK >=3.2.2 <4.0.0",
          "Material Design"
        ]
      },
      {
        "group": "Dependencias",
        "items": [
          "flutter_svg ^2.0.10+1",
          "cupertino_icons ^1.0.2"
        ]
      },
      {
        "group": "Calidad y pruebas",
        "items": [
          "flutter_lints ^2.0.0",
          "flutter_test",
          "analysis_options.yaml"
        ]
      },
      {
        "group": "Tipografía y recursos",
        "items": [
          "Inter (6 pesos)",
          "Open Sans (4 pesos)",
          "23 iconos SVG",
          "30 imágenes de producto"
        ]
      },
      {
        "group": "Plataformas",
        "items": [
          "Android (com.example.artlex)",
          "iOS",
          "Web (PWA manifest)",
          "macOS",
          "Linux",
          "Windows"
        ]
      }
    ],
    "architecture": "Arquitectura MVC ligera en tres carpetas dentro de lib/. models/core define las cuatro entidades de dominio (Recipe, Ingridient, TutorialStep y Review) con factorías fromJson y toMap, de modo que el modelo ya está preparado para deserializar desde una API. models/helper concentra RecipeHelper, una capa de datos estática de casi 2.500 líneas que mapea listas crudas a objetos tipados y expone siete colecciones nombradas (destacados, recomendados, recién vendidos, populares, resultados de búsqueda y guardados). views/ se divide en screens (13 pantallas, una de ellas en el subdirectorio auth), widgets (13 componentes más 3 modales) y utils, donde AppColor centraliza toda la paleta y los gradientes. La navegación es imperativa con MaterialPageRoute, sin router declarativo: main.dart arranca en WelcomePage, los modales de acceso hacen pushReplacement hacia PageSwitcher, y este mantiene el estado del índice para intercambiar la pantalla activa bajo una barra inferior personalizada con extendBody.",
    "challenges": [
      {
        "problem": "El producto giró desde una app de recetas hacia gestión de negocio, pero las entidades y buena parte del contenido semilla ya estaban escritas.",
        "solution": "Se conservó el modelo Recipe reutilizándolo como ficha de producto (título, foto, dos métricas y descripción) y se reemplazaron las fotos por productos reales de bodega, cambiando primero los textos de interfaz al español. La deuda queda visible y acotada: los títulos del dataset semilla siguen en inglés mientras la interfaz ya está traducida."
      },
      {
        "problem": "La ficha de producto necesita un encabezado invisible sobre la foto, pero legible en cuanto el usuario baja.",
        "solution": "Un ScrollController escucha la posición y, al superar 2 píxeles, cambia el color del AppBar dentro de un AnimatedContainer de 200 ms, con extendBodyBehindAppBar para que la imagen ocupe el área bajo la barra de estado."
      },
      {
        "problem": "Una barra de navegación flotante y redondeada deja ver el contenido pasando por debajo y se pierde el contraste.",
        "solution": "PageSwitcher usa extendBody y superpone un BottomGradientWidget de 150 px con un degradado cian que se desvanece hacia arriba, de manera que el contenido se atenúa justo detrás de la barra sin recortar el scroll."
      },
      {
        "problem": "Cada icono de la barra inferior necesita estado activo e inactivo, y duplicar archivos multiplicaría los recursos.",
        "solution": "Los iconos se cargan como SVG con flutter_svg y se tiñen en tiempo de ejecución con el color primario o gris según el índice seleccionado, reservando los archivos duplicados solo para los dos iconos con relleno propio."
      },
      {
        "problem": "Sin backend disponible, las pantallas corrían el riesgo de llenarse de datos incrustados y volverse imposibles de conectar después.",
        "solution": "Toda la información vive en RecipeHelper como colecciones estáticas tipadas que las vistas consumen por nombre; las pantallas nunca ven un mapa crudo, así que migrar a una fuente remota implica sustituir el helper y no reescribir la interfaz."
      }
    ],
    "metrics": [
      {
        "value": "13",
        "label": "pantallas Flutter"
      },
      {
        "value": "16",
        "label": "widgets reutilizables"
      },
      {
        "value": "5.560",
        "label": "líneas de Dart"
      },
      {
        "value": "5",
        "label": "pestañas de navegación"
      },
      {
        "value": "6",
        "label": "plataformas objetivo"
      },
      {
        "value": "23",
        "label": "iconos SVG propios"
      }
    ],
    "brand": {
      "primary": "#416AAF",
      "secondary": "#EDE5CC",
      "accent": "#2BAFCB",
      "bg": "#03112C",
      "surface": "#0E2B57",
      "text": "#F8F8F8",
      "gradient": "linear-gradient(135deg, #03112C 0%, #0E2B57 45%, #416AAF 80%, #2BAFCB 100%)",
      "mood": "Azul noche corporativo con un destello cian tecnológico y contrapunto crema cálido: serio y ordenado como una hoja de cuentas, pero con el brillo del logotipo circular que da identidad de marca.",
      "source": "lib/views/utils/AppColor.dart (primary y primarySoft rgb(65,106,175) = #416AAF, secondary #EDE5CC, primaryExtraSoft #EEF4F4, whiteSoft #F8F8F8, gradiente bottomShadow rgb(43,175,203) = #2BAFCB). Los tonos oscuros bg #03112C y surface #0E2B57 están muestreados de assets/images/bg.jpg, y el cian #2BAFCB se confirma como color dominante de assets/images/logo.jpg."
    },
    "links": {
      "github": "https://github.com/ArturoSojo/artlex",
      "web": "https://www.youtube.com/shorts/W6NppqNkH5Y"
    },
    "uiScreens": [
      {
        "name": "Bienvenida",
        "describe": "Pantalla de acceso a sangre completa. Una fotografía vertical de fondo azul noche (#03112C que aclara a #0E2B57 en la zona superior) ocupa el 100 % del viewport; sobre ella flota el logotipo de Artlex: un anillo circular fragmentado de arcos, puntos y trazos en cian #2BAFCB y azul #3A64AC con un núcleo blanco, y debajo la palabra ARTLEX en versalitas blancas muy anchas. El 60 % inferior lleva un degradado negro al 45 % que sube hasta transparente. Dentro de ese bloque, con 16 px de margen lateral, se apila: el titular 'Gestiona tu Negocio' en Inter 700 a 26 px blanco, un subtítulo 'El control de tu negocio en la palma de tu mano.' en 14 px blanco, un gran vacío central, y al pie dos botones de 60 px de alto y ancho completo con radio 10 px: el primero relleno azul #416AAF con texto crema #EDE5CC '¡Registrate!' en Inter 600, el segundo solo con borde crema al 50 % de opacidad y texto crema 'Iniciar Sesion'. Cierra un párrafo centrado a 60 % de opacidad blanca, interlineado 1,5, donde 'Terminos de Servicios' y 'Políticas de Privacidad.' van en negrita. Pulsar cualquiera de los dos botones despliega un modal inferior blanco de esquinas superiores redondeadas a 20 px que cubre el 85 % de la pantalla."
      },
      {
        "name": "Inicio (catálogo del negocio)",
        "describe": "Pantalla principal en tres bandas. Arriba, una cabecera azul #416AAF de 245 px que se extiende bajo la barra de estado: a la izquierda el rótulo ARTLEX en Inter 700 blanco, a la derecha un avatar circular pulsable que navega al perfil. Debajo, un buscador falso —campo con lupa e indicación en gris claro que al tocarlo abre la pantalla de búsqueda— acompañado a la derecha por un botón cuadrado crema #EDE5CC de esquinas redondeadas con el icono de filtros. Sigue la fila 'Productos más vendidos' en Inter 600 blanco 16 px con un enlace 'ver todo' a la derecha, y un carrusel horizontal de tarjetas de 180 × 220 px, radio 10 px, con la foto del producto a sangre (bolsas de arroz, harina de maíz) y, anclada al pie de cada tarjeta, una cartela de 80 px con desenfoque gaussiano de 4 px sobre negro al 26 %: título en dos líneas blancas y una fila con icono de llama y reloj junto a dos métricas de 10 px. La segunda banda, ya sobre fondo blanco, arranca con el rótulo gris 'Productos de alto rendimiento.' y otro carrusel horizontal de 174 px con tarjetas de imagen redondeada arriba y texto negro debajo. La tercera banda, 'Vendidos recientemente' con su 'ver todo', apila cinco filas de 90 px sobre gris #F8F8F8, radio 10 px, con miniatura cuadrada de 70 px a la izquierda y título más métricas a la derecha. Superpuesta al final, una barra de navegación blanca flotante con radio 20 px, 70 px de alto y 30 px de margen lateral, con cinco iconos SVG —casa, gráfico de analítica, etiqueta de precio, calculadora de gastos y menú— donde el activo se tiñe de azul #416AAF y el resto de gris; detrás de ella un degradado cian de 150 px desvanece el contenido."
      },
      {
        "name": "Ficha de producto",
        "describe": "Detalle a pantalla completa. Encabezado transparente sobre la imagen, con flecha de retroceso blanca a la izquierda, título centrado en Inter 400 de 16 px y un icono de marcador a la derecha; al desplazar más de 2 píxeles el encabezado se vuelve azul sólido con una transición de 200 ms. La imagen del producto ocupa 280 px de alto a todo el ancho, cubierta por un degradado negro al 50 % que baja desde arriba, y al tocarla se abre un visor a pantalla completa. Bajo ella, un bloque azul #416AAF con 20 px de aire superior contiene, en este orden: una fila de métricas con icono de llama y reloj en blanco a 12 px, el título del producto en Inter 600 blanco de 18 px, y una descripción en blanco al 90 % con interlineado 1,5. A continuación, una franja crema #EDE5CC de 60 px alberga tres pestañas —Ingredientes, Tutoriales y Reseñas— con etiqueta negra, indicador inferior negro y las inactivas al 60 %. El contenido cuelga de un IndexedStack: lista de ingredientes con nombre y gramaje, lista numerada de pasos, o lista de reseñas con usuario y texto. Solo en la pestaña de reseñas aparece un botón flotante azul con icono de lápiz que abre un diálogo con un área de texto de seis líneas y los botones 'cancelar' y 'Postear Reseña'."
      },
      {
        "name": "Explorar por categorías",
        "describe": "Pantalla de descubrimiento con encabezado azul plano y un icono de lupa a la derecha que abre el buscador. La primera sección es un bloque azul #416AAF de 245 px con un Wrap de seis tarjetas de categoría separadas 16 px en ambos ejes: Saludable, Bebida, Mariscos, Postre, Picante y Carne, cada una como miniatura fotográfica con el nombre superpuesto. Debajo, sobre blanco y con 20 px de margen vertical, una tarjeta destacada grande a todo el ancho con la imagen del producto popular, su título y sus métricas. Cierra un rótulo gris de una línea y un carrusel horizontal de 174 px con tarjetas de recomendación idénticas a las de la portada."
      },
      {
        "name": "Mi perfil",
        "describe": "Pantalla de cuenta con encabezado azul, flecha de retroceso, título centrado 'Mi Perfil' y un botón de texto 'Editar' en blanco 600 a la derecha. La cabecera continúa en un bloque azul de 24 px de aire vertical que centra un avatar circular de 130 × 130 px y, bajo él, la fila pulsable 'Cambiar foto de perfil' en Inter 600 blanco acompañada de un icono SVG de cámara. A partir de ahí, sobre fondo blanco y con 24 px de separación superior, se apilan cuatro fichas de información separadas 16 px, cada una con etiqueta gris encima y valor dentro de una caja de 16 px de relleno: Correo, Nombre Completo, Tipo de Suscripción —resaltada en crema #EDE5CC en lugar de blanco para marcar el plan premium— y Tiempo de Suscripción con la fecha de vigencia."
      }
    ],
    "visualConcept": "Galería de arte nocturna dedicada a una sola obra. La página se plantea como un museo cerrado a medianoche: paredes de azul abisal #03112C con una veladura #0E2B57 en la parte alta que imita la luz que se cuela por un lucernario, y un grano sutil de ruido al 4 % para que el color no se lea como plano digital. Un foco sigue al cursor: un div fijo con radial-gradient(circle 420px, rgba(43,175,203,0.16), transparent 70%) en mix-blend-mode screen que persigue el puntero con interpolación suave (lerp 0,12 por frame), de modo que se retrasa medio latido respecto al ratón; en móvil el foco se ancla y respira con una animación de opacidad de 6 s. Sobre esa oscuridad cuelgan los marcos: cada captura de la app se monta en un marco de bisel crema #EDE5CC de 10 px con passe-partout interior y sombra proyectada larga y difusa hacia abajo, suspendido de dos cables finos de 1 px que suben hasta un riel superior de latón cian; al pasar el ratón el marco se inclina 1,5 grados con transform-origin en el punto de anclaje y oscila hasta detenerse (cubic-bezier de rebote, 700 ms), y su iluminación aumenta con un filter brightness que pasa de 0,82 a 1. Cada marco lleva su cartela de museo a la izquierda o a la derecha: una placa crema rotada 0,4 grados, tipografía Inter en versalitas espaciadas para el título, cuerpo en Open Sans gris pizarra, y una línea final con la ficha técnica —Flutter, 2024, Dart— igual que un cartel de sala indicaría técnica y año. La estructura sigue el recorrido de una visita: 1) Vestíbulo, con el logotipo circular de Artlex girando muy lentamente (rotate 60 s lineal) sobre el azul noche, el nombre en versalitas blancas anchas y el lema como subtítulo de la exposición; 2) Sala I – La obra, donde las dos capturas y el vídeo cuelgan a distintas alturas y el scroll produce parallax vertical desigual (los marcos suben a 0,92 y las cartelas a 1,0); 3) Cartelas técnicas, el stack presentado como placas de bronce en rejilla, que se encienden una a una con un retardo escalonado de 60 ms al entrar en viewport; 4) Sala II – Bocetos, los retos como pares problema/solución dentro de vitrinas horizontales de cristal (fondo rgba(65,106,175,0.10) con borde superior luminoso de 1 px); 5) Vitrina de cifras, las métricas sobre pedestales alineados, con los números contando desde cero al aparecer y una fina línea cian bajo cada uno; 6) Salida, con los enlaces al repositorio y al vídeo como dos puertas iluminadas por el foco. Todas las apariciones son un fade-up de 24 px accionado por IntersectionObserver, la única saturación fuerte del sitio es el cian #2BAFCB reservado a rieles, subrayados y al halo del foco, y el azul #416AAF actúa como color de acción en botones y enlaces. Con prefers-reduced-motion el foco se fija centrado, los marcos dejan de oscilar y los fade-up se reducen a un cambio de opacidad.",
    "statusShort": "Prototipo",
    "categoryShort": "App móvil",
    "media": [
      {
        "src": "/proyectos/artlex/2.png",
        "kind": "screenshot",
        "caption": "Pantalla de bienvenida: logotipo circular de Artlex sobre azul noche, titular 'Gestiona tu Negocio' y los botones ¡Registrate! e Iniciar Sesion."
      },
      {
        "src": "/proyectos/artlex/3.png",
        "kind": "screenshot",
        "caption": "Portada de la app: cabecera azul con el rótulo ARTLEX y foto de perfil, buscador con botón de filtros crema, carrusel de 'Productos más vendidos' con Arroz Mary y Harina P.A.N., y barra inferior flotante de cinco iconos."
      },
      {
        "src": "/proyectos/artlex/1.mp4",
        "kind": "video",
        "caption": "Recorrido en vídeo por la aplicación en un dispositivo Android: acceso, portada, exploración y ficha de producto."
      }
    ]
  },
  {
    "slug": "servicios-ya",
    "name": "ServiciosYa",
    "tagline": "Contrata u ofrece servicios: el directorio de oficios de Venezuela, en el bolsillo",
    "category": "Aplicación móvil · Marketplace de servicios",
    "year": "2024",
    "role": "Desarrollador móvil Flutter — diseño de interfaz, arquitectura de vistas, flujo de acceso y sistema de diseño",
    "status": "Prototipo funcional. El repositorio público contiene el flujo de acceso completo y el esqueleto de navegación; la integración con backend está presente pero comentada en el código.",
    "summary": [
      "ServiciosYa es una aplicación Flutter para Android, iOS y web cuyo mensaje de bienvenida lo dice todo: «Contrata u ofrece servicios. Optimiza tu tiempo y agiliza la contratación». Un mismo binario sirve a las dos caras del mercado: quien necesita un oficio resuelto y quien vive de resolverlo.",
      "El repositorio público (commit inicial del 24 de septiembre de 2024) reúne 30 archivos Dart y 5.550 líneas: once pantallas, dieciséis widgets reutilizables, una capa de modelos con serialización desde JSON y un sistema de color centralizado en una sola clase estática.",
      "El flujo de entrada está resuelto de punta a punta: pantalla de bienvenida a sangre completa con degradado, hoja modal de registro al 85 % de la altura, hoja modal de inicio de sesión y verificación por código de seis dígitos enviado al correo.",
      "El registro está pensado para Venezuela y no para un formulario genérico: selector de letra de documento (V) junto al campo RIF/CI con contador 0/9, prefijo telefónico desplegable (412) con contador 0/8 y fecha en formato DDMMYYYY, también contada carácter a carácter.",
      "Todo el aparato visual se apoya en recursos propios: 23 iconos SVG vectoriales (analítica, ventas, financiero, reporte de negocios, filtro, cámara, etiqueta de precio), 33 imágenes y dos familias tipográficas empaquetadas con diez pesos entre Inter y Open Sans."
    ],
    "problem": "En Venezuela contratar un oficio —plomería, electricidad, mantenimiento, delivery, cualquier servicio de barrio— se resuelve por cadena de WhatsApp, recomendación de vecino o grupo de Facebook. No hay un lugar donde el que ofrece publique de forma verificable ni donde el que contrata compare antes de decidir, y el proceso se pierde en mensajes sueltos, precios que no se sostienen y contactos que nunca responden. Del otro lado, el profesional independiente carece de una vitrina propia: su reputación vive en la memoria de sus clientes y no viaja a nadie más.",
    "solution": "Una aplicación móvil de doble rol que se instala una sola vez y sirve tanto para contratar como para ofrecer. El acceso arranca en una pantalla de bienvenida que plantea la elección desde el primer segundo —«¡Regístrate!» u «Iniciar Sesión»— y continúa en hojas modales deslizables que evitan cambios de pantalla bruscos. El registro captura identidad real con los formatos del país (RIF/CI con letra, teléfono con prefijo de operadora, fecha de nacimiento) y la valida con un código de seis dígitos enviado por correo antes de dejar entrar a nadie. Ya adentro, un shell de cuatro pestañas organiza la vida del usuario y un catálogo con buscador, categorías visuales y modal de ordenamiento permite recorrer la oferta.",
    "highlights": [
      {
        "title": "Un binario, dos roles",
        "description": "La pantalla de bienvenida no pregunta «¿eres cliente o proveedor?»: plantea contratar y ofrecer como la misma puerta. El mismo registro y el mismo shell de navegación sirven a los dos lados del mercado.",
        "icon": "Handshake"
      },
      {
        "title": "Registro con formatos venezolanos",
        "description": "Campos compuestos en lugar de inputs genéricos: selector de letra (V) más RIF/CI con contador 0/9, desplegable de prefijo (412) más número con contador 0/8, y fecha DDMMYYYY contada carácter a carácter mientras se escribe.",
        "icon": "UserPlus"
      },
      {
        "title": "Verificación por código de seis dígitos",
        "description": "Pantalla dedicada con seis casillas independientes, botón de reenvío y salida de emergencia («¿Correo incorrecto? Regresar») para que un tipeo mal hecho no deje al usuario atrapado en el embudo.",
        "icon": "MailCheck"
      },
      {
        "title": "Hojas modales en vez de pantallas",
        "description": "Registro e inicio de sesión se abren como bottom sheets al 85 % de la altura, con esquinas superiores redondeadas de 20 px y tirador gris centrado. La bienvenida permanece detrás, atenuada, sin perder el contexto.",
        "icon": "Layers"
      },
      {
        "title": "Shell de cuatro pestañas flotante",
        "description": "Barra inferior propia dentro de un ClipRRect de 20 px de radio y 70 px de alto, con extendBody activo para que el contenido corra por debajo. Iconos SVG que cambian de versión rellena a lineal según la pestaña activa.",
        "icon": "LayoutGrid"
      },
      {
        "title": "Sistema de color en un solo archivo",
        "description": "Toda la paleta y los tres degradados de la app viven en la clase estática AppColor: azul primario, crema secundario y las capas de sombra negra que hacen legible el texto sobre fotografía.",
        "icon": "Palette"
      }
    ],
    "features": [
      "Pantalla de bienvenida a sangre completa con ilustración de fondo y degradado negro ascendente sobre el 60 % inferior",
      "Registro en hoja modal con RIF/CI, letra de documento, nombre, apellido, correo, teléfono con prefijo, fecha de nacimiento y contraseña",
      "Inicio de sesión en hoja modal con correo, contraseña y enlace de restauración",
      "Verificación de cuenta mediante código de seis dígitos enviado al correo, con reenvío y retorno al paso anterior",
      "Shell de navegación de cuatro pestañas: Inicio, Analítica, Ventas y Gastos",
      "Menú lateral (Drawer) con Inventario, Usuarios, Novedades, Notificaciones, Configuración y cierre de sesión",
      "Portada con carrusel horizontal destacado, fila de recomendados y lista vertical de actividad reciente",
      "Pantalla de exploración con cuadrícula de seis categorías ilustradas y tarjeta destacada",
      "Buscador dedicado con campo translúcido sobre el azul primario y resultados en lista",
      "Modal de ordenamiento con opciones Más nuevos, Más viejos y Popular, más acciones de Resetear y Cancelar",
      "Pantalla de guardados con buscador propio y botón de filtro en color crema",
      "Perfil con foto circular de 130 px, acción de cambiar imagen y fichas de correo, nombre, tipo de suscripción y vigencia",
      "Pantalla de detalle con descripción, lista de insumos, pasos numerados y reseñas de usuarios",
      "Visor de imagen a pantalla completa",
      "Tarjetas con efecto de vidrio esmerilado: BackdropFilter de 4 px de desenfoque sobre la foto, con velo negro al 26 %",
      "Iconografía completamente vectorial mediante flutter_svg, tintada en tiempo de ejecución según el estado",
      "Tipografías Inter (seis pesos) y Open Sans (cuatro pesos) empaquetadas en el binario",
      "Compilación configurada para seis plataformas: Android, iOS, web, macOS, Linux y Windows"
    ],
    "stack": [
      {
        "group": "Aplicación",
        "items": [
          "Flutter",
          "Dart SDK ^3.5.2",
          "Material Design",
          "MaterialApp con ThemeData propio"
        ]
      },
      {
        "group": "Interfaz",
        "items": [
          "flutter_svg 2.0.10+1",
          "BottomNavigationBar personalizado",
          "showModalBottomSheet",
          "BackdropFilter / ImageFilter.blur",
          "BouncingScrollPhysics",
          "Inter (6 pesos)",
          "Open Sans (4 pesos)"
        ]
      },
      {
        "group": "Datos y estado",
        "items": [
          "sqflite 2.3.3+1 (declarado)",
          "Modelos Dart con factory fromJson / toMap",
          "RecipeHelper como capa de datos estáticos",
          "StatefulWidget + setState",
          "TextEditingController",
          "GlobalKey<FormState>"
        ]
      },
      {
        "group": "Calidad",
        "items": [
          "flutter_lints 4.0.0",
          "analysis_options.yaml",
          "flutter_test"
        ]
      },
      {
        "group": "Plataformas",
        "items": [
          "Android",
          "iOS",
          "Web",
          "macOS",
          "Linux",
          "Windows"
        ]
      }
    ],
    "architecture": "Arquitectura por capas dentro de lib/, con separación estricta entre datos y presentación. models/core aloja las entidades con sus constructores factory desde JSON y sus métodos toMap; models/helper concentra la capa de datos —hoy servida desde estructuras estáticas en memoria— de modo que sustituirla por una fuente remota o por sqflite no obliga a tocar ninguna vista. views/ se divide a su vez en tres: screens/ (once pantallas, con auth/ aislado para el flujo de acceso), widgets/ (dieciséis piezas reutilizables, con modals/ como subcarpeta propia para las tres hojas deslizables) y utils/, donde AppColor centraliza la identidad visual completa. La navegación es imperativa: main.dart arranca en WelcomePage y, tras el acceso, PageSwitcher hace de contenedor de pestañas resolviendo la vista activa por índice sobre una lista de widgets, con la barra inferior como componente propio y no como el widget estándar de Material. El acoplamiento entre pantallas se limita a Navigator.push con MaterialPageRoute y al paso del modelo por constructor. La base de vistas reutiliza el andamiaje de una aplicación de catálogo previa —de ahí los nombres de dominio heredados en modelos y widgets— que se fue reetiquetando hacia el dominio de servicios; el flujo de acceso, en cambio, está escrito íntegramente para ServiciosYa.",
    "challenges": [
      {
        "problem": "Validar la experiencia de acceso completa antes de tener backend disponible, sin dejar el flujo roto ni obligar al evaluador a imaginarse los pasos siguientes.",
        "solution": "El bloque de autenticación contra Firebase Auth y la comprobación posterior contra la colección de usuarios en Firestore quedaron escritos y comentados dentro del modal de inicio de sesión, con su manejo de errores por código (user-not-found, wrong-password) ya redactado. El botón navega directo al shell de pestañas, de modo que la aplicación se recorre entera y la conexión real se activa descomentando un bloque acotado."
      },
      {
        "problem": "Los formularios genéricos no sirven para identidad venezolana: el RIF y la cédula llevan letra separada del número, los móviles se identifican por prefijo de operadora y la fecha se escribe corrida, sin separadores.",
        "solution": "Se construyeron campos compuestos en lugar de inputs planos. Un desplegable estrecho con borde azul sostiene la letra del documento o el prefijo, y el campo largo contiguo recibe solo los dígitos con su contador de longitud visible bajo la línea (0/9 para el documento, 0/8 para el teléfono y para la fecha DDMMYYYY), de forma que el usuario sabe cuánto le falta sin esperar a un mensaje de error."
      },
      {
        "problem": "Abrir el registro y el inicio de sesión como pantallas nuevas rompía la continuidad visual: la ilustración de bienvenida desaparecía y el usuario perdía la referencia de dónde estaba.",
        "solution": "Ambos se resolvieron como bottom sheets con isScrollControlled activo, altura fija al 85 % de la pantalla, esquinas superiores de 20 px y tirador gris centrado del 35 % del ancho. La bienvenida permanece visible y atenuada detrás, y el padding inferior de la lista se ata a MediaQuery.viewInsets para que el teclado nunca tape el campo enfocado."
      },
      {
        "problem": "Mantener una identidad visual coherente sobre fotografías de fondo de brillo impredecible, donde el texto blanco unas veces se lee y otras se pierde.",
        "solution": "AppColor define tres degradados reutilizables como capas de contraste: linearBlackBottom y linearBlackTop, que oscurecen el borde correspondiente hasta transparente, y bottomShadow, un cian al 20 % que se desvanece hacia arriba. Las tarjetas destacadas añaden además un BackdropFilter de 4 px con velo negro al 26 % bajo el texto, garantizando legibilidad sea cual sea la imagen."
      },
      {
        "problem": "El shell de pestañas reconstruye la pantalla activa en cada toque, porque resuelve la vista indexando una lista de widgets recién instanciada dentro del build.",
        "solution": "Es la deuda técnica identificada más clara del prototipo: el estado de scroll y los controladores se pierden al cambiar de pestaña. La ruta natural es sustituir esa lista por un IndexedStack o un PageView con PageController, un cambio contenido en un único archivo gracias a que la barra inferior ya está desacoplada como componente independiente."
      }
    ],
    "metrics": [
      {
        "value": "11",
        "label": "pantallas Flutter"
      },
      {
        "value": "16",
        "label": "widgets reutilizables"
      },
      {
        "value": "5.550",
        "label": "líneas de Dart"
      },
      {
        "value": "23",
        "label": "iconos SVG propios"
      },
      {
        "value": "10",
        "label": "archivos tipográficos"
      },
      {
        "value": "6",
        "label": "plataformas configuradas"
      }
    ],
    "brand": {
      "primary": "#416AAF",
      "secondary": "#EDE5CC",
      "accent": "#2BAFCB",
      "bg": "#FFFFFF",
      "surface": "#EEF4F4",
      "text": "#000000",
      "gradient": "linear-gradient(160deg, #416AAF 0%, #2BAFCB 100%)",
      "mood": "Azul institucional sereno con acentos crema y un cian de aire caribeño. Confiable sin ser corporativo, cercano sin ser informal: la paleta de una libreta de contactos de barrio que decidió tomarse en serio.",
      "source": "lib/views/utils/AppColor.dart — primary y primarySoft = Color.fromARGB(255, 65, 106, 175) → #416AAF; secondary = #EDE5CC; primaryExtraSoft = #EEF4F4; el cian del degradado bottomShadow = Color.fromARGB(255, 43, 175, 203) → #2BAFCB. Fondo blanco de lib/main.dart (scaffoldBackgroundColor: Colors.white) y texto negro de los encabezados. El valor gradient combina primary con el cian de bottomShadow y es la única entrada compuesta por mí; el resto son valores literales del código."
    },
    "links": {
      "github": "https://github.com/ArturoSojo/servicios_ya_ve",
      "web": "https://www.youtube.com/shorts/B6CBIvyBBSU"
    },
    "uiScreens": [
      {
        "name": "Bienvenida",
        "describe": "Pantalla completa sin barra superior. Ocupa el tercio alto una ilustración plana sobre blanco: dos figuras de traje oscuro estrechándose la mano frente a un documento inclinado unos quince grados, con un sello azul violáceo en su esquina y una firma manuscrita en tinta azul; bajo los pies, una línea gris fina hace de suelo. A partir de ahí el fondo se funde en un degradado vertical que pasa de blanco a azul acero y termina en un azul petróleo profundo al pie. Sobre ese degradado, centrado, el titular «Contrata u ofrece servicios» en sans serif negra de peso 700 y unos 26 px, y debajo, en regular gris oscuro, la línea «Optimiza tu tiempo y agiliza la contratación.». El bloque de acción vive en el tercio inferior, a 16 px de los bordes: primero un botón sólido de 60 px de alto y radio 10 px en azul #416AAF con el texto «¡Regístrate!» en crema #EDE5CC y peso 600; separado por 16 px, un botón fantasma de idéntica geometría, relleno transparente, borde de 1 px en crema al 50 % y el mismo texto crema, «Iniciar Sesion». Al pie, a 32 px de distancia y centrado en dos líneas, el aviso legal en blanco al 60 % con interlineado de 1,5: «Al usar ServiciosYa, estás aceptando nuestros» y, en negrita, «Terminos de Servicios y Políticas de Privacidad.»."
      },
      {
        "name": "Registro",
        "describe": "Hoja modal blanca que sube desde abajo hasta ocupar el 85 % de la altura, con las dos esquinas superiores redondeadas a 20 px. Detrás asoma la bienvenida cubierta por un velo gris. Arriba, centrado, un tirador gris claro de 6 px de alto por el 35 % del ancho, y 20 px más abajo el título «Registro» en negro, 22 px, peso 700, alineado a la izquierda. El formulario alterna dos tipografías de campo. Los campos compuestos van en caja: un recuadro estrecho de esquinas redondeadas con borde azul brillante que muestra el valor y una flecha descendente —«V» para el documento, «412» para el teléfono—, y a su derecha un recuadro ancho de borde gris oscuro con el marcador correspondiente («RIF/CI» precedido de un icono de persona, «Número de teléfono»); bajo cada pareja, alineado a la derecha en gris pequeño, el contador de longitud: 0/9 y 0/8. Los campos simples son inputs de línea inferior al estilo Material, con la etiqueta flotante en gris medio sobre una regla gris de 1 px que cruza todo el ancho: Nombre, Apellido, Correo, «Ingrese fecha (DDMMYYYY)» —con su propio contador 0/8— y Contraseña. La separación vertical entre campos es de 16 px y el conjunto se desplaza con rebote elástico; el padding inferior de la lista se ajusta a la altura del teclado. Al final, un botón de 60 px, radio 10 px, con el texto «Registrar» en crema, y bajo él un enlace de texto: «¿Ya tienes una cuenta? » en gris seguido de «Entrar» en azul negrita."
      },
      {
        "name": "Inicio de sesión",
        "describe": "Misma hoja modal blanca al 85 % de altura y esquinas superiores de 20 px, sobre la bienvenida atenuada en gris. Tirador gris centrado arriba, y a 24 px el título «Iniciar» en negro, 22 px, peso 700, a la izquierda. El cuerpo es deliberadamente escueto: dos campos de línea inferior separados por 16 px, «Correo» y «Contraseña» —este último enmascarado—, con la etiqueta en gris medio sobre regla fina. A 32 px de distancia, el botón principal ocupa todo el ancho: 60 px de alto, radio 10 px, relleno azul #416AAF y el texto «Entrar» centrado en crema #EDE5CC, peso 600, 16 px. Debajo, centrado y sin recuadro, el enlace «¿Olvidaste tu Contraseña? » en gris con «Restaurar» en azul negrita. Todo el tercio inferior queda en blanco vacío, lo que hace que el botón caiga justo bajo el pulgar."
      },
      {
        "name": "Verificación del código",
        "describe": "Pantalla completa sobre blanco, sin barra superior ni botón de retroceso. El titular «Verificación del código» arranca a un tercio de la altura, en gris muy oscuro, tamaño grande y peso ligero, partido en dos líneas. Debajo, en gris oscuro a tamaño de párrafo y tres líneas, la instrucción: «Le enviamos un código por correo electrónico, por favor ingréselo a continuación». A media pantalla, una fila de seis casillas idénticas separadas por unos 12 px: cuadrados de esquinas redondeadas, fondo blanco y borde gris muy claro de 1 px, cada una para un dígito. Bajo la fila, el recordatorio «Ingrese el código recibido por correo electrónico» en gris. Cerca del pie, un botón sólido de ancho completo, radio 10 px, en azul brillante saturado con el texto «Reenviar código» en blanco, 16 px. Y por último, centrado, «¿Correo incorrecto? » en negro seguido de «Regresar» en azul, como salida para quien se equivocó al escribir."
      },
      {
        "name": "Panel principal y shell de pestañas",
        "describe": "Al entrar, la aplicación adopta un esquema de cabecera azul sangrada. La barra superior es del azul primario y lleva a la izquierda el icono de menú que abre el cajón lateral, el nombre de la aplicación centrado en blanco peso 700, y a la derecha la foto de perfil circular, tocable. Bajo ella, todavía sobre el azul, una barra de búsqueda simulada de 50 px y radio 10 px en un azul apenas más claro, con lupa blanca y marcador translúcido a la izquierda y, separado 15 px, un cuadrado de 50 px en crema #EDE5CC con el icono de filtro. Sigue el encabezado «Productos más vendidos» en blanco peso 600 con un «ver todo» a la derecha, y a continuación un carrusel horizontal de tarjetas de 180 × 220 px con radio 10 px: cada una es una fotografía a sangre sobre la que flota, anclada abajo, una banda de vidrio esmerilado —desenfoque de 4 px y velo negro al 26 %, radio 5 px— con el título en blanco a dos líneas y, bajo él, dos micrométricas con iconos pequeños. El azul termina a 245 px de altura y el resto de la página es blanco: una fila de recomendados en tarjetas horizontales de 174 px de alto, y luego «Vendidos recientemente» como lista vertical de filas con miniatura a la izquierda. Sobre todo ello flota la barra inferior: recortada con radio 20 px, 70 px de alto, con márgenes laterales de 30 px que la despegan de los bordes, sin etiquetas visibles y con cuatro iconos SVG —Inicio, Analítica, Ventas, Gastos— que pasan de gris 600 a azul primario y, en el caso de Inicio, de trazo lineal a versión rellena al activarse. El contenido corre por debajo de la barra, que queda suspendida sobre él."
      }
    ],
    "visualConcept": "El directorio de oficios como una baraja de cartas 3D sobre la rejilla del barrio.\n\nLa metáfora que gobierna toda la página es la de un mazo de fichas de oficio —el plomero, la manicurista, el electricista, el que arregla neveras— repartidas sobre un plano de calles. El fondo es una rejilla de barrio: líneas de 1 px en #416AAF al 8 % sobre blanco, con celdas de 48 px, y sobre ella manzanas irregulares apenas insinuadas en #EEF4F4 que no forman un mapa reconocible sino la sensación de uno. La rejilla no está quieta: se desplaza en horizontal a razón de un píxel por segundo, tan lento que el ojo no lo registra pero la página nunca se siente muerta, y al hacer scroll se mueve a 0,3 de la velocidad del contenido.\n\nCada tarjeta de oficio se construye con cuatro capas apiladas en el eje Z: al fondo un rectángulo de color plano en azul #416AAF; encima, a 20 px de profundidad, la fotografía o ilustración del oficio; a 40 px, una banda de vidrio esmerilado que replica exactamente el patrón real de la app —backdrop-filter de 4 px de desenfoque con velo negro al 26 % y radio de 5 px— donde vive el nombre del oficio en Inter 600; y al frente, a 60 px, una pastilla crema #EDE5CC con el precio o la disponibilidad, la única mancha cálida de la composición. Al pasar el cursor, la tarjeta rota siguiendo la posición del puntero con un máximo de 12 grados en cada eje y una perspectiva de 900 px, mientras cada capa se desplaza en sentido contrario al giro con una amplitud proporcional a su profundidad: el resultado es que la pastilla de precio parece levantarse de la fotografía. La transición usa 400 ms con curva cubic-bezier(0.22, 1, 0.36, 1) al entrar y 700 ms al volver al reposo, de modo que el retorno se siente como algo que se asienta y no como un resorte. La sombra acompaña: pasa de 0 8px 24px de negro al 8 % a 0 24px 60px del azul primario al 25 %, y su desplazamiento sigue al inverso del tilt.\n\nLa estructura de secciones va de lo abierto a lo concreto. Abre un héroe a pantalla completa con el degradado real de la marca, linear-gradient(160deg, #416AAF 0%, #2BAFCB 100%), sobre el que se recorta la rejilla en blanco al 10 %; el titular «Contrata u ofrece servicios» entra con las palabras escalonadas 60 ms una de otra desde 20 px abajo, y a su derecha tres tarjetas de oficio flotan en reposo con una oscilación permanente de dos grados y un ciclo de seis segundos, desfasadas entre sí para que nunca se sincronicen. Sigue la sección del problema, sobre blanco, donde la rejilla se densifica y se ven los oficios como puntos dispersos e inconexos que, al entrar en viewport, se unen con líneas azules trazadas mediante stroke-dashoffset en 900 ms. Después, la baraja completa: una cuadrícula de tarjetas 3D que se revelan escalonadas al hacer scroll, cada una con 80 ms de retardo respecto a la anterior. La sección de flujo reproduce los cuatro pasos reales de acceso —bienvenida, registro, verificación, panel— como cuatro maquetas de teléfono en fila, unidas por una línea azul que se dibuja al avanzar el scroll y con las seis casillas del código iluminándose una a una cuando el paso de verificación entra en pantalla. Cierra la ficha técnica, sobre fondo #EEF4F4, con las métricas contando desde cero en 1.200 ms y la paleta expuesta como seis muestras cuadradas que revelan su hexadecimal al pasar por encima.\n\nEl color se administra con avaricia: azul #416AAF para todo lo estructural, blanco y #EEF4F4 para respirar, y el crema #EDE5CC reservado exclusivamente para lo accionable —botones, pastillas de precio, el badge de la pestaña activa— de manera que el ojo aprenda en la primera sección que crema significa «esto se toca». El cian #2BAFCB no se usa nunca en plano, solo como final de degradado y como halo al 20 % detrás de los elementos enfocados. Toda animación respeta prefers-reduced-motion: el tilt se desactiva, el parallax se congela y las revelaciones se reducen a un fundido de 200 ms.",
    "statusShort": "Prototipo",
    "categoryShort": "App móvil",
    "media": [
      {
        "src": "/proyectos/servicios_ya_ve/1.mp4",
        "kind": "video",
        "caption": "Recorrido en vídeo de 14 segundos sobre dispositivo Android: bienvenida, apertura de la hoja de registro y hoja de inicio de sesión."
      },
      {
        "src": "/proyectos/servicios_ya_ve/2.png",
        "kind": "screenshot",
        "caption": "Pantalla de bienvenida: «Contrata u ofrece servicios», con ilustración del acuerdo firmado y los botones ¡Regístrate! e Iniciar Sesión."
      },
      {
        "src": "/proyectos/servicios_ya_ve/3.png",
        "kind": "screenshot",
        "caption": "Verificación del código: seis casillas independientes para el código enviado por correo, con reenvío y retorno al paso anterior."
      },
      {
        "src": "/proyectos/servicios_ya_ve/4.png",
        "kind": "screenshot",
        "caption": "Hoja modal de inicio de sesión sobre la bienvenida atenuada: correo, contraseña, botón Entrar y enlace de restauración."
      },
      {
        "src": "/proyectos/servicios_ya_ve/5.png",
        "kind": "screenshot",
        "caption": "Hoja modal de registro con los campos compuestos venezolanos: letra de documento más RIF/CI (0/9), prefijo 412 más teléfono (0/8) y fecha DDMMYYYY."
      }
    ]
  },
  {
    "slug": "sto",
    "name": "STO Online Store",
    "tagline": "Tienda en línea y panel de gestión en un solo PHP: catálogo, carrito, pedidos e inventario para una empresa local de Higuerote.",
    "category": "E-commerce y gestión de inventario (web)",
    "year": "2021",
    "role": "Desarrollo full-stack: modelo de datos MySQL, backend PHP con patrón MVC propio, capa AJAX y toda la interfaz.",
    "status": "Proyecto publicado con licencia MIT en un único commit. Corre sobre un entorno LAMP local (`SERVERURL` apunta a `http://localhost/tienda/`). El snapshot publicado no incluye `controladores/pedidoControlador.php` ni `vistas/js/añadir.js` y `vistas/js/carrito.js`, referenciados por `ajax/pedidoAjax.php` y `vistas/inc/scripts.php`.",
    "summary": [
      "STO es una tienda en línea completa escrita en PHP plano sobre una arquitectura MVC hecha a mano: un único `index.php` levanta la plantilla y, según el primer segmento de la URL, sirve la tienda pública o el dashboard privado.",
      "El repositorio está configurado para un cliente real: la constante `COMPANY` es «UPF El Sabor de Birongo», el país es Venezuela, la dirección «Higuerote-Birongo» y la moneda son bolívares con símbolo «Bs».",
      "Cubre el ciclo comercial completo: catálogo con categorías, búsqueda y ordenamiento, ficha de producto con galería, carrito, favoritos, pedidos con registro de pago, notificaciones al cliente y reportes en PDF.",
      "El backoffice maneja dos roles (`Administrador` y `Usuario`) que comparten plantilla pero reciben menús, vistas y permisos distintos; la seguridad de cada pantalla del panel se refuerza con el include `vistas/inc/admin_security.php`.",
      "Todo el proyecto está internacionalizado por carpeta de idioma (`vistas/contenidos/<lang>/`) y la constante `LANG`, aunque el snapshot solo incluye el paquete `es`.",
      "El repositorio se publicó en GitHub el 10 de enero de 2025 en un solo commit; la licencia MIT y la clave `SECRET_KEY = '$STO@2021'` en `config/SERVER.php` sitúan el desarrollo en 2021."
    ],
    "problem": "Una unidad de producción familiar en Higuerote vendía por catálogo informal: los precios y el stock vivían en cuadernos y mensajes sueltos, no había forma de que un cliente viera el inventario disponible ni de dejar un pedido registrado, y el control de qué se despachó, quién pagó y con qué referencia dependía de la memoria del encargado. Tampoco existía un reporte que permitiera cerrar el día o la semana.",
    "solution": "Una aplicación PHP/MySQL de dos caras servida por el mismo enrutador. Hacia afuera, un escaparate con banner rotativo, catálogo paginado filtrable por categoría, buscador, ordenamiento por nombre o precio, ficha de producto con galería en lightbox, carrito y lista de favoritos. Hacia adentro, un dashboard con inventario, alertas de stock mínimo, alta de productos con portada y galería, gestión de clientes y administradores, pedidos pendientes y realizados, registro del medio de pago y su número de referencia, notificaciones, bitácora de últimas visitas y exportación de pedidos entregados a PDF por día, semana o mes.",
    "highlights": [
      {
        "title": "Dos aplicaciones, un solo punto de entrada",
        "description": "`index.php` carga `vistas/plantilla.php`, que compara el primer segmento de la URL contra la constante `DASHBOARD` y decide si arma la tienda pública (header + vista + footer) o el panel (nav lateral fijo + navbar + vista), ramificando además según el cargo guardado en sesión.",
        "icon": "LayoutDashboard"
      },
      {
        "title": "Enrutado propio con lista blanca",
        "description": "El `.htaccess` reescribe cualquier ruta a `index.php?views=...`; `vistasControlador` la parte por `/` y `vistasModelo` la valida contra un arreglo de 40 vistas permitidas antes de tocar el disco. Todo lo que no esté en la lista cae en la vista 404.",
        "icon": "Route"
      },
      {
        "title": "Identificadores cifrados en la URL",
        "description": "`mainModel::encryption()` / `decryption()` cifran cada id con AES-256-CBC usando una clave `sha256(SECRET_KEY)` y un IV derivado de `SECRET_IV`, de modo que las URLs de detalle, edición y notificaciones nunca exponen el id numérico de la fila.",
        "icon": "KeyRound"
      },
      {
        "title": "Formularios AJAX con confirmación",
        "description": "Cualquier `<form class=\"FormularioAjax\">` es interceptado por `vistas/js/ajax.js`: lanza un diálogo SweetAlert2 cuyo texto depende del atributo `data-form` (save, update, delete, search), envía con `fetch` a un endpoint de `ajax/` y pinta la respuesta JSON del controlador sin recargar la página.",
        "icon": "MousePointerClick"
      },
      {
        "title": "Reportes de pedidos en PDF",
        "description": "`dashboard-reportes.php` deja elegir Día, Semana o Mes y envía a `modelos/export.php`, que extiende FPDF para generar el «Reporte de Pedidos Entregados» con columnas de cliente, producto, cantidad, pago, tipo de pago, referencia y fecha, más numeración de páginas.",
        "icon": "FileText"
      },
      {
        "title": "Notificaciones y bitácora de visitas",
        "description": "La tabla `notificaciones` guarda receptor, concepto, asunto y estado (`Sin leer`), y el header pinta un badge con el conteo en vivo; la tabla `visitas` registra cliente, estado y `ultima_visita`, que el panel lista paginada de cinco en cinco.",
        "icon": "Bell"
      }
    ],
    "features": [
      "Catálogo público paginado de 10 productos por página, filtrable por categoría habilitada y ordenable A-Z, Z-A, precio menor a mayor y precio mayor a menor.",
      "Buscador de productos en modal que persiste el término en sesión (`busqueda_tienda`) y se limpia con un botón dedicado.",
      "Ficha de producto con portada, tipo, stock, fabricante, modelo, descripción, precio con descuento aplicado, costo de envío y galería de imágenes en lightbox (fslightbox).",
      "Carrito de compras por cliente con alta, actualización de cantidad y eliminación por AJAX, y contador en el header.",
      "Lista de favoritos por cliente con su propio contador y paginador.",
      "Registro y autenticación de clientes y de personal, con estado de cuenta (`Activa`) y token de sesión generado en el login.",
      "Dos roles diferenciados: `Administrador` (categorías, administradores, empresa, alta de productos) y `Usuario`, con menús y vistas condicionadas.",
      "Inventario con alta, edición, borrado, portada, galería y ficha de información por producto, incluyendo código de barras y SKU.",
      "Vista de productos en stock mínimo, apoyada en los campos `producto_stock` y `producto_stock_minimo`.",
      "Gestión de pedidos separada en pendientes y realizados, con búsqueda y ficha de detalle.",
      "Registro del pago de un pedido: medio de pago y número de referencia, guardados por AJAX.",
      "Exportación a PDF de los pedidos entregados por día, semana o mes.",
      "Formulario de contacto que arma y envía el correo desde `correoControlador` con validación por expresiones regulares.",
      "Ficha de empresa editable desde el panel y datos de contacto, país, dirección, teléfono y redes sociales centralizados en `config/APP.php`.",
      "Selector de avatar entre 12 imágenes incluidas (variantes femeninas, masculinas y dos por defecto).",
      "Configuración de negocio por constantes: símbolo y nombre de moneda, decimales, separadores, 7 tipos de documento de usuario, 7 de empresa, 14 unidades de producto y límites de peso para portada (3 MB) y galería (7 MB).",
      "Scripts de respaldo e importación de la base de datos vía `mysqldump` / `mysql` desde `modelos/respaldar.php` e `import.php`.",
      "Estructura multiidioma por carpeta (`vistas/contenidos/es/`, `vistas/inc/es/`) gobernada por la constante `LANG`."
    ],
    "stack": [
      {
        "group": "Backend",
        "items": [
          "PHP (sin framework)",
          "MVC propio: controladores / modelos / vistas",
          "PDO con consultas preparadas",
          "Sesiones PHP",
          "openssl AES-256-CBC para cifrado de ids"
        ]
      },
      {
        "group": "Base de datos",
        "items": [
          "MySQL / MariaDB",
          "Esquema de 11 tablas (`DataBase/sto.sql`)",
          "mysqldump y mysql CLI para respaldo e importación"
        ]
      },
      {
        "group": "Front-end",
        "items": [
          "HTML5 + CSS3 propio (`vistas/css/style.css`)",
          "MDBootstrap 5",
          "Bootstrap bundle",
          "Normalize.css 8.0.1",
          "Font Awesome 5.15.1",
          "Fuentes web propias: Roboto Condensed, Roboto Medium y Poppins"
        ]
      },
      {
        "group": "JavaScript",
        "items": [
          "JavaScript nativo con Fetch API",
          "jQuery 3.6.0",
          "SweetAlert2",
          "fslightbox",
          "JsBarcode (incluido en `vistas/js/`)"
        ]
      },
      {
        "group": "Reportes y servidor",
        "items": [
          "FPDF (`modelos/fpdf.php`)",
          "Apache con mod_rewrite (`.htaccess`)"
        ]
      }
    ],
    "architecture": "Patrón MVC artesanal de tres capas. `index.php` es el único punto de entrada: carga `config/APP.php` (constantes de negocio) y `vistasControlador`, que devuelve `vistas/plantilla.php`. La plantilla abre la sesión, parte `$_GET['views']` por `/` y, si el primer segmento coincide con la constante `DASHBOARD`, entra al panel; de lo contrario arma la web pública envolviendo la vista entre `header.php` y `footer.php`. La resolución de vistas pasa por `vistasModelo::obtener_vistas_modelo()`, que valida el nombre contra una lista blanca de 40 rutas y comprueba con `is_file()` que exista `vistas/contenidos/<lang>/<modulo>-<vista>.php`; cualquier otra cosa se resuelve como 404. Todos los controladores (12 archivos, 38 funciones) extienden `mainModel`, que centraliza en 26 funciones la conexión PDO, los helpers `guardar_datos`, `actualizar_datos`, `eliminar_registro` y `datos_tabla`, la limpieza de cadenas, la validación por expresiones regulares, el cifrado/descifrado de ids y el paginador de tablas. Las escrituras no viajan por formularios tradicionales sino por los 11 endpoints de `ajax/`, cada uno un despachador que instancia su controlador y ejecuta la acción indicada en un campo `modulo_*` del POST, devolviendo JSON que `ajax.js` convierte en un modal de SweetAlert2. Los listados se generan en el servidor: los controladores construyen el HTML de tarjetas y tablas como string y lo devuelven a la vista, apoyándose en `SQL_CALC_FOUND_ROWS` + `FOUND_ROWS()` para paginar. Deuda técnica visible en el código: las contraseñas se guardan con el mismo cifrado reversible `encryption()` en lugar de un hash unidireccional, y varios paginadores interpolan variables ya saneadas directamente en la consulta en vez de enlazarlas.",
    "challenges": [
      {
        "problem": "Servir dos aplicaciones muy distintas —un escaparate público y un backoffice con roles— sin duplicar plantilla, sesión ni layout.",
        "solution": "Un único `plantilla.php` decide por el primer segmento de la URL contra la constante `DASHBOARD` y, dentro del panel, vuelve a ramificar por `$_SESSION['cargo_sto']`: el administrador recibe `nav_lateral.php` + `nav_bar.php`, mientras que el rol `Usuario` reutiliza el header y el footer de la tienda."
      },
      {
        "problem": "Conseguir URLs limpias tipo `/product/all/ASC/1/` sin framework ni router externo, y que ningún parámetro de la URL pueda apuntar a un archivo arbitrario del servidor.",
        "solution": "Una sola `RewriteRule` en `.htaccess` canaliza todo hacia `index.php?views=$1` con `Options All -Indexes`; luego `vistasModelo` valida el nombre contra una lista blanca de 40 vistas y solo después compone la ruta del archivo, devolviendo 404 ante cualquier valor no previsto."
      },
      {
        "problem": "Los enlaces de detalle, edición, notificaciones y seguridad tenían que llevar el id del registro, exponiendo el tamaño y el orden de las tablas.",
        "solution": "`encryption()` cifra cada id con AES-256-CBC (clave `sha256(SECRET_KEY)`, IV de 16 bytes derivado de `SECRET_IV`) y `datos_tabla()` lo descifra y sanea antes de consultar, de modo que la URL viaja siempre con un token opaco."
      },
      {
        "problem": "Agregar al carrito, marcar favoritos o borrar un producto recargaba la página y perdía el contexto del catálogo.",
        "solution": "Una convención de una sola clase: cualquier formulario marcado como `FormularioAjax` es capturado por `ajax.js`, que arma un `FormData`, pide confirmación con SweetAlert2 —con el texto adaptado al `data-form` y al `data-lang`— y envía con `fetch` al endpoint de `ajax/`, mostrando la respuesta JSON sin salir de la vista."
      },
      {
        "problem": "El catálogo debía combinar categoría, cuatro criterios de ordenamiento, término de búsqueda y paginación sin que un parámetro manipulado rompiera la consulta.",
        "solution": "`cliente_paginador_producto_controlador()` valida el orden contra la lista `[ASC, DESC, MAX, MIN]`, comprueba que la categoría exista y esté habilitada, traduce MAX/MIN a orden por `producto_precio_venta` y calcula el total con `SQL_CALC_FOUND_ROWS` en la misma consulta que trae la página, mostrando siempre solo productos habilitados con stock mayor que cero."
      },
      {
        "problem": "El encargado necesitaba cerrar el día sin exportar la base de datos a mano ni cuadrar pagos en papel.",
        "solution": "El pedido guarda medio de pago y número de referencia desde `dashboard-pedido-pay.php`, y `modelos/export.php` extiende FPDF con una cabecera de siete columnas para emitir el reporte de pedidos entregados del día, la semana o el mes en un clic."
      }
    ],
    "metrics": [
      {
        "value": "105",
        "label": "archivos PHP en el repositorio"
      },
      {
        "value": "14.878",
        "label": "líneas de PHP"
      },
      {
        "value": "42",
        "label": "vistas de contenido en español"
      },
      {
        "value": "40",
        "label": "rutas en la lista blanca del router"
      },
      {
        "value": "12",
        "label": "controladores"
      },
      {
        "value": "11",
        "label": "endpoints AJAX"
      },
      {
        "value": "11",
        "label": "tablas MySQL"
      },
      {
        "value": "26",
        "label": "funciones en el modelo base"
      }
    ],
    "brand": {
      "primary": "#253556",
      "secondary": "#3273DC",
      "accent": "#EC5252",
      "bg": "#F6F6F6",
      "surface": "#FFFFFF",
      "text": "#1B1B1B",
      "gradient": "linear-gradient(to right, #24243E, #302B63, #0F0C29)",
      "mood": "Comercio serio y ordenado: azul marino de administración, azul enlace para el precio y un rojo coral que marca lo activo. Grises muy claros, tarjetas blancas con esquinas de 10 px y sombra suave; el único momento oscuro es el degradado violeta-noche del login, que separa visualmente la tienda del panel.",
      "source": "/Users/macbook/.portafolio-research/clones/sto/vistas/css/style.css — bloque `:root` (líneas 41-53: `--accent-color: #253556`, `--color-three: #EC5252`, `--link-color: #3273dc`, `--border-color: #E1E1E1`, `--bg-color: rgb(246,246,246)`, `--text-color: rgb(27,27,27)`) y `.login-container` (líneas 161-163, degradado `#24243e → #302b63 → #0f0c29`)."
    },
    "links": {
      "github": "https://github.com/ArturoSojo/STO",
      "web": "https://youtu.be/odptyxik5Wk"
    },
    "uiScreens": [
      {
        "name": "Inicio de la tienda",
        "describe": "Header blanco fijo de 65 px con el logo a la izquierda y un nav en Poppins negrita (Inicio, Productos, Contáctanos, Regístrate, Iniciar); si hay sesión de cliente, cinco botones-icono con badges de colores: bolsa (azul), estrella (amarillo), campana (rojo), camión (verde) y avatar circular con dropdown. Debajo, un banner que ocupa `calc(100vh - 65px)` con imagen a `cover`, velo negro al 50 % y una animación CSS `banner 15s infinite linear` que va cambiando entre tres fotos en los pasos 0-33 %, 34-66 % y 67-100 %; encima, centrado en columna, un `h3` blanco en mayúsculas «BIENVENIDO A UPF EL SABOR DE BIRONGO» y una línea de apoyo. Sigue una banda blanca «NUESTROS SERVICIOS» con tres columnas iguales, cada una con un icono Font Awesome a tamaño 5x (camión de envío, cajas apiladas, tienda), título en mayúsculas y párrafo. Cierra un bloque de dos filas: ilustración `registration.png` a ancho completo y, debajo, título «CREA TU CUENTA» con un botón azul primario. Footer separado por una línea `#E1E1E1` con 70 px de aire superior y texto en azul marino."
      },
      {
        "name": "Catálogo de productos",
        "describe": "Fondo blanco con contenedor centrado y 50 px de padding superior. Encabezado en Poppins negrita mayúsculas —«PRODUCTOS EN TIENDA» o el nombre de la categoría— y un párrafo explicativo. Sobre una línea superior gris, una barra de tres columnas alineadas: a la izquierda el dropdown «CATEGORÍAS» con las categorías habilitadas, al centro el botón «Buscar» que abre un modal, a la derecha el dropdown «Ordenar por» con Ascendente (A-Z), Descendente (Z-A), Precio menor a mayor y Precio mayor a menor; los tres son botones de tipo link con icono. Si hay búsqueda activa aparece una fila con «Resultados de la búsqueda: TÉRMINO» y un botón rojo «Eliminar búsqueda». El grid es un flex con `wrap` centrado: tarjetas de 300 px de ancho y 15 px de margen, borde gris, radio 10 px, sombra suave y color de texto azul marino; arriba una figura de 300 px de alto con la portada recortada por `overflow:hidden`, abajo un cuerpo de 250 px con el nombre centrado en negrita (truncado a 70 caracteres con puntos suspensivos), el precio en 35 px azul `#3273dc` con formato `Bs 1.234,56 Bolivares`, la línea gris «En stock: N» y una fila de tres acciones: «Agregar» en verde, «Detalles» en azul y un corazón rojo. Al pie, alineado a la derecha, «Mostrando productos X al Y de un total de Z» y el paginador."
      },
      {
        "name": "Detalle de producto",
        "describe": "Título «DETALLES DEL PRODUCTO» con separador y botón de volver. División en dos columnas 5/7: a la izquierda la portada a ancho fluido; a la derecha el nombre en Poppins negrita y, tras 50 px de aire, una rejilla de cuatro datos en dos columnas —Tipo (icono paleta), Stock (icono caja), Fabricante (icono registrado) y Modelo (icono corona)— cada uno con la etiqueta en mayúsculas negrita. Debajo, la descripción justificada precedida de «DESCRIPCIÓN:», y dos líneas destacadas a 22 px en mayúsculas: «PRECIO:» y «COSTO DEL ENVÍO:» con la cifra en azul. Al final, dos formularios AJAX apilados con 70 px de separación, cada uno con un input numérico centrado etiquetado «Cantidad» y su botón: «Agregar al carrito» en azul info y «Actualizar carrito» en verde. Si el producto tiene imágenes asociadas, una sección «GALERÍA DE IMÁGENES» a ancho completo con miniaturas que abren un lightbox a pantalla completa."
      },
      {
        "name": "Dashboard del administrador",
        "describe": "Layout de dos piezas absolutas. A la izquierda, un nav lateral fijo de 300 px con una fotografía de fondo (`nav-font.jpg`) cubierta por una capa `rgba(36,41,46,.8)`: arriba el avatar del usuario en círculo con borde blanco de 4 px al 50 % del ancho, debajo el nombre y el cargo en blanco, una barra roja `#EC5252` de 3 px y el menú en lista blanca de 17 px con filas de 45 px; los grupos (Categorías, Clientes, Productos, Pedidos, Accesibilidad, Administradores, Configuraciones) despliegan submenús con un chevron que rota 180°, el hover pinta un degradado horizontal translúcido y el elemento activo se rellena de rojo. A la derecha, el contenido con `padding-left: 300px`: una navbar de 50 px alineada a la derecha con iconos que al pasar el cursor tiñen de rojo con un halo radial, un `page-header` con el título en mayúsculas y el saludo «¡Bienvenido NOMBRE APELLIDO!», y una rejilla centrada de mosaicos cuadrados de 200×200 px con 10 px de margen —Categorías, Clientes, Productos, Administradores, Pedidos— cada uno con título, icono grande y el conteo real leído de la base («N Registradas»)."
      },
      {
        "name": "Login del panel",
        "describe": "Pantalla completa de 100vw × 100vh con el contenido centrado vertical y horizontalmente sobre un degradado horizontal `#24243e → #302b63 → #0f0c29`. En el centro, una tarjeta blanca de 320 px máximos, radio 5 px y 15 px de padding, con el texto en azul marino: arriba un avatar circular de 125 px con un anillo `box-shadow: 0 0 1px 3px #1266F1`, después dos campos MDBootstrap con etiqueta flotante e icono —«Usuario» con icono de agente secreto y «Contraseña» con icono de llave— y un botón azul primario a ancho completo con la palabra «LOGIN». Abajo a la derecha de la pantalla, un icono de casa blanco de 35 px que devuelve a la tienda. Los errores no se pintan en el formulario: llegan como modales SweetAlert2 disparados desde PHP."
      }
    ],
    "visualConcept": "Escaparate en movimiento. La sección de portada es una vitrina en perspectiva: un contenedor con `perspective: 1200px` sostiene un carrusel 3D de seis tarjetas de producto —las mismas de 300 px, radio 10 px, sombra suave y fondo blanco `#FFFFFF`— distribuidas cada 60° sobre un cilindro invisible con `transform: rotateY(Nx60deg) translateZ(420px)`; el cilindro gira en bucle con `@keyframes vitrina { to { transform: rotateY(-360deg) } }` a 28 s lineales, se detiene con `animation-play-state: paused` al pasar el cursor y responde al arrastre horizontal sumando grados. De cada tarjeta cuelga una etiqueta de precio de cartón: un rectángulo azul marino `#253556` con una muesca circular y un cordón de 22 px, colgado con `transform-origin: top center` y balanceado con `@keyframes vaiven { 0%,100% { rotate: -6deg } 50% { rotate: 6deg } }` a 3,4 s `ease-in-out` y un `animation-delay` distinto por tarjeta para que nunca oscilen al unísono; el precio va en el azul `#3273DC` del proyecto y el porcentaje de descuento en una pastilla coral `#EC5252` que late suavemente. El fondo del héroe es el degradado nocturno del login (`linear-gradient(to right, #24243E, #302B63, #0F0C29)`) para que las tarjetas blancas floten como en un aparador iluminado; el resto de la página baja a gris muy claro `#F6F6F6` con superficies blancas. Estructura de secciones, todas de ancho contenido y separadas por líneas `#E1E1E1`: (1) vitrina 3D con el nombre STO en Poppins mayúsculas y la etiqueta «Tienda + panel en un solo PHP»; (2) «El problema» y «La solución» en dos columnas enfrentadas, con la del problema en gris apagado y la de la solución sobre tarjeta blanca elevada; (3) tira de métricas —105 archivos, 14.878 líneas, 42 vistas, 40 rutas, 12 controladores, 11 endpoints, 11 tablas— como etiquetas de precio pequeñas en fila, cada una entrando con un rebote corto y quedándose quieta; (4) «Cómo está construido», un diagrama del recorrido `.htaccess → index.php → plantilla.php → lista blanca → controlador → mainModel → PDO` en el que un punto luminoso coral viaja por la línea al hacer scroll; (5) mosaico de funcionalidades que replica los tiles de 200×200 px del dashboard, con hover que los tiñe de rojo como el menú activo; (6) galería de los dos vídeos reales del proyecto en marcos de escaparate con reflejo inferior; (7) retos y soluciones en pares plegables. Movimiento contenido: todo entra con `translateY(16px)` y opacidad en 420 ms `cubic-bezier(.22,.61,.36,1)`, el carrusel y el balanceo se congelan bajo `prefers-reduced-motion: reduce`, y ninguna animación de fondo compite con la lectura.",
    "statusShort": "Google Play",
    "categoryShort": "Plataforma web",
    "media": []
  },
  {
    "slug": "coin-venture",
    "name": "Coin Venture",
    "tagline": "Exchange de criptomonedas multiplataforma en Flutter, con precios en vivo de Binance y balances liquidados en Firestore",
    "category": "Fintech / Trading de criptomonedas",
    "year": "2025",
    "role": "Desarrollo integral: arquitectura Clean + BLoC, sistema de diseño propio, integración con la API pública de Binance y capa de datos sobre Firebase",
    "status": "Proyecto personal funcional en repositorio público; sin despliegue web ni publicación en tiendas",
    "summary": [
      "Coin Venture es una aplicación Flutter única que corre en web, Android, iOS, macOS, Windows y Linux, y que reproduce el flujo completo de un exchange: iniciar sesión, explorar mercados, abrir el detalle de un activo, operar y revisar el historial.",
      "Los precios no son simulados: la app consume los endpoints públicos `/api/v3/ticker/24hr` y `/api/v3/klines` de Binance a través de Dio, refresca el listado cada 30 segundos y dibuja un sparkline de 168 velas horarias (7 días) por cada par en pantalla.",
      "La liquidación de una orden se resuelve dentro de una transacción de Firestore: valida fondos, actualiza el mapa de balances del usuario y escribe el mismo movimiento en las subcolecciones `transactions` y `orders`, todo de forma atómica.",
      "El código sigue Clean Architecture estricta: 6 módulos de features, cada uno partido en `domain`, `data` y `presentation`, con 16 casos de uso, 6 repositorios abstractos y 16 data sources conectados con get_it.",
      "La navegación usa go_router con un `AuthGuard` que escucha el stream de sesión de Firebase y redirige automáticamente entre `/login` y `/home/markets`, más feature flags que montan o desmontan rutas completas en tiempo de arranque."
    ],
    "problem": "Construir un exchange de criptomonedas exige tres cosas que raramente conviven en un proyecto pequeño: datos de mercado reales y frescos, un motor de saldos que no pueda descuadrarse, y una sola base de código que sirva igual en navegador y en móvil. Las alternativas obvias fallan en algún punto: mockear precios convierte la app en una maqueta sin valor, y liquidar órdenes con lecturas y escrituras sueltas contra la base de datos abre la puerta a saldos negativos o a operaciones registradas dos veces.",
    "solution": "Coin Venture resuelve cada frente con una decisión explícita. Los datos vienen de la API pública de Binance mediante un cliente Dio con reintentos escalonados (500 ms, 1 s, 2 s) y timeouts de 10 s, filtrados a pares con cotización soportada (USDT, BUSD, USDC, FDUSD, TRY) y recortados al top 10 para no saturar la vista. Los saldos viven en el documento `users/{uid}` de Firestore y se mueven únicamente dentro de `runTransaction`, que rechaza la orden si no hay fondos y escribe balance, transacción y orden en el mismo commit. Y toda la app es un único proyecto Flutter con seis targets de plataforma, un sistema de diseño propio (colores, tipografía, espaciado y siete widgets compartidos) y una capa de almacenamiento de sesión que cambia sola entre `flutter_secure_storage` en nativo y `SharedPreferences` en web.",
    "highlights": [
      {
        "title": "Mercados en vivo desde Binance",
        "description": "Un Timer periódico en el MarketsBloc dispara un refresco cada 30 segundos contra `/api/v3/ticker/24hr`, recalcula capitalización agregada, volumen 24 h, dominancia de BTC y número de monedas, y repinta la tabla sin mostrar el spinner cuando ya hay datos en pantalla.",
        "icon": "RefreshCw"
      },
      {
        "title": "Liquidación atómica en Firestore",
        "description": "`FirestoreTradeDataSource.persistOrder` corre dentro de `runTransaction`: valida fondos con un margen de 1e-9, ajusta los saldos de base y cotización, y escribe el movimiento en `users/{uid}/transactions` y `users/{uid}/orders` en el mismo commit. Si algo falla, nada se aplica.",
        "icon": "ShieldCheck"
      },
      {
        "title": "Clean Architecture de seis módulos",
        "description": "auth, markets, wallet, trade, history y settings, cada uno con sus capas domain/data/presentation. 12 entidades, 16 casos de uso, 6 repositorios abstractos con implementaciones intercambiables y `Either<Failure, T>` de dartz como contrato de error en toda la app.",
        "icon": "Layers"
      },
      {
        "title": "Sparklines de 7 días dibujadas a mano",
        "description": "Para cada par visible se piden 168 velas horarias en paralelo con `Future.wait` y se renderizan con un CustomPainter propio: trazo redondeado, relleno degradado del 35 % al 5 % y color verde o rojo según el signo de la variación de 24 h.",
        "icon": "CandlestickChart"
      },
      {
        "title": "Sesión protegida por guard reactivo",
        "description": "`AuthGuard` extiende ChangeNotifier y se suscribe al stream de usuario de Firebase; go_router lo usa como `refreshListenable` y `redirect`, de modo que cerrar sesión expulsa al login desde cualquier ruta sin código extra en las pantallas.",
        "icon": "LockKeyhole"
      },
      {
        "title": "Un código, seis plataformas",
        "description": "El repositorio incluye targets de Android, iOS, web, macOS, Windows y Linux. Las diferencias de plataforma se aíslan en fábricas: `TokenStore.create()` elige almacenamiento seguro o SharedPreferences según `kIsWeb`, y el datasource de auth ajusta persistencia e inicialización de Google Sign-In del mismo modo.",
        "icon": "MonitorSmartphone"
      }
    ],
    "features": [
      "Registro e inicio de sesión con correo y contraseña sobre Firebase Auth, con validación de formulario en cliente (correo con @, contraseña mínima de 6 caracteres)",
      "Inicio de sesión con Google mediante google_sign_in, con inicialización diferida distinta en web y en nativo",
      "Cierre de sesión desde la barra superior, que limpia el token almacenado y devuelve al login por redirección automática",
      "Listado de mercados con las 10 mejores parejas, actualización automática cada 30 segundos y botón de refresco manual",
      "Buscador por símbolo y cuatro criterios de orden en chips: nombre, precio, variación 24 h y volumen 24 h",
      "Fila de métricas agregadas: capitalización total, volumen 24 h, dominancia estimada de BTC y número de monedas listadas",
      "Sparkline de 7 días por fila, coloreada en verde o rojo según la variación del par",
      "Detalle de activo con precio actual, badge de variación 24 h, rango mínimo-máximo del período y gráfico de precio de 1 h",
      "Panel de estadísticas del activo: capitalización, volumen 24 h, precio de apertura y dominio estimado",
      "Trading embebido en el detalle: selector comprar/vender, campo de cantidad, cálculo automático del total y saldo disponible del lado correspondiente",
      "Pantalla de trading dedicada con selección de par, panel de gráfico y formulario de orden en layout de dos columnas por encima de 1000 px",
      "Portafolio con valor total agregado, número de activos, activo mayoritario y etiqueta de diversificación (Concentrado / Balanceado / Diversificado)",
      "Historial de operaciones con contadores de total, compras y ventas, y estado vacío ilustrado cuando aún no hay movimientos",
      "Ajustes persistidos en Firestore: perfil, notificaciones, doble factor, biometría, idioma, moneda y visibilidad de secciones",
      "Feature flags de arranque que activan o desactivan las rutas de historial y ajustes, y el refresco automático",
      "Reintentos automáticos de red con backoff escalonado e inyección del token de sesión como cabecera Authorization en cada petición"
    ],
    "stack": [
      {
        "group": "Núcleo",
        "items": [
          "Flutter (SDK Dart >=3.3.0 <4.0.0)",
          "Dart",
          "Material 3"
        ]
      },
      {
        "group": "Estado y arquitectura",
        "items": [
          "flutter_bloc 8.1",
          "equatable 2.0",
          "dartz 0.10 (Either/Failure)",
          "get_it 7.6",
          "injectable 2.3"
        ]
      },
      {
        "group": "Red y datos",
        "items": [
          "dio 5.4",
          "dio_smart_retry 5.0",
          "API pública de Binance (ticker/24hr y klines)",
          "intl 0.18"
        ]
      },
      {
        "group": "Backend y autenticación",
        "items": [
          "firebase_core 4.2",
          "firebase_auth 6.1",
          "cloud_firestore 6.0",
          "google_sign_in 7.2"
        ]
      },
      {
        "group": "Persistencia local",
        "items": [
          "flutter_secure_storage 9.0",
          "shared_preferences 2.2",
          "hive / hive_flutter (declarados)",
          "local_auth 2.1 (declarado)"
        ]
      },
      {
        "group": "Navegación y UI",
        "items": [
          "go_router 13.1",
          "fl_chart 0.66 (declarado; los gráficos actuales son CustomPainter propio)",
          "cached_network_image 3.3",
          "cupertino_icons 1.0",
          "universal_html 2.2"
        ]
      },
      {
        "group": "Herramientas de desarrollo",
        "items": [
          "build_runner 2.4",
          "freezed 2.4",
          "json_serializable 6.7",
          "injectable_generator 2.4",
          "bloc_test 9.1",
          "mocktail 1.0",
          "golden_toolkit 0.15",
          "flutter_lints 3.0"
        ]
      },
      {
        "group": "Plataformas objetivo",
        "items": [
          "Android",
          "iOS",
          "Web",
          "macOS",
          "Windows",
          "Linux"
        ]
      }
    ],
    "architecture": "Monorepo Flutter con `lib/` dividido en tres zonas. `core/` concentra lo transversal: configuración (`AppEnv` con flavor por `String.fromEnvironment`, `FeatureFlags`, tema Material 3), inyección de dependencias (`configureDependencies()` registra con get_it el entorno, Dio, FirebaseAuth, FirebaseFirestore, los data sources, los repositorios, los 16 casos de uso y los blocs como factories), red (`buildDioClient` con AuthInterceptor y RetryInterceptor), errores (`Failure`/`Exception` tipados), enrutado (`AppRouter` + `AuthGuard`), seguridad (`TokenStore` con fábrica web/nativo) y utilidades (`Formatters` sobre intl, `Debouncer`). `features/` agrupa seis módulos —auth, markets, wallet, trade, history, settings— y cada uno repite el mismo triple corte: `domain` con entidades puras, repositorio abstracto y casos de uso invocables; `data` con modelos de mapeo, data sources concretos (Binance sobre Dio, Firestore, y variantes mock para auth y trade) e implementación del repositorio que devuelve `Either<Failure, T>`; y `presentation` con bloc/cubit, eventos, estados y páginas. `shared/` aporta el sistema de diseño: `AppColors`, `AppTypography` (Poppins, nueve escalas), `AppSpacing` y siete widgets reutilizables (AppPage, AppCard, AppButton con cuatro variantes, AppTextField, AppSectionHeader, AppShell y MiniSparkline). La navegación es un `GoRouter` con `/login` y `/register` sueltos y un `ShellRoute` que envuelve `/home/markets`, `/home/markets/:symbol`, `/home/portfolio`, `/home/trade` y —según feature flags— `/home/history` y `/home/settings` dentro del `AppShell` con barra superior fija. En Firestore, cada usuario es un documento `users/{uid}` con un mapa `balances`, un objeto de ajustes y las subcolecciones `transactions` y `orders`.",
    "challenges": [
      {
        "problem": "Sin un motor de órdenes propio, liquidar una compra o venta implicaba leer el saldo, calcular y escribir por separado; cualquier fallo intermedio podía dejar saldos descuadrados o una operación registrada sin su contrapartida.",
        "solution": "Toda la liquidación se movió dentro de `_firestore.runTransaction`: se lee el documento del usuario, se valida que haya fondos con una tolerancia de 1e-9 (lanzando `CacheException` con mensaje legible si no los hay), se ajustan los saldos de base y cotización, y se escriben en el mismo commit la actualización de balances, el documento en `transactions` y el documento en `orders`, ambos con el id de la orden."
      },
      {
        "problem": "El endpoint `/api/v3/ticker/24hr` de Binance devuelve cientos de pares de golpe, muchos de ellos irrelevantes o con cotizaciones exóticas, y renderizarlos todos hundía la tabla.",
        "solution": "El repositorio filtra por cotización soportada (USDT, BUSD, USDC, FDUSD, TRY), aplica el criterio de orden elegido en el bloc, recorta con `take(10)` y solo entonces pide las velas: 168 klines de 1 h por símbolo lanzadas en paralelo con `Future.wait`, cada una con su propio `catchError` que degrada a lista vacía en vez de tumbar la pantalla."
      },
      {
        "problem": "Refrescar la tabla cada 30 segundos hacía parpadear la interfaz, porque cada ciclo emitía estado `loading` y sustituía el contenido por un spinner.",
        "solution": "El `MarketsBloc` calcula un flag `keepLoading`: si el estado ya es `loaded` y hay tickers en memoria, el refresco omite la emisión de `loading` y solo publica el nuevo listado. La búsqueda y el cambio de orden reutilizan el mismo camino, así que escribir en el buscador tampoco vacía la tabla."
      },
      {
        "problem": "El almacenamiento seguro de la sesión no existe igual en web que en móvil: `flutter_secure_storage` no tiene el mismo comportamiento en navegador, y Google Sign-In necesita inicialización explícita en nativo pero no en web.",
        "solution": "`TokenStore` se convirtió en una interfaz con fábrica `TokenStore.create()` que devuelve `_SecureTokenStore` o `_WebTokenStore` según `kIsWeb`, ambos serializando el mismo `SessionToken`. El datasource de auth aplica la misma idea con dos guardas perezosas: `_ensurePersistence()` fija `Persistence.LOCAL` solo en web y `_ensureGoogleInitialized()` llama a `initialize()` solo fuera de web."
      },
      {
        "problem": "Había que impedir el acceso a las rutas internas sin sesión y expulsar al usuario al instante si la sesión caducaba, sin repetir comprobaciones en cada pantalla.",
        "solution": "`AuthGuard` extiende `ChangeNotifier` y se suscribe al `watchUser()` del repositorio; go_router lo recibe a la vez como `refreshListenable` y como función `redirect`, de forma que cualquier cambio de sesión reevalúa la ruta actual y manda a `/login` o a `/home/markets` según corresponda."
      },
      {
        "problem": "Las pantallas de trading debían servir tanto en un navegador de escritorio ancho como en un teléfono, sin duplicar código de presentación.",
        "solution": "`TradePage` envuelve el gráfico y el formulario en un `LayoutBuilder`: por encima de 1000 px los coloca en `Row` con pesos 3 y 2, y por debajo los apila en `Column` reutilizando exactamente los mismos widgets y los mismos callbacks al bloc."
      }
    ],
    "metrics": [
      {
        "value": "115",
        "label": "archivos Dart en lib/"
      },
      {
        "value": "7.821",
        "label": "líneas de código Dart"
      },
      {
        "value": "6",
        "label": "módulos de features con capas domain/data/presentation"
      },
      {
        "value": "8",
        "label": "rutas registradas en go_router"
      },
      {
        "value": "16",
        "label": "casos de uso de dominio"
      },
      {
        "value": "8",
        "label": "blocs y cubits"
      },
      {
        "value": "16",
        "label": "data sources implementados"
      },
      {
        "value": "12",
        "label": "entidades de dominio"
      },
      {
        "value": "6",
        "label": "plataformas objetivo del proyecto"
      },
      {
        "value": "30 s",
        "label": "intervalo de refresco automático de mercados"
      },
      {
        "value": "168",
        "label": "velas de 1 h por sparkline (7 días)"
      }
    ],
    "brand": {
      "primary": "#27B3FF",
      "secondary": "#0052FF",
      "accent": "#2ECC71",
      "bg": "#0B1220",
      "surface": "#16294F",
      "text": "#E6ECFF",
      "gradient": "linear-gradient(135deg, #1BD3FF 0%, #005CFF 100%)",
      "mood": "Sala de trading nocturna: azul marino casi negro como lienzo, cian eléctrico para todo lo interactivo, verde y rojo reservados exclusivamente al signo del mercado. Tarjetas translúcidas con radios de 20-24 px, sombras profundas y bordes hairline blancos al 12 %; tipografía Poppins semibold para cifras y regular para el resto. Nada decorativo compite con el precio.",
      "source": "/Users/macbook/.portafolio-research/clones/coin-venture/lib/shared/styles/app_colors.dart (paleta real: bgPrimary #0B1220, bgCard #16294F, primary #27B3FF, primaryDark #0052FF, success #2ECC71, danger #FF5B6A, warning #FFC857, textPrimary #E6ECFF; gradiente primaryButton #1BD3FF → #005CFF). Confirmada por /Users/macbook/.portafolio-research/clones/coin-venture/lib/core/config/theme.dart y /Users/macbook/.portafolio-research/clones/coin-venture/lib/shared/styles/app_typography.dart (fontFamily Poppins)."
    },
    "links": {
      "github": "https://github.com/ArturoSojo/Coin-Venture"
    },
    "uiScreens": [
      {
        "name": "Login",
        "describe": "Pantalla centrada sobre el degradado de fondo (#0B1220 → #0E1F3C → #091225, diagonal). Arriba, un cuadrado de 96×96 px con radio 28 px relleno con el degradado cian→azul (#1BD3FF → #005CFF), un icono de gráfico de líneas blanco de 46 px dentro y una sombra cian difusa (blur 32 px, desplazada 18 px hacia abajo). Debajo el título 'Coin Venture' en Poppins semibold 24 px color #E6ECFF y el subtítulo 'Inicia sesión en tu cuenta' en 16 px #9BA6C6. El bloque central es una tarjeta de ancho máximo 460 px, fondo #16294F al 85 %, radio 24 px, borde blanco al 12 % y sombra negra suave: contiene el campo Email (fondo #1B315C, radio 14 px, icono de sobre a la izquierda, placeholder 'tu@email.com'), el campo Contraseña con icono de candado y botón de ojo para alternar visibilidad, un botón primario ancho completo 'Iniciar sesión' con el degradado cian→azul e icono de login, un separador con la línea a ambos lados del texto 'O continúa con', un botón fantasma 'Google' de borde tenue y, al pie, el enlace de texto '¿No tienes cuenta? Regístrate' en cian #27B3FF."
      },
      {
        "name": "Mercados",
        "describe": "Vista principal tras el login. En la parte superior, una barra flotante de 28 px de radio sobre fondo #101C36 al 90 % con borde hairline y sombra: a la izquierda el logotipo (cuadrado 42×42 con degradado cian→azul e icono de gráfico) junto al nombre 'Coin Venture'; a continuación las píldoras de navegación Mercados / Portafolio / Historial / Ajustes, donde la activa se rellena con el degradado y texto blanco y las inactivas usan #1B315C al 50 % con texto #9BA6C6; a la derecha, botón contorneado 'Ajustes', una insignia de usuario con avatar circular o iniciales sobre degradado, nombre y correo, y un botón cuadrado de cerrar sesión. Debajo, el encabezado de sección con el título 'Mercados de Criptomonedas', el subtítulo 'Actualización automática cada 30 segundos' y un botón fantasma 'Actualizar' con icono de refresco. Sigue una fila envolvente de cuatro tarjetas de métrica idénticas (icono en cuadrado de 46 px con fondo cian al 15 %, etiqueta pequeña gris y cifra grande blanca): Cap. Total, Vol. 24h, BTC Dom. y Monedas. Después, una tarjeta de filtros con el buscador 'Buscar por nombre o símbolo' e icono de lupa, y cuatro chips de orden —Nombre, Precio, % 24h, Volumen 24h— donde el seleccionado lleva el degradado y borde cian. El bloque final es la tabla: cabecera en gris claro con las columnas #, Moneda, Precio, 24h %, Cap. Mercado, Volumen y Últimos 7 días, y filas separadas por divisores tenues. Cada fila muestra el índice, el símbolo abreviado en negrita con el par completo debajo en 12 px, el precio formateado en dólares, la variación dentro de una píldora redondeada con fondo del color al 12 % (verde #2ECC71 si sube, rojo #FF5B6A si baja), capitalización y volumen alineados a la derecha, y a la derecha del todo una sparkline de 48 px de alto con trazo del color de la variación y relleno degradado que se desvanece hacia abajo."
      },
      {
        "name": "Detalle de activo y trading",
        "describe": "Ruta /home/markets/:symbol, montada como columna de tarjetas apiladas. Primera tarjeta: cuadrado de 64×64 px con radio 18 px y degradado cian→azul que muestra las tres primeras letras del activo en blanco, y a su derecha el nombre en 24 px semibold con la línea de apoyo 'Datos en vivo y trading' en gris. Segunda tarjeta: la etiqueta 'Precio actual' en 14 px gris, la cifra en 24 px blanca, y bajo ella una fila con la píldora de variación 24 h coloreada (verde o rojo, fondo al 18 %) y el texto 'Rango 24h: mínimo — máximo'. Tercera tarjeta: título 'Gráfico de precio (1h)' y un recuadro interior de 240 px de alto, radio 24 px y fondo #1B315C al 60 %, con la curva de cierres dibujada a todo lo ancho; verde si el último cierre supera al primero, rojo en caso contrario, con relleno degradado bajo la línea y un mensaje 'Sin datos recientes' centrado cuando la serie llega vacía. Cuarta tarjeta: 'Estadísticas del activo' con cuatro filas etiqueta-valor separadas verticalmente (Cap. Mercado, Volumen 24h, Precio Apertura, Dominio estimado). Última tarjeta: 'Trading', con dos píldoras a mitad de ancho cada una —'Comprar' que al activarse se rellena con un degradado verde y 'Vender' con degradado rojo, ambas con animación de 200 ms—, un campo numérico de cantidad, tres filas de resumen (Precio, Total, Disponible) con etiqueta gris a la izquierda y valor blanco semibold a la derecha, y un botón primario ancho que alterna entre 'Comprar' con icono de carrito y 'Vender' con icono de etiqueta. Al confirmar, un snackbar flotante anuncia el resultado y limpia el campo."
      },
      {
        "name": "Portafolio",
        "describe": "Encabezado en tarjeta grande con degradado diagonal de cian al 18 % hacia #16294F al 90 %: título 'Mi Portafolio' en blanco, subtítulo 'Resumen de tus activos y balance' en gris, y el valor total del portafolio en cifra display de 28 px blanca. Bajo la cifra, tres píldoras de igual ancho sobre fondo #1B315C al 60 % con borde hairline y radio 18 px, cada una con un icono en cuadrado de 36 px con fondo cian al 12 %: 'Activos' con el número de posiciones, 'Activo mayor' con el símbolo de mayor saldo, y 'Diversificación' con la etiqueta calculada Concentrado, Balanceado o Diversificado según haya 1, 2-3 o 4 o más activos. Debajo, la sección de balances lista cada moneda con su símbolo, su cantidad y su peso relativo sobre el total. Mientras cargan los datos, la vista es un indicador circular centrado; si falla, una tarjeta con el mensaje de error en rojo #FF5B6A."
      },
      {
        "name": "Historial de operaciones",
        "describe": "Tarjeta de cabecera con el título 'Historial de operaciones' en 20 px, la línea 'Registro completo de tus transacciones' en gris, y una fila de tres estadísticas con icono circular: Operaciones (total), Compras y Ventas. Si aún no hay movimientos, en lugar de la lista aparece una tarjeta de estado vacío con padding generoso: un icono de reloj tachado de 56 px en gris #9BA6C6, el texto 'Sin transacciones aún' en blanco y, debajo, 'Comienza a operar para ver tu historial aquí' en gris pequeño. Cuando hay datos, la lista se muestra en una sola tarjeta con filas separadas por divisores al 40 % de opacidad, cada una con el par operado, el lado de la operación en color (verde compra, rojo venta), la cantidad, el precio y el total formateados como moneda."
      }
    ],
    "visualConcept": "La landing arranca de la semilla del ticker y la lleva al lenguaje real de la app: fondo #0B1220 con el mismo degradado diagonal del `AppColors.appBackground` (#0B1220 → #0E1F3C → #091225) y, encima, una onda SVG de dos trazos cian (#27B3FF al 40 % y #1BD3FF al 15 %) que recorre todo el hero desplazando su atributo de fase con una animación `wave-drift` de 18 s en bucle infinito y easing lineal; la onda no es decorativa, reproduce el mismo trazo redondeado con relleno degradado del 35 % al 5 % que dibuja el CustomPainter `MiniSparkline` del proyecto. Sobre la onda, el título 'Coin Venture' en Poppins semibold con el degradado #1BD3FF → #005CFF aplicado como `background-clip: text`, y bajo él el tagline en #9BA6C6. Inmediatamente debajo del hero corre una cinta de precios infinita de 56 px de alto: una franja de #101C36 al 90 % con borde hairline blanco al 12 %, con los pares reales que la app soporta (BTCUSDT, ETHUSDT, BNBUSDT, SOLUSDT, XRPUSDT, ADAUSDT…) en tipografía tabular, cada uno con su variación en verde #2ECC71 o rojo #FF5B6A dentro de una píldora al 12 % de opacidad; la cinta se duplica en el DOM y se anima con `translateX(0 → -50%)` en 40 s lineales infinitas, se pausa al pasar el cursor por encima y respeta `prefers-reduced-motion` congelándose en su posición inicial. La tercera pieza de la semilla son las velas: la sección de métricas se presenta como un gráfico de barras verticales donde cada dato contable del repositorio (115 archivos, 7.821 líneas, 6 módulos, 16 casos de uso, 8 blocs, 6 plataformas) es una vela con mecha superior e inferior de 2 px; al entrar en viewport, un IntersectionObserver dispara `candle-grow`, una animación de 700 ms con `cubic-bezier(0.22, 1, 0.36, 1)` que escala cada vela desde `scaleY(0)` con origen inferior, escalonada 80 ms entre columnas, mientras la cifra cuenta hacia arriba. La estructura de secciones es: (1) hero con onda, título degradado y dos botones —el primario con el degradado real de `primaryButton`, el secundario fantasma hacia GitHub—; (2) cinta de precios infinita como separador vivo; (3) 'El problema' en dos columnas de texto sobre superficie #16294F al 85 %; (4) 'Muro de velas' con las métricas animadas; (5) 'Arquitectura' con un diagrama de tres carriles apilados (presentation → domain → data) donde al hacer hover en un carril se iluminan en cian los seis módulos que lo atraviesan; (6) 'Pantallas' como carrusel horizontal de mockups con las capturas descritas, cada tarjeta con radio 24 px, borde hairline y sombra negra difusa; (7) 'Retos técnicos' en acordeón, con el problema en gris y la solución revelada en blanco al expandir; (8) 'Stack' como nube de chips idénticos a los chips de orden de la app (radio 16 px, fondo #1B315C al 60 %, borde tenue, y degradado cian→azul en el chip bajo el cursor); y (9) cierre con el enlace al repositorio sobre un fondo donde la onda del hero reaparece invertida. Toda la página respeta la regla cromática del producto: el cian es interacción, el verde y el rojo solo aparecen cuando representan una dirección de mercado, y ninguna otra tonalidad entra en escena.",
    "statusShort": "Google Play",
    "categoryShort": "Fintech",
    "media": []
  },
  {
    "slug": "humbolt",
    "name": "Humbolt MVP",
    "tagline": "ERP de logística multi-rol: cuatro portales sobre una misma API, del despacho en oficina al escaneo del paquete en la calle.",
    "category": "Aplicación web empresarial / ERP de logística y última milla",
    "year": "2026",
    "role": "Desarrollo frontend completo: arquitectura de portales por rol, capa de servicios generada desde OpenAPI, integración con API REST/WebSocket y portal operador móvil",
    "status": "MVP funcional conectado a la API de producción (axiomcoretech.store); build publicado bajo la ruta base /humbolt/, con módulos de inventario, reportes e Intelligence Hub aún fuera del árbol de navegación",
    "summary": [
      "Humbolt MVP —la marca dentro de la interfaz es “HumboltTracking · ERP de Logística”— es una aplicación web React/TypeScript que cubre el ciclo completo de un envío: alta del cliente y del destinatario, creación del envío, generación de la etiqueta con QR, armado de la ruta, escaneo del paquete en cada parada y cierre de la ruta.",
      "Una sola build sirve a cinco roles (`super_admin`, `admin`, `operator`, `client_master`, `client_agency`). El componente raíz `src/app/App.tsx` lee el usuario autenticado, lo mapea a un rol de aplicación y monta uno de cuatro portales distintos: portal supervisor de escritorio, portal operador pensado para el móvil del chofer, portal de cliente master y portal de agencia cliente.",
      "El proyecto arrancó como un bundle de código exportado de Figma Make (el README apunta al archivo original y `ATTRIBUTIONS.md` acredita a shadcn/ui). El trabajo posterior fue sustituir los datos simulados por la API real: un script propio, `gen_services.py`, descarga el `openapi.json` del backend y genera `src/services/types.ts` (98 interfaces y tipos) más los quince servicios que consumen 45 rutas entre REST y WebSocket.",
      "El portal operador es el corazón operativo: obliga a un orden de trabajo —primero foto de evidencia subida al servidor, después escaneo del QR del mismo paquete— usando la cámara trasera del teléfono con `html5-qrcode` y `getUserMedia`, con registro manual de código y peso como respaldo cuando el escáner no lee."
    ],
    "problem": "Una operación logística con oficina, almacén, choferes y clientes corporativos necesita que cada actor vea sólo su parte del mismo dato, y que el evento de la calle llegue al escritorio sin pasar por WhatsApp ni por papel. El supervisor necesita dar de alta clientes, destinatarios, choferes y envíos, y armar rutas con paradas; el chofer necesita, en un teléfono y con una mano, saber qué paradas tiene, dejar constancia fotográfica de la entrega y confirmar paquete por paquete; el cliente corporativo necesita ver sus envíos y sus destinatarios sin acceso al resto del sistema. Sumado a eso, el dominio venezolano impone reglas propias: documentos RIF/NIT y cédula con formato validable, y direcciones en cascada de país → estado → ciudad → municipio → parroquia → zona postal.",
    "solution": "Un frontend único con un shell de portal reutilizable (`PortalShell`) que recibe su propio menú por rol y renderiza la misma cáscara —barra lateral navy de 80 px en escritorio, panel deslizante en móvil— con contenidos distintos. Sobre él se montan ocho módulos de administración (Dashboard, Usuarios, Clientes, Destinatarios, Tipos de Destino, Choferes, Envíos y Rutas), cada uno con búsqueda, filtros, paginación servida por el API y tablas que colapsan a tarjetas en móvil. La comunicación pasa por una instancia de axios con interceptores que inyectan el token, traducen los tres formatos de error del backend a modal o toast, reintentan hasta tres veces con backoff y expulsan la sesión ante un 401. El dashboard escucha eventos en vivo por WebSocket con reconexión exponencial, y el portal operador cierra el circuito subiendo la evidencia por multipart y confirmando el escaneo contra la parada concreta de la ruta.",
    "highlights": [
      {
        "title": "Capa de servicios generada desde el OpenAPI del backend",
        "description": "`gen_services.py` descarga `https://axiomcoretech.store/openapi.json` y escribe `src/services/types.ts` con 98 interfaces y enums más los quince ficheros de servicio. El contrato del frontend deja de escribirse a mano: cuando el backend cambia, se regenera y el compilador señala lo que se rompió.",
        "icon": "FileCode2"
      },
      {
        "title": "Cuatro portales, una sola build",
        "description": "`App.tsx` mapea el usuario de `/users/me` a uno de cinco roles y monta SupervisorPortal, OperatorApp, ClientMasterPortal o ClientAgencyPortal. Los tres portales de escritorio comparten `PortalShell`, `PageHeader` y `ResponsiveDataTable`, así que un módulo escrito para el supervisor —como Destinatarios o Envíos— se reutiliza tal cual en el portal del cliente pasando `isClientUser`.",
        "icon": "Users"
      },
      {
        "title": "Evidencia obligatoria antes del escaneo",
        "description": "En cada parada el operador debe cumplir dos pasos en orden: “1. Tomar foto de evidencia”, que sube la imagen por multipart a `/api/v1/uploads/evidence`, y “2. Escanear paquete”, que permanece deshabilitado hasta que existe una evidencia pendiente. El escaneo confirma contra `/routes/{id}/stops/{id}/scan` el mismo paquete de la foto.",
        "icon": "ScanLine"
      },
      {
        "title": "Dashboard alimentado por WebSocket con reconexión progresiva",
        "description": "`websocket.service.ts` abre `/api/v1/ws/dashboard/live` con el token en la query, distribuye cada evento a los suscriptores y, si la conexión cae, reintenta con un retardo que crece de 3 s a un tope de 30 s multiplicando por 1,5. La UI clasifica los eventos en cuatro tipos (éxito, información, acción requerida, error) con su propio color y glow.",
        "icon": "Radio"
      },
      {
        "title": "Interceptor que traduce tres formatos de error distintos",
        "description": "El interceptor de axios distingue el formato `{ status: 'VALIDATION_ERROR', message, data }`, el `detail` clásico de FastAPI —cadena o lista de `{loc, msg, type}`— y los errores de integridad de base de datos. Un 422 abre modal global; 400, 409 y 500 muestran toast; el 401 limpia la cookie y recarga; el duplicado de correo en PATCH de usuario se deja pasar para que el formulario lo pinte en su propio tooltip.",
        "icon": "ShieldAlert"
      },
      {
        "title": "Etiquetas con QR y comprobantes generados en el cliente",
        "description": "`ShippingLabelGenerator` abre una ventana de impresión con una etiqueta por bulto: número de pieza `GP…​ 1/N`, número referencial derivado del tracking y un QR con `{tracking, reference, piece}` en JSON. El comprobante del envío se arma con jsPDF en el navegador para no depender del PDF del servidor.",
        "icon": "Printer"
      },
      {
        "title": "Rutas con paradas y asignación envío → parada",
        "description": "El módulo de rutas (2.322 líneas) permite crear la ruta con sus paradas por destinatario, editarla, verla en detalle y entrar a una vista de asignación donde cada envío seleccionado elige su parada de descarga; `buildShipmentAssignmentsFromStops` resuelve el `dropoff_stop_id` real que devolvió el servidor.",
        "icon": "Route"
      }
    ],
    "features": [
      "Login por correo y contraseña contra `/api/v1/auth/login`, token guardado en cookie `AUTH_TOKEN` con vencimiento de un día y auto-login al recargar si la cookie sigue viva",
      "Enrutado por rol en el cliente: super admin y admin al portal supervisor, operador al portal móvil, cliente master y agencia a sus portales acotados",
      "Portal supervisor con ocho secciones: Dashboard, Usuarios, Clientes, Destinatarios, Tipos de Destino, Choferes, Envíos y Rutas",
      "Gestión de usuarios con asistente de alta en varios pasos, pantalla de edición, asignación de roles, reseteo de contraseña y filtros por rol y por estado (activo, inactivo, bloqueado, invitado)",
      "Gestión de clientes y de tipos de cliente, con cambio de estado y ficha de detalle",
      "Módulo de destinatarios con flujo de aprobación: direcciones en estado pendiente, aprobada o rechazada, aprobables desde la vista consolidada de agencias",
      "Alta y edición de choferes y de tipos de destino, con activación/desactivación",
      "Creación de envíos con remitente (sucursal de origen), destinatario, tipo de servicio, cantidad de bultos, tipo y descripción de contenido, y peso y valor declarado por bulto",
      "Listado de envíos con búsqueda por código, cliente, origen o destino, filtro de estado, ordenamiento y paginación del servidor",
      "Siete estados de envío con su insignia de color: Pendiente, En Almacén, Aduana, En Tránsito, Entregado, Retrasado y Cancelado",
      "Generación e impresión de etiquetas con QR y número referencial, una por bulto, y previsualización en modal",
      "Comprobante del envío en PDF generado en el navegador con jsPDF",
      "Carga masiva de envíos por archivo CSV/XLSX con zona de arrastre, barra de progreso y validación fila por fila",
      "Gestión de rutas: creación con paradas por destinatario, edición, detalle, eliminación con confirmación y asignación de envíos a paradas concretas",
      "Portal operador: lista de rutas asignadas desde `/routes/driver/me` con código, cantidad de paradas, fecha, chofer y estado (Pendiente, En tránsito, Completada, Cancelada)",
      "Acciones de ruta del operador: “Empezar ruta” y “Completar ruta” contra los endpoints `/routes/{id}/start` y `/routes/{id}/complete`",
      "Captura de evidencia con la cámara trasera del teléfono (`facingMode: environment`, 1280×720) y subida multipart antes de habilitar el escaneo",
      "Escáner QR embebido con `html5-qrcode`, recuadro de escaneo calculado según el ancho de pantalla, y registro manual de código y peso como alternativa",
      "Dashboard en vivo por WebSocket con panel “Estado operativo” (alertas y acciones pendientes) y “Resumen de eventos” de la sesión",
      "Búsqueda global y feed de actividad en el portal supervisor",
      "Portal de cliente master con Dashboard, Usuarios de su compañía, Destinatarios y Envíos; portal de agencia cliente con Dashboard, Destinatarios y Envíos",
      "Validación de documentos venezolanos: RIF/NIT con prefijo J, G, V, E o P y de seis a diez dígitos, cédula con prefijo V o E, rechazo de dígitos todos iguales y limpieza de prefijos duplicados pegados al número",
      "Direcciones en cascada contra el API de localidades: países → estados → ciudades → municipios → parroquias → zonas postales",
      "Modal global de errores de validación alimentado por un servicio de suscripción, más notificaciones toast con Sonner",
      "Interfaz responsive de verdad: tablas que se convierten en tarjetas en móvil, barra lateral que se transforma en panel deslizante y menú hamburguesa"
    ],
    "stack": [
      {
        "group": "Núcleo",
        "items": [
          "React 18.3.1",
          "TypeScript",
          "Vite 6.3.5",
          "@vitejs/plugin-react 4.7.0"
        ]
      },
      {
        "group": "Interfaz y estilos",
        "items": [
          "Tailwind CSS 4.1.12 (@tailwindcss/vite)",
          "Radix UI (28 primitivas: dialog, select, tabs, dropdown-menu, popover, tooltip…)",
          "shadcn/ui (49 componentes en src/app/components/ui)",
          "lucide-react 0.487.0",
          "motion 12.23.24",
          "class-variance-authority 0.7.1",
          "tailwind-merge 3.2.0",
          "tw-animate-css 1.3.8",
          "next-themes 0.4.6",
          "sonner 2.0.3",
          "vaul 1.1.2",
          "cmdk 1.1.1",
          "MUI 7.3.5 + Emotion 11",
          "Inter y JetBrains Mono (Google Fonts)"
        ]
      },
      {
        "group": "Datos y red",
        "items": [
          "axios 1.13.6",
          "axios-retry 4.5.0",
          "js-cookie 3.0.5",
          "WebSocket nativo del navegador",
          "API REST/WebSocket en axiomcoretech.store (OpenAPI)"
        ]
      },
      {
        "group": "Captura y documentos",
        "items": [
          "html5-qrcode 2.3.8",
          "qrcode 1.5.4",
          "qrcode.react 4.2.0",
          "jsbarcode 3.12.3",
          "jspdf 2.5.2",
          "MediaDevices getUserMedia"
        ]
      },
      {
        "group": "Formularios, tablas y gráficos",
        "items": [
          "react-hook-form 7.55.0",
          "react-day-picker 8.10.1",
          "date-fns 3.6.0",
          "input-otp 1.4.2",
          "react-dnd 16.0.1 + react-dnd-html5-backend",
          "recharts 2.15.2",
          "embla-carousel-react 8.6.0",
          "react-resizable-panels 2.1.7",
          "react-responsive-masonry 2.7.1",
          "react-slick 0.31.0"
        ]
      },
      {
        "group": "Pruebas y tooling",
        "items": [
          "Vitest 4.1.2",
          "Testing Library (react, jest-dom, user-event)",
          "happy-dom 20.8.9",
          "gen_services.py (generador OpenAPI → TypeScript)",
          "script QA de rutas del portal operador"
        ]
      }
    ],
    "architecture": "Aplicación de una sola página servida por Vite bajo la ruta base `/humbolt/`, sin router: la navegación es estado de React. `src/main.tsx` monta `src/app/App.tsx`, que resuelve la sesión (cookie `AUTH_TOKEN` + caché de `/users/me`) y, según el rol mapeado por `current-user.service.ts`, renderiza uno de cuatro portales. La capa de presentación se organiza en tres niveles: primitivas de shadcn/ui en `src/app/components/ui` (49 componentes), primitivas de layout propias en `src/app/components/layout` (`PortalShell` para la cáscara con menú, `PageHeader` para el encabezado con acciones, `ResponsiveDataTable` para tablas que degradan a tarjetas en móvil), y módulos de dominio agrupados por carpeta: `admin/` (20 módulos: clientes, destinatarios, sucursales, choferes, tipos de destino, usuarios de cliente, feeds del dashboard), `shipping/` (gestión, formulario, carga masiva, etiquetas), `routes/`, `operator/` (app del chofer, escáner QR, captura de foto) y `client/`. La capa de datos vive en `src/services`: `config/axios.ts` centraliza la instancia con `baseURL` tomada de `VITE_API_URL` —en desarrollo el proxy de Vite reenvía `/api` y `/api/v1/ws` a `axiomcoretech.store`—, inyecta el Bearer desde la cookie, desactiva el `Content-Type` JSON cuando el payload es `FormData` o `Blob`, y aplica la política de errores y reintentos. Los quince servicios restantes y `types.ts` son generados por `gen_services.py` a partir del OpenAPI, de modo que los nombres de método reflejan literalmente el `operationId` del backend. Fuera del eje HTTP, `websocket.service.ts` es un singleton con lista de suscriptores para el feed en vivo, y `validation-error.service.ts` es un bus mínimo de suscripción que permite al interceptor abrir el modal global de validación desde fuera del árbol de React. Las utilidades transversales (`src/utils`) aíslan la lógica pura y comprobable: normalización de paginación, fecha y hora de rutas, mapeo de paradas a asignaciones, validación de documentos, conversión de data URL a `File` y construcción del PDF de comprobante; sobre ellas corren 34 pruebas en seis ficheros con Vitest y happy-dom.",
    "challenges": [
      {
        "problem": "El escáner QR se reiniciaba en cada pulsación de tecla. Como `OperatorApp` vuelve a renderizarse mientras el operador escribe el código o el peso manualmente, los callbacks pasados a `QRScanner` cambiaban de identidad, el efecto de arranque de la cámara se relanzaba y `html5-qrcode` lanzaba “Cannot clear while scan is ongoing” y un AbortError que tumbaba la pantalla.",
        "solution": "Los callbacks se guardan en refs (`onScanCompleteRef`, `onCancelRef`) que se actualizan en un efecto aparte, y el manejador de éxito se estabiliza con `useCallback` sin dependencias. Así el efecto que abre la cámara sólo corre al montar; además un `finishedRef` evita procesar dos lecturas y el cierre detiene y limpia el escáner de forma ordenada."
      },
      {
        "problem": "El backend devuelve errores en tres formas distintas —`{status:'VALIDATION_ERROR', message, data}`, el `detail` de FastAPI (cadena o lista de `{loc,msg,type}`) y errores de integridad de base de datos—, y aplicar una sola política producía o modales de más o mensajes inútiles como “Error 500 del servidor”.",
        "solution": "Un único interceptor de respuesta clasifica: el 422 siempre abre modal; 400, 409 y 500 muestran toast; cuando `data` trae el motivo concreto y `message` es genérico, gana el motivo concreto; el prefijo técnico del 500 sólo se antepone si no hubo mensaje legible del API. Los fallos de `/auth/login` y `/auth/register` se marcan como excepción para que los resuelva el formulario, y el duplicado de correo en PATCH de usuario se deja pasar para pintarse como tooltip en el campo."
      },
      {
        "problem": "El PDF de comprobante generado por el servidor fallaba al serializar modelos ORM anidados (ciudad, país) del destinatario.",
        "solution": "El comprobante se construye en el navegador con jsPDF a partir de los datos ya normalizados del API: `shipment-comprobante-pdf.ts` incluye helpers que extraen el `name` de objetos de localidad, resuelven el código o nombre de la zona postal y traducen los siete estados internos a español antes de dibujar el documento."
      },
      {
        "problem": "Al crear una ruta, las paradas del formulario no tienen todavía identificador; sólo el `POST /routes/` devuelve las paradas reales, y los envíos deben asignarse a un `dropoff_stop_id` concreto del servidor.",
        "solution": "`buildShipmentAssignmentsFromStops` empareja cada parada de la UI con la del servidor primero por posición —validando que coincida el `recipient_id`— y, si no cuadra, buscando por la combinación de `recipient_id` y `stop_number`. Devuelve un resultado tipado `{ok:true, assignments}` o `{ok:false, error}` con un mensaje que nombra la parada problemática, y está cubierto por pruebas unitarias."
      },
      {
        "problem": "Un login lento seguido de un segundo intento dejaba llegar la respuesta vieja y sobrescribía el estado; y los reintentos automáticos de axios convertían un DELETE con 500 en varias peticiones y varios toasts idénticos.",
        "solution": "El formulario de login usa un `AbortController` que cancela la petición anterior más un contador de intento que descarta cualquier respuesta que no sea la del intento vigente. En el interceptor, la lógica de reintento (hasta tres, con backoff de 1 s, 2 s y 3 s) se aplica sólo a errores de red y 5xx y excluye explícitamente el método DELETE."
      },
      {
        "problem": "El proyecto nació como un bundle exportado de Figma Make: pantallas completas pero pobladas con datos simulados y sin contrato con ningún backend.",
        "solution": "Se escribió `gen_services.py`, que descarga el `openapi.json` del backend y emite `types.ts` (98 interfaces y enums) y los servicios; la migración se hizo módulo a módulo sustituyendo el mock por la llamada real, con `normalizePaginationMeta` para tolerar las distintas formas de metadatos de paginación. Quedan aún en el repositorio pantallas heredadas del prototipo (Intelligence Hub, Reportes, Inventario, ShippingModule) que no están enganchadas a ningún menú."
      }
    ],
    "metrics": [
      {
        "value": "4",
        "label": "portales por rol en una sola build"
      },
      {
        "value": "5",
        "label": "roles de usuario soportados"
      },
      {
        "value": "45",
        "label": "rutas de API consumidas (REST + WebSocket)"
      },
      {
        "value": "98",
        "label": "tipos TypeScript generados desde el OpenAPI"
      },
      {
        "value": "20",
        "label": "módulos de administración"
      },
      {
        "value": "49",
        "label": "componentes de interfaz reutilizables"
      },
      {
        "value": "34",
        "label": "pruebas unitarias en 6 ficheros"
      },
      {
        "value": "35.688",
        "label": "líneas de TypeScript/TSX en 139 ficheros"
      }
    ],
    "brand": {
      "primary": "#003153",
      "secondary": "#004C7A",
      "accent": "#10B981",
      "bg": "#F8F9FA",
      "surface": "#FFFFFF",
      "text": "#003153",
      "gradient": "linear-gradient(135deg, #003153 0%, #004C7A 50%, #003153 100%)",
      "mood": "Institucional y sobrio: azul marino profundo como color de mando —barra lateral, encabezados, títulos— y un verde esmeralda que se reserva para lo que está vivo o confirmado: el estado activo del menú, la insignia de “Entregado”, el botón de escanear, el anillo de foco. Todo respira sobre un gris casi blanco, con tipografía Inter para el texto y JetBrains Mono para códigos de seguimiento, pesos y correos. Es la estética de un panel de control serio, no de una app de consumo.",
      "source": "/Users/macbook/axiom_humbolt/src/styles/theme.css (variables reales --navy-blue #003153, --navy-blue-light #004c7a, --navy-blue-dark #001d30, --emerald-green #10B981, --emerald-light #34D399, --emerald-dark #059669, --soft-slate #F8F9FA); el degradado es el del fondo real del login en /Users/macbook/axiom_humbolt/src/app/components/LoginScreen.tsx y las tipografías provienen de /Users/macbook/axiom_humbolt/src/styles/fonts.css"
    },
    "links": {},
    "uiScreens": [
      {
        "name": "Login — HumboltTracking",
        "describe": "Pantalla completa con degradado diagonal a 135° de #003153 → #004C7A → #003153 y contenido centrado en una rejilla de dos columnas (una sola en móvil), ancho máximo 1152 px y separación de 32 px. Columna izquierda, todo en blanco sobre el azul: bloque de marca con un cuadrado de 64×64 px de fondo blanco al 10% con desenfoque de fondo y esquinas de 12 px que contiene el icono de paquete a 40 px; a su derecha “HumboltTracking” en 36 px bold y debajo “ERP de Logística” en 14 px al 80% de opacidad. Más abajo, el titular “Sistema de Gestión de Envíos” en 24 px semibold y un párrafo de 18 px con interlineado holgado sobre gestión de envíos, tracking en tiempo real y control operacional multi-rol. Cierra con dos tarjetas translúcidas (blanco al 10%, desenfoque, esquinas de 8 px, 16 px de relleno) en rejilla 2×1: “100% / Trazabilidad” y “24/7 / Monitoreo”, con la cifra en 30 px bold. Columna derecha: tarjeta blanca de 32 px de relleno con sombra pronunciada; título “Iniciar Sesión” en 24 px bold color #003153, subtítulo gris “Ingresa tus credenciales para acceder al sistema”, campo “Correo Electrónico” con marcador usuario@ejemplo.com y campo “Contraseña” mostrando puntos, ambos de 44 px de alto, con un botón de ojo (abierto/tachado) anclado al borde derecho del segundo. Ante un fallo aparece encima del botón una franja rojo pálido con borde rosado, icono de alerta y el texto “Credenciales incorrectas o error en el servidor…”. El botón ocupa todo el ancho, 44 px de alto, fondo #003153 que oscurece a #004C7A al pasar el cursor, y alterna entre “Iniciar Sesión” e “Iniciando sesión...”."
      },
      {
        "name": "Dashboard del supervisor — centro de comando en vivo",
        "describe": "Barra lateral fija de 80 px en #003153 a la izquierda: arriba un cuadrado verde #10B981 de 40 px con el icono de paquete en blanco; debajo, ocho botones cuadrados de 48 px con iconos de línea (panel, usuarios, círculo de usuario, edificio, ramificación, camión, paquete, mapa), el activo con fondo verde sólido y los demás en blanco al 60% que se aclara al pasar el cursor, cada uno con una etiqueta emergente oscura que se despliega hacia la derecha; al pie, el botón de salida que se tiñe de rojo al hover. El área principal, sobre un fondo #F8F9FA con 32 px de aire, abre con tres manchas de color muy difuminadas y fuera de foco —esmeralda arriba a la derecha, azul marino al 7% a la izquierda, cian abajo— que dan profundidad sin ruido. Encima de ellas, una píldora esmeralda pálida con borde verde y un punto que late (“ping”) junto a la palabra EN VIVO en versalitas; luego el título “Dashboard” de hasta 36 px en degradado de texto de #003153 a #0A5F7C, y la bajada “Centro de comando operacional en tiempo real”. El bloque siguiente es el feed en vivo, dos tarjetas de cristal (blanco al 80% con desenfoque) de al menos 320 px de alto: a la izquierda “Estado operativo”, enmarcada por un borde degradado esmeralda→teal→cian de 1 px y con dos halos difusos internos, que cuando no hay alertas muestra un círculo de 88 px con degradado esmeralda, anillo blanco y un tilde blanco de 44 px que se balancea despacio ±4° en bucle de seis segundos, con el texto “Todo al día”; a la derecha “Resumen de eventos”, con el contador de eventos de la sesión y una cuadrícula de cuatro contadores por tipo —éxito en esmeralda, información en celeste, acción requerida en ámbar, error en rojo—, cada uno con su icono y su resplandor. Debajo ocupa el resto de la altura el feed de actividad, que en estado vacío muestra su propio icono de bandeja centrado. Todo entra con un escalonado: opacidad 0 → 1 y 16 px de desplazamiento vertical, curva (0.22, 1, 0.36, 1) en 450 ms."
      },
      {
        "name": "Gestión de Envíos — listado y filtros",
        "describe": "Encabezado de página con “Gestión de Envíos” en 24 px semibold #003153, la bajada “Control centralizado de operaciones de envío” en gris, y a la derecha el botón azul marino “Nuevo Envío” con icono de suma (a ancho completo en móvil). Debajo, una tarjeta blanca de 16 px de relleno con la fila de filtros: un buscador que ocupa el espacio libre con icono de lupa dentro del campo y el marcador “Buscar por código, cliente, origen o destino...”, un desplegable de estado de 200 px con icono de embudo (Todos, Pendiente, Almacén, Aduana, En tránsito, Entregado, Retrasado) y un desplegable de orden con icono de flechas (Más recientes, Por estado, Por cliente). Sigue la tabla dentro de otra tarjeta, con siete columnas: Código de Seguimiento (icono de paquete + el código en JetBrains Mono), Cliente (icono de usuario), Ruta (icono de pin y “origen → destino”), Peso en monoespaciada, Estado como insignia de color —gris Pendiente, azul En Tránsito, verde sólido Entregado, amarillo Retrasado, rojo Cancelado, morado En Almacén, naranja Aduana—, Entrega Estimada con icono de calendario y Última Actualización en gris. Las filas entran animadas desde 12 px abajo, se resaltan con un gris muy tenue al pasar el cursor y son clicables para abrir el detalle; las columnas de peso, entrega y actualización se ocultan en móvil, donde cada envío se convierte en una tarjeta con pares etiqueta/valor. Al pie, paginación numerada y, mientras carga, filas esqueleto con el mensaje “Cargando envíos…”."
      },
      {
        "name": "Portal Operador — parada de ruta (foto y escaneo)",
        "describe": "Vista pensada para una mano y pantalla pequeña: columna centrada de 512 px como máximo sobre un degradado vertical suave de #F0F4F8 a #F8F9FA. Cabecera adherida al borde superior en #003153 con sombra: cuadrado de 40 px al 10% de blanco con icono de camión, el título “HumboltTracking” y debajo “Portal Operador” en 11 px; a la derecha el nombre del operador con icono de usuario y el botón de salida; en móvil el nombre baja a una franja propia separada por una línea. Debajo, un botón fantasma “← Volver a rutas”, y una tarjeta azul marino con el código de la ruta en monoespaciada de 18 px, los botones secundarios “Empezar ruta” / “Completar ruta” según el estado, una insignia con el total de paquetes, y las paradas y direcciones concatenadas con icono de pin. El bloque central es la instrucción en una caja gris de borde tenue: “Paso 1: foto de evidencia. Paso 2: escanear o registrar el código del mismo paquete.”, con los rótulos de paso en negrita azul. Bajo ella, dos botones-tarjeta de al menos 72 px de alto, en una columna en móvil y dos en tableta: el primero azul marino #003153 con un cuadrado interno de 44 px al 15% de blanco y el icono de cámara, titulado “1. Tomar foto de evidencia” y con subtexto dinámico (“Foto lista · escanea el paquete” o “N foto(s) enviada(s)”); el segundo verde #10B981 con icono de QR, titulado “2. Escanear paquete” y subtexto contador “3 / 8 registrados”, atenuado al 50% y sin respuesta mientras no exista una foto pendiente. El botón activo se marca con un anillo de 2 px y separación, y al pulsar se hunde ligeramente (escala 0,98). Cuando hay evidencia subida aparece una tira verde pálida con la miniatura de 56 px, el texto “Foto lista — escanea el paquete” y un botón “Cambiar”. Al abrir la cámara, una tarjeta de borde azul de 2 px muestra el visor, o un aro giratorio con “Subiendo foto de evidencia…”. Al abrir el escáner, el visor de html5-qrcode con recuadro de escaneo verde translúcido y, justo debajo, una tarjeta blanca “Registro manual” con campos de código y peso para cuando el QR no lee. Cierra la pantalla el botón “Completar Parada”."
      },
      {
        "name": "Asignar Envíos a Ruta",
        "describe": "Pantalla de trabajo del supervisor dentro del módulo de rutas. Encabezado con “Asignar Envíos a Ruta” y la bajada “{nombre de la ruta} - Selecciona envíos y asígnalos a paradas específicas”; a la derecha, el botón verde #10B981 con tilde que rotula en vivo “Asignar N Envío(s) a Paradas” —deshabilitado mientras no hay selección— y un botón “Cancelar” de contorno. Debajo, una tarjeta con el título “Paradas de la Ruta” junto a un pin azul y las paradas como insignias de contorno en fila envolvente; cada insignia que ya recibió envíos muestra pegada a su derecha una pastilla verde con el contador “+2” en monoespaciada. Sigue la tarjeta grande de 24 px de relleno: buscador con lupa y marcador “Buscar envíos por código o destino...”, y bajo él la lista de envíos sin asignar como filas de 16 px de relleno con borde de 1 px y esquinas redondeadas. Cada fila abre con una casilla cuadrada de 20 px con borde de 2 px que al marcarse se rellena de azul marino con un tilde blanco, y toda la fila pasa a borde #003153 con fondo azul al 5%; a continuación el código de seguimiento en monoespaciada con una insignia de peso al lado y, en gris pequeño, el cliente y el trayecto “origen → destino” precedido de un pin. Al seleccionar, se despliega a la derecha de la fila un desplegable de 256 px para elegir la parada de descarga de ese envío. Si no queda nada por asignar, el cuerpo muestra un icono de paquete de 48 px centrado en gris y el texto “No hay envíos disponibles para asignar”."
      }
    ],
    "visualConcept": "Semilla: rejilla isométrica de módulos que se ensamblan al hacer scroll, azul institucional. Desarrollo para Humbolt: la landing se construye como un plano isométrico —proyección a 30°, transform: rotateX(55deg) rotateZ(-45deg)— sobre el que ocho losas representan los ocho módulos reales del portal supervisor (Dashboard, Usuarios, Clientes, Destinatarios, Tipos de Destino, Choferes, Envíos, Rutas). PALETA: fondo #F8F9FA en las secciones claras y #003153 en las oscuras; las losas son planos #FFFFFF con canto lateral en #004C7A y sombra proyectada de azul marino al 8%; el hilo conductor —la línea que recorre la rejilla como si fuera un paquete viajando— es #10B981, y sólo lo confirmado se pinta de verde: el resto vive en la gama del azul. Los acentos secundarios se toman de los estados reales del sistema (ámbar #F59E0B para acción requerida, celeste #0EA5E9 para información, rojo #EF4444 para error), usados con moderación en la sección de eventos en vivo. ESTRUCTURA DE SECCIONES: (1) Héroe a pantalla completa con el degradado real del login (135°, #003153 → #004C7A → #003153), el nombre “Humbolt MVP” en Inter bold, la bajada “ERP de logística multi-rol” y, a la derecha, la rejilla isométrica todavía desarmada: las ocho losas flotan separadas 200 px en el eje Z, semitransparentes, girando muy lentamente; dos contadores tipo cristal reproducen las tarjetas “100% Trazabilidad / 24/7 Monitoreo” del login real. (2) “El problema”, sobre fondo claro, con la rejilla ya visible pero rota: las losas separadas, algunas volteadas, líneas punteadas grises que no conectan. (3) “Cuatro portales, una build”: al entrar en viewport las losas se ensamblan —cada una interpola su translateZ de 200 px a 0 y su opacidad de 0,3 a 1, escalonadas 80 ms entre sí, con la curva cubic-bezier(0.22, 1, 0.36, 1) de 450 ms que ya usa el dashboard real— hasta formar un tablero continuo; sobre él se levantan cuatro columnas de altura distinta rotuladas Supervisor, Operador, Cliente Master y Agencia. (4) “El recorrido de un paquete”: un punto esmeralda con estela recorre la rejilla de losa en losa siguiendo el ciclo real —alta de cliente → destinatario → envío → etiqueta QR → ruta → parada → foto → escaneo → entregado—; el scroll controla su posición y cada losa que pisa se ilumina y despliega en su cara superior la insignia de estado correspondiente con los colores reales (Pendiente gris, En Almacén morado, En Tránsito azul, Entregado verde sólido). (5) “Datos en vivo”, sección oscura en #003153 donde la rejilla se ve desde más arriba y cuatro haces de luz —esmeralda, celeste, ámbar y rojo— caen sobre ella al ritmo de los cuatro tipos de evento del WebSocket, con un punto que late replicando el indicador EN VIVO. (6) “Bajo el capó”: la rejilla se desmonta en capas separadas verticalmente y etiquetadas —primitivas UI, layout, módulos de dominio, servicios generados, API— con la línea esmeralda atravesándolas de arriba abajo. (7) Métricas: las ocho cifras contables aparecen como bloques isométricos que se elevan desde el plano con un contador numérico que sube. (8) Cierre sobre el degradado del héroe con la rejilla completa, quieta y compacta. ANIMACIONES CONCRETAS: ensamblaje por translateZ + opacidad escalonada al entrar en viewport; parallax suave de la rejilla (el plano se inclina ±3° siguiendo el cursor); el punto viajero animado con offset-path sobre un trazado SVG; halos difuminados de 380/280/200 px con blur de 48 px que se desplazan lentamente en el fondo, calcados de los del dashboard real; texto en degradado #003153 → #0A5F7C para los titulares; y respeto estricto de prefers-reduced-motion, donde el ensamblaje se sustituye por un fundido y la rejilla se muestra ya montada. Tipografía: Inter para todo el texto y JetBrains Mono para códigos, cifras y etiquetas técnicas, igual que en el producto.",
    "statusShort": "En producción",
    "categoryShort": "Software empresarial",
    "media": []
  },
  {
    "slug": "joyeria",
    "name": "Sistema Administrativo Joyería",
    "tagline": "Una sola app para la joyería: taller, inventario de metales, ventas, catálogo público y tienda del cliente.",
    "category": "Aplicación web multi-rol (ERP vertical + e-commerce)",
    "year": "2026",
    "role": "Desarrollo frontend en equipo (React + TypeScript): 129 de los 246 commits del repositorio; el resto es de un segundo desarrollador.",
    "status": "En desarrollo activo con despliegue a producción: `.env.production` apunta a https://sandracanizarezapp.store con versión `/prod`, hay carpeta `build/` generada y un `.htaccess` de reescritura SPA para Apache. Último commit: 11-06-2026.",
    "summary": [
      "Frontend completo del sistema administrativo de la joyería Sandra Cañizarez (Cúcuta, Colombia): un único SPA en React + TypeScript que sirve simultáneamente a seis roles — admin general, administrador de joyería, vendedor, joyero, cliente y usuario — con un árbol de rutas distinto para cada uno.",
      "No es sólo un panel: incluye la landing pública de la marca (con vídeo de portada, colecciones traídas del API y reseñas), el catálogo público, la tienda con carrito y checkout para el cliente, y el panel de trabajo del joyero con sus órdenes por estado.",
      "El núcleo administrativo cubre ventas de stock y órdenes personalizadas, inventario de materiales (metales por quilataje, piedras, componentes), préstamos externos, clientes, catálogo, notificaciones y configuración de la joyería (cuentas bancarias, empleados y roles, categorías, facturación con logo y firma digital).",
      "Todo el estado del negocio vive en un backend REST propio: 25 módulos de servicio en el front consumen 106 rutas de API distintas, más un WebSocket global para el chat entre cliente, vendedor y joyero.",
      "La capa visual combina Tailwind CSS v4 con tokens de marca propios (burdeos y oro) y una biblioteca de 53 componentes base sobre primitivas de Radix UI."
    ],
    "problem": "Una joyería con taller propio mezcla operaciones que ningún ERP genérico modela bien: el precio de cada pieza depende de la cotización del oro y de la TRM del día, el inventario no se cuenta en unidades sino en gramos de oro 18K, plata 925 o quilates de piedra, y una venta puede ser una orden hecha a mano por un joyero interno con anticipo, medidas y fotos de referencia. A eso se suma que en el negocio conviven perfiles con permisos y necesidades opuestos —el dueño, el vendedor de mostrador, el joyero del taller y el cliente final que compra en línea— y que cada uno necesitaba antes una herramienta distinta: WhatsApp para hablar con el cliente, hojas de cálculo para el inventario y una tienda separada para vender.",
    "solution": "Un solo SPA en React + TypeScript que decide en tiempo de arranque, a partir del rol guardado en `localStorage`, cuál de los cuatro árboles de rutas monta, reutilizando el mismo layout (`FooterHeaderSidebar`) y el mismo proveedor de chat global. Sobre esa base se construyeron los módulos verticales del negocio: inventario por tipo de material con recálculo en cascada de precios cuando cambia la cotización del metal, ventas divididas en stock y órdenes a medida con asignación de joyero y vendedor, panel de taller con tabs por estado de orden, tienda del cliente con carrito y checkout, y una landing pública que se alimenta de las categorías y productos reales del API. El chat vive por encima de todas las pantallas con una única conexión WebSocket por usuario, para que la burbuja de mensajes no dependa de estar dentro del chat.",
    "highlights": [
      {
        "title": "Seis roles, un solo bundle",
        "description": "`App.tsx` traduce el `rol` numérico del backend (1 a 6) a admin general, admin, vendedor, joyero, cliente o usuario, y monta el árbol de `<Route>` correspondiente: 29 declaraciones de ruta sobre 17 rutas únicas, compartiendo layout, chat y modales de mensajes.",
        "icon": "Users"
      },
      {
        "title": "Chat en vivo con un único WebSocket global",
        "description": "`useGlobalChatSocket` abre una sola conexión `wss://…/ws/chat/` por usuario, con keepalive de ping cada 30 s y reconexión con backoff exponencial de 1 s a 30 s; el provider combina el contador REST persistente, el evento `unread_update` y las notificaciones para que ningún mensaje se pierda.",
        "icon": "MessageCircle"
      },
      {
        "title": "Inventario que entiende de metales",
        "description": "Los materiales se registran como metal (con quilataje), piedra (con quilates, color y pureza), componente u 'otros', con movimientos, préstamos externos y un ticker que muestra oro 24K/18K/14K/10K, plata pura/950/925, platino y paladio junto a la TRM del día.",
        "icon": "Package"
      },
      {
        "title": "Taller y órdenes a medida",
        "description": "El módulo de órdenes personalizadas captura cliente, joyero asignado, prenda, material del inventario, medidas, peso, mano de obra, anticipo y fotos de referencia recortadas en el navegador; el joyero ve las mismas órdenes en su panel separadas en pendientes, en progreso y completadas.",
        "icon": "Hammer"
      },
      {
        "title": "Escaparate público y tienda del cliente",
        "description": "La landing y el catálogo públicos consumen categorías y productos reales del API, y el cliente registrado entra a una tienda con buscador, filtros por joyería, material, género y rango de precio, vista en grilla o lista, carrito, checkout y seguimiento de sus órdenes y compras.",
        "icon": "Store"
      }
    ],
    "features": [
      "Landing pública de marca con marquesina de anuncios, vídeo de portada, círculos de colecciones, banners, pestañas de destacados por categoría, sección de personalización, reseñas y botón flotante de WhatsApp",
      "Catálogo público navegable sin sesión y detalle de producto compartible por URL (`/producto/:id`)",
      "Registro, inicio de sesión y flujo completo de recuperación de contraseña en cuatro pasos (solicitud, código, verificación, cambio)",
      "Dashboard con ventas del mes, total de órdenes, órdenes pendientes, clientes nuevos, tendencia de ventas, productos más vendidos, notificaciones y órdenes recientes",
      "Ventas de stock y órdenes personalizadas con detalle, asignación de vendedor, cancelación y exportación",
      "Inventario de materiales con altas, movimientos, préstamos externos con pagos, y sincronización de precios de productos frente a la cotización del metal",
      "Ticker animado de precios de metales preciosos y TRM en la cabecera del sistema",
      "Gestión de clientes con estadísticas y pestañas de órdenes y ventas por cliente",
      "Catálogo interno de productos con imágenes múltiples, materiales, garantía, stock y destacados",
      "Configuración de la joyería: cuentas bancarias, categorías de joyería, empleados y roles, alianzas entre joyerías, formato de factura, logo y firma digital",
      "Panel del joyero con estadísticas de pendientes, activas y completadas, y avance de cada orden",
      "Tienda del cliente con filtros combinables, slider de rango de precio, carrito multi-joyería y checkout",
      "Chat por orden y por venta, con burbuja de no leídos, aviso en vivo y lista de conversaciones pendientes",
      "Centro de notificaciones con filtros, prioridad y marcado de leídas",
      "Recorte de imágenes en el navegador antes de subirlas (producto, logo, firma digital)",
      "Exportación de ventas, órdenes y stock desde el API",
      "Panel de administrador general para dar de alta joyerías, categorías globales y compartición de catálogo entre aliadas"
    ],
    "stack": [
      {
        "group": "Base",
        "items": [
          "React 18.3",
          "TypeScript",
          "Vite 6",
          "@vitejs/plugin-react-swc",
          "react-router-dom 7"
        ]
      },
      {
        "group": "UI y estilos",
        "items": [
          "Tailwind CSS v4 (@tailwindcss/vite)",
          "Radix UI (26 primitivas: dialog, tabs, select, popover, sheet…)",
          "lucide-react",
          "class-variance-authority",
          "tailwind-merge",
          "clsx",
          "sonner",
          "vaul",
          "cmdk",
          "next-themes"
        ]
      },
      {
        "group": "Formularios y datos",
        "items": [
          "axios",
          "react-hook-form",
          "react-select",
          "react-day-picker",
          "input-otp",
          "react-easy-crop",
          "recharts",
          "embla-carousel-react",
          "react-resizable-panels"
        ]
      },
      {
        "group": "Integración",
        "items": [
          "API REST propia (VITE_PUBLIC_URL_API + VITE_PUBLIC_URL_VERSION)",
          "WebSocket `/ws/chat/` con token por query param",
          "Proxy `/image-proxy` en el dev server de Vite",
          "Despliegue estático con `.htaccess` de reescritura SPA"
        ]
      }
    ],
    "architecture": "SPA por capas dentro de `src/`. `App.tsx` es el orquestador: lee token y rol de `localStorage`, expone un `AuthContext` global (usuario, joyería, carrito, estadísticas de notificaciones, modal de mensajes) y elige uno de cuatro árboles de rutas —joyero, cliente/usuario, administrativo y público— todos envueltos por `FooterHeaderSidebar` y por `ChatNotificationsProvider`. Las pantallas viven en `src/pages-routes/` (21 carpetas) y delegan la lógica en módulos de dominio dentro de `src/components/<Modulo>/`, cada uno con la misma estructura: `interfaces/`, `functions/`, `modals/`, `ui/` y un contexto propio (`InventoryContext`, `SalesContext`, `ClientsContext`, `SettingsContext`, `CatalogContext`). Toda la comunicación con el backend pasa por `src/components/service/`, 25 carpetas de servicios tipados que usan un único `apiAxios` con baseURL de entorno, `Accept-Language: es-ES`, selección automática entre JSON, `multipart/form-data` y `x-www-form-urlencoded` según el payload, toast de carga y un interceptor de respuesta que ante un 401 emite el evento `auth:unauthorized` en `window`. La capa de presentación reutiliza 53 componentes base tipo shadcn/ui sobre Radix en `src/components/ui/`, y la paleta de marca se define una sola vez en `src/styles/brand.css` y se registra como tokens de Tailwind en `src/index.css` con `@theme inline`, de modo que cambiar el burdeos cambia toda la app.",
    "challenges": [
      {
        "problem": "Seis roles con navegación, permisos y pantallas incompatibles dentro de una misma aplicación, sin duplicar layout ni proveedores.",
        "solution": "El rol numérico del backend se traduce a un literal de unión tipado (`UserRole`) y `App.tsx` monta un `<Routes>` distinto por familia de rol, con `<Route path=\"*\">` que redirige al home propio de cada uno; el layout, el chat y el ticker de metales se comparten y sólo cambian los `navItems`, filtrados por rol en `FooterHeaderSidebar`."
      },
      {
        "problem": "La sesión puede expirar en cualquiera de las 106 llamadas al API, y cada pantalla no podía encargarse de detectarlo.",
        "solution": "El interceptor de respuesta de axios centraliza el caso: ante un 401 despacha un evento `auth:unauthorized` en `window`; `App.tsx` lo escucha, muestra el modal de sesión expirada, limpia token y rol de `localStorage` y redirige a `/iniciar`."
      },
      {
        "problem": "El backend cierra la conexión anterior si un usuario abre una segunda: no podía haber un WebSocket por pantalla de chat, pero la burbuja de no leídos debía actualizarse estando en cualquier módulo.",
        "solution": "Una sola conexión montada a nivel de app en `ChatNotificationsProvider`, con `useGlobalChatSocket` (ping cada 30 s, backoff exponencial de 1 s a 30 s y resincronización al reconectar) que combina tres capas: contador REST persistente, evento `unread_update` en vivo y notificaciones almacenadas; si la conversación está abierta se marca leída en vez de avisar."
      },
      {
        "problem": "El precio de venta depende de la cotización del oro y de la TRM, así que al cambiar la tasa quedaban desalineados cientos de productos y materiales.",
        "solution": "Endpoints de sincronización disparables desde la interfaz (`config/metals/sync-prices-cascade/` y `stocktaking/{joyería}/product/sync-prices/`) más un historial de tasas y un ticker permanente con oro 24K a 10K, plata, platino y paladio para que el vendedor vea siempre la referencia vigente."
      },
      {
        "problem": "Las fotos de producto, logos y firmas digitales llegaban con encuadres y pesos dispares, y las imágenes servidas por el backend rompían por CORS en desarrollo.",
        "solution": "`ImageCropperModal` recorta en el navegador con `react-easy-crop` y vuelca el resultado a un canvas antes de subirlo; en desarrollo un proxy `/image-proxy` en `vite.config.ts` reescribe las peticiones al dominio del API, y `ImageWithFallback` cubre las imágenes que aun así fallan."
      }
    ],
    "metrics": [
      {
        "value": "44.782",
        "label": "líneas de TypeScript/TSX en src/"
      },
      {
        "value": "224",
        "label": "archivos .ts y .tsx"
      },
      {
        "value": "106",
        "label": "rutas de API consumidas"
      },
      {
        "value": "25",
        "label": "módulos de servicio"
      },
      {
        "value": "6",
        "label": "roles de usuario"
      },
      {
        "value": "17",
        "label": "rutas de navegación"
      },
      {
        "value": "53",
        "label": "componentes UI base"
      },
      {
        "value": "246",
        "label": "commits en el repositorio"
      }
    ],
    "brand": {
      "primary": "#8d0101",
      "secondary": "#5e0101",
      "accent": "#b8893b",
      "bg": "#f7f2ec",
      "surface": "#ffffff",
      "text": "#2b2424",
      "gradient": "linear-gradient(135deg, #e6c374, #b8893b)",
      "mood": "Joyería clásica colombiana: burdeos profundo de terciopelo, oro cálido, crema de vitrina y tinta parda; elegante, cálido y ligeramente señorial, con el dorado reservado para lo que debe brillar.",
      "source": "src/pages-routes/landing/Landing.css y src/pages-routes/login/Login.css (:root --burgundy #8d0101, --burgundy-dark #5e0101, --gold #b8893b, --gold-soft #c9a24b, --ink #2b2424, --cream #f7f2ec, --line #e7ddd2); tokens de sistema en src/styles/brand.css (--brand-strong #8b0000, --brand-soft #4a0e0e, --cream #f7f2ec) registrados como utilidades Tailwind en src/index.css. El degradado es el del botón dorado `.landing-btn-gold`."
    },
    "links": {},
    "uiScreens": [
      {
        "name": "Landing pública de la joyería",
        "describe": "Página blanca de una sola columna ancha. Arriba del todo, una franja burdeos #8d0101 de unos 34 px con texto blanco pequeño que se desplaza en marquesina infinita ('Personaliza tus prendas a tu estilo', 'Envío gratis en compras superiores a $500.000 COP'…), separando cada frase con un punto medio dorado. Debajo, cabecera blanca translúcida y pegajosa (rgba(255,255,255,.96)) con el logotipo a la izquierda, menú central en tinta #2b2424 (Inicio · Colecciones · Destacados · Personaliza · Reviews) que pasa a burdeos al hacer hover, y a la derecha los enlaces 'Catálogo' e 'Iniciar sesión' con icono de usuario. El hero ocupa casi toda la ventana: vídeo en bucle a pantalla completa con un degradado vertical oscuro encima (rgba(20,6,6,.35) → .15 → .55), titular serif blanco en dos líneas ('Descubre el Brillo' / 'de lo Inolvidable', la segunda en dorado crema #f6e4c4) y una bajada blanca de una frase. Sigue una banda crema #f7f2ec con el eslogan centrado en dos líneas ('Joyería Cúcuta · Colombia — Oro, Piedras preciosas'). Luego una fila de círculos de colección: fotos recortadas en círculo con el nombre de la categoría debajo, traídas del API. A continuación, tres banners rectangulares de igual alto con foto de fondo, oscurecidos al pasar el ratón, con título blanco y el enlace 'Ver Colección →'. La sección de destacados abre con un antetítulo dorado en versalitas y un titular serif; debajo, pestañas tipo píldora con borde fino que al activarse se rellenan de burdeos con texto blanco, y una rejilla de cuatro tarjetas de producto (foto en proporción vertical, categoría en gris pequeño, nombre y precio en negrita; mientras cargan, un esqueleto con brillo que barre de derecha a izquierda). Después, una sección de fondo fotográfico oscurecido con el titular 'Diseña tu propia joya' y un botón con degradado dorado (linear-gradient(135deg,#e6c374,#b8893b)) que abre WhatsApp. Cierran cuatro tarjetas de personalización, una rejilla de tres reseñas de Google con estrellas doradas, insignia verificada y avatar con iniciales, y un footer burdeos con logo blanco, datos de la joyería, redes y dirección de Cúcuta. Botón flotante circular de WhatsApp abajo a la derecha con anillo pulsante."
      },
      {
        "name": "Dashboard del administrador",
        "describe": "Vista móvil-primero sobre fondo crema. Cabecera burdeos pegajosa con botón de menú hamburguesa a la izquierda, nombre de la joyería y, justo debajo, un ticker blanco de 24 px que desliza de derecha a izquierda los precios: punto de color por metal (dorado, plateado, gris platino), etiqueta 'Oro 24K', 'Plata 925', 'Platino'… y su valor formateado en pesos, separados por barras verticales finas; el desplazamiento se pausa al pasar el ratón. El contenido son tarjetas blancas con esquinas de 10 px y borde izquierdo grueso de 4 px de color: amarillo para 'Ventas Mes' (icono de dólar, cifra grande y porcentaje en verde o rojo), verde para 'Total Órdenes', azul para 'Órdenes Pendientes' y morado para 'Clientes' con el conteo de nuevos en morado pequeño; en móvil van en dos columnas, en escritorio en cuatro. Sigue la tarjeta 'Tendencia de Ventas' con un gráfico de líneas de Recharts sobre rejilla punteada gris, línea amarilla #EAB308 de 2 px y ejes en gris. Después 'Productos Más Vendidos': lista de barras de progreso finas y redondeadas en degradado de ámbares (#EAB308, #F59E0B, #D97706, #B45309, #92400E) con nombre a la izquierda y porcentaje a la derecha. Luego 'Notificaciones': filas con fondo tenue y borde izquierdo rojo, amarillo o azul según prioridad y un punto azul al final. 'Órdenes Recientes' muestra filas gris muy claro con el SKU y una insignia de estado (verde 'Entregado', azul 'En proceso', amarillo pendiente). Cierra una tarjeta con degradado amarillo horizontal, título negro 'Acciones Rápidas' y botones negros con texto amarillo ('Nueva Venta/Orden', 'Ver Inventario'). Cuando una sección está vacía, aparece un recuadro con icono gris grande y un texto tipo 'Sin órdenes…'."
      },
      {
        "name": "Tienda del cliente",
        "describe": "Encabezado con 'Catálogo de joyeria' y bajada gris. Debajo, una tarjeta de filtros: buscador con lupa a la izquierda y anillo amarillo al enfocar, selector de categoría, y un botón 'Filtros' que al activarse se tiñe de amarillo claro y muestra un contador circular amarillo con el número de filtros activos; a la derecha, un grupo de dos botones con borde compartido para alternar entre vista de rejilla y vista de lista. Al pulsar 'Filtros' se despliega con transición de alto y opacidad una fila de selectores (Joyería, Material, Género, Ordenar por precio) y, bajo una línea divisoria, un slider de rango de precio con el valor actual en burdeos a la derecha y los extremos en gris pequeño. La rejilla es de una a cuatro columnas según el ancho: tarjetas blancas con foto en proporción 4:3 que al pasar el ratón hace zoom hasta 2,5× con un velo negro al 10 %, insignia amarilla 'Destacado' con estrella arriba a la izquierda, botón blanco circular con icono de ojo que aparece arriba a la derecha, y un velo negro al 50 % con insignia roja 'No Disponible' cuando no hay stock. Bajo la foto, nombre de la pieza, joyería, precio y botón de añadir al carrito. La cabecera de sección muestra a la derecha el total de productos, y los estados de carga y vacío son tarjetas centradas a ancho completo."
      },
      {
        "name": "Panel de trabajo del joyero",
        "describe": "Pantalla deliberadamente escueta: título 'Mi Panel de Trabajo' con la bajada 'Gestiona tus órdenes y comisiones'. Debajo, tres tarjetas blancas con borde izquierdo de 4 px y un cuadrado redondeado de 40 px con icono a la izquierda: amarillo con reloj para 'Pendientes', azul con caja para 'Órdenes Activas' y morado con flecha de tendencia para 'Completadas', cada una con la etiqueta gris pequeña arriba y el número grande debajo. Ocupando el resto, un grupo de tres pestañas a ancho completo (Órdenes Pendientes · Órdenes en Progreso · Órdenes Completadas) que en móvil se apilan; cada pestaña lista tarjetas de orden paginadas de doce en doce y abre un modal de detalle con las fotos de referencia, materiales, medidas y el avance de estado. Su navegación inferior sólo tiene dos destinos, Trabajo y Perfil, y el sistema lo lleva directo a `/trabajo` al iniciar sesión."
      },
      {
        "name": "Inventario de materiales",
        "describe": "Cabecera con el título del módulo y, a la derecha, botones de acción con icono de más para 'Agregar material' y 'Nuevo préstamo', más un aviso ámbar con triángulo de alerta cuando hay materiales por debajo del mínimo. Tarjetas de resumen con total de materiales, movimientos de hoy y ayer y costo total del inventario formateado en pesos. El cuerpo son pestañas: Materiales (tarjetas por pieza con nombre, tipo — metal con su quilataje, piedra con quilates, color y pureza, componente u 'otros' —, existencias con su unidad, peso total, precio unitario y una insignia de estado que se pinta en rojo cuando el stock es bajo), Movimientos (entradas y salidas paginadas), Préstamos externos (tarjetas con el prestamista, el monto y el botón de pago) y Precios (tarjetas de cotización por metal con acceso al historial y al recálculo en cascada de los precios de producto). Al pulsar un material se abre su vista de detalle a página completa. Los formularios de alta viven en modales de Radix con selectores encadenados: tipo de material → tipo de metal o piedra → quilataje."
      }
    ],
    "visualConcept": "El joyero que se abre. La página del portafolio arranca cerrada: pantalla completa en burdeos muy oscuro (#2a0505 sobre #1a0303) con una fina línea dorada horizontal a media altura — la tapa del estuche. Al cargar, esa línea se abre en dos con una animación de 900 ms y curva `cubic-bezier(.16,1,.3,1)`: la mitad superior rota sobre su eje X (`transform-origin: bottom`, `rotateX(-72deg)`) mientras la inferior baja 12 px, y por la ranura escapa un resplandor dorado (#e6c374) que crece de 0 a 60 % de opacidad y se desvanece. Detrás aparece el interior del estuche: fondo crema #f7f2ec con textura sutil de terciopelo (un `radial-gradient` repetido al 3 % de negro) y, en el centro, el nombre del proyecto en serif tinta #2b2424 con la palabra 'Joyería' en dorado. Sobre él cruza un destello: una banda blanca de 18 % de opacidad inclinada 20° que barre de izquierda a derecha en 1,2 s (`background-position` de 200 % a -200 %, el mismo truco que ya usan los esqueletos de la landing real) y se repite cada 6 s.\n\nLa estructura es una vitrina de bandejas apiladas verticalmente, cada sección un cajón que se desliza al entrar en pantalla (`translateY(24px)` → 0 con opacidad, escalonado 80 ms entre hijos): 1) Portada — el estuche abierto, tagline y las métricas contables (44.782 líneas, 106 rutas de API, 6 roles) como tres placas doradas grabadas. 2) El problema — texto sobre burdeos profundo, con un peso visual denso, casi sin brillo, para contrastar con el resto. 3) Los seis roles — seis piezas dispuestas en semicírculo sobre paño crema; cada una es una tarjeta con borde dorado de 1 px que al pasar el ratón se levanta 6 px, gana una sombra cálida (0 18px 40px rgba(93,1,1,.18)) y recibe un reflejo diagonal que recorre su superficie en 600 ms. 4) La vitrina de módulos — rejilla de tarjetas blancas donde una luz de foco (`radial-gradient` dorado de 320 px atado al cursor mediante variables CSS `--mx`/`--my`) barre las piezas siguiendo al ratón, iluminando sólo la que se mira. 5) El taller — franja oscura con las capturas del panel del joyero y del inventario, presentadas como piezas sobre un paño; el ticker de metales se recrea literal: una cinta que desliza en bucle infinito de 30 s con puntos de color por metal, pausada al hacer hover. 6) Retos técnicos — acordeón de bandejas: cada reto es un cajón que se abre revelando la solución, con la altura animada y un filo dorado que se enciende al abrirse. 7) Cierre — el estuche se vuelve a cerrar en el pie, con la línea dorada como separador final.\n\nPaleta y ritmo: burdeos #8d0101 para superficies de mando y acentos estructurales, #5e0101 para los fondos profundos, oro #b8893b con su degradado (linear-gradient(135deg,#e6c374,#b8893b)) reservado exclusivamente a bordes, destellos y a una única llamada a la acción por sección, crema #f7f2ec como fondo de descanso, tinta #2b2424 para el texto largo. Tipografía serif de peso alto en titulares (aire de grabado) y sans neutra en el cuerpo. Movimientos concretos: apertura de tapa, barrido de brillo sobre los títulos, foco que sigue al cursor en la rejilla, reflejo diagonal al hacer hover, cinta en bucle del ticker y apertura de cajones. Todo respeta `prefers-reduced-motion`: sin barridos ni aperturas, sólo fundidos de 200 ms.",
    "statusShort": "En producción",
    "categoryShort": "Software empresarial",
    "media": [
      {
        "src": "/proyectos/joyeria/logo.png",
        "kind": "logo",
        "caption": "Logotipo de la marca usado en la cabecera de la landing pública."
      },
      {
        "src": "/proyectos/joyeria/logo-color.png",
        "kind": "logo",
        "caption": "Versión a color del logotipo."
      },
      {
        "src": "/proyectos/joyeria/LOCO-BLANCO-SANDRA-CANIZAREZ-1536x358.png",
        "kind": "logo",
        "caption": "Logotipo horizontal en blanco: se usa sobre el burdeos del footer y en la cabecera de las pantallas de autenticación."
      },
      {
        "src": "/proyectos/joyeria/logo-1.png",
        "kind": "logo",
        "caption": "Isotipo de la aplicación (favicon / marca del sistema)."
      },
      {
        "src": "/proyectos/joyeria/logo-texto.png",
        "kind": "logo",
        "caption": "Marca con texto para cabeceras del sistema administrativo."
      },
      {
        "src": "/proyectos/joyeria/IMG_5539-1.mp4",
        "kind": "video",
        "caption": "Vídeo de portada de la landing, en bucle silenciado bajo el titular 'Descubre el Brillo de lo Inolvidable'."
      },
      {
        "src": "/proyectos/joyeria/MAMA-SANDRACANIZAREZ-1.png",
        "kind": "image",
        "caption": "Póster del vídeo de portada (imagen que se ve mientras carga el hero)."
      },
      {
        "src": "/proyectos/joyeria/IMAGEN-FONDO-1.png",
        "kind": "image",
        "caption": "Banner de la colección 'Joyas para mamá'."
      },
      {
        "src": "/proyectos/joyeria/FONDO-2-1.png",
        "kind": "image",
        "caption": "Banner de la colección 'Tendencias'."
      },
      {
        "src": "/proyectos/joyeria/FONDO-OK-1.png",
        "kind": "image",
        "caption": "Banner de la colección 'Sets para Regalar'."
      },
      {
        "src": "/proyectos/joyeria/IMG_5530-1-1-1.png",
        "kind": "image",
        "caption": "Fondo de la sección 'Diseña tu propia joya' con llamada a asesoría por WhatsApp."
      },
      {
        "src": "/proyectos/joyeria/j6h5trth-1.png",
        "kind": "image",
        "caption": "Tarjeta de personalización 'Cadenas personalizadas'."
      },
      {
        "src": "/proyectos/joyeria/rujythr-1.png",
        "kind": "image",
        "caption": "Tarjeta de personalización 'Pulseras grabadas'."
      },
      {
        "src": "/proyectos/joyeria/prod-ANLA043.jpg",
        "kind": "image",
        "caption": "Fotografía de producto del catálogo (serie ANLA043–ANLA050)."
      },
      {
        "src": "/proyectos/joyeria/prod-ANLA047.jpg",
        "kind": "image",
        "caption": "Fotografía de producto del catálogo."
      },
      {
        "src": "/proyectos/joyeria/SETS-450x450.png",
        "kind": "image",
        "caption": "Miniatura cuadrada de la categoría 'Sets'."
      },
      {
        "src": "/proyectos/joyeria/anillo-de-18.png",
        "kind": "image",
        "caption": "Pieza suelta: anillo de oro 18k."
      }
    ]
  },
  {
    "slug": "swapdealer",
    "name": "SwapDealers",
    "tagline": "La red donde los concesionarios cambian inventario entre sí, con el diferencial en dólares calculado antes de sentarse a negociar",
    "category": "Plataforma SaaS B2B · Web app para concesionarios",
    "year": "2026",
    "role": "Desarrollo frontend y capa de integración con la API",
    "status": "Build de producción generado y apuntando a la API pública del backend; acceso restringido a concesionarios registrados",
    "summary": [
      "SwapDealers es una plataforma B2B cerrada que interconecta los inventarios de concesionarios de vehículos usados para que puedan intercambiar unidades entre ellos en lugar de esperar a un comprador final.",
      "Cada vehículo se publica con una modalidad de venta —solo efectivo, solo cambio o ambas— y, cuando admite cambio, con criterios de intercambio propios: marcas aceptadas, rango de año, kilometraje máximo y condición mínima.",
      "Un motor de matches cruza esos criterios contra el resto de la red y devuelve un score de compatibilidad junto con el diferencial monetario a favor o a compensar, para que la conversación entre dealers empiece con una cifra sobre la mesa.",
      "La SPA en React consume una API FastAPI mediante una capa de fetch tipada con JWT, refresco de token y traducción de errores al español, y mantiene el prototipo navegable con datos de ejemplo cuando el backend no responde."
    ],
    "problem": "Un concesionario con un sedán parado 90 días en piso y un cliente que quiere una pickup no tiene forma sistemática de saber qué otro dealer de la red tiene exactamente esa pickup y aceptaría su sedán a cambio. El intercambio entre concesionarios existe, pero ocurre por WhatsApp, por conocidos y a ciegas: nadie sabe cuánto dinero hay que encimar hasta que ya se perdió la tarde comparando precios a mano, y las negociaciones se pisan porque ambas partes responden al mismo tiempo sin saber a quién le toca el turno.",
    "solution": "Publicar cada unidad una sola vez, con sus criterios de intercambio explícitos, y dejar que el motor de matching haga el cruce contra toda la red. La interfaz presenta cada oportunidad como un intercambio de dos lados —lo que entregas frente a lo que recibes— con el diferencial neto calculado, la comisión de plataforma desglosada y un score que ordena las opciones por probabilidad de cierre. Desde ahí la propuesta viaja a una bandeja con negociación por turnos: contraofertas, historial de cada movimiento y estados explícitos de quién debe responder.",
    "highlights": [
      {
        "title": "Motor de matches con score explicado",
        "description": "Cada match llega con un anillo de score 0-100 y un desglose por criterios, financiero, reputación y geografía. La vista incluye una tarjeta que explica en texto plano cómo se calcula, para que el dealer confíe en el orden de la lista.",
        "icon": "Radar"
      },
      {
        "title": "Diferencial en dos direcciones",
        "description": "El mismo número se lee distinto según de qué lado estés: se firma con +1 o −1 según seas proponente o contraparte y se etiqueta como «a tu favor» en verde, «a compensar» en ámbar o «cambio par» en neutro.",
        "icon": "ArrowLeftRight"
      },
      {
        "title": "Negociación por turnos",
        "description": "Aceptar, contraofertar y rechazar solo aparecen cuando la API marca que el turno es tuyo. Si le toca al otro dealer, los botones se sustituyen por un estado de espera con el historial completo de la negociación debajo.",
        "icon": "Handshake"
      },
      {
        "title": "Oferta en efectivo que reemplaza el cálculo",
        "description": "Un dealer puede escribir un monto manual en USD que sustituye por completo al diferencial automático, comisión incluida. Las líneas del cálculo original quedan atenuadas en pantalla como referencia en vez de desaparecer.",
        "icon": "Banknote"
      },
      {
        "title": "Sesión que sobrevive a la red",
        "description": "El refresco de token se ejecuta en una sola promesa compartida para evitar carreras, y un 500 o una caída de red no borran la sesión: solo un 401 o 403 explícito cierra al usuario.",
        "icon": "ShieldCheck"
      }
    ],
    "features": [
      "Asistente de publicación en 4 pasos: datos base, valoración, modalidad de venta y revisión final",
      "Sugerencia de precio por marca, modelo y año con mínimo, máximo, promedio y contexto de percentil",
      "Criterios de intercambio configurables por vehículo cuando la modalidad es cambio o mixta",
      "Motor de matches con score, desglose por criterios y diferencial calculado por par de vehículos",
      "Filtros de matches por marca, año y kilometraje máximo, con orden por score, año, kilometraje o precio y paginado",
      "Vista de propuesta a dos columnas: lo que ofrezco frente a lo que recibo, con cálculo financiero y comisión de plataforma del 0,8 %",
      "Bandeja de propuestas con pestañas Recibidas, Enviadas e Historial, filtro por estado y búsqueda por vehículo o concesionario",
      "Contraofertas con mensaje, monto y línea de tiempo de la negociación",
      "Marketplace de la red con vista grid o lista, chips de modalidad y filtros avanzados por categoría, estado, precio y año",
      "Inventario propio con estados disponible, en negociación, reservado, pausado y vendido, badge de matches y alerta por días en piso",
      "Carga de fotos por vehículo y logotipo del concesionario mediante multipart",
      "Perfil público del dealer con reseñas, calificación y formulario para evaluar la experiencia tras un cierre",
      "Centro de notificaciones que fusiona las del backend con las locales y consulta el contador de no leídas cada 30 segundos",
      "Panel de administración de plataforma con métricas globales, gestión de dealers, verificación, planes y estadísticas de vehículos",
      "Vista de impresión mediante @media print que aísla el contenido principal y oculta la navegación",
      "Catálogos servidos por la API: estados y ciudades, marcas y modelos con tipo de carrocería"
    ],
    "stack": [
      {
        "group": "Núcleo",
        "items": [
          "React 18.3",
          "TypeScript",
          "Vite 6.3",
          "react-router 7"
        ]
      },
      {
        "group": "Interfaz",
        "items": [
          "Tailwind CSS 4.1",
          "shadcn/ui sobre Radix UI",
          "lucide-react",
          "motion",
          "sonner",
          "vaul",
          "cmdk",
          "recharts",
          "embla-carousel-react",
          "class-variance-authority",
          "tailwind-merge",
          "tw-animate-css"
        ]
      },
      {
        "group": "Formularios e interacción",
        "items": [
          "react-hook-form",
          "react-day-picker",
          "input-otp",
          "react-dnd",
          "react-resizable-panels",
          "canvas-confetti",
          "date-fns"
        ]
      },
      {
        "group": "Datos y sesión",
        "items": [
          "fetch tipado propio sobre la API FastAPI",
          "JWT con refresh en localStorage",
          "polling de notificaciones"
        ]
      },
      {
        "group": "Calidad y tipografía",
        "items": [
          "Vitest 2.1",
          "jsdom",
          "Geist",
          "Geist Mono",
          "Instrument Serif"
        ]
      }
    ],
    "architecture": "SPA de una sola página montada desde src/main.tsx: AuthProvider envuelve la app y un AppShell la vuelve a montar con la identidad del usuario como key, de modo que cambiar de sesión limpia todo el estado. La navegación no usa rutas de URL sino un estado currentView con nueve vistas (dashboard, marketplace, matches, detail, requests, inventory, wizard, profile, settings) renderizadas condicionalmente desde src/app/App.tsx, con un guard que impide salir del asistente mientras se está publicando. Toda la comunicación pasa por src/lib/api.ts: un wrapper de fetch tipado que inyecta el JWT, desenvuelve el sobre { data } de la API, reintenta una vez tras refrescar el token —con una única promesa en vuelo para que varias peticiones simultáneas no disparen varios refrescos— y traduce el error al español antes de mostrarlo. src/lib/types.ts replica los esquemas Pydantic del backend y src/lib/proposals.ts y src/lib/datetime.ts concentran las dos reglas de negocio delicadas: el signo del diferencial y la interpretación de fechas UTC sin zona horaria en hora de Caracas. La capa visual es doble: Tailwind 4 más shadcn/ui para primitivas, y encima un design system propio en src/styles/redesign.css con tokens (--bg-0, --ink-0, --accent) y clases ds-* que redefinen incluso las utilidades emerald de Tailwind para unificar el aspecto sin reescribir cada componente. El panel de plataforma vive aparte en src/app/AdminPanel.tsx con su propia barra lateral oscura.",
    "challenges": [
      {
        "problem": "El punto de partida era un prototipo generado en Figma Make: bonito, navegable y completamente falso. Todos los números estaban escritos a mano dentro de los componentes.",
        "solution": "Se construyó una capa de integración aislada (api.ts, auth.tsx, types.ts) espejo de los esquemas del backend, y App.tsx pasó a cargar cada vista por efecto. Los datos de ejemplo quedaron como respaldo: si la API no responde aparece un aviso y el prototipo sigue siendo demostrable sin levantar Docker."
      },
      {
        "problem": "Cualquier error 500 o corte momentáneo de red expulsaba al dealer de la sesión, porque el manejo de fallos borraba el token ante cualquier excepción.",
        "solution": "El refresco de token se centralizó en una promesa compartida y el hidratado inicial ahora solo limpia credenciales ante un 401 o 403 explícito. Los errores de red y los 5xx dejan la sesión intacta y la siguiente petición reintenta."
      },
      {
        "problem": "Ambos dealers podían actuar sobre la misma propuesta a la vez, con contraofertas cruzadas y sin saber a quién le tocaba responder.",
        "solution": "Se derivó un indicador de turno comparando el dealer que la API marca como pendiente de respuesta con el dealer del usuario. Aceptar, contraofertar y rechazar solo se renderizan cuando el turno es propio; en caso contrario aparece un estado de espera explícito."
      },
      {
        "problem": "El diferencial que devuelve la API está siempre en la perspectiva de quien propuso, así que la contraparte veía el signo invertido y leía como ganancia lo que era un pago.",
        "solution": "Se extrajo a un módulo propio con pruebas la resolución del signo (+1 proponente, −1 contraparte) sobre el diferencial negociado, deliberadamente distinto del neto que ya incluye comisión y costo de traspaso, y se le asignaron etiquetas y colores fijos: verde a favor, ámbar a compensar."
      },
      {
        "problem": "Los mensajes de error del backend llegaban a la interfaz tal cual: cadenas en inglés, estados internos como pending o countered, y a veces páginas HTML completas de error.",
        "solution": "Un sanitizador detecta respuestas HTML o demasiado largas y las reemplaza por un mensaje por código de estado, traduce los estados y frases conocidas al español y deja pasar el resto sin tocar, con pruebas unitarias que fijan ese contrato."
      }
    ],
    "metrics": [
      {
        "value": "9",
        "label": "vistas del panel de dealer"
      },
      {
        "value": "52",
        "label": "métodos de API tipados en la capa de integración"
      },
      {
        "value": "28",
        "label": "pruebas unitarias con Vitest"
      },
      {
        "value": "46",
        "label": "componentes shadcn/ui en el design system"
      },
      {
        "value": "4",
        "label": "pasos en el asistente de publicación"
      },
      {
        "value": "14.316",
        "label": "líneas de TypeScript y TSX en src/"
      }
    ],
    "brand": {
      "primary": "#1E6626",
      "secondary": "#784900",
      "accent": "#61C568",
      "bg": "#FBFAF7",
      "surface": "#FFFFFF",
      "text": "#0E0F0C",
      "gradient": "linear-gradient(135deg, #0E0F0C 0%, #1E6626 58%, #61C568 100%)",
      "mood": "Editorial ejecutivo y cálido: papel hueso en vez de blanco puro, tinta casi negra, bordes de medio píxel y un único verde eléctrico reservado para la señal —score alto, diferencial a favor, cierre confirmado—, con ámbar para lo que hay que compensar. Tipografía Geist para la interfaz, Geist Mono con cifras tabulares en todo lo monetario e Instrument Serif en cursiva como acento editorial en los titulares.",
      "source": "/Users/macbook/swapdealer/src/styles/redesign.css (tokens --bg-0 #FBFAF7, --ink-0 #0E0F0C, --accent oklch(0.74 0.16 145), --accent-deep oklch(0.45 0.12 145), --amber-deep oklch(0.45 0.10 70)) y /Users/macbook/swapdealer/src/styles/theme.css; los valores oklch se convirtieron a hexadecimal"
    },
    "links": {},
    "uiScreens": [
      {
        "name": "Inicio del dealer",
        "describe": "Fondo hueso #FBFAF7 y barra lateral fija de 264 px en tono #F4F2ED con el logotipo cuadrado del concesionario, un botón negro «Publicar vehículo» y seis entradas de navegación (Inicio, Mercado, Matches, Bandeja, Inventario, Perfil); la de Bandeja lleva una píldora verde con el número de propuestas pendientes. En el área principal, un encabezado con la fecha larga en monoespaciada versalita sobre «Hola, Arturo» donde el nombre va en serif cursiva de mayor cuerpo. Debajo, una tarjeta hero de tinta negra a sangre completa, con un halo radial verde difuminado saliendo de la esquina superior derecha, un punto que pulsa junto a la etiqueta «Tu radar · en vivo» y el texto «Hay 12 matches esperando tu revisión» con la cifra en serif cursiva verde eléctrico; dentro, dos botones píldora: uno verde sólido y otro translúcido. Sigue una rejilla de cuatro tarjetas KPI blancas de borde de medio píxel (Vehículos activos, Matches hoy, Cambios mes, Prom. cierre), cada una con etiqueta monoespaciada en versalitas, cifra de 28 px y un delta con flecha. Abajo, dos columnas: a la izquierda «Matches urgentes» —filas con miniatura del vehículo, nombre del dealer y diferencial alineado a la derecha en verde o ámbar— y a la derecha «Embudo del mes» con cuatro barras horizontales de 6 px (Ingresados, Con match, Propuestos, Cerrados, esta última en ámbar). Cierra un feed de actividad de tarjetas con icono cuadrado de fondo tintado y la hora en monoespaciada. Todo entra con una animación de aparición y desplazamiento vertical de 6 px."
      },
      {
        "name": "Cambios posibles (motor de matches)",
        "describe": "Encabezado con el sobretítulo monoespaciado «Motor de matches», el titular «Cambios posibles» de 28 px y muy negativo espaciado entre letras, el conteo de vehículos compatibles y un botón secundario «Imprimir» a la derecha. Debajo, una tira de tres tarjetas de estadística: Encontrados y A tu favor en blanco, y Score 80+ en verde suave con la cifra en verde profundo. Sigue una fila de filtros —selectores de marca, año, kilometraje máximo y vehículo propio, más un desplegable de orden alineado a la derecha y el contador «14 de 32»—. El cuerpo es una rejilla auto-ajustable de tarjetas de mínimo 250 px. Cada tarjeta abre con una cabecera separada por una línea de medio píxel donde hay un anillo SVG de score de 40 px, verde si supera 85, ámbar entre 70 y 85 y gris por debajo, con el número dentro en monoespaciada. El cuerpo es la visualización del intercambio: a la izquierda la etiqueta versalita «Tú entregas» con miniatura cuadrada de 56 px y precio; en el centro, un círculo gris claro de 28 px con el icono de flechas circulares; a la derecha, alineado al borde, «Tú recibes» con la miniatura y el precio del vehículo contraparte. Debajo, una banda redondeada con el fondo tintado según el signo —verde suave si el diferencial es a favor, ámbar suave si hay que compensar— con la palabra «Diferencial» a la izquierda y la cifra en monoespaciada tabular a la derecha. Cierra con dos botones: «Proponer cambio» en negro sólido y «Detalles» en blanco con borde. Las tarjetas aparecen escalonadas con 50 ms de retardo entre una y otra. Al final, paginación con dos botones circulares y una tarjeta plana que explica cómo se calcula el score."
      },
      {
        "name": "Propuesta de cambio",
        "describe": "Vista dedicada de ancho contenido con una flecha de retroceso, el título «Propuesta de cambio» y el subtítulo «Revise los detalles y términos del intercambio». Debajo, dos tarjetas idénticas y enfrentadas en rejilla de dos columnas que colapsan a una en móvil: la izquierda rotulada «Lo que ofrezco» y la derecha «Lo que recibo», ambas con la etiqueta en versalitas de 10 px. Cada una muestra una foto de 144 px de alto con esquinas redondeadas —y, cuando no hay foto, un degradado sólido con la marca y el modelo en blanco centrado, azul a verde en el vehículo propio y gris pizarra en el ajeno—, luego el título marca-modelo-año, el kilometraje y color en texto atenuado, y al pie, separada por una línea, la fila «Valor» con el precio en cifras tabulares. Debajo de ambas, una tarjeta de fondo gris cálido con el bloque de cálculo financiero: un campo numérico con el símbolo de dólar embebido a la izquierda para la oferta manual en efectivo, y a continuación el desglose línea por línea —valor de mi vehículo, valor de la contraparte en negativo, comisión de plataforma del 0,8 % en texto pequeño— que se atenúa al 50 % de opacidad en cuanto se escribe un monto manual, porque entonces ese importe sustituye al cálculo. La última línea, separada por un borde, muestra «Diferencial neto» y la cifra a 20 px en verde si es a favor o ámbar si hay que compensar. Cierra con un botón verde a ancho completo «Enviar propuesta» y uno secundario «Volver a matches»."
      },
      {
        "name": "Bandeja de propuestas",
        "describe": "Sobretítulo monoespaciado «Bandeja» y titular «Propuestas». Debajo, un control segmentado en píldora de fondo gris claro con tres pestañas —Recibidas, Enviadas, Historial—, cada una con su conteo en monoespaciada semitransparente al lado; la activa se eleva sobre fondo blanco con sombra mínima. Sigue una fila con el selector de estado y un buscador con lupa. La lista son tarjetas blancas anchas: en la cabecera, a la izquierda, el nombre del concesionario con icono de ubicación y subrayado al pasar el ratón, la calificación con estrella ámbar y una píldora verde «verificado»; a la derecha, la insignia de estado —píldora con punto de color y texto en versalitas monoespaciadas: ámbar con punto fijo para Pendiente y Contraoferta, verde con punto que pulsa para Aceptada, rosa apagado para Rechazada— y la fecha local. El cuerpo es de nuevo el intercambio a dos columnas: a la izquierda «Ofrezco» y a la derecha «Solicito», cada lado con una miniatura de 80×64 px —o un rectángulo de color plano con la marca escrita si no hay foto, o un icono de billetes cuando ese lado es solo efectivo— junto a marca, modelo, año, kilometraje y valor. Bajo ellas, el historial de negociación como una lista con borde izquierdo grueso donde cada movimiento indica autor, monto y mensaje. La barra de acciones, separada por una línea, cambia según el turno: si es tuyo aparecen «Aceptar propuesta» en verde sólido, «Contraofertar» y «Rechazar» en rojo suave; si no, se sustituyen por una etiqueta con reloj que dice que se espera respuesta del otro dealer."
      },
      {
        "name": "Asistente de publicación",
        "describe": "Cuatro tarjetas de paso en fila horizontal sobre el formulario —Datos base, Valoración, Modalidad de venta, Revisión—, cada una con un círculo de 24 px que muestra el número en monoespaciada, se rellena de negro cuando el paso está en curso o completado y cambia a un icono de verificación al terminar; la tarjeta activa se distingue por fondo blanco y borde negro de un píxel mientras las demás quedan en gris cálido sin borde. El paso de modalidad es el corazón del producto: tres tarjetas seleccionables de igual tamaño con icono, título y descripción —Solo efectivo, Solo cambio y Cambio + efectivo—, esta última con una etiqueta flotante verde «Recomendado» sobresaliendo de la esquina superior derecha; la seleccionada se marca con borde de dos píxeles y sombra sutil. Al elegir cambio o modalidad mixta se despliega debajo el bloque de criterios de intercambio: chips redondeados de marcas y categorías que se tiñen de verde sólido con texto blanco al activarse, rangos de año, kilometraje máximo y condición mínima aceptable. El paso de valoración incorpora la sugerencia de precio de la plataforma con mínimo, promedio y máximo. La navegación inferior mantiene siempre «← Paso anterior» a la izquierda y el avance a la derecha, que en el último paso pasa a ser la publicación que dispara el motor de matches."
      }
    ],
    "visualConcept": "Semilla: el intercambio como dos columnas enfrentadas que se cruzan con flechas animadas y tarjetas que cambian de lado. Desarrollo para SwapDealers: la landing entera se construye sobre un eje central vertical —una línea de medio píxel del color --line del propio producto— que separa TÚ ENTREGAS de TÚ RECIBES y que solo se rompe en los momentos de cierre. Fondo hueso #FBFAF7 en toda la página, tarjetas blancas de borde de medio píxel, tinta #0E0F0C y un único verde eléctrico #61C568 usado con avaricia; el ámbar #ECA851 aparece exclusivamente en el lado que compensa dinero.\n\nHÉROE. Pantalla completa en tinta casi negra, la única sección oscura del sitio, con un halo radial verde al 25 % de opacidad saliendo de la esquina superior derecha, calcado de la tarjeta hero del dashboard real. El título va en dos líneas con la palabra clave en Instrument Serif cursiva verde: «Tu inventario parado es el inventario que otro dealer busca». Debajo, dos tarjetas de vehículo enfrentadas: entran desde los bordes izquierdo y derecho fuera de pantalla con un desplazamiento de 320 ms y curva cubic-bezier(0.32, 0.72, 0, 1), se detienen a ambos lados del eje y, al posarse, cruzan sus posiciones con un intercambio de 700 ms —cada tarjeta describe un arco corto pasando una por delante y otra por detrás, con una diferencia de índice de apilamiento y una inclinación de 3 grados que se corrige al aterrizar—. Entre ellas, dos flechas curvas en SVG dibujan su trazo con stroke-dasharray animado de 900 ms, la de ida en verde y la de vuelta en tinta. Al terminar el cruce aparece la píldora del diferencial, con un escalado de 0.9 a 1 y el número contando desde cero en Geist Mono tabular. El ciclo se repite cada cinco segundos con vehículos distintos y se congela por completo si el visitante pide movimiento reducido, dejando el estado final ya cruzado.\n\nCÓMO FUNCIONA. Tres bloques que alternan lado —publicas a la izquierda, la red responde a la derecha, cierran en el centro— unidos por la misma línea vertical, que aquí se dibuja progresivamente conforme baja el desplazamiento. En cada bloque el texto entra por un lado y su tarjeta de interfaz por el opuesto, con un retardo de 80 ms entre ambos. El tercer bloque es el único donde las dos columnas convergen: los dos carriles se juntan en un nodo verde que late una sola vez al entrar en pantalla.\n\nMOTOR DE MATCHES. Sección de fondo hueso con el anillo de score SVG reproducido tal cual del producto: al entrar en vista, el trazo se dibuja de 0 a 92 en 900 ms mientras el número cuenta en monoespaciada, y el color salta de gris a ámbar y de ámbar a verde al cruzar los umbrales 70 y 85. A su derecha, cuatro barras horizontales de 6 px —criterios, financiero, reputación, geografía— que crecen escalonadas cada 90 ms. Debajo, una rejilla de tarjetas de match reales, cada una con su mini-intercambio interno y su banda de diferencial tintada, apareciendo con 50 ms de retardo entre tarjetas, exactamente como en la aplicación.\n\nDIFERENCIAL. Una sola pieza a pantalla ancha: la balanza. Dos platillos —tu vehículo y el suyo— unidos por una barra que se inclina según la diferencia de valor; al desplazarse, un control deslizante invisible recorre tres estados y la barra bascula con una transición de 400 ms. Cuando cae del lado propio el fondo de la banda pasa a verde suave y el texto dice «a tu favor»; cuando cae del otro, ámbar suave y «a compensar»; en el centro se estabiliza en gris neutro y «cambio par». Es la única sección con movimiento controlado por desplazamiento, y en movimiento reducido se sustituye por los tres estados dispuestos lado a lado.\n\nNEGOCIACIÓN POR TURNOS. Franja de conversación con burbujas alternando izquierda y derecha, cada una con su monto en monoespaciada y su hora, y un cursor de turno —un punto verde que pulsa— que salta de un lado al otro con una transición de 250 ms cada vez que aparece un mensaje nuevo. Al final, el sello «Cambio confirmado» sobre verde suave, con el punto ya fijo.\n\nDATOS Y STACK. Tira de métricas contables en tarjetas KPI idénticas a las del producto, cifras de 28 px que cuentan al entrar en pantalla, etiquetas monoespaciadas en versalitas. El stack se presenta como chips en píldora sobre fondo blanco, agrupados por capa, con el mismo tratamiento de las etiquetas de modalidad de la aplicación.\n\nCIERRE. Vuelve el negro del héroe, ahora sin halo: el eje central se cierra, las dos columnas se funden en una sola tarjeta y un botón verde píldora ocupa el centro. Toda la página respeta el mismo vocabulario de movimiento del producto —aparición con 6 px de desplazamiento vertical, curva cubic-bezier(0.32, 0.72, 0, 1), duraciones de 150 a 400 ms— y ninguna animación supera un segundo salvo el cruce del héroe.",
    "statusShort": "En producción",
    "categoryShort": "App móvil",
    "media": []
  },
  {
    "slug": "tiktext",
    "name": "TikText",
    "tagline": "Historias que se leen palabra por palabra en un feed vertical",
    "category": "App social de lectura y monetización para escritores",
    "year": "2026",
    "role": "Diseño de producto y desarrollo front-end (React + TypeScript)",
    "status": "Prototipo de alta fidelidad — front-end completo, integración con API en curso",
    "summary": [
      "TikText traslada la mecánica del feed vertical de las redes sociales al texto: cada historia ocupa una pantalla completa con scroll-snap y se lee mediante un lector RSVP que proyecta una sola palabra al centro a 650 palabras por minuto.",
      "Alrededor del lector hay una capa social completa — perfil de creador, likes, drawer de comentarios, propinas en monedas y capítulos premium con precio — y una capa de creación con cuatro herramientas: AI Lab, Writing Studio, Visual Synth y Dashboard.",
      "El proyecto nació como diseño de alta fidelidad en Figma Make y se convirtió en una app React 18 + Vite + Tailwind v4 con 9 módulos de dominio propios sobre 46 primitivos shadcn/ui.",
      "La capa de datos ya está conectada: un cliente axios con interceptores, toasts tipados de error y el servicio de Creator Studio que consume estadísticas y contenido paginado del creador."
    ],
    "problem": "Leer ficción larga en el móvil compite contra formatos diseñados para el pulgar: el video vertical entrega estímulo inmediato y la lectura tradicional exige abrir un libro, encontrar la página y sostener la atención. Además, un escritor independiente no tiene una forma directa de cobrar por un capítulo suelto: publica gratis o desaparece detrás de una plataforma editorial.",
    "solution": "TikText adopta la gramática de la red social vertical y la aplica al texto. El feed es una pila de pantallas con scroll-snap obligatorio; cada tarjeta reproduce la historia con técnica RSVP (una palabra fija en el centro, 92 ms por palabra) para eliminar el movimiento ocular, acompañada de banda sonora, carrusel de capítulos y barra de progreso. Sobre esa base el creador monta su negocio: bloquea capítulos con precio en monedas, recibe propinas, sigue sus ingresos en una billetera con analíticas semanales y genera texto y portadas con herramientas asistidas por IA dentro de la misma app.",
    "highlights": [
      {
        "title": "Lector RSVP a 650 WPM",
        "description": "Un intervalo de 92 ms avanza palabra a palabra sobre un halo violeta difuminado; el temporizador solo corre en la tarjeta activa del feed, detectada por la posición de scroll.",
        "icon": "Gauge"
      },
      {
        "title": "Feed vertical con scroll-snap",
        "description": "Contenedor de altura completa con snap-y mandatory y snap-always: cada historia se ancla a la pantalla y un listener de scroll calcula el índice activo para pausar el resto.",
        "icon": "Smartphone"
      },
      {
        "title": "Capítulos premium y propinas",
        "description": "Los capítulos bloqueados se muestran con miniatura difuminada, candado y etiqueta de precio en monedas doradas; el botón de propina late con un aura radial animada.",
        "icon": "Coins"
      },
      {
        "title": "Cuatro herramientas de creación",
        "description": "StoryLab agrupa en pestañas el AI Lab (semilla, género, banda sonora, roadmap de capítulos), el Writing Studio, el Visual Synth y el Dashboard de métricas.",
        "icon": "Wand2"
      },
      {
        "title": "Editor con consola de IA",
        "description": "Writing Studio divide la pantalla 60/40: lienzo contenteditable con barra flotante al seleccionar texto (Summarize, Expand, Make Aggressive) y consola de chat con seis directivas rápidas.",
        "icon": "PenTool"
      },
      {
        "title": "Billetera con analíticas",
        "description": "Saldo en USDT sobre Binance Pay, gráfico semanal de ingresos y lectores con Recharts, transacciones recientes y control de precio por capítulo.",
        "icon": "Wallet"
      }
    ],
    "features": [
      "Feed vertical de historias con scroll-snap a pantalla completa",
      "Lector RSVP que revela una palabra a la vez a 650 WPM con halo pulsante",
      "Carrusel de capítulos con miniatura, número, estado completado y bloqueo premium",
      "Barra de progreso de lectura y medidor de velocidad flotante",
      "Reproductor de banda sonora por historia con visualizador de ondas animado",
      "Acciones sociales: perfil con anillo giratorio, like, comentarios y propina en monedas",
      "Drawer de comentarios deslizante con avatares degradados, verificación y likes por comentario",
      "Ficha de creador con portada, estadísticas en rejilla, rendimiento e historias populares",
      "AI Lab: campo de semilla narrativa, cinco marcos de género en tarjetas isométricas y biblioteca musical",
      "Roadmap de capítulos con score de complejidad e interruptor de monetización por capítulo",
      "Writing Studio: editor contenteditable con barra flotante de acciones de IA y consola de chat",
      "Visual Synth: generación de portadas por prompt, 16 presets de estilo, variaciones y biblioteca",
      "Vista previa del overlay RSVP sobre la imagen generada",
      "Creator Dashboard con KPIs, filtro publicados/borradores y paginación contra la API",
      "Creator Wallet con saldo USDT, gráfico semanal, transacciones y ajustes de monetización",
      "Rejilla de descubrimiento con insignias de tendencia, premium y contadores de vistas",
      "Sistema de toasts tipado que traduce errores de validación y de red del backend"
    ],
    "stack": [
      {
        "group": "Front-end",
        "items": [
          "React 18",
          "TypeScript",
          "Vite 6",
          "Tailwind CSS v4"
        ]
      },
      {
        "group": "Interfaz",
        "items": [
          "shadcn/ui",
          "Radix UI (26 paquetes)",
          "lucide-react",
          "MUI 7",
          "Emotion",
          "class-variance-authority",
          "tailwind-merge",
          "tw-animate-css"
        ]
      },
      {
        "group": "Interacción y datos",
        "items": [
          "Recharts",
          "Motion",
          "Embla Carousel",
          "react-dnd",
          "react-hook-form",
          "sonner",
          "vaul",
          "cmdk",
          "date-fns"
        ]
      },
      {
        "group": "Capa de red",
        "items": [
          "axios",
          "interceptores de request y response",
          "API REST v1 del Creator Studio"
        ]
      },
      {
        "group": "Tipografía",
        "items": [
          "Inter",
          "JetBrains Mono"
        ]
      }
    ],
    "architecture": "Aplicación de una sola página montada en src/main.tsx sobre createRoot. App.tsx actúa como router por estado con tres modos raíz — reader, lab y wallet — sin dependencia de router externo. El modo reader renderiza una pila de StoryCard dentro de un contenedor con snap-y mandatory; un efecto sobre el evento de scroll divide scrollTop entre la altura de ventana para calcular el índice activo, y solo esa tarjeta ejecuta el intervalo RSVP. StoryLab es un contenedor de pestañas que monta WritingStudio, VisualSynth y CreatorDashboard, con navegación inferior fija de cuatro destinos. CreatorWallet repite el patrón con sus propias cuatro pestañas (feed, studio, marketplace, wallet) y recibe callbacks para devolver al lector la portada elegida en FeedGrid. La capa de datos está separada en tres niveles: src/lib/http.ts crea la instancia axios con cabeceras X-Api-Key y X-Timezone derivada del navegador e interceptores que disparan toasts de error; src/lib/api.ts expone envoltorios genéricos get, post, put, patch y del tipados; src/services/creatorStudio.ts declara los tipos CreatorStats y CreatorContent y consume los dos endpoints del estudio con el sobre paginado genérico PaginatedResponse<T> definido en src/lib/types.ts. La biblioteca visual vive aparte en src/app/components/ui con 46 primitivos shadcn/ui, de modo que los 9 módulos de dominio suman unas 4.195 líneas propias sin mezclarse con el sistema de diseño.",
    "challenges": [
      {
        "problem": "Cinco lectores RSVP simultáneos en el DOM significaban cinco temporizadores de 92 ms corriendo a la vez, consumiendo CPU y desincronizando las historias que el usuario no estaba viendo.",
        "solution": "El estado de tarjeta activa se calcula en el contenedor padre a partir del scroll y se propaga como prop isActive; el efecto que crea el setInterval retorna temprano si la tarjeta no está activa y limpia el intervalo al desmontar, de forma que solo hay un temporizador vivo."
      },
      {
        "problem": "Cambiar de capítulo dentro de una historia obligaba a reiniciar el flujo de palabras sin dejar el índice apuntando fuera del nuevo arreglo, lo que producía palabras vacías en pantalla.",
        "solution": "Un efecto observa el índice de capítulo, sustituye el arreglo de palabras por el del capítulo seleccionado con recaída al texto base de la historia y reinicia el índice de palabra a cero antes de que el intervalo vuelva a avanzar."
      },
      {
        "problem": "Cada pantalla necesitaba manejar sus propios errores de API — errores estándar, errores de validación 422 con arreglo de detalles y caídas de red sin respuesta — lo que multiplicaba el try/catch por componente.",
        "solution": "Un interceptor de respuesta único dispara toastError en cualquier fallo y reenvía el error; el parser de src/lib/toast.ts distingue las tres formas de payload y construye un título y una descripción legibles, dejando el manejo local como opcional."
      },
      {
        "problem": "La identidad visual de TikText — negro absoluto, violeta y verde neón — no coincidía con el tema por defecto de shadcn/ui incluido en la exportación de Figma Make, definido en tokens oklch claros.",
        "solution": "Los módulos de dominio se pintan con hex literales de marca en las utilidades de Tailwind y con gradientes en línea, mientras theme.css se conserva intacto para que los 46 primitivos de la biblioteca sigan funcionando sin reescribir el sistema de tokens."
      },
      {
        "problem": "El feed de descubrimiento y el lector vertical son dos vistas distintas, pero al abrir una historia desde la rejilla la portada debía acompañar la lectura sin duplicar el estado de la historia.",
        "solution": "FeedGrid emite el identificador y la URL de portada hacia CreatorWallet, que los eleva a App; el estado selectedFeedStory mapea el id al índice del feed y pasa coverImage a la StoryCard correspondiente, que la usa como fondo bajo una capa negra al 85 por ciento con desenfoque."
      }
    ],
    "metrics": [
      {
        "value": "9",
        "label": "Módulos de dominio propios"
      },
      {
        "value": "4.195",
        "label": "Líneas de TypeScript propias"
      },
      {
        "value": "650",
        "label": "Palabras por minuto del lector RSVP"
      },
      {
        "value": "46",
        "label": "Primitivos shadcn/ui integrados"
      },
      {
        "value": "11",
        "label": "Vistas y pestañas navegables"
      },
      {
        "value": "16",
        "label": "Presets de estilo en Visual Synth"
      }
    ],
    "brand": {
      "primary": "#7000FF",
      "secondary": "#00FF94",
      "accent": "#FFD700",
      "bg": "#000000",
      "surface": "#121212",
      "text": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #7000FF 0%, #00FF94 100%)",
      "mood": "Cyberpunk nocturno: negro absoluto, violeta eléctrico y verde neón con vidrio esmerilado, halos difuminados y oro para todo lo que cuesta dinero. Inter para la interfaz, JetBrains Mono en negrita a 48 px para la palabra que se lee.",
      "source": "/Users/macbook/tiktext/src/app/components/StoryCard.tsx (hex de marca en línea, reutilizados en App.tsx, StoryLab.tsx, CreatorWallet.tsx y FeedGrid.tsx); tipografías en /Users/macbook/tiktext/src/styles/fonts.css"
    },
    "links": {},
    "uiScreens": [
      {
        "name": "Feed de lectura RSVP",
        "describe": "Pantalla completa negra sin márgenes. Arriba a la izquierda, una pastilla flotante de fondo negro al 60 por ciento con desenfoque y borde blanco al 10 por ciento muestra un icono de velocímetro verde neón y el texto '650 WPM'. Arriba a la derecha, dos botones circulares de 48 px con degradado violeta a verde y sombra violeta difusa abren la billetera y el laboratorio. En el centro geométrico exacto, una sola palabra en JetBrains Mono bold de 48 px blanca sobre un halo radial violeta de 256 px con blur de 40 px que pulsa de 0.3 a 0.6 de opacidad cada 2 segundos; la palabra se reemplaza cada 92 ms. Sobre el borde derecho, a un 35 por ciento de altura, una columna vertical de acciones separadas 24 px: avatar de 40 px rodeado por un anillo degradado que gira lento, corazón con contador '12.4k', bocadillo de comentarios con '850' y una moneda dorada con degradado oro a naranja envuelta en un aura amarilla que late. Abajo, una barra de progreso de 2 px verde neón con sombra; debajo, una tarjeta de vidrio con el icono de música violeta, el nombre de la pista, el artista y ocho barras verticales de ondas animadas; después, un carrusel horizontal de miniaturas cuadradas de 64 px con esquinas redondeadas — la activa con anillo violeta y sombra, las bloqueadas difuminadas con candado violeta y etiqueta dorada de precio, las completadas con un check verde. Al pie, el título en 18 px semibold, la descripción en gris al 70 por ciento a una línea y el autor con una insignia 'Verified' violeta translúcida."
      },
      {
        "name": "AI Story Lab",
        "describe": "Fondo negro con cabecera fija: un punto verde neón que parpadea junto al texto 'Draft Saved' en gris, y una X a la derecha. El cuerpo desplazable arranca con un área de texto de 128 px de alto, fondo #121212, borde blanco al 10 por ciento y esquinas de 16 px, con el marcador 'Type your story seed here...'; al enfocarla el borde se vuelve verde neón. Debajo, un botón verde neón a todo el ancho con texto negro, icono de destellos y la etiqueta 'Expand Idea'. Sigue la sección 'GENRE FRAMEWORK' en mayúsculas espaciadas gris: cinco tarjetas isométricas de 112 por 96 px en fila desplazable, cada una con su propio degradado — Sci-Fi azul violeta, Noir grafito, Romance rosa coral, Thriller rosa amarillo, Fantasy cian — inclinadas con perspectiva y rotación de 5 grados, sombra de color difusa debajo y un punto verde bajo la seleccionada. La sección 'STORY SOUNDTRACK' lista cuatro pistas en filas de vidrio con botón circular de reproducción, nombre, artista, duración, etiqueta de mood y, en la activa, doce barras violetas de onda animada; cierra un área punteada de subida de audio. La última sección, 'STORY ROADMAP', apila filas de 80 px con manija de arrastre, código monoespaciado 'CH 01', título del capítulo, barra de complejidad cuyo degradado cambia según el score y un botón cuadrado con candado abierto o cerrado para la monetización. Barra inferior fija de vidrio negro con cuatro destinos — AI Lab, Writer, Visual, Dashboard — con iconos en cuadrados redondeados de 48 px que se tiñen de violeta o verde al activarse."
      },
      {
        "name": "Neural Writing Studio",
        "describe": "Fondo #1A1A1A dividido verticalmente. Cabecera con un punto violeta pulsante y el título 'Neural Writing Studio' en semibold blanco, X a la derecha. El 60 por ciento superior es un lienzo editable con párrafos en blanco al 90 por ciento, 16 px e interlineado 1.6, donde algunos fragmentos aparecen resaltados con fondo violeta translúcido y esquinas suaves. Al seleccionar texto emerge una barra flotante negra con desenfoque y borde claro, centrada sobre la selección, con tres acciones: 'Summarize', 'Expand' y 'Make Aggressive' — esta última en violeta. El 40 por ciento inferior es una consola de vidrio oscuro con borde superior: burbujas de chat alineadas a la izquierda para la IA, con fondo violeta al 20 por ciento y borde violeta, y a la derecha para el usuario, en blanco translúcido. Bajo el chat, una fila desplazable de seis píldoras violetas con borde — 'Add Cliffhanger', 'Deepen Atmosphere', 'Insert Dialogue', 'Check Coherence', 'Build Tension', 'Reveal Secret'. Debajo, un campo de entrada redondeado con el marcador 'Ask AI for suggestions...' y un botón cuadrado violeta con icono de envío. Cierra un pie con dos botones al 50 por ciento: uno translúcido con icono de imagen y texto 'Generate Art for this Chapter', y otro violeta sólido con check y 'Finalize Text'."
      },
      {
        "name": "Visual Synth",
        "describe": "Pantalla negra en columna. Cabecera con el título 'Visual Synth' en peso ligero y espaciado amplio. Bloque 'Generated Image': una imagen en formato vertical con esquinas redondeadas y dos botones cuadrados translúcidos encima para regenerar y descargar; al activar el interruptor de vista previa, sobre la imagen se superpone una capa negra al 20 por ciento y, en el centro, la palabra 'encrypted' en JetBrains Mono bold de 24 px sobre un halo violeta de 128 px con blur — la simulación exacta de cómo se verá el texto RSVP sobre esa portada. Debajo, el conmutador 'RSVP Text Preview' con icono de toggle que pasa de gris a violeta. Sigue 'STYLE PRESETS' en gris muy tenue con dos flechas de desplazamiento a la derecha y un carrusel de dieciséis miniaturas — Anime, Cinematic, Oil Painting, Sketch, Watercolor, 3D Render, Pixel Art, Noir, Neon, Vintage, Cyberpunk, Fantasy, Comic Book, Abstract, Minimalist y Surreal — cada una con su nombre sobre un degradado oscuro y borde violeta cuando está activa. Después, el prompt editable, un botón violeta a todo el ancho para regenerar y una rejilla de variaciones. La pestaña de biblioteca cambia el contenido por un buscador con el marcador 'Search high-quality stock imagery...' y una cuadrícula de imágenes."
      },
      {
        "name": "Creator Wallet",
        "describe": "Fondo negro con cabecera de dos líneas: título 'Creator Wallet' en 24 px semibold y subtítulo gris 'Manage your earnings and payouts'. La tarjeta principal es un panel de vidrio con degradado violeta suave: arriba, una pastilla con 'Binance Pay' y una etiqueta verde 'Connected'; en el centro, la etiqueta 'Available Balance' y la cifra en 48 px bold blanca junto a 'USDT' en gris; abajo, un botón a todo el ancho 'Withdraw Funds' con flecha diagonal. Sigue 'Analytics' con dos tarjetas pequeñas de ingresos semanales y lectores totales, y un panel 'Performance Overview' con un gráfico de líneas de Recharts sobre rejilla tenue: una serie violeta de ingresos y otra verde neón de lectores a lo largo de los siete días de la semana, con leyenda de puntos de color. Luego 'Recent Transactions' apila filas con avatar circular de iniciales sobre degradado, usuario en arroba, acción — 'Unlocked Chapter 4', 'Tipped your story' — importe en verde a la derecha y marca de tiempo relativa. Cierra 'Monetization Settings' con un interruptor violeta para 'Story Pricing' y, cuando está activo, un control de precio por capítulo en monedas. La navegación inferior fija ofrece cuatro destinos con iconos rellenos al activarse: Feed, Studio, Market y Wallet."
      }
    ],
    "visualConcept": "Semilla: feed vertical con scroll snap estilo red social, burbujas de texto y traducción que se revela. Desarrollo para TikText: la landing es literalmente un feed. El documento se divide en secciones de 100vh con scroll-snap-type: y mandatory y scroll-snap-align: start, exactamente el mismo mecanismo que usa la app, de modo que navegar el portafolio se siente como usar el producto. Fondo negro absoluto #000000 con un halo radial violeta #7000FF difuminado a 40 px que sigue lentamente al puntero y late de 0.3 a 0.6 de opacidad cada 2 segundos, replicando el resplandor del lector. Un indicador de progreso vertical de 2 px en verde neón #00FF94 se pega al borde derecho y marca la sección activa; a la izquierda, una pastilla de vidrio fija muestra un velocímetro y el rótulo dinámico de la sección, igual que el medidor '650 WPM' de la app.\n\nLa traducción que se revela se interpreta aquí como la revelación palabra a palabra: el héroe presenta un párrafo completo en gris al 30 por ciento, en Inter, y encima, en JetBrains Mono bold de 48 a 72 px, una única palabra blanca que va avanzando por el párrafo cada 92 ms; la palabra ya leída se apaga y la siguiente entra con un fundido de 60 ms y un desplazamiento vertical de 4 px. Al terminar el párrafo, todo el texto gris se ilumina de golpe en blanco durante 400 ms — el momento en que el bloque opaco se traduce en historia legible — y aparece el nombre TikText con el degradado de 135 grados de #7000FF a #00FF94. Un control discreto permite bajar la velocidad y, si el visitante tiene prefers-reduced-motion activo, la animación se detiene y el párrafo se muestra completo desde el inicio.\n\nLas burbujas de texto estructuran el resto. La sección de problema y solución se cuenta como una conversación: burbujas alineadas a la izquierda con fondo violeta al 20 por ciento y borde violeta al 30 por ciento — el mismo estilo de la consola de IA del Writing Studio — frente a burbujas grises a la derecha, que entran escalonadas con 80 ms de retraso entre sí al cruzar el 60 por ciento del viewport. Cada burbuja de la IA se escribe con un cursor monoespaciado parpadeante antes de fijarse.\n\nEstructura de secciones, todas a pantalla completa y encadenadas por snap: 1) Héroe con la revelación RSVP y el degradado de marca. 2) Problema en formato de burbujas de chat. 3) Mecánica del lector: una maqueta de teléfono de 375 px con marco de 1 px blanco al 10 por ciento y radio de 40 px que reproduce la StoryCard real — halo, palabra, columna de acciones, barra de progreso verde y carrusel de capítulos — mientras el texto lateral explica el intervalo de 92 ms. 4) Herramientas del creador: cuatro tarjetas isométricas con perspectiva y rotación de 5 grados, tomadas del selector de géneros, una por herramienta (AI Lab, Writer, Visual, Dashboard), que se elevan 4 px al pasar el puntero y despliegan su captura al abrirse. 5) Monetización: fondo con vetas doradas #FFD700, una moneda que rota con la animación spin-slow de 3 segundos y las cifras de capítulos premium y propinas. 6) Arquitectura: diagrama de tres capas — vista, servicios, cliente HTTP — dibujado en SVG con líneas violetas de 1 px que se trazan con stroke-dasharray al entrar. 7) Métricas: seis contadores en JetBrains Mono que suben desde cero en 900 ms con easing out. 8) Cierre con el stack en píldoras de vidrio sobre el degradado de marca.\n\nMicrointeracciones heredadas del código real: hover que sube 4 px y enciende un borde violeta con sombra difusa (de FeedGrid), superficies de vidrio negro al 40 por ciento con desenfoque y borde blanco al 10 por ciento, anillos degradados que giran alrededor de los avatares, y barras de onda de ocho elementos que se animan en bucle junto a cualquier referencia a la banda sonora. Tipografía: Inter 400/600 para todo el cuerpo, JetBrains Mono 400/700 reservada para números, etiquetas técnicas y la palabra que se revela.",
    "statusShort": "Prototipo",
    "categoryShort": "App social",
    "media": []
  }
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);

export const nextProject = (slug) => {
    const i = projects.findIndex((p) => p.slug === slug);
    if (i === -1) return projects[0];
    return projects[(i + 1) % projects.length];
};

/** Compatibilidad con la versión anterior del portafolio. */
export const dataPortfolio = projects.map((p, i) => ({
    id: i + 1,
    title: p.name,
    image: p.media[0]?.src ?? "",
    urlGithub: p.links.github ?? "",
    urlDemo: p.links.play ?? p.links.web ?? p.links.demo ?? "",
}));

/**
 * Catálogo de apoyo para cotizaciones. Los tres proveedores fabrican los
 * mismos productos y tienen disponibilidad ilimitada; solo cambia el precio.
 * Los precios son orientativos y se pueden ajustar en el formulario.
 */

function firstDefined(...valores) {
  return valores.find(
    (valor) => valor !== undefined && valor !== null && valor !== ""
  );
}

function normalizeList(valor) {
  if (Array.isArray(valor)) return valor;
  if (valor && typeof valor === "object") {
    if (Array.isArray(valor.items)) return valor.items;
    if (Array.isArray(valor.products)) return valor.products;
    return Object.values(valor);
  }
  return [];
}

export const PROVEEDORES_MOCK = [
  {
    id: "MOCK-PROV-1",
    name: "Laboratorios del Sur S.A.C.",
    document: "20500000001",
    tipo: "Estándar",
    factor: 1.0,
    plazoDias: 3,
    contacto: "Área comercial",
    email: "comercial@laboratoriosdelsur.test",
  },
  {
    id: "MOCK-PROV-2",
    name: "Distribuidora Pharma",
    document: "20500000002",
    tipo: "Económico",
    factor: 0.88,
    plazoDias: 5,
    contacto: "Ventas corporativas",
    email: "ventas@distribuidorapharma.test",
  },
  {
    id: "MOCK-PROV-3",
    name: "Proveedores Andinos",
    document: "20500000003",
    tipo: "Premium",
    factor: 1.08,
    plazoDias: 2,
    contacto: "Atención al cliente",
    email: "contacto@proveedoresandinos.test",
  },
];

export const PRODUCTOS_MOCK = [
  {
    codigo: "01",
    name: "GUANTE PARA EXAMEN DESCARTABLE DE NITRILO SIN POLVO TALLA M (CAJA POR 100 UNIDADES)",
    unit: "CAJA x 100",
    precioVenta: 85.0,
    alias: ["guantes de nitrilo", "guante nitrilo", "guantes"],
  },
  {
    codigo: "02",
    name: "ELECTRODO DISCO AUTOADHESIVO DESCARTABLE PARA ECG ADULTO (GEL SÓLIDO, CONECTOR BROCHE)",
    unit: "UNIDAD",
    precioVenta: 38.0,
    alias: ["electrodo ecg", "electrodos", "electrodo disco"],
  },
  {
    codigo: "03",
    name: "FILTRO HIDROFÓBICO BACTERIANO / VIRAL ADULTO PARA CIRCUITO DE ANESTESIA CON PUERTO DE CAPNOGRAFÍA",
    unit: "UNIDAD",
    precioVenta: 65.0,
    alias: ["filtro hidrofobico", "filtro bacterial", "filtro viral"],
  },
  {
    codigo: "04",
    name: 'CATÉTER ENDOVENOSO PERIFÉRICO N° 20G X 1.16" RADIOPACO CON DISPOSITIVO DE BIOSEGURIDAD',
    unit: "UNIDAD",
    precioVenta: 12.0,
    alias: ["cateter endovenoso", "cateter 20g", "cateter periferico"],
  },
  {
    codigo: "05",
    name: 'JERINGA DESCARTABLE DE 10 ML CON AGUJA 21G X 1 1/2" LUER LOCK ESTÉRIL',
    unit: "UNIDAD",
    precioVenta: 9.5,
    alias: ["jeringa 10 ml", "jeringas", "jeringa descartable"],
  },
  {
    codigo: "06",
    name: "MASCARILLA QUIRÚRGICA DESCARTABLE DE 3 PLIEGUES CON ELÁSTICO Y CLIP NASAL (CAJA POR 50 UNIDADES)",
    unit: "CAJA x 50",
    precioVenta: 32.0,
    alias: ["mascarillas quirurgicas", "mascarilla quirurgica", "mascarillas"],
  },
  {
    codigo: "07",
    name: "EQUIPO DE VENOCLISIS ESTÉRIL CON CÁMARA DE GOTEO TRANSPARENTE, FILTRO DE AIRE Y REGULADOR DE FLUJO",
    unit: "UNIDAD",
    precioVenta: 14.0,
    alias: ["equipo de venoclisis", "venoclisis", "equipo venoclisis"],
  },
  {
    codigo: "08",
    name: "GASA ESTÉRIL DOBLADA DE ALGODÓN HIDRÓFILO 10 CM X 10 CM X 8 PLIEGUES (CAJA POR 100 SOBRES)",
    unit: "CAJA x 100",
    precioVenta: 48.0,
    alias: ["gasa esteril", "gasas", "gasa"],
  },
  {
    codigo: "09",
    name: "SONDA DE ASPIRACIÓN ENDOTRAQUEAL CIRCUITO CERRADO N° 14 FR ESTÉRIL DESCARTABLE CON VÁLVULA DE CONTROL",
    unit: "UNIDAD",
    precioVenta: 95.0,
    alias: ["sonda de aspiracion", "sonda aspiracion", "sonda endotraqueal"],
  },
  {
    codigo: "10",
    name: "ESPARADRAPO HIPOALERGÉNICO DE TELA NO TEJIDA MICROPOROSA 5 CM X 9.1 M (ROLLO)",
    unit: "ROLLO",
    precioVenta: 11.0,
    alias: ["esparadrapo hipoalergenico", "esparadrapo"],
  },
  {
    codigo: "11",
    name: "ALCOHOL ETÍLICO MEDICINAL AL 70° USO TÓPICO ANTISÉPTICO (FRASCO POR 1000 ML)",
    unit: "FRASCO x 1000 ml",
    precioVenta: 14.0,
    alias: ["alcohol etilico", "alcohol 70", "alcohol"],
  },
  {
    codigo: "12",
    name: "ALGODÓN HIDRÓFILO EN ROLLO NO ESTÉRIL DE ALTA ABSORCIÓN (PAQUETE POR 500 G)",
    unit: "PAQUETE x 500 g",
    precioVenta: 18.0,
    alias: ["algodon hidrofilo", "algodon en rollo", "algodon"],
  },
  {
    codigo: "13",
    name: 'VENDA ELÁSTICA DE ALGODÓN Y POLIÉSTER 4" X 5 YARDAS CON CLIPS METÁLICOS DE SUJECIÓN',
    unit: "UNIDAD",
    precioVenta: 16.0,
    alias: ["venda elastica", "vendas", "venda"],
  },
  {
    codigo: "14",
    name: "LLAVE DE TRIPLE VÍA ESTÉRIL DESCARTABLE CON EXTENSIÓN DE 10 CM Y CONECTORES LUER LOCK",
    unit: "UNIDAD",
    precioVenta: 22.0,
    alias: ["llave de triple via", "llave triple via"],
  },
  {
    codigo: "15",
    name: "SONDA FOLEY DE LÁTEX SILICONADO DE 2 VÍAS N° 16 FR BALÓN 5-15 ML ESTÉRIL DESCARTABLE",
    unit: "UNIDAD",
    precioVenta: 18.0,
    alias: ["sonda foley", "sonda de foley"],
  },
  {
    codigo: "16",
    name: "BOLSA COLECTORA DE ORINA DE 2000 ML CON VÁLVULA ANTIRREFLUJO Y TUBO DE DRENAJE",
    unit: "UNIDAD",
    precioVenta: 12.0,
    alias: ["bolsa colectora", "bolsa de orina"],
  },
  {
    codigo: "17",
    name: "APÓSITO TRANSPARENTE ADHESIVO ESTÉRIL SEMIPERMEABLE 6 CM X 7 CM (CAJA POR 100 UNIDADES)",
    unit: "CAJA x 100",
    precioVenta: 55.0,
    alias: ["aposito transparente", "aposito"],
  },
  {
    codigo: "18",
    name: 'AGUJA HIPODÉRMICA DESCARTABLE N° 23G X 1" ESTÉRIL BISEL CORTO (CAJA POR 100 UNIDADES)',
    unit: "CAJA x 100",
    precioVenta: 12.0,
    alias: ["aguja hipodermica", "agujas", "aguja"],
  },
  {
    codigo: "19",
    name: "SOLUCIÓN DE CLORHEXIDINA GLUCONATO AL 2% + ALCOHOL ISOPROPÍLICO AL 70% (FRASCO POR 1000 ML)",
    unit: "FRASCO x 1000 ml",
    precioVenta: 26.0,
    alias: ["clorhexidina 2", "clorhexidina"],
  },
  {
    codigo: "20",
    name: "TERMÓMETRO CLÍNICO DIGITAL DE PUNTA FLEXIBLE CON PANTALLA LCD Y ALARMA SONORA",
    unit: "UNIDAD",
    precioVenta: 18.0,
    alias: ["termometros digitales", "termometro digital", "termometro clinico", "termometros"],
  },
  {
    codigo: "21",
    name: "PARACETAMOL 500 MG TABLETA RECUBIERTA (CAJA POR 100 TABLETAS)",
    unit: "CAJA x 100",
    precioVenta: 15.0,
    alias: ["paracetamol 500", "paracetamol"],
  },
  {
    codigo: "22",
    name: "LEVETIRACETAM 500 MG TABLETA RECUBIERTA ANTICONVULSIVANTE (CAJA POR 30 TABLETAS)",
    unit: "CAJA x 30",
    precioVenta: 120.0,
    alias: ["levetiracetam 500", "levetiracetam tabletas", "levetiracetam"],
  },
  {
    codigo: "23",
    name: "LEVETIRACETAM 100 MG/ML SOLUCIÓN ORAL FRASCO POR 300 ML CON JERINGA DOSIFICADORA",
    unit: "FRASCO x 300 ml",
    precioVenta: 95.0,
    alias: ["levetiracetam 100", "levetiracetam solucion"],
  },
  {
    codigo: "24",
    name: "CLORURO DE SODIO 0.9% SOLUCIÓN INYECTABLE PARA PERFUSIÓN INTRAVENOSA (FRASCO DE POLIETILENO POR 1000 ML)",
    unit: "FRASCO x 1000 ml",
    precioVenta: 12.0,
    alias: ["cloruro de sodio 0.9", "solucion salina", "cloruro de sodio"],
  },
  {
    codigo: "25",
    name: "CEFTRIAXONA 1 G POLVO PARA SOLUCIÓN INYECTABLE INTRAVENOSA / INTRAMUSCULAR (FRASCO AMPOLLA)",
    unit: "FRASCO AMPOLLA",
    precioVenta: 28.0,
    alias: ["ceftriaxona 1 g", "ceftriaxona"],
  },
  {
    codigo: "26",
    name: "OMEPRAZOL 40 MG POLVO LIOFILIZADO PARA SOLUCIÓN INYECTABLE INTRAVENOSA (FRASCO AMPOLLA)",
    unit: "FRASCO AMPOLLA",
    precioVenta: 22.0,
    alias: ["omeprazol 40", "omeprazol"],
  },
  {
    codigo: "27",
    name: "ENOXAPARINA SÓDICA 40 MG/0.4 ML SOLUCIÓN INYECTABLE EN JERINGA PRELLENADA (CAJA POR 2 JERINGAS)",
    unit: "CAJA x 2",
    precioVenta: 85.0,
    alias: ["enoxaparina 40", "enoxaparina"],
  },
  {
    codigo: "28",
    name: "IBUPROFENO 400 MG TABLETA RECUBIERTA ANTIINFLAMATORIO NO ESTEROIDEO (CAJA POR 100 TABLETAS)",
    unit: "CAJA x 100",
    precioVenta: 22.0,
    alias: ["ibuprofeno 400", "ibuprofeno"],
  },
  {
    codigo: "29",
    name: "AMOXICILINA + ÁCIDO CLAVULÁNICO 875 MG / 125 MG TABLETA RECUBIERTA (CAJA POR 14 TABLETAS)",
    unit: "CAJA x 14",
    precioVenta: 45.0,
    alias: ["amoxicilina clavulanico", "amoxicilina"],
  },
  {
    codigo: "30",
    name: "METOCLOPRAMIDA CLORHIDRATO 10 MG/2 ML SOLUCIÓN INYECTABLE (CAJA POR 25 AMPOLLAS)",
    unit: "CAJA x 25",
    precioVenta: 20.0,
    alias: ["metoclopramida 10", "metoclopramida"],
  },
];

const PALABRAS_VACIAS = new Set([
  "de", "del", "la", "el", "los", "las", "un", "una", "para", "con",
  "sin", "por", "x", "y", "al", "en", "no", "caja", "unidades", "unidad",
  "frasco", "sobres", "tabletas", "rollo", "paquete", "talla",
]);

export function claveProducto(value) {
  return String(value ?? "")
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value) {
  return claveProducto(value)
    .split(" ")
    .filter((token) => token && !PALABRAS_VACIAS.has(token));
}

function coincidencia(nombreBuscado, producto) {
  const texto = claveProducto(nombreBuscado);
  if (!texto) return 0;

  const alias = producto.alias.map(claveProducto);
  if (alias.some((valor) => valor === texto)) return 100;
  if (alias.some((valor) => valor.includes(texto) || texto.includes(valor))) return 90;

  const nombre = claveProducto(producto.name);
  if (nombre === texto) return 100;
  if (nombre.includes(texto) || texto.includes(nombre)) return 85;

  const tokensBuscados = tokens(nombreBuscado);
  const tokensProducto = new Set([
    ...tokens(producto.name),
    ...producto.alias.flatMap(tokens),
  ]);
  if (!tokensBuscados.length) return 0;

  const aciertos = tokensBuscados.filter((token) => tokensProducto.has(token)).length;
  return aciertos >= 2 ? Math.round((aciertos / tokensBuscados.length) * 70) : 0;
}

/** Busca el producto del catálogo que corresponde al texto extraído del correo. */
export function resolverProducto(nombre) {
  let mejor = null;
  let mejorPuntaje = 0;

  for (const producto of PRODUCTOS_MOCK) {
    const puntaje = coincidencia(nombre, producto);
    if (puntaje > mejorPuntaje) {
      mejor = producto;
      mejorPuntaje = puntaje;
    }
  }

  return mejorPuntaje >= 70 ? mejor : null;
}

function redondear(valor) {
  return Math.round((Number(valor) || 0) * 100) / 100;
}

/** Devuelve solo las tres cotizaciones del producto solicitado. */
export function cotizacionesParaProducto(nombre, precioVentaReferencia = null) {
  const producto = resolverProducto(nombre);
  if (!producto) return { producto: null, precioVenta: 0, opciones: [] };

  const precioVenta = Number(precioVentaReferencia) > 0
    ? Number(precioVentaReferencia)
    : producto.precioVenta;

  const opciones = PROVEEDORES_MOCK.map((proveedor) => {
    const precioCompra = redondear(precioVenta * proveedor.factor);
    return {
      ...proveedor,
      precioCompra,
      margen: redondear(((precioVenta - precioCompra) / precioVenta) * 100),
      plazoDias: proveedor.plazoDias,
    };
  });

  return { producto, precioVenta, opciones };
}

/** Precarga precio y unidad del catálogo en los productos extraídos del correo. */
export function resolverProductosMock(productos = []) {
  return normalizeList(productos).map((producto) => {
    const nombre = firstDefined(
      producto.name,
      producto.nombre,
      producto.producto,
      ""
    );
    const resuelto = resolverProducto(nombre);
    if (!resuelto) return producto;

    return {
      ...producto,
      name: nombre || resuelto.name,
      unit: firstDefined(producto.unit, producto.unidad, resuelto.unit, "UNIDAD"),
      price: Number(producto.price) > 0 ? Number(producto.price) : resuelto.precioVenta,
    };
  });
}

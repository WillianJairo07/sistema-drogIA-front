import { apiGet, apiPatch, apiPost, apiPut } from "../../../services/apiConfig";
import {
  firstDefined,
  normalizeEntity,
  normalizeList,
  toIsoDate,
  toNumber,
} from "../../../services/mappers";

export function mapClienteCotizacion(value, fallbackName = "") {
  const cliente = normalizeEntity(value, {
    name: fallbackName,
    document: "",
    email: "",
  });
  const nombre = firstDefined(cliente.name, cliente.nombre, fallbackName, "");
  let email = firstDefined(cliente.email, cliente.correo, "");
  if (!email && String(nombre).includes("@")) email = nombre;
  return {
    id: cliente.id ?? cliente.clienteId ?? null,
    name: nombre,
    document: firstDefined(cliente.document, cliente.documento, ""),
    email,
  };
}

function aIdProducto(value) {
  const texto = String(value ?? "").trim();
  return /^\d+$/.test(texto) ? Number(texto) : null;
}

export function mapProductoCotizacion(product = {}, index = 0) {
  const idOriginal = product.id ?? product.productId ?? null;
  const nombreOriginal = firstDefined(
    product.name,
    product.producto,
    product.product,
    product.nombre,
    ""
  );
  const extraido = extraerSolicitudDesdeNombre(nombreOriginal);
  const unidadExplicit = firstDefined(
    product.unit,
    product.unidad,
    product.unidadMedida
  );
  const usarExtraido =
    Boolean(extraido) &&
    (!unidadExplicit ||
      String(unidadExplicit).toUpperCase() === "UNIDAD" ||
      normalizarTexto(unidadExplicit) === normalizarTexto(extraido.unidad));

  return {
    ...product,
    id: idOriginal ?? `TMP-${index + 1}`,
    productId: aIdProducto(product.productId ?? idOriginal),
    name: usarExtraido ? extraido.nombre : nombreOriginal,
    unit: usarExtraido
      ? extraido.unidad
      : unidadExplicit || "UNIDAD",
    quantity: toNumber(
      usarExtraido
        ? extraido.cantidad
        : firstDefined(product.quantity, product.cantidad, 1),
      0
    ),
    price: toNumber(firstDefined(product.price, product.precioUnitario, product.precio), 0),
    subtotal: toNumber(product.subtotal, 0),
    item: toNumber(product.item, index + 1),
    healthRegistration: firstDefined(
      product.healthRegistration,
      product.registroSanitario,
      product.registro_sanitario,
      ""
    ),
    lot: firstDefined(product.lot, product.lote, ""),
  };
}

function normalizarTexto(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function normalizarUnidadSolicitud(value) {
  const texto = normalizarTexto(value);
  const equivalencias = {
    caja: "caja",
    cajas: "cajas",
    cajon: "cajones",
    cajones: "cajones",
    unidad: "unidad",
    unidades: "unidades",
    und: "unidad",
    kg: "kg",
    kilo: "kg",
    kilos: "kg",
    kilogramo: "kg",
    kilogramos: "kg",
    bolsa: "bolsas",
    bolsas: "bolsas",
    frasco: "frascos",
    frascos: "frascos",
    ampolla: "ampollas",
    ampollas: "ampollas",
    tubo: "tubos",
    tubos: "tubos",
    sobre: "sobres",
    sobres: "sobres",
    paquete: "paquetes",
    paquetes: "paquetes",
    pieza: "piezas",
    piezas: "piezas",
    litro: "litros",
    litros: "litros",
    galon: "galones",
    galones: "galones",
  };
  return equivalencias[texto] || String(value ?? "").trim();
}

/** Interpreta textos como "3 cajones de algodón" o "Algodón 3 cajones". */
function extraerSolicitudDesdeNombre(value) {
  const texto = String(value ?? "").trim();
  if (!texto) return null;

  const patronUnidad =
    "caj[oó]n(?:es)?|cajas?|unidades?|und|kg|kilos?|kilogramos?|bolsas?|frascos?|ampollas?|tubos?|sobres?|paquetes?|piezas?|litros?|galones?";
  const patrones = [
    new RegExp(`^(\\d+(?:[.,]\\d+)?)\\s+(${patronUnidad})\\s+(?:de\\s+)?(.+)$`, "i"),
    new RegExp(`^(.+?)\\s+(\\d+(?:[.,]\\d+)?)\\s+(${patronUnidad})$`, "i"),
  ];

  for (const patron of patrones) {
    const coincidencia = texto.match(patron);
    if (!coincidencia) continue;

    const esInicio = patron === patrones[0];
    const cantidadTexto = esInicio ? coincidencia[1] : coincidencia[2];
    const unidadTexto = esInicio ? coincidencia[2] : coincidencia[3];
    const nombreTexto = esInicio ? coincidencia[3] : coincidencia[1];
    const cantidad = Number(cantidadTexto.replace(",", "."));

    if (!Number.isFinite(cantidad) || !nombreTexto.trim()) continue;

    return {
      cantidad,
      unidad: normalizarUnidadSolicitud(unidadTexto),
      nombre: nombreTexto.trim().replace(/^de\s+/i, ""),
    };
  }

  return null;
}

function normalizarNombre(value) {
  return normalizarTexto(value);
}

/** Convierte los productos extraídos de un caso/correo al modelo de CotizacionForm. */
export function productosDesdeCaso(value) {
  return normalizeList(value).map((product, index) => mapProductoCotizacion(product, index));
}

/**
 * Completa con el catálogo real los productos extraídos por la IA.
 * La IA no devuelve productId, así que se cruza por id, registro sanitario o nombre.
 */
export function enriquecerProductosDesdeCatalogo(productos, catalogo = []) {
  const items = normalizeList(productos).map((product, index) =>
    mapProductoCotizacion(product, index)
  );

  return items.map((producto) => {
    const nombre = normalizarNombre(producto.name);
    const registro = String(producto.healthRegistration || "").trim();
    const lote = String(producto.lot || "").trim();

    const encontrado = catalogo.find((productoCatalogo) => {
      const mismoId =
        producto.id != null &&
        productoCatalogo.id != null &&
        String(producto.id) === String(productoCatalogo.id);
      const mismoRegistro =
        registro &&
        String(productoCatalogo.healthRegistration || "").trim() === registro;
      const mismoLote =
        lote && String(productoCatalogo.lot || "").trim() === lote;
      const nombreCatalogo = normalizarNombre(productoCatalogo.name);
      const mismoNombre =
        nombre &&
        (nombreCatalogo === nombre ||
          (nombre.length >= 4 && nombreCatalogo.includes(nombre)) ||
          (nombreCatalogo.length >= 4 && nombre.includes(nombreCatalogo)));
      return mismoId || mismoRegistro || mismoLote || mismoNombre;
    });

    if (!encontrado) {
      return producto;
    }

    const idCatalogo = aIdProducto(encontrado.id);
    return {
      ...producto,
      id: idCatalogo ?? producto.id,
      productId: idCatalogo ?? producto.productId ?? null,
      name: producto.name || encontrado.name,
      unit:
        producto.unit && producto.unit !== "UNIDAD"
          ? producto.unit
          : encontrado.unit || producto.unit,
      price: producto.price || encontrado.price || 0,
      healthRegistration: producto.healthRegistration || encontrado.healthRegistration || "",
      lot: producto.lot || encontrado.lot || "",
    };
  });
}

function mismoProducto(productoA, productoB) {
  const idA = aIdProducto(productoA.productId ?? productoA.id);
  const idB = aIdProducto(productoB.productId ?? productoB.id);
  if (idA !== null && idB !== null && idA === idB) {
    return true;
  }
  const nombreA = normalizarNombre(
    firstDefined(productoA.name, productoA.producto, productoA.nombre, "")
  );
  const nombreB = normalizarNombre(
    firstDefined(productoB.name, productoB.producto, productoB.nombre, "")
  );
  return Boolean(nombreA && nombreA === nombreB);
}

/** Valida que una orden de compra corresponda a la cotización referenciada y vigente. */
export function validarOrdenCompra({ correo = null, cotizacion = null } = {}) {
  const codigo = String(
    firstDefined(correo?.codigoCotizacionDetectado, correo?.codigoReferencia, "")
  ).trim();
  const productosRecibidos = normalizeList(correo?.productos).map((producto, index) =>
    mapProductoCotizacion(producto, index)
  );
  const productosEsperados = normalizeList(
    firstDefined(cotizacion?.products, cotizacion?.items, [])
  ).map((producto, index) => mapProductoCotizacion(producto, index));

  const resultado = {
    valida: false,
    codigo,
    motivo: "",
    vencida: false,
    cotizacion: cotizacion ?? null,
    productosRecibidos,
    productosEsperados,
  };

  if (!cotizacion) {
    return { ...resultado, motivo: "No se encontró la cotización referenciada por la orden." };
  }
  if (!codigo) {
    return { ...resultado, motivo: "La orden de compra no trae código de cotización." };
  }

  const codigoNumerico = /^\d+$/.test(codigo);
  const coincideId = codigoNumerico && Number(codigo) === Number(cotizacion.id);
  const numeroCotizacion = String(
    firstDefined(cotizacion.number, cotizacion.numero, "")
  ).trim();
  const coincideNumero =
    Boolean(numeroCotizacion) && codigo.toUpperCase() === numeroCotizacion.toUpperCase();

  if (!coincideId && !coincideNumero) {
    return {
      ...resultado,
      motivo: "El código de la orden no coincide con la cotización indicada.",
    };
  }

  if (productosRecibidos.length === 0 || productosEsperados.length === 0) {
    return {
      ...resultado,
      motivo: "No se pudieron comparar los productos de la orden con la cotización.",
    };
  }

  const coincideCantidad = (esperado, recibido) =>
    Number(recibido.quantity) === Number(esperado.quantity);

  const productosInvalidos = productosEsperados.some(
    (esperado) =>
      !productosRecibidos.some(
        (recibido) => mismoProducto(esperado, recibido) && coincideCantidad(esperado, recibido)
      )
  ) || productosRecibidos.some(
    (recibido) =>
      !productosEsperados.some(
        (esperado) => mismoProducto(esperado, recibido) && coincideCantidad(esperado, recibido)
      )
  );

  if (productosInvalidos) {
    return {
      ...resultado,
      motivo: "Los productos o cantidades de la orden no coinciden con la cotización.",
    };
  }

  const fechaLimite = cotizacion.fechaLimiteCotizacion
    ? new Date(cotizacion.fechaLimiteCotizacion)
    : null;
  if (
    fechaLimite &&
    !Number.isNaN(fechaLimite.getTime()) &&
    fechaLimite.getTime() < Date.now()
  ) {
    return {
      ...resultado,
      vencida: true,
      motivo: "El plazo de la cotización ya venció.",
    };
  }

  return {
    ...resultado,
    valida: true,
    motivo: "La orden coincide con la cotización y está dentro del plazo.",
  };
}

export function mapCotizacion(data = {}) {
  const cliente = mapClienteCotizacion(
    firstDefined(data.client, data.cliente),
    typeof data.cliente === "string" ? data.cliente : data.clienteNombre || ""
  );
  const productos = normalizeList(firstDefined(data.products, data.items, []))
    .map((product, index) => mapProductoCotizacion(product, index));

  return {
    ...data,
    id: data.id ?? null,
    number: firstDefined(data.number, data.numero, ""),
    numero: firstDefined(data.numero, data.number, ""),
    casoId: data.casoId ?? null,
    correoId: data.correoId ?? null,
    client: cliente,
    cliente: cliente,
    status: firstDefined(data.status, data.estado, "Pendiente"),
    estado: firstDefined(data.estado, data.status, "Pendiente"),
    date: toIsoDate(firstDefined(data.date, data.fechaCreacion)) || "",
    fechaCreacion: data.fechaCreacion ?? null,
    codigoSolicitud: firstDefined(data.codigoSolicitud, ""),
    fechaLimiteCotizacion: data.fechaLimiteCotizacion ?? null,
    products: productos,
    items: data.items ?? [],
    destino: data.destino ?? null,
    proveedores: normalizeList(data.proveedores),
    subtotal: toNumber(data.subtotal),
    igv: toNumber(data.igv),
    total: toNumber(data.total),
  };
}

function toRequest(quote = {}) {
  const client = quote.client || quote.cliente || {};
  const productos = normalizeList(firstDefined(quote.products, quote.items, []))
    .map((product, index) => ({
      productoId: aIdProducto(product.productId ?? product.id),
      producto: firstDefined(product.name, product.producto, product.product, ""),
      unidad: firstDefined(product.unit, product.unidad, product.unidadMedida, "UNIDAD"),
      cantidad: toNumber(firstDefined(product.quantity, product.cantidad), 0),
      precioUnitario: toNumber(firstDefined(product.price, product.precioUnitario, product.precio), 0),
      subtotal: toNumber(product.subtotal, 0),
      item: index + 1,
    }));

  return {
    casoId: quote.casoId ?? null,
    clienteId: client.id ?? null,
    cliente: client.name || "",
    clienteDocumento: client.document || "",
    clienteEmail: client.email || "",
    fecha: toIsoDate(quote.date),
    condicionesPago: quote.condicionesPago || null,
    vigencia: quote.vigencia || null,
    items: productos,
    subtotal: toNumber(quote.subtotal),
    igv: toNumber(quote.igv),
    destino: quote.destino ?? null,
    proveedores: quote.proveedores ?? [],
    observaciones: quote.observaciones || null,
  };
}

export function listarCotizaciones() {
  return apiGet("/cotizaciones").then((data) =>
    (Array.isArray(data) ? data : []).map(mapCotizacion)
  );
}

export function obtenerCotizacion(id) {
  return apiGet(`/cotizaciones/${id}`).then(mapCotizacion);
}

export function crearCotizacion(quote, casoId) {
  return apiPost("/cotizaciones", toRequest({ ...quote, casoId: casoId ?? quote.casoId })).then(
    mapCotizacion
  );
}

export function actualizarCotizacion(id, quote) {
  return apiPut(`/cotizaciones/${id}`, toRequest(quote)).then(mapCotizacion);
}

export function cambiarEstadoCotizacion(id, estado) {
  return apiPatch(`/cotizaciones/${id}/estado`, { estado }).then(mapCotizacion);
}

export function listarProveedores(id) {
  return apiGet(`/cotizaciones/${id}/proveedores`).then((data) => normalizeList(data));
}

export function guardarProveedores(id, proveedores) {
  return apiPost(`/cotizaciones/${id}/proveedores`, proveedores || []).then((data) =>
    normalizeList(data)
  );
}

export function enviarCotizacion(id, payload) {
  return apiPost(`/cotizaciones/${id}/enviar-correo`, payload);
}

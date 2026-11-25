import { firstDefined, normalizeList } from "../../../services/mappers";

const UNIDADES =
  "caj[oó]n(?:es)?|cajas?|unidades?|und|kg|kilos?|kilogramos?|bolsas?|frascos?|ampollas?|tubos?|sobres?|paquetes?|piezas?|litros?|galones?|miligramos?|mg|gramos?|g";

const EQUIVALENCIAS_UNIDAD = {
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
  miligramo: "mg",
  miligramos: "mg",
  mg: "mg",
  gramo: "g",
  gramos: "g",
  g: "g",
};

function textoPlano(value) {
  return String(value ?? "")
    .replace(/\r/g, "")
    .trim();
}

function sinAcentos(value) {
  return textoPlano(value)
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function parsearValor(value) {
  if (typeof value !== "string" || !value.trim()) return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function objetoConDatos(value) {
  const dato = parsearValor(value);
  if (!dato || typeof dato !== "object" || Array.isArray(dato)) return null;
  return Object.values(dato).some(
    (item) => item !== null && item !== undefined && item !== ""
  )
    ? dato
    : null;
}

function listaConDatos(value) {
  const dato = parsearValor(value);
  const lista = normalizeList(dato).filter(
    (item) =>
      item &&
      typeof item === "object" &&
      firstDefined(item.name, item.nombre, item.producto, item.product, "")
  );
  return lista.length > 0 ? lista : null;
}

function normalizarUnidad(value) {
  const clave = sinAcentos(value);
  return EQUIVALENCIAS_UNIDAD[clave] || textoPlano(value);
}

function limpiarNombre(value) {
  return textoPlano(value)
    .replace(/^de\s+/i, "")
    .replace(/[.,;:]+$/, "")
    .replace(/\s+/g, " ");
}

/** Extrae cliente desde etiquetas explícitas, firma, remitente o cuerpo. */
export function extraerClienteDeTexto(cuerpo, remitente = "") {
  const lineas = textoPlano(cuerpo)
    .split("\n")
    .map((linea) => linea.trim());

  let etiqueta = null;
  for (const linea of lineas) {
    const coincidencia = linea.match(
      /^(?:cliente|raz[oó]n social|empresa|organizaci[oó]n|nombre|señor(?:es)?|sr(?:a)?\.?)\s*:\s*(.+)$/i
    );
    if (coincidencia) {
      etiqueta = coincidencia[1].trim();
      break;
    }
  }

  let firma = null;
  const indiceFirma = lineas.findIndex((linea) =>
    /^(saludos|saludos cordiales|atentamente|un saludo|gracias|agradecimientos)\s*,?\s*$/i.test(
      linea
    )
  );
  if (indiceFirma >= 0) {
    for (let indice = indiceFirma + 1; indice < lineas.length; indice += 1) {
      const candidato = lineas[indice];
      if (!candidato || /^[-*_]{2,}$/.test(candidato)) continue;
      if (/^(tel|telefono|tel[eé]fono|ruc|dni|nit|celular|www\.|http)/i.test(candidato)) continue;
      if (/^[^a-zA-ZÁÉÍÓÚáéíóúÑñ]*@/.test(candidato)) continue;
      firma = candidato.replace(/\s*\|.*$/, "").trim();
      break;
    }
  }

  const emailCuerpo = textoPlano(cuerpo).match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
  );
  const remitenteTexto = textoPlano(remitente);
  const entreAngulos = remitenteTexto.match(/^([^<>]+)<([^>]+)>$/);
  const nombreRemitente = entreAngulos
    ? entreAngulos[1].trim().replace(/^["']|["']$/g, "")
    : null;
  const emailRemitente = entreAngulos
    ? entreAngulos[2].trim()
    : /@/.test(remitenteTexto)
    ? remitenteTexto
    : null;

  const documento = textoPlano(cuerpo).match(
    /\b(?:RUC|DNI|NIT|Documento)\s*[:#]?\s*([0-9A-Z-]{6,})/i
  );

  return {
    name: limpiarNombre(firstDefined(etiqueta, firma, nombreRemitente, "")),
    document: documento ? documento[1] : "",
    email: firstDefined(emailCuerpo?.[0], emailRemitente, ""),
  };
}

/** Extrae productos de líneas como "Guantes de nitrilo talla M: 200 cajas". */
export function extraerProductosDeTexto(cuerpo) {
  const cantidadYUnidad = `(\\d+(?:[.,]\\d+)?)\\s*(${UNIDADES})\\b`;
  const patrones = [
    new RegExp(`^(.+?)\\s*[:\\-]\\s*${cantidadYUnidad}$`, "i"),
    new RegExp(`^${cantidadYUnidad}\\s+(?:de\\s+)?(.+)$`, "i"),
    new RegExp(`^(.+?)\\s+x\\s*${cantidadYUnidad}$`, "i"),
    new RegExp(`^(.+?)\\s+${cantidadYUnidad}$`, "i"),
  ];

  const productos = [];
  for (const lineaBruta of textoPlano(cuerpo).split("\n")) {
    const linea = lineaBruta
      .trim()
      .replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "")
      .trim();
    if (!linea) continue;

    for (const [indicePatron, patron] of patrones.entries()) {
      const coincidencia = linea.match(patron);
      if (!coincidencia) continue;

      const cantidadTexto =
        indicePatron === 1 ? coincidencia[1] : coincidencia[2];
      const unidadTexto = indicePatron === 1 ? coincidencia[2] : coincidencia[3];
      const nombreTexto = indicePatron === 1 ? coincidencia[3] : coincidencia[1];
      const cantidad = Number(cantidadTexto.replace(",", "."));
      const nombre = limpiarNombre(nombreTexto);

      if (!Number.isFinite(cantidad) || !nombre) break;
      productos.push({
        name: nombre,
        quantity: cantidad,
        unit: normalizarUnidad(unidadTexto),
      });
      break;
    }
  }

  return productos;
}

/**
 * Resuelve cliente, productos y destino de un correo.
 * Prioriza lo extraído por la IA y usa el cuerpo del correo como respaldo
 * cuando Gemini cayó en clasificación local.
 */
export function extraerDatosCorreo(correo = null, caso = null) {
  const cuerpo = firstDefined(
    correo?.cuerpoTexto,
    correo?.cuerpo_texto,
    correo?.snippet,
    ""
  );
  const remitente = firstDefined(correo?.sender, correo?.remitente, "");

  const clienteCaso = objetoConDatos(caso?.cliente);
  const clienteCorreo = objetoConDatos(correo?.cliente);
  const clienteTexto = extraerClienteDeTexto(cuerpo, remitente);
  const clienteBase = clienteCorreo || clienteCaso || clienteTexto;

  const cliente = {
    name: limpiarNombre(
      firstDefined(clienteBase?.name, clienteBase?.nombre, clienteTexto.name, "")
    ),
    document: firstDefined(
      clienteBase?.document,
      clienteBase?.documento,
      clienteTexto.document,
      ""
    ),
    email: firstDefined(
      clienteBase?.email,
      clienteBase?.correo,
      clienteTexto.email,
      ""
    ),
  };

  const productosCaso = listaConDatos(caso?.productos);
  const productosCorreo = listaConDatos(correo?.productos);
  const productosTexto = extraerProductosDeTexto(cuerpo);
  const productosResumen = extraerProductosDeTexto(correo?.resumenProductos);

  let productos = productosCaso || productosCorreo || productosTexto || productosResumen || [];
  let origen = "IA";
  if (!productosCaso && !productosCorreo) {
    origen = productosTexto.length
      ? "cuerpo del correo"
      : productosResumen.length
      ? "resumen de productos"
      : "sin datos";
  }

  const destino =
    objetoConDatos(caso?.destino) ||
    objetoConDatos(correo?.destino) ||
    null;

  return { cliente, productos, destino, origen };
}

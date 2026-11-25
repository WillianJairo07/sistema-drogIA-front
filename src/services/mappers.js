/** Utilidades pequeñas para adaptar las respuestas del backend a los modelos de las páginas. */

export function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

export function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function toIsoDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  const parts = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (parts) return `${parts[3]}-${parts[2].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? text : parsed.toISOString().slice(0, 10);
}

export function normalizeEntity(value, fallback = {}) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    return { ...fallback, name: value, id: fallback.id ?? null };
  }
  return { ...fallback };
}

export function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    if (Array.isArray(value.items)) return value.items;
    if (Array.isArray(value.products)) return value.products;
    return Object.values(value);
  }
  return [];
}

export const roles = {
  ADMINISTRADOR: "Administrador",
  VENDEDOR: "Vendedor",
  COMPRADOR: "Comprador",
  ALMACENERO: "Almacenero",
};

export const rolePermissions = {
  [roles.ADMINISTRADOR]: [
    "/dashboard",
    "/dashboard/cotizaciones",
    "/dashboard/clientes",
    "/dashboard/usuarios",
    "/dashboard/ventas",
    "/dashboard/ventas-compras",
    "/dashboard/correos",
    "/dashboard/productos",
    "/dashboard/inventario",
    "/dashboard/proveedores",
    "/dashboard/ordenes-compra",
    "/dashboard/despacho",
  ],

  [roles.VENDEDOR]: [
    "/dashboard",
    "/dashboard/cotizaciones",
    "/dashboard/clientes",
    "/dashboard/ventas",
    "/dashboard/ventas-compras",
    "/dashboard/correos",
  ],

  [roles.COMPRADOR]: [
    "/dashboard",
    "/dashboard/ventas-compras",
    "/dashboard/correos",
    "/dashboard/proveedores",
    "/dashboard/ordenes-compra",
  ],

  [roles.ALMACENERO]: [
    "/dashboard",
    "/dashboard/ventas-compras",
    "/dashboard/inventario",
    "/dashboard/ordenes-compra",
    "/dashboard/despacho",
  ],
};

const ROLE_ALIASES = {
  ADMINISTRACION: roles.ADMINISTRADOR,
  VENTAS: roles.VENDEDOR,
  COMPRAS: roles.COMPRADOR,
  ALMACEN: roles.ALMACENERO,
};

export function hasPermission(role, path) {
  const normalized =
    ROLE_ALIASES[String(role || "").trim().toUpperCase()] || role;
  return rolePermissions[normalized]?.includes(path);
}
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
    "/dashboard/productos",
    "/dashboard/ventas",
    "/dashboard/ventas-compras",
    "/dashboard/inventario",
    "/dashboard/correos",
    "/dashboard/proveedores",
    "/dashboard/ordenes-compra",
    "/dashboard/plazos",
  ],

  [roles.VENDEDOR]: [
    "/dashboard",
    "/dashboard/cotizaciones",
    "/dashboard/clientes",
    "/dashboard/productos",
    "/dashboard/ventas",
    "/dashboard/ventas-compras",
    "/dashboard/inventario",
    "/dashboard/correos",
  ],

  [roles.COMPRADOR]: [
    "/dashboard",
    "/dashboard/productos",
    "/dashboard/ventas-compras",
    "/dashboard/inventario",
    "/dashboard/proveedores",
    "/dashboard/ordenes-compra",
    "/dashboard/plazos",
  ],

  [roles.ALMACENERO]: [
    "/dashboard",
    "/dashboard/productos",
    "/dashboard/ventas-compras",
    "/dashboard/inventario",
    "/dashboard/ordenes-compra",
  ],
};

export function hasPermission(role, path) {
  return rolePermissions[role]?.includes(path);
}
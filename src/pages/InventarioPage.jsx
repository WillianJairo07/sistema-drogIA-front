import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { normalizeRole } from "../features/auth/services/authService";
import { InventoryList } from "../features/inventario/components/InventoryList";
import "../styles/inventario.css";

function textoPlano(valor, campos = []) {
  if (valor == null || valor === "") return "-";
  if (typeof valor !== "object") return String(valor);
  for (const campo of campos) {
    const encontrado = valor[campo];
    if (encontrado != null && encontrado !== "") return String(encontrado);
  }
  return "-";
}

function destinoTexto(destino) {
  const directo = textoPlano(destino, [
    "direccion",
    "address",
    "descripcion",
    "detalle",
  ]);
  if (directo !== "-") return directo;
  if (!destino || typeof destino !== "object") return "-";
  const partes = [
    destino.departamento,
    destino.provincia,
    destino.distrito,
    destino.ciudad,
  ].filter(Boolean);
  return partes.join(" / ") || "-";
}

export function InventarioPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const puedeGestionar = normalizeRole(user?.role) === "Almacenero";

  const { inventarioAlmacen = [] } = useOutletContext();

  const handleDespachar = (item) => {
    const productos = Array.isArray(item.productos) ? item.productos : [];
    const producto = productos
      .map(
        (producto) =>
          `${textoPlano(producto, ["product", "name", "nombre"])}${
            producto.lot ? ` (${producto.lot})` : ""
          }`
      )
      .join("; ");

    navigate("/dashboard/despacho", {
      state: {
        despachoInventario: {
          purchaseOrderCode: item.ordenCompraNumero || "",
          product: producto,
          quantity: item.unidades || 0,
          tipoDespacho: item.tipoDespacho || "LOCAL",
          cliente: item.cliente ?? null,
          destino: item.destino ?? null,
        },
      },
    });
  };

  return (
    <div className="inventario-container">
      <div className="inventario-header-wrapper">
        <div>
          <h1 className="inventario-header-title">Inventario en Almacén</h1>

          <p className="inventario-header-subtitle">
            Mercadería recibida de Compras y pendiente de despacho. El backend
            calcula el estado, la prioridad y la fecha límite de entrega.
          </p>

          <p className="inventario-header-subtitle">
            Registros pendientes en almacén: {inventarioAlmacen.length}
          </p>
        </div>
      </div>

      <InventoryList
        mercaderia={inventarioAlmacen}
        puedeGestionar={puedeGestionar}
        onDespachar={handleDespachar}
      />
    </div>
  );
}

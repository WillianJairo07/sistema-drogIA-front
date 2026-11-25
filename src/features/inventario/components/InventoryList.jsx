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

function claseEstado(estado) {
  if (estado === "Prioridad") return "badge-inventario-prioridad";
  if (estado === "Retrasado") return "badge-inventario-retrasado";
  return "badge-inventario-despachar";
}

function productosTexto(productos = []) {
  if (!Array.isArray(productos) || productos.length === 0) return "-";
  return productos
    .map(
      (item) =>
        `${textoPlano(item, ["product", "name", "nombre"])} × ${item.quantity || 0}${
          item.lot ? ` (${item.lot})` : ""
        }`
    )
    .join("; ");
}

export function InventoryList({
  mercaderia = [],
  puedeGestionar = false,
  onDespachar,
}) {
  return (
    <div className="inventario-card">
      <div className="inventario-table-wrapper">
        <table className="inventario-table">
          <thead>
            <tr>
              <th>Orden de compra</th>
              <th>Cliente</th>
              <th>Destino</th>
              <th>Productos</th>
              <th>Lotes</th>
              <th>Unidades</th>
              <th>Fecha límite</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th style={{ textAlign: "right" }}>Acción</th>
            </tr>
          </thead>

          <tbody>
            {mercaderia.length > 0 ? (
              mercaderia.map((item) => (
                <tr key={item.pedidoId || item.ordenCompraNumero}>
                  <td
                    style={{
                      fontWeight: 500,
                      color: "#17324c",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.ordenCompraNumero || "-"}
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                      {item.ventaNumero || "-"} · {item.tipoDespacho || "LOCAL"}
                    </div>
                  </td>

                  <td style={{ fontWeight: 500, color: "#1e293b" }}>
                    {textoPlano(item.cliente, [
                      "name",
                      "nombre",
                      "razonSocial",
                      "cliente",
                      "document",
                    ])}
                  </td>

                  <td style={{ color: "#64748b" }} title={destinoTexto(item.destino)}>
                    {destinoTexto(item.destino)}
                  </td>

                  <td style={{ color: "#64748b" }}>
                    {productosTexto(item.productos)}
                  </td>

                  <td style={{ color: "#475569", whiteSpace: "nowrap" }}>
                    {item.cantidadLotes}
                  </td>

                  <td style={{ color: "#475569", whiteSpace: "nowrap" }}>
                    {item.unidades}
                  </td>

                  <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                    {item.fechaLimiteEntrega || "-"}
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                      {item.motivo || "-"}
                    </div>
                  </td>

                  <td>
                    <span className={`badge-inventario ${claseEstado(item.estado)}`}>
                      {item.estado || "-"}
                    </span>
                  </td>

                  <td style={{ color: "#475569" }}>{item.prioridad || "-"}</td>

                  <td style={{ textAlign: "right" }}>
                    {puedeGestionar ? (
                      <button
                        type="button"
                        onClick={() => onDespachar?.(item)}
                        className="inventario-btn-primary"
                        style={{ padding: "7px 12px", fontSize: "12px" }}
                      >
                        Despachar
                      </button>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Solo lectura
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    padding: "32px",
                  }}
                >
                  No hay mercadería pendiente en el almacén. Cuando Compras
                  registre la recepción de una orden, aparecerá aquí.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

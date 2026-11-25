import { CalendarPlus, AlertTriangle } from "lucide-react";


export function DeliveryDeadlineList({
  deadlines,
  onExtension,
  onPenalty,
}) {
  return (
    <div className="plazos-table-wrapper">
      <table className="plazos-table">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Proveedor</th>
            <th>Fecha límite</th>
            <th>Estado</th>
            <th>Extensión</th>
            <th>Penalidad</th>
            <th style={{ textAlign: "right" }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {deadlines.length > 0 ? (
            deadlines.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500, color: "#334155", whiteSpace: "nowrap" }}>
                  {item.order.number}
                </td>

                <td style={{ color: "#475569" }}>
                  {item.order.supplier.name}
                </td>

                <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                  {item.deadline}
                </td>

                <td>
                  <span className="badge-plazo">
                    {item.status}
                  </span>
                </td>

                <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                  {item.extension
                    ? `${item.extension} días`
                    : "Sin extensión"}
                </td>

                <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                  {item.penalty > 0
                    ? `${item.penalty}%`
                    : "Sin penalidad"}
                </td>

                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => onExtension(item.id)}
                      title="Otorgar extensión de plazo"
                      className="plazos-action-btn"
                    >
                      <CalendarPlus className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onPenalty(item.id)}
                      title="Aplicar penalidad"
                      className="plazos-action-btn plazos-action-btn-danger"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                style={{ textAlign: "center", color: "#64748b", padding: "32px" }}
              >
                No hay plazos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
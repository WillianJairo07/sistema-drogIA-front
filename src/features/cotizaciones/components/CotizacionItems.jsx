export function CotizacionItems({
  products,
  onIncrease,
  onDecrease,
  onRemove,
  onPriceChange,
}) {
  return (
    <div className="cotizaciones-table-wrapper">
      <table className="cotizaciones-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Cant. requerida</th>
            <th>Unidad de medida</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", color: "#64748b", padding: "32px" }}>
                No hay productos agregados.
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => onDecrease(product.id)}
                      disabled={product.quantity === 1}
                      className="cotizaciones-btn-secondary"
                      style={{ width: "32px", height: "32px", padding: 0 }}
                    >
                      −
                    </button>
                    <span style={{ width: "32px", textAlign: "center", fontWeight: 500 }}>
                      {product.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onIncrease(product.id)}
                      className="cotizaciones-btn-secondary"
                      style={{ width: "32px", height: "32px", padding: 0 }}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{product.unit || product.unidadMedida || "UNIDAD"}</td>
                <td>{product.name}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.price}
                    onChange={(event) =>
                      onPriceChange(product.id, event.target.value)
                    }
                    className="cotizaciones-input"
                    style={{ width: "96px", padding: "6px 12px" }}
                  />
                </td>
                <td style={{ fontWeight: 500 }}>
                  S/ {((Number(product.quantity) || 0) * (Number(product.price) || 0)).toFixed(2)}
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => onRemove(product.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc2626",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
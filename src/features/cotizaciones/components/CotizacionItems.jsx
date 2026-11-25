export function CotizacionItems({
  products,
  onIncrease,
  onDecrease,
  onRemove,
  onPriceChange,
  onPrecioCompraChange = () => {},
  onProveedorChange = () => {},
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
            <th>Proveedor</th>
            <th>Precio compra</th>
            <th>Precio venta</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", color: "#64748b", padding: "32px" }}>
                No hay productos solicitados por el cliente.
              </td>
            </tr>
          ) : (
            products.map((product, index) => {
              const opciones = product.opcionesProveedores || [];
              const margen = Number(product.margen) || 0;

              return (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => onDecrease(product.id)}
                        disabled={Number(product.quantity) <= 1}
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
                    <div className="cotizaciones-proveedor-celda">
                      {opciones.length ? (
                        <>
                          <select
                            value={product.proveedor?.id || ""}
                            onChange={(event) => {
                              const opcion = opciones.find(
                                (item) => item.id === event.target.value
                              );
                              if (opcion) onProveedorChange(product.id, opcion);
                            }}
                            className="cotizaciones-input cotizaciones-proveedor-select"
                          >
                            <option value="">Seleccionar proveedor...</option>
                            {opciones.map((opcion) => (
                              <option key={opcion.id} value={opcion.id}>
                                {opcion.name} — S/ {(Number(opcion.precioCompra) || 0).toFixed(2)}
                              </option>
                            ))}
                          </select>
                          {product.proveedor && (
                            <span className="cotizaciones-proveedor-detalle">
                              {product.proveedor.tipo || "Proveedor"} ·{" "}
                              {product.proveedor.plazoDias ?? "-"} días
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="cotizaciones-proveedor-detalle">
                          Sin cotizaciones disponibles
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.precioCompra || 0}
                      onChange={(event) =>
                        onPrecioCompraChange(product.id, event.target.value)
                      }
                      className="cotizaciones-input cotizaciones-input-precio"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.price}
                      onChange={(event) =>
                        onPriceChange(product.id, event.target.value)
                      }
                      className="cotizaciones-input cotizaciones-input-precio"
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>
                      S/ {((Number(product.quantity) || 0) * (Number(product.price) || 0)).toFixed(2)}
                    </div>
                    {product.proveedor && (
                      <span
                        className={
                          margen >= 0
                            ? "cotizaciones-margen-positivo"
                            : "cotizaciones-margen-negativo"
                        }
                      >
                        Margen {margen.toFixed(2)}%
                      </span>
                    )}
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
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

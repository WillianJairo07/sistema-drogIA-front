import { useEffect, useState } from "react";

const IGV_RATE = 0.18;

export function PurchaseOrderForm({
  suppliers,
  products,
  request,
  onSave,
  onCancel,
}) {
  const [supplierId, setSupplierId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!request) {
      setItems([]);
      return;
    }

    const product = products.find(
      (item) => item.id === request.productId
    );

    if (!product) {
      return;
    }

    const unitPrice = Number(product.price) || 0;
    const reqQuantity = Number(request.quantity) || 1;

    setItems([
      {
        productId: product.id,
        product: product.name,
        unit: product.unit || product.unidadMedida || "UNIDAD",
        quantity: reqQuantity,
        price: unitPrice,
        subtotal: reqQuantity * unitPrice,
      },
    ]);
  }, [request, products]);

  const handleAddProduct = () => {
    if (!selectedProductId) {
      setError("Selecciona un producto.");
      return;
    }

    const product = products.find(
      (item) => item.id === Number(selectedProductId)
    );

    if (!product) {
      setError("Producto no encontrado.");
      return;
    }

    const productQuantity = Number(quantity);

    if (!productQuantity || productQuantity <= 0) {
      setError("Ingresa una cantidad válida.");
      return;
    }

    const unitPrice = Number(product.price) || 0;
    const unit = product.unit || product.unidadMedida || "UNIDAD";

    const existingItem = items.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      setItems((currentItems) =>
        currentItems.map((item) => {
          const nextQuantity = item.quantity + productQuantity;
          return item.productId === product.id
            ? {
                ...item,
                unit: item.unit || unit,
                quantity: nextQuantity,
                subtotal: nextQuantity * item.price,
              }
            : item;
        })
      );
    } else {
      setItems((currentItems) => [
        ...currentItems,
        {
          productId: product.id,
          product: product.name,
          unit,
          quantity: productQuantity,
          price: unitPrice,
          subtotal: productQuantity * unitPrice,
        },
      ]);
    }

    setSelectedProductId("");
    setQuantity("");
    setError("");
  };

  const handleRemoveProduct = (productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId)
    );
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.subtotal) || 0),
    0
  );
  const igv = subtotal * IGV_RATE;
  const total = subtotal + igv;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!supplierId) {
      setError("Selecciona un proveedor.");
      return;
    }

    if (items.length === 0) {
      setError("Agrega al menos un producto.");
      return;
    }

    const supplier = suppliers.find(
      (item) => item.id === Number(supplierId)
    );

    const normalizedItems = items.map((item, index) => ({
      ...item,
      item: index + 1,
      unit: item.unit || "UNIDAD",
      subtotal: (Number(item.quantity) || 0) * (Number(item.price) || 0),
    }));

    onSave({
      id: Date.now(),
      number: `OC-${Date.now().toString().slice(-6)}`,
      supplier,
      date: new Date().toLocaleDateString("es-PE"),
      items: normalizedItems,
      subtotal,
      igv,
      total,
      status: "Pendiente",
      requestIds: request ? [request.id] : [],
      saleNumber: request?.saleNumber || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="ordenes-card">
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#17324c", margin: 0 }}>
          Nueva Orden de Compra
        </h3>

        <p className="ordenes-header-subtitle">
          Registra los productos que se solicitarán al proveedor.
        </p>
      </div>

      {request && (
        <div className="ordenes-request-box">
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#334155", margin: 0 }}>
            Solicitud de venta (cotización aceptada)
          </p>

          <p style={{ marginTop: "4px", fontSize: "14px", color: "#64748b", marginBottom: 0 }}>
            {request.saleNumber} · {request.product} · {request.quantity} unidades
          </p>
        </div>
      )}

      <div style={{ marginTop: "24px" }}>
        <label className="ordenes-label">Proveedor</label>

        <select
          value={supplierId}
          onChange={(event) => setSupplierId(event.target.value)}
          className="ordenes-select"
        >
          <option value="">Seleccionar proveedor...</option>

          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name} - RUC {supplier.document}
            </option>
          ))}
        </select>
      </div>

      <div className="ordenes-add-grid">
        <div>
          <label className="ordenes-label">Producto</label>

          <select
            value={selectedProductId}
            onChange={(event) =>
              setSelectedProductId(event.target.value)
            }
            className="ordenes-select"
          >
            <option value="">Seleccionar producto...</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="ordenes-label">Cant. requerida</label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="Cant. requerida"
            className="ordenes-input"
          />
        </div>

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            type="button"
            onClick={handleAddProduct}
            className="ordenes-btn-outline"
          >
            Agregar
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <>
          <div className="ordenes-table-wrapper">
            <table className="ordenes-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Cant. requerida</th>
                  <th>Unidad de medida</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th style={{ textAlign: "right" }}>Acción</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <tr key={item.productId}>
                    <td style={{ fontWeight: 500, color: "#334155" }}>
                      {index + 1}
                    </td>

                    <td style={{ color: "#64748b" }}>
                      {item.quantity}
                    </td>

                    <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                      {item.unit || "UNIDAD"}
                    </td>

                    <td style={{ fontWeight: 500, color: "#334155" }}>
                      {item.product}
                    </td>

                    <td style={{ whiteSpace: "nowrap", color: "#64748b" }}>
                      S/ {(Number(item.price) || 0).toFixed(2)}
                    </td>

                    <td style={{ whiteSpace: "nowrap", fontWeight: 500, color: "#334155" }}>
                      S/ {(Number(item.subtotal) || 0).toFixed(2)}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveProduct(item.productId)
                        }
                        style={{
                          background: "none",
                          border: "none",
                          color: "#dc2626",
                          fontSize: "14px",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                minWidth: "240px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "12px 16px",
                display: "grid",
                gap: "6px",
                fontSize: "14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Subtotal:</span>
                <strong>S/ {subtotal.toFixed(2)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>IGV (18%):</span>
                <strong>S/ {igv.toFixed(2)}</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "16px",
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "6px",
                }}
              >
                <span style={{ color: "#17324c", fontWeight: 700 }}>Total:</span>
                <strong style={{ color: "#17324c" }}>S/ {total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </>
      )}

      {error && <p className="ordenes-error-text">{error}</p>}

      <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          type="button"
          onClick={onCancel}
          className="ordenes-btn-secondary"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="ordenes-btn-primary"
          style={{
            backgroundColor: "#17324c",
            borderColor: "#17324c",
            color: "#ffffff",
          }}
        >
          Registrar Orden
        </button>
      </div>
    </form>
  );
}
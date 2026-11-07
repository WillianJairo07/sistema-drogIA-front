import { useEffect, useState } from "react";


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

    setItems([
      {
        productId: product.id,
        product: product.name,
        quantity: request.quantity,
        price: product.price,
        subtotal: request.quantity * product.price,
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

    const productQuantity = Number(quantity);

    if (!productQuantity || productQuantity <= 0) {
      setError("Ingresa una cantidad válida.");
      return;
    }

    const existingItem = items.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + productQuantity,
                subtotal:
                  (item.quantity + productQuantity) * item.price,
              }
            : item
        )
      );
    } else {
      setItems((currentItems) => [
        ...currentItems,
        {
          productId: product.id,
          product: product.name,
          quantity: productQuantity,
          price: product.price,
          subtotal: productQuantity * product.price,
        },
      ]);
    }

    setSelectedProductId("");
    setQuantity("");
    setError("");
  };

  const handleRemoveProduct = (productId) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.productId !== productId
      )
    );
  };

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

    const total = items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    onSave({
      id: Date.now(),
      number: `OC-${Date.now().toString().slice(-6)}`,
      supplier,
      date: new Date().toLocaleDateString("es-PE"),
      items,
      total,
      status: "Pendiente",
      requestIds: request ? [request.id] : [],
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
            Solicitud de venta
          </p>

          <p style={{ marginTop: "4px", fontSize: "14px", color: "#64748b", margin: 0 }}>
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
          <label className="ordenes-label">Cantidad</label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="Cantidad"
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
        <div className="ordenes-table-wrapper">
          <table className="ordenes-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th style={{ textAlign: "right" }}>Acción</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.productId}>
                  <td style={{ fontWeight: 500, color: "#334155" }}>
                    {item.product}
                  </td>

                  <td style={{ color: "#64748b" }}>
                    {item.quantity}
                  </td>

                  <td style={{ whiteSpace: "nowrap", color: "#64748b" }}>
                    S/ {item.price.toFixed(2)}
                  </td>

                  <td style={{ whiteSpace: "nowrap", fontWeight: 500, color: "#334155" }}>
                    S/ {item.subtotal.toFixed(2)}
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveProduct(item.productId)
                      }
                      style={{ background: "none", border: "none", color: "#dc2626", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        >
          Registrar Orden
        </button>
      </div>
    </form>
  );
}
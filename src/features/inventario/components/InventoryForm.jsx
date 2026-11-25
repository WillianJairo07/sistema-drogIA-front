import { useEffect, useState } from "react";

export function InventoryForm({
  initialItem = null,
  purchaseOrders = [],
  onSave,
  onCancel,
}) {
  const [product, setProduct] = useState(initialItem?.product || "");
  const [purchaseOrderCode, setPurchaseOrderCode] = useState(
    initialItem?.purchaseOrderCode || ""
  );
  const [lot, setLot] = useState(initialItem?.lot || "");
  const [stock, setStock] = useState(
    initialItem?.stock !== undefined ? String(initialItem.stock) : ""
  );
  const [minimumStock, setMinimumStock] = useState(
    initialItem?.minimumStock !== undefined
      ? String(initialItem.minimumStock)
      : "10"
  );
  const [expiration, setExpiration] = useState(initialItem?.expiration || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setProduct(initialItem?.product || "");
    setPurchaseOrderCode(initialItem?.purchaseOrderCode || "");
    setLot(initialItem?.lot || "");
    setStock(initialItem?.stock !== undefined ? String(initialItem.stock) : "");
    setMinimumStock(
      initialItem?.minimumStock !== undefined
        ? String(initialItem.minimumStock)
        : "10"
    );
    setExpiration(initialItem?.expiration || "");
    setError("");
  }, [initialItem]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!product.trim()) {
      setError("Ingresa el nombre del producto.");
      return;
    }

    if (!purchaseOrderCode.trim()) {
      setError("Ingresa o selecciona el código de orden de compra.");
      return;
    }

    const stockNum = Number(stock);
    if (Number.isNaN(stockNum) || stockNum < 0) {
      setError("Ingresa un stock válido.");
      return;
    }

    const minStockNum = Number(minimumStock);
    if (Number.isNaN(minStockNum) || minStockNum < 0) {
      setError("Ingresa un stock mínimo válido.");
      return;
    }

    onSave({
      id: initialItem?.id ?? Date.now(),
      product: product.trim(),
      purchaseOrderCode: purchaseOrderCode.trim(),
      lot: lot.trim() || `LOT-${String(Date.now()).slice(-4)}`,
      stock: stockNum,
      minimumStock: minStockNum,
      expiration: expiration || "2027-12-31",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="inventario-card">
      <div className="inventario-form-body">
        <h3 className="inventario-form-title">
          {initialItem
            ? `Editar Inventario — ${initialItem.product}`
            : "Registrar en Inventario"}
        </h3>

        <div className="inventario-form-grid">
          <div className="inventario-field">
            <label className="inventario-label">Producto</label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Ej. Paracetamol 500 mg"
              className="inventario-input"
            />
          </div>

          <div className="inventario-field">
            <label className="inventario-label">Código de Orden de Compra</label>
            <input
              type="text"
              list="purchase-order-codes"
              value={purchaseOrderCode}
              onChange={(e) => setPurchaseOrderCode(e.target.value)}
              placeholder="Ej. OC-000101"
              className="inventario-input"
            />
            <datalist id="purchase-order-codes">
              {purchaseOrders.map((oc) => (
                <option key={oc.id} value={oc.number}>
                  {oc.number} — {oc.supplier?.name || ""}
                </option>
              ))}
            </datalist>
          </div>

          <div className="inventario-field">
            <label className="inventario-label">Lote</label>
            <input
              type="text"
              value={lot}
              onChange={(e) => setLot(e.target.value)}
              placeholder="Ej. LOT-PAR-001"
              className="inventario-input"
            />
          </div>

          <div className="inventario-field">
            <label className="inventario-label">Stock</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              className="inventario-input"
            />
          </div>

          <div className="inventario-field">
            <label className="inventario-label">Stock mínimo</label>
            <input
              type="number"
              min="0"
              value={minimumStock}
              onChange={(e) => setMinimumStock(e.target.value)}
              placeholder="10"
              className="inventario-input"
            />
          </div>

          <div className="inventario-field">
            <label className="inventario-label">Vencimiento</label>
            <input
              type="date"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              className="inventario-input"
            />
          </div>
        </div>

        {error && <p className="inventario-error">{error}</p>}

        <div className="inventario-form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="inventario-btn-secondary"
          >
            Cancelar
          </button>
          <button type="submit" className="inventario-btn-primary">
            {initialItem ? "Guardar Cambios" : "Agregar al Inventario"}
          </button>
        </div>
      </div>
    </form>
  );
}
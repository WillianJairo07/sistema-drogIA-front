import { useState } from "react";

export function DespachoForm({ inventory = [], onSave, onCancel }) {
  const [thirdPartyName, setThirdPartyName] = useState("");
  const [thirdPartyDoc, setThirdPartyDoc] = useState("");
  const [guideCode, setGuideCode] = useState("");
  const [product, setProduct] = useState(inventory[0]?.product || "");
  const [purchaseOrderCode, setPurchaseOrderCode] = useState(
    inventory[0]?.purchaseOrderCode || ""
  );
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");

  const handleProductSelect = (value) => {
    setProduct(value);
    const matched = inventory.find((inv) => inv.product === value);
    if (matched?.purchaseOrderCode) {
      setPurchaseOrderCode(matched.purchaseOrderCode);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!thirdPartyName.trim()) {
      setError("Ingresa el nombre o razón social del tercerizador.");
      return;
    }

    if (!product.trim()) {
      setError("Selecciona o ingresa un producto a despachar.");
      return;
    }

    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      setError("Ingresa una cantidad válida.");
      return;
    }

    onSave({
      id: Date.now(),
      code: guideCode.trim() || `DESP-${String(Date.now()).slice(-5)}`,
      thirdPartyName: thirdPartyName.trim(),
      thirdPartyDoc: thirdPartyDoc.trim() || "—",
      product: product.trim(),
      purchaseOrderCode: purchaseOrderCode.trim() || "—",
      quantity: qty,
      date,
      status: "Programado",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="despacho-card">
      <h3 className="despacho-card-title">Nuevo Despacho a Tercerizador</h3>

      <div className="despacho-form-grid">
        <div className="despacho-field">
          <label className="despacho-label">Tercerizador</label>
          <input
            type="text"
            value={thirdPartyName}
            onChange={(e) => setThirdPartyName(e.target.value)}
            placeholder="Ej. Operador Logístico Sur S.A.C."
            className="despacho-input"
          />
        </div>

        <div className="despacho-field">
          <label className="despacho-label">RUC / Documento tercerizador</label>
          <input
            type="text"
            value={thirdPartyDoc}
            onChange={(e) => setThirdPartyDoc(e.target.value)}
            placeholder="Ej. 20543210987"
            className="despacho-input"
          />
        </div>

        <div className="despacho-field">
          <label className="despacho-label">Guía / Código de despacho</label>
          <input
            type="text"
            value={guideCode}
            onChange={(e) => setGuideCode(e.target.value)}
            placeholder="Ej. T001-00045"
            className="despacho-input"
          />
        </div>

        <div className="despacho-field">
          <label className="despacho-label">Producto</label>
          <input
            type="text"
            list="dispatch-products"
            value={product}
            onChange={(e) => handleProductSelect(e.target.value)}
            placeholder="Selecciona o escribe el producto"
            className="despacho-input"
          />
          <datalist id="dispatch-products">
            {inventory.map((inv) => (
              <option key={inv.id} value={inv.product} />
            ))}
          </datalist>
        </div>

        <div className="despacho-field">
          <label className="despacho-label">Código Orden de Compra</label>
          <input
            type="text"
            value={purchaseOrderCode}
            onChange={(e) => setPurchaseOrderCode(e.target.value)}
            placeholder="Ej. OC-000101"
            className="despacho-input"
          />
        </div>

        <div className="despacho-field">
          <label className="despacho-label">Cantidad</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            className="despacho-input"
          />
        </div>

        <div className="despacho-field">
          <label className="despacho-label">Fecha de despacho</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="despacho-input"
          />
        </div>
      </div>

      {error && <p className="despacho-error">{error}</p>}

      <div className="despacho-actions">
        <button
          type="button"
          onClick={onCancel}
          className="despacho-btn-secondary"
        >
          Cancelar
        </button>
        <button type="submit" className="despacho-btn-primary">
          Registrar Despacho
        </button>
      </div>
    </form>
  );
}
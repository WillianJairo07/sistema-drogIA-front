import { useEffect, useState } from "react";

function limitar(texto, limite = 180) {
  const valor = String(texto || "");
  return valor.length > limite ? `${valor.slice(0, limite - 3)}...` : valor;
}

export function DespachoForm({
  pedidos = [],
  inventory = [],
  pedidoIdInicial = "",
  inventarioInicial = null,
  onSave,
  onCancel,
}) {
  const modoInventario = Boolean(inventarioInicial?.purchaseOrderCode);

  const pedidosDisponibles = pedidos.filter(
    (pedido) => !pedido.despachoId && pedido.status !== "Entregado"
  );

  const [pedidoId, setPedidoId] = useState(
    modoInventario ? "" : pedidoIdInicial || pedidosDisponibles[0]?.id || ""
  );
  const [thirdPartyName, setThirdPartyName] = useState("");
  const [thirdPartyDoc, setThirdPartyDoc] = useState("");
  const [numeroGuia, setNumeroGuia] = useState("");
  const [courierEmpresa, setCourierEmpresa] = useState("");
  const [courierServicio, setCourierServicio] = useState("");
  const [costoEnvio, setCostoEnvio] = useState("");
  const [product, setProduct] = useState(
    modoInventario ? inventarioInicial.product || "" : ""
  );
  const [purchaseOrderCode, setPurchaseOrderCode] = useState(
    modoInventario ? inventarioInicial.purchaseOrderCode || "" : ""
  );
  const [quantity, setQuantity] = useState(
    modoInventario ? String(inventarioInicial.quantity ?? "") : ""
  );
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");

  const pedido = modoInventario
    ? null
    : pedidosDisponibles.find(
        (item) => String(item.id) === String(pedidoId)
      ) || null;
  const esCourier =
    String(
      modoInventario
        ? inventarioInicial.tipoDespacho || "LOCAL"
        : pedido?.tipoDespacho || "LOCAL"
    ).toUpperCase() === "COURIER";

  useEffect(() => {
    if (modoInventario) return;
    if (
      pedidoIdInicial &&
      pedidosDisponibles.some(
        (item) => String(item.id) === String(pedidoIdInicial)
      )
    ) {
      setPedidoId(pedidoIdInicial);
      return;
    }
    if (!pedidoId && pedidosDisponibles.length > 0) {
      setPedidoId(pedidosDisponibles[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedidoIdInicial, pedidoId, pedidosDisponibles.length]);

  useEffect(() => {
    if (!pedido) {
      return;
    }
    const nombreProducto = pedido.product || "";
    const coincidencia = inventory.find(
      (item) => item.product === nombreProducto
    );
    setProduct(nombreProducto);
    setQuantity(String(pedido.quantity || ""));
    setPurchaseOrderCode(
      pedido.orderNumber || coincidencia?.purchaseOrderCode || ""
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedido?.id]);

  useEffect(() => {
    if (!modoInventario) return;
    setProduct(inventarioInicial.product || "");
    setPurchaseOrderCode(inventarioInicial.purchaseOrderCode || "");
    setQuantity(String(inventarioInicial.quantity ?? ""));
    setError("");
  }, [modoInventario, inventarioInicial]);

  const handlePedidoSelect = (value) => {
    setPedidoId(value);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!modoInventario && !pedido) {
      setError("Selecciona un pedido de almacén.");
      return;
    }
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

    if (esCourier && (!courierEmpresa.trim() || !numeroGuia.trim())) {
      setError("Para courier se requieren la empresa y el número de guía.");
      return;
    }

    const tipoDespacho = modoInventario
      ? inventarioInicial.tipoDespacho || "LOCAL"
      : pedido.tipoDespacho || "LOCAL";

    onSave({
      id: Date.now(),
      pedidoId: modoInventario ? null : pedido.id,
      tipoDespacho,
      code: esCourier
        ? numeroGuia.trim()
        : `DESP-${String(Date.now()).slice(-5)}`,
      thirdPartyName: thirdPartyName.trim(),
      thirdPartyDoc: thirdPartyDoc.trim() || null,
      product: limitar(product.trim()),
      purchaseOrderCode: purchaseOrderCode.trim() || null,
      quantity: qty,
      date,
      courierEmpresa: esCourier ? courierEmpresa.trim() : null,
      courierServicio: esCourier ? courierServicio.trim() : null,
      numeroGuia: esCourier ? numeroGuia.trim() : null,
      costoEnvio:
        esCourier && costoEnvio !== "" ? Number(costoEnvio) : null,
      status: "Programado",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="despacho-card">
      <h3 className="despacho-card-title">
        {modoInventario
          ? "Nuevo Despacho desde Inventario"
          : "Nuevo Despacho desde Pedido de Almacén"}
      </h3>

      {modoInventario && (
        <p
          style={{
            fontSize: "12px",
            color: "#64748b",
            margin: "-4px 0 16px",
          }}
        >
          Se despachará el stock real registrado para {purchaseOrderCode}. El
          backend conserva el detalle de lotes en Inventario y dejará la orden
          en cero al registrar el despacho.
        </p>
      )}

      {!modoInventario && (pedido?.products?.length || 0) > 1 && (
        <p
          style={{
            fontSize: "12px",
            color: "#b45309",
            margin: "-4px 0 16px",
          }}
        >
          El backend registra un solo producto por despacho. Se resumirán{" "}
          {pedido.products.length} productos del pedido en una sola línea.
        </p>
      )}

      {!modoInventario && pedidosDisponibles.length === 0 && (
        <p className="despacho-error">
          No hay pedidos disponibles para despachar.
        </p>
      )}

      <div className="despacho-form-grid">
        {modoInventario ? (
          <div className="despacho-field">
            <label className="despacho-label">Orden de compra</label>
            <input
              type="text"
              value={purchaseOrderCode}
              readOnly
              className="despacho-input"
            />
          </div>
        ) : (
          <div className="despacho-field">
            <label className="despacho-label">Pedido de almacén</label>
            <select
              value={pedidoId}
              onChange={(event) => handlePedidoSelect(event.target.value)}
              className="despacho-input"
            >
              <option value="">Seleccionar pedido...</option>
              {pedidosDisponibles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.number || `#${item.id}`} — {item.tipoDespacho || "LOCAL"}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="despacho-field">
          <label className="despacho-label">Tipo de despacho</label>
          <input
            type="text"
            value={esCourier ? "COURIER" : "LOCAL"}
            readOnly
            className="despacho-input"
          />
        </div>

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
          <label className="despacho-label">Producto</label>
          <input
            type="text"
            list="dispatch-products"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Selecciona o escribe el producto"
            className="despacho-input"
          />
          <datalist id="dispatch-products">
            {inventory.map((inv) => (
              <option key={inv.id} value={inv.product} />
            ))}
          </datalist>
        </div>

        {!modoInventario && (
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
        )}

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

        {esCourier && (
          <>
            <div className="despacho-field">
              <label className="despacho-label">Empresa courier</label>
              <input
                type="text"
                value={courierEmpresa}
                onChange={(e) => setCourierEmpresa(e.target.value)}
                placeholder="Ej. Peru Express"
                className="despacho-input"
              />
            </div>

            <div className="despacho-field">
              <label className="despacho-label">Servicio courier</label>
              <input
                type="text"
                value={courierServicio}
                onChange={(e) => setCourierServicio(e.target.value)}
                placeholder="Ej. Entrega nacional"
                className="despacho-input"
              />
            </div>

            <div className="despacho-field">
              <label className="despacho-label">Número de guía</label>
              <input
                type="text"
                value={numeroGuia}
                onChange={(e) => setNumeroGuia(e.target.value)}
                placeholder="Ej. T001-00045"
                className="despacho-input"
              />
            </div>

            <div className="despacho-field">
              <label className="despacho-label">Costo de envío</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={costoEnvio}
                onChange={(e) => setCostoEnvio(e.target.value)}
                placeholder="0.00"
                className="despacho-input"
              />
            </div>
          </>
        )}
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

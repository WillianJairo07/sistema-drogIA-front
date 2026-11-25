import { useEffect, useState } from "react";
import { CotizacionItems } from "./CotizacionItems";
import { ProductSearch } from "../../productos/components/ProductSearch";
import { ClientSearch } from "../../clientes/components/ClientSearch";

const IGV_RATE = 0.18;

export function CotizacionForm({ initialQuote = null, onCancel, onGenerate }) {
  const [client, setClient] = useState(initialQuote?.client || null);
  const [date, setDate] = useState(initialQuote?.date || "");
  const [products, setProducts] = useState(initialQuote?.products || []);
  const [error, setError] = useState("");

  useEffect(() => {
    setClient(initialQuote?.client || null);
    setDate(initialQuote?.date || "");
    setProducts(initialQuote?.products || []);
    setError("");
  }, [initialQuote]);

  const addProduct = (product) => {
    setError("");
    setProducts((currentProducts) => {
      const existingProduct = currentProducts.find(
        (item) => item.id === product.id
      );
      if (existingProduct) {
        return currentProducts.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...currentProducts,
        {
          ...product,
          unit: product.unit || product.unidadMedida || "UNIDAD",
          quantity: 1,
          price: Number(product.price) || 0,
        },
      ];
    });
  };

  const increaseQuantity = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const removeProduct = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId)
    );
  };

  const changePrice = (productId, price) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? { ...product, price: Number(price) || 0 }
          : product
      )
    );
  };

  const subtotal = products.reduce(
    (sum, product) =>
      sum + (Number(product.quantity) || 0) * (Number(product.price) || 0),
    0
  );
  const igv = subtotal * IGV_RATE;
  const total = subtotal + igv;

  const handleGenerate = () => {
    if (!client) {
      setError("Selecciona un cliente para continuar.");
      return;
    }
    if (!date) {
      setError("Selecciona una fecha para continuar.");
      return;
    }
    if (products.length === 0) {
      setError("Agrega al menos un producto para continuar.");
      return;
    }

    const quote = {
      id: initialQuote?.id ?? Date.now(),
      number: initialQuote?.number ?? `COT-${String(Date.now()).slice(-4)}`,
      status: initialQuote?.status ?? "Pendiente",
      casoId: initialQuote?.casoId ?? null,
      destino: initialQuote?.destino ?? null,
      proveedores: initialQuote?.proveedores ?? [],
      client,
      date,
      products: products.map((product, index) => ({
        ...product,
        item: index + 1,
        unit: product.unit || product.unidadMedida || "UNIDAD",
      })),
      subtotal,
      igv,
      total,
    };

    onGenerate(quote);
  };

  return (
    <div className="cotizaciones-card">
      <div>
        <h3 className="cotizaciones-card-title">
          {initialQuote?.number
            ? `Editar Cotización ${initialQuote.number}`
            : "Nueva Cotización"}
        </h3>
        <p className="cotizaciones-header-subtitle">
          {initialQuote?.number
            ? "Ajusta los datos, cantidades o precios antes de guardar o enviar."
            : "Registra los datos del cliente y los productos solicitados."}
        </p>
      </div>

      <div className="cotizaciones-form-grid">
        <div>
          <label className="cotizaciones-label">Cliente</label>
          <ClientSearch onSelect={setClient} />
          {client && (
            <p style={{ marginTop: "8px", fontSize: "14px", color: "#475569" }}>
              Cliente seleccionado: {client.name}
              {client.email ? ` (${client.email})` : ""}
            </p>
          )}
        </div>

        <div>
          <label className="cotizaciones-label">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="cotizaciones-input"
          />
        </div>
      </div>

      <div style={{ marginTop: "32px" }}>
        <div style={{ marginBottom: "16px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#17324c", margin: 0 }}>
            Productos
          </h4>
          <p className="cotizaciones-header-subtitle">
            Busca y agrega los productos solicitados por el cliente.
          </p>
        </div>

        <ProductSearch onSelect={addProduct} />

        <CotizacionItems
          products={products}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          onRemove={removeProduct}
          onPriceChange={changePrice}
        />
      </div>

      <div className="cotizaciones-total-box">
        <div className="cotizaciones-total-card" style={{ display: "grid", gap: "8px", minWidth: "240px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#475569" }}>Subtotal</span>
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#17324c" }}>
              S/ {subtotal.toFixed(2)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#475569" }}>IGV (18%)</span>
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#17324c" }}>
              S/ {igv.toFixed(2)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#17324c" }}>Total</span>
            <span style={{ fontSize: "18px", fontWeight: 700, color: "#17324c" }}>
              S/ {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {error && <p className="cotizaciones-error-text">{error}</p>}

      <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          type="button"
          onClick={onCancel}
          className="cotizaciones-btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          className="cotizaciones-btn-primary"
        >
          {initialQuote?.number ? "Guardar Cambios" : "Generar Cotización"}
        </button>
      </div>
    </div>
  );
}
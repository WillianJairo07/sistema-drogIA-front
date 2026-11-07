import { useState } from "react";
import { CotizacionItems } from "./CotizacionItems";
import { ProductSearch } from "../../productos/components/ProductSearch";
import { ClientSearch } from "../../clientes/components/ClientSearch";

export function CotizacionForm({ onCancel, onGenerate }) {
  const [client, setClient] = useState(null);
  const [date, setDate] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

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
      return [...currentProducts, { ...product, quantity: 1 }];
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
          ? { ...product, price: Number(price) }
          : product
      )
    );
  };

  const total = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0
  );

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
      id: Date.now(),
      number: `COT-${String(Date.now()).slice(-4)}`,
      client,
      date,
      products,
      total,
    };

    onGenerate(quote);
  };

  return (
    <div className="cotizaciones-card">
      <div>
        <h3 className="cotizaciones-card-title">Nueva Cotización</h3>
        <p className="cotizaciones-header-subtitle">
          Registra los datos del cliente y los productos solicitados.
        </p>
      </div>

      <div className="cotizaciones-form-grid">
        <div>
          <label className="cotizaciones-label">Cliente</label>
          <ClientSearch onSelect={setClient} />
          {client && (
            <p style={{ marginTop: "8px", fontSize: "14px", color: "#475569" }}>
              Cliente seleccionado: {client.name}
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
        <div className="cotizaciones-total-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}>Total</span>
            <span style={{ fontSize: "18px", fontWeight: 600, color: "#17324c" }}>
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
          Generar Cotización
        </button>
      </div>
    </div>
  );
}
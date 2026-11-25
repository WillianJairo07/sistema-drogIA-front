import { useEffect, useState } from "react";
import { buscarProductos } from "../services/productoService";

export function ProductSearch({ onSelect }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    buscarProductos("")
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const filteredProducts = products.filter((product) => {
    const value = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(value) ||
      product.lot.toLowerCase().includes(value) ||
      product.healthRegistration.toLowerCase().includes(value)
    );
  });

  return (
    <div className="product-search-wrapper">
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar por nombre, lote o registro sanitario..."
        className="productos-input"
      />

      {search && (
        <div className="product-dropdown-menu">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  onSelect(product);
                  setSearch("");
                }}
                className="product-dropdown-item"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ fontWeight: 500, color: "#334155" }}>
                    {product.name}
                  </span>

                  <span style={{ fontWeight: 600, color: "#17324c" }}>
                    S/ {product.price.toFixed(2)}
                  </span>
                </div>

                <div style={{ marginTop: "4px", display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "12px", color: "#64748b" }}>
                  <span>Lote: {product.lot}</span>
                  <span>Registro: {product.healthRegistration}</span>
                  <span>Stock: {product.stock}</span>
                  <span>Vence: {product.expiration}</span>
                </div>
              </button>
            ))
          ) : (
            <p style={{ padding: "12px 16px", fontSize: "14px", color: "#64748b", margin: 0 }}>
              No se encontraron productos.
            </p>
          )}
        </div>
      )}
    </div>
  );
}